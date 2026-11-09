<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nisn', 
        'name', 
        'class_name', 
        'parent_phone',
        'avatar'
    ];

    /**
     * Relasi ke entri Scrapbook (Nama relasi standar di Controller & Frontend)
     */
    public function entries()
    {
        return $this->hasMany(ScrapbookEntry::class, 'student_id');
    }

    /**
     * Alias relasi untuk kompatibilitas kode lama
     */
    public function scrapbookEntries()
    {
        return $this->entries();
    }
}