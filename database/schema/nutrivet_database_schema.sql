-- ============================================================================
-- NutriVet Bansud - Livestock Health Management System
-- MySQL Database Schema - 5NF Normalized with Proper Indexing
-- Version: 1.0
-- Date: 2025-11-20
-- ============================================================================

-- Drop existing database if exists (CAUTION: Use only in development)
-- DROP DATABASE IF EXISTS nutrivet_db;

-- Create database with UTF-8 support
CREATE DATABASE IF NOT EXISTS nutrivet_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE nutrivet_db;

-- ============================================================================
-- TABLE: roles
-- Purpose: Define user roles (admin, farmer)
-- ============================================================================
CREATE TABLE roles (
    role_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User role definitions';

-- ============================================================================
-- TABLE: provinces
-- Purpose: Store province information
-- ============================================================================
CREATE TABLE provinces (
    province_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_province_name (province_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Province master data';

-- ============================================================================
-- TABLE: municipalities
-- Purpose: Store municipality information linked to provinces
-- ============================================================================
CREATE TABLE municipalities (
    municipality_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province_id SMALLINT UNSIGNED NOT NULL,
    municipality_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (province_id) REFERENCES provinces(province_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_province_id (province_id),
    INDEX idx_municipality_name (municipality_name),
    UNIQUE KEY uk_municipality_province (municipality_name, province_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Municipality master data';

-- ============================================================================
-- TABLE: barangays
-- Purpose: Store barangay information linked to municipalities
-- ============================================================================
CREATE TABLE barangays (
    barangay_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    municipality_id SMALLINT UNSIGNED NOT NULL,
    barangay_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (municipality_id) REFERENCES municipalities(municipality_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_municipality_id (municipality_id),
    INDEX idx_barangay_name (barangay_name),
    UNIQUE KEY uk_barangay_municipality (barangay_name, municipality_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Barangay master data';

-- ============================================================================
-- TABLE: users
-- Purpose: Store user accounts (farmers and admins)
-- ============================================================================
CREATE TABLE users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id TINYINT UNSIGNED NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (role_id) REFERENCES roles(role_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_role_id (role_id),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts for farmers and administrators';

-- ============================================================================
-- TABLE: user_addresses
-- Purpose: Store user address information with GPS coordinates
-- ============================================================================
CREATE TABLE user_addresses (
    address_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    barangay_id SMALLINT UNSIGNED NOT NULL,
    sitio VARCHAR(100),
    street_address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (barangay_id) REFERENCES barangays(barangay_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_barangay_id (barangay_id),
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User address information with geolocation';

-- ============================================================================
-- TABLE: animal_types
-- Purpose: Master list of animal types
-- ============================================================================
CREATE TABLE animal_types (
    animal_type_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    animal_type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_animal_type_name (animal_type_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Master list of animal types';

-- ============================================================================
-- TABLE: animal_purposes
-- Purpose: Master list of animal raising purposes
-- ============================================================================
CREATE TABLE animal_purposes (
    purpose_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purpose_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_purpose_name (purpose_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Master list of animal raising purposes';

-- ============================================================================
-- TABLE: insurance_application_statuses
-- Purpose: Status types for insurance applications
-- ============================================================================
CREATE TABLE insurance_application_statuses (
    status_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status_name (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Insurance application status types';

-- ============================================================================
-- TABLE: insurance_applications
-- Purpose: Store livestock mortality insurance applications
-- ============================================================================
CREATE TABLE insurance_applications (
    application_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT UNSIGNED NOT NULL,
    barangay_id SMALLINT UNSIGNED NOT NULL,
    animal_type_id SMALLINT UNSIGNED NOT NULL,
    purpose_id SMALLINT UNSIGNED NOT NULL,
    status_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
    animal_type_other VARCHAR(100) NULL COMMENT 'For "Other" animal types',
    contact_number VARCHAR(20) NOT NULL,
    number_of_heads INT UNSIGNED NOT NULL,
    age_months SMALLINT UNSIGNED,
    breed VARCHAR(100),
    basic_color VARCHAR(50),
    male_count INT UNSIGNED DEFAULT 0,
    female_count INT UNSIGNED DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    reviewed_by INT UNSIGNED NULL,
    admin_notes TEXT,
    
    FOREIGN KEY (applicant_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (barangay_id) REFERENCES barangays(barangay_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (animal_type_id) REFERENCES animal_types(animal_type_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (purpose_id) REFERENCES animal_purposes(purpose_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (status_id) REFERENCES insurance_application_statuses(status_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_status_id (status_id),
    INDEX idx_animal_type_id (animal_type_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_reviewed_by (reviewed_by),
    INDEX idx_composite_search (applicant_id, status_id, submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Livestock mortality insurance applications';

-- ============================================================================
-- TABLE: disease_categories
-- Purpose: Categorize diseases for better organization
-- ============================================================================
CREATE TABLE disease_categories (
    category_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Disease categorization';

-- ============================================================================
-- TABLE: diseases
-- Purpose: Master list of diseases
-- ============================================================================
CREATE TABLE diseases (
    disease_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id SMALLINT UNSIGNED,
    disease_name VARCHAR(255) NOT NULL,
    common_name VARCHAR(255),
    description TEXT,
    symptoms TEXT,
    treatment TEXT,
    prevention TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES disease_categories(category_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_disease_name (disease_name),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    FULLTEXT idx_disease_search (disease_name, common_name, symptoms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Master list of livestock diseases';

-- ============================================================================
-- TABLE: report_statuses
-- Purpose: Status types for disease reports
-- ============================================================================
CREATE TABLE report_statuses (
    report_status_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status_name (status_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Disease report status types';

-- ============================================================================
-- TABLE: disease_reports
-- Purpose: Store disease reports submitted by farmers
-- ============================================================================
CREATE TABLE disease_reports (
    report_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT UNSIGNED NOT NULL,
    disease_id SMALLINT UNSIGNED NULL,
    disease_name_custom VARCHAR(255) COMMENT 'For diseases not in master list',
    animal_name VARCHAR(255),
    report_status_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
    description TEXT NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    report_date DATE NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL DEFAULT NULL,
    resolved_by INT UNSIGNED NULL,
    admin_notes TEXT,
    
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES diseases(disease_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (report_status_id) REFERENCES report_statuses(report_status_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(user_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_disease_id (disease_id),
    INDEX idx_report_status_id (report_status_id),
    INDEX idx_report_date (report_date),
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_composite_search (reporter_id, report_status_id, report_date),
    FULLTEXT idx_description_search (description, disease_name_custom, animal_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Disease reports submitted by farmers';

-- ============================================================================
-- TABLE: report_images
-- Purpose: Store images attached to disease reports
-- ============================================================================
CREATE TABLE report_images (
    image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    report_id INT UNSIGNED NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    image_filename VARCHAR(255) NOT NULL,
    image_size INT UNSIGNED,
    mime_type VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (report_id) REFERENCES disease_reports(report_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_report_id (report_id),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Images attached to disease reports';

-- ============================================================================
-- TABLE: advisory_severities
-- Purpose: Severity levels for advisories
-- ============================================================================
CREATE TABLE advisory_severities (
    severity_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    severity_name VARCHAR(50) NOT NULL UNIQUE,
    severity_color VARCHAR(50),
    severity_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_severity_name (severity_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Advisory severity levels';

-- ============================================================================
-- TABLE: advisory_categories
-- Purpose: Categorize advisories
-- ============================================================================
CREATE TABLE advisory_categories (
    category_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Advisory categorization';

-- ============================================================================
-- TABLE: advisories
-- Purpose: Store advisories and alerts created by admins
-- ============================================================================
CREATE TABLE advisories (
    advisory_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_by INT UNSIGNED NOT NULL,
    category_id SMALLINT UNSIGNED,
    severity_id TINYINT UNSIGNED NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES advisory_categories(category_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (severity_id) REFERENCES advisory_severities(severity_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_category_id (category_id),
    INDEX idx_severity_id (severity_id),
    INDEX idx_is_active (is_active),
    INDEX idx_published_at (published_at),
    INDEX idx_composite_search (is_active, severity_id, published_at),
    FULLTEXT idx_advisory_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Advisories and alerts created by administrators';

-- ============================================================================
-- TABLE: advisory_reads
-- Purpose: Track which users have read which advisories
-- ============================================================================
CREATE TABLE advisory_reads (
    read_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    advisory_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (advisory_id) REFERENCES advisories(advisory_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_advisory_user (advisory_id, user_id),
    INDEX idx_advisory_id (advisory_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Track advisory read status by users';

-- ============================================================================
-- TABLE: activity_logs
-- Purpose: Audit trail for important system actions
-- ============================================================================
CREATE TABLE activity_logs (
    log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    action_type VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT UNSIGNED,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at),
    INDEX idx_composite_search (user_id, action_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System activity audit trail';

-- ============================================================================
-- TABLE: notifications
-- Purpose: Store user notifications
-- ============================================================================
CREATE TABLE notifications (
    notification_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_table VARCHAR(100),
    related_id INT UNSIGNED,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_composite_search (user_id, is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User notifications';

-- ============================================================================
-- TABLE: system_settings
-- Purpose: Store system configuration settings
-- ============================================================================
CREATE TABLE system_settings (
    setting_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(user_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System configuration settings';

-- ============================================================================
-- VIEWS: Create useful views for common queries
-- ============================================================================

-- View: Complete user information with address
CREATE OR REPLACE VIEW v_user_profiles AS
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    u.phone_number,
    r.role_name,
    u.is_active,
    u.email_verified_at,
    u.created_at,
    u.last_login_at,
    ua.sitio,
    b.barangay_name,
    m.municipality_name,
    p.province_name,
    ua.latitude,
    ua.longitude
FROM users u
JOIN roles r ON u.role_id = r.role_id
LEFT JOIN user_addresses ua ON u.user_id = ua.user_id AND ua.is_primary = TRUE
LEFT JOIN barangays b ON ua.barangay_id = b.barangay_id
LEFT JOIN municipalities m ON b.municipality_id = m.municipality_id
LEFT JOIN provinces p ON m.province_id = p.province_id;

-- View: Insurance applications with details
CREATE OR REPLACE VIEW v_insurance_applications AS
SELECT 
    ia.application_id,
    ia.applicant_id,
    u.full_name AS applicant_name,
    u.email AS applicant_email,
    u.phone_number AS applicant_phone,
    b.barangay_name,
    m.municipality_name,
    p.province_name,
    at.animal_type_name,
    ia.animal_type_other,
    ap.purpose_name,
    ias.status_name,
    ia.contact_number,
    ia.number_of_heads,
    ia.age_months,
    ia.breed,
    ia.basic_color,
    ia.male_count,
    ia.female_count,
    ia.submitted_at,
    ia.reviewed_at,
    reviewer.full_name AS reviewed_by_name,
    ia.admin_notes
FROM insurance_applications ia
JOIN users u ON ia.applicant_id = u.user_id
JOIN barangays b ON ia.barangay_id = b.barangay_id
JOIN municipalities m ON b.municipality_id = m.municipality_id
JOIN provinces p ON m.province_id = p.province_id
JOIN animal_types at ON ia.animal_type_id = at.animal_type_id
JOIN animal_purposes ap ON ia.purpose_id = ap.purpose_id
JOIN insurance_application_statuses ias ON ia.status_id = ias.status_id
LEFT JOIN users reviewer ON ia.reviewed_by = reviewer.user_id;

-- View: Disease reports with complete information
CREATE OR REPLACE VIEW v_disease_reports AS
SELECT 
    dr.report_id,
    dr.reporter_id,
    u.full_name AS reporter_name,
    u.email AS reporter_email,
    d.disease_name,
    dr.disease_name_custom,
    dc.category_name AS disease_category,
    dr.animal_name,
    rs.status_name AS report_status,
    dr.description,
    dr.address,
    dr.latitude,
    dr.longitude,
    dr.report_date,
    dr.submitted_at,
    dr.resolved_at,
    resolver.full_name AS resolved_by_name,
    dr.admin_notes,
    (SELECT image_path FROM report_images WHERE report_id = dr.report_id AND is_primary = TRUE LIMIT 1) AS primary_image
FROM disease_reports dr
JOIN users u ON dr.reporter_id = u.user_id
LEFT JOIN diseases d ON dr.disease_id = d.disease_id
LEFT JOIN disease_categories dc ON d.category_id = dc.category_id
JOIN report_statuses rs ON dr.report_status_id = rs.report_status_id
LEFT JOIN users resolver ON dr.resolved_by = resolver.user_id;

-- View: Advisories with creator information
CREATE OR REPLACE VIEW v_advisories AS
SELECT 
    a.advisory_id,
    a.title,
    a.description,
    ac.category_name,
    asv.severity_name,
    asv.severity_color,
    u.full_name AS created_by_name,
    a.is_active,
    a.published_at,
    a.expires_at,
    a.updated_at
FROM advisories a
JOIN users u ON a.created_by = u.user_id
LEFT JOIN advisory_categories ac ON a.category_id = ac.category_id
JOIN advisory_severities asv ON a.severity_id = asv.severity_id;

-- View: User statistics
CREATE OR REPLACE VIEW v_user_statistics AS
SELECT 
    u.user_id,
    u.full_name,
    u.email,
    r.role_name,
    (SELECT COUNT(*) FROM insurance_applications WHERE applicant_id = u.user_id) AS total_insurance_apps,
    (SELECT COUNT(*) FROM insurance_applications WHERE applicant_id = u.user_id AND status_id = 2) AS approved_insurance_apps,
    (SELECT COUNT(*) FROM disease_reports WHERE reporter_id = u.user_id) AS total_reports,
    (SELECT COUNT(*) FROM disease_reports WHERE reporter_id = u.user_id AND report_status_id IN (1, 2)) AS active_reports,
    u.created_at,
    u.last_login_at
FROM users u
JOIN roles r ON u.role_id = r.role_id
WHERE u.is_active = TRUE;

-- ============================================================================
-- INSERT MASTER DATA
-- ============================================================================

-- Insert roles
INSERT INTO roles (role_name, role_description) VALUES
('admin', 'System administrator with full access'),
('farmer', 'Livestock farmer with limited access');

-- Insert location data for Bansud, Oriental Mindoro
INSERT INTO provinces (province_name) VALUES ('Oriental Mindoro');

INSERT INTO municipalities (province_id, municipality_name) VALUES
(1, 'Bansud');

INSERT INTO barangays (municipality_id, barangay_name) VALUES
(1, 'Alcadesma'),
(1, 'Bato'),
(1, 'Conrazon'),
(1, 'Malo'),
(1, 'Manihala'),
(1, 'Pag-asa'),
(1, 'Poblacion'),
(1, 'Proper Bansud'),
(1, 'Rosacara'),
(1, 'Salcedo'),
(1, 'Sumagui'),
(1, 'Proper Tiguisan'),
(1, 'Villa Pagasa');

-- Insert animal types
INSERT INTO animal_types (animal_type_name, description) VALUES
('Cattle', 'Domesticated bovine livestock'),
('Carabao', 'Philippine water buffalo'),
('Swine', 'Domesticated pigs'),
('Poultry', 'Domesticated birds raised for eggs and meat'),
('Horse', 'Domesticated equine'),
('Goat', 'Domesticated caprine livestock'),
('Other', 'Other types of livestock');

-- Insert animal purposes
INSERT INTO animal_purposes (purpose_name, description) VALUES
('Fattening', 'Raising animals for meat production'),
('Draft', 'Work animals for plowing and transport'),
('Broilers', 'Chicken raised for meat'),
('Pullets', 'Young female chickens'),
('Breeding', 'Raising animals for reproduction'),
('Dairy', 'Milk production'),
('Layers', 'Chicken raised for egg production'),
('Parent Stock', 'Breeding stock for poultry');

-- Insert insurance application statuses
INSERT INTO insurance_application_statuses (status_name, status_description) VALUES
('Pending', 'Application submitted and awaiting review'),
('Approved', 'Application has been approved'),
('Rejected', 'Application has been rejected');

-- Insert disease categories
INSERT INTO disease_categories (category_name, description) VALUES
('Viral', 'Diseases caused by viruses'),
('Bacterial', 'Diseases caused by bacteria'),
('Parasitic', 'Diseases caused by parasites'),
('Fungal', 'Diseases caused by fungi'),
('Metabolic', 'Metabolic disorders'),
('Nutritional', 'Diseases related to nutrition deficiency');

-- Insert common diseases
INSERT INTO diseases (category_id, disease_name, common_name, symptoms) VALUES
(1, 'Foot and Mouth Disease', 'FMD', 'Fever, blisters in mouth and on feet, lameness'),
(2, 'Pneumonia', 'Lung Infection', 'Coughing, labored breathing, nasal discharge'),
(2, 'Mastitis', 'Udder Inflammation', 'Swollen udder, abnormal milk, fever'),
(1, 'Avian Influenza', 'Bird Flu', 'Respiratory distress, decreased egg production, sudden death'),
(3, 'Parasitic Gastroenteritis', 'Worm Infestation', 'Weight loss, diarrhea, poor coat condition');

-- Insert report statuses
INSERT INTO report_statuses (status_name, status_description) VALUES
('Pending', 'Report submitted and awaiting review'),
('In Progress', 'Report is being investigated'),
('Resolved', 'Report has been addressed and closed');

-- Insert advisory severities
INSERT INTO advisory_severities (severity_name, severity_color, severity_description) VALUES
('Low', 'blue', 'General information or recommendations'),
('Medium', 'yellow', 'Important updates requiring attention'),
('High', 'red', 'Critical alerts requiring immediate action');

-- Insert advisory categories
INSERT INTO advisory_categories (category_name, description) VALUES
('Disease Alert', 'Alerts about disease outbreaks'),
('Vaccination', 'Vaccination schedules and reminders'),
('Feed Management', 'Feed quality and nutrition information'),
('Health & Safety', 'General health and safety guidelines'),
('Disease Prevention', 'Preventive measures and best practices'),
('Weather Alert', 'Weather-related advisories');

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER //

-- Procedure: Get farmer dashboard statistics
CREATE PROCEDURE sp_get_farmer_dashboard_stats(IN p_user_id INT)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM insurance_applications 
         WHERE applicant_id = p_user_id AND status_id = 2) AS approved_insured_animals,
        (SELECT COUNT(*) FROM disease_reports 
         WHERE reporter_id = p_user_id) AS total_reports,
        (SELECT COUNT(*) FROM disease_reports 
         WHERE reporter_id = p_user_id AND report_status_id IN (1, 2)) AS active_reports,
        (SELECT COUNT(*) FROM disease_reports 
         WHERE reporter_id = p_user_id AND report_status_id = 3) AS resolved_reports,
        (SELECT COUNT(*) FROM advisories 
         WHERE is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW())) AS active_advisories;
END //

-- Procedure: Get admin dashboard statistics
CREATE PROCEDURE sp_get_admin_dashboard_stats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM users WHERE role_id = 2 AND is_active = TRUE) AS total_farmers,
        (SELECT COUNT(*) FROM insurance_applications WHERE status_id = 1) AS pending_applications,
        (SELECT COUNT(*) FROM disease_reports WHERE report_status_id IN (1, 2)) AS active_reports,
        (SELECT COUNT(*) FROM advisories WHERE is_active = TRUE) AS active_advisories;
END //

DELIMITER ;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DELIMITER //

-- Trigger: Update last_login_at on user authentication
CREATE TRIGGER trg_update_last_login
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.remember_token != OLD.remember_token THEN
        SET NEW.last_login_at = NOW();
    END IF;
END //

-- Trigger: Log activity on insurance application status change
CREATE TRIGGER trg_log_insurance_status_change
AFTER UPDATE ON insurance_applications
FOR EACH ROW
BEGIN
    IF NEW.status_id != OLD.status_id THEN
        INSERT INTO activity_logs (user_id, action_type, table_name, record_id, old_values, new_values)
        VALUES (
            NEW.reviewed_by,
            'insurance_status_change',
            'insurance_applications',
            NEW.application_id,
            JSON_OBJECT('status_id', OLD.status_id),
            JSON_OBJECT('status_id', NEW.status_id)
        );
    END IF;
END //

-- Trigger: Log activity on disease report status change
CREATE TRIGGER trg_log_report_status_change
AFTER UPDATE ON disease_reports
FOR EACH ROW
BEGIN
    IF NEW.report_status_id != OLD.report_status_id THEN
        INSERT INTO activity_logs (user_id, action_type, table_name, record_id, old_values, new_values)
        VALUES (
            NEW.resolved_by,
            'report_status_change',
            'disease_reports',
            NEW.report_id,
            JSON_OBJECT('status_id', OLD.report_status_id),
            JSON_OBJECT('status_id', NEW.report_status_id)
        );
    END IF;
END //

DELIMITER ;

-- ============================================================================
-- INDEXES SUMMARY
-- ============================================================================
/*
Primary Keys: All tables have auto-increment primary keys
Foreign Keys: All relationships properly constrained with cascading rules
Regular Indexes: Created on frequently queried columns (email, dates, statuses)
Composite Indexes: Created for multi-column queries (user_id + status + date)
Fulltext Indexes: Created for text search on diseases and reports
Unique Indexes: Ensures data integrity (email, role names, etc.)

Performance optimizations:
- InnoDB engine for ACID compliance and foreign key support
- UTF-8mb4 for full Unicode support including emojis
- Proper data types to minimize storage (TINYINT for statuses, SMALLINT for references)
- JSON for flexible data storage in logs
- TIMESTAMP for automatic tracking
- Views for complex, frequently-used queries
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
