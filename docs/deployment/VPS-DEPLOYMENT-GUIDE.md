# KDCA Platform - VPS Deployment Guide

## Complete Step-by-Step Deployment Instructions

---

## TABLE OF CONTENTS

1. [Prerequisites](#1-prerequisites)
2. [VPS Initial Setup](#2-vps-initial-setup)
3. [Install System Dependencies](#3-install-system-dependencies)
4. [PostgreSQL Setup](#4-postgresql-setup)
5. [Redis Setup](#5-redis-setup)
6. [Application Setup](#6-application-setup)
7. [Environment Configuration](#7-environment-configuration)
8. [NGINX Configuration](#8-nginx-configuration)
9. [SSL Certificate Setup](#9-ssl-certificate-setup)
10. [PM2 Process Management](#10-pm2-process-management)
11. [Database Migration](#11-database-migration)
12. [Deployment Scripts](#12-deployment-scripts)
13. [Monitoring & Maintenance](#13-monitoring--maintenance)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. PREREQUISITES

### VPS Requirements

| Specification | Minimum | Recommended |
|--------------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Storage | 80 GB SSD | 160 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Bandwidth | 2 TB | 4 TB |

### Domain Setup

Ensure these DNS records point to your VPS IP:

```
A    kallaichess.com           → YOUR_VPS_IP
A    www.kallaichess.com       → YOUR_VPS_IP
A    register.kallaichess.com  → YOUR_VPS_IP
A    api.kallaichess.com       → YOUR_VPS_IP
```

### Local Requirements

- SSH access to VPS
- Git repository access
- Domain DNS configured

---

## 2. VPS INITIAL SETUP

### 2.1 Connect to VPS

```bash
ssh root@YOUR_VPS_IP
```

### 2.2 Create Deploy User

```bash
# Create user
adduser deploy
usermod -aG sudo deploy

# Setup SSH for deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Test login (from local machine)
# ssh deploy@YOUR_VPS_IP
```

### 2.3 Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common
```

### 2.4 Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 2.5 Set Timezone

```bash
sudo timedatectl set-timezone Asia/Kolkata
```

---

## 3. INSTALL SYSTEM DEPENDENCIES

### 3.1 Install Node.js 20 LTS

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 3.2 Install pnpm (Recommended Package Manager)

```bash
npm install -g pnpm
pnpm --version
```

### 3.3 Install PM2

```bash
npm install -g pm2
pm2 --version
```

### 3.4 Install NGINX

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

### 3.5 Install Certbot (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 4. POSTGRESQL SETUP

### 4.1 Install PostgreSQL 16

```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Install
sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16

# Verify
sudo systemctl status postgresql
psql --version
```

### 4.2 Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
```

```sql
-- Create database
CREATE DATABASE kdca_db;

-- Create user
CREATE USER kdca_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD_HERE';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kdca_db TO kdca_user;

-- Connect to database and grant schema privileges
\c kdca_db
GRANT ALL ON SCHEMA public TO kdca_user;

-- Exit
\q
```

### 4.3 Configure Remote Access (Optional)

Edit `/etc/postgresql/16/main/postgresql.conf`:

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

```conf
listen_addresses = 'localhost'  # Keep as localhost for security
```

Edit `/etc/postgresql/16/main/pg_hba.conf`:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

```conf
# Add this line for local connections
local   all   kdca_user   md5
host    all   kdca_user   127.0.0.1/32   md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

### 4.4 Test Connection

```bash
psql -U kdca_user -d kdca_db -h localhost
# Enter password when prompted
# \q to exit
```

---

## 5. REDIS SETUP

### 5.1 Install Redis

```bash
sudo apt install -y redis-server
```

### 5.2 Configure Redis

```bash
sudo nano /etc/redis/redis.conf
```

Update these settings:

```conf
supervised systemd
maxmemory 256mb
maxmemory-policy allkeys-lru

# Optional: Set password
requirepass YOUR_REDIS_PASSWORD
```

### 5.3 Start Redis

```bash
sudo systemctl restart redis-server
sudo systemctl enable redis-server
sudo systemctl status redis-server
```

### 5.4 Test Redis

```bash
redis-cli ping
# Should return: PONG

# If password is set:
redis-cli -a YOUR_REDIS_PASSWORD ping
```

---

## 6. APPLICATION SETUP

### 6.1 Create Directory Structure

```bash
sudo mkdir -p /var/www/kdca
sudo chown -R deploy:deploy /var/www/kdca
cd /var/www/kdca
```

### 6.2 Clone Repository

```bash
cd /var/www/kdca
git clone https://github.com/kabils/kkdca-platform.git .

# Or if using deploy key:
git clone git@github.com:kabils/kkdca-platform.git .
```

### 6.3 Project Structure (Expected)

```
/var/www/kdca/
├── backend/               # NestJS API
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env
├── public-website/        # Next.js Public Site
│   ├── app/
│   ├── package.json
│   └── .env.local
├── admin-portal/          # Next.js Admin Portal
│   ├── app/
│   ├── package.json
│   └── .env.local
└── docs/
```

### 6.4 Install Dependencies

```bash
# Backend
cd /var/www/kdca/backend
pnpm install

# Public Website
cd /var/www/kdca/public-website
pnpm install

# Admin Portal
cd /var/www/kdca/admin-portal
pnpm install
```

### 6.5 Build Applications

```bash
# Backend
cd /var/www/kdca/backend
pnpm run build

# Public Website
cd /var/www/kdca/public-website
pnpm run build

# Admin Portal
cd /var/www/kdca/admin-portal
pnpm run build
```

---

## 7. ENVIRONMENT CONFIGURATION

### 7.1 Backend Environment (`/var/www/kdca/backend/.env`)

```bash
nano /var/www/kdca/backend/.env
```

```env
# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.kallaichess.com
PUBLIC_URL=https://kallaichess.com
ADMIN_URL=https://register.kallaichess.com

# Database
DATABASE_URL="postgresql://kdca_user:YOUR_DB_PASSWORD@localhost:5432/kdca_db?schema=public"

# Redis
REDIS_URL="redis://:YOUR_REDIS_PASSWORD@localhost:6379"

# JWT Authentication
JWT_SECRET="your-super-secure-jwt-secret-at-least-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-at-least-32-characters"
JWT_REFRESH_EXPIRES_IN="7d"

# HDFC Payment Gateway (Get from HDFC)
HDFC_MERCHANT_ID="your_merchant_id"
HDFC_ACCESS_CODE="your_access_code"
HDFC_WORKING_KEY="your_working_key"
HDFC_REDIRECT_URL="https://api.kallaichess.com/v1/payments/callback"

# File Storage
UPLOAD_DIR="/var/www/kdca/uploads"
MAX_FILE_SIZE=5242880

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="KDCA <noreply@kallaichess.com>"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### 7.2 Public Website Environment (`/var/www/kdca/public-website/.env.local`)

```bash
nano /var/www/kdca/public-website/.env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.kallaichess.com/v1
NEXT_PUBLIC_SITE_URL=https://kallaichess.com
NEXT_PUBLIC_ADMIN_URL=https://register.kallaichess.com
```

### 7.3 Admin Portal Environment (`/var/www/kdca/admin-portal/.env.local`)

```bash
nano /var/www/kdca/admin-portal/.env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.kallaichess.com/v1
NEXT_PUBLIC_SITE_URL=https://kallaichess.com
NEXT_PUBLIC_ADMIN_URL=https://register.kallaichess.com
```

### 7.4 Create Upload Directory

```bash
sudo mkdir -p /var/www/kdca/uploads
sudo chown -R deploy:deploy /var/www/kdca/uploads
chmod 755 /var/www/kdca/uploads
```

---

## 8. NGINX CONFIGURATION

### 8.1 Create NGINX Config Files

#### API Configuration (`/etc/nginx/sites-available/api.kallaichess.com`)

```bash
sudo nano /etc/nginx/sites-available/api.kallaichess.com
```

```nginx
server {
    listen 80;
    server_name api.kallaichess.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # File uploads
    location /uploads {
        alias /var/www/kdca/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
    }

    client_max_body_size 10M;
}
```

#### Public Website Configuration (`/etc/nginx/sites-available/kallaichess.com`)

```bash
sudo nano /etc/nginx/sites-available/kallaichess.com
```

```nginx
server {
    listen 80;
    server_name kallaichess.com www.kallaichess.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3001;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        proxy_pass http://127.0.0.1:3001;
        expires 30d;
        add_header Cache-Control "public";
    }

    client_max_body_size 10M;
}
```

#### Admin Portal Configuration (`/etc/nginx/sites-available/register.kallaichess.com`)

```bash
sudo nano /etc/nginx/sites-available/register.kallaichess.com
```

```nginx
server {
    listen 80;
    server_name register.kallaichess.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3002;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 10M;
}
```

### 8.2 Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/api.kallaichess.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/kallaichess.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/register.kallaichess.com /etc/nginx/sites-enabled/

# Remove default
sudo rm -f /etc/nginx/sites-enabled/default
```

### 8.3 Test & Reload NGINX

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 9. SSL CERTIFICATE SETUP

### 9.1 Obtain SSL Certificates

```bash
# Stop nginx temporarily (not needed if using webroot method)
# sudo systemctl stop nginx

# Get certificates for all domains
sudo certbot --nginx -d kallaichess.com -d www.kallaichess.com -d api.kallaichess.com -d register.kallaichess.com

# Follow the prompts:
# - Enter email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

### 9.2 Verify Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 9.3 Setup Auto-Renewal Cron

```bash
# This is usually set up automatically, but verify:
sudo systemctl status certbot.timer

# Or add manual cron:
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 10. PM2 PROCESS MANAGEMENT

### 10.1 Create PM2 Ecosystem File

```bash
nano /var/www/kdca/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'kdca-api',
      cwd: '/var/www/kdca/backend',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '500M',
      error_file: '/var/www/kdca/logs/api-error.log',
      out_file: '/var/www/kdca/logs/api-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'kdca-public',
      cwd: '/var/www/kdca/public-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '500M',
      error_file: '/var/www/kdca/logs/public-error.log',
      out_file: '/var/www/kdca/logs/public-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'kdca-admin',
      cwd: '/var/www/kdca/admin-portal',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      max_memory_restart: '500M',
      error_file: '/var/www/kdca/logs/admin-error.log',
      out_file: '/var/www/kdca/logs/admin-out.log',
      merge_logs: true,
      time: true
    }
  ]
};
```

### 10.2 Create Logs Directory

```bash
mkdir -p /var/www/kdca/logs
```

### 10.3 Start Applications

```bash
cd /var/www/kdca

# Start all apps
pm2 start ecosystem.config.js --env production

# Check status
pm2 status

# View logs
pm2 logs

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u deploy --hp /home/deploy
# Run the command it outputs
```

### 10.4 Useful PM2 Commands

```bash
# Restart all apps
pm2 restart all

# Restart specific app
pm2 restart kdca-api

# Stop all apps
pm2 stop all

# View logs
pm2 logs kdca-api --lines 100

# Monitor resources
pm2 monit

# Reload with zero downtime
pm2 reload all
```

---

## 11. DATABASE MIGRATION

### 11.1 Run Prisma Migrations

```bash
cd /var/www/kdca/backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (if seed script exists)
npx prisma db seed
```

### 11.2 Create Super Admin User

```bash
cd /var/www/kdca/backend

# Run this script or create manually
npx ts-node scripts/create-admin.ts
```

Or create manually via Prisma Studio:

```bash
npx prisma studio
# Opens browser at localhost:5555
# Create admin user in the users table
```

### 11.3 Verify Database

```bash
# Connect to database
psql -U kdca_user -d kdca_db -h localhost

# Check tables
\dt

# Check users
SELECT id, email, role FROM users;

# Exit
\q
```

---

## 12. DEPLOYMENT SCRIPTS

### 12.1 Create Deploy Script

```bash
nano /var/www/kdca/deploy.sh
```

```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Navigate to project
cd /var/www/kdca

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd /var/www/kdca/backend && pnpm install
cd /var/www/kdca/public-website && pnpm install
cd /var/www/kdca/admin-portal && pnpm install

# Run database migrations
echo "🗄️ Running database migrations..."
cd /var/www/kdca/backend
npx prisma migrate deploy
npx prisma generate

# Build applications
echo "🔨 Building applications..."
cd /var/www/kdca/backend && pnpm run build
cd /var/www/kdca/public-website && pnpm run build
cd /var/www/kdca/admin-portal && pnpm run build

# Reload PM2 apps
echo "🔄 Reloading applications..."
pm2 reload ecosystem.config.js --env production

echo "✅ Deployment complete!"
pm2 status
```

Make it executable:

```bash
chmod +x /var/www/kdca/deploy.sh
```

### 12.2 Quick Deploy

```bash
cd /var/www/kdca
./deploy.sh
```

### 12.3 Rollback Script

```bash
nano /var/www/kdca/rollback.sh
```

```bash
#!/bin/bash

set -e

echo "⏪ Starting rollback..."

cd /var/www/kdca

# Get previous commit
PREV_COMMIT=$(git rev-parse HEAD~1)

echo "Rolling back to commit: $PREV_COMMIT"

# Checkout previous commit
git checkout $PREV_COMMIT

# Rebuild
cd /var/www/kdca/backend && pnpm run build
cd /var/www/kdca/public-website && pnpm run build
cd /var/www/kdca/admin-portal && pnpm run build

# Reload
pm2 reload all

echo "✅ Rollback complete!"
```

```bash
chmod +x /var/www/kdca/rollback.sh
```

---

## 13. MONITORING & MAINTENANCE

### 13.1 View Application Logs

```bash
# All logs
pm2 logs

# Specific app
pm2 logs kdca-api --lines 200

# Error logs only
tail -f /var/www/kdca/logs/api-error.log
```

### 13.2 NGINX Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 13.3 PostgreSQL Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

### 13.4 Disk Space

```bash
df -h
du -sh /var/www/kdca/*
```

### 13.5 Memory & CPU

```bash
htop
# or
free -h
```

### 13.6 Database Backup

```bash
# Create backup script
nano /var/www/kdca/backup-db.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/var/www/kdca/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="kdca_db_backup_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

# Create backup
PGPASSWORD="YOUR_DB_PASSWORD" pg_dump -U kdca_user -h localhost kdca_db | gzip > "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup created: $FILENAME"
```

```bash
chmod +x /var/www/kdca/backup-db.sh

# Add to cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /var/www/kdca/backup-db.sh
```

### 13.7 PM2 Monitoring Dashboard

```bash
# Local monitoring
pm2 monit

# Web-based monitoring (optional - requires PM2 Plus account)
pm2 plus
```

---

## 14. TROUBLESHOOTING

### 14.1 Application Won't Start

```bash
# Check PM2 logs
pm2 logs kdca-api --err --lines 50

# Check if port is in use
sudo lsof -i :3000

# Verify environment file
cat /var/www/kdca/backend/.env

# Test manually
cd /var/www/kdca/backend
node dist/main.js
```

### 14.2 Database Connection Issues

```bash
# Test connection
psql -U kdca_user -d kdca_db -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# Verify DATABASE_URL in .env
grep DATABASE_URL /var/www/kdca/backend/.env
```

### 14.3 NGINX Issues

```bash
# Test config
sudo nginx -t

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

### 14.4 SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

### 14.5 Redis Issues

```bash
# Check status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Check memory
redis-cli info memory
```

### 14.6 Out of Memory

```bash
# Check memory
free -h

# Check PM2 memory usage
pm2 monit

# Restart all apps (clears memory)
pm2 restart all

# If still issues, consider adding swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 14.7 Permission Issues

```bash
# Fix ownership
sudo chown -R deploy:deploy /var/www/kdca

# Fix permissions
chmod -R 755 /var/www/kdca
chmod 600 /var/www/kdca/backend/.env
```

---

## QUICK REFERENCE COMMANDS

```bash
# === PM2 ===
pm2 status                    # Check status
pm2 logs                      # View all logs
pm2 restart all               # Restart all apps
pm2 reload all                # Zero-downtime reload
pm2 monit                     # Resource monitor

# === NGINX ===
sudo nginx -t                 # Test config
sudo systemctl reload nginx   # Reload config
sudo systemctl restart nginx  # Full restart

# === PostgreSQL ===
sudo systemctl status postgresql
psql -U kdca_user -d kdca_db -h localhost

# === Redis ===
redis-cli ping
sudo systemctl status redis-server

# === Deploy ===
cd /var/www/kdca && ./deploy.sh

# === Logs ===
pm2 logs kdca-api --lines 100
sudo tail -f /var/log/nginx/error.log

# === SSL ===
sudo certbot certificates
sudo certbot renew --dry-run
```

---

## DEPLOYMENT CHECKLIST

Before going live:

- [ ] VPS provisioned and SSH access working
- [ ] Deploy user created with proper permissions
- [ ] Node.js 20 installed
- [ ] PM2 installed globally
- [ ] NGINX installed and configured
- [ ] PostgreSQL 16 installed and configured
- [ ] Redis installed and configured
- [ ] All three NGINX site configs created
- [ ] SSL certificates obtained for all domains
- [ ] Environment files configured for all apps
- [ ] Database migrations run
- [ ] Super admin user created
- [ ] PM2 ecosystem configured
- [ ] All apps building successfully
- [ ] PM2 startup configured
- [ ] Backup script configured
- [ ] Firewall configured (UFW)
- [ ] Test all endpoints working
- [ ] Test payment flow (sandbox first)
- [ ] Monitor for 24 hours after launch

---

**Your KDCA platform is now deployed!** 🎉

Access your sites:
- Public: https://kallaichess.com
- Admin: https://register.kallaichess.com
- API: https://api.kallaichess.com
