# TrackMySubs

A full-stack subscription tracker featuring a Web Dashboard, a Chrome Browser Extension with an automated DOM price scraper, and a Discord automation alert cron service.

## Architecture

The project is structured into three main layers:

1. **Backend API (Root)**: Node.js Express server connected to MongoDB, implementing REST endpoints and running a daily cron worker checking for renewals 3 days in advance to dispatch Discord webhook alerts.
2. **Frontend Dashboard (`frontend/`)**: React app built with Vite, providing visual tracking stats, monthly/yearly standardized costs calculation engines, forms, and item ledgers.
3. **Chrome Extension (`extension/`)**: Manifest V3 extension featuring target DOM scraping to extract subscription prices and names from webpages on the fly.

---

## Project Structure

```text
track/
├── config/
│   └── db.js                 # MongoDB connection logic
├── models/
│   └── Subscription.js       # Subscription Mongoose schema
├── routes/
│   └── subscriptionRoutes.js # REST API routes
├── services/
│   └── alertWorker.js        # node-cron Discord alert worker
├── extension/
│   ├── manifest.json         # Extension Manifest V3 config
│   ├── popup.html            # Extension popup layout
│   ├── popup.css             # Extension styling
│   └── popup.js              # Tab detection and posting logic
├── frontend/
│   ├── index.html            # React mounting HTML
│   ├── vite.config.js        # React/Vite proxy configuration
│   ├── src/
│   │   ├── main.jsx          # Entry react script
│   │   ├── App.jsx           # Main state coordinator
│   │   ├── index.css         # Modern dark layout CSS
│   │   └── components/
│   │       ├── CostCards.jsx        # Aggregated cost card logic
│   │       ├── SubscriptionForm.jsx # Add subscription form
│   │       └── SubscriptionList.jsx # Tracked services list table
│   └── package.json          # React packages
├── package.json              # Backend packages
├── server.js                 # Main server entrypoint
└── .env                      # Local configuration file
```

---

## Features

### 1. Master Web Dashboard
- **Standardized Calculations**: Converts weekly costs (multiplied by 4.33) and yearly costs (divided by 12) to compute true total monthly and yearly outlays.
- **Controlled Subscriptions Ledger**: Supports adding subscription details (billing cycles, prices, renewal dates) and deleting entries.
- **Responsive Theme**: Dark-themed user experience utilizing glassmorphism-inspired UI layouts.

### 2. Browser Extension
- **Autofill**: Scrapes the domain of the active tab (e.g. "Netflix" from `https://www.netflix.com/checkout`) to fill in the Service Name.
- **Price Scraper**: Traverses headings, paragraphs, spans, rows, and strong tags on active tabs to identify price digits located near billing keywords.
- **Visual Fallback**: If no keywords match, the extension evaluates element font sizes to capture the largest text matching currency configurations.
- **Field Clean-up**: Strips symbols and formats prices into valid decimal values.

### 3. Automated Cron Worker
- Runs every 24 hours at midnight.
- Searches for subscriptions with a renewal date exactly 3 days in the future.
- Formats detail payloads and transmits alerts directly to your Discord webhook channel.

---

## API Endpoints

### `GET /health`
Returns server connection health state:
```json
{
  "status": "ok"
}
```

### `GET /api/subscriptions`
Returns all tracked subscriptions in the database.

### `POST /api/subscriptions`
Creates a new subscription:
```json
{
  "name": "Spotify",
  "price": 10.99,
  "billingCycle": "monthly",
  "nextRenewalDate": "2026-06-30"
}
```

### `DELETE /api/subscriptions/:id`
Deletes a subscription from the database.

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local installation

### 1. Backend API Setup
Configure your environment variables by creating a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_uri
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

Install backend dependencies and run the server:
```bash
npm install
npm start
```

The API will listen on `http://localhost:5001`.

### 2. Web Dashboard Setup
Navigate to the `frontend/` folder, install packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

The app will launch on `http://localhost:5174/` or `http://localhost:5173/`.

### 3. Chrome Extension Installation
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button in the top left.
4. Select the `extension/` directory from this project workspace.
