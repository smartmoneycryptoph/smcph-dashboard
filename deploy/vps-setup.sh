#!/bin/bash
# Run this ONCE on the VPS to set everything up.
# SSH in as root: ssh root@187.127.99.76
# Then: bash vps-setup.sh

set -e

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== Installing PM2 ==="
npm install -g pm2

echo "=== Installing nginx ==="
apt-get install -y nginx

echo "=== Installing certbot ==="
apt-get install -y certbot python3-certbot-nginx

echo "=== Creating app directory ==="
mkdir -p /opt/smcph-dashboard
chown -R root:root /opt/smcph-dashboard

echo "=== Cloning dashboard repo ==="
git clone https://github.com/smartmoneycryptoph/smcph-dashboard.git /opt/smcph-dashboard

echo "=== Copying nginx configs ==="
cp deploy/nginx-smartmoneycryptoph.tech.conf /etc/nginx/sites-available/smartmoneycryptoph.tech
cp deploy/nginx-dashboard.smartmoneycryptoph.tech.conf /etc/nginx/sites-available/dashboard.smartmoneycryptoph.tech

ln -sf /etc/nginx/sites-available/smartmoneycryptoph.tech /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/dashboard.smartmoneycryptoph.tech /etc/nginx/sites-enabled/

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

echo "=== Testing nginx config ==="
nginx -t

echo "=== Starting nginx ==="
systemctl enable nginx
systemctl restart nginx

echo ""
echo "=== Getting SSL certificates ==="
echo "DNS records required:"
echo "  smartmoneycryptoph.tech           A  187.127.99.76"
echo "  dashboard.smartmoneycryptoph.tech A  187.127.99.76"
echo ""
read -p "DNS records set and propagated? Press Enter to continue..."

certbot --nginx \
  -d smartmoneycryptoph.tech \
  -d www.smartmoneycryptoph.tech \
  --non-interactive --agree-tos -m panganting.amerhussien@gmail.com

certbot --nginx \
  -d dashboard.smartmoneycryptoph.tech \
  --non-interactive --agree-tos -m panganting.amerhussien@gmail.com

echo "=== SSL auto-renewal ==="
systemctl enable certbot.timer

echo "=== Building dashboard ==="
cd /opt/smcph-dashboard
npm install
npm run build

echo "=== Starting dashboard with PM2 ==="
pm2 start npm --name "smcph-dashboard" -- start -- -p 3000
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "=== DONE ==="
echo "Landing page: https://smartmoneycryptoph.tech"
echo "Dashboard:    https://dashboard.smartmoneycryptoph.tech/dashboard"
echo ""
echo "Test: curl -I https://smartmoneycryptoph.tech"
echo "Test: curl -I https://dashboard.smartmoneycryptoph.tech"
