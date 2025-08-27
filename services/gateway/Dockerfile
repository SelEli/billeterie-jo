FROM node:18-slim

ENV TZ=Europe/Paris \
    PATH=/app/services/gateway/node_modules/.bin:$PATH

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        openssl libssl-dev ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# On se place à la racine projet dans l'image
WORKDIR /app

# Copier le code de gateway et le dossier partagé
COPY services/gateway ./services/gateway
COPY shared ./shared

# Installer les deps dans le bon dossier
WORKDIR /app/services/gateway
RUN npm ci --legacy-peer-deps && npm rebuild bcrypt --force

EXPOSE 3000
CMD ["npm", "run", "dev"]
