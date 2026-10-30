/* Shared data layer. Everything is saved in THIS browser's localStorage (demo mode). */
const DB={get(k,d){try{const v=localStorage.getItem('gts_'+k);return v?JSON.parse(v):d}catch(e){return d}},
set(k,v){try{localStorage.setItem('gts_'+k,JSON.stringify(v));return true}catch(e){toast('Storage full - use smaller images.','e');return false}}};
const STATUSES=['Order Confirmed','Processing','Preparing for Shipping','Shipped','In Transit','Out for Delivery','Delivered'];
const ENQ='Enquiry Received (awaiting confirmation)';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ph=t=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'><rect width='100%' height='100%' fill='#e8eff9'/><text x='50%' y='50%' fill='#00428c' font-family='sans-serif' font-size='24' text-anchor='middle'>${t}</text></svg>`);
const DEF_SET={name:'GTS Backyard Kitchen',logo:'images/logo.png',whatsapp:'+1 (270) 571-6095',email:'gtsbackyardkitchen@gmail.com',phone:'+1 3373429089',address:'',facebook:'',instagram:'https://www.instagram.com/gtsbackyardkitchen?obrf=MWR5NDU2aDlrcnN2Yw==',tiktok:'',currency:'$'};
const S=()=>{const m={...DEF_SET,...(window.SITE_DATA||{}).settings,...DB.get('settings',{})};['name','logo','whatsapp','email','phone','instagram','currency'].forEach(k=>{if(!m[k])m[k]=DEF_SET[k]});return m};
const money=n=>{const c=S().currency;return n>0?c+(c.length>1?' ':'')+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'Price on request'};
const fmt=t=>new Date(t).toLocaleString([], {dateStyle:'medium',timeStyle:'short'});
const CATS=()=>[...new Set(CATALOG.map(c=>c[2]))];
const cats=()=>DB.get('cats')||(window.SITE_DATA||{}).cats||CATS();
/* Starter catalogue comes from js/products.js */
function seedProducts(){return CATALOG.map(([id,name,category,price,desc,features,layout])=>({id,name,category,price,desc,features,specs:{Material:'Stainless steel',Layout:layout,Included:features.join(', '),Dimensions:'To be confirmed'},imgs:[1,2,3].map(n=>`images/products/${id}-${n}.jpg`),featured:FEATURED.has(id),available:true}))}
/* Products: the admin's saved edits win; otherwise site-data.js (published export); otherwise the starter catalogue. */
const prods=()=>{const L=DB.get('products');if(L)return L;const d=(window.SITE_DATA||{}).products;return d&&d.length?d:seedProducts()};
const orders=()=>DB.get('orders',[]);
function toast(m,t=''){let b=document.getElementById('toast');if(!b){b=document.createElement('div');b.id='toast';document.body.appendChild(b)}const d=document.createElement('div');d.className='toast '+t;d.textContent=m;b.appendChild(d);setTimeout(()=>d.remove(),3200)}
function waOpen(text){const n=S().whatsapp.replace(/\D/g,'');if(!n){toast('WhatsApp number not set yet (Admin > Settings).','e');return false}window.open(`https://wa.me/${n}?text=${encodeURIComponent(text)}`,'_blank');return true}
const $=s=>document.querySelector(s);
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return 'f'+btoa(unescape(encodeURIComponent(s)))}}
const DEMO='<div class="notice"><b>Frontend demonstration login.</b> This password check runs in the browser and is NOT real security. Data is stored only in this browser. A real backend is needed for secure admin access and for syncing products, orders and tracking across devices.</div>';

/* Accounts (FRONTEND DEMO: stored in this browser only) */
const users=()=>DB.get('users',[]);const curUser=()=>users().find(u=>u.id===DB.get('session'));
/* Preloader */
const pre=(ms=500,fn)=>{const p=$('#pre');if(!p){fn&&fn();return}p.classList.remove('hide');setTimeout(()=>{fn&&fn();p.classList.add('hide')},ms)};
addEventListener('load',()=>setTimeout(()=>{const p=$('#pre');p&&p.classList.add('hide')},350));setTimeout(()=>{const p=$('#pre');p&&p.classList.add('hide')},4000);
addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&!t.dataset.f){t.dataset.f=1;if(t.classList.contains('hi'))t.style.display='none';else t.src=ph('Photo coming soon')}},true);

/* Hero slides: edited in Admin > Hero Slides. img = a picture path or an uploaded picture. */
const HERO_DEF=[['Outdoor kitchens built for the way you live.','Modular stainless steel outdoor kitchens for your backyard.','Shop Now','shop.html'],['Stainless steel, built to last outdoors.','Weather-ready modules you can arrange to fit your space.','View L-Shaped Kitchens','shop.html?q=L-Shape'],['Grill, chill and watch the game.','Kitchens with a BBQ grill, deep freezer and outdoor TV.','See Entertainment Kitchens','shop.html?cat=Entertainment%20Kitchens'],['Want it your way?','Tell us about your space and ideas and we will send you a quote.','Request a Quote','']].map((a,i)=>({h:a[0],p:a[1],b:[a[2],a[3]],img:`images/hero/hero-${i+1}.jpg`}));
const getHero=()=>DB.get('hero')||(window.SITE_DATA||{}).hero||HERO_DEF;
/* one-time clean-up of products saved by older versions */
(function(){if(DB.get('seedv')===4)return;const p=DB.get('products');if(p){const q=p.filter(x=>!/^k\d+$/.test(x.id)&&!/^p[1-4]$/.test(x.id));q.length?DB.set('products',q):localStorage.removeItem('gts_products')}localStorage.removeItem('gts_cats');DB.set('seedv',4)})();
