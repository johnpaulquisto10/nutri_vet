<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnimalType;
use App\Models\AnimalPurpose;
use App\Models\Barangay;
use App\Models\Disease;
use App\Models\DiseaseCategory;
use App\Models\AdvisoryCategory;
use App\Models\AdvisorySeverity;
use Illuminate\Http\Request;

class ReferenceDataController extends Controller
{
    /**
     * Get all barangays.
     */
    public function barangays()
    {
        $barangays = Barangay::with('municipality.province')
            ->orderBy('barangay_name')
            ->get();

        return response()->json($barangays);
    }

    /**
     * Get all animal types.
     */
    public function animalTypes()
    {
        $types = AnimalType::orderBy('animal_type_name')->get();
        return response()->json($types);
    }

    /**
     * Get all animal purposes.
     */
    public function animalPurposes()
    {
        $purposes = AnimalPurpose::orderBy('purpose_name')->get();
        return response()->json($purposes);
    }

    /**
     * Get all diseases.
     */
    public function diseases()
    {
        $diseases = Disease::with('category')
            ->orderBy('disease_name')
            ->get()
            ->map(function ($disease) {
                return [
                    'id' => $disease->disease_id,
                    'name' => $disease->disease_name,
                    'common_name' => $disease->common_name,
                    'symptoms' => $disease->symptoms,
                    'category' => $disease->category ? $disease->category->category_name : null,
                ];
            });
        return response()->json($diseases);
    }

    /**
     * Get all disease categories.
     */
    public function diseaseCategories()
    {
        $categories = DiseaseCategory::orderBy('category_name')->get()->map(function ($category) {
            return [
                'id' => $category->category_id,
                'name' => $category->category_name,
                'description' => $category->description,
            ];
        });
        return response()->json($categories);
    }

    /**
     * Get all advisory categories.
     */
    public function advisoryCategories()
    {
        $categories = AdvisoryCategory::orderBy('category_name')->get();
        return response()->json($categories);
    }

    /**
     * Get all advisory severities.
     */
    public function advisorySeverities()
    {
        $severities = AdvisorySeverity::orderBy('severity_name')->get();
        return response()->json($severities);
    }
}
