const STORAGE_KEY = 'banana-store-cart-v2';
const DELIVERY_FEE = 3;
const FREE_DELIVERY_THRESHOLD = 15;

const cartItemsElement = document.getElementById('cart-items');
const cartMessage = document.getElementById('cart-message');
const itemCountElement = document.getElementById('item-count');
const subtotalElement = document.getElementById('subtotal');
const deliveryElement = document.getElementById('delivery');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkout');
const clearButton = document.getElementById('clear-cart');

let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDelivery(subtotal) {
  return subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
}

function setMessage(message, toast = false) {
  cartMessage.textContent = message;
  cartMessage.classList.toggle('toast', toast);
}

function renderCart() {
  cartItemsElement.innerHTML = '';

  if (cart.length === 0) {
    setMessage('Your cart is empty.');
  } else {
    setMessage('Ready for checkout.');
  }

  cart.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.dataset.id = item.id;

    li.innerHTML = `
      <div class="cart-item-head">
        <strong>${item.name}</strong>
        <span>${formatMoney(item.price * item.qty)}</span>
      </div>
      <div class="cart-item-controls">
        <div class="qty-controls" aria-label="Adjust quantity for ${item.name}">
          <button class="icon-btn" type="button" data-action="decrease" aria-label="Decrease ${item.name}">−</button>
          <span>Qty: ${item.qty}</span>
          <button class="icon-btn" type="button" data-action="increase" aria-label="Increase ${item.name}">+</button>
        </div>
        <button class="icon-btn" type="button" data-action="remove" aria-label="Remove ${item.name}">×</button>
      </div>
    `;

    cartItemsElement.appendChild(li);
  });

  const subtotal = getSubtotal();
  const delivery = getDelivery(subtotal);
  const itemCount = cart.reduce((count, item) => count + item.qty, 0);

  itemCountElement.textContent = String(itemCount);
  subtotalElement.textContent = formatMoney(subtotal);
  deliveryElement.textContent = delivery === 0 ? 'Free' : formatMoney(delivery);
  totalElement.textContent = formatMoney(subtotal + delivery);

  persistCart();
}

function addProduct(card) {
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = Number(card.dataset.price);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  setMessage(`${name} added to cart.`, true);
  renderCart();
}


function playCheckoutSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const context = new AudioCtx();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(660, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.12);

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);

  oscillator.onended = () => {
    context.close();
  };
}

function updateQuantity(id, action) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  if (action === 'increase') {
    item.qty += 1;
  }

  if (action === 'decrease') {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter((entry) => entry.id !== id);
    }
  }

  if (action === 'remove') {
    cart = cart.filter((entry) => entry.id !== id);
  }

  renderCart();
}

document.getElementById('product-grid').addEventListener('click', (event) => {
  const button = event.target.closest('.add-to-cart');
  if (!button) return;

  const card = button.closest('.product-card');
  if (!card) return;

  addProduct(card);
});

cartItemsElement.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const cartItem = button.closest('.cart-item');
  if (!cartItem) return;

  updateQuantity(cartItem.dataset.id, action);
});

clearButton.addEventListener('click', () => {
  cart = [];
  renderCart();
  setMessage('Cart cleared.', true);
});

checkoutButton.addEventListener('click', () => {
  playCheckoutSound();
  if (cart.length === 0) {
    setMessage('Please add bananas before checking out.', true);
    return;
  }

  const total = totalElement.textContent;
  alert(`Order placed! Your total is ${total}.`);
  cart = [];
  renderCart();
  setMessage('Order confirmed. Thank you!', true);
});

renderCart();
