# MODULE UPLOAD & QUIZ TESTING CHECKLIST

Gunakan dokumen ini untuk memastikan setiap modul yang di-upload dapat diselesaikan dan membuat kuis dengan baik.

---

## 📋 TESTING MATRIX

### 1. FILE UPLOAD VALIDATION

#### Test 1.1: Valid PDF Upload

- **Setup:** Siapkan file PDF dengan konten teks lengkap (500+ kata)
- **Steps:**
  - [ ] Buka halaman Upload Modul
  - [ ] Drag & drop file PDF atau klik untuk upload
  - [ ] Klik tombol "Upload & Buat Quiz"
- **Expected Results:**

  - [ ] Progress bar tampil dan mencapai 100%
  - [ ] Tidak ada error message
  - [ ] ModuleQualityFeedback tampil dengan status positif
  - [ ] Success message "Modul berhasil diupload!"
  - [ ] Modul muncul di daftar modul dengan quiz count
  - [ ] localStorage['modules'] berisi modul baru
  - [ ] localStorage['quizzes'] berisi quiz dengan 5+ pertanyaan

- **Notes:** **********************\_\_\_**********************

---

#### Test 1.2: Valid DOCX Upload

- **Setup:** Siapkan file DOCX dengan konten teks lengkap
- **Steps:**
  - [ ] Upload file DOCX
  - [ ] Tunggu processing selesai
- **Expected Results:**

  - [ ] Proses sama seperti PDF
  - [ ] Teks berhasil diekstrak
  - [ ] Kuis dibuat dengan baik
  - [ ] Module info tersimpan dengan benar

- **Notes:** **********************\_\_\_**********************

---

#### Test 1.3: Valid TXT Upload

- **Setup:** Siapkan file TXT dengan konten teks
- **Steps:**
  - [ ] Upload file TXT
  - [ ] Verifikasi hasil
- **Expected Results:**

  - [ ] Upload berhasil
  - [ ] Kuis dibuat dari konten TXT
  - [ ] Semua data tersimpan

- **Notes:** **********************\_\_\_**********************

---

#### Test 1.4: Empty File Upload

- **Setup:** Buat file kosong (0 bytes)
- **Steps:**
  - [ ] Coba upload file kosong
  - [ ] Lihat error handling
- **Expected Results:**

  - [ ] Error message: "Tidak dapat mengekstrak teks dari file"
  - [ ] Upload gagal dengan jelas
  - [ ] Tidak ada module yang dibuat
  - [ ] User dapat retry

- **Notes:** **********************\_\_\_**********************

---

#### Test 1.5: Minimal Content Upload

- **Setup:** File dengan minimal konten (50-100 kata)
- **Steps:**
  - [ ] Upload file dengan sedikit konten
  - [ ] Perhatikan warning/quality feedback
- **Expected Results:**

  - [ ] Upload tetap berhasil
  - [ ] Quality feedback menunjukkan peringatan
  - [ ] Score kualitas 60-75%
  - [ ] Warning tentang konten minimal tampil

- **Notes:** **********************\_\_\_**********************

---

#### Test 1.6: Image-Based PDF Upload

- **Setup:** File PDF yang hanya berisi gambar/scan
- **Steps:**
  - [ ] Upload PDF scan/gambar
  - [ ] Lihat error handling
- **Expected Results:**

  - [ ] Jika ada minimal OCR teks: tetap upload dengan warning
  - [ ] Jika tanpa teks sama sekali: error yang jelas
  - [ ] Warning: "File mungkin berbasis gambar"

- **Notes:** **********************\_\_\_**********************

---

#### Test 1.7: Unsupported File Format

- **Setup:** File dengan format tidak didukung (.xlsx, .ppt, .jpg)
- **Steps:**
  - [ ] Coba upload file tidak support
  - [ ] Lihat validasi format
- **Expected Results:**

  - [ ] Upload diblokir
  - [ ] Error: "Format file tidak didukung"
  - [ ] Hanya PDF, DOCX, DOC, TXT yang diterima

- **Notes:** **********************\_\_\_**********************

---

### 2. TEXT EXTRACTION VALIDATION

#### Test 2.1: Text Extraction from PDF

- **Setup:** PDF dengan teks yang jelas
- **Steps:**
  - [ ] Upload PDF
  - [ ] Check extracted text quality
- **Expected Results:**

  - [ ] Teks diekstrak dengan akurat
  - [ ] Formatting dipahami
  - [ ] Tidak ada karakter aneh

- **Monitor:**

  ```javascript
  // In browser console:
  console.log(localStorage.getItem("modules")); // Check module saved
  const quizzes = JSON.parse(localStorage.getItem("quizzes"));
  console.log(quizzes[moduleId]); // Check quiz created
  ```

- **Notes:** **********************\_\_\_**********************

---

#### Test 2.2: Text Extraction from DOCX

- **Setup:** DOCX dengan berbagai formatting
- **Steps:**
  - [ ] Upload DOCX dengan bullet points, heading, dsb
  - [ ] Verifikasi extraction
- **Expected Results:**

  - [ ] Semua teks diekstrak
  - [ ] Struktur dokumen dipahami
  - [ ] Kuis dibuat dengan konteks yang tepat

- **Notes:** **********************\_\_\_**********************

---

#### Test 2.3: Unicode & Special Characters

- **Setup:** File dengan karakter khusus (ü, ñ, 中文, dsb)
- **Steps:**
  - [ ] Upload file dengan karakter spesial
  - [ ] Check kuis generation
- **Expected Results:**

  - [ ] Karakter diekstrak dengan benar
  - [ ] Tidak ada encoding issues
  - [ ] Kuis readable

- **Notes:** **********************\_\_\_**********************

---

### 3. QUIZ GENERATION VALIDATION

#### Test 3.1: Quiz Generation from Good Content

- **Setup:** File dengan konten berkualitas tinggi
- **Steps:**
  - [ ] Upload file
  - [ ] Verifikasi kuis yang dibuat
- **Expected Results:**

  - [ ] 5-10 pertanyaan dibuat
  - [ ] Semua pertanyaan relevan dengan konten
  - [ ] 4 opsi per pertanyaan
  - [ ] Jawaban jelas dan valid
  - [ ] Penjelasan detail ada
  - [ ] Quality score >= 75%

- **Check Quiz Quality:**

  ```javascript
  const quizzes = JSON.parse(localStorage.getItem("quizzes"));
  const quiz = quizzes[moduleId];

  quiz.forEach((q, idx) => {
    console.log(`Q${idx + 1}:`, {
      question: q.question.substring(0, 50) + "...",
      options: q.options.length,
      answer: q.answer,
      hasExplanation: !!q.explanation,
    });
  });
  ```

- **Notes:** **********************\_\_\_**********************

---

#### Test 3.2: Quiz Generation with Limited Content

- **Setup:** File dengan konten terbatas
- **Steps:**
  - [ ] Upload file minimal
  - [ ] Check kuis yang dibuat
- **Expected Results:**

  - [ ] Minimal 5 pertanyaan tetap dibuat
  - [ ] Quality score 60-75%
  - [ ] Warning tentang konten minimal
  - [ ] Fallback mechanism bekerja

- **Notes:** **********************\_\_\_**********************

---

#### Test 3.3: AI vs Local Quiz Generation

- **Setup:** Test kedua mechanism
- **Steps:**
  - [ ] Upload dengan API available → check AI generated
  - [ ] Upload dengan API down → check fallback
- **Expected Results:**

  - [ ] AI: Kuis lebih relevan dengan konten
  - [ ] Fallback: Kuis default tetap valid
  - [ ] Transition seamless, user tidak tahu bedanya

- **Notes:** **********************\_\_\_**********************

---

#### Test 3.4: Quiz Answer Validity

- **Setup:** Kuis yang sudah dibuat
- **Steps:**
  - [ ] Verifikasi jawaban berada dalam opsi
  - [ ] Check bahwa jawaban benar dalam opsi yang diberikan
- **Expected Results:**

  - [ ] Semua jawaban ada dalam opsi (100%)
  - [ ] Tidak ada missing references
  - [ ] Index jawaban valid (0-3)

- **Validation Code:**

  ```javascript
  const quizzes = JSON.parse(localStorage.getItem("quizzes"));
  const quiz = quizzes[moduleId];

  const isValid = quiz.every((q) => {
    return q.options.includes(q.answer);
  });

  console.log("All answers valid:", isValid ? "✅" : "❌");
  ```

- **Notes:** **********************\_\_\_**********************

---

### 4. MODULE COMPLETION FLOW

#### Test 4.1: Start Quiz from Module List

- **Setup:** Module sudah diupload
- **Steps:**
  - [ ] Go to Modul page
  - [ ] Click "Mulai Kuis" button
- **Expected Results:**

  - [ ] Navigate ke Quiz page
  - [ ] Quiz loaded dengan pertanyaan
  - [ ] First question displayed
  - [ ] All 4 options visible

- **Notes:** **********************\_\_\_**********************

---

#### Test 4.2: Complete Full Quiz

- **Setup:** Start quiz dari modul
- **Steps:**
  - [ ] Answer semua pertanyaan (all correct)
  - [ ] Submit quiz
- **Expected Results:**

  - [ ] Score calculation correct (100%)
  - [ ] Results screen shown
  - [ ] "Kuis Selesai!" message
  - [ ] Trophy icon displayed
  - [ ] Navigation options visible

- **Notes:** **********************\_\_\_**********************

---

#### Test 4.3: Partial Correct Answers

- **Setup:** Answer quiz with mixed correct/incorrect
- **Steps:**
  - [ ] Answer 3 correct, 2 incorrect dari 5 questions
  - [ ] Submit
- **Expected Results:**

  - [ ] Score = 3/5 = 60%
  - [ ] Feedback message sesuai score
  - [ ] Answer review tersedia
  - [ ] Progress updated

- **Notes:** **********************\_\_\_**********************

---

#### Test 4.4: Review Quiz Answers

- **Setup:** Quiz sudah selesai
- **Steps:**
  - [ ] Click "Review" atau lihat hasil
  - [ ] Verify answer display
- **Expected Results:**

  - [ ] Semua jawaban ditampilkan
  - [ ] User answer vs correct answer jelas
  - [ ] Explanation visible
  - [ ] Dapat scroll/navigate

- **Notes:** **********************\_\_\_**********************

---

#### Test 4.5: Retake Quiz

- **Setup:** Quiz sudah diambil sebelumnya
- **Steps:**
  - [ ] Go back ke module list
  - [ ] Click "Ulang Kuis"
- **Expected Results:**

  - [ ] Quiz fresh start
  - [ ] Score reset
  - [ ] Previous score masih terlihat (optional)
  - [ ] Dapat jawab ulang dengan berbeda

- **Notes:** **********************\_\_\_**********************

---

### 5. DATA PERSISTENCE VALIDATION

#### Test 5.1: Module Info Saved

- **Setup:** Module uploaded
- **Steps:**
  - [ ] Refresh page (F5)
  - [ ] Check module still exists
- **Expected Results:**

  - [ ] Module muncul di list setelah refresh
  - [ ] Semua info intact
  - [ ] File tidak perlu diupload ulang

- **Check:**

  ```javascript
  const modules = JSON.parse(localStorage.getItem("modules"));
  console.log("Modules after refresh:", modules.length);
  ```

- **Notes:** **********************\_\_\_**********************

---

#### Test 5.2: Quiz Saved

- **Setup:** Quiz generated
- **Steps:**
  - [ ] Refresh page
  - [ ] Start quiz lagi
- **Expected Results:**

  - [ ] Kuis yang sama loaded
  - [ ] Pertanyaan identik
  - [ ] Data tidak hilang

- **Notes:** **********************\_\_\_**********************

---

#### Test 5.3: Progress Tracking

- **Setup:** Quiz completed
- **Steps:**
  - [ ] Complete quiz dengan score
  - [ ] Refresh page
  - [ ] Check module status
- **Expected Results:**

  - [ ] Quiz status: completed
  - [ ] Score tersimpan
  - [ ] "Ulang Kuis" button muncul
  - [ ] Modul marked as completed

- **Check:**

  ```javascript
  const progress = JSON.parse(localStorage.getItem("userProgress"));
  console.log("Completed modules:", progress.modulesCompleted);
  console.log("Quiz scores:", progress.scores);
  ```

- **Notes:** **********************\_\_\_**********************

---

### 6. ERROR HANDLING VALIDATION

#### Test 6.1: Network Timeout

- **Setup:** Slow network
- **Steps:**
  - [ ] Throttle network (DevTools → Network → Slow 3G)
  - [ ] Upload file
  - [ ] Wait for timeout
- **Expected Results:**

  - [ ] After 30 seconds: fallback ke local quiz
  - [ ] User notified
  - [ ] Quiz tetap dibuat
  - [ ] Upload continues

- **Notes:** **********************\_\_\_**********************

---

#### Test 6.2: API Failure

- **Setup:** API endpoint down
- **Steps:**
  - [ ] Stop API server
  - [ ] Try upload
- **Expected Results:**

  - [ ] AI quiz generation fails
  - [ ] Fallback to local generation
  - [ ] Quiz tetap dibuat valid
  - [ ] User tidak tahu ada fallback

- **Notes:** **********************\_\_\_**********************

---

#### Test 6.3: Storage Quota Exceeded

- **Setup:** Fill localStorage to near limit
- **Steps:**
  - [ ] Upload large file
  - [ ] Try save data
- **Expected Results:**

  - [ ] Error caught
  - [ ] User-friendly message
  - [ ] Option to clear cache
  - [ ] Graceful degradation

- **Notes:** **********************\_\_\_**********************

---

#### Test 6.4: Corrupted Module Data

- **Setup:** Manually corrupt localStorage
- **Steps:**
  - [ ] Go to DevTools → Application → LocalStorage
  - [ ] Edit modules JSON to be invalid
  - [ ] Try load page
- **Expected Results:**

  - [ ] Error handled
  - [ ] User notified
  - [ ] Option to reload/recover
  - [ ] App doesn't crash

- **Notes:** **********************\_\_\_**********************

---

### 7. UI/UX VALIDATION

#### Test 7.1: Progress Indicator Accuracy

- **Setup:** Upload file
- **Steps:**
  - [ ] Watch progress bar
  - [ ] Track % increase timing
- **Expected Results:**

  - [ ] Progress bar visible
  - [ ] Updates smoothly
  - [ ] Reaches 100% at completion
  - [ ] Estimated time helpful

- **Notes:** **********************\_\_\_**********************

---

#### Test 7.2: Error Messages Clarity

- **Setup:** Trigger various errors
- **Steps:**
  - [ ] Upload empty file
  - [ ] Upload wrong format
  - [ ] Upload large file
  - [ ] Check error messages
- **Expected Results:**

  - [ ] Each error has clear message
  - [ ] Explains the problem
  - [ ] Suggests solution
  - [ ] Not technical jargon

- **Examples:**

  - ✅ "File hanya berisi gambar. Gunakan PDF dengan teks yang dapat diekstrak."
  - ❌ "Error: null value at index 0"

- **Notes:** **********************\_\_\_**********************

---

#### Test 7.3: Quality Feedback Display

- **Setup:** Upload file with validation
- **Steps:**
  - [ ] Upload various quality files
  - [ ] Check ModuleQualityFeedback
- **Expected Results:**

  - [ ] Good quality → Green ✅
  - [ ] Fair quality → Yellow ⚠️
  - [ ] Poor quality → Red/Orange ❌
  - [ ] Score displayed
  - [ ] Metrics visible

- **Notes:** **********************\_\_\_**********************

---

#### Test 7.4: Mobile Responsiveness

- **Setup:** Test on mobile device
- **Steps:**
  - [ ] Open app on smartphone
  - [ ] Try upload file
  - [ ] Complete quiz
- **Expected Results:**

  - [ ] UI fits screen
  - [ ] Buttons clickable
  - [ ] Text readable
  - [ ] No layout breaks

- **Notes:** **********************\_\_\_**********************

---

## 🎯 FINAL CHECKLIST

### Before Going Live

- [ ] All 7 test categories passed
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Mobile works
- [ ] Error messages clear
- [ ] Documentation complete
- [ ] Code commented
- [ ] No console errors

### Ongoing Monitoring

- [ ] Monitor upload success rate
- [ ] Track quiz completion rate
- [ ] Check error logs
- [ ] Monitor quality scores
- [ ] Gather user feedback
- [ ] Performance metrics

---

## 📊 TEST RESULTS SUMMARY

| Test Category     | Status | Notes | Date |
| ----------------- | ------ | ----- | ---- |
| File Upload       | ⬜     |       |      |
| Text Extraction   | ⬜     |       |      |
| Quiz Generation   | ⬜     |       |      |
| Module Completion | ⬜     |       |      |
| Data Persistence  | ⬜     |       |      |
| Error Handling    | ⬜     |       |      |
| UI/UX             | ⬜     |       |      |

Legend: ⬜ = Not tested | ✅ = Passed | ⚠️ = Warning | ❌ = Failed

---

## 🐛 BUG REPORTS

### Bug #1

- **Description:** **************\_\_\_\_**************
- **Steps to Reproduce:** **************\_\_\_\_**************
- **Expected:** **************\_\_\_\_**************
- **Actual:** **************\_\_\_\_**************
- **Severity:** Critical / High / Medium / Low
- **Status:** Open / In Progress / Fixed

---

### Bug #2

- **Description:** **************\_\_\_\_**************
- **Steps to Reproduce:** **************\_\_\_\_**************
- **Expected:** **************\_\_\_\_**************
- **Actual:** **************\_\_\_\_**************
- **Severity:** Critical / High / Medium / Low
- **Status:** Open / In Progress / Fixed

---

## 📝 NOTES & OBSERVATIONS

General observations during testing:

---

---

---

---

## ✅ Sign-Off

- **Tested By:** ********\_******** **Date:** ****\_****
- **Reviewed By:** ********\_******** **Date:** ****\_****
- **Approved By:** ********\_******** **Date:** ****\_****

**Status:** ⬜ Ready / ✅ Ready for Production / ❌ Not Ready

---

_Keep this checklist updated as you test and deploy the system._
