<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $table = 'provinces';
    protected $primaryKey = 'province_id';
    public $timestamps = false;

    protected $fillable = ['province_name'];

    public function municipalities()
    {
        return $this->hasMany(Municipality::class, 'province_id', 'province_id');
    }
}
