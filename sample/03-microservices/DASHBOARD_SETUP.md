# 🚀 NestJS Microservices Performance Dashboard Setup

## 📊 Manual Dashboard Creation in Grafana

### **Step 1: Access Grafana**
- Go to: http://localhost:3000
- Login: `admin` / `admin` (or anonymous access)

### **Step 2: Create New Dashboard**
1. Click **"+"** → **"Dashboard"**
2. Click **"Add visualization"**

### **Step 3: Add Performance Panels**

#### **Panel 1: Request Rate (Stat)**
- **Query**: `rate({app="nest-microservices"} |= "request_complete" [1m]) * 60`
- **Visualization**: Stat
- **Unit**: Requests/sec
- **Thresholds**: Green < 10, Yellow < 50, Red >= 50

#### **Panel 2: Average Response Time (Stat)**
- **Query**: `avg_over_time({app="nest-microservices"} |= "duration" | json | unwrap duration [5m])`
- **Visualization**: Stat
- **Unit**: Milliseconds
- **Thresholds**: Green < 100ms, Yellow < 500ms, Red >= 500ms

#### **Panel 3: Error Rate (Stat)**
- **Query**: `rate({app="nest-microservices"} |= "error" [5m]) * 100`
- **Visualization**: Stat
- **Unit**: Percent
- **Thresholds**: Green < 1%, Yellow < 5%, Red >= 5%

#### **Panel 4: Request Rate Over Time (Time Series)**
- **Query**: `rate({app="nest-microservices"} |= "request_complete" [1m]) * 60`
- **Visualization**: Time series
- **Legend**: Requests/min

#### **Panel 5: Response Time Percentiles (Time Series)**
- **Query A**: `quantile_over_time(0.50, {app="nest-microservices"} |= "duration" | json | unwrap duration [5m])`
- **Query B**: `quantile_over_time(0.95, {app="nest-microservices"} |= "duration" | json | unwrap duration [5m])`
- **Query C**: `quantile_over_time(0.99, {app="nest-microservices"} |= "duration" | json | unwrap duration [5m])`
- **Legend**: P50, P95, P99

#### **Panel 6: Requests by Controller (Pie Chart)**
- **Query**: `sum by (controller) (count_over_time({app="nest-microservices"} |= "controller" | json [5m]))`
- **Visualization**: Pie chart

#### **Panel 7: Microservice Flow (Time Series)**
- **Query**: `count by (context) (count_over_time({app="nest-microservices"} |= "context" | json [1m]))`
- **Visualization**: Time series

#### **Panel 8: Recent Logs (Logs)**
- **Query**: `{app="nest-microservices"}`
- **Visualization**: Logs
- **Format**: JSON

### **Step 4: Dashboard Settings**
- **Title**: "NestJS Microservices Performance"
- **Refresh**: 30s
- **Time Range**: Last 1 hour
- **Auto-refresh**: On

## 🎯 **Key Metrics Explained**

### **Request Rate**
- Shows how many requests per minute your application is handling
- Helps identify traffic patterns and peak usage

### **Response Time**
- P50: Median response time (50% of requests)
- P95: 95th percentile (95% of requests faster than this)
- P99: 99th percentile (99% of requests faster than this)

### **Error Rate**
- Percentage of requests that result in errors
- Critical for monitoring application health

### **Microservice Flow**
- Shows activity across different services (MathController, StringController, etc.)
- Helps identify which services are most active

## 🔍 **Advanced Queries**

### **Trace Analysis**
```logql
# All logs for a specific trace
{app="nest-microservices"} |= "trace_1758983953736_73k4s9zfp"

# Trace duration analysis
{app="nest-microservices"} |= "duration" | json | unwrap duration
```

### **Performance by Endpoint**
```logql
# Requests by specific endpoint
{app="nest-microservices"} |= "url" | json | unwrap url

# Response time by controller
{app="nest-microservices"} |= "controller" | json
```

### **Error Analysis**
```logql
# Error logs only
{app="nest-microservices"} |= "error"

# Error rate by service
rate({app="nest-microservices"} |= "error" [5m]) by (context)
```

## 🚀 **Quick Start**

1. **Start your app**: `NODE_ENV=production npm run start:dev`
2. **Generate traffic**: `curl http://localhost:3001/` and `curl http://localhost:3001/generate`
3. **View dashboard**: http://localhost:3000/dashboards
4. **Adjust time range**: Set to "Last 5 minutes" to see recent activity

## 📈 **Dashboard Layout Suggestions**

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Request Rate  │ Response Time   │   Error Rate     │
├─────────────────┼─────────────────┼─────────────────┤
│              Request Rate Over Time                 │
├─────────────────┬─────────────────┬─────────────────┤
│              Response Time Distribution              │
├─────────────────┬─────────────────┬─────────────────┤
│ Requests by     │ Microservice    │   Active        │
│ Controller      │ Flow            │   Traces        │
├─────────────────┴─────────────────┴─────────────────┤
│                    Recent Logs                      │
└─────────────────────────────────────────────────────┘
```

## 🎨 **Visualization Tips**

- **Use colors**: Green for good, Yellow for warning, Red for critical
- **Set thresholds**: Based on your SLA requirements
- **Group related metrics**: Keep similar metrics together
- **Use appropriate units**: ms for time, req/s for rate, % for percentages
- **Enable legends**: Help identify different data series

## 🔧 **Troubleshooting**

**No data showing?**
- Check if Loki is receiving logs: `curl http://localhost:3100/ready`
- Verify app is running in production mode: `NODE_ENV=production`
- Check Grafana data source connection
- Look at Loki logs: `docker logs 03-microservices-loki-1`

**Queries not working?**
- Test queries in Explore first
- Check if JSON parsing is working: `| json`
- Verify field names match your log structure
- Use simpler queries first, then add complexity
