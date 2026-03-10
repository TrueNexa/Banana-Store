export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card">
      <h2>{product.name}</h2>
      <p>{product.details}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button className="add-btn" onClick={() => onAdd(product)}>
        Add to Cart
      </button>
    </article>
  );
}
