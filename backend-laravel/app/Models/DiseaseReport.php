<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiseaseReport extends Model
{
    protected $table = 'disease_reports';
    protected $primaryKey = 'report_id';

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = [
        'reporter_id',
        'disease_id',
        'disease_name_custom',
        'animal_name',
        'report_status_id',
        'description',
        'address',
        'latitude',
        'longitude',
        'report_date',
        'submitted_at',
        'resolved_at',
        'resolved_by',
        'admin_notes',
    ];

    protected $casts = [
        'report_date' => 'date',
        'submitted_at' => 'datetime',
        'resolved_at' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class, 'disease_id', 'disease_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ReportStatus::class, 'report_status_id', 'report_status_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ReportImage::class, 'report_id', 'report_id');
    }

    public function primaryImage()
    {
        return $this->hasOne(ReportImage::class, 'report_id', 'report_id')->where('is_primary', true);
    }

    // Accessor for image URL
    public function getImageUrlAttribute()
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        if ($primaryImage && $primaryImage->image_path) {
            return asset('storage/' . $primaryImage->image_path);
        }
        return null;
    }

    // Accessor for user (alias for reporter)
    public function getUserAttribute()
    {
        return $this->reporter;
    }
}
