
# Barbershop Frontend (GitHub Pages)

Static site for booking barbershop appointments. Connects to an Azure-hosted backend.

## Local preview

Just open `index.html` in your browser, or serve via any static server.

## Configure backend URL

Edit `script.js` and replace `BOOKING_API_URL` with your Azure backend URL once deployed, e.g.

```js
const BOOKING_API_URL = "https://your-app.azurewebsites.net/api/bookings";
```

## Deploy to GitHub Pages

1. Create a repository named `barbershop-frontend`.
2. Push these files, or upload via the web UI.
3. Enable **Settings → Pages** and choose **Deploy from a branch** → `main` / root.
4. (Optional) Use the included GitHub Actions workflow for automatic Pages deployment.

## Structure

```
/ (root)
  index.html
  styles.css
  script.js
  /assets
  /.github/workflows/deploy-pages.yml
```
