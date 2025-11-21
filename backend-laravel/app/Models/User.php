<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'full_name',
        'phone_number',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the role that the user belongs to.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    /**
     * Get the user's address information.
     */
    public function address(): HasOne
    {
        return $this->hasOne(UserAddress::class);
    }

    /**
     * Get the insurance applications created by the user.
     */
    public function insuranceApplications(): HasMany
    {
        return $this->hasMany(InsuranceApplication::class, 'applicant_id');
    }

    /**
     * Get the insurance applications reviewed by the user.
     */
    public function reviewedApplications(): HasMany
    {
        return $this->hasMany(InsuranceApplication::class, 'reviewed_by');
    }

    /**
     * Get the disease reports created by the user.
     */
    public function diseaseReports(): HasMany
    {
        return $this->hasMany(DiseaseReport::class, 'reporter_id');
    }

    /**
     * Get the disease reports resolved by the user.
     */
    public function resolvedReports(): HasMany
    {
        return $this->hasMany(DiseaseReport::class, 'resolved_by');
    }

    /**
     * Get the advisories created by the user.
     */
    public function advisories(): HasMany
    {
        return $this->hasMany(Advisory::class, 'created_by');
    }

    /**
     * Get the advisories read by the user.
     */
    public function readAdvisories(): BelongsToMany
    {
        return $this->belongsToMany(Advisory::class, 'advisory_reads', 'user_id', 'advisory_id', 'id', 'advisory_id')
            ->withPivot('read_at')
            ->withTimestamps();
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * Get the activity logs for the user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role && $this->role->role_name === 'admin';
    }

    /**
     * Check if user is a farmer.
     */
    public function isFarmer(): bool
    {
        return $this->role && $this->role->role_name === 'farmer';
    }
}
