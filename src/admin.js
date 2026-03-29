// admin.js - Lógica do painel de administração

// Pegar produtos do LocalStorage
let products = JSON.parse(localStorage.getItem('sueli_products'));
if (!products) {
    products = []; 
}

const tbody = document.getElementById('admin-product-list');
const addProductBtn = document.getElementById('add-product-btn');

// Modal Elements
const productModal = document.getElementById('product-modal');
const closeProductModalBtn = document.getElementById('close-product-modal');
const productOverlay = document.getElementById('product-overlay');
const productForm = document.getElementById('product-form');

function renderAdminProducts() {
  tbody.innerHTML = '';
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
    return;
  }

  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td><span style="background: #eee; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${product.category || 'Geral'}</span></td>
      <td>R$ ${Number(product.price).toFixed(2).replace('.', ',')}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Editar</button>
        <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveProducts() {
  localStorage.setItem('sueli_products', JSON.stringify(products));
  renderAdminProducts();
}

// Modal Toggle
const toggleModal = () => productModal.classList.toggle('hidden');
addProductBtn.addEventListener('click', () => {
    productForm.reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('modal-title').textContent = 'Novo Produto';
    toggleModal();
});
closeProductModalBtn.addEventListener('click', toggleModal);
productOverlay.addEventListener('click', toggleModal);

// Submit Form
productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const idVal = document.getElementById('prod-id').value;
  const name = document.getElementById('prod-name').value;
  const category = document.getElementById('prod-category').value;
  const desc = document.getElementById('prod-desc').value;
  const price = document.getElementById('prod-price').value;
  const image = document.getElementById('prod-image').value;

  if (idVal) {
    // Edit
    const index = products.findIndex(p => p.id == idVal);
    if(index !== -1) {
      products[index] = { ...products[index], name, category, description: desc, price: Number(price), image };
    }
  } else {
    // Add
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, category, description: desc, price: Number(price), image });
  }

  saveProducts();
  toggleModal();
});

// Inline funcs
window.editProduct = (id) => {
  const prod = products.find(p => p.id === id);
  if (prod) {
    document.getElementById('prod-id').value = prod.id;
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-category').value = prod.category || 'Geral';
    document.getElementById('prod-desc').value = prod.description;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-image').value = prod.image;
    document.getElementById('modal-title').textContent = 'Editar Produto';
    toggleModal();
  }
}

window.deleteProduct = (id) => {
  if (confirm('Tem certeza que deseja excluir este uniforme?')) {
    products = products.filter(p => p.id !== id);
    saveProducts();
  }
}

// Init
renderAdminProducts();
