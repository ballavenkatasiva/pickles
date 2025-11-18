const api = "";

function qs(sel){return document.querySelector(sel)}
function qsa(sel){return document.querySelectorAll(sel)}

// Tabs
qs('#tab-login').addEventListener('click', ()=>{showTab('login')})
qs('#tab-register').addEventListener('click', ()=>{showTab('register')})
function showTab(t){
  qs('#tab-login').classList.toggle('active', t==='login')
  qs('#tab-register').classList.toggle('active', t==='register')
  qs('#login-form').classList.toggle('active', t==='login')
  qs('#register-form').classList.toggle('active', t==='register')
}

// Toggle password
qs('#toggle-login-pass').addEventListener('click', ()=> {
  const p = qs('#login-password');
  if(p.type==='password'){p.type='text'; qs('#toggle-login-pass').innerText='Hide'}
  else {p.type='password'; qs('#toggle-login-pass').innerText='Show'}
})

// Register
qs('#register-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const username = qs('#reg-username').value.trim();
  const password = qs('#reg-password').value.trim();
  const msg = qs('#reg-msg'); msg.innerText='';
  if(!username||!password){ msg.innerText='Please enter username and password'; return;}
  try{
    const res = await fetch(api+'/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
    const data = await res.json();
    if(data.success){ msg.style.color='lightgreen'; msg.innerText='Account created. You can login.'; showTab('login')}
    else { msg.style.color='#FFD6B2'; msg.innerText = data.message || 'Registration failed' }
  }catch(err){ msg.innerText='Network error' }
})

// Login
qs('#login-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const username = qs('#login-username').value.trim();
  const password = qs('#login-password').value.trim();
  const msg = qs('#login-msg'); msg.innerText='';
  if(!username||!password){ msg.innerText='Enter username and password'; return;}
  try{
    const res = await fetch(api+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
    const data = await res.json();
    if(data.success){ msg.style.color='lightgreen'; msg.innerText='Login success'; afterLogin(username) }
    else { msg.style.color='#FFD6B2'; msg.innerText = data.message || 'Login failed' }
  }catch(err){ msg.innerText='Network error' }
})

function afterLogin(username){
  qs('#welcome').innerText = `Welcome, ${username}`;
  qs('#auth-card').style.display='none';
  qs('#logout').style.display='inline-block';
  qs('#dashboard').style.display='block';
  qs('#hero').style.display='none';
  loadBookings();
}

// Logout
qs('#logout').addEventListener('click', ()=>{
  location.reload();
})

// Booking create
qs('#booking-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = qs('#cust-name').value.trim();
  const item = qs('#cust-item').value.trim();
  const qty = qs('#cust-qty').value;
  const phone = qs('#cust-phone').value.trim();
  const msg = qs('#book-msg'); msg.innerText='';
  if(!name||!item||!phone){ msg.innerText='Please fill required fields'; return; }
  const payload = { name, item, qty, phone, date: new Date().toLocaleString() };
  try{
    const res = await fetch(api+'/book',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await res.json();
    if(data.success){ msg.style.color='lightgreen'; msg.innerText='Booking saved'; qs('#booking-form').reset(); loadBookings() }
    else { msg.style.color='#FFD6B2'; msg.innerText='Save failed' }
  }catch(err){ msg.innerText='Network error' }
})

// Load bookings
async function loadBookings(){
  try{
    const res = await fetch(api+'/bookings');
    const list = await res.json();
    const tbody = qs('#bookings-table tbody'); tbody.innerHTML='';
    list.forEach((b,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${escapeHtml(b.name)}</td><td>${escapeHtml(b.item)}</td><td>${b.qty}</td><td>${escapeHtml(b.phone)}</td><td>${escapeHtml(b.date)}</td>`;
      tbody.appendChild(tr);
    });
  }catch(err){
    console.error(err);
  }
}

function escapeHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
