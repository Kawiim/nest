#!/bin/bash

echo "🚀 Importing NestJS Microservices Performance Dashboard to Grafana..."

# Wait for Grafana to be ready
echo "⏳ Waiting for Grafana to be ready..."
until curl -s http://localhost:3000/api/health > /dev/null; do
  sleep 2
done

echo "✅ Grafana is ready!"

# Import the dashboard
echo "📊 Importing dashboard..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4=" \
  -d @grafana-dashboard.json \
  http://localhost:3000/api/dashboards/db

echo ""
echo "🎉 Dashboard imported successfully!"
echo "🌐 Access your dashboard at: http://localhost:3000/dashboards"
echo ""
echo "📈 Dashboard includes:"
echo "   • Request Rate (per minute)"
echo "   • Average Response Time"
echo "   • Error Rate"
echo "   • Active Traces"
echo "   • Response Time Distribution (P50, P95, P99)"
echo "   • Requests by Controller"
echo "   • Microservice Flow Analysis"
echo "   • Recent Logs"
echo ""
echo "💡 Make sure your NestJS app is running with NODE_ENV=production to see data!"
