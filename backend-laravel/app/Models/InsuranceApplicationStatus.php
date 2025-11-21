<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InsuranceApplicationStatus extends Model
{
    protected $table = 'insurance_application_statuses';
    protected $primaryKey = 'status_id';
    public $timestamps = false;

    protected $fillable = ['status_name', 'status_description'];
}
