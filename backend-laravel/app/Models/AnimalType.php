<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimalType extends Model
{
    protected $table = 'animal_types';
    protected $primaryKey = 'animal_type_id';
    public $timestamps = false;

    protected $fillable = ['animal_type_name', 'description'];
}
