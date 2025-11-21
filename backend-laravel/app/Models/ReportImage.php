<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportImage extends Model
{
    protected $table = 'report_images';
    protected $primaryKey = 'image_id';
    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'image_path',
        'image_filename',
        'image_size',
        'mime_type',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'uploaded_at' => 'datetime',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(DiseaseReport::class, 'report_id', 'report_id');
    }
}
