# TimeTrackerUI

Frontend React app for the TimeTracker application. Provides user registration & login, email confirmation, password reset, dashboard for tracking projects, and summary generation.

API part here: https://github.com/avinys/TimeTrackerAPI

## Technologies
- React 18 + TypseScript + Vite
- React Router for routing
- TanStack Query for data fetching & caching
- Axios for API requests
- CSS Modules for styling
- React Hot Toast for notifications

## Setup

### Prerequisites
- Node.js (>= 18)
- Package manager (preferably pnpm)

### 1. Clone repo
```bash 
git clone https://github.com/avinys/TimeTrackerUI.git`
cd TimeTrackerUI
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Configure environment
VITE_API_URL=https://localhost:7129/api or your api url

VITE_GOOGLE_CLIENT_ID=<your-google-client-id>

### 4. Start dev server
```bash
pnpm dev
```
