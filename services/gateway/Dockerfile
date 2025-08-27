# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

ENV NODE_ENV=development \
    TZ=Europe/Paris \
    PATH=/app/services/gateway/node_modules/.bin:$PATH

# Installer dépendances système pour modules natifs (même base que Auth)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY services/gateway/package*.json ./services/gateway/

# Installer les dépendances dans le conteneur
WORKDIR /app/services/gateway
RUN npm ci --legacy-peer-deps

# Copier le reste du code
WORKDIR /app
COPY services/gateway ./services/gateway
COPY shared ./shared

WORKDIR /app/services/gateway

# Exposer le port
EXPOSE 3000

CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────
