<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Siswa
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nisn')->unique();
            $table->string('name');
            $table->string('class_name')->default('3 A');
            $table->string('avatar')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Mata Pelajaran
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // contoh: IPAS, MAT, IND
            $table->string('name'); // contoh: Ilmu Pengetahuan Alam dan Sosial
            $table->string('color')->default('#3B82F6'); // warna badge
            $table->timestamps();
        });

        // 3. Tabel Capaian / Tujuan Pembelajaran (CP/TP)
        Schema::create('learning_objectives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('code'); // contoh: TP 3.1
            $table->text('description');
            $table->timestamps();
        });

        // 4. Tabel Entri Scrapbook
        Schema::create('scrapbook_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('learning_objective_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('sticker')->nullable(); // contoh: ⭐ Hebat!
            $table->string('p5_dimension')->nullable(); // contoh: Gotong Royong
            $table->text('teacher_note')->nullable();
            $table->date('entry_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scrapbook_entries');
        Schema::dropIfExists('learning_objectives');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('students');
    }
};