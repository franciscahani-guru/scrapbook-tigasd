<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Subject;
use App\Models\ScrapbookEntry;
use App\Models\LearningObjective;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class ScrapbookAdminController extends Controller
{
    // 1. Ambil Data Utama untuk Render Halaman Scrapbook
    public function index()
    {
        // Tentukan relasi entry yang akan dimuat
        $entryRelations = ['subject'];
        if (Schema::hasTable('learning_objectives')) {
            $entryRelations[] = 'learningObjective';
        }

        // Ambil data siswa beserta relasi entries
        $students = Schema::hasTable('students') 
            ? Student::with(array_map(fn($rel) => "entries.{$rel}", $entryRelations))->get() 
            : [];
        
        // Ambil data mata pelajaran beserta CP/TP
        $subjects = Schema::hasTable('subjects') 
            ? (Schema::hasTable('learning_objectives') ? Subject::with('learningObjectives')->get() : Subject::all()) 
            : [];
        
        // Ambil entri scrapbook beserta relasinya
        $allRelations = array_merge(['student'], $entryRelations);
        $entries = Schema::hasTable('scrapbook_entries') 
            ? ScrapbookEntry::with($allRelations)->latest()->get() 
            : [];

        return Inertia::render('Scrapbook', [
            'students' => $students,
            'subjects' => $subjects,
            'entries'  => $entries,
        ]);
    }

    // 2. Tambah Data Siswa Baru
    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'nisn'       => 'required|string|max:20|unique:students,nisn',
            'name'       => 'required|string|max:255',
            'class_name' => 'nullable|string|max:50',
            'parent_phone' => 'nullable|string|max:20',
            'avatar'     => 'nullable|string',
        ]);

        if (empty($validated['class_name'])) {
            $validated['class_name'] = '3 A';
        }

        Student::create($validated);

        return back()->with('success', 'Data siswa berhasil ditambahkan!');
    }

    // 3. Simpan Entri Scrapbook Baru (Mendukung Tautan Gambar & Penanganan Foreign Key)
    public function storeEntry(Request $request)
    {
        $validated = $request->validate([
            'student_id'            => 'required|exists:students,id',
            'subject_id'            => 'required',
            'learning_objective_id' => 'nullable|exists:learning_objectives,id',
            'title'                 => 'required|string|max:255',
            'description'           => 'nullable|string',
            'photo'                 => 'nullable',
            'imageUrl'              => 'nullable|string|max:1000',
            'sticker'               => 'nullable|string',
            'p5_dimension'          => 'nullable|string',
            'teacher_note'          => 'nullable|string',
            'entry_date'            => 'nullable|date',
        ]);

        // PERBAIKAN PEMETAAN SUBJECT ID
        if (Schema::hasTable('subjects')) {
            $subjectInput = $validated['subject_id'];
            if (is_numeric($subjectInput)) {
                $subject = Subject::find($subjectInput);
                if (!$subject) {
                    $subject = Subject::firstOrCreate(
                        ['code' => 'ipas'],
                        ['name' => 'IPAS (Kurikulum Merdeka)']
                    );
                }
            } else {
                $subject = Subject::firstOrCreate(
                    ['code' => $subjectInput],
                    ['name' => strtoupper($subjectInput) . ' (Kurikulum Merdeka)']
                );
            }
            $validated['subject_id'] = $subject->id;
        }

        // Tentukan nilai photo_path dari berkas unggahan atau tautan URL
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('scrapbook_photos', 'public');
            $validated['photo_path'] = '/storage/' . $path;
        } elseif (!empty($request->input('imageUrl'))) {
            $validated['photo_path'] = $request->input('imageUrl');
        }

        if (empty($validated['entry_date'])) {
            $validated['entry_date'] = now()->toDateString();
        }

        // Hapus variabel non-kolom database
        unset($validated['photo'], $validated['imageUrl']);

        ScrapbookEntry::create($validated);

        return back()->with('success', 'Hasil karya siswa berhasil ditempel ke Scrapbook!');
    }

    // 4. Hapus Entri Scrapbook
    public function destroyEntry($id)
    {
        $entry = ScrapbookEntry::findOrFail($id);

        if (!empty($entry->photo_path) && str_starts_with($entry->photo_path, '/storage/')) {
            $relativeStoragePath = str_replace('/storage/', '', $entry->photo_path);
            Storage::disk('public')->delete($relativeStoragePath);
        }

        $entry->delete();

        return back()->with('success', 'Entri berhasil dihapus!');
    }

    // 5. Edit Data Siswa
    public function updateStudent(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        
        $validated = $request->validate([
            'nisn'       => 'required|string|max:20|unique:students,nisn,' . $id,
            'name'       => 'required|string|max:255',
            'class_name' => 'required|string|max:50',
            'parent_phone' => 'nullable|string|max:20',
        ]);

        $student->update($validated);

        return back()->with('success', 'Data siswa berhasil diperbarui!');
    }

    // 6. Edit Entri Karya
    public function updateEntry(Request $request, $id)
    {
        $entry = ScrapbookEntry::findOrFail($id);

        $validated = $request->validate([
            'student_id'            => 'required|exists:students,id',
            'title'                 => 'required|string|max:255',
            'description'           => 'nullable|string',
            'p5_dimension'          => 'nullable|string',
            'teacher_note'          => 'nullable|string',
            'sticker'               => 'nullable|string',
            'photo'                 => 'nullable',
            'imageUrl'              => 'nullable|string|max:1000',
            'learning_objective_id' => 'nullable|exists:learning_objectives,id',
        ]);

        if ($request->hasFile('photo')) {
            if (!empty($entry->photo_path) && str_starts_with($entry->photo_path, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $entry->photo_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('scrapbook_photos', 'public');
            $validated['photo_path'] = '/storage/' . $path;
        } elseif (!empty($request->input('imageUrl'))) {
            $validated['photo_path'] = $request->input('imageUrl');
        }

        unset($validated['photo'], $validated['imageUrl']);

        $entry->update($validated);

        return back()->with('success', 'Karya berhasil diperbarui!');
    }

    // 7. Simpan CP/TP Baru untuk Semua Mata Pelajaran
    public function storeObjective(Request $request)
    {
        $validated = $request->validate([
            'subject_id'  => 'required',
            'code'        => 'required|string|max:50',
            'title'       => 'nullable|string|max:255',
            'description' => 'required|string',
        ]);

        if (Schema::hasTable('subjects')) {
            $subjectInput = $validated['subject_id'];
            
            if (is_numeric($subjectInput)) {
                $subject = Subject::find($subjectInput);
            } else {
                $subject = Subject::firstOrCreate(
                    ['code' => $subjectInput],
                    ['name' => strtoupper($subjectInput) . ' (Kurikulum Merdeka)']
                );
            }

            if ($subject) {
                $validated['subject_id'] = $subject->id;
            }
        }

        LearningObjective::create($validated);

        return back()->with('success', 'Tujuan Pembelajaran berhasil ditambahkan!');
    }

    // 8. Edit CP/TP
    public function updateObjective(Request $request, $id)
    {
        $objective = LearningObjective::findOrFail($id);

        $validated = $request->validate([
            'subject_id'  => 'required',
            'code'        => 'required|string|max:50',
            'title'       => 'nullable|string|max:255',
            'description' => 'required|string',
        ]);

        if (Schema::hasTable('subjects')) {
            $subjectInput = $validated['subject_id'];

            if (is_numeric($subjectInput)) {
                $subject = Subject::find($subjectInput);
            } else {
                $subject = Subject::firstOrCreate(
                    ['code' => $subjectInput],
                    ['name' => strtoupper($subjectInput) . ' (Kurikulum Merdeka)']
                );
            }

            if ($subject) {
                $validated['subject_id'] = $subject->id;
            }
        }

        $objective->update($validated);

        return back()->with('success', 'Tujuan Pembelajaran berhasil diperbarui!');
    }

    // 9. Hapus CP/TP
    public function destroyObjective($id)
    {
        $objective = LearningObjective::findOrFail($id);
        $objective->delete();

        return back()->with('success', 'Tujuan Pembelajaran berhasil dihapus!');
    }
}