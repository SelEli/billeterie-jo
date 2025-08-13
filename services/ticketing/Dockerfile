# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

# Variables d'environnement (adaptées à ton app)
ENV NODE_ENV=development \
    TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

# Installer OpenSSL 3 + dépendances de build (nécessaires à bcrypt, Prisma, etc.)
RUN apt-get update && \
    apt-get install -y openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier
COPY package*.json ./

# Installer les dépendances NPM avec cache Docker
RUN npm ci --legacy-peer-deps && npm rebuild bcrypt --force

# Copier tout le reste du code
COPY . .

# Générer le client Prisma (sans lancer de migrations)
RUN npx prisma generate

# Port exposé (backend Event/Ticketing)
EXPOSE 3002

# Commande par défaut
CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────
