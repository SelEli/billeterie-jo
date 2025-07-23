# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

# Installer OpenSSL 3 + headers système
RUN apt-get update && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Définir le dossier de travail
WORKDIR /app

# Installer les dépendances NPM
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --force

# Copier tout le code
COPY . .

# Générer le client Prisma (sans migration)
RUN npx prisma generate

# Exposer le port
EXPOSE 3002

# Lancer en dev
CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────
