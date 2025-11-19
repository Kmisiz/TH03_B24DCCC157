import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Product Manager
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/add" className="nav-link">
            Add Product
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
