
const SHOP={
  name:'Your Barbershop Name',
  phone:'(555) 555-5555',
  address:'123 Main St, Your City, CA',
  hours:[['Mon','9:00 AM – 6:00 PM'],['Tue','9:00 AM – 6:00 PM'],['Wed','9:00 AM – 6:00 PM'],['Thu','9:00 AM – 6:00 PM'],['Fri','9:00 AM – 7:00 PM'],['Sat','9:00 AM – 5:00 PM'],['Sun','Closed']],
};
const SERVICES=[
  {id:'haircut',name:'Haircut',durationMin:30,price:30},
  {id:'beard',name:'Beard Trim',durationMin:20,price:20},
  {id:'cut-beard',name:'Haircut + Beard',durationMin:45,price:45},
  {id:'kids',name:"Kids' Cut",durationMin:25,price:25},
  {id:'hot-towel',name:'Hot Towel Shave',durationMin:30,price:35},
];
const BARBERS=[
  {id:'any',name:'Any Available',initials:'A'},
  {id:'alex',name:'Alex',initials:'AX'},
  {id:'jordan',name:'Jordan',initials:'JD'},
  {id:'taylor',name:'Taylor',initials:'TY'},
];
const BOOKING_API_URL='https://<your-azure-backend>.azurewebsites.net/api/bookings';
const $=id=>document.getElementById(id);
$('brandName').textContent=SHOP.name; $('shopPhone').textContent=SHOP.phone; $('shopPhone').href=`tel:${SHOP.phone.replace(/[^\d+]/g,'')}`; $('shopAddress').textContent=SHOP.address; $('year').textContent=new Date().getFullYear();
$('hoursList').innerHTML=SHOP.hours.map(([d,h])=>`<li><strong>${d}</strong> <span style="float:right">${h}</span></li>`).join('');
const fmt=n=>`$${n.toFixed(2)}`;
$('servicesGrid').innerHTML=SERVICES.map(s=>`<article class="card"><span class="pill">${s.durationMin} min</span><h3>${s.name}</h3><p class="muted">Professional service tailored to you.</p><p class="price">${fmt(s.price)}</p></article>`).join('');
$('pricingTable').innerHTML=`<thead><tr><th>Service</th><th>Duration</th><th>Price</th></tr></thead><tbody>${SERVICES.map(s=>`<tr><td>${s.name}</td><td>${s.durationMin} min</td><td>${fmt(s.price)}</td></tr>`).join('')}</tbody>`;
$('barbersGrid').innerHTML=BARBERS.filter(b=>b.id!=='any').map(b=>`<article class="card barber"><div class="avatar">${b.initials}</div><div><h3>${b.name}</h3><p class="muted">Fade specialist • Beard grooming</p></div></article>`).join('');
const svcSel=$('serviceSelect'); svcSel.innerHTML=SERVICES.map(s=>`<option value="${s.id}">${s.name} — ${s.durationMin} min</option>`).join('');
const barbSel=$('barberSelect'); barbSel.innerHTML=BARBERS.map(b=>`<option value="${b.name}">${b.name}</option>`).join('');
const form=$('booking-form'); const statusEl=$('status');
function toISOWithTZ(local){const dt=new Date(local);const off=dt.getTimezoneOffset();const ms=off*60*1000;const loc=new Date(dt.getTime()-ms);return loc.toISOString().replace('Z',offset(off));}
function offset(m){const s=m<=0?'+':'-';const mm=Math.abs(m);const hh=String(Math.floor(mm/60)).padStart(2,'0');const mi=String(mm%60).padStart(2,'0');return `${s}${hh}:${mi}`}
form.addEventListener('submit',async e=>{e.preventDefault();statusEl.textContent='Submitting…';const fd=new FormData(form);const p=Object.fromEntries(fd.entries());const svc=SERVICES.find(s=>s.id===p.service);const startLocal=p.start;const start=new Date(startLocal);const end=new Date(start.getTime()+(svc?.durationMin||30)*60000);p.service=svc?svc.name:p.service;p.durationMin=svc?.durationMin||30;p.price=svc?.price||0;p.start=toISOWithTZ(startLocal);p.end=toISOWithTZ(end.toISOString().slice(0,16));try{const r=await fetch(BOOKING_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});if(!r.ok)throw new Error(`Server responded ${r.status}`);const d=await r.json();statusEl.textContent=`Booked! Confirmation: ${d.confirmation||'Check your SMS/email.'}`;form.reset();}catch(err){console.error(err);statusEl.textContent="Sorry—couldn't book right now. Please try again later.";}});
