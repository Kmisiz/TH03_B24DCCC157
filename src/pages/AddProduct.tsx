import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import './AddProduct.css';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
}

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setLoading(true);
      setError('');

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description
      };

      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="add-product">
      <div className="add-product-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={false}
        />

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">Adding product...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
