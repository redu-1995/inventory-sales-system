import { useState, useEffect } from 'react';
import { validateProduct } from '../utils/productValidation';
import { productAPI } from '../services/productService';

const INITIAL_STATE = {
  name: '',
  sku: '',
  barcode: '',
  category: '',
  supplier: '',
  description: '',
  cost_price: '',
  selling_price: '',
  status: true,
  image: null
};

export function useProductForm(onSuccess) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for dropdown selections
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch dropdown collections on mount
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [cats, sups] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getSuppliers()
        ]);
        setCategories(cats);
        setSuppliers(sups);
      } catch (err) {
        console.error("Failed to load select parameters:", err);
      }
    };
    loadDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateProduct(formData);
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    setIsSubmitting(true);
    
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        if (formData.image instanceof File) {
          payload.append('image', formData.image);
        }
      } else {
        // Fix: Clean up empty strings, nulls, and undefined values
        const value = formData[key];
        
        if (value !== null && value !== undefined && value !== '') {
          payload.append(key, value);
        }
      }
    });

    await productAPI.createProduct(payload);
    resetForm();
    if (onSuccess) onSuccess();
  } catch (err) {
    // Better server error extractor to catch DRF serializer validation objects
    const serverError = err.response?.data;
    let errorMessage = 'Failed to submit product.';
    
    if (serverError && typeof serverError === 'object') {
      // Combines Django field errors into a readable message if validation failed
      errorMessage = Object.entries(serverError)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join(' | ');
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setErrors({ server: errorMessage });
  } finally {
    setIsSubmitting(false);
  }
};

  return { formData, errors, isSubmitting, categories, suppliers, handleChange, handleImageChange, handleSubmit, resetForm };
}