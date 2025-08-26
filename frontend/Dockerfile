########################################
# Étape 1 : Build du front avec Node
########################################
FROM node:20-alpine AS build

ENV NODE_ENV=production \
    TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

RUN apk add --no-cache python3 make g++ bash

# Copier uniquement les fichiers de dépendances pour profiter du cache Docker
COPY frontend/package*.json ./
COPY frontend/tsconfig*.json ./

# Installation des dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source du frontend
COPY frontend/. .

# Copier le dossier shared pour les imports @shared/*
COPY shared ./shared

# Build de l'application
RUN npm run build

########################################
# Étape 2 : Serveur web Nginx
########################################
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
