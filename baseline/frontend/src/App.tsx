import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import ProductList from './components/ProductList/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import './App.css';

const HomePage: React.FC = () => {
  const { state, dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      dispatch({ type: 'SET_PRODUCTS', payload: data });
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!state.token) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), message: 'Please login first', type: 'error' },
      });
      return;
    }

    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), message: 'Added to cart', type: 'success' },
      });
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return <ProductList products={products} onAddToCart={handleAddToCart} />;
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return <Cart onCheckout={handleCheckout} />;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return <Checkout onSuccess={handleSuccess} />;
};

const LoginPage: React.FC = () => {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.token) {
        dispatch({ type: 'SET_USER', payload: { user: data.user, token: data.token } });
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useCart();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo">
            E-Commerce Benchmark
          </Link>
          <nav>
            <Link to="/">Products</Link>
            {state.user && <Link to="/cart">Cart ({state.items.length})</Link>}
            {state.user ? (
              <>
                <span className="username">{state.user.username}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
