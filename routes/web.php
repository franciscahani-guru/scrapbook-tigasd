<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ScrapbookAdminController;

// 1. Halaman utama Scrapbook (Publik)
Route::get('/', [ScrapbookAdminController::class, 'index'])->name('scrapbook.index');

// 2. Redirect dari /dashboard bawaan Breeze ke Scrapbook Utama
Route::get('/dashboard', function () {
    return redirect()->route('scrapbook.index');
})->middleware(['auth'])->name('dashboard');

// 3. Route Aksi Admin/Guru (Wajib Auth & Ber-prefix /admin)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Management Siswa
    Route::post('/students', [ScrapbookAdminController::class, 'storeStudent'])->name('students.store');
    Route::put('/students/{id}', [ScrapbookAdminController::class, 'updateStudent'])->name('students.update');

    // Management Karya Scrapbook
    Route::post('/entries', [ScrapbookAdminController::class, 'storeEntry'])->name('entries.store');
    Route::put('/entries/{id}', [ScrapbookAdminController::class, 'updateEntry'])->name('entries.update');
    Route::delete('/entries/{id}', [ScrapbookAdminController::class, 'destroyEntry'])->name('entries.destroy');

    // Management Tujuan Pembelajaran (CP/TP) - Disesuaikan agar tidak duplikat prefix admin
    Route::post('/objectives', [ScrapbookAdminController::class, 'storeObjective'])->name('objectives.store');
    Route::put('/objectives/{id}', [ScrapbookAdminController::class, 'updateObjective'])->name('objectives.update');
    Route::delete('/objectives/{id}', [ScrapbookAdminController::class, 'destroyObjective'])->name('objectives.destroy');
});

require __DIR__.'/auth.php';