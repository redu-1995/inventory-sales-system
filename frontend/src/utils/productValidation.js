export const validateProduct = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) errors.name = 'Product name is required';
  if (!formData.sku?.trim()) errors.sku = 'SKU code is required';
  if (!formData.category) errors.category = 'Please select a category';
  if (!formData.supplier) errors.supplier = 'Please assign a supplier';

  const cost = parseFloat(formData.cost_price);
  const selling = parseFloat(formData.selling_price);

  if (isNaN(cost) || cost < 0) errors.cost_price = 'Cost price must be 0 or greater';
  if (isNaN(selling) || selling <= 0) {
    errors.selling_price = 'Selling price must be greater than 0';
  } else if (selling <= cost) {
    errors.selling_price = 'Selling price should be higher than cost price';
  }

  return errors;
};