/* eslint-disable no-undef */

const express = require("express");
const { Pool } = require("pg");
const redis = require("redis");
const cors = require("cors");

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// PostgreSQL
const pool = new Pool({
  // eslint-disable-next-line no-undef
  connectionString:
    process.env.DATABASE_URL,
});

// Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.connect().catch(console.error);

// Inicializar DB
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id SERIAL PRIMARY KEY,
        count INTEGER DEFAULT 0
      )
    `);

    const result = await pool.query("SELECT COUNT(*) FROM counter");
    if (result.rows[0].count === "0") {
      await pool.query("INSERT INTO counter (count) VALUES (0)");
      console.log("Base de datos inicializada");
    }
  } catch (err) {
    console.error("Error inicializando DB:", err);
  }
}

initDB();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Obtener contador
app.get("/api/count", async (req, res) => {
  try {
    // Intentar obtener de cache
    const cached = await redisClient.get("counter");

    if (cached) {
      return res.json({ count: parseInt(cached), cached: true });
    }

    // Si no está en cache, obtener de DB
    const result = await pool.query("SELECT count FROM counter WHERE id = 1");
    const count = result.rows[0].count;

    // Guardar en cache por 30 segundos
    await redisClient.setEx("counter", 30, count.toString());

    res.json({ count, cached: false });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error obteniendo contador" });
  }
});

// Incrementar contador
app.post("/api/increment", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE counter SET count = count + 1 WHERE id = 1 RETURNING count"
    );
    const count = result.rows[0].count;

    // Invalidar cache
    await redisClient.del("counter");

    res.json({ count });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error incrementando contador" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
});
