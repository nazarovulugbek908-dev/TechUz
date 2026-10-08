import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const uzPath = path.join(rootDir, 'src', 'i18n', 'uz.json');
const ruPath = path.join(rootDir, 'src', 'i18n', 'ru.json');
const srcDir = path.join(rootDir, 'src');

let hasErrors = false;

console.log('🔍 Checking TechUz i18n consistency...\n');

// 1. Load Dictionaries
const uz = JSON.parse(fs.readFileSync(uzPath, 'utf8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));

function getFlatKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getFlatKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValue(obj, keyPath) {
  return keyPath.split('.').reduce((acc, k) => acc?.[k], obj);
}

const uzKeys = getFlatKeys(uz);
const ruKeys = getFlatKeys(ru);

const missingInRu = uzKeys.filter((k) => !ruKeys.includes(k));
const missingInUz = ruKeys.filter((k) => !uzKeys.includes(k));

if (missingInRu.length > 0) {
  console.error('❌ Keys present in uz.json but MISSING in ru.json:');
  missingInRu.forEach((k) => console.error(`   - ${k}`));
  hasErrors = true;
}

if (missingInUz.length > 0) {
  console.error('❌ Keys present in ru.json but MISSING in uz.json:');
  missingInUz.forEach((k) => console.error(`   - ${k}`));
  hasErrors = true;
}

if (missingInRu.length === 0 && missingInUz.length === 0) {
  console.log(`✅ Dictionary keys match perfectly (${uzKeys.length} keys in each dictionary).`);
}

// 2. Check for Cyrillic characters in uz.json values
const cyrillicRegex = /[\u0400-\u04FF]/;
let cyrillicInUz = [];

for (const key of uzKeys) {
  const val = String(getValue(uz, key));
  if (cyrillicRegex.test(val)) {
    cyrillicInUz.push({ key, val });
  }
}

if (cyrillicInUz.length > 0) {
  console.error('\n❌ Cyrillic characters found inside uz.json values (must be Uzbek Latin):');
  cyrillicInUz.forEach(({ key, val }) => console.error(`   - [${key}]: "${val}"`));
  hasErrors = true;
} else {
  console.log('✅ No Cyrillic characters found in uz.json.');
}

// 3. Scan src/**/*.jsx for hardcoded text outside i18n & mock data
const commonUzbekWords = [
  'bosh sahifa', 'katalog', 'savat', 'savatga', 'profil', 'kirish', "ro'yxatdan",
  'xush kelibsiz', 'buyurtma', 'yetkazib berish', 'kafolat', 'qidiruv', 'tozalash',
  'barchasi', 'chegirma', 'yangi', 'original', 'chiqish', 'dona', 'so\'m', 'narx'
];

function scanFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        files = files.concat(scanFiles(fullPath));
      }
    } else if (entry.name.endsWith('.jsx')) {
      // Exclude showcase page if it contains explicit dev documentation
      files.push(fullPath);
    }
  }
  return files;
}

const jsxFiles = scanFiles(srcDir);
let hardcodedFindings = [];

for (const file of jsxFiles) {
  // We can skip ShowcasePage from strict production scanning or inspect it as well
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  if (relPath.includes('pages/ShowcasePage.jsx')) continue;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Strip comments, imports, console, t('...'), and svg paths
    const trimmed = line.trim();
    if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
    if (trimmed.includes("t('") || trimmed.includes('t("')) return;

    // Check for Cyrillic outside of i18n files
    if (cyrillicRegex.test(trimmed)) {
      hardcodedFindings.push({
        file: relPath,
        line: idx + 1,
        text: trimmed,
        reason: 'Contains Cyrillic text'
      });
    }

    // Check for obvious hardcoded Uzbek words in raw JSX tags like >Bosh sahifa< or "Katalog"
    const lower = trimmed.toLowerCase();
    for (const word of commonUzbekWords) {
      const tagMatch = new RegExp(`>[^<]*\\b${word}\\b[^<]*<`, 'i');
      const attrMatch = new RegExp(`(placeholder|title|aria-label|label)=["'][^"']*\\b${word}\\b[^"']*["']`, 'i');
      if (tagMatch.test(trimmed) || attrMatch.test(trimmed)) {
        // avoid matching t('...')
        if (!trimmed.includes("t('") && !trimmed.includes('t("')) {
          hardcodedFindings.push({
            file: relPath,
            line: idx + 1,
            text: trimmed,
            reason: `Hardcoded phrase "${word}"`
          });
          break;
        }
      }
    }
  });
}

if (hardcodedFindings.length > 0) {
  console.error('\n⚠️ Potential hardcoded strings found in JSX files:');
  hardcodedFindings.forEach(({ file, line, text, reason }) => {
    console.error(`   ${file}:${line} [${reason}] -> ${text}`);
  });
  hasErrors = true;
} else {
  console.log('✅ No hardcoded user-facing strings detected in JSX files.');
}

console.log('\n----------------------------------------');
if (hasErrors) {
  console.error('❌ i18n check FAILED! Please fix the reported issues.');
  process.exit(1);
} else {
  console.log('🎉 All i18n checks PASSED flawlessly!');
  process.exit(0);
}
