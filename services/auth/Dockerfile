# Base image : Node 18 slim
FROM node:18-slim

# Variables d'environnement
ENV NODE_ENV=development \
    TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

# Installer dépendances système pour bcrypt, Prisma, etc.
RUN apt-get update && \
    apt-get install -y openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installation tolérante (pas de blocage sur lockfile)
RUN npm install --legacy-peer-deps && npm rebuild bcrypt --force

# Copier le reste du code
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Commande par défaut
CMD ["npm", "run", "dev"]
