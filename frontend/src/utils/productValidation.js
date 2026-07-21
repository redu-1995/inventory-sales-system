export const validateProduct = (formData, isEditMode = true) => {
  const errors = {};

  // Core fields
  if (!formData.name?.trim()) errors.name = 'Product name is required';
  if (!formData.category) errors.category = 'Please select a category';

  // Only require SKU validation if we aren't in edit mode (since it's immutable/disabled anyway)
  if (!isEditMode && !formData.sku?.trim()) {
    errors.sku = 'SKU code is required';
  }


  // Price validation calculations
  const cost = parseFloat(formData.cost_price);
  const selling = parseFloat(formData.selling_price);

  if (isNaN(cost) || cost < 0) {
    errors.cost_price = 'Cost price must be 0 or greater';
  }
  
  if (isNaN(selling) || selling <= 0) {
    errors.selling_price = 'Selling price must be greater than 0';
  } else if (!isNaN(cost) && selling <= cost) {
    errors.selling_price = 'Selling price should be higher than cost price';
  }

  return errors;
};