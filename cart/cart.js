function add_to_cart(){
    window.location.href="/cart/cart.html"
}

  const PRODUCTS = [
    { id: 'p1', name: 'Sunset Print', desc: 'A4 archival print', price: 24.00 },
    { id: 'p2', name: 'Blue Study', desc: 'Giclée art print', price: 45.00 },
    { id: 'p3', name: 'Abstract Mini', desc: '5x7 limited edition', price: 18.50 },
    { id: 'p4', name: 'Framed Landscape', desc: '16x20 framed', price: 120.00 }
  ];

  const productGrid = document.getElementById('productGrid');
  const cartItemsEl = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const taxEl = document.getElementById('tax');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const cart = new Map();

  function format(n){ return n.toLocaleString(undefined,{style:'currency',currency:'USD'}); }

  function renderProducts(){
    productGrid.innerHTML = '';
    PRODUCTS.forEach(p => {
      const div = document.createElement('div'); div.className='product';
      div.innerHTML = `
        <div class="thumb">${p.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
        <div class="pmeta">
          <div class="pname">${p.name}</div>
          <div class="pdesc">${p.desc}</div>
          <div class="pfoot">
            <div class="price">${format(p.price)}</div>
            <button class="add" data-id="${p.id}">Add</button>
          </div>
        </div>`;
      productGrid.appendChild(div);
    });


    document.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id'); addToCart(id);
    }));
  }

  function addToCart(id){
    const product = PRODUCTS.find(p=>p.id===id);
    if(!product) return;
    const existing = cart.get(id);
    cart.set(id, { product, qty: existing ? existing.qty + 1 : 1 });
    renderCart();
  }

  function changeQty(id, delta){
    const item = cart.get(id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0) cart.delete(id);
    else cart.set(id, item);
    renderCart();
  }

  function removeItem(id){ cart.delete(id); renderCart(); }

  function renderCart(){
    cartItemsEl.innerHTML = '';
    if(cart.size === 0){
      cartItemsEl.innerHTML = '<p class="muted">Your cart is empty — add artwork to get started.</p>';
      checkoutBtn.disabled = true; updateTotals(); return;
    }

    cart.forEach((item, id)=>{
      const div = document.createElement('div'); div.className='line';
      div.innerHTML = `
        <div class="c-thumb">${item.product.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
        <div class="c-info">
          <div class="c-name">${item.product.name}</div>
          <div class="muted">${format(item.product.price)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end">
          <div class="qty">
            <button class="qbtn" data-action="minus" data-id="${id}">-</button>
            <div style="min-width:22px;text-align:center">${item.qty}</div>
            <button class="qbtn" data-action="plus" data-id="${id}">+</button>
          </div>
          <button class="remove" data-id="${id}">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    
    cartItemsEl.querySelectorAll('.qbtn').forEach(b=>b.addEventListener('click', e=>{
      const id = e.currentTarget.getAttribute('data-id');
      const action = e.currentTarget.getAttribute('data-action');
      changeQty(id, action==='plus'?1:-1);
    }));
    cartItemsEl.querySelectorAll('.remove').forEach(b=>b.addEventListener('click', e=>{
      removeItem(e.currentTarget.getAttribute('data-id'));
    }));

    checkoutBtn.disabled = false; updateTotals();
  }

  function updateTotals(){
    let subtotal = 0;
    cart.forEach(it => subtotal += it.product.price * it.qty);
    const tax = +(subtotal * 0.07).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    subtotalEl.textContent = format(subtotal);
    taxEl.textContent = format(tax);
    totalEl.textContent = format(total);
  }

  checkoutBtn.addEventListener('click', ()=>{
    if(cart.size === 0) return;
    
    alert('Checkout — total: ' + totalEl.textContent + '\n(Implement real payment on server)');
  });

  renderProducts();
  renderCart();
