FROM node:20-alpine

ENV TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

# Installer dépendances
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copier le code
COPY . .

# Port par défaut pour Vite/React/Vue
EXPOSE 5173

# Script d'entrée : dev ou prod selon NODE_ENV
CMD if [ "$NODE_ENV" = "production" ]; then \
      npm run build && npx serve -s dist -l 80; \
    else \
      npm run dev -- --host; \
    fi
