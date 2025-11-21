<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InsuranceApplication extends Model
{
    protected $table = 'insurance_applications';
    protected $primaryKey = 'application_id';

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = [
        'applicant_id',
        'barangay_id',
        'animal_type_id',
        'purpose_id',
        'status_id',
        'animal_type_other',
        'contact_number',
        'number_of_heads',
        'age_months',
        'breed',
        'basic_color',
        'male_count',
        'female_count',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'admin_notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'number_of_heads' => 'integer',
        'age_months' => 'integer',
        'male_count' => 'integer',
        'female_count' => 'integer',
    ];

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }

    public function animalType(): BelongsTo
    {
        return $this->belongsTo(AnimalType::class, 'animal_type_id');
    }

    public function purpose(): BelongsTo
    {
        return $this->belongsTo(AnimalPurpose::class, 'purpose_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(InsuranceApplicationStatus::class, 'status_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Accessor for display
    public function getAnimalTypeDisplayAttribute(): string
    {
        if ($this->animal_type_other) {
            return $this->animal_type_other;
        }
        return $this->animalType ? $this->animalType->animal_type_name : '';
    }
}
