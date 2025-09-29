# 🚨 Loki Error Alert Queries

## 📊 **Basic Error Detection Queries**

### **1. Simple Error Rate Alert**
```logql
rate({app="nest-microservices"} |= "error" [5m]) * 100
```
- **Threshold**: > 5% (adjust based on your SLA)
- **Description**: Triggers when error rate exceeds 5% over 5 minutes

### **2. Error Count Alert**
```logql
count_over_time({app="nest-microservices"} |= "error" [5m])
```
- **Threshold**: > 10 errors (adjust based on your tolerance)
- **Description**: Triggers when more than 10 errors occur in 5 minutes

### **3. Critical Error Alert**
```logql
rate({app="nest-microservices"} |= "error" | json | level="error" [1m]) * 60
```
- **Threshold**: > 5 errors/minute
- **Description**: Triggers when critical errors exceed 5 per minute

## 🔍 **Advanced Error Analysis Queries**

### **4. Error Rate by Service**
```logql
rate({app="nest-microservices"} |= "error" | json [5m]) by (context) * 100
```
- **Threshold**: Any service > 10%
- **Description**: Monitors error rate per microservice

### **5. Error Rate by Endpoint**
```logql
rate({app="nest-microservices"} |= "error" | json [5m]) by (url) * 100
```
- **Threshold**: Any endpoint > 15%
- **Description**: Identifies problematic endpoints

### **6. Consecutive Error Alert**
```logql
count_over_time({app="nest-microservices"} |= "error" [2m]) > 5
```
- **Threshold**: > 5 errors in 2 minutes
- **Description**: Detects error bursts

### **7. Error Spike Detection**
```logql
increase({app="nest-microservices"} |= "error" [5m]) > 20
```
- **Threshold**: > 20 errors in 5 minutes
- **Description**: Detects sudden error spikes

## 🎯 **Specific Error Types**

### **8. HTTP 5xx Errors**
```logql
rate({app="nest-microservices"} |= "status" | json | status >= 500 [5m]) * 100
```
- **Threshold**: > 2%
- **Description**: Server error rate

### **9. Database Connection Errors**
```logql
rate({app="nest-microservices"} |= "database" |= "error" [5m]) * 100
```
- **Threshold**: > 1%
- **Description**: Database connectivity issues

### **10. Timeout Errors**
```logql
rate({app="nest-microservices"} |= "timeout" |= "error" [5m]) * 100
```
- **Threshold**: > 3%
- **Description**: Service timeout issues

## 📈 **Composite Alerts**

### **11. Error Rate + Response Time**
```logql
rate({app="nest-microservices"} |= "error" [5m]) * 100 > 5 OR avg_over_time({app="nest-microservices"} |= "duration" | json | unwrap duration [5m]) > 1000
```
- **Description**: Triggers on high error rate OR slow response times

### **12. Service Health Score**
```logql
(1 - rate({app="nest-microservices"} |= "error" [5m])) * 100
```
- **Threshold**: < 95%
- **Description**: Overall service health percentage

## 🔧 **Grafana Alert Configuration**

### **Alert Rule Example:**
```yaml
alert:
  - alert: HighErrorRate
    expr: rate({app="nest-microservices"} |= "error" [5m]) * 100 > 5
    for: 2m
    labels:
      severity: warning
      service: nest-microservices
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }}% for the last 5 minutes"
```

### **Alert Channels:**
- **Slack**: Send notifications to team channels
- **Email**: Alert operations team
- **PagerDuty**: Critical alerts for on-call
- **Webhook**: Custom integrations

## 🎨 **Recommended Alert Thresholds**

### **Development Environment:**
- Error Rate: > 10%
- Error Count: > 20 errors/5min
- Response Time: > 2000ms

### **Production Environment:**
- Error Rate: > 2%
- Error Count: > 5 errors/5min
- Response Time: > 1000ms
- Critical Errors: > 1 error/min

## 🚀 **Quick Setup in Grafana**

### **Step 1: Create Alert Rule**
1. Go to **Alerting** → **Alert Rules**
2. Click **"New rule"**
3. Add query: `rate({app="nest-microservices"} |= "error" [5m]) * 100`
4. Set threshold: `> 5`
5. Configure evaluation: `Every 1m for 2m`

### **Step 2: Configure Notifications**
1. Go to **Alerting** → **Contact Points**
2. Add Slack/Email/PagerDuty
3. Test the connection

### **Step 3: Test Alert**
1. Generate errors: `curl http://localhost:3001/nonexistent`
2. Check alert status in Grafana
3. Verify notifications are sent

## 🔍 **Testing Your Alerts**

### **Generate Test Errors:**
```bash
# Generate 404 errors
for i in {1..10}; do curl http://localhost:3001/nonexistent; done

# Generate timeout errors (if you have slow endpoints)
curl --max-time 1 http://localhost:3001/slow-endpoint

# Generate application errors
curl http://localhost:3001/error-endpoint
```

### **Monitor Alert Status:**
- **Alerting** → **Alert Rules** - See rule status
- **Alerting** → **Alert Groups** - See active alerts
- **Alerting** → **Silences** - Temporarily disable alerts

## 📊 **Alert Dashboard Panel**

Add this panel to your dashboard to monitor alert status:

```logql
# Current error rate (for monitoring)
rate({app="nest-microservices"} |= "error" [5m]) * 100

# Error trend (for context)
rate({app="nest-microservices"} |= "error" [1h]) * 100
```

## 🎯 **Best Practices**

1. **Start Conservative**: Begin with higher thresholds, then tighten
2. **Use Multiple Metrics**: Combine error rate, count, and response time
3. **Service-Specific**: Different thresholds for different services
4. **Time-Based**: Different thresholds for peak vs off-peak hours
5. **Escalation**: Different alerts for different severity levels
6. **Testing**: Regularly test your alerting system
7. **Documentation**: Document what each alert means and how to respond

## 🔧 **Custom Error Detection**

If you want to detect specific application errors:

```logql
# Custom error patterns
{app="nest-microservices"} |= "Database connection failed"
{app="nest-microservices"} |= "Out of memory"
{app="nest-microservices"} |= "Rate limit exceeded"
{app="nest-microservices"} |= "Authentication failed"
```

## 📱 **Mobile-Friendly Alerts**

For mobile notifications, keep alert messages concise:

```yaml
annotations:
  summary: "🚨 High Error Rate"
  description: "{{ $value }}% errors in nest-microservices"
  runbook_url: "https://your-wiki.com/error-response"
```
