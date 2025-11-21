<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NutriVetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert roles (skip if exists)
        if (DB::table('roles')->count() === 0) {
            DB::table('roles')->insert([
                ['role_name' => 'admin', 'role_description' => 'System administrator with full access'],
                ['role_name' => 'farmer', 'role_description' => 'Livestock farmer with limited access'],
            ]);
        }

        // Insert provinces (skip if exists)
        if (DB::table('provinces')->count() === 0) {
            DB::table('provinces')->insert([
                ['province_name' => 'Oriental Mindoro'],
            ]);
        }

        // Insert municipalities (skip if exists)
        if (DB::table('municipalities')->count() === 0) {
            DB::table('municipalities')->insert([
                ['province_id' => 1, 'municipality_name' => 'Bansud'],
            ]);
        }

        // Insert barangays (skip if exists)
        if (DB::table('barangays')->count() === 0) {
            $barangays = [
                'Alcadesma',
                'Bato',
                'Conrazon',
                'Malo',
                'Manihala',
                'Pag-asa',
                'Poblacion',
                'Proper Bansud',
                'Rosacara',
                'Salcedo',
                'Sumagui',
                'Proper Tiguisan',
                'Villa Pagasa'
            ];

            foreach ($barangays as $barangay) {
                DB::table('barangays')->insert([
                    'municipality_id' => 1,
                    'barangay_name' => $barangay,
                ]);
            }
        }

        // Insert animal types (skip if exists)
        if (DB::table('animal_types')->count() === 0) {
            $animalTypes = [
                ['animal_type_name' => 'Cattle', 'description' => 'Domesticated bovine livestock'],
                ['animal_type_name' => 'Carabao', 'description' => 'Philippine water buffalo'],
                ['animal_type_name' => 'Swine', 'description' => 'Domesticated pigs'],
                ['animal_type_name' => 'Poultry', 'description' => 'Domesticated birds raised for eggs and meat'],
                ['animal_type_name' => 'Horse', 'description' => 'Domesticated equine'],
                ['animal_type_name' => 'Goat', 'description' => 'Domesticated caprine livestock'],
                ['animal_type_name' => 'Other', 'description' => 'Other types of livestock'],
            ];

            foreach ($animalTypes as $type) {
                DB::table('animal_types')->insert($type);
            }
        }

        // Insert animal purposes (skip if exists)
        if (DB::table('animal_purposes')->count() === 0) {
            $purposes = [
                ['purpose_name' => 'Fattening', 'description' => 'Raising animals for meat production'],
                ['purpose_name' => 'Draft', 'description' => 'Work animals for plowing and transport'],
                ['purpose_name' => 'Broilers', 'description' => 'Chicken raised for meat'],
                ['purpose_name' => 'Pullets', 'description' => 'Young female chickens'],
                ['purpose_name' => 'Breeding', 'description' => 'Raising animals for reproduction'],
                ['purpose_name' => 'Dairy', 'description' => 'Milk production'],
                ['purpose_name' => 'Layers', 'description' => 'Chicken raised for egg production'],
                ['purpose_name' => 'Parent Stock', 'description' => 'Breeding stock for poultry'],
            ];

            foreach ($purposes as $purpose) {
                DB::table('animal_purposes')->insert($purpose);
            }
        }

        // Insert insurance application statuses (skip if exists)
        if (DB::table('insurance_application_statuses')->count() === 0) {
            DB::table('insurance_application_statuses')->insert([
                ['status_name' => 'Pending', 'status_description' => 'Application submitted and awaiting review'],
                ['status_name' => 'Approved', 'status_description' => 'Application has been approved'],
                ['status_name' => 'Rejected', 'status_description' => 'Application has been rejected'],
            ]);
        }

        // Insert disease categories (skip if exists)
        if (DB::table('disease_categories')->count() === 0) {
            $diseaseCategories = [
                ['category_name' => 'Viral', 'description' => 'Diseases caused by viruses'],
                ['category_name' => 'Bacterial', 'description' => 'Diseases caused by bacteria'],
                ['category_name' => 'Parasitic', 'description' => 'Diseases caused by parasites'],
                ['category_name' => 'Fungal', 'description' => 'Diseases caused by fungi'],
                ['category_name' => 'Metabolic', 'description' => 'Metabolic disorders'],
                ['category_name' => 'Nutritional', 'description' => 'Diseases related to nutrition deficiency'],
            ];

            foreach ($diseaseCategories as $category) {
                DB::table('disease_categories')->insert($category);
            }
        }

        // Insert common diseases (skip if exists)
        if (DB::table('diseases')->count() === 0) {
            DB::table('diseases')->insert([
                [
                    'category_id' => 1,
                    'disease_name' => 'Foot and Mouth Disease',
                    'common_name' => 'FMD',
                    'symptoms' => 'Fever, blisters in mouth and on feet, lameness',
                ],
                [
                    'category_id' => 2,
                    'disease_name' => 'Pneumonia',
                    'common_name' => 'Lung Infection',
                    'symptoms' => 'Coughing, labored breathing, nasal discharge',
                ],
                [
                    'category_id' => 2,
                    'disease_name' => 'Mastitis',
                    'common_name' => 'Udder Inflammation',
                    'symptoms' => 'Swollen udder, abnormal milk, fever',
                ],
                [
                    'category_id' => 1,
                    'disease_name' => 'Avian Influenza',
                    'common_name' => 'Bird Flu',
                    'symptoms' => 'Respiratory distress, decreased egg production, sudden death',
                ],
                [
                    'category_id' => 3,
                    'disease_name' => 'Parasitic Gastroenteritis',
                    'common_name' => 'Worm Infestation',
                    'symptoms' => 'Weight loss, diarrhea, poor coat condition',
                ],
            ]);
        }

        // Insert report statuses (skip if exists)
        if (DB::table('report_statuses')->count() === 0) {
            DB::table('report_statuses')->insert([
                ['status_name' => 'Pending', 'status_description' => 'Report submitted and awaiting review'],
                ['status_name' => 'In Progress', 'status_description' => 'Report is being investigated'],
                ['status_name' => 'Resolved', 'status_description' => 'Report has been addressed and closed'],
            ]);
        }

        // Insert advisory severities (skip if exists)
        if (DB::table('advisory_severities')->count() === 0) {
            DB::table('advisory_severities')->insert([
                ['severity_name' => 'Low', 'severity_color' => 'blue', 'severity_description' => 'General information or recommendations'],
                ['severity_name' => 'Medium', 'severity_color' => 'yellow', 'severity_description' => 'Important updates requiring attention'],
                ['severity_name' => 'High', 'severity_color' => 'red', 'severity_description' => 'Critical alerts requiring immediate action'],
            ]);
        }

        // Insert advisory categories (skip if exists)
        if (DB::table('advisory_categories')->count() === 0) {
            $advisoryCategories = [
                ['category_name' => 'Disease Alert', 'description' => 'Alerts about disease outbreaks'],
                ['category_name' => 'Vaccination', 'description' => 'Vaccination schedules and reminders'],
                ['category_name' => 'Feed Management', 'description' => 'Feed quality and nutrition information'],
                ['category_name' => 'Health & Safety', 'description' => 'General health and safety guidelines'],
                ['category_name' => 'Disease Prevention', 'description' => 'Preventive measures and best practices'],
                ['category_name' => 'Weather Alert', 'description' => 'Weather-related advisories'],
            ];

            foreach ($advisoryCategories as $category) {
                DB::table('advisory_categories')->insert($category);
            }
        }

        // Create default admin user (skip if exists)
        if (!DB::table('users')->where('email', 'admin@nutrivet.com')->exists()) {
            $adminId = DB::table('users')->insertGetId([
                'role_id' => 1,
                'name' => 'Admin User',
                'full_name' => 'System Administrator',
                'email' => 'admin@nutrivet.com',
                'password' => Hash::make('password'),
                'phone_number' => '0928-837-1771',
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create default farmer user (skip if exists)
        if (!DB::table('users')->where('email', 'farmer@nutrivet.com')->exists()) {
            $farmerId = DB::table('users')->insertGetId([
                'role_id' => 2,
                'name' => 'Juan Dela Cruz',
                'full_name' => 'Juan Dela Cruz',
                'email' => 'farmer@nutrivet.com',
                'password' => Hash::make('password'),
                'phone_number' => '0912-345-6789',
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add address for farmer
            DB::table('user_addresses')->insert([
                'user_id' => $farmerId,
                'barangay_id' => 1, // Alcadesma
                'sitio' => 'Sitio 1',
                'latitude' => 12.8167,
                'longitude' => 121.4667,
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add sample disease reports with GPS coordinates
            $pendingStatus = DB::table('report_statuses')->where('status_name', 'Pending')->first();
            $diseaseId = DB::table('diseases')->first()->disease_id ?? 1;

            $sampleReports = [
                [
                    'reporter_id' => $farmerId,
                    'report_status_id' => $pendingStatus->report_status_id,
                    'disease_id' => $diseaseId,
                    'disease_name_custom' => 'Foot and Mouth Disease',
                    'animal_name' => 'Cow - Bessie',
                    'description' => 'Showing symptoms of fever, blisters in mouth and on feet. Animal is not eating well.',
                    'address' => 'Barangay Alcadesma, Bansud, Oriental Mindoro',
                    'latitude' => 12.8167,
                    'longitude' => 121.4667,
                    'report_date' => now()->subDays(2)->toDateString(),
                    'submitted_at' => now()->subDays(2),
                ],
                [
                    'reporter_id' => $farmerId,
                    'report_status_id' => $pendingStatus->report_status_id,
                    'disease_id' => $diseaseId,
                    'disease_name_custom' => 'Newcastle Disease',
                    'animal_name' => 'Chicken Flock',
                    'description' => 'Several chickens showing respiratory distress, green diarrhea, and twisted necks.',
                    'address' => 'Barangay Poblacion, Bansud, Oriental Mindoro',
                    'latitude' => 12.8234,
                    'longitude' => 121.4598,
                    'report_date' => now()->subDays(1)->toDateString(),
                    'submitted_at' => now()->subDays(1),
                ],
                [
                    'reporter_id' => $farmerId,
                    'report_status_id' => $pendingStatus->report_status_id,
                    'disease_id' => $diseaseId,
                    'disease_name_custom' => 'African Swine Fever',
                    'animal_name' => 'Pig - Multiple',
                    'description' => 'Sudden death of 3 pigs, high fever, loss of appetite, and skin discoloration.',
                    'address' => 'Barangay Malo, Bansud, Oriental Mindoro',
                    'latitude' => 12.8089,
                    'longitude' => 121.4756,
                    'report_date' => now()->toDateString(),
                    'submitted_at' => now(),
                ],
                [
                    'reporter_id' => $farmerId,
                    'report_status_id' => $pendingStatus->report_status_id,
                    'disease_id' => $diseaseId,
                    'disease_name_custom' => 'Mastitis',
                    'animal_name' => 'Dairy Cow - Molly',
                    'description' => 'Udder is swollen, hot, and painful. Milk production decreased with abnormal discharge.',
                    'address' => 'Barangay Manihala, Bansud, Oriental Mindoro',
                    'latitude' => 12.8312,
                    'longitude' => 121.4523,
                    'report_date' => now()->toDateString(),
                    'submitted_at' => now(),
                ],
                [
                    'reporter_id' => $farmerId,
                    'report_status_id' => $pendingStatus->report_status_id,
                    'disease_id' => $diseaseId,
                    'disease_name_custom' => 'Lumpy Skin Disease',
                    'animal_name' => 'Carabao',
                    'description' => 'Skin nodules appearing all over body, fever, and reduced appetite.',
                    'address' => 'Barangay Rosacara, Bansud, Oriental Mindoro',
                    'latitude' => 12.8145,
                    'longitude' => 121.4812,
                    'report_date' => now()->toDateString(),
                    'submitted_at' => now(),
                ],
            ];

            foreach ($sampleReports as $report) {
                if (
                    !DB::table('disease_reports')
                        ->where('animal_name', $report['animal_name'])
                        ->exists()
                ) {
                    DB::table('disease_reports')->insert($report);
                }
            }
        }
    }
}
