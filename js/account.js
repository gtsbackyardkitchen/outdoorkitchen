(function(){const el=$('#acc');if(!el)return;
const view=()=>{renderNav();const u=curUser();u?profile(u):auth('login')};
function auth(mode){const L=mode=='login';
el.innerHTML=`<div class="box fade"><div class="tabs"><button class="${L?'on':''}" data-m="login">Log in</button><button class="${L?'':'on'}" data-m="reg">Create account</button></div>
<form id="af" novalidate>${L?`<label>Username, email or phone</label><input name="id" autocomplete="username"><label>Password</label><input name="pw" type="password" autocomplete="current-password">`:`<label>Username</label><input name="user" autocomplete="username"><label>Email (optional if you add a phone)</label><input name="email" type="email"><label>Phone (optional if you add an email)</label><input name="phone" type="tel"><label>Password (at least 8 characters)</label><input name="pw" type="password" autocomplete="new-password"><label>Repeat password</label><input name="pw2" type="password">`}<div class="err" id="ae" style="margin-top:8px"></div><br><button class="btn">${L?'Log in':'Create account'}</button></form></div>`;
el.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>auth(b.dataset.m));
$('#af').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),er=m=>{$('#ae').textContent=m};
if(L){const k=(d.id||'').trim().toLowerCase(),dg=k.replace(/\D/g,''),h=await hash(d.pw||''),u=users().find(x=>x.username.toLowerCase()==k||(x.email&&x.email==k)||(x.phone&&dg&&x.phone==dg));
if(!u||u.hash!==h)return er('Incorrect details or password.');DB.set('session',u.id);return pre(500,view)}
const un=(d.user||'').trim(),em=(d.email||'').trim().toLowerCase(),ph=(d.phone||'').replace(/\D/g,''),all=users();
if(!/^[A-Za-z0-9_]{3,20}$/.test(un))return er('Username: 3-20 letters, numbers or underscore.');
if(!em&&!ph)return er('Add an email or a phone number.');if(em&&!/^\S+@\S+\.\S+$/.test(em))return er('Enter a valid email.');if(ph&&ph.length<7)return er('Enter a valid phone number.');
if((d.pw||'').length<8)return er('Password too short: use at least 8 characters.');if(d.pw!==d.pw2)return er('The two passwords do not match.');
if(all.some(x=>x.username.toLowerCase()==un.toLowerCase()))return er('That username is already taken.');if(em&&all.some(x=>x.email==em))return er('That email is already registered.');if(ph&&all.some(x=>x.phone==ph))return er('That phone number is already registered.');
const u={id:'u'+Date.now(),username:un,email:em,phone:ph,hash:await hash(d.pw),createdAt:Date.now()};DB.set('users',[...all,u]);DB.set('session',u.id);pre(600,()=>{view();toast('Account created','ok')})}}
function profile(u){const mine=orders().filter(o=>o.userId===u.id||(u.email&&o.customer.email.toLowerCase()==u.email)||(u.phone&&o.customer.phone.replace(/\D/g,'')==u.phone)).reverse();
el.innerHTML=`<div class="box fade"><h3>Hi, ${esc(u.username)}</h3><p class="muted">${esc(u.email||'')} ${esc(u.phone||'')}</p><p class="muted">Member since ${new Date(u.createdAt).toLocaleDateString()}</p><br><button class="btn o s" id="lo">Log out</button></div><br>
<div class="box tw fade"><h3>My orders</h3><table><tr><th>Order ID</th><th>Date</th><th>Status</th></tr>${mine.map(o=>`<tr><td><a href="track-order.html?id=${o.id}" style="text-decoration:underline">${o.id}</a></td><td>${fmt(o.createdAt)}</td><td>${(s=>s<0?'Enquiry received':STATUSES[s])((findOrder(o.id)||o).status)}</td></tr>`).join('')||'<tr><td colspan=3 class="muted">No orders yet.</td></tr>'}</table></div>`;
$('#lo').onclick=()=>{localStorage.removeItem('gts_session');pre(400,view)}}
view()})();