# Deployment Guide for Unified Analytics

## Prerequisites

- Node.js 18+ installed
- PM2 installed globally: `npm install -g pm2`
- Nginx installed (for production)
- Domain name configured (optional, for production)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

### 3. Create Logs Directory

```bash
mkdir -p logs
```

### 4. Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 5. PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs unified-analytics

# Restart application
pm2 restart unified-analytics

# Stop application
pm2 stop unified-analytics

# Delete application from PM2
pm2 delete unified-analytics

# Monitor
pm2 monit
```

### 6. Nginx Configuration

#### For Development/Testing:

1. Copy the nginx configuration:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/unified-analytics
```

2. Create symbolic link:
```bash
sudo ln -s /etc/nginx/sites-available/unified-analytics /etc/nginx/sites-enabled/
```

3. Test configuration:
```bash
sudo nginx -t
```

4. Reload nginx:
```bash
sudo systemctl reload nginx
```

#### For Production:

1. Use the example configuration as a template:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/unified-analytics
```

2. Edit the configuration file:
```bash
sudo nano /etc/nginx/sites-available/unified-analytics
```

3. Replace `yourdomain.com` with your actual domain name

4. Test and reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

5. Setup SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

```env
NODE_ENV=production
PORT=3004
# Add other environment variables as needed
```

### 8. Firewall Configuration

If using a firewall, ensure ports are open:

```bash
# For UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3004/tcp  # Only if direct access needed
```

### 9. Verify Deployment

1. Check PM2 status:
```bash
pm2 status
```

2. Check application logs:
```bash
pm2 logs unified-analytics
```

3. Test the application:
```bash
curl http://localhost:3004
```

4. Test through nginx:
```bash
curl http://yourdomain.com
```

## Troubleshooting

### Application won't start

- Check if port 3004 is already in use: `lsof -i :3004` or `netstat -tulpn | grep 3004`
- Check PM2 logs: `pm2 logs unified-analytics`
- Verify build completed successfully: `npm run build`

### Nginx 502 Bad Gateway

- Verify the application is running: `pm2 status`
- Check if the application is listening on port 3004: `curl http://localhost:3004`
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### Port Already in Use

- Change the port in `ecosystem.config.js` and `nginx.conf`
- Or kill the process using the port: `kill -9 $(lsof -t -i:3004)`

## Production Checklist

- [ ] Environment variables configured
- [ ] Application built successfully
- [ ] PM2 configured and running
- [ ] Nginx configured and tested
- [ ] SSL certificate installed (for HTTPS)
- [ ] Firewall rules configured
- [ ] Logs directory created
- [ ] Monitoring set up (optional)
- [ ] Backup strategy in place (optional)

