########################################
# Étape 1 : Build du front avec Node
########################################
FROM node:20-alpine AS build

ENV TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

# Dépendances système minimales pour builder
RUN apk add --no-cache python3 make g++ bash

# Copier uniquement les fichiers de dépendances pour profiter du cache
COPY frontend/package*.json ./frontend/
COPY frontend/tsconfig*.json ./frontend/

# Installer les dépendances dans le conteneur Linux
WORKDIR /app/frontend
RUN npm ci --legacy-peer-deps

# Copier le reste du code source du frontend
COPY frontend/ ./ 
# Copier le dossier partagé
COPY shared/ ../shared

# Build de l'application
RUN npm run build

########################################
# Étape 2 : Serveur web Nginx
########################################
FROM nginx:alpine

# Remplacer la conf par la tienne
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build statique
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
