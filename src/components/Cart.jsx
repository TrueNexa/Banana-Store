function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export default function Cart({ items, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <aside className="cart" aria-live="polite">
      <h2>Your Cart</h2>
      <ul>
        {items.length === 0 ? (
          <li>Your cart is empty</li>
        ) : (
          items.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              <span>{item.name}</span>
              <strong>{formatPrice(item.price)}</strong>
            </li>
          ))
        )}
      </ul>
      <p className="total">
        Total: <span>{formatPrice(total)}</span>
      </p>
      <button id="checkout-btn" onClick={() => onCheckout(total)}>
        Checkout
      </button>
    </aside>
  );
}
