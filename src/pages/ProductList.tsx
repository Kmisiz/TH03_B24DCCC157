import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import './ProductList.css';
import debounce from 'lodash.debounce';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
}

interface PaginatedResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Product[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const navigate = useNavigate();
  const limit = 6;

  // Fetch categories only once
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/products/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

const fetchProducts = useCallback(async (page: number, search?: string, category?: string, min?: string, max?: string) => {
  try {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (min) params.append('minPrice', min);
    if (max) params.append('maxPrice', max);

    const response = await fetch(`http://localhost:3000/products?${params}`);
    if (!response.ok) throw new Error('Failed to fetch products');

    const data: PaginatedResponse = await response.json();
    setProducts(data.data);
    setCurrentPage(data.page);
    setTotalPages(data.totalPages);
    setTotalProducts(data.total);
    setError('');
  } catch (err) {
    setError('Error loading products');
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [limit]);


  // Debounced fetch to avoid lag
  const debouncedFetch = useCallback(
    debounce((page: number, search?: string, category?: string, min?: string, max?: string) => {
      fetchProducts(page, search, category, min, max);
    }, 500),
    [fetchProducts]
  );

  useEffect(() => {
    fetchCategories(); // only once
  }, []);

  // Call debounced fetch whenever filters change
  useEffect(() => {
    debouncedFetch(1, searchTerm, selectedCategory, minPrice, maxPrice);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, debouncedFetch]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page, searchTerm, selectedCategory, minPrice, maxPrice);
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  if (loading) return <div className="product-list"><div className="loading">Loading products...</div></div>;
  if (error) return <div className="product-list"><div className="error">{error}</div></div>;

  return (
    <div className="product-list">
      <header>
        <h1>Product Listing</h1>
        <div className="product-info">
          <span>Total Products: {totalProducts}</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <button className="btn-add-product" onClick={() => navigate('/add')}>Add New Product</button>
      </header>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="price-filter">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
            min="0"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
            min="0"
          />
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onClick={handleProductClick} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default ProductList;
