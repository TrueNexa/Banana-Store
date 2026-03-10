import { useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { products } from './data/products';

const FIXED_USERNAME = 'banana-admin';
const FIXED_PASSWORD = 'banana123';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [cartItems, setCartItems] = useState([]);

  function handleAddToCart(product) {
    setCartItems((prev) => [...prev, product]);
  }

  function handleCheckout(total) {
    if (cartItems.length === 0) {
      alert('Please add some bananas before checkout.');
      return;
    }

    alert(`Thanks! Your banana order total is $${total.toFixed(2)}.`);
    setCartItems([]);
  }


  function handleLogin(event) {
    event.preventDefault();

    if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setPassword('');
      return;
    }

    setLoginError('Invalid username or password. Try again.');
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCartItems([]);
    setUsername('');
    setPassword('');
    setLoginError('');
  }

  if (!isLoggedIn) {
    return (
      <main className="auth-container">
        <section className="auth-card" aria-label="Login form">
          <h1>Banana Store Login</h1>
          <p className="subtitle">Use the fixed credentials to continue.</p>
          <p className="credentials">Username: banana-admin | Password: banana123</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />

            {loginError ? <p className="login-error">{loginError}</p> : null}

            <button id="login-btn" type="submit">
              Login
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <Header />

      <section className="products" aria-label="Banana products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
        ))}
      </section>

      <Cart items={cartItems} onCheckout={handleCheckout} />
    </main>
  );
}
