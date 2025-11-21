<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAddress extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'barangay_id',
        'sitio',
        'street_address',
        'latitude',
        'longitude',
        'is_current',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_current' => 'boolean',
    ];

    /**
     * Get the user that owns the address.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the barangay that the address belongs to.
     */
    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    /**
     * Get the full address string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->street_address,
            $this->sitio ? "Sitio {$this->sitio}" : null,
            $this->barangay ? "Barangay {$this->barangay->name}" : null,
            $this->barangay && $this->barangay->municipality
            ? $this->barangay->municipality->name : null,
            $this->barangay && $this->barangay->municipality && $this->barangay->municipality->province
            ? $this->barangay->municipality->province->name : null,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Scope a query to only include current addresses.
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }
}
