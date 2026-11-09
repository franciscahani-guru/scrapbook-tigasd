<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learning_objectives', function (Blueprint $table) {
            $table->id();
            
            // Relasi Foreign Key ke tabel subjects
            $table->foreignId('subject_id')
                  ->constrained('subjects')
                  ->onDelete('cascade');
                  
            $table->string('code', 50);          // Contoh: TP 3.1
            $table->text('description');        // Deskripsi Tujuan Pembelajaran (TP)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_objectives');
    }
};