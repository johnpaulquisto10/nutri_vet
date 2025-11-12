# NutriVet Bansud - Frontend React Application

A fully functional React.js frontend for the **NutriVet Bansud – Livestock Health & Farmer Assistance System**. This capstone project provides a comprehensive platform for farmers to manage their livestock, report diseases, and receive advisories, while administrators can manage users, track reports, and disseminate important health information.

## 🚀 Features

### 👨‍🌾 Farmer Dashboard
- **Dashboard**: Overview of livestock count, active reports, and latest advisories
- **Livestock Management**: Full CRUD interface for managing animal records (cattle, goats, pigs, poultry)
- **Disease Reporting**: Submit reports with GPS location mapping via React-Leaflet
- **Advisories**: Read-only advisory feed with health alerts from administrators

### 👨‍💼 Admin Dashboard
- **Analytics Dashboard**: Charts showing total animals, users, reports, and monthly trends
- **User Management**: Add, edit, delete farmers with view of their statistics
- **Report Management**: Review, filter by status, and mark disease reports as resolved
- **Advisory Management**: Create, edit, and manage farmer health alerts with severity levels
- **Interactive Map**: Visualize report locations geographically with Leaflet
- **Export**: Generate PDF summaries of analytics and reports

### 🔐 Authentication & Security
- JWT token-based authentication
- Role-based access control (RBAC) - Farmer and Admin roles
- Form validation with error handling
- Automatic token refresh and logout on 401 errors
- Secure localStorage persistence

### 🎨 UI/UX
- Responsive design (mobile, tablet, desktop)
- Custom Tailwind CSS theme with green agricultural color scheme
- Lucide React icons for consistent iconography
- Toast notifications for user feedback
- Loading spinners and error states
- Smooth animations and transitions

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Lightning-fast build tool & dev server |
| **React Router v7** | Client-side routing & navigation |
| **Tailwind CSS 3.4** | Utility-first CSS styling |
| **Axios** | HTTP client for API calls |
| **Recharts** | Charts, graphs, and data visualization |
| **React-Leaflet 4** | Interactive map component |
| **Leaflet 1.9** | Underlying mapping library |
| **Lucide React** | Beautiful icon library |
| **React-Hot-Toast** | Toast notifications |
| **jsPDF & html2pdf.js** | PDF generation and export |

## 📋 Project Structure

```
frontend-react/
├── src/
│   ├── assets/                    # Static files
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.jsx             # Top navigation with user menu
│   │   ├── Sidebar.jsx            # Role-based side navigation
│   │   ├── DashboardCard.jsx      # Stat card component
│   │   ├── ChartCard.jsx          # Chart container wrapper
│   │   └── MapView.jsx            # Leaflet map integration
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state & token management
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx          # Login form with validation
│   │   │   └── Register.jsx       # Registration form
│   │   ├── user/                  # Farmer pages
│   │   │   ├── Dashboard.jsx      # Overview & quick stats
│   │   │   ├── Animals.jsx        # Livestock CRUD
│   │   │   ├── Reports.jsx        # Disease reporting with map
│   │   │   └── Advisories.jsx     # Advisory feed
│   │   └── admin/                 # Admin pages
│   │       ├── Dashboard.jsx      # Analytics & metrics
│   │       ├── ManageUsers.jsx    # User management table
│   │       ├── ManageReports.jsx  # Report review & status
│   │       ├── ManageAdvisories.jsx # Create/edit advisories
│   │       ├── InteractiveMap.jsx # Report location map
│   │       └── ExportReports.jsx  # PDF export
│   ├── routes/
│   │   ├── PrivateRoute.jsx       # Auth guard wrapper
│   │   └── RoleBasedRoute.jsx     # Role-based access wrapper
│   ├── services/
│   │   └── api.js                 # Axios instance & all API endpoints
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   ├── App.jsx                    # Main routing configuration
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles + Tailwind directives
├── public/                        # Static public assets
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite configuration with proxy
├── tailwind.config.js             # Tailwind theme & settings
├── postcss.config.js              # PostCSS with Tailwind & Autoprefixer
├── .env.local                     # Environment variables (not in git)
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ (download: https://nodejs.org)
- **npm** or **yarn** package manager
- **Laravel backend** running at `http://localhost:8000`

### Installation

1. **Navigate to project directory**
   ```bash
   cd c:\laragon\www\nutri-vet\frontend-react
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > Note: We use `--legacy-peer-deps` because React 19 is newer than react-leaflet's peer dependency.

3. **Configure environment variables**
   
   Create or edit `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173 in your browser.

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

### Preview Production Build
```bash
npm run preview
```

## 🔑 Authentication Flow

1. User navigates to `/login` or `/register`
2. Credentials are submitted to Laravel backend (`/api/login` or `/api/register`)
3. Backend returns: `{ user, role, token }`
4. Token is stored in `localStorage` and `AuthContext`
5. Axios interceptor automatically includes: `Authorization: Bearer <token>` in all requests
6. Routes are protected by `<PrivateRoute>` (checks authentication) and `<RoleBasedRoute>` (checks role)
7. On 401 response, token is cleared and user is redirected to `/login`
8. On logout, all auth data is cleared

## 🧭 Routing Structure

### Public Routes (Unauthenticated)
- `GET /login` - User login page
- `GET /register` - User registration page

### Farmer Routes (role: "farmer")
- `GET /user/dashboard` - Farmer overview & stats
- `GET /user/animals` - Manage livestock (CRUD operations)
- `GET /user/reports` - Submit & view disease reports
- `GET /user/advisories` - Read-only advisory feed

### Admin Routes (role: "admin")
- `GET /admin/dashboard` - Analytics & system overview
- `GET /admin/users` - User management (CRUD)
- `GET /admin/reports` - Report review & status management
- `GET /admin/advisories` - Create & manage farm advisories
- `GET /admin/map` - Interactive map of report locations
- `GET /admin/export` - Export data as PDF

## 💾 API Integration

All API calls go through `services/api.js` using Axios with automatic token injection.

### Available Services

```javascript
// Authentication
authService.login(email, password)
authService.register({ name, email, password, password_confirmation, role })
authService.logout()
authService.getCurrentUser()

// Livestock Animals
animalService.getAll()
animalService.getById(id)
animalService.create(data)
animalService.update(id, data)
animalService.delete(id)

// Disease Reports
reportService.getAll()
reportService.getById(id)
reportService.create(data)              // multipart/form-data for images
reportService.update(id, data)
reportService.markResolved(id)
reportService.delete(id)

// Advisories
advisoryService.getAll()
advisoryService.getById(id)
advisoryService.create(data)
advisoryService.update(id, data)
advisoryService.delete(id)

// Admin: User Management
userService.getAll()
userService.getById(id)
userService.update(id, data)
userService.delete(id)
userService.getStats()

// Admin: Analytics
analyticsService.getDashboardStats()
analyticsService.getReportsTrend(days)
analyticsService.getAnimalStats()
analyticsService.exportReports(format)
```

**Note:** Adjust endpoints in `services/api.js` to match your Laravel backend routes.

## 🎨 Design System

### Color Palette
- **Primary Green**: `#16a34a` - Agriculture & growth theme
- **Secondary Gray**: `#374151` - Text & neutral backgrounds
- **Accent Colors**: 
  - Blue (`#3b82f6`) - Info & in-progress
  - Yellow (`#f59e0b`) - Warning & medium priority
  - Red (`#ef4444`) - Error & high priority

### Typography
- **Font**: System UI fonts (Inter fallback)
- **H1**: 30px, Bold
- **H2**: 24px, Semibold
- **Body**: 16px, Regular
- **Small**: 14px, Regular

### Components
All UI uses Tailwind utility classes with custom shadows:
- `.shadow-card` - Subtle card shadow
- `.shadow-card-lg` - Larger hover shadow
- `.rounded-2xl` - Consistent border radius

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🧪 Demo Credentials

For testing with mock backend:
```
Admin:  admin@example.com / password
Farmer: farmer@example.com / password
```

## 📊 Feature Walkthrough

### Farmer Workflow
1. **Register/Login** → `/user/dashboard`
2. **View Overview** → See livestock count, active reports, latest advisories
3. **Manage Animals** → `/user/animals` (add/edit/delete livestock)
4. **Submit Report** → `/user/reports` (disease report with GPS mapping)
5. **Read Advisories** → `/user/advisories` (view admin alerts)

### Admin Workflow
1. **Login** → `/admin/dashboard`
2. **View Analytics** → See charts, trends, system stats
3. **Manage Users** → `/admin/users` (add/edit/remove farmers)
4. **Review Reports** → `/admin/reports` (mark resolved, delete)
5. **Send Alerts** → `/admin/advisories` (create advisories by severity)
6. **View Map** → `/admin/map` (see report hotspots)
7. **Export Data** → `/admin/export` (generate PDF)

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### API Connection Fails
1. Verify Laravel backend is running: `php artisan serve`
2. Check `.env.local` has correct `VITE_API_URL`
3. Ensure CORS is enabled in Laravel (allow `http://localhost:5173`)

### Build Errors
```bash
npm run build -- --debug
```

## 📦 Dependencies Overview

### Essential
- `react@^19.2.0` - UI library
- `react-router-dom@^7.0.0` - Routing
- `axios@^1.7.0` - HTTP client

### Styling
- `tailwindcss@^3.4.0` - CSS framework
- `lucide-react@^0.468.0` - Icons

### Data & Charts
- `recharts@^2.12.0` - Charts
- `react-leaflet@^4.2.0` + `leaflet@^1.9.4` - Maps

### UX
- `react-hot-toast@^2.4.0` - Notifications
- `jspdf@^2.5.0` + `html2pdf.js@^0.10.1` - PDF export

## 🚀 Deployment

### Netlify / Vercel
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add env var: `VITE_API_URL=https://your-backend.com`

### Traditional Server (Apache/Nginx)
```bash
npm run build
# Copy dist/* to your web server root
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)

## 📄 License

Part of the NutriVet Bansud Capstone System. All rights reserved.

---

**Built with ❤️ for Philippine Livestock Farmers** 🌾🐄🚜
