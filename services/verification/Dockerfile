# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

# Variables d'environnement
ENV TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

# Installer dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier
COPY services/verification/package*.json ./services/verification/

# Installer les dépendances NPM avec cache Docker
RUN cd services/verification && npm ci --legacy-peer-deps && npm rebuild bcrypt --force

# Copier tout le reste du code
COPY services/verification ./services/verification
COPY shared ./shared
RUN rm -rf services/verification/node_modules

# Générer le client Prisma
RUN cd services/verification && npx prisma generate

# Exposer le port
EXPOSE 3004

# Dossier de travail final = service Verification
WORKDIR /app/services/verification

# Commande par défaut
CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────