form.addEventListener('submit', async e => {
  e.preventDefault();
  statusEl.textContent = 'Submitting…';

  const fd = new FormData(form);
  const p = Object.fromEntries(fd.entries());

  const svc = SERVICES.find(s => s.id === p.service);

  const startLocal = p.start;
  const start = new Date(startLocal);
  const end = new Date(start.getTime() + (svc?.durationMin || 30) * 60000);

  p.service = svc ? svc.name : p.service;
  p.durationMin = svc?.durationMin || 30;
  p.price = svc?.price || 0;

  // FIXED TIME FORMATTING
  p.start = toISOWithTZ(startLocal);
  p.end = toISOWithTZ(end);

  try {
    const r = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });

    if (!r.ok) throw new Error(`Server responded ${r.status}`);

    const d = await r.json();
    statusEl.textContent = `Booked! Confirmation: ${d.confirmation || 'Check your Google Calendar.'}`;
    form.reset();

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Sorry—couldn't book right now. Please try again later.";
  }
});
