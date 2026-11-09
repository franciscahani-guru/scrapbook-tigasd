import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { 
  Plus, Trash2, Edit3, Sparkles, BookOpen, 
  UserCheck, Filter, Search, Layers, 
  X, UserPlus, LogIn, LogOut, CheckCircle2, Leaf, Utensils, MessageCircle
} from 'lucide-react';

// --- DATA KONSTANTA KELAS 3 KURIKULUM MERDEKA ---
const SUBJECTS = [
  { id: 'ipas', name: 'IPAS (Ilmu Pengetahuan Alam & Sosial)', icon: '🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'mtk', name: 'Matematika', icon: '🔢', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'indo', name: 'Bahasa Indonesia', icon: '📚', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'pancasila', name: 'Pendidikan Pancasila', icon: '🇮🇩', color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'seni', name: 'Seni & Budaya', icon: '🎨', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'p5', name: 'Projek P5', icon: '🌟', color: 'bg-pink-100 text-pink-800 border-pink-300' },
];

const DIMENSI_P5 = [
  { id: 'beriman', name: 'Beriman & Bertaqwa', color: 'bg-emerald-500' },
  { id: 'mandiri', name: 'Mandiri', color: 'bg-blue-500' },
  { id: 'gotong', name: 'Gotong Royong', color: 'bg-amber-500' },
  { id: 'kritis', name: 'Bernalar Kritis', color: 'bg-purple-500' },
  { id: 'kreatif', name: 'Kreatif', color: 'bg-pink-500' },
  { id: 'kebinekaan', name: 'Berkebinekaan Global', color: 'bg-indigo-500' },
];

// DATA MODUL P5 DOKUMEN PDF
const PROJECT_P5_DATA = [
  {
    id: 'projek-1',
    semester: 'Semester 1',
    tema: 'Gaya Hidup Berkelanjutan',
    judul: 'Pahlawan Cilik Lingkungan: Pengolahan Sampah Organik & Pelestarian Alam Sekolah',
    relevansi: 'Relevan dengan TP 3.3 (Pelestarian Sumber Daya Alam)',
    dimensi: [
      'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia (Akhlak kepada alam)',
      'Gotong Royong (Kolaborasi)'
    ],
    icon: <Leaf className="w-5 h-5 text-emerald-600" />,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    alur: [
      { tahapan: '1. Pengenalan', deskripsi: 'Mengamati tumpukan sampah sekolah & dampaknya.' },
      { tahapan: '2. Kontekstualisasi', deskripsi: 'Mengidentifikasi jenis sampah (organik/anorganik).' },
      { tahapan: '3. Aksi', deskripsi: 'Membuat pupuk kompos sederhana / menanam TOGA.' },
      { tahapan: '4. Refleksi', deskripsi: 'Mendiskusikan kendala & perawatan tanaman.' },
      { tahapan: '5. Tindak Lanjut', deskripsi: 'Pameran mini kompos & Deklarasi Bebas Sampah Plastik.' }
    ]
  },
  {
    id: 'projek-2',
    semester: 'Semester 2',
    tema: 'Kearifan Lokal',
    judul: 'Festival Jajanan Tradisional: Menjaga Warisan Rasa Kampung Halamanku',
    relevansi: 'Relevan dengan TP 3.7 & TP 3.8 (Kearifan Lokal & Aktivitas Ekonomi)',
    dimensi: [
      'Berkebinekaan Global (Mengenal & menghargai budaya)',
      'Kreatif (Karya & tindakan orisinal)'
    ],
    icon: <Utensils className="w-5 h-5 text-amber-600" />,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    alur: [
      { tahapan: '1. Pengenalan', deskripsi: 'Wawancara mengenai jajanan tradisional khas.' },
      { tahapan: '2. Kontekstualisasi', deskripsi: 'Memilih jajanan pasar untuk dipelajari bahan bakunya.' },
      { tahapan: '3. Aksi', deskripsi: 'Simulasi penjualan jajanan pasar dalam Market Day.' },
      { tahapan: '4. Refleksi', deskripsi: 'Evaluasi hasil penjualan & menghitung keuntungan.' },
      { tahapan: '5. Tindak Lanjut', deskripsi: 'Menyusun buku resep digital/kliping portofolio kuliner.' }
    ]
  }
];

export default function Scrapbook({ students = [], subjects = [], entries = [], auth: propsAuth }) {
  const { auth: pageAuth } = usePage().props;
  const user = propsAuth?.user || pageAuth?.user;
  const isLoggedIn = !!user;

  // State Navigasi & Filter
  const [activeTab, setActiveTab] = useState('planner');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingScrap, setEditingScrap] = useState(null);
  const [editingObjective, setEditingObjective] = useState(null);

  // --- HELPER INTEGRASI WHATSAPP DIRECT LINK ---
  const sendWaNotification = (student, scrap) => {
    if (!student?.parent_phone) {
      alert(`Nomor WhatsApp Orang Tua untuk siswa ${student?.name || ''} belum diisi! Silakan edit data siswa terlebih dahulu.`);
      return;
    }

    // Format nomor HP ke standar internasional 628xxx
    let phone = student.parent_phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }

    const mapelName = scrap.subject?.name || 'Mata Pelajaran';
    const textMessage = `Yth. Bapak/Ibu Orang Tua dari *${student.name}*,\n\nSalam hangat! Karya terbaru ananda pada mata pelajaran *${mapelName}* dengan judul "*${scrap.title}*" telah resmi dipublikasikan di Scrapbook Digital SD Merdeka.\n\n📌 *Catatan Pengamatan Guru:* "${scrap.description}"\n\nLihat portofolio lengkap ananda melalui link aplikasi:\n${window.location.origin}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`, '_blank');
  };

  // --- FORM HANDLER SISWA ---
  const studentForm = useForm({
    nisn: '',
    name: '',
    class_name: '3A',
    parent_phone: '',
  });

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      studentForm.put(`/admin/students/${editingStudent.id}`, {
        onSuccess: () => {
          studentForm.reset();
          setEditingStudent(null);
          setIsStudentModalOpen(false);
        }
      });
    } else {
      studentForm.post('/admin/students', {
        onSuccess: () => {
          studentForm.reset();
          setIsStudentModalOpen(false);
        }
      });
    }
  };

  const openEditStudentModal = (std) => {
    setEditingStudent(std);
    studentForm.setData({
      nisn: std.nisn || '',
      name: std.name || '',
      class_name: std.class_name || '3A',
      parent_phone: std.parent_phone || '',
    });
    setIsStudentModalOpen(true);
  };

  // --- FORM HANDLER KARYA SCRAPBOOK ---
  const entryForm = useForm({
    student_id: '',
    subject_id: 'ipas',
    title: '',
    description: '',
    photo: null,
    imageUrl: '',
    sticker: '⭐ Hebat!',
    p5_dimension: 'kreatif',
    teacher_note: '',
  });

  const handleEntrySubmit = (e) => {
    e.preventDefault();
    if (editingScrap) {
      entryForm.post(`/admin/entries/${editingScrap.id}`, {
        headers: {
          'X-HTTP-Method-Override': 'PUT'
        },
        onSuccess: () => {
          entryForm.reset();
          setEditingScrap(null);
          setIsAddModalOpen(false);
        }
      });
    } else {
      entryForm.post('/admin/entries', {
        onSuccess: () => {
          entryForm.reset();
          setIsAddModalOpen(false);
        }
      });
    }
  };

  const openAddScrapModal = () => {
    setEditingScrap(null);
    entryForm.reset();
    entryForm.setData({
      student_id: students.length > 0 ? String(students[0].id) : '',
      subject_id: 'ipas',
      title: '',
      description: '',
      photo: null,
      imageUrl: '',
      sticker: '⭐ Hebat!',
      p5_dimension: 'kreatif',
      teacher_note: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditScrapModal = (scrap) => {
    setEditingScrap(scrap);
    entryForm.setData({
      student_id: String(scrap.student_id || scrap.student?.id || ''),
      subject_id: scrap.subject_id || scrap.subject?.code || 'ipas',
      title: scrap.title || '',
      description: scrap.description || '',
      photo: null,
      imageUrl: scrap.photo_path || '',
      sticker: scrap.sticker || '⭐ Hebat!',
      p5_dimension: scrap.p5_dimension || 'kreatif',
      teacher_note: scrap.teacher_note || '',
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteScrap = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus karya siswa ini?')) {
      useForm().delete(`/admin/entries/${id}`);
    }
  };

  // --- FORM HANDLER CP / TP UNTUK SEMUA MAPEL ---
  const objectiveForm = useForm({
    subject_id: subjects.length > 0 ? String(subjects[0].id) : 'ipas',
    code: '',
    title: '',
    description: '',
  });

  const handleObjectiveSubmit = (e) => {
    e.preventDefault();
    if (editingObjective) {
      objectiveForm.put(`/admin/objectives/${editingObjective.id}`, {
        onSuccess: () => {
          objectiveForm.reset();
          setEditingObjective(null);
          setIsObjectiveModalOpen(false);
        }
      });
    } else {
      objectiveForm.post('/admin/objectives', {
        onSuccess: () => {
          objectiveForm.reset();
          setIsObjectiveModalOpen(false);
        }
      });
    }
  };

  const openAddObjectiveModal = (defaultSubId = null) => {
    setEditingObjective(null);
    objectiveForm.reset();
    const initialSubject = defaultSubId 
      ? String(defaultSubId) 
      : (subjects.length > 0 ? String(subjects[0].id) : 'ipas');
      
    objectiveForm.setData({
      subject_id: initialSubject,
      code: '',
      title: '',
      description: '',
    });
    setIsObjectiveModalOpen(true);
  };

  const openEditObjectiveModal = (obj) => {
    setEditingObjective(obj);
    objectiveForm.setData({
      subject_id: String(obj.subject_id),
      code: obj.code || '',
      title: obj.title || '',
      description: obj.description || '',
    });
    setIsObjectiveModalOpen(true);
  };

  const handleDeleteObjective = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus Tujuan Pembelajaran (TP) ini?')) {
      useForm().delete(`/admin/objectives/${id}`);
    }
  };

  // Logic Filtering Entries
  const filteredEntries = entries.filter(item => {
    const itemSubjectId = item.subject?.code || String(item.subject_id);
    const matchesSubject = selectedSubject === 'all' || itemSubjectId === selectedSubject;
    const matchesStudent = selectedStudentFilter === 'all' || String(item.student_id) === String(selectedStudentFilter);
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesStudent && matchesSearch;
  });

  const displaySubjects = subjects.length > 0 ? subjects : SUBJECTS;

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-slate-800 font-sans antialiased">
      
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Judul */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black tracking-tight text-amber-900">
                    Jurnal Belajar<span className="text-pink-600">SD Merdeka</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Fase B - Kelas 3 SD
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Scrapbook Digital & Integrasi WhatsApp Chat</p>
              </div>
            </div>

            {/* Navigasi Tab */}
            <nav className="hidden md:flex items-center space-x-2 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200/60">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'canvas' ? 'bg-white text-pink-600 shadow-md' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Papan Scrapbook</span>
              </button>

              <button
                onClick={() => setActiveTab('planner')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'planner' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Modul P5 & CP/TP</span>
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'students' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Siswa & Profil</span>
              </button>
            </nav>

            {/* Area Tombol Login / Tambah Karya */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={openAddScrapModal}
                    className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg hover:from-pink-600 text-sm transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Tambah Karya Baru</span>
                  </button>

                  <div className="flex items-center space-x-2 bg-slate-100 p-1.5 pl-3 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 hidden lg:inline">
                      {user.name || 'Guru'}
                    </span>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition"
                      title="Logout Guru"
                    >
                      <LogOut className="w-4 h-4" />
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md text-sm transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login Guru</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* --- CONTENT UTAMA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: PAPAN SCRAPBOOK */}
        {activeTab === 'canvas' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari karya, siswa, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSubject === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ✨ Semua Mapel
                </button>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 whitespace-nowrap ${
                      selectedSubject === sub.id ? `${sub.color} shadow` : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedStudentFilter}
                  onChange={(e) => setSelectedStudentFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                >
                  <option value="all">Semua Siswa (Kelas 3A)</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.avatar || '👦'} {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="bg-amber-100/70 border border-amber-300 text-amber-900 p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between">
                <span>💡 Anda sedang melihat tampilan publik. Silakan <b>Login sebagai Guru</b> untuk menambah atau mengedit karya & data siswa.</span>
                <Link href="/login" className="bg-amber-800 text-white px-3 py-1 rounded-xl font-bold ml-2">Login</Link>
              </div>
            )}

            {/* GRID SCRAPBOOK */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEntries.map((scrap) => {
                const subjectCode = scrap.subject?.code || scrap.subject_id || 'ipas';
                const subjectObj = SUBJECTS.find(s => s.id === subjectCode) || SUBJECTS[0];
                const studentObj = scrap.student || students.find(s => s.id === scrap.student_id);

                return (
                  <div
                    key={scrap.id}
                    className="relative bg-amber-50/40 rounded-2xl p-4 border-2 border-amber-200/80 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-pink-300/80 shadow-sm rounded-sm pointer-events-none" />

                    <div className="flex items-center justify-between mt-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{studentObj?.avatar || '👦'}</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{studentObj?.name || 'Siswa'}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${subjectObj.color}`}>
                            {subjectObj.icon} {subjectObj.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {isLoggedIn && (
                        <div className="flex items-center space-x-1">
                          {/* TOMBOL WHATSAPP DIRECT LINK */}
                          <button
                            onClick={() => sendWaNotification(studentObj, scrap)}
                            className="text-emerald-600 hover:text-emerald-700 bg-emerald-100 hover:bg-emerald-200 p-1.5 rounded-lg transition"
                            title="Kirim Notifikasi Karya ke WhatsApp Ortu"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditScrapModal(scrap)}
                            className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-amber-100"
                            title="Edit Karya"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteScrap(scrap.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50"
                            title="Hapus Karya"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-2.5 rounded-xl shadow-inner border border-amber-100 mb-3">
                      <div className="overflow-hidden rounded-lg aspect-video relative bg-slate-100">
                        {scrap.photo_path ? (
                          <img src={scrap.photo_path} alt={scrap.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Tanpa Gambar</div>
                        )}
                        {scrap.p5_dimension && (
                          <span className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                            P5: {scrap.p5_dimension}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-2 line-clamp-1">{scrap.title}</p>
                    </div>

                    <p className="text-xs text-slate-600 mb-4 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                      "{scrap.description}"
                    </p>

                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {scrap.sticker && (
                          <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {scrap.sticker}
                          </span>
                        )}
                      </div>

                      {/* Tombol Bagikan Cepat via WA */}
                      <button
                        onClick={() => sendWaNotification(studentObj, scrap)}
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1 transition"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Kirim WA</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PLANNER P5 & CP/TP UNTUK SEMUA MATA PELAJARAN */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            
            {/* BANNER UTAMA PLANNER */}
            <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kurikulum Merdeka - SD Kelas 3</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">Pusat Input CP, TP & Modul Projek P5</h2>
                <p className="text-purple-100 text-xs md:text-sm leading-relaxed">
                  Guru dan Admin dapat memasukkan, mengedit, dan mengelola Tujuan Pembelajaran (TP) untuk seluruh mata pelajaran dalam sistem.
                </p>
              </div>

              {isLoggedIn && (
                <button
                  onClick={() => openAddObjectiveModal()}
                  className="flex items-center space-x-2 bg-white text-purple-800 font-extrabold px-5 py-3 rounded-2xl shadow-lg hover:bg-purple-50 text-xs transition whitespace-nowrap shrink-0 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah CP / TP Baru</span>
                </button>
              )}
            </div>

            {/* 6 DIMENSI PROFIL PELAJAR PANCASILA */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <span className="text-xl">🌟</span>
                <span>6 Dimensi Profil Pelajar Pancasila (P5)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {DIMENSI_P5.map((dim) => (
                  <div key={dim.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                    <div className={`w-3 h-3 ${dim.color} rounded-full mx-auto mb-2 shadow-sm`} />
                    <h4 className="font-bold text-xs text-slate-700">{dim.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* MODEL PROJEK P5 TERINTEGRASI */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-800">Model Projek P5 Kelas 3 (Terintegrasi)</h3>
                <p className="text-xs text-slate-500">Rancangan Projek P5 Kurikulum Merdeka Kelas 3 SD</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {PROJECT_P5_DATA.map((proj) => (
                  <div key={proj.id} className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-black border ${proj.badgeColor}`}>
                          {proj.semester}
                        </span>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                          Tema: {proj.tema}
                        </span>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 bg-slate-100 rounded-2xl shrink-0 mt-1">
                          {proj.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">{proj.judul}</h4>
                          <p className="text-xs text-emerald-700 font-semibold mt-1">{proj.relevansi}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dimensi P5 Terkait:</span>
                        {proj.dimensi.map((d, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-extrabold text-slate-700 block">Alur Kegiatan (Model 5 Tahapan):</span>
                        <div className="space-y-2">
                          {proj.alur.map((a, i) => (
                            <div key={i} className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 text-xs">
                              <span className="font-bold text-amber-900 block mb-0.5">{a.tahapan}</span>
                              <p className="text-slate-600 leading-relaxed">{a.deskripsi}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DAFTAR KELOMPOK CP & TP UNTUK SEMUA MATA PELAJARAN */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Target Capaian & Tujuan Pembelajaran (CP/TP) Semua Mapel</h3>
                  <p className="text-xs text-slate-500">Kelola Tujuan Pembelajaran untuk seluruh mata pelajaran di Kelas 3 SD</p>
                </div>
              </div>

              <div className="space-y-6">
                {displaySubjects.map((sub) => {
                  const subjectObjectives = sub.learning_objectives || sub.learningObjectives || [];
                  const subId = sub.id || sub.code;

                  return (
                    <div key={subId} className="border-2 border-slate-200 rounded-3xl p-5 bg-slate-50/50 space-y-4">
                      
                      {/* HEADER MATA PELAJARAN */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                        <h4 className="font-bold text-base text-slate-800 flex items-center space-x-2">
                          <span className="text-2xl">{sub.icon || '📌'}</span>
                          <span>{sub.name}</span>
                        </h4>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600">
                            {subjectObjectives.length} Tujuan Pembelajaran
                          </span>

                          {/* Tombol Cepat Tambah TP Khusus Mapel Ini */}
                          {isLoggedIn && (
                            <button
                              onClick={() => openAddObjectiveModal(subId)}
                              className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm transition"
                              title={`Tambah TP ${sub.name}`}
                            >
                              <Plus className="w-4 h-4" />
                              <span className="hidden sm:inline">Tambah TP</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* DAFTAR ITEM TP UNTUK MAPEL INI */}
                      <div className="space-y-3">
                        {subjectObjectives.length > 0 ? (
                          subjectObjectives.map((obj) => (
                            <div key={obj.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 shadow-sm hover:border-purple-300 transition">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-md inline-block">
                                    {obj.code}
                                  </span>
                                  {obj.title && (
                                    <span className="font-bold text-xs text-slate-800">
                                      {obj.title}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed pt-1">
                                  {obj.description}
                                </p>
                              </div>

                              {/* TOMBOL EDIT & HAPUS CP/TP */}
                              {isLoggedIn && (
                                <div className="flex items-center space-x-1 shrink-0">
                                  <button
                                    onClick={() => openEditObjectiveModal(obj)}
                                    className="text-slate-400 hover:text-amber-600 p-1.5 rounded-xl hover:bg-amber-50 transition"
                                    title="Edit TP"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteObjective(obj.id)}
                                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition"
                                    title="Hapus TP"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-xs text-slate-400 italic">Belum ada Tujuan Pembelajaran yang ditambahkan untuk {sub.name}.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: DAFTAR SISWA */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Daftar Siswa Kelas 3A</h2>
                <p className="text-xs text-slate-500">Kelola profil siswa dan nomor WhatsApp kontak orang tua.</p>
              </div>

              {isLoggedIn && (
                <button
                  onClick={() => {
                    setEditingStudent(null);
                    studentForm.reset();
                    setIsStudentModalOpen(true);
                  }}
                  className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition text-xs"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Tambah Siswa Baru</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {students.map((std) => (
                <div key={std.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative">
                  {isLoggedIn && (
                    <button
                      onClick={() => openEditStudentModal(std)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                      title="Edit Data Siswa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
                      {std.avatar || '👦'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{std.name}</h3>
                      <p className="text-xs text-slate-400">NISN: {std.nisn} | Kelas {std.class_name || '3A'}</p>
                      {std.parent_phone ? (
                        <p className="text-xs font-semibold text-emerald-700 flex items-center space-x-1 mt-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WA Ortu: {std.parent_phone}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-amber-600 italic mt-1">WA Ortu belum diisi</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* --- MODAL 1: TAMBAH / EDIT SISWA --- */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button 
                onClick={() => {
                  setIsStudentModalOpen(false);
                  setEditingStudent(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NISN / NIS</label>
                <input
                  type="text"
                  required
                  value={studentForm.data.nisn}
                  onChange={(e) => studentForm.setData('nisn', e.target.value)}
                  placeholder="Contoh: 304"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={studentForm.data.name}
                  onChange={(e) => studentForm.setData('name', e.target.value)}
                  placeholder="Masukkan nama siswa"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
                <input
                  type="text"
                  required
                  value={studentForm.data.class_name}
                  onChange={(e) => studentForm.setData('class_name', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              {/* INPUT NOMOR WHATSAPP ORANG TUA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp Orang Tua</label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={studentForm.data.parent_phone}
                  onChange={(e) => studentForm.setData('parent_phone', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Digunakan untuk pengiriman notifikasi karya siswa via 1-klik WhatsApp.</span>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsStudentModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl border text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={studentForm.processing}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold"
                >
                  {studentForm.processing ? 'Menyimpan...' : (editingStudent ? 'Simpan Perubahan' : 'Simpan Siswa')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TAMBAH / EDIT KARYA --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingScrap ? 'Edit Karya Siswa' : 'Tempel Karya Siswa Baru'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingScrap(null);
                }} 
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEntrySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pemilik Karya (Siswa)</label>
                <select
                  value={entryForm.data.student_id}
                  onChange={(e) => entryForm.setData('student_id', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-pink-400"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.class_name || '3A'})</option>
                  ))}
                </select>
                {entryForm.errors.student_id && (
                  <span className="text-red-500 text-[10px]">{entryForm.errors.student_id}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={entryForm.data.subject_id}
                  onChange={(e) => entryForm.setData('subject_id', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-medium"
                >
                  {displaySubjects.map(sub => (
                    <option key={sub.id || sub.code} value={sub.id || sub.code}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Karya</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Maket Rantai Makanan"
                  value={entryForm.data.title}
                  onChange={(e) => entryForm.setData('title', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option A: Unggah Berkas Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => entryForm.setData('photo', e.target.files[0])}
                  className="w-full bg-slate-50 border rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option B: Atau Masukkan Tautan (URL) Gambar</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... atau https://..."
                  value={entryForm.data.imageUrl}
                  onChange={(e) => entryForm.setData('imageUrl', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
                <span className="text-[10px] text-slate-400">Isi tautan ini jika tidak memilih berkas lokal di atas.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pengamatan Guru</label>
                <textarea
                  rows="3"
                  required
                  value={entryForm.data.description}
                  onChange={(e) => entryForm.setData('description', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingScrap(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={entryForm.processing}
                  className="w-1/2 py-2.5 rounded-xl bg-pink-500 text-white text-xs font-bold"
                >
                  {entryForm.processing ? 'Menyimpan...' : (editingScrap ? 'Simpan Perubahan' : 'Tempel ke Scrapbook')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: TAMBAH / EDIT TUJUAN PEMBELAJARAN (CP/TP) UNTUK SEMUA MAPEL --- */}
      {isObjectiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingObjective ? 'Edit Tujuan Pembelajaran (TP)' : 'Tambah TP / CP Baru'}
              </h3>
              <button 
                onClick={() => {
                  setIsObjectiveModalOpen(false);
                  setEditingObjective(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleObjectiveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Mata Pelajaran</label>
                <select
                  value={objectiveForm.data.subject_id}
                  onChange={(e) => objectiveForm.setData('subject_id', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-purple-400"
                  required
                >
                  {displaySubjects.map(sub => (
                    <option key={sub.id || sub.code} value={sub.id || sub.code}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode TP / CP</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TP 3.1 / TP MTK 3.1"
                  value={objectiveForm.data.code}
                  onChange={(e) => objectiveForm.setData('code', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul / Materi Pokok (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Mari Kenali Hewan di Sekitar Kita"
                  value={objectiveForm.data.title}
                  onChange={(e) => objectiveForm.setData('title', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Tujuan Pembelajaran</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Masukkan deskripsi tujuan pembelajaran..."
                  value={objectiveForm.data.description}
                  onChange={(e) => objectiveForm.setData('description', e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsObjectiveModalOpen(false);
                    setEditingObjective(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl border text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={objectiveForm.processing}
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  {objectiveForm.processing ? 'Menyimpan...' : (editingObjective ? 'Simpan Perubahan' : 'Simpan TP')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}