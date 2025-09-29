#!/bin/bash

echo "🚀 Starting Observability Stack..."

# Start Loki, Prometheus, and Grafana
docker-compose -f docker-compose.observability.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.observability.yml ps

echo ""
echo "✅ Observability Stack Started!"
echo ""
echo "📊 Grafana: http://localhost:3000"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "🔍 Loki: http://localhost:3100"
echo ""
echo "📈 Prometheus: http://localhost:9090"
echo ""
echo "📝 To view logs in Grafana:"
echo "1. Go to http://localhost:3000"
echo "2. Login with admin/admin"
echo "3. Go to 'Explore' in the left menu"
echo "4. Select 'Loki' as data source"
echo "5. Use query: {job=\"nest-microservices\"}"
echo ""
echo "📊 To view metrics in Grafana:"
echo "1. Go to http://localhost:3000"
echo "2. Login with admin/admin"
echo "3. Go to 'Explore' in the left menu"
echo "4. Select 'Prometheus' as data source"
echo "5. Use query: rate(http_requests_total[5m])"
echo ""
echo "🛑 To stop: docker-compose -f docker-compose.observability.yml down"
