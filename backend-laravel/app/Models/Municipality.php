<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    protected $table = 'municipalities';
    protected $primaryKey = 'municipality_id';
    public $timestamps = false;

    protected $fillable = ['province_id', 'municipality_name'];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'province_id');
    }

    public function barangays()
    {
        return $this->hasMany(Barangay::class, 'municipality_id', 'municipality_id');
    }
}
