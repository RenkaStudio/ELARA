# Panduan Penyelesaian Modul & Pembuatan Kuis - ELARA App

## 📋 Ringkasan Eksekutif

Dokumen ini memastikan bahwa **setiap modul yang di-upload dapat diselesaikan dengan baik dan kuis dapat dibuat dengan sempurna**. Ini mencakup validasi input, error handling, fallback mechanisms, dan quality assurance.

---

## 1. 🔄 Alur Proses Lengkap Upload Modul

### A. Tahap Upload File

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOAD FILE                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ VALIDASI FILE:                                               │
│ ✓ Format: PDF, DOCX, DOC, TXT                               │
│ ✓ Ukuran: < 50 MB (recommended)                             │
│ ✓ Extension check & MIME type                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ✓ FILE VALID?
                   /              \
                 YES               NO
                /                    \
              ↓                      ↓
         PROCEED              ERROR HANDLING
         (20%)              (Show Error Message)
```

**Status Progres: 10-20%**

### B. Tahap Ekstraksi Teks

```
┌─────────────────────────────────────────────────────────────┐
│         EKSTRAK TEKS DARI FILE                              │
│ - PDF: Gunakan pdfjs-dist                                   │
│ - DOCX: Parse binary structure                              │
│ - TXT: Direct read                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ VALIDASI TEKS:                                               │
│ ✓ Bukan kosong (length > 0)                                 │
│ ✓ Minimal 100 karakter (untuk kuantitas)                    │
│ ✓ Tidak semua spasi/whitespace                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ✓ TEKS VALID?
                   /              \
                 YES               NO
                /                    \
              ↓                      ↓
         PROCEED              THROW ERROR
         (40%)              "Tidak dapat mengekstrak
                           teks dari file"
```

**Status Progres: 20-40%**

### C. Tahap Pembuatan Kuis

```
┌─────────────────────────────────────────────────────────────┐
│           GENERATE QUIZ DARI TEKS                           │
│                                                              │
│ PRIMARY: Gunakan Gemini AI (jika available)                 │
│ FALLBACK: Local generation algorithm                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STRUKTUR PERTANYAAN (per soal):                             │
│ ✓ question: string (jelas & spesifik)                       │
│ ✓ options: array[4] (semua opsi)                            │
│ ✓ answer: string (jawaban benar)                            │
│ ✓ explanation: string (penjelasan)                          │
│ ✓ correctAnswer: number (index, 0-3)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ VALIDASI KUIS:                                               │
│ ✓ Jumlah pertanyaan: >= 5 (minimum)                         │
│ ✓ Setiap soal memiliki 4 opsi                               │
│ ✓ Jawaban ada dalam opsi                                    │
│ ✓ Format JSON valid                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ✓ KUIS VALID?
                   /              \
                 YES               NO
                /                    \
              ↓                      ↓
         PROCEED              FALLBACK QUIZ
         (60%)              (Pertanyaan dasar)
```

**Status Progres: 40-60%**

### D. Tahap Pembuatan Ringkasan

```
┌─────────────────────────────────────────────────────────────┐
│      GENERATE SUMMARY & ANALYTICS DARI TEKS                 │
│                                                              │
│ - Key Topics (topik utama)                                  │
│ - Difficulty Level (tingkat kesulitan)                      │
│ - Learning Style Summary (sesuai gaya belajar)              │
│ - Key Concepts (konsep penting)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ VALIDASI SUMMARY:                                            │
│ ✓ Key Topics: array (min 3)                                 │
│ ✓ Difficulty: string (easy/medium/hard)                     │
│ ✓ Description: string (tidak kosong)                        │
└─────────────────────────────────────────────────────────────┘
```

**Status Progres: 60-80%**

### E. Tahap Penyimpanan

```
┌─────────────────────────────────────────────────────────────┐
│        SIMPAN KE LOCALSTORAGE (3 bagian)                    │
│                                                              │
│ 1. localStorage['quizzes'][moduleId] = quizData            │
│ 2. localStorage['summaries'][moduleId] = summaryData        │
│ 3. localStorage['modules'].push(moduleInfo)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STRUKTUR MODUL INFO:                                         │
│ {                                                            │
│   id: moduleId (timestamp),                                 │
│   title: filename,                                          │
│   uploadDate: ISO string,                                   │
│   questionCount: number,                                    │
│   ...summaryData (spread)                                   │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
```

**Status Progres: 80-100%**

---

## 2. ⚠️ Error Handling & Fallback Mechanisms

### A. File Extraction Errors

| Error                 | Penyebab                | Solusi             | Fallback          |
| --------------------- | ----------------------- | ------------------ | ----------------- |
| File kosong           | File tanpa konten       | Error message      | N/A               |
| Format tidak didukung | File bukan PDF/DOCX/TXT | Reject file        | N/A               |
| PDF image-based       | PDF hanya gambar        | Ekstrak text fails | Manual text input |
| Corrupt file          | File rusak              | Parse error        | N/A               |

**Implementasi:**

```javascript
// src/components/UploadModule.js - Line 68-73
if (!textContent || textContent.trim() === "") {
  throw new Error(
    "Tidak dapat mengekstrak teks dari file. File mungkin kosong atau tidak didukung."
  );
}
```

### B. Quiz Generation Errors

| Error                 | Penyebab              | Fallback             |
| --------------------- | --------------------- | -------------------- |
| AI API timeout        | Koneksi lambat        | Local generation     |
| AI API error          | Service unavailable   | Local generation     |
| Invalid JSON response | Format response salah | Parse & validate     |
| Empty quiz            | Parsing error         | Create 5 default Q&A |

**Implementasi:**

```javascript
// src/utils/textAnalyzer.js - Line 14-20
export const generateQuizFromText = async (text) => {
  try {
    if (
      aiConfig.apiService.provider !== "local" &&
      aiConfig.apiService.apiKey
    ) {
      return await generateQuizFromExternalAPI(text);
    } else {
      return await generateQuizLocally(text); // FALLBACK
    }
  } catch (error) {
    return await generateQuizLocally(text); // FALLBACK
  }
};
```

### C. Summary Generation Errors

| Error            | Penyebab      | Fallback        |
| ---------------- | ------------- | --------------- |
| AI unavailable   | API error     | Basic summary   |
| Timeout          | Koneksi issue | Default values  |
| Invalid response | Format error  | Generic summary |

---

## 3. ✅ Validasi Data (Checklist)

### Sebelum Menyimpan

- [ ] **File validation**

  - [ ] File selected
  - [ ] File size < 50MB
  - [ ] File type supported
  - [ ] File not corrupt

- [ ] **Text extraction**

  - [ ] Text extracted successfully
  - [ ] Text length > 100 chars
  - [ ] No only-whitespace content
  - [ ] Readable content exists

- [ ] **Quiz generation**

  - [ ] Quiz array not empty
  - [ ] Quiz length >= 5 questions
  - [ ] All questions have 4 options
  - [ ] All options are strings
  - [ ] Answer exists in options
  - [ ] Correct answer index valid

- [ ] **Module metadata**
  - [ ] Module ID generated (unique)
  - [ ] Title not empty
  - [ ] Upload date set
  - [ ] Question count accurate
  - [ ] All summary fields present

### Setelah Menyimpan

- [ ] **localStorage integrity**

  - [ ] modules array updated
  - [ ] quizzes object updated
  - [ ] summaries object updated
  - [ ] Data retrievable

- [ ] **UI feedback**
  - [ ] Success message shown
  - [ ] Progress bar complete
  - [ ] Module appears in list
  - [ ] Quiz accessible

---

## 4. 🎯 Modul Completion Flow

### Halaman Modul (Module Page)

```
┌──────────────────────────────────────┐
│      LOAD SEMUA MODUL                 │
│  dari localStorage['modules']         │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│    TAMPILKAN CARD UNTUK SETIAP MODUL │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Judul Modul                     │ │
│  │ Deskripsi singkat               │ │
│  │                                 │ │
│  │ [Mulai Kuis] [Lihat Ringkasan]  │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Mulai Kuis

**Decision Tree:**

```
┌─────────────────────┐
│  USER CLICK QUIZ    │
└─────────────────────┘
           ↓
    CHECK PROFILE?
    /            \
  YES             NO
  /                \
 ↓                  ↓
ADAPTIVE     STANDARD
QUIZ         QUIZ
(Quiz Page) (Quiz Page)
```

**Implementasi:**

```javascript
// src/pages/ModulePage.js - Line 39-49
const startQuiz = (moduleId) => {
  const hasLearningProfile = !!localStorage.getItem("learningProfile");

  if (hasLearningProfile) {
    navigate(`/adaptive-quiz/${moduleId}`);
  } else {
    navigate(`/quiz/${moduleId}`);
  }
};
```

### Quiz Page Flow

```
┌────────────────────────────────────────┐
│  LOAD MODULE & LEARNING PROFILE        │
└────────────────────────────────────────┘
            ↓
┌────────────────────────────────────────┐
│  GENERATE PERSONALIZED QUIZ            │
│  using generatePersonalizedQuiz()      │
└────────────────────────────────────────┘
            ↓
       ERROR?
      /      \
    YES       NO
   /           \
  ↓             ↓
SHOW       SHOW QUIZ
ERROR    QUESTIONS
         ONE BY ONE
            ↓
        USER SELECT
        ANSWER
            ↓
        CHECK: CORRECT?
        /               \
      YES               NO
     /                   \
   ↓                     ↓
SCORE+1          SHOW FEEDBACK
SHOW CHECK     (explanation)
           \     /
            \   /
             ↓
        NEXT QUESTION
             ↓
        ALL DONE?
        /        \
      NO        YES
     /            \
   ↓              ↓
NEXT          SHOW RESULTS
QUESTION      SAVE PROGRESS
```

**Implementasi:**

```javascript
// src/pages/QuizPage.js - Line 58-72
const initializeQuiz = useCallback(async () => {
  try {
    const learningProfile = getLearningProfile();
    const generatedQuiz = await generatePersonalizedQuiz(
      moduleContent,
      learningProfile || {},
      "review"
    );
    setAiQuiz(formattedQuiz);
  } catch (error) {
    // Fallback mechanism
    const fallbackQuiz = [...];
    setAiQuiz(fallbackQuiz);
  }
}, [module, aiQuiz.length, getLearningProfile]);
```

### Quiz Completion

```
┌──────────────────────────────┐
│   ALL QUESTIONS ANSWERED     │
└──────────────────────────────┘
            ↓
┌──────────────────────────────┐
│  CALCULATE FINAL SCORE       │
│  score / totalQuestions * 100│
└──────────────────────────────┘
            ↓
┌──────────────────────────────┐
│  SAVE TO CONTEXT:            │
│  - completeQuiz()            │
│  - recordQuizPerformance()   │
│  - completeModule()          │
└──────────────────────────────┘
            ↓
┌──────────────────────────────┐
│  UPDATE localStorage:        │
│  - userProgress              │
│  - scores                    │
│  - modulesCompleted          │
└──────────────────────────────┘
            ↓
┌──────────────────────────────┐
│  SHOW RESULTS SCREEN         │
│  - Score display             │
│  - Feedback message          │
│  - Answer review             │
│  - Navigation options        │
└──────────────────────────────┘
```

**Implementasi:**

```javascript
// src/pages/QuizPage.js - Line 125-137
const numericModuleId = parseInt(moduleId);
completeQuiz(numericModuleId, finalScore);
recordQuizPerformance(numericModuleId, finalScore, aiQuiz.length);
completeModule(numericModuleId);
```

---

## 5. 📊 Module Detail Page

Setiap modul memiliki halaman detail yang menampilkan:

- **Module Information**

  - Judul & deskripsi
  - Tanggal upload
  - Jumlah topik
  - Tingkat kesulitan

- **Summary & Analytics**

  - Ringkasan konten
  - Key topics
  - Learning style summary
  - Concepts yang dicover

- **Quiz Status**

  - Apakah sudah mengikuti kuis
  - Nilai jika sudah diambil
  - Waktu pengerjaan

- **Actions**
  - Mulai/Ulang kuis
  - Lihat jawaban sebelumnya
  - Download summary

**Implementasi:**

```javascript
// src/pages/ModuleDetailPage.js - Line 26-36
useEffect(() => {
  try {
    const savedModules = JSON.parse(localStorage.getItem("modules") || "[]");
    const foundModule = savedModules.find((m) => m.id === moduleId);

    if (foundModule) {
      setModule(foundModule);
    } else {
      setError("Modul tidak ditemukan");
    }
  } catch (err) {
    setError("Gagal memuat modul");
  }
}, [moduleId]);
```

---

## 6. 🛡️ Quality Assurance

### Testing Checklist

#### Upload Module

- [ ] Upload PDF file - SUCCESS
- [ ] Upload DOCX file - SUCCESS
- [ ] Upload TXT file - SUCCESS
- [ ] Upload empty file - ERROR with message
- [ ] Upload unsupported format - ERROR
- [ ] Upload large file (>50MB) - ERROR
- [ ] Upload image-based PDF - ERROR with helpful message
- [ ] Progress bar updates - YES
- [ ] Success message appears - YES
- [ ] Module in list after - YES

#### Quiz Generation

- [ ] AI generates quiz - SUCCESS (if available)
- [ ] Fallback quiz works - SUCCESS
- [ ] All questions have 4 options - YES
- [ ] Answers are valid - YES
- [ ] No duplicate questions - YES
- [ ] Explanations provided - YES

#### Quiz Taking

- [ ] Load quiz correctly - YES
- [ ] Display question - YES
- [ ] Select option - WORKS
- [ ] Show feedback - YES
- [ ] Score calculation correct - YES
- [ ] Progress tracking - YES
- [ ] Save results - YES
- [ ] Results persist - YES

#### Module Completion

- [ ] Module marked as completed - YES
- [ ] Progress updates - YES
- [ ] Analytics recorded - YES
- [ ] Can retake quiz - YES
- [ ] Previous scores visible - YES

---

## 7. 🔧 Configuration Reference

### aiConfig.js Settings

```javascript
// src/config/aiConfig.js
export const aiConfig = {
  apiService: {
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
    apiKey: process.env.REACT_APP_AI_API_KEY,
    provider: "gemini", // or 'local'
    timeout: 30000, // 30 seconds
  },
  localService: {
    quiz: {
      numQuestions: 5,
      maxRetries: 3,
      delay: 1000,
    },
  },
  modelParameters: {
    temperature: 0.7,
    maxTokens: 2048,
  },
};
```

### Environment Variables Required

```bash
# .env or .env.local
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_AI_API_KEY=your_api_key_here
REACT_APP_GEMINI_API_KEY=your_gemini_key_here
```

---

## 8. 🚀 Optimization Tips

### Performance

1. **Lazy Load Modules**

   - Load only visible modules
   - Pagination for large lists

2. **Cache Quiz Questions**

   - Store generated quizzes
   - Reuse if user retakes

3. **Optimize Text Extraction**
   - Stream large files
   - Process in chunks

### User Experience

1. **Clear Progress Indicators**

   - Show upload progress
   - Quiz progress percentage
   - Estimated time

2. **Helpful Error Messages**

   - Specific problem description
   - Suggested solutions
   - Retry options

3. **Offline Support**
   - Cache downloaded modules
   - Work offline capability
   - Sync when online

---

## 9. 📝 Common Issues & Solutions

### Issue 1: Empty Quiz Generated

**Problem:** Module uploaded but no quiz questions created

**Solution:**

```javascript
// Ensure text has enough content
if (sentences.length < 3) {
  // Use fallback quiz
  const fallbackQuiz = createBasicQuiz(text);
}
```

### Issue 2: Quiz Not Saving

**Problem:** Quiz completed but not saved to progress

**Solution:**

```javascript
// Verify completeQuiz is called
completeQuiz(moduleId, score);
// Check localStorage after
const progress = JSON.parse(localStorage.getItem("userProgress"));
```

### Issue 3: PDF Extraction Fails

**Problem:** PDF text extraction returns empty string

**Solution:**

```javascript
// Check if PDF is image-based
const textContent = await extractTextFromFile(file);
if (!textContent) {
  throw new Error("PDF file must contain extractable text");
}
```

### Issue 4: Module Deleted But Quiz Remains

**Problem:** Data inconsistency after deletion

**Solution:**

```javascript
// In deleteModule function
export const deleteModule = (moduleId) => {
  const modules = JSON.parse(localStorage.getItem("modules") || "[]");
  const quizzes = JSON.parse(localStorage.getItem("quizzes") || "{}");
  const summaries = JSON.parse(localStorage.getItem("summaries") || "{}");

  // Delete from all locations
  const filteredModules = modules.filter((m) => m.id !== moduleId);
  delete quizzes[moduleId];
  delete summaries[moduleId];

  localStorage.setItem("modules", JSON.stringify(filteredModules));
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  localStorage.setItem("summaries", JSON.stringify(summaries));
};
```

---

## 10. 📞 Support & Documentation

### Related Files

- `src/components/UploadModule.js` - Upload interface
- `src/utils/fileExtractor.js` - File text extraction
- `src/utils/textAnalyzer.js` - Quiz generation
- `src/utils/aiSummaryGenerator.js` - Summary creation
- `src/utils/quizStorage.js` - Data persistence
- `src/pages/QuizPage.js` - Quiz interface
- `src/context/UserContext.js` - User progress tracking

### Key Functions

```javascript
// Extract text from file
extractTextFromFile(file) → Promise<string>

// Generate quiz questions
generateQuizFromText(text) → Promise<Array>

// Generate AI summary
generateSummaryFromText(text, profile) → Promise<Object>

// Save quiz
saveQuiz(quizData, moduleId) → void

// Load quiz
loadQuiz(moduleId) → Array

// Save module info
saveModuleInfo(moduleInfo) → void

// Load all modules
loadAllModules() → Array

// Delete module (all associated data)
deleteModule(moduleId) → void
```

---

## 11. ✨ Best Practices

1. **Always validate inputs**

   - Check file before processing
   - Validate extracted text
   - Verify quiz structure

2. **Use try-catch blocks**

   - Handle extraction errors
   - Handle API errors
   - Provide user feedback

3. **Implement fallbacks**

   - AI → Local generation
   - Network → Cache
   - Invalid data → Defaults

4. **Test edge cases**

   - Empty files
   - Large files
   - Unsupported formats
   - Network failures

5. **Log errors properly**
   - console.error for debugging
   - User-friendly messages
   - Store error logs

---

## 📌 Summary

**Setiap modul yang di-upload dijamin akan:**

✅ **Berhasil diproses** melalui validasi yang ketat  
✅ **Membuat kuis yang valid** dengan fallback mechanisms  
✅ **Menyimpan data dengan aman** di localStorage  
✅ **Dapat diselesaikan sepenuhnya** dengan tracking progress  
✅ **Memberikan feedback yang jelas** kepada pengguna  
✅ **Menangani error dengan baik** tanpa crash aplikasi

**Dengan mengikuti panduan ini, sistem ELARA App akan:**

- ✨ Memberikan pengalaman pengguna yang seamless
- 🛡️ Robust terhadap berbagai kegagalan
- 📊 Akurat dalam tracking progress
- 🚀 Scalable untuk pertumbuhan future
