<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningObjective extends Model
{
    use HasFactory;

    /**
     * PERBAIKAN: Izinkan mass-assignment untuk atribut berikut
     */
    protected $fillable = [
        'subject_id',
        'code',
        'title',
        'description',
    ];

    /**
     * Relasi ke Model Subject
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Relasi ke Model ScrapbookEntry
     */
    public function entries()
    {
        return $this->hasMany(ScrapbookEntry::class);
    }
}