// main.js - Lógica do Storefront
const defaultProducts = [
  // Educação Infantil
  { id: 1, name: 'Camiseta de Uniforme - Branca', description: 'Camiseta de manga curta com logo bordado.', price: 45.00, category: 'Infantil', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, name: 'Bermuda Tactel - Azul', description: 'Bermuda leve e confortável para os pequenos.', price: 50.00, category: 'Infantil', image: 'https://images.unsplash.com/photo-1591195853828-11abb590143d?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: 'Agasalho Moletom - Conjunto', description: 'Conjunto quentinho de calça e blusa.', price: 130.00, category: 'Infantil', image: 'https://images.unsplash.com/photo-1434389674669-e08b4cac3105?q=80&w=2005&auto=format&fit=crop' },
  // Ensino Fundamental I
  { id: 4, name: 'Camiseta Gola V', description: 'Camiseta tradicional com gola V confortável.', price: 48.00, category: 'Fundamental I', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop' },
  { id: 5, name: 'Saia/Shorts Escolar', description: 'Saia com shorts embutido para meninas.', price: 65.00, category: 'Fundamental I', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=2050&auto=format&fit=crop' },
  { id: 6, name: 'Calça de Helanca - Unissex', description: 'Calça com reforço nos joelhos. Azul marinho.', price: 85.00, category: 'Fundamental I', image: 'https://images.unsplash.com/photo-1624378441864-6da7c4714b6d?q=80&w=2070&auto=format&fit=crop' },
  // Ensino Fundamental II
  { id: 7, name: 'Polo Branca com Detalhes', description: 'Camisa Polo com gola estruturada.', price: 60.00, category: 'Fundamental II', image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1974&auto=format&fit=crop' },
  { id: 8, name: 'Jaqueta Quebra-Vento', description: 'Jaqueta resistente a vento e garoa leve.', price: 150.00, category: 'Fundamental II', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop' },
  { id: 9, name: 'Calça Bailarina', description: 'Calça com elastano, modelagem mais ajustada.', price: 90.00, category: 'Fundamental II', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1974&auto=format&fit=crop' },
  // Ensino Médio
  { id: 10, name: 'Blusão Colegial Estilo Americano', description: 'Blusão estilo varsity exclusivo do Ensino Médio.', price: 180.00, category: 'Médio', image: 'https://images.unsplash.com/photo-1549643276-fbc2d8ca12ed?q=80&w=2069&auto=format&fit=crop' },
  { id: 11, name: 'Camiseta Básica - Ensino Médio', description: 'Camiseta de algodão gola redonda azul marinho.', price: 55.00, category: 'Médio', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974&auto=format&fit=crop' },
  { id: 12, name: 'Calça Jogger Unissex', description: 'Calça moderna com elástico na barra.', price: 110.00, category: 'Médio', image: 'https://images.unsplash.com/photo-1613852348851-df1739db8201?q=80&w=1982&auto=format&fit=crop' }
];

let products = JSON.parse(localStorage.getItem('sueli_products'));
// Se os produtos armazenados não tiverem categoria (versão antiga), nós sobrescrevemos
if (!products || products.length === 0 || !products[0].category) {
  products = defaultProducts;
  localStorage.setItem('sueli_products', JSON.stringify(products));
}

let cart = [];
let currentCategory = 'Todos';

// DOM Elements
const productListEl = document.getElementById('product-list');
const cartBtn = document.getElementById('cart-btn');
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const checkoutForm = document.getElementById('checkout-form');

// Render Products
function renderProducts() {
  productListEl.innerHTML = '';
  
  const filteredProducts = currentCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === currentCategory);

  if (filteredProducts.length === 0) {
    productListEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: #666;">Nenhum produto cadastrado nesta categoria.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <span class="product-price">R$ ${Number(product.price).toFixed(2).replace('.', ',')}</span>
        <button class="btn btn-secondary add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
      </div>
    `;
    productListEl.appendChild(card);
  });

  // Attach event listeners to Add buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

// Category Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.getAttribute('data-category');
    renderProducts();
  });
});

// Cart Logic
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  updateCartUI();
  
  // Show a small UI feedback
  toggleModal();
}

function updateCartQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  cartCountEl.textContent = totalItems;

  cartItemsEl.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    cart.forEach(item => {
      const itemTotal = Number(item.price) * item.qty;
      total += itemTotal;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">R$ ${Number(item.price).toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });
  }

  cartTotalPriceEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.updateCartQty = updateCartQty;

// Modal Toggles (Cart)
const toggleModal = () => cartModal.classList.toggle('hidden');
cartBtn.addEventListener('click', toggleModal);
closeModalBtn.addEventListener('click', toggleModal);
cartOverlay.addEventListener('click', toggleModal);

// Form Submission / WhatsApp Redirection
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    alert('Adicione itens ao carrinho antes de finalizar.');
    return;
  }

  const studentName = document.getElementById('student-name').value;
  const studentGrade = document.getElementById('student-grade').value;
  
  let msg = `*Novo Pedido de Uniforme*\n\n*Aluno:* ${studentName}\n*Série:* ${studentGrade}\n\n*Itens:*`;
  let total = 0;
  cart.forEach(item => {
    msg += `\n- ${item.qty}x ${item.name} (R$ ${(Number(item.price) * item.qty).toFixed(2)})`;
    total += Number(item.price) * item.qty;
  });
  msg += `\n\n*Total: R$ ${total.toFixed(2)}*`;

  const phone = '5511999999999';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  cart = [];
  updateCartUI();
  toggleModal();
  checkoutForm.reset();
});

// Slider Logic
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  
  if (slides.length === 0) return;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  let slideInterval = setInterval(nextSlide, 5000);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(index);
      slideInterval = setInterval(nextSlide, 5000);
    });
  });
}

// Promo Modal Logic
function initPromo() {
  if (!sessionStorage.getItem('sueli_promo_seen')) {
    setTimeout(() => {
      document.getElementById('promo-modal').classList.remove('hidden');
    }, 2500);
  }

  const closePromo = () => {
    document.getElementById('promo-modal').classList.add('hidden');
    sessionStorage.setItem('sueli_promo_seen', 'true');
  };

  document.getElementById('close-promo-modal')?.addEventListener('click', closePromo);
  document.getElementById('promo-overlay')?.addEventListener('click', closePromo);
  document.getElementById('btn-no-thanks')?.addEventListener('click', closePromo);
  
  document.getElementById('btn-use-promo')?.addEventListener('click', () => {
    // Scroll to products or copy code
    closePromo();
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
  });
}

// Init
renderProducts();
updateCartUI();
initSlider();
initPromo();
