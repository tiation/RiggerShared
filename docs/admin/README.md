# RiggerShared Administration Guide

🛡️ **ChaseWhiteRabbit NGO Enterprise Administration**

## 📋 Overview

This guide provides comprehensive administration instructions for managing RiggerShared in enterprise environments, including VPS management, monitoring, and operational procedures.

## 🖥️ VPS Management

### Server Infrastructure

**Primary Servers:**
- **docker.sxc.codes** (145.223.22.7) - Primary CI/CD runner
- **docker.tiation.net** (145.223.22.9) - Development/staging
- **supabase.sxc.codes** (93.127.167.157) - Database services
- **grafana.sxc.codes** (153.92.214.1) - Monitoring & dashboards

### Server Access

Connect to servers using the configured SSH key:

```bash
# Primary production server
ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.7

# Development server
ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.9

# Database server
ssh -i ~/.ssh/hostinger_key.pub root@93.127.167.157

# Monitoring server
ssh -i ~/.ssh/hostinger_key.pub root@153.92.214.1
```

### Server Health Monitoring

#### System Resource Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top -bn1 | grep load

# Check running processes
ps aux | grep node
```

#### Docker Container Management
```bash
# List running containers
docker ps

# Check container logs
docker logs <container-id>

# Restart container
docker restart <container-id>

# Remove stopped containers
docker container prune
```

## 📊 Monitoring & Observability

### Grafana Dashboard Access

Access monitoring dashboards at:
- **URL**: https://grafana.sxc.codes
- **Default Port**: 3000

#### Key Metrics to Monitor
- **CPU Usage**: < 80% sustained
- **Memory Usage**: < 85% sustained  
- **Disk Space**: > 20% free
- **Network I/O**: Monitor for spikes
- **Container Health**: All services running

### Log Management

#### Application Logs
```bash
# View application logs
docker logs -f riggershared

# View system logs
journalctl -f

# Search logs for errors
grep -i "error" /var/logs/riggershared.log
```

#### Log Rotation
```bash
# Configure logrotate for application logs
sudo nano /etc/logrotate.d/riggershared

# Force log rotation
sudo logrotate -f /etc/logrotate.conf
```

## 🚀 Deployment Management

### Production Deployments

#### Pre-deployment Checklist
- [ ] Code review completed
- [ ] Tests passing
- [ ] Security scan passed
- [ ] Database migrations ready
- [ ] Rollback plan prepared

#### Deployment Process
```bash
# 1. Connect to production server
ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.7

# 2. Navigate to application directory
cd /opt/riggershared

# 3. Pull latest changes
git pull origin main

# 4. Run deployment script
./scripts/deploy/deploy.sh production

# 5. Verify deployment
curl -f http://localhost:3000/health
```

#### Post-deployment Verification
```bash
# Check application status
docker ps | grep riggershared

# Verify database connectivity
npm run db:health-check

# Monitor logs for errors
docker logs -f riggershared --tail 100
```

### Rolling Back Deployments

```bash
# Rollback to previous version
git checkout <previous-commit-hash>
./scripts/deploy/rollback.sh

# Verify rollback
curl -f http://localhost:3000/health
```

## 🔐 Security Management

### SSL Certificate Management

#### Check Certificate Expiry
```bash
# Check certificate expiration
openssl x509 -in /etc/ssl/certs/riggershared.crt -text -noout | grep "Not After"
```

#### Renew SSL Certificates
```bash
# Renew Let's Encrypt certificates
sudo certbot renew

# Restart nginx to apply new certificates
sudo systemctl restart nginx
```

### Security Monitoring

#### Audit Logs
```bash
# View authentication logs
sudo tail -f /var/log/auth.log

# Check for failed login attempts
sudo grep "Failed password" /var/log/auth.log

# Monitor file changes
sudo find /opt/riggershared -type f -mtime -1
```

#### Firewall Management
```bash
# Check firewall status
sudo ufw status

# Allow specific ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block suspicious IPs
sudo ufw deny from <suspicious-ip>
```

## 💾 Database Administration

### PostgreSQL Management (Supabase)

#### Connect to Database Server
```bash
ssh -i ~/.ssh/hostinger_key.pub root@93.127.167.157
```

#### Database Backups
```bash
# Create manual backup
pg_dump riggershared > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
./scripts/backup/db-backup.sh

# Verify backup integrity
pg_restore --list backup_file.sql
```

#### Database Maintenance
```bash
# Analyze database performance
psql -c "SELECT * FROM pg_stat_activity;"

# Vacuum and analyze tables
psql -c "VACUUM ANALYZE;"

# Check database size
psql -c "SELECT pg_size_pretty(pg_database_size('riggershared'));"
```

## 🔔 Alert Management

### Email Alerts Configuration

Alerts are sent to:
- **Primary**: tiatheone@protonmail.com
- **Secondary**: garrett@sxc.codes  
- **Backup**: garrett.dillman@gmail.com

#### Alert Types
- **Critical**: System down, database connection lost
- **Warning**: High resource usage, disk space low
- **Info**: Deployment completed, backups finished

### Alert Response Procedures

#### Critical Alerts
1. **Immediate Response** (within 15 minutes)
2. **Assess Impact** - Check affected services
3. **Implement Fix** - Apply immediate resolution
4. **Notify Stakeholders** - Update on status
5. **Post-Incident Review** - Document lessons learned

#### Warning Alerts
1. **Response Time**: Within 1 hour
2. **Investigation**: Identify root cause
3. **Preventive Action**: Implement solution
4. **Documentation**: Update runbooks

## 🔧 Maintenance Procedures

### Scheduled Maintenance

#### Weekly Tasks
- [ ] Review system logs
- [ ] Check disk space across all servers
- [ ] Verify backups completed successfully
- [ ] Update security patches

#### Monthly Tasks
- [ ] Performance review and optimization
- [ ] SSL certificate expiry check
- [ ] Dependency updates and security audits
- [ ] Disaster recovery test

#### Quarterly Tasks
- [ ] Full system backup and restore test
- [ ] Security penetration testing
- [ ] Infrastructure capacity planning
- [ ] Documentation updates

### Emergency Procedures

#### System Outage Response
1. **Assess Scope** - Identify affected services
2. **Communicate Status** - Notify users and stakeholders
3. **Implement Fix** - Apply resolution steps
4. **Monitor Recovery** - Ensure services restored
5. **Document Incident** - Create post-mortem report

#### Data Recovery Procedures
```bash
# Restore from latest backup
./scripts/backup/restore.sh latest

# Verify data integrity
npm run db:verify

# Resume normal operations
systemctl start riggershared
```

## 📞 Support Contacts

- **Primary Admin**: tiatheone@protonmail.com
- **Technical Lead**: garrett@sxc.codes
- **Backup Contact**: garrett.dillman@gmail.com

## 📚 Additional Resources

- [Deployment Guide](../deployment/README.md)
- [Troubleshooting Guide](../troubleshooting/README.md)
- [Security Documentation](../security/README.md)
- [API Documentation](../api/README.md)

---

**ChaseWhiteRabbit NGO** | Enterprise-Grade • Ethical • DevOps-Ready
