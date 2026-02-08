<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    //
    use HasFactory;

    protected $primaryKey = 'guest_id';

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'check_in_date',
        'check_out_date',
    ];
    
    public $timestamps = false;
}
