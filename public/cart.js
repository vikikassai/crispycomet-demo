
const items = (() => {

  const baseSandwiches = [
    { id: 1, name: "Comet Burger", price: 2190 },
    { id: 2, name: "Nebula Burger", price: 1990 },
    { id: 3, name: "Spicy Comet Burger", price: 2090 },
    { id: 4, name: "Spicy Comet Wrap", price: 1890 }
  ];
  const baseSnacks = [
    { id: 10, name: "Galaxy Nuggets (6 db)", price: 1190 },
    { id: 11, name: "Galaxy Nuggets (9 db)", price: 1590 },
    { id: 12, name: "Galaxy Nuggets (15 db)", price: 2290 }
  ];
  const sides = [
    { id: 20, name: "Burgonya (kicsi)", price: 690 },
    { id: 21, name: "Burgonya (nagy)", price: 990 },
    { id: 24, name: "Hagymakarika (4 db)", price: 790 },
    { id: 25, name: "Hagymakarika (8 db)", price: 1290 }
  ];
  const sauces = [
    { id: 40, name: "BBQ szósz", price: 390 },
    { id: 41, name: "Sajtszósz", price: 390 },
    { id: 42, name: "Ketchup", price: 290 },
    { id: 43, name: "Fokhagymás majonéz", price: 390 },
    { id: 44, name: "Csípős szósz", price: 390 }
  ];

 
  const menuSidePrice = 990;
  const drinkPrice = 690;
  const menuDiscount = 280;
  function menuPrice(base){ return Math.max(0, base.price + menuSidePrice + drinkPrice - menuDiscount); }

  const menus = [];
  let nextMenuId = 100;
  for(const s of baseSandwiches){ menus.push({ id: nextMenuId++, name: `${s.name} Menü`, price: menuPrice(s) }); }
  for(const sn of baseSnacks){ menus.push({ id: nextMenuId++, name: `${sn.name} Menü`, price: menuPrice(sn) }); }

  return [...baseSandwiches, ...baseSnacks, ...sides, ...sauces, ...menus];
})();

function loadCart(){
  try{
    const raw = localStorage.getItem("crispyCart");
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}
function saveCart(cart){
  localStorage.setItem("crispyCart", JSON.stringify(cart));
}
function fmtFt(n){ return `${Number(n).toLocaleString("hu-HU")} Ft`; }

let cart = loadCart();

function itemById(id){ return items.find(x => x.id === id); }

function render(){
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("count");

  list.innerHTML = "";
  let total = 0;
  let count = 0;

  const ids = Object.keys(cart);
  if(ids.length === 0){
    list.innerHTML = '<div class="hint">A kosár üres.</div>';
    totalEl.textContent = 0;
    countEl.textContent = 0;
    return;
  }

  ids.forEach(idStr => {
    const id = Number(idStr);
    const qty = cart[id];
    const it = itemById(id);
    if(!it) return;

    total += it.price * qty;
    count += qty;

    const row = document.createElement("div");
    row.className = "cart-line";
    row.innerHTML = `
      <div>
        <div class="cart-name">${it.name}</div>
        <div class="cart-sub">${fmtFt(it.price)} / db</div>
      </div>
      <div class="qty">
        <button onclick="dec(${id})">−</button>
        <div class="n">${qty}</div>
        <button onclick="inc(${id})">+</button>
      </div>
    `;
    list.appendChild(row);
  });

  totalEl.textContent = total;
  countEl.textContent = count;
}

function inc(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  render();
}
function dec(id){
  cart[id] = (cart[id] || 0) - 1;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
  render();
}
function clearCart(){
  cart = {};
  saveCart(cart);
  document.getElementById("msg").textContent = "";
  render();
}
function placeOrder(){
  if(Object.keys(cart).length === 0){
    document.getElementById("msg").textContent = "A kosár üres.";
    return;
  }
  cart = {};
  saveCart(cart);
  render();
  document.getElementById("msg").textContent = "A rendelés sikeresen leadva! (demo)";
}

window.clearCart = clearCart;
window.placeOrder = placeOrder;
window.inc = inc;
window.dec = dec;

document.addEventListener("DOMContentLoaded", render);
