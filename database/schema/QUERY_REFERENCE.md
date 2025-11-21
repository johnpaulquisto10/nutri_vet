# NutriVet Database - SQL Query Reference Guide

## 🎯 Common Queries Quick Reference

This guide provides ready-to-use SQL queries for common operations in the NutriVet system.

---

## 📊 DASHBOARD QUERIES

### Admin Dashboard Statistics

```sql
-- Get all dashboard stats (using stored procedure)
CALL sp_get_admin_dashboard_stats();

-- Manual query for dashboard stats
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS total_users,
    (SELECT COUNT(*) FROM animals WHERE is_active = TRUE) AS total_animals,
    (SELECT SUM(quantity) FROM animals WHERE is_active = TRUE) AS total_animal_quantity,
    (SELECT COUNT(*) FROM disease_reports) AS total_reports,
    (SELECT COUNT(*) FROM disease_reports WHERE report_status_id = 1) AS pending_reports,
    (SELECT COUNT(*) FROM advisories WHERE is_active = TRUE 
        AND effective_from <= CURDATE() 
        AND (effective_until IS NULL OR effective_until >= CURDATE())) AS active_advisories,
    (SELECT COUNT(*) FROM insurance_applications WHERE application_status_id = 1) AS pending_insurance;
```

### Farmer Dashboard Statistics

```sql
-- Get farmer stats (replace 123 with actual user_id)
CALL sp_get_farmer_dashboard_stats(123);

-- Manual query
SET @user_id = 123;
SELECT 
    (SELECT COUNT(*) FROM animals WHERE owner_id = @user_id AND is_active = TRUE) AS my_animals,
    (SELECT SUM(quantity) FROM animals WHERE owner_id = @user_id AND is_active = TRUE) AS my_animal_quantity,
    (SELECT COUNT(*) FROM disease_reports WHERE reporter_id = @user_id) AS my_reports,
    (SELECT COUNT(*) FROM disease_reports WHERE reporter_id = @user_id 
        AND report_status_id IN (1, 2)) AS my_active_reports,
    (SELECT COUNT(*) FROM insurance_applications WHERE applicant_id = @user_id) AS my_applications;
```

---

## 👤 USER MANAGEMENT QUERIES

### Create New User

```sql
-- Create farmer user
INSERT INTO users (role_id, full_name, email, password_hash, phone_number, is_active, email_verified_at)
VALUES (
    2,  -- farmer role
    'Juan Dela Cruz',
    'juan@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- password: "password"
    '0912-345-6789',
    TRUE,
    NOW()
);

-- Get the new user_id
SELECT LAST_INSERT_ID();
```

### Find User by Email

```sql
SELECT u.*, r.role_name
FROM users u
JOIN roles r ON u.role_id = r.role_id
WHERE u.email = 'farmer@example.com'
  AND u.is_active = TRUE;
```

### Get User with Address

```sql
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    u.phone_number,
    r.role_name,
    b.barangay_name,
    m.municipality_name,
    p.province_name,
    ua.sitio,
    ua.latitude,
    ua.longitude
FROM users u
JOIN roles r ON u.role_id = r.role_id
LEFT JOIN user_addresses ua ON u.user_id = ua.user_id
LEFT JOIN barangays b ON ua.barangay_id = b.barangay_id
LEFT JOIN municipalities m ON b.municipality_id = m.municipality_id
LEFT JOIN provinces p ON m.province_id = p.province_id
WHERE u.user_id = 123;
```

### List All Farmers with Statistics

```sql
SELECT * FROM v_user_statistics
WHERE role_name = 'farmer'
ORDER BY total_animals DESC, last_login_at DESC;
```

### Update User Profile

```sql
UPDATE users
SET 
    full_name = 'Updated Name',
    phone_number = '0999-888-7777',
    updated_at = NOW()
WHERE user_id = 123;
```

### Deactivate User Account

```sql
UPDATE users
SET 
    is_active = FALSE,
    updated_at = NOW()
WHERE user_id = 123;
```

---

## 🐄 ANIMAL/LIVESTOCK QUERIES

### Add New Animal

```sql
INSERT INTO animals (
    owner_id, 
    animal_type_id, 
    breed_id, 
    animal_name, 
    age_in_months, 
    weight_kg, 
    quantity, 
    gender,
    health_status_id
)
VALUES (
    123,  -- user_id
    1,    -- Cattle
    1,    -- Holstein breed
    'Bessie',
    36,
    520.00,
    1,
    'female',
    1     -- healthy
);
```

### Get User's Animals

```sql
SELECT 
    a.animal_id,
    a.animal_name,
    at.type_name AS animal_type,
    b.breed_name,
    a.age_in_months,
    a.weight_kg,
    a.quantity,
    a.gender,
    ahs.status_name AS health_status,
    a.created_at
FROM animals a
JOIN animal_types at ON a.animal_type_id = at.animal_type_id
LEFT JOIN breeds b ON a.breed_id = b.breed_id
JOIN animal_health_statuses ahs ON a.health_status_id = ahs.status_id
WHERE a.owner_id = 123
  AND a.is_active = TRUE
ORDER BY a.created_at DESC;
```

### Search Animals by Type

```sql
SELECT 
    a.animal_id,
    a.animal_name,
    at.type_name,
    b.breed_name,
    a.quantity,
    ahs.status_name
FROM animals a
JOIN animal_types at ON a.animal_type_id = at.animal_type_id
LEFT JOIN breeds b ON a.breed_id = b.breed_id
JOIN animal_health_statuses ahs ON a.health_status_id = ahs.status_id
WHERE a.owner_id = 123
  AND at.type_name = 'Cattle'
  AND a.is_active = TRUE;
```

### Update Animal Status

```sql
UPDATE animals
SET 
    health_status_id = 3,  -- sick
    updated_at = NOW()
WHERE animal_id = 456;
```

### Delete Animal (Soft Delete)

```sql
UPDATE animals
SET 
    is_active = FALSE,
    updated_at = NOW()
WHERE animal_id = 456;
```

### Get Animal Inventory Summary

```sql
SELECT * FROM v_animal_inventory
ORDER BY total_quantity DESC;
```

---

## 📋 DISEASE REPORT QUERIES

### Submit New Disease Report

```sql
INSERT INTO disease_reports (
    reporter_id,
    animal_id,
    disease_id,
    animal_name,
    barangay_id,
    sitio,
    latitude,
    longitude,
    report_status_id,
    description,
    symptoms,
    affected_count,
    report_date
)
VALUES (
    123,  -- user_id
    456,  -- animal_id (or NULL)
    1,    -- disease_id (or NULL for custom)
    'Bessie',
    12,   -- Proper Bansud
    'Sitio Centro',
    12.8167,
    121.4667,
    1,    -- pending
    'Animal showing signs of lameness and fever',
    'Limping on left front leg, elevated temperature',
    1,
    CURDATE()
);
```

### Get User's Reports

```sql
SELECT 
    dr.report_id,
    dr.disease_name_custom,
    d.disease_name,
    dr.animal_name,
    b.barangay_name,
    dr.sitio,
    rs.status_name,
    dr.report_date,
    dr.created_at
FROM disease_reports dr
LEFT JOIN diseases d ON dr.disease_id = d.disease_id
JOIN barangays b ON dr.barangay_id = b.barangay_id
JOIN report_statuses rs ON dr.report_status_id = rs.status_id
WHERE dr.reporter_id = 123
ORDER BY dr.created_at DESC;
```

### Get All Pending Reports (Admin)

```sql
SELECT 
    dr.report_id,
    u.full_name AS reporter_name,
    u.email AS reporter_email,
    COALESCE(d.disease_name, dr.disease_name_custom) AS disease,
    dr.animal_name,
    b.barangay_name,
    dr.affected_count,
    dr.report_date,
    dr.created_at
FROM disease_reports dr
JOIN users u ON dr.reporter_id = u.user_id
LEFT JOIN diseases d ON dr.disease_id = d.disease_id
JOIN barangays b ON dr.barangay_id = b.barangay_id
WHERE dr.report_status_id = 1  -- pending
ORDER BY dr.created_at DESC;
```

### Get Report Details with Attachments

```sql
SELECT 
    dr.*,
    u.full_name AS reporter_name,
    u.phone_number AS reporter_phone,
    COALESCE(d.disease_name, dr.disease_name_custom) AS disease,
    b.barangay_name,
    rs.status_name,
    resolver.full_name AS resolved_by_name
FROM disease_reports dr
JOIN users u ON dr.reporter_id = u.user_id
LEFT JOIN diseases d ON dr.disease_id = d.disease_id
JOIN barangays b ON dr.barangay_id = b.barangay_id
JOIN report_statuses rs ON dr.report_status_id = rs.status_id
LEFT JOIN users resolver ON dr.resolved_by = resolver.user_id
WHERE dr.report_id = 789;

-- Get attachments for this report
SELECT * FROM report_attachments
WHERE report_id = 789;
```

### Mark Report as Resolved (Using Stored Procedure)

```sql
CALL sp_resolve_report(
    789,  -- report_id
    1,    -- resolved_by (admin user_id)
    'Veterinarian visited. Vaccination provided. Animal has recovered.'
);
```

### Get Reports by Barangay Statistics

```sql
SELECT * FROM v_reports_by_barangay
ORDER BY pending_reports DESC, total_reports DESC;
```

### Find Nearby Reports (Geospatial Query)

```sql
-- Find reports within 5km of a location
SET @center_lat = 12.8167;
SET @center_lng = 121.4667;
SET @radius_km = 5;

SELECT 
    dr.report_id,
    dr.disease_name_custom,
    b.barangay_name,
    dr.latitude,
    dr.longitude,
    (6371 * acos(
        cos(radians(@center_lat)) 
        * cos(radians(dr.latitude)) 
        * cos(radians(dr.longitude) - radians(@center_lng)) 
        + sin(radians(@center_lat)) 
        * sin(radians(dr.latitude))
    )) AS distance_km
FROM disease_reports dr
JOIN barangays b ON dr.barangay_id = b.barangay_id
WHERE dr.latitude IS NOT NULL
  AND dr.longitude IS NOT NULL
HAVING distance_km < @radius_km
ORDER BY distance_km ASC;
```

---

## 🛡️ INSURANCE APPLICATION QUERIES

### Submit Insurance Application

```sql
INSERT INTO insurance_applications (
    applicant_id,
    barangay_id,
    animal_type_id,
    purpose_id,
    breed_id,
    number_of_heads,
    age_in_months,
    basic_color,
    male_count,
    female_count,
    application_status_id
)
VALUES (
    123,  -- user_id
    12,   -- Proper Bansud
    1,    -- Cattle
    6,    -- Dairy purpose
    1,    -- Holstein breed
    5,
    36,
    'Black and White',
    1,
    4,
    1     -- pending
);
```

### Get User's Applications

```sql
SELECT 
    ia.application_id,
    at.type_name AS animal_type,
    COALESCE(ia.animal_type_other, at.type_name) AS animal_type_display,
    ip.purpose_name,
    ia.number_of_heads,
    ias.status_name,
    ia.submitted_at,
    ia.reviewed_at
FROM insurance_applications ia
JOIN animal_types at ON ia.animal_type_id = at.animal_type_id
JOIN insurance_purposes ip ON ia.purpose_id = ip.purpose_id
JOIN insurance_application_statuses ias ON ia.application_status_id = ias.status_id
WHERE ia.applicant_id = 123
ORDER BY ia.submitted_at DESC;
```

### Get All Pending Applications (Admin)

```sql
SELECT 
    ia.application_id,
    u.full_name AS applicant_name,
    u.email,
    u.phone_number,
    b.barangay_name,
    at.type_name AS animal_type,
    ip.purpose_name,
    ia.number_of_heads,
    ia.submitted_at
FROM insurance_applications ia
JOIN users u ON ia.applicant_id = u.user_id
JOIN barangays b ON ia.barangay_id = b.barangay_id
JOIN animal_types at ON ia.animal_type_id = at.animal_type_id
JOIN insurance_purposes ip ON ia.purpose_id = ip.purpose_id
WHERE ia.application_status_id = 1  -- pending
ORDER BY ia.submitted_at ASC;
```

### Review Insurance Application (Using Stored Procedure)

```sql
-- Approve application
CALL sp_update_insurance_status(
    789,  -- application_id
    1,    -- reviewed_by (admin user_id)
    2,    -- status_id (2 = approved)
    'Application approved. All requirements met. Policy will be issued.'
);

-- Reject application
CALL sp_update_insurance_status(
    790,  -- application_id
    1,    -- reviewed_by (admin user_id)
    3,    -- status_id (3 = rejected)
    'Missing required documentation. Please resubmit with complete papers.'
);
```

### Get Application Statistics by Status

```sql
SELECT 
    ias.status_name,
    COUNT(*) AS count,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM insurance_applications) AS percentage
FROM insurance_applications ia
JOIN insurance_application_statuses ias ON ia.application_status_id = ias.status_id
GROUP BY ias.status_name, ias.status_id
ORDER BY ias.status_id;
```

---

## 📢 ADVISORY QUERIES

### Create New Advisory

```sql
INSERT INTO advisories (
    created_by,
    title,
    description,
    severity_id,
    category_id,
    effective_from,
    effective_until,
    is_active,
    target_barangays
)
VALUES (
    1,    -- admin user_id
    'Avian Influenza Alert',
    'There has been a reported increase in avian influenza cases in neighboring provinces. Farmers are advised to monitor their birds closely and implement strict biosecurity measures.',
    3,    -- high severity
    1,    -- Disease Alert category
    CURDATE(),
    CURDATE() + INTERVAL 30 DAY,
    TRUE,
    NULL  -- all barangays (or JSON array: '[1,5,12]' for specific barangays)
);
```

### Get Active Advisories

```sql
-- Using view (recommended)
SELECT * FROM v_active_advisories
ORDER BY alert_level DESC, created_at DESC;

-- Manual query
SELECT 
    ad.advisory_id,
    ad.title,
    ad.description,
    asl.severity_name,
    asl.alert_level,
    ac.category_name,
    u.full_name AS created_by_name,
    ad.effective_from,
    ad.effective_until,
    ad.created_at
FROM advisories ad
JOIN advisory_severity_levels asl ON ad.severity_id = asl.severity_id
LEFT JOIN advisory_categories ac ON ad.category_id = ac.category_id
JOIN users u ON ad.created_by = u.user_id
WHERE ad.is_active = TRUE
  AND ad.effective_from <= CURDATE()
  AND (ad.effective_until IS NULL OR ad.effective_until >= CURDATE())
ORDER BY asl.alert_level DESC, ad.created_at DESC;
```

### Get Advisories for Specific Barangay

```sql
SELECT 
    ad.*,
    asl.severity_name,
    asl.alert_level
FROM advisories ad
JOIN advisory_severity_levels asl ON ad.severity_id = asl.severity_id
WHERE ad.is_active = TRUE
  AND ad.effective_from <= CURDATE()
  AND (ad.effective_until IS NULL OR ad.effective_until >= CURDATE())
  AND (
    ad.target_barangays IS NULL  -- for all barangays
    OR JSON_CONTAINS(ad.target_barangays, '12')  -- specific barangay
  )
ORDER BY asl.alert_level DESC;
```

### Mark Advisory as Read

```sql
INSERT INTO advisory_views (advisory_id, user_id, viewed_at)
VALUES (456, 123, NOW())
ON DUPLICATE KEY UPDATE viewed_at = NOW();
```

### Get Advisory Read Statistics

```sql
SELECT 
    ad.advisory_id,
    ad.title,
    COUNT(av.view_id) AS views_count,
    (SELECT COUNT(*) FROM users WHERE role_id = 2 AND is_active = TRUE) AS total_farmers,
    ROUND(COUNT(av.view_id) * 100.0 / 
          (SELECT COUNT(*) FROM users WHERE role_id = 2 AND is_active = TRUE), 2) AS read_percentage
FROM advisories ad
LEFT JOIN advisory_views av ON ad.advisory_id = av.advisory_id
WHERE ad.advisory_id = 456
GROUP BY ad.advisory_id, ad.title;
```

---

## 📊 REPORTING & ANALYTICS QUERIES

### Monthly Report Statistics

```sql
SELECT 
    DATE_FORMAT(report_date, '%Y-%m') AS month,
    COUNT(*) AS total_reports,
    SUM(CASE WHEN report_status_id = 3 THEN 1 ELSE 0 END) AS resolved,
    SUM(CASE WHEN report_status_id = 1 THEN 1 ELSE 0 END) AS pending,
    SUM(affected_count) AS total_affected_animals,
    SUM(mortality_count) AS total_deaths
FROM disease_reports
WHERE report_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(report_date, '%Y-%m')
ORDER BY month DESC;
```

### Disease Outbreak Analysis

```sql
SELECT 
    COALESCE(d.disease_name, dr.disease_name_custom) AS disease,
    COUNT(*) AS report_count,
    SUM(dr.affected_count) AS total_affected,
    SUM(dr.mortality_count) AS total_deaths,
    COUNT(DISTINCT dr.barangay_id) AS affected_barangays,
    MAX(dr.report_date) AS last_report_date
FROM disease_reports dr
LEFT JOIN diseases d ON dr.disease_id = d.disease_id
WHERE dr.report_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
GROUP BY COALESCE(d.disease_name, dr.disease_name_custom)
ORDER BY report_count DESC;
```

### Animal Population by Barangay

```sql
SELECT 
    b.barangay_name,
    at.type_name AS animal_type,
    COUNT(DISTINCT a.owner_id) AS farmers,
    COUNT(a.animal_id) AS animal_records,
    SUM(a.quantity) AS total_animals,
    AVG(a.weight_kg) AS avg_weight
FROM animals a
JOIN users u ON a.owner_id = u.user_id
JOIN user_addresses ua ON u.user_id = ua.user_id
JOIN barangays b ON ua.barangay_id = b.barangay_id
JOIN animal_types at ON a.animal_type_id = at.animal_type_id
WHERE a.is_active = TRUE
GROUP BY b.barangay_name, at.type_name
ORDER BY b.barangay_name, total_animals DESC;
```

### User Activity Report

```sql
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    COUNT(DISTINCT al.log_id) AS total_activities,
    MAX(al.created_at) AS last_activity,
    u.last_login_at
FROM users u
LEFT JOIN activity_logs al ON u.user_id = al.user_id
WHERE u.is_active = TRUE
  AND u.role_id = 2  -- farmers
GROUP BY u.user_id, u.full_name, u.email, u.last_login_at
ORDER BY last_activity DESC;
```

---

## 🔍 SEARCH & FILTER QUERIES

### Full-Text Search on Advisories

```sql
SELECT 
    ad.advisory_id,
    ad.title,
    ad.description,
    asl.severity_name
FROM advisories ad
JOIN advisory_severity_levels asl ON ad.severity_id = asl.severity_id
WHERE (
    ad.title LIKE '%influenza%'
    OR ad.description LIKE '%influenza%'
)
  AND ad.is_active = TRUE
ORDER BY ad.created_at DESC;
```

### Advanced Report Filtering

```sql
SELECT 
    dr.report_id,
    u.full_name AS reporter,
    COALESCE(d.disease_name, dr.disease_name_custom) AS disease,
    b.barangay_name,
    rs.status_name,
    dr.report_date
FROM disease_reports dr
JOIN users u ON dr.reporter_id = u.user_id
LEFT JOIN diseases d ON dr.disease_id = d.disease_id
JOIN barangays b ON dr.barangay_id = b.barangay_id
JOIN report_statuses rs ON dr.report_status_id = rs.status_id
WHERE 1=1
  -- Filter by status
  AND (@status_filter IS NULL OR dr.report_status_id = @status_filter)
  -- Filter by barangay
  AND (@barangay_filter IS NULL OR dr.barangay_id = @barangay_filter)
  -- Filter by date range
  AND (@date_from IS NULL OR dr.report_date >= @date_from)
  AND (@date_to IS NULL OR dr.report_date <= @date_to)
  -- Search in disease name or description
  AND (@search_term IS NULL 
       OR COALESCE(d.disease_name, dr.disease_name_custom) LIKE CONCAT('%', @search_term, '%')
       OR dr.description LIKE CONCAT('%', @search_term, '%'))
ORDER BY dr.report_date DESC, dr.created_at DESC;
```

---

## 🔐 SECURITY & AUDIT QUERIES

### Get User Activity Log

```sql
SELECT 
    al.log_id,
    u.full_name,
    at.activity_name,
    al.subject_type,
    al.subject_id,
    al.description,
    al.ip_address,
    al.created_at
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.user_id
JOIN activity_types at ON al.activity_type_id = at.activity_type_id
WHERE al.user_id = 123
ORDER BY al.created_at DESC
LIMIT 50;
```

### Audit Trail for Specific Record

```sql
-- Audit trail for an animal
SELECT 
    al.log_id,
    u.full_name AS user_name,
    at.activity_name,
    al.description,
    al.properties,
    al.created_at
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.user_id
JOIN activity_types at ON al.activity_type_id = at.activity_type_id
WHERE al.subject_type = 'animals'
  AND al.subject_id = 456
ORDER BY al.created_at DESC;
```

### Find Login History

```sql
SELECT 
    al.log_id,
    u.full_name,
    u.email,
    al.ip_address,
    al.user_agent,
    al.created_at
FROM activity_logs al
JOIN users u ON al.user_id = u.user_id
JOIN activity_types at ON al.activity_type_id = at.activity_type_id
WHERE at.activity_name = 'user_login'
  AND al.user_id = 123
ORDER BY al.created_at DESC
LIMIT 20;
```

---

## 🛠️ MAINTENANCE QUERIES

### Database Health Check

```sql
-- Table sizes
SELECT 
    table_name,
    table_rows,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
    ROUND(index_length / (data_length + index_length) * 100, 2) AS index_ratio_percent
FROM information_schema.tables
WHERE table_schema = 'nutrivet_bansud'
  AND table_type = 'BASE TABLE'
ORDER BY (data_length + index_length) DESC;
```

### Find Unused Indexes

```sql
SELECT 
    s.table_schema,
    s.table_name,
    s.index_name,
    GROUP_CONCAT(s.column_name ORDER BY s.seq_in_index) AS columns
FROM information_schema.statistics s
LEFT JOIN (
    SELECT DISTINCT 
        table_schema,
        table_name,
        index_name
    FROM information_schema.statistics
) used ON s.table_schema = used.table_schema
      AND s.table_name = used.table_name
      AND s.index_name = used.index_name
WHERE s.table_schema = 'nutrivet_bansud'
  AND s.index_name != 'PRIMARY'
GROUP BY s.table_schema, s.table_name, s.index_name;
```

### Optimize Tables

```sql
ANALYZE TABLE animals, disease_reports, insurance_applications;
OPTIMIZE TABLE animals, disease_reports, insurance_applications;
```

---

## 💡 Tips & Best Practices

### Use Prepared Statements (Laravel Example)

```php
// Instead of raw queries, use Laravel's query builder
$animals = DB::table('animals')
    ->join('animal_types', 'animals.animal_type_id', '=', 'animal_types.animal_type_id')
    ->where('animals.owner_id', $userId)
    ->where('animals.is_active', true)
    ->get();
```

### Use Indexes Wisely

```sql
-- GOOD: Uses index on owner_id
SELECT * FROM animals WHERE owner_id = 123;

-- BAD: Full table scan
SELECT * FROM animals WHERE YEAR(created_at) = 2025;

-- BETTER: Uses index on created_at
SELECT * FROM animals WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01';
```

### Use Views for Complex Queries

```sql
-- Instead of repeating complex joins, use views
SELECT * FROM v_user_statistics WHERE user_id = 123;
```

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: November 20, 2025  
**Database**: nutrivet_bansud  
**Total Queries**: 60+ ready-to-use queries
