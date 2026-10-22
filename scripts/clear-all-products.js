import { db } from '../server/db.js';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('1. Clearing products, categories, brands, and phone models from SQLite...');
  try {
    const resProd = db.prepare('DELETE FROM products').run();
    const resCat = db.prepare('DELETE FROM categories').run();
    const resBrand = db.prepare('DELETE FROM brands').run();
    const resModels = db.prepare('DELETE FROM phone_models').run();

    console.log(`✓ SQLite: Deleted ${resProd.changes} products, ${resCat.changes} categories, ${resBrand.changes} brands, ${resModels.changes} phone models`);
  } catch (err) {
    console.error('Error deleting from SQLite:', err);
  }

  // Check .env for Supabase
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);
    if (urlMatch && keyMatch) {
      const url = urlMatch[1].trim();
      const key = keyMatch[1].trim();
      console.log('2. Clearing tables from Supabase...');
      try {
        const supabase = createClient(url, key);
        await supabase.from('products').delete().neq('id', '___non_existent___');
        await supabase.from('categories').delete().neq('id', '___non_existent___');
        await supabase.from('brands').delete().neq('id', '___non_existent___');
        await supabase.from('phone_models').delete().neq('id', '___non_existent___');
        console.log('✓ Cleared products, categories, brands, and phone_models from Supabase!');
      } catch (err) {
        console.warn('Supabase error:', err.message);
      }
    }
  }

  console.log('Done! All catalog tables are now 100% clean and ready for real data.');
}

main();
