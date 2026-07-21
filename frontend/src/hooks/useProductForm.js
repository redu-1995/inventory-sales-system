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
  reorder_level: '',
  status: true,
  image: null
};

export function useProductForm(onSuccess, product = null) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

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

  useEffect(() => {
    if (product) {
 
      setFormData({
        id: product.id ?? product.pk ?? null, 
        name: product.name ?? '',
        sku: product.sku ?? '',
        barcode: product.barcode ?? '',
        category: product.category ?? '', 
        supplier: product.supplier ?? '',
        description: product.description ?? '',
        cost_price: product.cost_price ?? '',
        selling_price: product.selling_price ?? '',
        reorder_level: product.reorder_level ?? product.cost_price_level ?? '', 
        status: product.status ?? true,
        image: null 
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
  }, [product]); 

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

    // 🪛 Fix 3: Support flexible backend key naming structures
    const productId = product?.id || product?.pk || formData?.id;
    const isEditMode = Boolean(productId); 
    
    const validationErrors = validateProduct(formData, isEditMode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'id') return; // Don't append raw primary ID key into data payload
        if (key === 'image') {
          if (formData.image instanceof File) {
            payload.append('image', formData.image);
          }
        } else {
          const value = formData[key];
          if (value !== null && value !== undefined) {
            if (typeof value === 'boolean') {
              payload.append(key, value ? 'true' : 'false');
            } else {
              payload.append(key, String(value));
            }
          }
        }
      });

      // 🪛 Fix 4: Safely routes to update API path
      if (isEditMode) {
        await productAPI.updateProduct(productId, payload);
      } else {
        await productAPI.createProduct(payload);
        resetForm();
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      const serverError = err.response?.data;
      let errorMessage = 'Failed to submit product.';
      
      if (serverError && typeof serverError === 'object') {
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