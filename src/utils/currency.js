/**
 * TechUz Currency Formatter
 * 
 * Rules:
 * 1. Internally stored as pure integers (e.g., 3450000).
 * 2. Display format: "3 450 000 so'm" for Uzbek Latin, "3 450 000 сум" for Russian.
 * 3. Uses non-breaking spaces for thousand separators.
 */

export function formatUzbekCurrency(amount, language = 'uz') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0\u00A0${language === 'ru' ? 'сум' : "so'm"}`;
  }

  // Ensure integer
  const integerAmount = Math.round(Number(amount));
  
  // Format with non-breaking space (\u00A0) as thousand separator
  const formattedNumber = integerAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

  const suffix = language === 'ru' ? 'сум' : "so'm";
  return `${formattedNumber}\u00A0${suffix}`;
}

/**
 * Parses raw formatted string or input back to integer
 */
export function parseUzbekCurrency(value) {
  if (!value) return 0;
  const digitsOnly = value.toString().replace(/\D/g, '');
  return parseInt(digitsOnly, 10) || 0;
}
