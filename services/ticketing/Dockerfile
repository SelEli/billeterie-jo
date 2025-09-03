# ─────────────────────────────────────────────────────────────
# Base image : Node 18 slim (Debian Bookworm)
FROM node:18-slim

# Variables d'environnement
ENV TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

# Installer dépendances système
RUN apt-get update && \
    apt-get install -y openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier
COPY services/ticketing/package*.json ./services/ticketing/

# Installer les dépendances NPM avec cache Docker
RUN cd services/ticketing && npm ci --legacy-peer-deps && npm rebuild bcrypt --force

# Copier tout le reste du code
COPY services/ticketing ./services/ticketing
COPY shared ./shared
RUN rm -rf services/ticketing/node_modules

# Générer le client Prisma
RUN cd services/ticketing && npx prisma generate

# Exposer le port
EXPOSE 3002

# Dossier de travail final = service Ticketing
WORKDIR /app/services/ticketing

# Commande par défaut
CMD ["npm", "run", "dev"]
# ─────────────────────────────────────────────────────────────
