FROM node:18-slim

ENV TZ=Europe/Paris \
    NODE_ENV=development \
    PATH=/app/node_modules/.bin:$PATH

# Dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      netcat-traditional \
      python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier package.json et prisma (chemins adaptés au contexte actuel)
COPY package*.json ./
COPY prisma ./prisma

# Installer deps + Prisma
RUN npm ci --legacy-peer-deps --include=dev \
    && npm rebuild bcrypt --build-from-source \
    && npx prisma generate

# Copier le reste du code
COPY . .

EXPOSE 3001
WORKDIR /app

# Commande : attend DB, push schéma, seed, lance dev
CMD sh -c "until nc -z auth-db 5432; do echo '⏳ Attente DB...'; sleep 2; done && \
           npx prisma db push && \
           if [ \"$SEED_ON_START\" = \"true\" ]; then npm run seed || true; fi && \
           npm run dev"
