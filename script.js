
// Update this after backend is deployed to Azure
const BOOKING_API_URL = "https://<your-azure-backend>.azurewebsites.net/api/bookings"; // TODO: set real URL

const form = document.getElementById("booking-form");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Submitting…";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const data = await res.json();
    statusEl.textContent = `Booked! Confirmation: ${data.confirmation || "Check your SMS/email."}`;
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Sorry—couldn’t book right now. Please try again later.";
  }
});
