/**
 * Formats a numeric value into a currency string (defaults to Ethiopian Birr - ETB).
 * @param {number|string} amount - The numeric value to format.
 * @param {Object} options - Formatting options.
 * @param {string} [options.currency='ETB'] - Currency code ('ETB', 'USD', etc.).
 * @param {string} [options.locale='en-ET'] - Locale ('en-ET' for English/Ethiopia, 'am-ET' for Amharic).
 * @param {boolean} [options.customSymbol=false] - If true, formats strictly as "{value} Br".
 * @returns {string} Formatted currency string (e.g., "ETB 1,250.00" or "1,250.00 Br").
 */
export const formatCurrency = (amount, { currency = 'ETB', locale = 'en-ET', customSymbol = false } = {}) => {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return customSymbol ? '0.00 Br' : 'ETB 0.00';
  }

  if (customSymbol && currency === 'ETB') {
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);

    return `${formattedNumber} Br`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export default formatCurrency;