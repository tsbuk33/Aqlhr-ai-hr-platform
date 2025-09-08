#!/bin/bash

# AQLHR 5-Layer Architecture Deployment Script
# ============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="aqlhr-5layer"
ENVIRONMENT=${ENVIRONMENT:-development}
COMPOSE_FILE="docker-compose.yml"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp config/env.example .env
        print_warning "Please edit .env file with your configuration before running again."
        exit 1
    fi
    
    print_success "Prerequisites check completed"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p {ai-models,ai-data,logs,backups}
    mkdir -p config/{nginx,prometheus,grafana/{dashboards,datasources}}
    
    print_success "Directories created"
}

# Function to generate SSL certificates for development
generate_ssl_certs() {
    print_status "Generating SSL certificates for development..."
    
    mkdir -p config/nginx/ssl
    
    if [ ! -f "config/nginx/ssl/aqlhr.crt" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout config/nginx/ssl/aqlhr.key \
            -out config/nginx/ssl/aqlhr.crt \
            -subj "/C=SA/ST=Riyadh/L=Riyadh/O=AQLHR/CN=localhost"
        
        print_success "SSL certificates generated"
    else
        print_status "SSL certificates already exist"
    fi
}

# Function to create configuration files
create_config_files() {
    print_status "Creating configuration files..."
    
    # Nginx configuration
    cat > config/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:8080;
    }
    
    upstream executive_dashboard {
        server executive-dashboard:5000;
    }
    
    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl;
        server_name localhost;
        
        ssl_certificate /etc/nginx/ssl/aqlhr.crt;
        ssl_certificate_key /etc/nginx/ssl/aqlhr.key;
        
        location /api/ {
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /dashboard/ {
            proxy_pass http://executive_dashboard;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location / {
            proxy_pass http://executive_dashboard;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

    # Prometheus configuration
    cat > config/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'aqlhr-services'
    static_configs:
      - targets: 
        - 'api-gateway:8080'
        - 'ai-orchestration:8001'
        - 'employee-service:8003'
        - 'payroll-service:8004'
        - 'compliance-service:8005'
        - 'analytics-service:8006'
    metrics_path: '/metrics'
    scrape_interval: 10s
EOF

    # Database initialization script
    cat > scripts/init-databases.sh << 'EOF'
#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE aqlhr_ai;
    CREATE DATABASE aqlhr_hr;
    CREATE DATABASE aqlhr_payroll;
    CREATE DATABASE aqlhr_compliance;
    CREATE DATABASE aqlhr_analytics;
    
    GRANT ALL PRIVILEGES ON DATABASE aqlhr_ai TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE aqlhr_hr TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE aqlhr_payroll TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE aqlhr_compliance TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE aqlhr_analytics TO $POSTGRES_USER;
EOSQL
EOF

    chmod +x scripts/init-databases.sh
    
    print_success "Configuration files created"
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Create Dockerfiles for each service
    create_dockerfiles
    
    # Build images
    docker-compose build --parallel
    
    print_success "Docker images built successfully"
}

# Function to create Dockerfiles
create_dockerfiles() {
    print_status "Creating Dockerfiles..."
    
    # AI Orchestration Dockerfile
    cat > layer2-ai-orchestration/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
EOF

    # Employee Service Dockerfile
    cat > layer3-business-logic/hr-microservices/Dockerfile.employee << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY employee_service.py .

EXPOSE 8003

CMD ["python", "employee_service.py"]
EOF

    # Executive Dashboard Dockerfile
    cat > layer1-presentation/web-interfaces/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN pip install flask

COPY executive_dashboard.py .

EXPOSE 5000

CMD ["python", "executive_dashboard.py"]
EOF

    print_success "Dockerfiles created"
}

# Function to create requirements files
create_requirements() {
    print_status "Creating requirements files..."
    
    # AI Orchestration requirements
    cat > layer2-ai-orchestration/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
asyncio-mqtt==0.16.1
redis==5.0.1
psycopg2-binary==2.9.9
openai==1.3.7
transformers==4.36.0
torch==2.1.1
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.2
aiohttp==3.9.1
python-multipart==0.0.6
EOF

    # HR Microservices requirements
    cat > layer3-business-logic/hr-microservices/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
psycopg2-binary==2.9.9
redis==5.0.1
sqlalchemy==2.0.23
alembic==1.13.1
python-multipart==0.0.6
python-dateutil==2.8.2
EOF

    print_success "Requirements files created"
}

# Function to start services
start_services() {
    print_status "Starting AQLHR 5-Layer Architecture..."
    
    # Start infrastructure services first
    print_status "Starting infrastructure services..."
    docker-compose up -d postgres redis elasticsearch mongodb rabbitmq
    
    # Wait for databases to be ready
    print_status "Waiting for databases to be ready..."
    sleep 30
    
    # Start application services
    print_status "Starting application services..."
    docker-compose up -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 20
    
    print_success "All services started successfully"
}

# Function to check service health
check_health() {
    print_status "Checking service health..."
    
    services=(
        "http://localhost:8080/health:API Gateway"
        "http://localhost:5000:Executive Dashboard"
        "http://localhost:8001/health:AI Orchestration"
        "http://localhost:8003/health:Employee Service"
    )
    
    for service in "${services[@]}"; do
        url=$(echo $service | cut -d: -f1-2)
        name=$(echo $service | cut -d: -f3)
        
        if curl -f -s "$url" > /dev/null; then
            print_success "$name is healthy"
        else
            print_warning "$name is not responding"
        fi
    done
}

# Function to show service URLs
show_urls() {
    print_success "AQLHR 5-Layer Architecture deployed successfully!"
    echo ""
    echo "Service URLs:"
    echo "============="
    echo "🌐 Executive Dashboard: https://localhost"
    echo "🔗 API Gateway: https://localhost/api"
    echo "📊 Grafana Monitoring: http://localhost:3000 (admin/admin)"
    echo "📈 Prometheus Metrics: http://localhost:9090"
    echo "🔍 Jaeger Tracing: http://localhost:16686"
    echo "🐰 RabbitMQ Management: http://localhost:15672 (aqlhr/password)"
    echo "🗄️ Elasticsearch: http://localhost:9200"
    echo ""
    echo "Database Connections:"
    echo "===================="
    echo "🐘 PostgreSQL: localhost:5432 (aqlhr/password)"
    echo "🔴 Redis: localhost:6379"
    echo "🍃 MongoDB: localhost:27017 (aqlhr/password)"
    echo ""
    echo "Logs: docker-compose logs -f [service-name]"
    echo "Stop: docker-compose down"
    echo "Restart: docker-compose restart [service-name]"
}

# Function to stop services
stop_services() {
    print_status "Stopping AQLHR services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Main deployment function
deploy() {
    print_status "Starting AQLHR 5-Layer Architecture deployment..."
    
    check_prerequisites
    create_directories
    generate_ssl_certs
    create_config_files
    create_requirements
    build_images
    start_services
    
    # Wait a bit for services to fully start
    sleep 10
    
    check_health
    show_urls
}

# Command line interface
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "start")
        start_services
        check_health
        show_urls
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_services
        check_health
        ;;
    "health")
        check_health
        ;;
    "logs")
        docker-compose logs -f ${2:-}
        ;;
    "cleanup")
        cleanup
        ;;
    "build")
        build_images
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|health|logs|cleanup|build}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (default)"
        echo "  start    - Start services"
        echo "  stop     - Stop services"
        echo "  restart  - Restart services"
        echo "  health   - Check service health"
        echo "  logs     - Show logs (optionally specify service)"
        echo "  cleanup  - Stop and remove all containers and volumes"
        echo "  build    - Build Docker images"
        exit 1
        ;;
esac

