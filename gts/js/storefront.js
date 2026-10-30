/* Storefront: renders each public page based on <body data-page>. Shared data helpers live in store.js. */
/* Storefront (hash-routed single page). */
const cart=()=>DB.get('cart',[]);const saveCart=c=>{DB.set('cart',c);renderNav()};
const byId=id=>prods().find(p=>p.id===id);
let F={q:'',cat:'',sort:''};

const cLines=s=>{const d=x=>x.replace(/[^\d+]/g,''),ig=(s.instagram.match(/instagram\.com\/([^\/?#]+)/)||[])[1];return `<p><b>Phone:</b> <a href="tel:${d(s.phone)}">${esc(s.phone)}</a></p><p><b>WhatsApp:</b> <a href="https://wa.me/${s.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener">${esc(s.whatsapp)}</a></p><p><b>Email:</b> <a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p><p><b>Instagram:</b> <a href="${esc(s.instagram)}" target="_blank" rel="noopener">@${esc(ig||'instagram')}</a></p><p><b>Address:</b> ${esc(s.address||'Add in Admin > Settings')}</p>`};
const WAI='<svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M16.02 3C9.38 3 4 8.38 4 15.02c0 2.12.55 4.19 1.6 6.02L4 29l8.12-1.57a12 12 0 0 0 3.9.65h.01C22.66 28.08 28 22.7 28 16.06 28 9.4 22.67 3 16.02 3zm0 22.1a10 10 0 0 1-5.1-1.4l-.37-.22-3.8.74.78-3.7-.24-.38A10.05 10.05 0 1 1 26.07 15c0 5.5-4.5 10.1-10.05 10.1z"/><path fill="#fff" d="M21.8 18.6c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-1.77-.88-2.93-1.58-4.1-3.58-.3-.53.31-.49.88-1.62.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.5 1.88.82 2.62.88 3.56.74.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg>';
const PF=()=>{const u=curUser();return u?{email:u.email,phone:u.phone}:{}};
function initHero(){const h=$('#hs');if(!h)return;const tr=h.querySelector('.tr'),dots=[...h.querySelectorAll('.dots i')];let i=0,t;
const go=n=>{i=(n+dots.length)%dots.length;tr.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,j)=>d.classList.toggle('on',j===i))},play=()=>{clearInterval(t);t=setInterval(()=>go(i+1),5500)};
h.querySelector('.l').onclick=()=>{go(i-1);play()};h.querySelector('.r').onclick=()=>{go(i+1);play()};dots.forEach((d,j)=>d.onclick=()=>{go(j);play()});
h.onmouseenter=()=>clearInterval(t);h.onmouseleave=play;let x0=0;h.ontouchstart=e=>{x0=e.touches[0].clientX};h.ontouchend=e=>{const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));play()}};go(0);play()}
function renderNav(){const s=S(),n=cart().reduce((a,i)=>a+i.qty,0);
$('#nav').innerHTML=`<div class="wrap"><a class="brand" href="index.html">${s.logo?`<img src="${s.logo}" alt="${esc(s.name)}">`:`<b>◆</b><span>${esc(s.name)}</span>`}</a>
<button class="burger" onclick="document.querySelector('.links').classList.toggle('open')">☰</button>
<nav class="links" onclick="this.classList.remove('open')"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">About</a><a href="track-order.html">Track Order</a><a href="contact.html">Contact</a><a href="account.html">${curUser()?"Hi, "+esc(curUser().username):"Login / Sign up"}</a><a href="cart.html">Cart <span class="cnt">${n}</span></a></nav></div>`;
document.title=s.name}
function renderFoot(){const s=S(),ph='Not set yet';
$('#foot').innerHTML=`<div class="wrap"><div class="grid"><div><h4>${esc(s.name)}</h4><p>Outdoor kitchens for your backyard.</p></div>
<div><h4>Contact</h4>${cLines(s)}</div>
<div><h4>Follow</h4>${['facebook','instagram','tiktok'].map(k=>s[k]?`<a href="${esc(s[k])}" target="_blank" rel="noopener">${k}</a>`:'').join('')||'<p>Links not set yet</p>'}</div>
<div><h4>Links</h4><a href="shop.html">Shop</a><a href="track-order.html">Track Order</a><a href="account.html">My Account</a><a href="admin-login.html">Admin</a></div></div><small>© ${new Date().getFullYear()} ${esc(s.name)}. All rights reserved.</small></div>`}

const card=p=>`<div class="card fade"><img src="${p.imgs[0]||ph('No image')}" alt="${esc(p.name)}" loading="lazy"><div class="bd"><h3>${esc(p.name)}</h3>
<p class="muted">${esc((p.desc||'').slice(0,90))}${p.desc?.length>90?'…':''}</p><div class="price">${money(p.price)}</div>
${p.available?'':'<span class="badge x">Unavailable</span>'}<div class="ac"><a class="btn o s" href="product.html?id=${p.id}">View Details</a>${p.available?`<button class="btn s" onclick="addCart('${p.id}',1)">Add to Cart</button>`:''}</div></div></div>`;

function addCart(id,q){const c=cart(),i=c.find(x=>x.id===id);i?i.qty+=q:c.push({id,qty:q});saveCart(c);toast('Added to cart','ok')}

const V={
home(){const f=prods().filter(p=>p.featured&&p.available);return `<section class="hs" id="hs"><div class="tr">${getHero().map((s,i)=>`<div class="sl">${s.img?`<img class="hi" src="${s.img}" alt="">`:''}<div class="wrap"><h1>${esc(s.h)}</h1><p>${esc(s.p)}</p>${s.b[1]?`<a class="btn" href="${esc(s.b[1])}">${esc(s.b[0])}</a>`:`<button class="btn" onclick="waOpen('Hello, I would like a custom quote for an outdoor kitchen.')">${s.b[0]}</button>`}</div></div>`).join('')}</div><button class="ar l" aria-label="Previous slide">‹</button><button class="ar r" aria-label="Next slide">›</button><div class="dots">${getHero().map(()=>'<i></i>').join('')}</div></section>
<section><div class="wrap"><h2 class="t">Featured Products</h2><p class="sub">Hand-picked for your backyard.</p><div class="grid">${f.map(card).join('')||'<p class="muted">No featured products yet.</p>'}</div></div></section>

<section><div class="wrap"><h2 class="t">Why Choose Us</h2><p class="sub"></p><div class="grid">${[['Made for your space','Ask us about custom requests and sizing.'],['Request a quote','Not sure? Send us your idea on WhatsApp.'],['Order tracking','Follow your order with your Order ID.'],['Direct support','Talk to us directly, any time.']].map(a=>`<div class="box"><h3>${a[0]}</h3><p class="muted">${a[1]}</p></div>`).join('')}</div></div></section>${V.contact()}`},
contact(){const s=S();return `<section class="alt" id="contact"><div class="wrap"><h2 class="t">Contact Us</h2><p class="sub">We'd love to hear from you.</p><div class="box">${cLines(s)}<br><button class="btn wab" onclick="waOpen('Hello ${esc(s.name)}, I have a question.')">${WAI} Chat on WhatsApp</button></div></div></section>`},
shop(){return `<section><div class="wrap"><h2 class="t">Shop</h2><div class="tools"><input id="q" placeholder="Search products…" value="${esc(F.q)}">
<select id="so"><option value="">Sort by price</option><option value="a" ${F.sort=='a'?'selected':''}>Low to high</option><option value="d" ${F.sort=='d'?'selected':''}>High to low</option></select></div><div class="grid" id="g"></div></div></section>`},
product(id){const p=byId(id);if(!p)return '<section><div class="wrap"><h2>Product not found</h2><a class="btn" href="shop.html">Back to shop</a></div></section>';
return `<section><div class="wrap two"><div class="gal"><img class="main" id="mi" src="${p.imgs[0]||ph('No image')}">${p.imgs.length>1?`<div class="thumbs">${p.imgs.map((s,i)=>`<img src="${s}" class="${i?'':'on'}" onclick="mi.src=this.src;document.querySelectorAll('.thumbs img').forEach(x=>x.classList.remove('on'));this.classList.add('on')">`).join('')}</div>`:''}</div>
<div><h1>${esc(p.name)}</h1><p class="price" style="font-size:1.5rem;margin:8px 0">${money(p.price)}</p><p>${esc(p.desc)}</p>
${p.features?.length?`<h3 style="margin-top:16px">Features</h3><ul style="padding-left:20px">${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:''}
${Object.keys(p.specs||{}).length?`<h3 style="margin-top:16px">Specifications</h3><table>${Object.entries(p.specs).map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>`:''}
<div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">${p.available?`<div class="qty"><button onclick="q.textContent=Math.max(1,+q.textContent-1)">−</button><span id="q">1</span><button onclick="q.textContent=+q.textContent+1">+</button></div><button class="btn" onclick="addCart('${p.id}',+q.textContent)">Add to Cart</button>`:'<span class="badge x">Currently unavailable</span>'}
<button class="btn o" onclick="quote('${p.id}')">Request a Quote</button></div></div></div></section>`},
cart(){const c=cart().map(i=>({...i,p:byId(i.id)})).filter(i=>i.p);const t=c.reduce((a,i)=>a+i.p.price*i.qty,0);
if(!c.length)return '<section><div class="wrap"><h2 class="t">Your Cart</h2><p class="muted">Your cart is empty.</p><br><a class="btn" href="shop.html">Continue shopping</a></div></section>';
return `<section><div class="wrap"><h2 class="t">Your Cart</h2><div class="tw box"><table><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>${c.map(i=>`<tr><td>${esc(i.p.name)}</td><td>${money(i.p.price)}</td><td><div class="qty"><button onclick="chg('${i.id}',-1)">−</button><span>${i.qty}</span><button onclick="chg('${i.id}',1)">+</button></div></td><td>${i.p.price>0?money(i.p.price*i.qty):'-'}</td><td><button class="btn d s" onclick="rm('${i.id}')">Remove</button></td></tr>`).join('')}</table>
<h3 style="text-align:right;margin-top:16px">Total: ${t>0?money(t):'Price on request'}</h3></div><br><a class="btn o" href="shop.html">Continue shopping</a> <a class="btn" href="checkout.html">Checkout</a></div></section>`},
checkout(){if(!cart().length){location.href='cart.html';return ''}return `<section><div class="wrap two"><div><h2 class="t">Checkout</h2><div class="notice"><b>This is an order enquiry, not a payment.</b> Nothing is charged. We will confirm availability, final price, and payment details with you on WhatsApp.</div>
<form id="f" novalidate>${[['name','Full name'],['email','Email address','email'],['phone','Phone number','tel'],['country','Country'],['city','City']].map(a=>`<label>${a[1]}</label><input name="${a[0]}" type="${a[2]||'text'}" value="${esc(PF()[a[0]]||'')}"><div class="err" data-e="${a[0]}"></div>`).join('')}
<label>Delivery address</label><textarea name="address" rows="3"></textarea><div class="err" data-e="address"></div><label>Order notes / customisation requests</label><textarea name="notes" rows="3"></textarea><br><button class="btn" id="sb">Submit Order Enquiry via WhatsApp</button></form></div>
<div class="box" style="align-self:start"><h3>Order summary</h3>${cart().map(i=>({...i,p:byId(i.id)})).filter(i=>i.p).map(i=>`<p>${i.qty} × ${esc(i.p.name)} <span class="muted">${money(i.p.price)}</span></p>`).join('')}</div></div></section>`},
track(id){return `<section><div class="wrap" style="max-width:760px"><h2 class="t">Track Your Order</h2><p class="sub">Enter the Order ID you received.</p><div class="tools"><input id="oid" placeholder="e.g. GTS-250101-AB12" value="${esc(id||'')}"><button class="btn" onclick="location.href='track-order.html?id='+encodeURIComponent(oid.value.trim())">Track</button></div><div id="tr"></div></div></section>`},
about(){const s=S();return `<section class="alt"><div class="wrap" style="max-width:820px"><h2 class="t">About ${esc(s.name)}</h2><p class="sub">Outdoor kitchens for your backyard.</p><div class="box"><h3>Our story</h3><p class="muted">Placeholder - add your brand story here (edit <code>about()</code> in js/storefront.js).</p></div></div></section>
<section><div class="wrap"><h2 class="t">What we offer</h2><p class="sub"></p><div class="grid">${[['Outdoor kitchen products','Browse the range in our shop.'],['Custom requests','Add customisation notes at checkout or request a quote.'],['Order tracking','Follow your order with your Order ID.']].map(a=>`<div class="box"><h3>${a[0]}</h3><p class="muted">${a[1]}</p></div>`).join('')}</div><br><a class="btn" href="shop.html">Shop Now</a> <a class="btn o" href="contact.html">Contact Us</a></div></section>`},
account(){return `<section><div class="wrap" style="max-width:600px"><h2 class="t">My Account</h2><div id="acc"></div></div></section>`},
contactpage(){const s=S();return `<section><div class="wrap two"><div><h2 class="t">Contact Us</h2><p class="sub">Send us a message - it opens in WhatsApp.</p><div class="box">${cLines(s)}</div></div>
<form id="cf" class="box" novalidate><label>Your name</label><input name="name"><div class="err" data-e="name"></div><label>Email</label><input name="email" type="email"><div class="err" data-e="email"></div><label>Message</label><textarea name="msg" rows="4"></textarea><div class="err" data-e="msg"></div><br><button class="btn">Send via WhatsApp</button></form></div></section>`}
};
function bindContact(){const f=$('#cf');f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f)),er={};if(!d.name.trim())er.name='Required';if(!/^\\S+@\\S+\\.\\S+$/.test(d.email))er.email='Enter a valid email';if(!d.msg.trim())er.msg='Required';
f.querySelectorAll('[data-e]').forEach(x=>x.textContent=er[x.dataset.e]||'');if(Object.keys(er).length)return toast('Please fix the highlighted fields','e');if(waOpen(`Message from ${d.name} (${d.email}):\\n${d.msg}`)){toast('Opening WhatsApp…','ok');f.reset()}}}
function trackView(id){const o=orders().find(x=>x.id.toLowerCase()===id.toLowerCase());
if(!o)return `<div class="box"><p class="err">No order found with ID "${esc(id)}". Please check and try again.</p><p class="muted" style="font-size:.85rem">Demo note: orders are stored in the browser that placed them.</p></div>`;
const sh=o.shipping||{},st=o.status;
return `<div class="box fade"><p><b>Order ${esc(o.id)}</b> · placed ${fmt(o.createdAt)}</p><p style="margin:6px 0"><span class="badge ${st<0?'w':''}">${st<0?ENQ:STATUSES[st]}</span></p>
<div class="steps">${STATUSES.map((s,i)=>`<div class="step ${i<=st?'on':''}">${s}</div>`).join('')}</div>
${sh.location?`<p><b>Latest location:</b> ${esc(sh.location)}</p>`:''}${sh.company?`<p><b>Shipping company:</b> ${esc(sh.company)}</p>`:''}${sh.tracking?`<p><b>Tracking number:</b> ${esc(sh.tracking)}</p>`:''}${sh.eta?`<p><b>Estimated delivery:</b> ${esc(sh.eta)}</p>`:''}${sh.note?`<p><b>Delivery note:</b> ${esc(sh.note)}</p>`:''}
<h3 style="margin:20px 0 12px">Timeline</h3><div class="tl">${[...o.history].reverse().map(h=>`<div class="it"><b>${h.s<0?ENQ:STATUSES[h.s]}</b><div class="muted" style="font-size:.85rem">${fmt(h.at)}${h.loc?' · '+esc(h.loc):''}</div>${h.note?`<div>${esc(h.note)}</div>`:''}</div>`).join('')}</div></div>`}
function quote(id){waOpen('Hello, I would like a quote for: '+byId(id).name)}
function chg(id,d){const c=cart(),i=c.find(x=>x.id===id);i.qty=Math.max(1,i.qty+d);saveCart(c);route()}
function rm(id){saveCart(cart().filter(x=>x.id!==id));route()}
function drawGrid(){const g=$('#g');if(!g)return;let l=prods().filter(p=>(p.name+p.desc).toLowerCase().includes(F.q.toLowerCase()));
if(F.sort)l.sort((a,b)=>F.sort=='a'?a.price-b.price:b.price-a.price);g.innerHTML=l.map(card).join('')||'<p class="muted">No products match your search.</p>'}
function bindShop(){$('#q').oninput=e=>{F.q=e.target.value;drawGrid()};$('#so').onchange=e=>{F.sort=e.target.value;drawGrid()};$('#g').innerHTML=Array(8).fill('<div class="sk"></div>').join('');setTimeout(drawGrid,400)}
function bindCheckout(){const f=$('#f');if(!f)return;f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f)),er={};
['name','phone','country','city','address'].forEach(k=>{if(!d[k].trim())er[k]='Required'});if(!/^\S+@\S+\.\S+$/.test(d.email))er.email='Enter a valid email';else if(!d.email)er.email='Required';
if(d.phone&&d.phone.replace(/\D/g,'').length<6)er.phone='Enter a valid phone number';
f.querySelectorAll('[data-e]').forEach(x=>x.textContent=er[x.dataset.e]||'');if(Object.keys(er).length)return toast('Please fix the highlighted fields','e');
const items=cart().map(i=>({...i,p:byId(i.id)})).filter(i=>i.p).map(i=>({id:i.id,name:i.p.name,price:i.p.price,qty:i.qty}));const total=items.reduce((a,i)=>a+i.price*i.qty,0);
let id;do{id='GTS-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}while(orders().some(x=>x.id===id));const now=Date.now();
const o={id,customer:d,userId:(curUser()||{}).id,items,total,createdAt:now,status:-1,shipping:{},history:[{s:-1,at:now,note:'Order enquiry received. Awaiting confirmation from the store.'}]};
DB.set('orders',[...orders(),o]);saveCart([]);
const msg=`Hello, I'd like to submit an ORDER ENQUIRY (not a payment).\nOrder ID: ${id}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nLocation: ${d.city}, ${d.country}\nAddress: ${d.address}\n\nItems:\n${items.map(i=>`- ${i.qty} x ${i.name} (${money(i.price)})`).join('\n')}\nTotal: ${total>0?money(total):'Price on request'}\nNotes: ${d.notes||'None'}`;
window._m=msg;$('#app').innerHTML=`<section><div class="wrap" style="max-width:640px"><div class="box"><h2>Enquiry submitted ✔</h2><p>Your Order ID is <b>${id}</b>. Save it to track your order.</p><div class="notice">This is an enquiry only - no payment has been taken. The store will confirm details with you.</div><button class="btn" onclick="waOpen(window._m)">Send enquiry on WhatsApp</button> <a class="btn o" href="track-order.html?id=${id}">Track this order</a></div></div></section>`;waOpen(msg);pre(700)}}
function route(){const pg=document.body.dataset.page,P=new URLSearchParams(location.search);let h;
if(pg==='product')h=V.product(P.get('id'));else if(pg==='track')h=V.track(P.get('id')||'');else if(pg==='shop'){F.q=P.get('q')||'';h=V.shop()}else h=(V[pg==='contact'?'contactpage':pg]||V.home)();
$('#app').innerHTML=h;window.scrollTo(0,0);if(pg==='home')initHero();if(pg==='shop')bindShop();if(pg==='checkout')bindCheckout();if(pg==='contact')bindContact();
if(pg==='track'){$('#oid').onkeydown=e=>e.key==='Enter'&&e.target.nextElementSibling.click();const id=P.get('id');if(id){$('#tr').innerHTML='<p class="muted"><span class="spin"></span> Looking up your order…</p>';setTimeout(()=>{$('#tr').innerHTML=trackView(id)},500)}}}
$('#wa').onclick=()=>waOpen('Hello '+S().name+', I have a question.');
renderNav();renderFoot();route();
