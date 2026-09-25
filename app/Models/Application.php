<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'dept',
        'dept_name',
        'discord_tag',
        'steam_hex',
        'age',
        'timezone',
        'experience',
        'character_name',
        'char_age',
        'char_gender',
        'backstory',
        'answers',
        'status',
        'notes',
    ];

    protected $casts = [
        'answers' => 'array',
    ];
}
