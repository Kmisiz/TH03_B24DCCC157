import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
}

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      navigate('/');
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="btn-back">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="error">Product not found</div>
        <button onClick={() => navigate('/')} className="btn-back">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Products
        </button>

        <div className="product-detail-content">
          <div className="product-header">
            <h1>{product.name}</h1>
            <span className="product-category">{product.category}</span>
          </div>

          <div className="product-info-grid">
            <div className="info-item">
              <label>Price:</label>
              <span className="product-price">{formatPrice(product.price)}</span>
            </div>

            <div className="info-item">
              <label>Stock Quantity:</label>
              <span className="product-quantity">{product.quantity} units</span>
            </div>
          </div>

          {product.description && (
            <div className="product-description-section">
              <h3>Description</h3>
              <p className="product-description">{product.description}</p>
            </div>
          )}

          <div className="product-actions">
            <button onClick={handleEdit} className="btn-edit">
              Edit Product
            </button>
            <button onClick={handleDelete} className="btn-delete">
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
