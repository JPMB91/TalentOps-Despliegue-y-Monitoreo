# Proyecto Docker Full-Stack con Monitoreo

## Descripción
Aplicación web con React, Node.js, PostgreSQL y Redis para caché, containerizada con Docker usando multi-stage builds, health checks y stack completo de monitoreo con Prometheus, Grafana y Alertmanager.

##  Requisitos

- Docker
- Docker Compose
- Cuenta de Slack para recibir alertas

## Inicio Rápido

### 1. Clonar y configurar
```bash
# Crear archivo .env en la raíz
cp .env.example .env
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:
```env
# PostgreSQL
DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=mypassword

# API
DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydb
REDIS_URL=redis://redis:6379
NODE_ENV=production

# Grafana
GRAFANA_USER=user
GRAFANA_PASSWORD=password

# Slack Webhook para alertas
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/WEBHOOK_AQUI
```

### 3. Crear estructura de directorios
```bash
# Crear carpetas necesarias con permisos correctos
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/provisioning/datasources
mkdir -p monitoring/grafana/provisioning/dashboards
mkdir -p monitoring/prometheus
mkdir -p logs

# Asegurar permisos
chmod -R 755 monitoring/
```

### 4. Iniciar aplicación
```bash
# Opción A: Levantar todo junto (recomendado)
docker-compose -f docker-compose.prod.yml -f docker-compose.monitoring.yml up -d --build

# Opción B: Levantar por separado
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.monitoring.yml up -d
```

### 5. Acceder a los servicios

**Aplicación:**
- **Frontend:** http://localhost
- **API Health:** http://localhost:4000/health
- **API Metrics:** http://localhost:4000/metrics

**Monitoreo:**
- **Grafana:** http://localhost:3001 (admin/admin123)
- **Prometheus:** http://localhost:9090
- **Alertmanager:** http://localhost:9093
- **Kibana:** http://localhost:5601
- **Elasticsearch:** http://localhost:9200

## Detener aplicación
```bash
# Detener todos los servicios
docker-compose -f docker-compose.prod.yml -f docker-compose.monitoring.yml down

# Detener y eliminar volúmenes (borra TODOS los datos)
docker-compose -f docker-compose.prod.yml -f docker-compose.monitoring.yml down -v
```


## Monitoreo y Observabilidad

### Métricas disponibles en Prometheus

- `http_requests_total` - Total de peticiones HTTP
- `http_request_duration_seconds` - Duración de peticiones
- `process_resident_memory_bytes` - Uso de memoria
- Métricas por defecto de Node.js (CPU, heap, etc.)

### Dashboards en Grafana

El proyecto incluye un dashboard con:
- Rate de peticiones HTTP
- Duración de peticiones (p50, p95)
- Distribución por status code
- Uso de memoria de Node.js

### Alertas

Las alertas se configuran en `monitoring/alert_rules.yml`:
- **HighErrorRate:** Activada cuando >5% de requests son errores 5xx por 5 minutos
- Las notificaciones se envían a Slack

**Probar alerta manualmente:**
```bash
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '[{
    "labels": {"alertname": "TestAlert", "severity": "critical"},
    "annotations": {"summary": "Prueba de alerta desde Alertmanager"}
  }]'
```

## Base de Datos

### Conectar a PostgreSQL
```bash
# Desde el contenedor
docker-compose -f docker-compose.prod.yml exec db psql -U myuser -d mydb

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

# TTL del cache
TTL counter
```

##  Arquitectura

### Servicios de Aplicación

1. **Frontend** (React + Nginx)
   - Puerto: 80
   - Multi-stage build para optimización
   - Sirve aplicación React compilada

2. **API** (Node.js + Express)
   - Puerto: 4000
   - Endpoints REST con métricas
   - Health check automático
   - Exporta métricas para Prometheus

3. **Database** (PostgreSQL 13)
   - Puerto: 5432 (interno)
   - Almacenamiento persistente

4. **Cache** (Redis 6)
   - Puerto: 6379 (interno)
   - TTL de 30 segundos

### Servicios de Monitoreo

5. **Prometheus**
   - Puerto: 9090
   - Scraping de métricas cada 15s
   - Reglas de alertas configuradas

6. **Grafana**
   - Puerto: 3001
   - Dashboards pre-configurados
   - Datasource Prometheus automático

7. **Alertmanager**
   - Puerto: 9093
   - Notificaciones a Slack
   - Agrupación y deduplicación de alertas

8. **ELK Stack** (Elasticsearch, Logstash, Kibana)
   - Elasticsearch: 9200, 9300
   - Logstash: 5044
   - Kibana: 5601
   - Centralización de logs

##  Tecnologías

**Frontend:**
- React 18
- Vite

**Backend:**
- Node.js 18
- Express
- prom-client (métricas)

**Bases de Datos:**
- PostgreSQL 13
- Redis 6

**Infraestructura:**
- Docker
- Docker Compose
- Nginx Alpine

**Monitoreo:**
- Prometheus
- Grafana
- Alertmanager
- Elasticsearch 7.17
- Logstash 7.17
- Kibana 7.17
