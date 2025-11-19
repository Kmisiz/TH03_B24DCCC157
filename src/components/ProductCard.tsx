import React from 'react';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-category">{product.category}</div>
      <h3 className="product-name">{product.name}</h3>
      <div className="product-price">{formatPrice(product.price)}</div>
      <div className="product-quantity">Stock: {product.quantity}</div>
      {product.description && (
        <div className="product-description">{product.description}</div>
      )}
    </div>
  );
};

export default ProductCard;
