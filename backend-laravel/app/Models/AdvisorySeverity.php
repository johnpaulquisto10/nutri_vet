<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdvisorySeverity extends Model
{
    protected $table = 'advisory_severities';
    protected $primaryKey = 'severity_id';
    public $timestamps = false;

    protected $fillable = ['severity_name', 'severity_color', 'severity_description'];
}
