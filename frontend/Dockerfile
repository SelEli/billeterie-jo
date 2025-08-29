########################################
# Étape 1 : Build du frontend avec Node
########################################
FROM node:20-alpine AS build

ENV TZ=Europe/Paris \
    PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

# Dépendances système minimales pour builder
RUN apk add --no-cache python3 make g++ bash

# Copier uniquement les fichiers de dépendances pour tirer parti du cache Docker
COPY frontend/package*.json frontend/tsconfig*.json ./frontend/

# Installer les dépendances
WORKDIR /app/frontend
RUN npm ci --legacy-peer-deps

# Copier le reste du code source du frontend
COPY frontend/ ./ 
# Copier le dossier partagé (librairies communes)
COPY shared/ ../shared

# Build de l'application (dossier dist ou build selon ton framework)
RUN npm run build

########################################
# Étape 2 : Serveur web Nginx pour le frontend
########################################
FROM nginx:alpine

# Remplacer la conf par défaut par celle du frontend
# ⚠️ Assure-toi d'avoir bien créé le fichier frontend/default.conf dans ton repo
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/default.conf /etc/nginx/conf.d/default.conf

# Copier le build statique généré à l'étape précédente
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Exposer le port HTTP
EXPOSE 80

# Lancer Nginx en avant-plan
CMD ["nginx", "-g", "daemon off;"]
