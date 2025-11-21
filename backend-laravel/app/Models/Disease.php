<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disease extends Model
{
    protected $table = 'diseases';
    protected $primaryKey = 'disease_id';
    public $timestamps = true;

    protected $fillable = [
        'category_id',
        'disease_name',
        'common_name',
        'description',
        'symptoms',
        'treatment',
        'prevention',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(DiseaseCategory::class, 'category_id', 'category_id');
    }
}
