# Proyecto Docker Full-Stack

## Descripción
Aplicación web con React, Node.js, PostgreSQL y Redis para el caché, containerizada con Docker con multi stage build y health checks.

## 📋 Requisitos

- Docker
- Docker Compose

## Inicio Rápido

### 1. Clonar y configurar

```bash
# Crear archivo .env en la raíz
cp .env.example .env
```

### 2. Configurar variables de entorno


Crear un archivo `.env` en la raíz del proyecto con las credenciales:

```env
# PostgreSQL
DB_NAME=
DB_USER=
DB_PASSWORD=

# API
DATABASE_URL=postgresql://user:password@db:5432/app
REDIS_URL=redis://redis:6379
NODE_ENV=production
```

### 3. Iniciar aplicación

```bash
# Construir y levantar todos los servicios
docker-compose -f docker-compose.prod.yml up --build

```

### 4. Acceder

- **Frontend:** http://localhost
- **API Health:** http://localhost:4000/health

##  Detener aplicación

```bash
# Detener servicios
docker-compose -f docker-compose.prod.yml down

# Detener y eliminar volúmenes (borra datos)
docker-compose -f docker-compose.prod.yml down -v
```

## Base de Datos

### Conectar a PostgreSQL

```bash
# Desde el contenedor
docker-compose -f docker-compose.prod.yml exec db psql -U myuser -d app

# Ver tablas
\dt

# Ver datos del contador
SELECT * FROM counter;
```

### Conectar a Redis

```bash
# Entrar al contenedor de Redis
docker-compose -f docker-compose.prod.yml exec redis redis-cli

# Ver todas las claves
KEYS *

# Ver valor del contador en cache
GET counter
```

## Arquitectura

La aplicación consta de 4 servicios:

1. **Frontend** (React + Nginx)
   - Puerto: 80
   - Sirve la aplicación React
   - Proxy reverso para el API

2. **API** (Node.js + Express)
   - Puerto: 4000
   - Endpoints REST
   - Healthcheck automático

3. **Database** (PostgreSQL)
   - Puerto: 5432 (interno)
   - Almacenamiento persistente con volúmenes

4. **Cache** (Redis)
   - Puerto: 6379 (interno)
   - Cache de 30 segundos para el contador



## Tecnologías

- **Frontend:** React 18, Vite
- **Backend:** Node.js 18, Express
- **Base de datos:** PostgreSQL 13
- **Cache:** Redis 6
- **Servidor web:** Nginx Alpine
- **Containerización:** Docker, Docker Compose

