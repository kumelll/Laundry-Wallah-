# Laundry Wallah – Deployment Guide

## Why login might fail after deployment

1. **Backend not running** – Only static files were deployed (e.g. Netlify/Vercel static). There is no API, so login fails.
2. **Frontend and backend on different domains** – API calls go to the wrong URL.
3. **Database not persistent** – On some hosts (ephemeral storage), data is lost on restart. Users/admin no longer exist.

## How to deploy correctly

**Note on Database Persistence:** `db/data.json` is ephemeral on most free tiers (lost on restart/sleep). Updates don't persist.

**Fix:** 
- Use paid persistent disk (Render Disks, Railway volume).
- Set env var `DATA_FILE=/persistent/path/data.json` (e.g., Render: mount disk at /data, DATA_FILE=/data/data.json).
- Or migrate to SQLite/Postgres.


### Option A: Single host (recommended)

Deploy the **entire project** (including `server.js`) to a Node.js host so the backend and frontend run on the same domain.

**Hosts with Persistence:**
- Railway: Auto-volumes.
- Render (paid): Add Disk, set root /data, env DATA_FILE=/data/data.json.
- Heroku: Paid dyno + add-on.
- Fly.io: Volumes.

1. Connect your repo to the host.
2. Set **Start Command**: `npm start` (or `node server.js`).
3. Use **persistent disk** if available so `db/data.json` survives restarts.
4. Do **not** deploy only the `dist`/static folder; deploy the full project.

**Result:** API runs at `https://your-app.onrender.com/api` and frontend at `https://your-app.onrender.com`. Login works.

---

### Option B: Split (frontend + backend on different hosts)

**Backend** (e.g. Render): Deploy the full project with `npm start`.

**Frontend** (e.g. Netlify): Deploy only static files. Set the API URL before `api.js` loads:

Add to the `<head>` of `index.html` (and any page that loads before login):

```html
<script>
  window.LAUNDRY_API_URL = 'https://your-backend.onrender.com/api';
</script>
```

Then load `api.js` after this script. The app will call your backend for login.

---

### Option C: Static-only deployment (login will not work)

If you deploy only HTML/CSS/JS (e.g. Netlify static, GitHub Pages), there is **no backend**. Login and registration will always fail. You must deploy the Node.js backend as in Option A or B.

---

## Quick checks

1. **API health:** Open `https://your-domain.com/api/health`. You should see:
   ```json
   {"ok":true,"message":"Laundry Wallah API is running"}
   ```
   If you get 404, the backend is not deployed or not running.

2. **Admin credentials (after backend is running):**
   - Email: `admin@laundrywallah.com`
   - Password: `admin123`
