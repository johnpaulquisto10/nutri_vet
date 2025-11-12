# NutriVet Bansud - AI Coding Agent Instructions

## Architecture Overview

This is a **full-stack livestock health management system** with:
- **Frontend**: React 19 + Vite + React Router v7 (in `frontend-react/`)
- **Backend**: Laravel 12 + Sanctum + Fortify + Inertia (in `backend-laravel/`)
- **Communication**: REST API with JWT token authentication

The frontend is a **standalone SPA** that communicates with Laravel via Axios, NOT using Inertia SSR. The backend uses Inertia for its own admin views but exposes API endpoints for the React frontend.

## Critical Development Workflows

### Frontend Development
```powershell
cd frontend-react
npm install --legacy-peer-deps  # Required for React 19 compatibility
npm run dev                      # Starts Vite dev server on :5173
```

**Environment Setup**: Create `frontend-react/.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

### Backend Development
```powershell
cd backend-laravel
composer install
php artisan serve               # Starts Laravel on :8000
php artisan migrate             # Run migrations
```

### Running Both Together
The frontend proxies `/api` requests to `localhost:8000` (see `vite.config.js`). Start both servers simultaneously.

## Authentication Architecture

**Key Pattern**: Frontend uses **mock authentication** by default (see `frontend-react/src/context/AuthContext.jsx`):
- Mock users: `farmer@example.com` / `admin@example.com` with password `password`
- Token stored in `localStorage` as `auth_token`, `auth_user`, `auth_role`
- Axios interceptor in `services/api.js` adds `Authorization: Bearer <token>` to all requests
- 401 responses trigger automatic logout and redirect to `/login`

**When implementing real API endpoints**: Replace mock logic in `AuthContext.jsx` with actual API calls to Laravel Sanctum/Fortify endpoints.

## Role-Based Access Control (RBAC)

Two roles: `farmer` and `admin`

**Route Protection Pattern** (see `App.jsx`):
```jsx
<RoleBasedRoute allowedRoles={["farmer"]}>
  <Animals />
</RoleBasedRoute>
```

**Farmer routes**: `/user/*` - manage livestock, submit reports, view advisories
**Admin routes**: `/admin/*` - manage users, review reports, create advisories, view analytics

## Service Layer Pattern

All API calls go through centralized services in `services/api.js`:
```javascript
// Example usage in components:
import { animalService, reportService } from '../services/api';

const animals = await animalService.getAll();
await reportService.create(formData);  // multipart for image uploads
```

**Important**: `reportService.create()` uses `multipart/form-data` for image uploads, all others use JSON.

## Styling Conventions

- **Tailwind-only**: No CSS modules or styled-components
- **Color system**: `primary-*` (green agriculture theme), `secondary-*` (gray neutrals)
- **Custom utilities**: `shadow-card`, `shadow-card-lg`, `rounded-2xl` (defined in `tailwind.config.js`)
- **Icons**: Use `lucide-react` exclusively
- **Notifications**: `react-hot-toast` for all user feedback

## Component Patterns

### Reusable Components (`components/`)
- `Navbar.jsx` - Top navigation with user menu and logout
- `Sidebar.jsx` - Role-based side navigation (different menus for farmer/admin)
- `DashboardCard.jsx` - Stat cards with icon, title, value, subtitle
- `ChartCard.jsx` - Wrapper for Recharts components
- `MapView.jsx` - React-Leaflet integration for GPS mapping

### Page Structure
All pages follow this pattern:
```jsx
<div className="flex h-screen bg-gray-50">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Navbar />
    <main className="flex-1 overflow-y-auto p-6">
      {/* Page content */}
    </main>
  </div>
</div>
```

## Data Visualization

- **Charts**: Use `recharts` (BarChart, LineChart, PieChart) - see `admin/Dashboard.jsx`
- **Maps**: Use `react-leaflet` with OpenStreetMap tiles - see `MapView.jsx` and `admin/InteractiveMap.jsx`
- **PDF Export**: Use `jspdf` or `html2pdf.js` - see `admin/ExportReports.jsx`

## Backend API Conventions (When Building Endpoints)

Expected Laravel API structure (currently minimal, expand as needed):
```
POST   /api/login       - Returns { user, role, token }
POST   /api/register    - Returns { user, role, token }
POST   /api/logout      - Revokes token
GET    /api/animals     - List all livestock
POST   /api/animals     - Create animal
PUT    /api/animals/:id - Update animal
DELETE /api/animals/:id - Delete animal
GET    /api/reports     - List disease reports
POST   /api/reports     - Create report (multipart)
PATCH  /api/reports/:id/resolve - Mark resolved
GET    /api/advisories  - List advisories
```

**Authentication**: Use Laravel Sanctum tokens. Frontend expects `token` field in login/register responses.

## Common Pitfalls

1. **React 19 + react-leaflet**: Always use `npm install --legacy-peer-deps`
2. **API proxy**: Vite proxy rewrites `/api` → `http://localhost:8000/api`, but Axios baseURL already includes `/api`
3. **Image uploads**: Must use `FormData` and `multipart/form-data` header for report images
4. **Leaflet CSS**: Already imported in `index.css` - don't import again
5. **Role checks**: Always check `role` from AuthContext, not from user object directly

## Key Files to Reference

- `frontend-react/src/services/api.js` - All API endpoint definitions
- `frontend-react/src/context/AuthContext.jsx` - Auth state management
- `frontend-react/src/App.jsx` - Complete routing structure
- `frontend-react/tailwind.config.js` - Custom theme configuration
- `frontend-react/README.md` - Comprehensive feature documentation

## Testing Approach

**Demo credentials** for mock auth:
- Farmer: `farmer@example.com` / `password`
- Admin: `admin@example.com` / `password`

No automated tests currently configured. Manual testing workflow:
1. Test both roles separately
2. Verify RBAC - farmers cannot access `/admin/*` routes
3. Test CRUD operations with toast notifications
4. Verify map functionality with geolocation
