<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiseaseCategory extends Model
{
    protected $table = 'disease_categories';
    protected $primaryKey = 'category_id';
    public $timestamps = false;

    protected $fillable = ['category_name', 'description'];
}
