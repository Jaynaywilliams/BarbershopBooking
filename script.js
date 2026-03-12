
/* === Configurable Data ===
 * Update these arrays to match your shop. The UI will populate automatically.
 */
const SHOP = {
  name: 'Your Barbershop Name',
  phone: '(555) 555-5555',
  address: '123 Main St, Your City, CA',
  hours: [
    ['Mon', '9:00 AM – 6:00 PM'],
    ['Tue', '9:00 AM – 6:00 PM'],
    ['Wed', '9:00 AM – 6:00 PM'],
    ['Thu', '9:00 AM – 6:00 PM'],
    ['Fri', '9:00 AM – 7:00 PM'],
    ['Sat', '9:00 AM – 5:00 PM'],
    ['Sun', 'Closed'],
  ],
};

const SERVICES = [
  { id: 'haircut',      name: 'Haircut',              durationMin: 30, price: 30 },
  { id: 'beard',        name: 'Beard Trim',           durationMin: 20, price: 20 },
  { id: 'cut-beard',    name: 'Haircut + Beard',      durationMin: 45, price: 45 },
  { id: 'kids',         name: "Kids' Cut",           durationMin: 25, price: 25 },
  { id: 'hot-towel',    name: 'Hot Towel Shave',      durationMin: 30, price: 35 },
];

const BARBERS = [
  { id: 'any', name: 'Any Available', initials: 'A' },
  { id: 'alex', name: 'Alex', initials: 'AX' },
  { id: 'jordan', name: 'Jordan', initials: 'JD' },
  { id: 'taylor', name: 'Taylor', initials: 'TY' },
];

// Update this once the backend is deployed to Azure
const BOOKING_API_URL = 'https://<your-azure-backend>.azurewebsites.net/api/bookings';

// === Populate UI from data ===
const byId = (id) => document.getElementById(id);
const brandNameEl = byId('brandName');
const shopPhoneEl = byId('shopPhone');
const shopAddressEl = byId('shopAddress');

brandNameEl.textContent = SHOP.name;
shopPhoneEl.textContent = SHOP.phone;
shopPhoneEl.href = `tel:${SHOP.phone.replace(/[^\d+]/g, '')}`;
shopAddressEl.textContent = SHOP.address;

// Hours
const hoursList = byId('hoursList');
hoursList.innerHTML = SHOP.hours.map(([day, hrs]) => `<li><strong>${day}</strong> <span style="float:right">${hrs}</span></li>`).join('');

// Services grid & pricing table
const fmtPrice = (n) => `$${n.toFixed(2)}`;

const servicesGrid = document.getElementById('servicesGrid');
servicesGrid.innerHTML = SERVICES.map(s => `
  <article class="card">
    <span class="pill">${s.durationMin} min</span>
    <h3>${s.name}</h3>
    <p class="muted">Professional service tailored to you.</p>
    <p class="price">${fmtPrice(s.price)}</p>
  </article>
`).join('');

const pricingTable = document.getElementById('pricingTable');
pricingTable.innerHTML = `
  <thead><tr><th>Service</th><th>Duration</th><th>Price</th></tr></thead>
  <tbody>
    ${SERVICES.map(s => `<tr><td>${s.name}</td><td>${s.durationMin} min</td><td>${fmtPrice(s.price)}</td></tr>`).join('')}
  </tbody>
`;

// Barbers grid
const barbersGrid = document.getElementById('barbersGrid');
barbersGrid.innerHTML = BARBERS.filter(b => b.id !== 'any').map(b => `
  <article class="card barber">
    <div class="avatar">${b.initials}</div>
    <div>
      <h3>${b.name}</h3>
      <p class="muted">Fade specialist • Beard grooming</p>
    </div>
  </article>
`).join('');

// Booking form selects
const serviceSelect = document.getElementById('serviceSelect');
serviceSelect.innerHTML = SERVICES.map(s => `<option value="${s.id}">${s.name} — ${s.durationMin} min</option>`).join('');

const barberSelect = document.getElementById('barberSelect');
barberSelect.innerHTML = BARBERS.map(b => `<option value="${b.name}">${b.name}</option>`).join('');

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// === Booking form submission ===
const form = document.getElementById('booking-form');
const statusEl = document.getElementById('status');

function toISOWithTZ(localDateTimeStr) {
  // localDateTimeStr from <input type="datetime-local">
  const dt = new Date(localDateTimeStr);
  const tzOffsetMin = dt.getTimezoneOffset();
  const tzMs = tzOffsetMin * 60 * 1000;
  const localTime = new Date(dt.getTime() - tzMs); // treat as UTC-like to get local components
  return localTime.toISOString().replace('Z', getOffsetTZ(tzOffsetMin));
}

function getOffsetTZ(offsetMinutes) {
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const m = Math.abs(offsetMinutes);
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Submitting…';

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  const svc = SERVICES.find(s => s.id === payload.service);
  const startLocal = payload.start;

  // compute end time by duration
  const startDate = new Date(startLocal);
  const endDate = new Date(startDate.getTime() + (svc?.durationMin || 30) * 60000);

  payload.service = svc ? svc.name : payload.service;
  payload.durationMin = svc?.durationMin || 30;
  payload.price = svc?.price || 0;
  payload.start = toISOWithTZ(startLocal);
  payload.end = toISOWithTZ(endDate.toISOString().slice(0,16));

  try {
    const res = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const data = await res.json();
    statusEl.textContent = `Booked! Confirmation: ${data.confirmation || 'Check your SMS/email.'}`;
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Sorry—couldn't book right now. Please try again later.';
  }
});
