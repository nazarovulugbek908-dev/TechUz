/**
 * Formats Uzbekistan phone numbers (+998 XX XXX XX XX)
 */
export function formatUzbekPhone(value) {
  if (!value) return '+998 ';
  
  // Clean all non-digit characters
  let digits = value.replace(/\D/g, '');
  
  // If starts with 998, keep it; if not, prepend 998
  if (!digits.startsWith('998')) {
    if (digits.startsWith('9') && digits.length >= 2) {
      digits = '998' + digits;
    } else {
      digits = '998' + digits;
    }
  }
  
  // Limit to 12 digits (998 + 9 digits)
  digits = digits.slice(0, 12);

  const country = digits.slice(0, 3);
  const operator = digits.slice(3, 5);
  const part1 = digits.slice(5, 8);
  const part2 = digits.slice(8, 10);
  const part3 = digits.slice(10, 12);

  let formatted = `+${country}`;
  if (operator) formatted += ` (${operator}`;
  if (operator.length === 2) formatted += `) `;
  if (part1) formatted += `${part1}`;
  if (part2) formatted += `-${part2}`;
  if (part3) formatted += `-${part3}`;

  return formatted;
}

/**
 * Generates a unique user-friendly TechUz Order ID
 * Example: "UZ-749201"
 */
export function generateOrderId() {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `UZ-${randomDigits}`;
}

/**
 * Formats Date string to readable local format
 */
export function formatDate(dateString, language = 'uz') {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
