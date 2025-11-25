# ELARA (E-Learning Adaptive Recommendation Assistant)

ELARA adalah platform pembelajaran adaptif berbasis kecerdasan buatan yang dirancang untuk mahasiswa Universitas Terbuka. Aplikasi ini menyesuaikan materi dan pengalaman belajar dengan gaya belajar unik setiap pengguna.

## Teknologi yang Digunakan

*   **Frontend Framework:** React (v19.2.0)
*   **Styling:** Tailwind CSS v3.4.14, CSS
*   **Routing:** React Router DOM (v7.9.5)
*   **Icons:** React Icons (Font Awesome, Lucide React)
*   **File Processing:** pdfjs-dist v4.9.175 (untuk PDF), mammoth (untuk DOCX)
*   **AI Integration:** Google Generative AI SDK
*   **Development Tools:** Create React App, Web Vitals
*   **Testing Libraries:** React Testing Library, Jest

## Fitur Utama

*   **Dashboard Terorganisir:** Tampilan dashboard yang terbagi dalam menu-menu terpisah (Ringkasan, Profil Belajar, Rekomendasi AI, Modul Saya, Upload, To-Do List)
*   **Personalisasi Pembelajaran:** Menyesuaikan konten dan pendekatan belajar berdasarkan gaya belajar pengguna
*   **Upload Modul:** Mendukung berbagai format file (PDF, DOCX, DOC, TXT)
*   **Kuis Diagnostik:** Mengidentifikasi gaya belajar dan tingkat pemahaman awal
*   **Rekomendasi AI:** Memberikan saran belajar berdasarkan profil pengguna
*   **Manajemen Modul:** Upload, lihat, dan hapus modul pembelajaran
*   **To-Do List:** Pengelolaan aktivitas belajar harian
*   **Statistik Progres:** Melacak kemajuan pembelajaran pengguna
*   **Error Handling PDF:** Menangani error font pada file PDF

## Cara Menjalankan Aplikasi

1.  Buka terminal atau command prompt Anda.
2.  Arahkan ke direktori proyek dengan perintah:
    ```
    cd d:\KULIAH\salut-app
    ```
3.  Instal semua dependensi yang diperlukan dengan menjalankan:
    ```
    npm install
    ```
4.  Buat file `.env` di root direktori dan tambahkan API key:
    ```
    REACT_APP_GEMINI_API_KEY=your_api_key_here
    ```
5.  Setelah instalasi selesai, mulai aplikasi dengan perintah:
    ```
    npm start
    ```

Aplikasi akan terbuka di browser Anda secara otomatis. Jika tidak, Anda bisa membukannya secara manual di [http://localhost:3000](http://localhost:3000).

## Cara Menggunakan Aplikasi

### Untuk Mahasiswa

1.  Setelah aplikasi berjalan, Anda akan melihat halaman landing dengan informasi tentang ELARA (E-Learning Adaptive Recommendation Assistant).
2.  Klik tombol **"Masuk ke ELARA"** untuk pergi ke halaman login.
3.  Di halaman login, gunakan kredensial berikut untuk masuk:
    *   **NIM:** `123456789`
    *   **Password:** `123456789` (sama dengan NIM)
4.  Setelah login berhasil, Anda akan diarahkan ke dasbor ELARA.
5.  Dari dasbor, Anda dapat:
    *   Melihat ringkasan progres belajar dan statistik
    *   Mengatur profil belajar (gaya belajar, preferensi, dll.)
    *   Mengupload modul pembelajaran dalam berbagai format
    *   Mengerjakan kuis diagnostik untuk mengetahui gaya belajar
    *   Mengelola to-do list untuk kegiatan e-learning
    *   Melihat rekomendasi belajar yang disesuaikan dengan AI
    *   Mengakses modul yang telah diupload sebelumnya
6.  Gunakan menu navigasi di sidebar untuk mengakses berbagai fitur dashboard.

### Upload Modul Pembelajaran

1.  Dari dasbor, klik menu **"Upload"** di sidebar.
2.  Pilih file modul pembelajaran dalam format PDF, DOCX, DOC, atau TXT.
3.  Sistem akan menganalisis konten file dan membuat kuis adaptif serta ringkasan AI.
4.  Modul yang diupload akan tersedia di halaman "Modul Saya" untuk diakses kapan saja.

### Profil Belajar

1.  Dari dasbor, klik menu **"Profil Saya"** di sidebar.
2.  Lihat informasi gaya belajar dan kemampuan awal Anda.
3.  Klik "Edit Profil" untuk mengikuti kuis diagnostik dan memperbarui profil belajar.

### Rekomendasi AI

1.  Dari dasbor, klik menu **"Rekomendasi"** di sidebar.
2.  Lihat saran-saran belajar yang disesuaikan dengan gaya belajar Anda.
3.  Temukan tips belajar dan waktu optimal berdasarkan profil pengguna.

## Struktur Aplikasi

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.js (Tata letak dasbor dengan sidebar navigasi)
│   │   ├── DashboardSummary.js (Ringkasan utama dasbor)
│   │   ├── LearningProfilePage.js (Halaman profil belajar)
│   │   ├── RecommendationsPage.js (Halaman rekomendasi AI)
│   │   ├── ModulesPage.js (Halaman daftar modul)
│   │   ├── UploadPage.js (Halaman upload modul)
│   │   └── TodoPage.js (Halaman to-do list)
│   ├── PDFViewer.js (Komponen penampil PDF dengan error handling)
│   ├── UploadModule.js (Komponen upload modul dengan validasi)
│   ├── CustomModal.js (Komponen modal kustom)
│   └── ...
├── config/
│   ├── aiConfig.js (Konfigurasi API AI)
│   └── pdfConfig.js (Konfigurasi dan error handling PDF)
├── context/
│   ├── UserContext.js (Konteks pengguna)
│   └── LearningAnalyticsContext.js (Konteks analitik pembelajaran)
├── pages/
│   ├── LandingPage.js (Halaman utama)
│   ├── LoginPage.js (Halaman login)
│   ├── DashboardPage.js (Halaman dasbor)
│   ├── ModuleUploadPage.js (Upload modul)
│   ├── ModuleDetailPage.js (Detail modul)
│   ├── DiagnosticQuizPage.js (Kuis diagnostik)
│   ├── QuizPage.js (Kuis reguler)
│   └── AdaptiveQuizPage.js (Kuis adaptif)
├── utils/
│   ├── fileExtractor.js (Ekstraksi teks dari berbagai format file)
│   ├── textAnalyzer.js (Analisis teks untuk pembuatan kuis)
│   ├── quizStorage.js (Penyimpanan dan manajemen kuis)
│   └── aiSummaryGenerator.js (Generator ringkasan dengan AI)
└── ...
```

## Konfigurasi Penting

*   **API Key:** Aplikasi memerlukan API key dari Google Generative AI untuk fungsi ekstraksi teks dari PDF dan pembuatan ringkasan AI. Tambahkan `REACT_APP_GEMINI_API_KEY` di file `.env` Anda.
*   **Error Handling PDF:** Aplikasi sudah dilengkapi dengan konfigurasi khusus untuk menangani error font PDF (TT warnings) agar tidak mengganggu pengalaman pengguna.

## Kepanjangan

**ELARA** adalah singkatan dari **E-Learning Adaptive Recommendation Assistant**

## Lisensi

Capstone Project - Universitas Terbuka © 2025