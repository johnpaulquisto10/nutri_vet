# NutriVet Backend API - Implementation Complete

## Overview
Complete Laravel 12 backend with REST API for the NutriVet livestock health management system.

## 🗄️ Database Implementation

### Migrations Created
1. **2025_11_20_000001_create_nutrivet_tables.php** - Main migration creating all 25 tables
2. **2025_11_20_000002_add_fields_to_users_table.php** - Adds role_id, full_name, phone_number, is_active, last_login_at to users

### Seeder Created
**NutriVetSeeder.php** - Seeds all master data:
- 2 roles (admin, farmer)
- 1 province (Oriental Mindoro)
- 1 municipality (Bansud)
- 13 barangays (all barangays in Bansud)
- 7 animal types (Cattle, Carabao, Goat, Pig, Chicken, Duck, Other)
- 8 animal purposes (Breeding, Meat Production, Dairy, Draft/Work, Eggs, Mixed, Pet/Show, Other)
- 6 disease categories
- 5 common diseases
- 3 status types for each workflow
- 3 advisory severities (Low, Medium, High)
- 6 advisory categories
- 2 default users:
  - **Admin**: admin@nutrivet.com / password
  - **Farmer**: farmer@nutrivet.com / password

## 📦 Eloquent Models Created

### Core Models
- **User.php** - Extended with relationships for insurance, reports, advisories, address
- **Role.php** - User roles (admin, farmer)
- **UserAddress.php** - User location with GPS coordinates

### Insurance System
- **InsuranceApplication.php** - Livestock insurance applications
- **AnimalType.php** - Types of animals
- **AnimalPurpose.php** - Purpose of raising animals
- **InsuranceApplicationStatus.php** - Application workflow statuses

### Disease Reporting
- **DiseaseReport.php** - Disease reports with GPS
- **Disease.php** - Disease catalog
- **DiseaseCategory.php** - Disease categories
- **ReportStatus.php** - Report workflow statuses
- **ReportImage.php** - Report photos

### Advisory System
- **Advisory.php** - Health advisories with scopeActive()
- **AdvisoryCategory.php** - Advisory categories
- **AdvisorySeverity.php** - Severity levels (Low, Medium, High)
- **AdvisoryRead.php** - Track who read which advisory

### Location System
- **Province.php** - Philippine provinces
- **Municipality.php** - Municipalities
- **Barangay.php** - Barangays (smallest admin unit)

### Audit & System
- **ActivityLog.php** - User activity tracking
- **Notification.php** - User notifications with markAsRead()
- **SystemSetting.php** - System configuration with get/set helpers

## 🛣️ API Routes (routes/api.php)

### Public Routes
```
POST /api/register - Register new farmer
POST /api/login - Login user
```

### Protected Routes (require auth:sanctum)

#### Authentication
```
POST /api/logout - Logout and revoke token
GET  /api/profile - Get user profile
PUT  /api/profile - Update profile
```

#### Dashboard
```
GET /api/dashboard - Farmer dashboard stats
GET /api/admin/dashboard - Admin dashboard stats
```

#### Insurance Applications
```
GET    /api/insurance-applications - List applications
POST   /api/insurance-applications - Create application
GET    /api/insurance-applications/{id} - Get single application
PUT    /api/insurance-applications/{id} - Update application
DELETE /api/insurance-applications/{id} - Delete application
GET    /api/insurance-applications/stats/summary - Get statistics

# Admin only
POST /api/admin/insurance-applications/{id}/approve - Approve application
POST /api/admin/insurance-applications/{id}/reject - Reject application
```

#### Disease Reports
```
GET    /api/disease-reports - List reports
POST   /api/disease-reports - Create report (multipart/form-data for images)
GET    /api/disease-reports/{id} - Get single report
PUT    /api/disease-reports/{id} - Update report
DELETE /api/disease-reports/{id} - Delete report
GET    /api/disease-reports/map/data - Get map coordinates
GET    /api/disease-reports/stats/summary - Get statistics

# Admin only
POST /api/admin/disease-reports/{id}/investigate - Mark as investigating
POST /api/admin/disease-reports/{id}/resolve - Resolve report
```

#### Advisories
```
GET  /api/advisories - List active advisories
GET  /api/advisories/{id} - Get single advisory
POST /api/advisories/{id}/read - Mark as read
GET  /api/advisories/unread/count - Get unread count

# Admin only
POST   /api/admin/advisories - Create advisory
PUT    /api/admin/advisories/{id} - Update advisory
DELETE /api/admin/advisories/{id} - Delete advisory
```

#### Reference Data
```
GET /api/reference/barangays - Get all barangays
GET /api/reference/animal-types - Get animal types
GET /api/reference/animal-purposes - Get animal purposes
GET /api/reference/diseases - Get disease catalog
GET /api/reference/disease-categories - Get disease categories
GET /api/reference/advisory-categories - Get advisory categories
GET /api/reference/advisory-severities - Get severity levels
```

## 🎮 Controllers Created

### API Controllers (app/Http/Controllers/Api/)
1. **AuthController.php** - Authentication endpoints
   - register(), login(), logout(), profile(), updateProfile()

2. **InsuranceApplicationController.php** - Insurance management
   - index(), store(), show(), update(), destroy()
   - approve(), reject(), statistics()

3. **DiseaseReportController.php** - Disease reporting
   - index(), store(), show(), update(), destroy()
   - investigate(), resolve(), mapData(), statistics()

4. **AdvisoryController.php** - Advisory system
   - index(), store(), show(), update(), destroy()
   - markAsRead(), unreadCount()

5. **DashboardController.php** - Dashboard data
   - farmerDashboard(), adminDashboard()

6. **ReferenceDataController.php** - Dropdown data
   - barangays(), animalTypes(), animalPurposes()
   - diseases(), diseaseCategories()
   - advisoryCategories(), advisorySeverities()

## 🔐 Authentication

**Laravel Sanctum** token-based authentication:
- Login returns: `{ user, role, token }`
- Frontend stores token in localStorage
- All protected routes require: `Authorization: Bearer {token}`
- Token stored in `personal_access_tokens` table

## 📊 Role-Based Access Control

Two roles with different permissions:

### Farmer Role
- Create/update/delete own insurance applications (only if pending)
- Create/update/delete own disease reports (only if not resolved)
- View all active advisories
- Mark advisories as read
- Access farmer dashboard

### Admin Role
- View all insurance applications and disease reports
- Approve/reject insurance applications
- Investigate/resolve disease reports
- Create/update/delete advisories
- Access admin dashboard with system-wide statistics
- View all farmers

## 🚀 Setup Instructions

### 1. Run Migrations
```bash
cd backend-laravel
php artisan migrate
```

### 2. Seed Database
```bash
php artisan db:seed --class=NutriVetSeeder
```

### 3. Create Storage Link
```bash
php artisan storage:link
```

### 4. Start Server
```bash
php artisan serve
```
Server runs on `http://localhost:8000`

### 5. Test API
Default credentials:
- **Admin**: admin@nutrivet.com / password
- **Farmer**: farmer@nutrivet.com / password

## 📝 API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": { ... } // Validation errors
}
```

### Pagination Response
```json
{
  "current_page": 1,
  "data": [ ... ],
  "total": 50,
  "per_page": 15
}
```

## 🔧 Environment Variables

Add to `.env`:
```env
APP_NAME="NutriVet Bansud"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nutrivet
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:5173
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

## 📸 Image Upload

Disease report images stored in `storage/app/public/disease-reports/`

**Upload endpoint**: POST `/api/disease-reports`
- Content-Type: `multipart/form-data`
- Field: `images[]` (max 5 images)
- Max size: 5MB per image
- Formats: JPEG, PNG, JPG

## 🔍 Filtering & Search

Most endpoints support query parameters:
- `?status=pending` - Filter by status
- `?search=keyword` - Search by keywords
- `?category_id=1` - Filter by category
- `?page=2` - Pagination

## 📈 Dashboard Statistics

### Farmer Dashboard Returns
- Total, approved, pending insurance applications
- Total, active disease reports
- Active and unread advisories
- Recent applications and reports (last 5)

### Admin Dashboard Returns
- Total and active farmers
- Insurance applications by status
- Disease reports by status
- Active advisories
- Applications by animal type (chart data)
- Reports by month (chart data)
- Pending applications for review
- Recent disease reports

## ✅ Next Steps

To connect frontend to backend:

1. **Update frontend `.env.local`**:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. **Update AuthContext.jsx**:
   - Replace mock login with API call to `/api/login`
   - Store returned token in localStorage
   - Add user role from API response

3. **Update services/api.js**:
   - All service methods already defined
   - Just uncomment API calls and remove mock data

4. **Test authentication flow**:
   - Login with test credentials
   - Verify token stored in localStorage
   - Verify API requests include Authorization header
   - Test RBAC by logging in as admin vs farmer

## 🎯 API Testing with Postman/Insomnia

### 1. Login
```
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "farmer@nutrivet.com",
  "password": "password"
}
```

### 2. Use Token
Copy token from response and add to all requests:
```
Authorization: Bearer {your_token_here}
```

### 3. Test Endpoints
```
GET http://localhost:8000/api/dashboard
GET http://localhost:8000/api/insurance-applications
GET http://localhost:8000/api/reference/barangays
```

## 📚 Model Relationships Quick Reference

```
User
  └── hasMany: InsuranceApplications, DiseaseReports, Advisories
  └── hasOne: UserAddress
  └── belongsTo: Role

InsuranceApplication
  └── belongsTo: User (applicant), Barangay, AnimalType, Purpose, Status

DiseaseReport
  └── belongsTo: User (reporter), Disease, Status
  └── hasMany: ReportImages

Advisory
  └── belongsTo: User (creator), Category, Severity
  └── belongsToMany: Users (readers)

Barangay → Municipality → Province
```

## 🎉 Backend Complete!

All API endpoints are ready. The backend can now:
- ✅ Authenticate users with Sanctum tokens
- ✅ Manage insurance applications with approval workflow
- ✅ Handle disease reports with GPS and images
- ✅ Manage advisories with read tracking
- ✅ Provide dashboard statistics for both roles
- ✅ Supply reference data for dropdowns
- ✅ Enforce role-based access control
- ✅ Store activity logs and notifications

Ready to integrate with React frontend!
