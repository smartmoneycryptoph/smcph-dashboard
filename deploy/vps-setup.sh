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
# First push the dashboard folder to GitHub, then clone here
# git clone https://github.com/smartmoneycryptoph/smcph-dashboard.git /opt/smcph-dashboard
# OR copy via rsync from GitHub Actions (see deploy workflow)

echo "=== Copying nginx configs ==="
cp nginx-smartmoneycryptoph.tech.conf /etc/nginx/sites-available/smartmoneycryptoph.tech
cp nginx-smcphbot.tech.conf           /etc/nginx/sites-available/smcphbot.tech

ln -sf /etc/nginx/sites-available/smartmoneycryptoph.tech /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/smcphbot.tech           /etc/nginx/sites-enabled/

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

echo "=== Testing nginx config ==="
nginx -t

echo "=== Starting nginx ==="
systemctl enable nginx
systemctl restart nginx

echo ""
echo "=== Getting SSL certificates ==="
echo "Make sure DNS A records are set FIRST:"
echo "  smartmoneycryptoph.tech  A  187.127.99.76"
echo "  smcphbot.tech            A  187.127.99.76"
echo ""
read -p "DNS records set? Press Enter to continue..."

certbot --nginx \
  -d smartmoneycryptoph.tech \
  -d www.smartmoneycryptoph.tech \
  --non-interactive --agree-tos -m panganting.amerhussien@gmail.com

certbot --nginx \
  -d smcphbot.tech \
  -d www.smcphbot.tech \
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
echo "Dashboard:    https://smcphbot.tech/dashboard"
echo ""
echo "Test: curl -I https://smartmoneycryptoph.tech"
