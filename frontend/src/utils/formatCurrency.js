/**
 * Formats a numeric value into a currency string.
 * @param {number|string} amount - The number or numeric string to format.
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR', 'GBP'). Defaults to 'USD'.
 * @param {string} locale - The locale code (e.g., 'en-US'). Defaults to 'en-US'.
 * @returns {string} - Formatted currency string (e.g., "$128,450.00").
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export default formatCurrency;