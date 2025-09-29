# Observability Setup

This project is configured to send logs to Grafana Loki for observability and monitoring.

## 🚀 Quick Start

### 1. Start the Observability Stack

```bash
# Start Loki and Grafana
./start-observability.sh

# Or manually:
docker-compose -f docker-compose.observability.yml up -d
```

### 2. Configure Environment Variables

```bash
# Set environment variables
export LOKI_HOST=http://localhost:3100
export NODE_ENV=production  # Use Loki logger in production
```

### 3. Start Your Application

```bash
# Development (uses console logger)
NODE_ENV=development npm run start:dev

# Production (uses Loki logger)
NODE_ENV=production npm run start:prod
```

## 📊 Accessing Grafana

- **URL**: http://localhost:3000
- **Username**: admin
- **Password**: admin

## 🔍 Viewing Logs

1. Go to Grafana → Explore
2. Select "Loki" as data source
3. Use these queries:

```logql
# All logs
{job="nest-microservices"}

# Logs by traceId
{job="nest-microservices"} |= "trace_123"

# Error logs only
{job="nest-microservices"} |= "error"

# Logs from specific service
{job="nest-microservices", context="MathController"}
```

## 📈 Dashboard Queries

### Request Duration
```logql
rate({job="nest-microservices"} |= "duration" | json | unwrap duration [5m])
```

### Error Rate
```logql
rate({job="nest-microservices"} |= "error" [5m])
```

### Trace Analysis
```logql
{job="nest-microservices"} |= "traceId" | json | line_format "{{.traceId}} - {{.message}}"
```

## 🛠️ Configuration

### Loki Configuration
- **File**: `loki-config.yaml`
- **Port**: 3100
- **Storage**: Local filesystem

### Promtail Configuration
- **File**: `promtail-config.yaml`
- **Port**: 9080
- **Collects**: Application logs

### Application Logger
- **File**: `src/common/logger/loki.logger.ts`
- **Transport**: Winston + Loki
- **Format**: JSON with structured data

## 🎯 Features

- ✅ **Structured Logging**: JSON format with traceId, context, and metadata
- ✅ **Distributed Tracing**: TraceId propagation across microservices
- ✅ **Real-time Monitoring**: Live log streaming to Grafana
- ✅ **Query Interface**: Powerful LogQL queries for log analysis
- ✅ **Dashboard Ready**: Pre-configured for observability dashboards

## 🛑 Stopping Services

```bash
docker-compose -f docker-compose.observability.yml down
```
