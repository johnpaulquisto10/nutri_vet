# ✅ DATABASE STORAGE VERIFICATION

## Lahat ng Data ay Naka-store sa MySQL Database!

### Current Database State:
- **29 Authentication Tokens** - stored in `personal_access_tokens` table
- **8 Active Sessions** - stored in `sessions` table  
- **2 Users** - stored in `users` table (admin & farmer)
- **4 Insurance Applications** - stored in `insurance_applications` table
- **3 Disease Reports** - stored in `disease_reports` table
- **2 Advisories** - stored in `advisories` table

---

## Database Tables and What They Store:

### 1. **Authentication & Sessions**
| Table | Description | Current Count |
|-------|-------------|---------------|
| `personal_access_tokens` | Sanctum API tokens (each login creates entry) | 29 |
| `sessions` | User sessions for web authentication | 8 |
| `users` | User accounts (admin, farmers) | 2 |

### 2. **Insurance Applications**
| Table | Description | Current Count |
|-------|-------------|---------------|
| `insurance_applications` | All insurance applications submitted | 4 |
| `insurance_application_statuses` | Status reference (Pending, Approved, Rejected) | 3 |

### 3. **Disease Reports**
| Table | Description | Current Count |
|-------|-------------|---------------|
| `disease_reports` | All disease outbreak reports | 3 |
| `report_images` | Images attached to reports | 0 |
| `report_statuses` | Status reference (Pending, In Progress, Resolved) | 3 |

### 4. **Advisories**
| Table | Description | Current Count |
|-------|-------------|---------------|
| `advisories` | Health advisories for farmers | 2 |
| `advisory_reads` | Tracks which users read advisories | Variable |

### 5. **Reference Data** (Master Data)
| Table | Records |
|-------|---------|
| `roles` | 2 (admin, farmer) |
| `barangays` | 13 barangays in Bansud |
| `municipalities` | 1 (Bansud) |
| `provinces` | 1 (Oriental Mindoro) |
| `animal_types` | 7 (Cattle, Carabao, etc.) |
| `animal_purposes` | 8 (Dairy, Meat, etc.) |
| `diseases` | 5 disease types |
| `disease_categories` | 6 categories |
| `advisory_categories` | 6 categories |
| `advisory_severities` | 3 (Low, Medium, High) |

---

## Data Flow: Frontend → Backend → Database

### When User Logs In:
```
1. Frontend: User enters email/password
2. Backend: AuthController validates credentials
3. Database: Creates token in personal_access_tokens table
4. Database: Creates session in sessions table
5. Frontend: Stores token in localStorage (for UI state only)
6. ✅ Token is in DATABASE, localStorage just caches it
```

### When User Submits Disease Report:
```
1. Frontend: User fills form with disease info
2. Backend: DiseaseReportController->store()
3. Database: INSERT into disease_reports table
4. Database: If image, INSERT into report_images table
5. ✅ Report is PERMANENTLY in database
```

### When User Submits Insurance Application:
```
1. Frontend: User fills insurance form
2. Backend: InsuranceApplicationController->store()
3. Database: INSERT into insurance_applications table
4. Database: Sets status_id to 1 (Pending)
5. ✅ Application is PERMANENTLY in database
```

### When Admin Approves Application:
```
1. Frontend: Admin clicks "Approve"
2. Backend: InsuranceApplicationController->approve()
3. Database: UPDATE insurance_applications SET status_id=2, reviewed_at=NOW()
4. ✅ Status change SAVED in database
```

---

## Configuration Proving Database Storage:

### Laravel .env Configuration:
```env
# Database Connection
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nutri_vet  ← All data stored here!
DB_USERNAME=root
DB_PASSWORD=

# Session Storage (in database, not files)
SESSION_DRIVER=database  ← Sessions in DB!

# Cache Storage (in database)
CACHE_STORE=database  ← Cache in DB!

# Queue Storage (in database)
QUEUE_CONNECTION=database  ← Jobs in DB!
```

### Laravel Sanctum (API Token Storage):
- **File**: `config/sanctum.php`
- **Token Model**: `Laravel\Sanctum\PersonalAccessToken`
- **Table**: `personal_access_tokens`
- Every login creates a database record with:
  - `id` - Auto-increment ID
  - `tokenable_id` - User ID
  - `name` - Token name
  - `token` - Hashed token
  - `created_at` - When token was created
  - `last_used_at` - When token was last used

---

## LocalStorage vs Database:

### ❌ What is NOT stored in localStorage:
- User credentials (password)
- Full user data
- Disease reports
- Insurance applications
- Advisories
- Any persistent application data

### ✅ What IS in localStorage (temporary, for UX only):
- `auth_token` - Copy of current session token (also in DB)
- `auth_user` - Cached user info (also in DB)
- `auth_role` - Cached role (also in DB)

**Purpose**: So user doesn't need to login on every page refresh.
**Security**: Token expires, backend validates against database on every request.

---

## How to Verify Everything is in Database:

### 1. Check Tables Directly:
```bash
cd backend-laravel
php artisan tinker

# View tokens
Laravel\Sanctum\PersonalAccessToken::count()
Laravel\Sanctum\PersonalAccessToken::latest()->first()

# View users
App\Models\User::all()

# View reports
App\Models\DiseaseReport::with('reporter', 'disease', 'status')->get()

# View insurance apps
App\Models\InsuranceApplication::with('applicant', 'status')->get()
```

### 2. Check via MySQL:
```sql
USE nutri_vet;

SELECT COUNT(*) FROM personal_access_tokens;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM disease_reports;
SELECT COUNT(*) FROM insurance_applications;
SELECT * FROM sessions;
```

### 3. Test Data Persistence:
```bash
# 1. Clear localStorage in browser (F12 > Application > Clear Storage)
# 2. Login again
# 3. Check database - new token created
# 4. Submit a report
# 5. Check disease_reports table - new row added
```

---

## ✅ CONCLUSION:

**LAHAT NG DATA AY NASA DATABASE!**

- ✅ Authentication tokens → `personal_access_tokens` table
- ✅ User sessions → `sessions` table
- ✅ User accounts → `users` table
- ✅ Disease reports → `disease_reports` table
- ✅ Report images → `report_images` table
- ✅ Insurance applications → `insurance_applications` table
- ✅ Advisories → `advisories` table
- ✅ All reference data → respective tables

**localStorage is ONLY used for:**
- Caching the current session token (so user doesn't login on every page refresh)
- Temporary UI state

**All persistent data is in MySQL database `nutri_vet`!**

---

## Backend API Endpoints (All Connected to Database):

### Authentication (Sanctum Token-based)
- `POST /api/login` → Creates token in DB
- `POST /api/register` → Creates user in DB
- `POST /api/logout` → Deletes token from DB
- `GET /api/profile` → Reads user from DB
- `PUT /api/profile` → Updates user in DB

### Disease Reports
- `GET /api/disease-reports` → Reads from `disease_reports` table
- `POST /api/disease-reports` → Inserts into `disease_reports` table
- `PUT /api/disease-reports/{id}` → Updates `disease_reports` table
- `DELETE /api/disease-reports/{id}` → Deletes from `disease_reports` table

### Insurance Applications
- `GET /api/insurance-applications` → Reads from `insurance_applications` table
- `POST /api/insurance-applications` → Inserts into `insurance_applications` table
- `PUT /api/insurance-applications/{id}` → Updates `insurance_applications` table
- `POST /api/admin/insurance-applications/{id}/approve` → Updates status in DB

### Advisories
- `GET /api/advisories` → Reads from `advisories` table
- `POST /api/admin/advisories` → Inserts into `advisories` table
- `PUT /api/admin/advisories/{id}` → Updates `advisories` table
- `POST /api/advisories/{id}/read` → Inserts into `advisory_reads` table

**EVERY API CALL READS/WRITES TO MYSQL DATABASE!**
