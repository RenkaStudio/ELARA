import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBrain, FaChartLine } from 'react-icons/fa';

const LearningProfilePage = () => {
  const [learningProfile, setLearningProfile] = useState({});

  useEffect(() => {
    // Load user data
    const savedProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
    setLearningProfile(savedProfile);
  }, []);

  const getAbilityText = (ability) => {
    if (ability === 0) return 'Sangat Tahu';
    if (ability === 1) return 'Kurang Tahu';
    if (ability === 2) return 'Cukup Tahu';
    if (ability === 3) return 'Sangat Tahu';
    return 'Belum diuji';
  };

  const getLearningStyleDescription = (style) => {
    if (!style) return 'Deskripsi gaya belajar tidak tersedia. Silakan lengkapi kuis gaya belajar terlebih dahulu.';
    
    // Normalisasi gaya belajar untuk menangani berbagai kemungkinan penamaan
    const normalizedStyle = style.toLowerCase().trim();
    
    switch (normalizedStyle) {
      case 'visual':
        return 'Anda belajar lebih baik dengan bantuan gambar, diagram, dan representasi visual lainnya. Gaya belajar ini cocok dengan penggunaan peta konsep, grafik, dan penggunaan warna dalam catatan.';
      case 'auditori':
      case 'auditory':
      case 'aural':
        return 'Anda belajar lebih baik melalui pendengaran dan suara. Anda lebih mudah memahami informasi ketika dibacakan atau didiskusikan, serta bisa belajar melalui musik dan suara.';
      case 'kinestetik':
      case 'kinesthetic':
        return 'Anda belajar lebih baik dengan pengalaman langsung dan aktivitas fisik. Anda perlu terlibat langsung dalam proses belajar dan sering menggunakan gerakan tubuh untuk memperkuat memori.';
      case 'reading/writing':
      case 'reading':
      case 'writing':
        return 'Anda belajar lebih baik melalui membaca dan menulis. Anda merasa nyaman dengan catatan tertulis, membaca ulang materi, dan mengorganisir informasi dalam bentuk teks.';
      default:
        // Jika gaya belajar tidak dikenal, tetapi ada nilai, mungkin itu adalah nama yang berbeda
        // Kembalikan pesan umum berdasarkan nilai yang ditemukan
        return `Deskripsi untuk gaya belajar "${style}" tidak dikenal. Silakan lakukan kuis gaya belajar untuk identifikasi yang lebih akurat.`;
    }
  };

  const getLearningStyleStrategies = (style) => {
    if (!style) return [];
    
    // Normalisasi gaya belajar untuk menangani berbagai kemungkinan penamaan
    const normalizedStyle = style.toLowerCase().trim();
    
    switch (normalizedStyle) {
      case 'visual':
        return [
          'Gunakan diagram dan peta konsep',
          'Buat catatan dengan warna-warna berbeda',
          'Gunakan teknik visualisasi dan simbol',
          'Gunakan grafik dan bagan untuk belajar'
        ];
      case 'auditori':
      case 'auditory':
      case 'aural':
        return [
          'Bacakan materi dengan suara keras',
          'Diskusikan materi dengan teman',
          'Gunakan musik atau ritme untuk belajar',
          'Rekam dan dengarkan pembelajaran'
        ];
      case 'kinestetik':
      case 'kinesthetic':
        return [
          'Terapkan konsep dalam praktik',
          'Gunakan peraga atau model',
          'Belajar sambil bergerak atau berjalan',
          'Gunakan metode berbasis proyek'
        ];
      case 'reading/writing':
      case 'reading':
      case 'writing':
        return [
          'Buat ringkasan tertulis',
          'Gunakan teknik highlight dan catatan sisi',
          'Tulis ulang konsep penting',
          'Gunakan teknik membuat catatan sistematis'
        ];
      default:
        return [
          'Lengkapi profil belajar untuk strategi yang lebih spesifik.',
          'Ikuti kuis gaya belajar untuk rekomendasi yang lebih akurat.'
        ];
    }
  };

  const learningStyleStrategies = getLearningStyleStrategies(learningProfile.learningStyle);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Profil Belajar Saya</h2>
        <Link 
          to="/diagnostic-quiz" 
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
        >
          Edit Profil
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Link>
      </div>

      {/* Informasi Dasar */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <FaUser className="text-blue-600" style={{ width: 18, height: 18 }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Informasi Dasar</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Gaya Belajar</span>
              <span className="font-medium text-gray-800">{learningProfile.learningStyle || 'Belum diidentifikasi'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Kemampuan Awal</span>
              <span className="font-medium text-gray-800">{getAbilityText(learningProfile.ability)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Waktu Fokus</span>
              <span className="font-medium text-gray-800">{learningProfile.focusTime || 'Belum ditentukan'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Durasi Sesi</span>
              <span className="font-medium text-gray-800">{learningProfile.sessionDuration || 'Tidak ditentukan'} menit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Gaya Belajar */}
      {learningProfile.learningStyle && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FaBrain className="text-green-600" style={{ width: 18, height: 18 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Gaya Belajar: {learningProfile.learningStyle}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Deskripsi</h4>
              <p className="text-gray-600 text-sm">
                {getLearningStyleDescription(learningProfile.learningStyle)}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Strategi Belajar</h4>
              <ul className="space-y-2">
                {learningStyleStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-600 text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Rekomendasi AI */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <FaChartLine className="text-blue-600" style={{ width: 18, height: 18 }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Rekomendasi AI</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">
              Berdasarkan profil belajar Anda, waktu belajar optimal adalah <span className="font-medium">{learningProfile.focusTime || 'belum ditentukan'}</span>. Gunakan waktu ini untuk kegiatan belajar yang membutuhkan fokus tinggi.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">
              Metode yang paling cocok untuk gaya belajar Anda adalah <span className="font-medium">{learningProfile.learningStyle || 'tidak diketahui'}</span>. Fokuslah pada teknik yang sesuai dengan gaya belajar ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProfilePage;