const cartItems = [];

const cartList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

function renderCart() {
  cartList.innerHTML = '';

  if (cartItems.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Your cart is empty';
    cartList.appendChild(empty);
    cartTotal.textContent = '$0.00';
    return;
  }

  let total = 0;

  cartItems.forEach((item) => {
    const line = document.createElement('li');
    line.innerHTML = `<span>${item.name}</span><strong>$${item.price.toFixed(2)}</strong>`;
    cartList.appendChild(line);
    total += item.price;
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

document.querySelectorAll('.add-btn').forEach((button) => {
  button.addEventListener('click', () => {
    cartItems.push({
      name: button.dataset.product,
      price: Number(button.dataset.price),
    });

    renderCart();
  });
});

checkoutBtn.addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert('Please add some bananas before checkout.');
    return;
  }

  alert(`Thanks! Your banana order total is ${cartTotal.textContent}.`);
  cartItems.length = 0;
  renderCart();
});

renderCart();
