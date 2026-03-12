
# Barbershop Website (Frontend for GitHub Pages)

A modern, single‑page barbershop website with built‑in online booking UI. Connects to an Azure‑hosted backend API.

## Customize your shop details
Edit `script.js` at the top:
- `SHOP` → name, phone, address, hours list
- `SERVICES` → add/remove services with duration and price
- `BARBERS` → add/remove barbers

## Connect to your backend
In `script.js`, set `BOOKING_API_URL` to your Azure endpoint, e.g.
```js
const BOOKING_API_URL = 'https://your-app.azurewebsites.net/api/bookings';
```

## Deploy to GitHub Pages
1. Push to the `main` branch of your repo hosting Pages.
2. Settings → Pages → Source: Deploy from a branch; Branch: `main`; Folder: `/ (root)`.

## Files
- `index.html` — One‑page site (hero, services, barbers, pricing, hours, booking form)
- `styles.css` — Responsive design with gold + purple accents
- `script.js` — Populates content and submits bookings to your backend
- `assets/` — Logo, icons, placeholders

