import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, Image, Award, Heart, Star, Sparkles, BookOpen, 
  UserCheck, Download, Share2, Filter, Search, Smile, Layers, CheckCircle2, 
  Palette, Tag, Volume2, Save, FileText, Camera, ChevronRight, X
} from 'lucide-react';

// --- DATA INITIAL DUMMY FOR KELAS 3 KURIKULUM MERDEKA ---
const SUBJECTS = [
  { id: 'ipas', name: 'IPAS (Ilmu Pengetahuan Alam & Sosial)', icon: '🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'mtk', name: 'Matematika', icon: '🔢', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'indo', name: 'Bahasa Indonesia', icon: '📚', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'pancasila', name: 'Pendidikan Pancasila', icon: '🇮🇩', color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'seni', name: 'Seni & Budaya', icon: '🎨', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'p5', name: 'Projek P5', icon: '🌟', color: 'bg-pink-100 text-pink-800 border-pink-300' },
];

const P5_THEMES = [
  'Gaya Hidup Berkelanjutan',
  'Kearifan Lokal',
  'Bhinneka Tunggal Ika',
  'Kewirausahaan',
  'Berekayasa dan Berteknologi untuk NKRI'
];

const DIMENSI_P5 = [
  { id: 'beriman', name: 'Beriman & Bertaqwa', color: 'bg-emerald-500' },
  { id: 'mandiri', name: 'Mandiri', color: 'bg-blue-500' },
  { id: 'gotong', name: 'Gotong Royong', color: 'bg-amber-500' },
  { id: 'kritis', name: 'Bernalar Kritis', color: 'bg-purple-500' },
  { id: 'kreatif', name: 'Kreatif', color: 'bg-pink-500' },
  { id: 'kebinekaan', name: 'Berkebinekaan Global', color: 'bg-indigo-500' },
];

const STICKERS = ['⭐ Hebat!', '👍 Juara', '🎨 Kreatif', '💡 Cerdas', '💖 Luar Biasa', '🌱 Tumbuh', '👏 Top BGT', '💯 Sempurna'];

const INITIAL_STUDENTS = [
  { id: '1', name: 'Ahmad Rayhan', nis: '301', avatar: '👦', targetCP: 'Mampu menyajikan hasil pengamatan tentang perubahan bentuk energi.' },
  { id: '2', name: 'Siti Nur Aisyah', nis: '302', avatar: '👧', targetCP: 'Mampu membandingkan pecahan sederhana dengan pembilang sama.' },
  { id: '3', name: 'Banyu Bening', nis: '303', avatar: '👦', targetCP: 'Menjelaskan hak dan kewajiban anggota keluarga di rumah.' },
];

const INITIAL_SCRAP_ITEMS = [
  {
    id: 'scrap-1',
    studentId: '1',
    studentName: 'Ahmad Rayhan',
    subjectId: 'ipas',
    title: 'Maket Diperbarui: Ekosistem Kebun SD',
    date: '2026-10-14',
    tpCode: 'TP 3.2 - Pengamatan Organisme & Lingkungan',
    content: 'Rayhan berhasil membuat maket rantai makanan mengaplikasikan bahan daur ulang dari kotak susu bekas.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60',
    stickers: ['🎨 Kreatif', '⭐ Hebat!'],
    tapeColor: 'bg-pink-300/80',
    audioNote: 'Ahmad menjelaskan secara lisan dengan sangat runtut.',
    p5Dimension: 'kreatif',
    likes: 5
  },
  {
    id: 'scrap-2',
    studentId: '2',
    studentName: 'Siti Nur Aisyah',
    subjectId: 'p5',
    p5Theme: 'Kewirausahaan',
    title: 'Projek P5: Jamu Kunyit Asam Cilik',
    date: '2026-10-20',
    tpCode: 'Dimensi Gotong Royong & Kewirausahaan SD',
    content: 'Aisyah bersama kelompoknya mengolah kunyit dan asam menjadi minuman sehat. Belajar mengukur liter dan menimbang gram.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=60',
    stickers: ['👍 Juara', '🌱 Tumbuh'],
    tapeColor: 'bg-yellow-300/80',
    audioNote: 'Antusias mempromosikan hasil karya saat Market Day.',
    p5Dimension: 'gotong',
    likes: 8
  },
  {
    id: 'scrap-3',
    studentId: '3',
    studentName: 'Banyu Bening',
    subjectId: 'mtk',
    title: 'Eksplorasi Pecahan Pizza Kertas',
    date: '2026-11-02',
    tpCode: 'TP 3.1 - Visualisasi Pecahan 1/2, 1/4, 1/8',
    content: 'Banyu membuktikan pecahan 1/2 lebih besar dibanding 1/4 dengan memotong gambar pizza visual secara mandiri.',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=60',
    stickers: ['💡 Cerdas', '💯 Sempurna'],
    tapeColor: 'bg-blue-300/80',
    audioNote: 'Sudah paham perbedaan pembilang dan penyebut.',
    p5Dimension: 'kritis',
    likes: 4
  }
];

export default function App() {
  // State Manager
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' | 'planner' | 'students' | 'rapor'
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [scraps, setScraps] = useState(INITIAL_SCRAP_ITEMS);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newScrap, setNewScrap] = useState({
    studentId: '1',
    subjectId: 'ipas',
    title: '',
    tpCode: '',
    content: '',
    imageUrl: '',
    p5Theme: 'Gaya Hidup Berkelanjutan',
    p5Dimension: 'kreatif',
    tapeColor: 'bg-amber-300/80',
    stickers: ['⭐ Hebat!'],
    audioNote: ''
  });

  // Export / Print Modal
  const [previewStudentRapor, setPreviewStudentRapor] = useState(null);

  // Add new Scrapbook entry
  const handleCreateScrap = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === newScrap.studentId);
    const newItem = {
      ...newScrap,
      id: `scrap-${Date.now()}`,
      studentName: student ? student.name : 'Siswa',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      imageUrl: newScrap.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60'
    };
    setScraps([newItem, ...scraps]);
    setIsAddModalOpen(false);
    // Reset Form
    setNewScrap({
      studentId: '1',
      subjectId: 'ipas',
      title: '',
      tpCode: '',
      content: '',
      imageUrl: '',
      p5Theme: 'Gaya Hidup Berkelanjutan',
      p5Dimension: 'kreatif',
      tapeColor: 'bg-amber-300/80',
      stickers: ['⭐ Hebat!'],
      audioNote: ''
    });
  };

  // Like / Sticker Reaction
  const handleAddSticker = (id, sticker) => {
    setScraps(scraps.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stickers: [...item.stickers, sticker]
        };
      }
      return item;
    }));
  };

  const handleDeleteScrap = (id) => {
    setScraps(scraps.filter(item => item.id !== id));
  };

  // Filtering Scraps
  const filteredScraps = scraps.filter(item => {
    const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
    const matchesStudent = selectedStudentFilter === 'all' || item.studentId === selectedStudentFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesStudent && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-slate-800 font-sans antialiased selection:bg-pink-200">
      
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-lg transform rotate-[-3deg] hover:rotate-0 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black tracking-tight text-amber-900 font-serif">
                    JurnalAjaib<span className="text-pink-600">SD3</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Kurikulum Merdeka
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Scrapbook Digital & Portofolio Kelas 3 SD</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <nav className="hidden md:flex items-center space-x-2 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200/60">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'canvas' 
                    ? 'bg-white text-pink-600 shadow-md scale-105' 
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white/50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Papan Scrapbook</span>
              </button>

              <button
                onClick={() => setActiveTab('planner')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'planner' 
                    ? 'bg-white text-purple-600 shadow-md scale-105' 
                    : 'text-slate-600 hover:text-purple-600 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Modul P5 & CP/TP</span>
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'students' 
                    ? 'bg-white text-emerald-600 shadow-md scale-105' 
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-white/50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Siswa & Profil</span>
              </button>
            </nav>

            {/* Action Header Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all text-sm"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah Karya Baru</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================= TAB 1: SCRAPBOOK CANVAS ================= */}
        {activeTab === 'canvas' && (
          <div className="space-y-6">
            
            {/* Filter Bar & Controls */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search input */}
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

              {/* Subject Badges Filter */}
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSubject === 'all' 
                      ? 'bg-slate-800 text-white shadow' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ✨ Semua Mapel
                </button>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
                      selectedSubject === sub.id 
                        ? `${sub.color} shadow ring-2 ring-pink-400 ring-offset-1` 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Filter by Student */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedStudentFilter}
                  onChange={(e) => setSelectedStudentFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="all">Semua Siswa (Kelas 3A)</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.avatar} {s.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Empty State */}
            {filteredScraps.length === 0 && (
              <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-amber-200">
                <Smile className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-700">Belum ada catatan scrapbook</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                  Klik tombol "Tambah Karya Baru" untuk menempelkan foto kegiatan, catatan asesmen, dan stiker apresiasi siswa!
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md"
                >
                  + Tambah Entri Pertama
                </button>
              </div>
            )}

            {/* SCRAPBOOK MASONRY / GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredScraps.map((scrap, index) => {
                const subjectObj = SUBJECTS.find(s => s.id === scrap.subjectId) || SUBJECTS[0];
                // Alternate subtle tilts for scrapbook paper aesthetic
                const rotations = ['rotate-[-1deg]', 'rotate-[1.5deg]', 'rotate-[-2deg]', 'rotate-[1deg]'];
                const tilt = rotations[index % rotations.length];

                return (
                  <div
                    key={scrap.id}
                    className={`relative bg-amber-50/40 rounded-2xl p-4 border-2 border-amber-200/80 shadow-lg hover:shadow-xl transition-all duration-300 transform ${tilt} hover:rotate-0 hover:scale-[1.01]`}
                  >
                    {/* Washi Tape Graphic at Top */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 ${scrap.tapeColor || 'bg-pink-300/80'} shadow-sm rounded-sm opacity-90 transform -rotate-1 pointer-events-none border-y border-white/50`} />

                    {/* Card Header */}
                    <div className="flex items-center justify-between mt-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{students.find(s => s.id === scrap.studentId)?.avatar || '👦'}</span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{scrap.studentName}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${subjectObj.color}`}>
                            {subjectObj.icon} {subjectObj.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteScrap(scrap.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hapus Karya"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Photo Container with Polaroid Border */}
                    <div className="bg-white p-2.5 rounded-xl shadow-inner border border-amber-100 mb-3">
                      <div className="overflow-hidden rounded-lg aspect-video relative group">
                        <img 
                          src={scrap.imageUrl} 
                          alt={scrap.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {scrap.p5Theme && (
                          <span className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                            P5: {scrap.p5Theme}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-2 line-clamp-1">{scrap.title}</p>
                    </div>

                    {/* CP / TP Tag */}
                    <div className="mb-3 bg-amber-100/70 p-2 rounded-xl border border-amber-200">
                      <div className="flex items-center space-x-1 text-amber-900 font-bold text-[11px]">
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        <span>Capaian / Tujuan Pembelajaran:</span>
                      </div>
                      <p className="text-xs text-amber-800 mt-0.5 italic">{scrap.tpCode}</p>
                    </div>

                    {/* Description Note */}
                    <p className="text-xs text-slate-600 mb-4 bg-white/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-sans">
                      "{scrap.content}"
                    </p>

                    {/* Audio Note Badge (If Any) */}
                    {scrap.audioNote && (
                      <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-xl p-2 mb-3 text-xs text-purple-800">
                        <Volume2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="truncate italic">Catatan Suara Guru: "{scrap.audioNote}"</span>
                      </div>
                    )}

                    {/* Visual Stickers Section */}
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {scrap.stickers?.map((stk, i) => (
                          <span key={i} className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {stk}
                          </span>
                        ))}
                      </div>

                      {/* Quick Add Sticker Dropdown */}
                      <div className="relative group">
                        <button className="p-1 rounded-full bg-white shadow-sm hover:bg-amber-100 text-slate-600 text-xs flex items-center space-x-1 px-2 border border-slate-200">
                          <Smile className="w-3.5 h-3.5 text-pink-500" />
                          <span>+Stiker</span>
                        </button>
                        <div className="absolute right-0 bottom-full mb-1 hidden group-hover:flex flex-wrap w-44 bg-white p-2 rounded-2xl shadow-xl border border-slate-200 gap-1 z-20">
                          {STICKERS.map((stk) => (
                            <button
                              key={stk}
                              onClick={() => handleAddSticker(scrap.id, stk)}
                              className="text-[10px] bg-slate-50 hover:bg-pink-100 p-1 rounded-lg text-slate-700 transition-colors"
                            >
                              {stk}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= TAB 2: MODUL P5 & CP/TP PLANNER ================= */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  Kurikulum Merdeka Kelas 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">Pusat P5 & Capaian Pembelajaran</h2>
                <p className="text-purple-100 text-sm mt-2 leading-relaxed">
                  Pantau 6 Dimensi Profil Pelajar Pancasila dan Tujuan Pembelajaran (TP) terintegrasi secara visual untuk laporan Rapor Merdeka.
                </p>
              </div>
              <Sparkles className="absolute right-6 bottom-4 w-40 h-40 text-white/10 pointer-events-none" />
            </div>

            {/* Dimensi Profil Pelajar Pancasila Badges */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>6 Dimensi Profil Pelajar Pancasila (P5)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {DIMENSI_P5.map((dim) => {
                  const count = scraps.filter(s => s.p5Dimension === dim.id).length;
                  return (
                    <div key={dim.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                      <div className={`w-3 h-3 ${dim.color} rounded-full mx-auto mb-2`} />
                      <h4 className="font-bold text-xs text-slate-800">{dim.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-semibold">{count} Dokumentasi</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tema P5 SD Kelas 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50/60 p-6 rounded-3xl border-2 border-amber-200">
                <h3 className="font-bold text-amber-900 text-base mb-3 flex items-center space-x-2">
                  <span>🌱</span>
                  <span>Tema P5 Fase B (Kelas 3 SD)</span>
                </h3>
                <ul className="space-y-2.5">
                  {P5_THEMES.map((theme, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-amber-100 text-xs font-semibold text-slate-700 shadow-sm">
                      <span>{theme}</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[10px]">Fase B</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Capaian Pembelajaran (CP) Matrik */}
              <div className="bg-blue-50/60 p-6 rounded-3xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 text-base mb-3 flex items-center space-x-2">
                  <span>📖</span>
                  <span>Matriks Capaian Pembelajaran Utama</span>
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-800 block mb-1">IPAS (Fase B - Kelas 3):</span>
                    <p className="text-slate-600">Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia & wujud zat.</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-800 block mb-1">Matematika (Fase B):</span>
                    <p className="text-slate-600">Peserta didik menunjukkan pemahaman pecahan senilai menggunakan gambar/benda konkret.</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-800 block mb-1">Bahasa Indonesia:</span>
                    <p className="text-slate-600">Mampu merangkai gagasan pokok dan pendukung dari teks narasi / infografis sederhana.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: PORTOFOLIO SISWA & RAPOR PREVIEW ================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Daftar Siswa Kelas 3A</h2>
                <p className="text-xs text-slate-500">Pilih siswa untuk melihat rangkuman portofolio digital dan cetak Rapor Merdeka.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {students.map((std) => {
                const stdScraps = scraps.filter(s => s.studentId === std.id);
                return (
                  <div key={std.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl border border-amber-300">
                        {std.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{std.name}</h3>
                        <p className="text-xs text-slate-400">NIS: {std.nis} | Kelas 3A</p>
                        <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {stdScraps.length} Karya Tersimpan
                        </span>
                      </div>
                    </div>

                    {/* Target TP */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs mb-4">
                      <span className="text-slate-400 font-bold block mb-1">Fokus Perkembangan CP:</span>
                      <p className="text-slate-700 font-medium italic">{std.targetCP}</p>
                    </div>

                    {/* Quick Preview Action */}
                    <button
                      onClick={() => setPreviewStudentRapor(std)}
                      className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Lihat Rapor Portofolio (PDF)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL 1: TAMBAH ENTRI SCRAPBOOK BARU ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-300 p-6 relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span>Tempel Karya Siswa Baru</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleCreateScrap} className="space-y-4">
              
              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Siswa</label>
                <select
                  value={newScrap.studentId}
                  onChange={(e) => setNewScrap({ ...newScrap, studentId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-pink-400 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.avatar} {s.name} ({s.nis})</option>
                  ))}
                </select>
              </div>

              {/* Select Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={newScrap.subjectId}
                    onChange={(e) => setNewScrap({ ...newScrap, subjectId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  >
                    {SUBJECTS.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.icon} {sub.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>

                {/* Tape Style */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Warna Selotip Visual</label>
                  <select
                    value={newScrap.tapeColor}
                    onChange={(e) => setNewScrap({ ...newScrap, tapeColor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  >
                    <option value="bg-pink-300/80">🩷 Selotip Merah Muda</option>
                    <option value="bg-yellow-300/80">💛 Selotip Kuning Cerah</option>
                    <option value="bg-blue-300/80">💙 Selotip Biru Muda</option>
                    <option value="bg-emerald-300/80">💚 Selotip Hijau Mint</option>
                  </select>
                </div>
              </div>

              {/* Title & Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kegiatan / Karya</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mengukur Keliling Bangun Datar"
                  value={newScrap.title}
                  onChange={(e) => setNewScrap({ ...newScrap, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Foto Hasil Karya (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newScrap.imageUrl}
                  onChange={(e) => setNewScrap({ ...newScrap, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              {/* Tag TP/CP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode / Deskripsi TP (Tujuan Pembelajaran)</label>
                <input
                  type="text"
                  placeholder="Contoh: TP 3.4 Menganalisis Pola Garis & Warna"
                  value={newScrap.tpCode}
                  onChange={(e) => setNewScrap({ ...newScrap, tpCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              {/* Content Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pengamatan Guru / Refleksi</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tuliskan catatan proses belajar, kelebihan, atau rekomendasi pendampingan..."
                  value={newScrap.content}
                  onChange={(e) => setNewScrap({ ...newScrap, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              {/* Audio Note text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Lisan / Pesan Suara Guru</label>
                <input
                  type="text"
                  placeholder="Tulis ringkasan umpan balik lisan..."
                  value={newScrap.audioNote}
                  onChange={(e) => setNewScrap({ ...newScrap, audioNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-lg hover:shadow-pink-500/30"
                >
                  Tempel ke Scrapbook
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PRATINJAU RAPOR PORTOFOLIO SISWA ================= */}
      {previewStudentRapor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
            
            {/* Modal Header Actions */}
            <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dokumen Portofolio Rapor Merdeka
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert(`Mengunduh Berkas Rapor Portofolio PDF untuk ${previewStudentRapor.name}...`)}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Cetak / Download PDF</span>
                </button>
                <button
                  onClick={() => setPreviewStudentRapor(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Portfolio Layout */}
            <div className="border-4 border-amber-200 p-6 rounded-2xl bg-[#FFFDF9]">
              
              {/* Header Rapor */}
              <div className="text-center border-b-2 border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-800">LEMBAR PORTOFOLIO BELAJAR SISWA</h2>
                <p className="text-xs text-slate-500 font-semibold">SD NEGERI HARAPAN BANGSA - KELAS 3 (FASE B)</p>
                <p className="text-[11px] text-amber-700 mt-1 font-bold">Tahun Ajaran 2026/2027 • Kurikulum Merdeka</p>
              </div>

              {/* Identitas Siswa */}
              <div className="grid grid-cols-2 gap-4 bg-amber-50 p-4 rounded-xl text-xs mb-6 border border-amber-200">
                <div>
                  <span className="text-slate-400 block">Nama Peserta Didik:</span>
                  <span className="font-bold text-slate-800 text-sm">{previewStudentRapor.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Nomor Induk Siswa (NIS):</span>
                  <span className="font-bold text-slate-800 text-sm">{previewStudentRapor.nis}</span>
                </div>
              </div>

              {/* Summarized Karya Items */}
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
                Dokumentasi Hasil Karya Terpilih:
              </h4>

              <div className="space-y-4">
                {scraps.filter(s => s.studentId === previewStudentRapor.id).map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex space-x-3 items-start">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded-lg shrink-0 border"
                    />
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">{item.title}</span>
                      <span className="text-[10px] text-amber-800 font-medium bg-amber-100 px-2 py-0.5 rounded">
                        {item.tpCode}
                      </span>
                      <p className="text-slate-600 text-[11px] leading-snug">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tanda Tangan */}
              <div className="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-slate-200 text-center text-xs">
                <div>
                  <p className="text-slate-500 mb-12">Mengetahui, Orang Tua / Wali</p>
                  <p className="font-bold text-slate-800">( .................................... )</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-12">Guru Kelas 3A</p>
                  <p className="font-bold text-slate-800">( Ibu Nurlaila, S.Pd. )</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="mt-16 bg-white border-t border-amber-200 py-6 text-center text-xs text-slate-400">
        <p>Aplikasi Digital Scrapbook Portofolio Guru SD Kelas 3 • Disesuaikan untuk Kurikulum Merdeka</p>
      </footer>

    </div>
  );
}