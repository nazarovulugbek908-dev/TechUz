import uz from './uz.json';
import ru from './ru.json';

export const dictionaries = {
  uz,
  ru
};

export function getTranslation(key, lang = 'uz') {
  const dictionary = dictionaries[lang] || dictionaries.uz;
  const keys = key.split('.');
  
  let result = dictionary;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // Fallback to uz if missing in ru
      let fallback = dictionaries.uz;
      for (const fbKey of keys) {
        if (fallback && typeof fallback === 'object' && fbKey in fallback) {
          fallback = fallback[fbKey];
        } else {
          return key;
        }
      }
      return fallback || key;
    }
  }
  return result || key;
}
