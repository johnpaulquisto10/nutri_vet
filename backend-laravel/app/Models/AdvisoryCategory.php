<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdvisoryCategory extends Model
{
    protected $table = 'advisory_categories';
    protected $primaryKey = 'category_id';
    public $timestamps = false;

    protected $fillable = ['category_name', 'description'];
}
