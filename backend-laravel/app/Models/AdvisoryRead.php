<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdvisoryRead extends Model
{
    protected $table = 'advisory_reads';
    protected $primaryKey = 'read_id';
    public $timestamps = false;

    protected $fillable = ['advisory_id', 'user_id', 'read_at'];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
