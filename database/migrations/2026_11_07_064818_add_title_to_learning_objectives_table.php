<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_objectives', function (Blueprint $table) {
            // Menambahkan kolom title varchar(255) atau varchar(50) bersifat nullable
            $table->string('title', 255)->nullable()->after('code');
        });
    }

    public function down(): void
    {
        Schema::table('learning_objectives', function (Blueprint $table) {
            $table->dropColumn('title');
        });
    }
};