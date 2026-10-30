/* Admin login page. FRONTEND DEMONSTRATION ONLY - not real security (see banner). */
const R=document.getElementById('app');
if(sessionStorage.getItem('gts_admin'))location.href='admin-dashboard.html';
const has=DB.get('adminhash');
R.innerHTML=`<div class="login box"><h2>Admin ${has?'Login':'Setup'}</h2>${DEMO}<p class="muted">${has?'Enter your admin password.':'Create the owner password for this browser. It must be at least <b>8 characters</b>.'}</p>
<label>Password</label><input type="password" id="pw" placeholder="${has?'Password':'At least 8 characters'}" autocomplete="${has?'current-password':'new-password'}">
${has?'':'<label>Repeat password</label><input type="password" id="pw2" placeholder="Type it again">'}
<label style="font-weight:400"><input type="checkbox" id="sh" style="width:auto"> Show password</label><div class="err" id="er" style="margin-top:8px"></div><br>
<button class="btn" id="go">${has?'Log in':'Create password'}</button> <a href="index.html" class="btn o">Back to site</a></div>`;
const err=m=>{$('#er').textContent=m};
$('#sh').onchange=e=>['pw','pw2'].forEach(i=>{if($('#'+i))$('#'+i).type=e.target.checked?'text':'password'});
$('#go').onclick=async()=>{err('');try{const p=$('#pw').value;
if(!has){if(p.length<8)return err('Password too short: use at least 8 characters.');if(p!==$('#pw2').value)return err('The two passwords do not match.')}
else if(!p)return err('Enter your password.');
const h=await hash(p);
if(!has){localStorage.setItem('gts_adminhash',JSON.stringify(h));if(DB.get('adminhash')!==h)return err('This browser is blocking saved data (private mode?). Use a normal window and open the site from your local server.')}
else if(h!==has)return err('Incorrect password.');
sessionStorage.setItem('gts_admin','1');pre(500,()=>location.href='admin-dashboard.html')}catch(e){err('Something went wrong: '+e.message)}};
['pw','pw2'].forEach(i=>{if($('#'+i))$('#'+i).onkeydown=e=>e.key==='Enter'&&$('#go').click()});
