import { useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { products } from './data/products';

export default function App() {
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

  return (
    <main className="container">
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
