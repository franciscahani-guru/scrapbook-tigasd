# 📚 Jurnal Belajar SD Andreas Semarang - Fase B Kelas 3 SD 🎨

Aplikasi **Scrapbook Digital & Management CP/TP** interaktif berbasis web untuk mendukung implementasi **Kurikulum Merdeka (Fase B Kelas 3 SD)** yang diselaraskan dengan standar **BSKAP No. 032/H/KR/2024**. Aplikasi ini memudahkan Guru dan Admin Sekolah dalam mengelola Tujuan Pembelajaran (TP), mengumpulkan karya/portofolio digital siswa, menyusun Projek P5, serta membagikan notifikasi perkembangan belajar secara langsung ke WhatsApp Orang Tua Siswa.

---

## ✨ Fitur Utama

- 🎨 **Papan Scrapbook Karya Digital:**
  - Menampilkan karya siswa lengkap dengan foto, judul, catatan pengamatan guru, dan atribut P5.
  - Fitur pencarian dan filter interaktif berdasarkan mata pelajaran & nama siswa.

- 📖 **Pusat Modul P5 & Manajemen CP/TP Dinamis:**
  - Support penuh input (CRUD) Tujuan Pembelajaran (TP) untuk **seluruh mata pelajaran** (IPAS, Matematika, Bahasa Indonesia, Pendidikan Pancasila, Seni & Budaya, dll).
  - Dilengkapi draf **Modul Projek P5 Terintegrasi** (Tema *Gaya Hidup Berkelanjutan* & *Kearifan Lokal*).

- 📱 **Integrasi WhatsApp Direct Link (100% Gratis):**
  - Penyimpanan kontak nomor WhatsApp Orang Tua pada profil siswa.
  - Tombol 1-klik untuk mengirim notifikasi karya terbaru ananda langsung ke WhatsApp Orang Tua tanpa biaya langganan API.

- 👤 **Manajemen Profil & Akses Guru/Admin:**
  - Pengelolaan data siswa Kelas 3A (NISN, Nama, Kelas, No. WA).
  - Mode proteksi login untuk akses edit/tambah data.

---

## 🛠️ Stack Teknologi

- **Backend:** Laravel 10/11 (PHP 8.1+)
- **Frontend:** Inertia.js + React.js
- **Styling:** Tailwind CSS
- **Iconography:** Lucide React
- **Database:** MySQL / MariaDB (Laragon)

---

## 🚀 Panduan Instalasi Lokal (Laragon / XAMPP)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal Anda:

### 1. Clone Repositori
```bash
git clone [https://github.com/username/scrapboook-tigasd.git](https://github.com/username/scrapbook-tigasd.git)
cd scrapbook-tigasd

### 2. Instal Dependensi PHP & JavaScript
```bash
composer install
npm install

### 3. Salin & Konfigurasi Berkas Environment
```bash
cp .env.example .env

Buka berkas .env dan sesuaikan pengaturan database Anda:
```code snippet
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=scrapbook_tigasd
DB_USERNAME=root
DB_PASSWORD=

### 4. Generate Application Key & Eksekusi Migrasi Database
```bash
php artisan key:generate
php artisan migrate

### 5. Buat Symbolic Link Storage (Untuk Berkas Foto)
```bash
php artisan storage:link

### 6. Jalankan Server Pengembangan
Buka dua jendela terminal terpisah:
Terminal 1 (Laravel Dev Server):
```bash
php artisan serve

Terminal 2 (Vite Frontend Build):
```bash
npm run dev

Buka browser Anda di http://127.0.0.1:8000 atau domain lokal Laragon Anda http://scrapbook-tigasd.test

📋 Struktur Tabel Utama Database
students: Menyimpan data NISN, nama siswa, kelas, dan nomor WhatsApp orang tua.
subjects: Menyimpan master mata pelajaran Kurikulum Merdeka.
learning_objectives: Menyimpan kode, judul/materi, dan deskripsi Tujuan Pembelajaran (TP/CP).
scrapbook_entries: Menyimpan karya siswa (foto, deskripsi, sticker, dimensi P5).

📄 Lisensi & Standar Kurikulum
Proyek ini dikembangkan mengacu pada Keputusan Kepala BSKAP Nomor 032/H/KR/2024 mengenai Capaian Pembelajaran pada Kurikulum Merdeka.

Developed with ❤️ for Pendidikan Indonesia