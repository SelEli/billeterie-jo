const fs = require('fs');
const path = require('path');

const scanFolder = (folder) => {
  fs.readdirSync(folder).forEach((file) => {
    const fullPath = path.join(folder, file);

    if (fs.statSync(fullPath).isDirectory()) return;

    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('module.exports = {') && content.includes('router')) {
      console.log(`⚠️ Fichier suspect : ${fullPath} → mélange d'objets et de router`);
    }

    if (content.includes('require("./routes/auth")') && content.includes('{')) {
      console.log(`⚠️ Import possiblement incorrect dans ${fullPath}`);
    }
  });
};

scanFolder(path.join(__dirname, '../routes'));
scanFolder(path.join(__dirname, '../services'));
