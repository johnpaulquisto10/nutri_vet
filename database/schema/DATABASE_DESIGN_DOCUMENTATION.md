# NutriVet Database Design Documentation

## Executive Summary

This document describes the MySQL database schema for **NutriVet Bansud** - a livestock health management system designed for farmers and agricultural administrators in Bansud, Oriental Mindoro.

### Database Characteristics
- **Normalization Level**: 5NF (Fifth Normal Form)
- **Database Engine**: InnoDB (ACID compliant)
- **Character Set**: UTF-8mb4 (full Unicode support)
- **Total Tables**: 25 core tables + 5 views
- **Role-Based**: Supports Admin and Farmer roles with distinct permissions

---

## Database Architecture Overview

### Entity Relationship Summary

```
USERS (Authentication & Authorization)
├── roles (1:N) - User role types
├── user_addresses (1:N) - Physical addresses with GPS
└── activity_logs (1:N) - Audit trail

LOCATION HIERARCHY
└── provinces (1:N)
    └── municipalities (1:N)
        └── barangays (1:N)

INSURANCE SYSTEM
├── insurance_applications (N:1) → users
├── animal_types (1:N)
├── animal_purposes (1:N)
└── insurance_application_statuses (1:N)

DISEASE REPORTING SYSTEM
├── disease_reports (N:1) → users
├── diseases (1:N)
├── disease_categories (1:N)
├── report_statuses (1:N)
└── report_images (1:N)

ADVISORY SYSTEM
├── advisories (N:1) → users
├── advisory_categories (1:N)
├── advisory_severities (1:N)
└── advisory_reads (N:N) - User reading tracker

SYSTEM
├── notifications (N:1) → users
└── system_settings
```

---

## Table Descriptions

### 1. Authentication & Authorization

#### `roles`
- **Purpose**: Define user roles in the system
- **Fields**: `role_id`, `role_name`, `role_description`
- **Data**: 'admin', 'farmer'
- **Indexes**: 
  - PK: `role_id`
  - INDEX: `role_name`

#### `users`
- **Purpose**: Store all user accounts (farmers and administrators)
- **Key Fields**:
  - `user_id` (PK)
  - `role_id` (FK → roles)
  - `full_name`, `email`, `password_hash`
  - `phone_number`
  - `is_active` (soft delete flag)
  - `email_verified_at`, `last_login_at`
- **Security**: 
  - Email must be unique
  - Password stored as hash (bcrypt recommended)
  - Remember token for session management
- **Indexes**:
  - PK: `user_id`
  - UNIQUE: `email`
  - INDEX: `role_id`, `is_active`, `created_at`

#### `user_addresses`
- **Purpose**: Store user physical addresses with geolocation
- **Key Fields**:
  - `address_id` (PK)
  - `user_id` (FK → users)
  - `barangay_id` (FK → barangays)
  - `sitio`, `street_address`
  - `latitude`, `longitude` (DECIMAL for precision)
  - `is_primary` (multiple addresses support)
- **Indexes**:
  - PK: `address_id`
  - INDEX: `user_id`, `barangay_id`, `coordinates (lat, lng)`, `is_primary`

---

### 2. Location Hierarchy (Philippine Address System)

#### `provinces`
- **Purpose**: Master list of provinces
- **Data**: 'Oriental Mindoro'
- **Indexes**: PK: `province_id`, INDEX: `province_name`

#### `municipalities`
- **Purpose**: Municipalities within provinces
- **Data**: 'Bansud'
- **Relationship**: N:1 with provinces
- **Indexes**: 
  - PK: `municipality_id`
  - UNIQUE: `(municipality_name, province_id)`
  - INDEX: `province_id`, `municipality_name`

#### `barangays`
- **Purpose**: Barangays within municipalities
- **Data**: 13 barangays in Bansud
  - Alcadesma, Bato, Conrazon, Malo, Manihala, Pag-asa, Poblacion, Proper Bansud, Rosacara, Salcedo, Sumagui, Proper Tiguisan, Villa Pagasa
- **Relationship**: N:1 with municipalities
- **Indexes**: 
  - PK: `barangay_id`
  - UNIQUE: `(barangay_name, municipality_id)`
  - INDEX: `municipality_id`, `barangay_name`

---

### 3. Insurance Application System

#### `animal_types`
- **Purpose**: Master list of livestock types
- **Data**: Cattle, Carabao, Swine, Poultry, Horse, Goat, Other
- **Indexes**: PK: `animal_type_id`, INDEX: `animal_type_name`

#### `animal_purposes`
- **Purpose**: Reasons for raising animals
- **Data**: Fattening, Draft, Broilers, Pullets, Breeding, Dairy, Layers, Parent Stock
- **Indexes**: PK: `purpose_id`, INDEX: `purpose_name`

#### `insurance_application_statuses`
- **Purpose**: Application workflow states
- **Data**: Pending, Approved, Rejected
- **Indexes**: PK: `status_id`, INDEX: `status_name`

#### `insurance_applications`
- **Purpose**: Store livestock mortality insurance applications
- **Key Fields**:
  - `application_id` (PK)
  - `applicant_id` (FK → users)
  - `barangay_id` (FK → barangays)
  - `animal_type_id` (FK → animal_types)
  - `purpose_id` (FK → animal_purposes)
  - `status_id` (FK → statuses)
  - `animal_type_other` (for "Other" type)
  - `contact_number`
  - `number_of_heads`, `age_months`, `breed`, `basic_color`
  - `male_count`, `female_count`
  - `submitted_at`, `reviewed_at`, `reviewed_by`
  - `admin_notes`
- **Business Rules**:
  - Default status: Pending
  - Only admins can review (set reviewed_by)
  - Gender counts optional
- **Indexes**:
  - PK: `application_id`
  - INDEX: `applicant_id`, `status_id`, `animal_type_id`, `submitted_at`, `reviewed_by`
  - COMPOSITE: `(applicant_id, status_id, submitted_at)` - for farmer dashboard queries

---

### 4. Disease Reporting System

#### `disease_categories`
- **Purpose**: Categorize diseases for better organization
- **Data**: Viral, Bacterial, Parasitic, Fungal, Metabolic, Nutritional
- **Indexes**: PK: `category_id`, INDEX: `category_name`

#### `diseases`
- **Purpose**: Master list of livestock diseases
- **Key Fields**:
  - `disease_id` (PK)
  - `category_id` (FK → disease_categories)
  - `disease_name`, `common_name`
  - `description`, `symptoms`, `treatment`, `prevention`
  - `is_active` (soft delete)
- **Data**: Includes common diseases like FMD, Pneumonia, Mastitis, Avian Influenza
- **Indexes**:
  - PK: `disease_id`
  - INDEX: `category_id`, `disease_name`, `is_active`
  - FULLTEXT: `(disease_name, common_name, symptoms)` - for disease search

#### `report_statuses`
- **Purpose**: Disease report workflow states
- **Data**: Pending, In Progress, Resolved
- **Indexes**: PK: `report_status_id`, INDEX: `status_name`

#### `disease_reports`
- **Purpose**: Store disease reports submitted by farmers
- **Key Fields**:
  - `report_id` (PK)
  - `reporter_id` (FK → users)
  - `disease_id` (FK → diseases, nullable)
  - `disease_name_custom` (for unlisted diseases)
  - `animal_name`
  - `report_status_id` (FK → report_statuses)
  - `description` (TEXT)
  - `address` (reverse geocoded from GPS)
  - `latitude`, `longitude`
  - `report_date`, `submitted_at`
  - `resolved_at`, `resolved_by` (FK → users)
  - `admin_notes`
- **Business Rules**:
  - Either disease_id or disease_name_custom must be filled
  - GPS coordinates required for mapping
  - Only admins can resolve reports
- **Indexes**:
  - PK: `report_id`
  - INDEX: `reporter_id`, `disease_id`, `report_status_id`, `report_date`, `submitted_at`
  - SPATIAL: `(latitude, longitude)` - for map queries
  - COMPOSITE: `(reporter_id, report_status_id, report_date)` - for farmer report list
  - FULLTEXT: `(description, disease_name_custom, animal_name)` - for report search

#### `report_images`
- **Purpose**: Store images attached to disease reports
- **Key Fields**:
  - `image_id` (PK)
  - `report_id` (FK → disease_reports)
  - `image_path`, `image_filename`
  - `image_size`, `mime_type`
  - `is_primary` (main display image)
- **Business Rules**:
  - Multiple images per report supported
  - CASCADE delete when report deleted
- **Indexes**:
  - PK: `image_id`
  - INDEX: `report_id`, `is_primary`

---

### 5. Advisory System

#### `advisory_severities`
- **Purpose**: Importance levels for advisories
- **Data**: Low (blue), Medium (yellow), High (red)
- **Indexes**: PK: `severity_id`, INDEX: `severity_name`

#### `advisory_categories`
- **Purpose**: Organize advisories by topic
- **Data**: Disease Alert, Vaccination, Feed Management, Health & Safety, Disease Prevention, Weather Alert
- **Indexes**: PK: `category_id`, INDEX: `category_name`

#### `advisories`
- **Purpose**: Store advisories and alerts created by admins
- **Key Fields**:
  - `advisory_id` (PK)
  - `created_by` (FK → users, admin only)
  - `category_id` (FK → advisory_categories)
  - `severity_id` (FK → advisory_severities)
  - `title`, `description`
  - `is_active` (soft delete)
  - `published_at`, `expires_at`, `updated_at`
- **Business Rules**:
  - Only admins can create advisories
  - Expired advisories (expires_at < NOW()) should not display
  - Active advisories shown to all farmers
- **Indexes**:
  - PK: `advisory_id`
  - INDEX: `created_by`, `category_id`, `severity_id`, `is_active`, `published_at`
  - COMPOSITE: `(is_active, severity_id, published_at)` - for advisory feed
  - FULLTEXT: `(title, description)` - for advisory search

#### `advisory_reads`
- **Purpose**: Track which users have read which advisories
- **Relationship**: Many-to-Many between users and advisories
- **Key Fields**:
  - `read_id` (PK)
  - `advisory_id` (FK → advisories)
  - `user_id` (FK → users)
  - `read_at`
- **Business Rules**:
  - One read record per user per advisory
  - Used for "unread" badge notifications
- **Indexes**:
  - PK: `read_id`
  - UNIQUE: `(advisory_id, user_id)`
  - INDEX: `advisory_id`, `user_id`

---

### 6. System Support Tables

#### `activity_logs`
- **Purpose**: Audit trail for security and compliance
- **Key Fields**:
  - `log_id` (PK, BIGINT for high volume)
  - `user_id` (FK → users)
  - `action_type` (login, status_change, create, update, delete)
  - `table_name`, `record_id`
  - `old_values`, `new_values` (JSON format)
  - `ip_address`, `user_agent`
- **Business Rules**:
  - Triggered automatically via database triggers
  - Immutable (no updates/deletes)
  - Retention policy recommended (e.g., 2 years)
- **Indexes**:
  - PK: `log_id`
  - INDEX: `user_id`, `action_type`, `table_name`, `created_at`
  - COMPOSITE: `(user_id, action_type, created_at)` - for user activity timeline

#### `notifications`
- **Purpose**: In-app notification system
- **Key Fields**:
  - `notification_id` (PK)
  - `user_id` (FK → users)
  - `notification_type` (report_status, application_approved, new_advisory)
  - `title`, `message`
  - `related_table`, `related_id` (polymorphic reference)
  - `is_read`, `read_at`
- **Business Rules**:
  - Created when important events occur
  - Users mark as read manually
  - Auto-delete after 90 days (recommended)
- **Indexes**:
  - PK: `notification_id`
  - INDEX: `user_id`, `is_read`, `created_at`
  - COMPOSITE: `(user_id, is_read, created_at)` - for notification list

#### `system_settings`
- **Purpose**: Store configurable system parameters
- **Key Fields**:
  - `setting_id` (PK)
  - `setting_key` (UNIQUE, e.g., 'site_name', 'max_upload_size')
  - `setting_value` (TEXT for flexibility)
  - `setting_type` (string, integer, boolean, json)
  - `description`
  - `is_public` (can non-admins see this?)
  - `updated_by` (FK → users)
- **Examples**:
  - `site_name`: "NutriVet Bansud"
  - `max_image_upload_mb`: "10"
  - `notification_email`: "admin@nutrivet.com"
- **Indexes**:
  - PK: `setting_id`
  - UNIQUE: `setting_key`
  - INDEX: `is_public`

---

## Database Views

### `v_user_profiles`
Complete user information with address details
```sql
SELECT user_id, full_name, email, role_name, barangay_name, 
       municipality_name, province_name, latitude, longitude
FROM users + addresses + location hierarchy
```

### `v_insurance_applications`
Insurance applications with all related details
```sql
SELECT application_id, applicant_name, barangay_name, 
       animal_type_name, status_name, submitted_at
FROM insurance_applications + users + locations + lookups
```

### `v_disease_reports`
Disease reports with complete information
```sql
SELECT report_id, reporter_name, disease_name, status_name, 
       address, latitude, longitude, primary_image
FROM disease_reports + users + diseases + images
```

### `v_advisories`
Advisories with creator and categorization
```sql
SELECT advisory_id, title, category_name, severity_name, 
       created_by_name, published_at
FROM advisories + users + categories + severities
```

### `v_user_statistics`
Aggregated statistics per user
```sql
SELECT user_id, total_insurance_apps, approved_insurance_apps,
       total_reports, active_reports
FROM users + aggregations
```

---

## Stored Procedures

### `sp_get_farmer_dashboard_stats(user_id)`
Returns dashboard statistics for a specific farmer:
- Approved insured animals count
- Total disease reports
- Active reports (pending/in-progress)
- Resolved reports
- Active advisories count

### `sp_get_admin_dashboard_stats()`
Returns dashboard statistics for administrators:
- Total active farmers
- Pending insurance applications
- Active disease reports
- Active advisories

---

## Database Triggers

### `trg_update_last_login`
- **Table**: users
- **Event**: BEFORE UPDATE
- **Action**: Sets `last_login_at` when `remember_token` changes

### `trg_log_insurance_status_change`
- **Table**: insurance_applications
- **Event**: AFTER UPDATE
- **Action**: Logs status changes to `activity_logs`

### `trg_log_report_status_change`
- **Table**: disease_reports
- **Event**: AFTER UPDATE
- **Action**: Logs status changes to `activity_logs`

---

## Normalization Details

### 5NF (Fifth Normal Form) Compliance

**1NF (First Normal Form):**
- ✅ All columns contain atomic values
- ✅ No repeating groups
- ✅ Each row uniquely identified by primary key

**2NF (Second Normal Form):**
- ✅ All non-key attributes fully dependent on primary key
- ✅ No partial dependencies

**3NF (Third Normal Form):**
- ✅ No transitive dependencies
- ✅ All attributes directly dependent on primary key

**BCNF (Boyce-Codd Normal Form):**
- ✅ Every determinant is a candidate key

**4NF (Fourth Normal Form):**
- ✅ No multi-valued dependencies
- Example: `advisory_reads` separates the many-to-many relationship

**5NF (Fifth Normal Form / PJNF):**
- ✅ No join dependencies that aren't implied by candidate keys
- Example: Location hierarchy (provinces → municipalities → barangays) properly separated
- Example: Insurance applications separated from animal types, purposes, and statuses

---

## Index Strategy

### Primary Keys
All tables have auto-increment `INT UNSIGNED` or `BIGINT UNSIGNED` primary keys

### Foreign Keys
- All relationships properly enforced with `FOREIGN KEY` constraints
- Cascade rules set appropriately:
  - `ON DELETE CASCADE`: Child records deleted with parent (e.g., report_images)
  - `ON DELETE RESTRICT`: Prevents deletion of referenced records (e.g., roles)
  - `ON DELETE SET NULL`: Nullifies references (e.g., resolved_by when admin deleted)

### Single-Column Indexes
Created on frequently queried columns:
- `email` (users) - for login
- `role_id` (users) - for role-based queries
- `status_id` (applications, reports) - for filtering
- Date columns (`created_at`, `submitted_at`) - for sorting

### Composite Indexes
Optimized for common multi-column queries:
- `(user_id, status_id, submitted_at)` on insurance_applications
- `(reporter_id, report_status_id, report_date)` on disease_reports
- `(is_active, severity_id, published_at)` on advisories
- `(user_id, is_read, created_at)` on notifications

**Query Optimization Example:**
```sql
-- This query uses composite index efficiently:
SELECT * FROM disease_reports 
WHERE reporter_id = 123 
  AND report_status_id IN (1, 2) 
ORDER BY report_date DESC;
```

### Fulltext Indexes
For text search functionality:
- `(disease_name, common_name, symptoms)` on diseases
- `(description, disease_name_custom, animal_name)` on disease_reports
- `(title, description)` on advisories

**Search Example:**
```sql
SELECT * FROM diseases
WHERE MATCH(disease_name, common_name, symptoms) 
      AGAINST('fever blisters' IN NATURAL LANGUAGE MODE);
```

### Spatial Indexes
For geolocation queries:
- `(latitude, longitude)` on disease_reports
- `(latitude, longitude)` on user_addresses

**Geo Query Example:**
```sql
SELECT * FROM disease_reports
WHERE latitude BETWEEN 12.7 AND 12.9
  AND longitude BETWEEN 121.4 AND 121.5;
```

---

## Security Considerations

### Authentication
- Passwords stored as **bcrypt hash** (Laravel default)
- Email verification supported (`email_verified_at`)
- Session management via `remember_token`
- Last login tracking for security monitoring

### Authorization (Role-Based Access Control)
- Two roles: `admin` and `farmer`
- Enforced at application level (Laravel middleware)
- Database relationships support permission tracking

### Data Protection
- `is_active` flag for soft deletes (retain audit trail)
- Foreign key constraints prevent orphaned records
- Triggers log sensitive changes

### Audit Trail
- `activity_logs` table tracks all important actions
- IP address and user agent captured
- JSON storage for old/new values comparison

### Data Validation
- `NOT NULL` constraints where required
- `UNIQUE` constraints on emails, names
- `CHECK` constraints (if needed) via application logic
- Foreign keys ensure referential integrity

---

## Performance Optimization

### Database Level
1. **InnoDB Engine**: ACID compliance, row-level locking
2. **Connection Pooling**: Recommended for production
3. **Query Cache**: Enable for read-heavy operations
4. **Index Optimization**: Composite indexes for common queries

### Application Level (Laravel)
1. **Eloquent ORM**: Use `with()` for eager loading to prevent N+1 queries
2. **Query Builder**: For complex queries with joins
3. **Caching**: Redis/Memcached for frequently accessed data
4. **Queue Jobs**: Background processing for notifications

### Query Optimization Examples

**Bad (N+1 Problem):**
```php
$applications = InsuranceApplication::all();
foreach ($applications as $app) {
    echo $app->user->full_name; // Separate query each iteration
}
```

**Good (Eager Loading):**
```php
$applications = InsuranceApplication::with('user')->get();
foreach ($applications as $app) {
    echo $app->user->full_name; // Already loaded
}
```

---

## Backup & Maintenance

### Backup Strategy
1. **Full Backup**: Daily at midnight
2. **Incremental Backup**: Every 6 hours
3. **Binary Log**: Enable for point-in-time recovery
4. **Retention**: 30 days minimum

### Maintenance Tasks
1. **OPTIMIZE TABLE**: Monthly for fragmented tables
2. **ANALYZE TABLE**: After bulk inserts/updates
3. **Check FULLTEXT Indexes**: Rebuild if search performance degrades
4. **Archive Old Logs**: Move activity_logs > 2 years to archive database

### Monitoring
- Query performance (slow query log)
- Index usage (`EXPLAIN` statements)
- Table sizes and growth
- Connection pool status

---

## Migration Path

### From Current localStorage to MySQL

1. **Export Current Data**
   - Insurance applications from localStorage
   - Disease reports from localStorage
   - User accounts (mock data)

2. **Transform Data**
   - Hash passwords with bcrypt
   - Map barangay names to barangay_ids
   - Convert dates to TIMESTAMP format
   - Generate UUIDs if needed

3. **Import Data**
   - Use Laravel seeders or direct SQL INSERT
   - Validate foreign key relationships
   - Run integrity checks

4. **Update Application**
   - Replace localStorage calls with API calls
   - Implement Laravel Eloquent models
   - Update frontend services (axios)

---

## API Endpoint Mapping

### Authentication
- `POST /api/login` → Query users table
- `POST /api/register` → INSERT INTO users
- `POST /api/logout` → Clear remember_token

### Farmer Endpoints
- `GET /api/dashboard` → Call `sp_get_farmer_dashboard_stats()`
- `GET /api/insurance/applications` → Query v_insurance_applications
- `POST /api/insurance/apply` → INSERT INTO insurance_applications
- `GET /api/reports` → Query v_disease_reports
- `POST /api/reports` → INSERT INTO disease_reports + report_images
- `GET /api/advisories` → Query v_advisories

### Admin Endpoints
- `GET /api/admin/dashboard` → Call `sp_get_admin_dashboard_stats()`
- `GET /api/admin/users` → Query v_user_profiles
- `PATCH /api/admin/insurance/:id/status` → UPDATE insurance_applications
- `PATCH /api/admin/reports/:id/resolve` → UPDATE disease_reports
- `POST /api/admin/advisories` → INSERT INTO advisories

---

## Future Enhancements

### Phase 2 Features
1. **SMS Notifications**: Add `sms_notifications` table
2. **Document Uploads**: Add `documents` table for requirements
3. **Payment Tracking**: Add `payments` table for insurance premiums
4. **Veterinarian Directory**: Add `veterinarians` table
5. **Breeding Records**: Add `breeding_logs` table

### Scalability Considerations
1. **Partitioning**: Partition `activity_logs` by date
2. **Sharding**: If user base exceeds 1M, consider sharding by region
3. **Read Replicas**: For high-traffic reporting queries
4. **Archive Database**: Move historical data (>2 years) to separate DB

---

## Conclusion

This database schema provides:
- ✅ **5NF Normalization**: Eliminates redundancy and anomalies
- ✅ **Comprehensive Indexing**: Optimized for common queries
- ✅ **Role-Based Design**: Clear separation between farmers and admins
- ✅ **Audit Trail**: Complete activity logging
- ✅ **Scalability**: Designed to handle growth
- ✅ **Data Integrity**: Foreign keys and constraints
- ✅ **Performance**: Composite indexes and views

The schema is ready for production deployment with Laravel backend integration.
