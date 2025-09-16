# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

# Variables d'environnement
ENV TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

# Installer dépendances système nécessaires à certaines libs Node (ex: bcrypt)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      openssl \
      libssl-dev \
      ca-certificates \
      python3 \
      make \
      g++ && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail racine
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier (pour profiter du cache Docker)
COPY package*.json ./

# Installer les dépendances NPM
RUN npm ci --legacy-peer-deps && npm rebuild bcrypt --force

# Copier le reste du code du service Payment
COPY . .

# Exposer le port du service (par défaut 3003, à aligner avec .env)
EXPOSE 3003

# Commande par défaut
CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────
