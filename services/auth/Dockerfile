FROM node:18

# 🔧 Dossier de travail dans le conteneur
WORKDIR /app

# 📦 Copie et installation des dépendances
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --force

# 📁 Copie explicite du reste des fichiers
COPY . .

# 🔄 Prisma : génération du client uniquement (pas de migration ici)
RUN npx prisma generate

# 🚀 Lancement du service en mode dev
CMD ["npm", "run", "dev"]
