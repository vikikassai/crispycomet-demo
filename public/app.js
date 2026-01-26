const categories = [
  { id: "szendvicsek", title: "Szendvicsek", desc: "Csirkés és marhás", hero: "img/comet.png" },
  { id: "snackek", title: "Snackek", desc: "Nuggets, falatok", hero: "img/6dbnuggets.png" },
  { id: "koretek", title: "Köretek", desc: "Burgonya, hagymakarika", hero: "img/nagyburi.png" },
  { id: "szoszok", title: "Szószok", desc: "BBQ, sajt, csípős…", hero: "img/bbq.jpg" },
  { id: "menuk", title: "Menük", desc: "Szendvics/snack + nagy burgonya + üdítő", hero: "img/cometmenu.png" }
];

const baseSandwiches = [
  { id: 1,  cat: "szendvicsek", name: "Comet Burger",        desc: "Marhahús, cheddar, saláta", price: 2190, img: "img/comet.png" },
  { id: 2,  cat: "szendvicsek", name: "Nebula Burger",       desc: "Ropogós csirke, pikáns majonéz", price: 1990, img: "img/nebula.png" },
  { id: 3,  cat: "szendvicsek", name: "Spicy Comet Burger",  desc: "Csípős csirkés burger", price: 2090, img: "img/spicycomet.png" },
  { id: 4,  cat: "szendvicsek", name: "Spicy Comet Wrap",    desc: "Csirkés wrap, csípős szósz", price: 1890, img: "img/wrap.png" }
];

const baseSnacks = [
  { id: 10, cat: "snackek", name: "Galaxy Nuggets (6 db)",  desc: "6 db ropogós nuggets",  price: 1190, img: "img/6dbnuggets.png" },
  { id: 11, cat: "snackek", name: "Galaxy Nuggets (9 db)",  desc: "9 db ropogós nuggets",  price: 1590, img: "img/9dbnuggets.png" },
  { id: 12, cat: "snackek", name: "Galaxy Nuggets (15 db)", desc: "15 db ropogós nuggets", price: 2290, img: "img/15dbnuggets.png" }
];

const sides = [
  { id: 20, cat: "koretek", name: "Burgonya (kicsi)", desc: "Kicsi adag hasábburgonya", price: 690, img: "img/kisburi.png" },
  { id: 21, cat: "koretek", name: "Burgonya (nagy)",  desc: "Nagy adag hasábburgonya",  price: 990, img: "img/nagyburi.png" },
  { id: 24, cat: "koretek", name: "Hagymakarika (4 db)", desc: "Ropogós hagymakarikák – 4 db", price: 790, img: "img/hagyma4.png" },
  { id: 25, cat: "koretek", name: "Hagymakarika (8 db)", desc: "Ropogós hagymakarikák – 8 db", price: 1290, img: "img/hagyma8.png" }
];

const sauces = [
  { id: 40, cat: "szoszok", name: "BBQ szósz", desc: "Füstös BBQ mártogató", price: 390, img: "img/bbq.jpg" },
  { id: 41, cat: "szoszok", name: "Sajtszósz", desc: "Krémes sajtmártogatós", price: 390, img: "img/sajtszosz.png" },
  { id: 42, cat: "szoszok", name: "Ketchup", desc: "Klasszikus paradicsomos", price: 290, img: "img/ketchup.png" },
  { id: 43, cat: "szoszok", name: "Fokhagymás majonéz", desc: "Krémes fokhagymás", price: 390, img: "img/fokhagymas.png" },
  { id: 44, cat: "szoszok", name: "Csípős szósz", desc: "Erős, tüzes íz", price: 390, img: "img/csipos.png" }
];

// Menü: 1 fő termék + 1 nagy burgonya + 1 üdítő
const menuSidePrice = 990;
const drinkPrice = 690;
const menuDiscount = 280;

function makeMenuItem(baseItem, id, imgOverride=null){
  const price = Math.max(0, baseItem.price + menuSidePrice + drinkPrice - menuDiscount);
  return {
    id,
    cat: "menuk",
    name: `${baseItem.name} Menü`,
    desc: `${baseItem.name} + nagy burgonya + üdítő`,
    price,
    img: imgOverride || baseItem.img
  };
}

const menus = [];
let nextMenuId = 100;
for (const s of baseSandwiches){
  let override = null;
  if (s.name === "Comet Burger") override = "img/cometmenu.png";
  if (s.name === "Nebula Burger") override = "img/nebulamenu.png";
  if (s.name === "Spicy Comet Burger") override = "img/spicycometmenu.png";
  // Wrap menü képet, ha van a mappában: wrapmenu.jpg
  if (s.name === "Spicy Comet Wrap") override = "img/wrapmenu.png";
  menus.push(makeMenuItem(s, nextMenuId++, override));
}
for (const sn of baseSnacks){
  menus.push(makeMenuItem(sn, nextMenuId++));
}

const items = [...baseSandwiches, ...baseSnacks, ...sides, ...sauces, ...menus];

let activeCategory = "szendvicsek";
let cart = loadCart(); // id -> qty

function fmtFt(n){ return `${Number(n).toLocaleString("hu-HU")} Ft`; }

function loadCart(){
  try{
    const raw = localStorage.getItem("crispyCart");
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}
function saveCart(){
  localStorage.setItem("crispyCart", JSON.stringify(cart));
}

async function login(){
  const username = document.getElementById("u").value;
  const password = document.getElementById("p").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if(res.ok){
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    renderCategoryTiles();
    setCategory(activeCategory);
    renderCartSummary();
    document.getElementById("msg").textContent = "";
  }else{
    document.getElementById("msg").textContent = "Hibás felhasználónév vagy jelszó!";
  }
}

function renderCategoryTiles(){
  const wrap = document.getElementById("categoryTiles");
  wrap.innerHTML = "";
  categories.forEach(c => {
    const el = document.createElement("div");
    el.className = "tile" + (c.id === activeCategory ? " active" : "");
    el.onclick = () => setCategory(c.id);
    el.innerHTML = `
      <img src="${c.hero}" alt="${c.title}">
      <div class="pad">
        <div class="t">${c.title}</div>
        <div class="d">${c.desc}</div>
      </div>
    `;
    wrap.appendChild(el);
  });
}

function setCategory(catId){
  activeCategory = catId;
  renderCategoryTiles();

  const cat = categories.find(x => x.id === catId);
  document.getElementById("catTitle").textContent = cat ? cat.title : "Kínálat";
  document.getElementById("catSubtitle").textContent = cat ? cat.desc : "";

  renderMenu(items.filter(x => x.cat === catId));
}

function showAll(){
  activeCategory = "__all__";
  const wrap = document.getElementById("categoryTiles");
  [...wrap.children].forEach(ch => ch.classList.remove("active"));
  document.getElementById("catTitle").textContent = "Összes termék";
  document.getElementById("catSubtitle").textContent = "Teljes kínálat";
  renderMenu(items);
}

function renderMenu(list){
  const menu = document.getElementById("menuItems");
  menu.innerHTML = "";
  list.forEach(i => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <img src="${i.img}" alt="${i.name}">
      <div class="info">
        <h4>${i.name}</h4>
        <div class="desc">${i.desc}</div>
        <div class="row">
          <div class="price">${fmtFt(i.price)}</div>
          <button class="mini ghost" onclick="add(${i.id})">Kosárba</button>
        </div>
      </div>
    `;
    menu.appendChild(d);
  });
}

function add(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCartSummary();
}
function resetCart(){
  cart = {};
  saveCart();
  document.getElementById("orderMsg").textContent = "";
  renderCartSummary();
}

function cartItemCount(){
  return Object.values(cart).reduce((a,b)=>a+Number(b||0),0);
}
function cartTotal(){
  let total = 0;
  for(const [idStr, qty] of Object.entries(cart)){
    const it = items.find(x => x.id === Number(idStr));
    if(it) total += it.price * qty;
  }
  return total;
}

function renderCartSummary(){
  const count = cartItemCount();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("total").textContent = cartTotal();
}

function openCart(){
  // átvisz a kosár oldalra
  window.location.href = "/cart.html";
}

document.addEventListener("DOMContentLoaded", () => {
  try { renderCartSummary(); } catch(e) {}
});
