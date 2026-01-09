# Deployment Guide — benign-fashion

Target: Ubuntu 22.04 (Hostinger VPS)
Domain: www.benignfashion.com
Stack: Next.js frontend, Node/Express (TypeScript) backend, MySQL, PM2, Nginx, Certbot (Lets Encrypt)

This guide sets up both apps behind Nginx with HTTPS, runs them via PM2, and configures MySQL. It matches this repos structure:
- Frontend: `benign-fashion-frontend` (Next.js 15)
- Backend: `benign-fashion-backend` (TypeScript, Drizzle ORM, MySQL)

---

## Prerequisites
- DNS A records for `benignfashion.com` and `www.benignfashion.com` pointing to your VPS IP.
- SSH access to the VPS.
- MySQL backup (`backup.sql`) available on the server.

---

## 1) Create a deploy user and update system
```bash
ssh root@YOUR_VPS_IP
sudo apt update && sudo apt upgrade -y
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy
```

Optional: copy your SSH public key to `/home/deploy/.ssh/authorized_keys`.

---

## 2) Install essentials, Node, PM2, Nginx, Certbot, MySQL
```bash
# base tools
sudo apt install -y git build-essential curl ufw

# Nginx + Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx

# MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation  # interactive hardening

# Node via nvm (recommended)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Install an LTS (Node 20 or 22), or keep Node 24 if already installed
nvm install --lts
nvm use --lts
node -v

# PM2
npm install -g pm2
```

Firewall (UFW):
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # opens 80 and 443
sudo ufw enable
sudo ufw status
```

---

## 3) MySQL: create DB/user and import backup
```bash
# adjust names/password to your needs
sudo mysql -e "CREATE DATABASE benign_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
sudo mysql -e "CREATE USER 'benign_user'@'localhost' IDENTIFIED BY 'CHANGE_ME';"
sudo mysql -e "GRANT ALL PRIVILEGES ON benign_db.* TO 'benign_user'@'localhost'; FLUSH PRIVILEGES;"

# import backup (adjust path)
sudo mysql benign_db < /home/deploy/benign-fashion/benign-fashion-backend/backup.sql
```

---

## 4) Clone repository and set environment variables
```bash
cd /home/deploy
git clone <YOUR_REPO_URL> benign-fashion
cd benign-fashion
```

Backend `.env` (use these variables; theyre read in `src/config/database.ts` and auth utils):
```env
# /home/deploy/benign-fashion/benign-fashion-backend/.env
PORT=4000
DB_HOST=localhost
DB_USER=benign_user
DB_PASSWORD=CHANGE_ME
DB_NAME=benign_db
DB_PORT=3306

# Auth
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING
ACCESS_TOKEN_EXPIRES_IN=24h
```

Frontend `.env`:
```env
# /home/deploy/benign-fashion/benign-fashion-frontend/.env
# Point frontend to the API via domain (Nginx will proxy /api to backend)
NEXT_PUBLIC_API_BASE_URL=https://www.benignfashion.com/api
```

Protect env files:
```bash
chmod 600 benign-fashion-backend/.env benign-fashion-frontend/.env
```

---

## 5) Build and run with PM2

Backend:
```bash
cd /home/deploy/benign-fashion/benign-fashion-backend
npm ci
npm run build     # compiles TS to dist/
# IMPORTANT: start the compiled JS
pm2 delete benign-backend || true
pm2 start "node dist/app.js" --name benign-backend --cwd /home/deploy/benign-fashion/benign-fashion-backend
pm2 save
```

Frontend (Next.js):
```bash
cd /home/deploy/benign-fashion/benign-fashion-frontend
npm ci
npm run build
pm2 delete benign-frontend || true
pm2 start "npm run start" --name benign-frontend --cwd /home/deploy/benign-fashion/benign-fashion-frontend
pm2 save
```

(Optional) Use an ecosystem file to manage both apps together:
```javascript
// /home/deploy/benign-fashion/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'benign-backend',
      cwd: './benign-fashion-backend',
      script: 'node',
      args: 'dist/app.js',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'benign-frontend',
      cwd: './benign-fashion-frontend',
      script: 'npm',
      args: 'start',
      env: { NODE_ENV: 'production' }
    }
  ]
}
```
Start via ecosystem:
```bash
pm2 start /home/deploy/benign-fashion/ecosystem.config.js --env production
pm2 save
sudo pm2 startup systemd -u deploy --hp /home/deploy  # follow the printed command
```

---

## 6) Nginx reverse proxy
Create `/etc/nginx/sites-available/benignfashion`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name benignfashion.com www.benignfashion.com;

    # Frontend (Next.js) at root
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API under /api
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optional: serve backend uploads directly
    location /uploads/ {
        alias /home/deploy/benign-fashion/benign-fashion-backend/uploads/;
    }
}
```
Enable and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/benignfashion /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7) HTTPS (Lets Encrypt)
```bash
sudo certbot --nginx -d benignfashion.com -d www.benignfashion.com
sudo certbot renew --dry-run
```
Certbot will update Nginx to redirect HTTP  HTTPS automatically.

---

## 8) CORS configuration (backend)
`src/app.ts` CORS is configured to allow both localhost and production domains:
```ts
app.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      const allowed = [
        'http://localhost:3000',
        'https://benignfashion.com',
        'https://www.benignfashion.com',
      ]
      if (!origin || allowed.includes(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'))
    },
  })
)
```

---

## 9) Verification & health checks
```bash
# PM2 status and logs
pm2 ls
pm2 logs benign-backend --lines 200
pm2 logs benign-frontend --lines 200

# Backend listening
ss -ltnp | grep :4000

# Direct API (on server)
curl -i http://127.0.0.1:4000/api/categories
curl -i http://127.0.0.1:4000/api/products

# Through domain (HTTPS)
curl -I https://www.benignfashion.com
curl -i https://www.benignfashion.com/api/categories

# MySQL service
sudo systemctl status mysql
mysql -u benign_user -p -e "SELECT 1;" benign_db

# Nginx
sudo nginx -t
sudo systemctl status nginx
```

Browser: open https://www.benignfashion.com and check DevTools  Network: requests should hit `https://www.benignfashion.com/api/*` and return 200.

---

## 10) Common issues
- Backend crashed with `MODULE_NOT_FOUND: src/app.js`  Fix: backend now starts `node dist/app.js`. Run `npm run build`, then PM2 start `node dist/app.js`.
- CORS errors  Ensure your frontend origin is allowed (localhost and both benignfashion.com variants). Keep `credentials: true` only when needed.
- 502/504 via Nginx  Backend or frontend not running, wrong port, or firewall. Check PM2 logs, ensure ports 3000/4000 are listening.
- JWT errors  Ensure `JWT_SECRET` is set.
- DB connection issues  Check `DB_*` variables and privileges; confirm MySQL is running.

---

## Maintenance
```bash
# Restart apps
pm2 restart benign-backend
pm2 restart benign-frontend

# Update code
cd /home/deploy/benign-fashion
git pull
(cd benign-fashion-backend && npm ci && npm run build && pm2 restart benign-backend)
(cd benign-fashion-frontend && npm ci && npm run build && pm2 restart benign-frontend)

# Renew certs
sudo certbot renew
```

---

## Notes
- Keep secrets out of git; `.env` files should be owned by `deploy` and mode 600.
- Consider using Docker + docker-compose for reproducible deployments.
- Backup MySQL regularly (mysqldump or snapshots).
