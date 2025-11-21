<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimalPurpose extends Model
{
    protected $table = 'animal_purposes';
    protected $primaryKey = 'purpose_id';
    public $timestamps = false;

    protected $fillable = ['purpose_name', 'description'];
}
