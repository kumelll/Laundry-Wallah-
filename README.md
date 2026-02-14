# Laundry Wallah

A full-stack laundry service web application. Customers can register, login, schedule pickups/deliveries, place orders at predefined rates. Admins can view and update order status.

## Features

- **Homepage** — App info, services, pricing, how it works
- **User flow** — Register, login, place orders with pickup/drop slots, predefined rates
- **Admin flow** — Login, view all orders, update status (Pickup → Washing → Out for Delivery → Delivered)
- **Database** — JSON file storage (no native build tools required)

## How to Run

### Step 1: Install Node.js (if not installed)

1. Download Node.js from **https://nodejs.org** (LTS version)
2. Run the installer and follow the prompts
3. **Restart your terminal/Command Prompt** after installation
4. Verify: open a new terminal and run `node --version` — you should see a version number

### Step 2: Start the server

**Option A — Double-click `START.bat`**  
- Navigate to the `laundry-wallah` folder  
- Double-click `START.bat`  
- The server will install dependencies (first time) and start  
- Open **http://localhost:3000** in your browser  

**Option B — Command line**

```bash
cd c:\Users\ASUS\.cursor\laundry-wallah
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

### Step 3: Use the app

- **Register** — Create a user account  
- **Login** — Sign in with your email and password  
- **Admin** — Use admin@laundrywallah.com / admin123  

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "node is not recognized" | Install Node.js from nodejs.org and restart your terminal |
| Port 3000 already in use | Run `set PORT=3001` then `node server.js` to use a different port |
| Cannot connect to server | Make sure you opened **http://localhost:3000** (not a file path) |
| npm install fails | Run terminal as Administrator, or try `npm install --legacy-peer-deps` |

## Status Flow

1. Pending  
2. Pickup Scheduled  
3. Clothes Picked Up  
4. Washing Completed  
5. Out for Delivery  
6. Delivered  
