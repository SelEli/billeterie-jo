# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

# Variables d'environnement
ENV NODE_ENV=development \
    TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

# Installer dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier
COPY services/payment/package*.json ./services/payment

# Installer les dépendances NPM avec cache Docker
RUN cd services/payment && npm ci --legacy-peer-deps && npm rebuild bcrypt --force

# Copier tout le reste du code
COPY services/payment ./services/payment
COPY shared ./shared
RUN rm -rf services/payment/node_modules

# Générer le client Prisma
RUN cd services/payment && npx prisma generate

# Exposer le port
EXPOSE 3003

# Dossier de travail final = service Payment
WORKDIR /app/services/payment

# Commande par défaut
CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────