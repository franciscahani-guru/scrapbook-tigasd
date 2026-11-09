<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScrapbookEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'learning_objective_id',
        'title',
        'description',
        'photo_path',
        'sticker',
        'p5_dimension',
        'teacher_note',
        'entry_date',
    ];

    /**
     * Relasi ke Model Student
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relasi ke Model Subject
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * PERBAIKAN: Relasi ke Model LearningObjective (Tujuan Pembelajaran / CP-TP)
     */
    public function learningObjective()
    {
        return $this->belongsTo(LearningObjective::class, 'learning_objective_id');
    }
}