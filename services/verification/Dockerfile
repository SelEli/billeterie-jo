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
      g++ \
      netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail racine
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier (pour profiter du cache Docker)
COPY package*.json ./
COPY prisma ./prisma

# Installer les dépendances NPM
RUN npm ci --legacy-peer-deps && npm rebuild bcrypt --force && npx prisma generate

# Copier le reste du code du service Verification
COPY . .

# Exposer le port du service Verification
EXPOSE 3004

# Commande : attendre DB → push schéma → seed → lancer dev
CMD sh -c "until nc -z verification-db 5432; do echo '⏳ Attente DB verification...'; sleep 2; done && \
           npx prisma db push && \
           if [ \"$SEED_ON_START\" = \"true\" ]; then npm run seed || true; fi && \
           npm run dev"
# ─────────────────────────────────────────────────────────────
