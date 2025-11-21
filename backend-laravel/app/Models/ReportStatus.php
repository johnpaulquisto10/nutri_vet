<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportStatus extends Model
{
    protected $table = 'report_statuses';
    protected $primaryKey = 'report_status_id';
    public $timestamps = false;

    protected $fillable = ['status_name', 'status_description'];
}
