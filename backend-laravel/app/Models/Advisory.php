<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Advisory extends Model
{
    protected $table = 'advisories';
    protected $primaryKey = 'advisory_id';
    public $timestamps = true;

    protected $fillable = [
        'created_by',
        'category_id',
        'severity_id',
        'title',
        'description',
        'is_active',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AdvisoryCategory::class, 'category_id', 'category_id');
    }

    public function severity(): BelongsTo
    {
        return $this->belongsTo(AdvisorySeverity::class, 'severity_id', 'severity_id');
    }

    public function readers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'advisory_reads', 'advisory_id', 'user_id')
            ->withPivot('read_at');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }
}
