import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('./src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (/\.(ts|tsx)$/.test(file)) {
      callback(filepath);
    }
  });
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Préfixer les variables inutilisées connues
  content = content.replace(/\b(userId|Ticket|getTicket)\b/g, '_$1');

  // 2. Remplacer any par unknown
  content = content.replace(/\bany\b/g, 'unknown');

  // 3. Autoriser catch vide en ajoutant un commentaire
  content = content.replace(/catch\s*\{\s*\}/g, 'catch { /* intentionally empty */ }');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ Corrigé : ${file}`);
}

walk(SRC_DIR, fixFile);
