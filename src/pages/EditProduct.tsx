import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import './EditProduct.css';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
}

const EditProduct: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            throw new Error('Failed to fetch product');
          }
          return;
        }
        const data: Product = await response.json();
        setProduct(data);
        setError('');
      } catch (err) {
        setError('Error loading product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setSubmitting(true);
      setError('');

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description
      };

      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      navigate(`/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/products/${id}`);
  };

  const getInitialFormData = (): ProductFormData | undefined => {
    if (!product) return undefined;

    return {
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description
    };
  };

  if (loading) {
    return (
      <div className="edit-product">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="edit-product">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="btn-back">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="edit-product">
        <div className="error">Product not found</div>
        <button onClick={() => navigate('/')} className="btn-back">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product">
      <div className="edit-product-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <ProductForm
          initialData={getInitialFormData()}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={true}
        />

        {submitting && (
          <div className="loading-overlay">
            <div className="loading-spinner">Updating product...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
