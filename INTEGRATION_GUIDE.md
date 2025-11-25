# INTEGRATION GUIDE: Module Validation & Quality Feedback

## Overview

Panduan ini menjelaskan cara mengintegrasikan `moduleValidator.js` dan `ModuleQualityFeedback.js` ke dalam sistem upload modul yang sudah ada.

---

## Step 1: Import Validator in UploadModule.js

**File:** `src/components/UploadModule.js`

Tambahkan import pada baris paling atas:

```javascript
import {
  validateCompleteModule,
  getQualityMessage,
} from "../utils/moduleValidator";
import ModuleQualityFeedback from "./ModuleQualityFeedback";
```

---

## Step 2: Add Validation State

Tambahkan state untuk menyimpan validation result:

```javascript
const [validationResult, setValidationResult] = useState(null);
const [showQualityFeedback, setShowQualityFeedback] = useState(false);
```

---

## Step 3: Update handleUpload Function

Modifikasi fungsi `handleUpload` untuk menambahkan validasi:

```javascript
const handleUpload = async () => {
  if (!file) return;

  setUploadStatus("uploading");
  setProgress(10);
  setShowQualityFeedback(false);

  try {
    // Extract text from the uploaded file
    setProgress(20);
    const textContent = await extractTextFromFile(file);
    setProgress(40);

    // Check if text content is valid
    if (!textContent || textContent.trim() === "") {
      throw new Error(
        "Tidak dapat mengekstrak teks dari file. File mungkin kosong atau tidak didukung."
      );
    }

    // Generate quiz from the extracted text
    const quizQuestions = await generateQuizFromText(textContent);
    setProgress(60);

    // Validate quiz questions
    if (!quizQuestions || quizQuestions.length === 0) {
      throw new Error(
        "Tidak dapat membuat kuis dari file. Konten mungkin terlalu sedikit atau tidak sesuai."
      );
    }

    // Generate a unique module ID
    const moduleId = generateModuleId();

    // ============ NEW: COMPREHENSIVE VALIDATION ============
    const learningProfile = JSON.parse(
      localStorage.getItem("learningProfile") || "{}"
    );
    const summaryData = await generateSummaryFromText(
      textContent,
      learningProfile
    );

    const moduleInfo = {
      id: moduleId,
      title: file.name,
      uploadDate: new Date().toISOString(),
      questionCount: quizQuestions.length,
      ...summaryData,
    };

    // Validate complete module
    const validation = validateCompleteModule({
      textContent,
      quiz: quizQuestions,
      moduleInfo,
    });

    setValidationResult(validation);
    setShowQualityFeedback(true);

    // Check if validation passed
    if (!validation.readyForUpload) {
      throw new Error("Validasi gagal: " + validation.errors.join(", "));
    }
    // ======================================================

    // Save the quiz questions
    saveQuiz(quizQuestions, moduleId);

    // Generate and save summary from the extracted text
    setProgress(70);
    saveSummary(moduleId, summaryData);
    setProgress(80);

    // Save module information
    saveModuleInfo(moduleInfo);

    setProgress(100);
    setUploadStatus("success");

    // Reset after success
    setTimeout(() => {
      setFile(null);
      setUploadStatus("idle");
      setProgress(0);
      setValidationResult(null);
      setShowQualityFeedback(false);

      if (onUpload) {
        onUpload(moduleInfo);
      }
    }, 2000);
  } catch (error) {
    console.error("Upload error:", error);

    setUploadStatus("error");
    setProgress(0);

    // Show user-friendly error message
    if (error.message.includes("Validasi gagal")) {
      alert(
        "❌ " + error.message + "\n\nSilakan coba dengan file yang berbeda."
      );
    } else if (error.message.includes("timeout")) {
      alert(
        "⏱️ Upload timeout. File mungkin terlalu besar atau koneksi lambat. Silakan coba lagi."
      );
    } else {
      alert("❌ Gagal memproses modul: " + error.message);
    }
  }
};
```

---

## Step 4: Update JSX to Display Feedback

Modifikasi bagian JSX untuk menampilkan quality feedback:

```javascript
return (
  <>
    <h3 className="text-lg font-bold text-text-dark mb-2">Upload Modul</h3>
    <p className="text-text-light mb-4 text-sm">
      Format: PDF, DOCX, DOC, atau TXT
    </p>

    {/* Quality Feedback */}
    {showQualityFeedback && validationResult && (
      <div className="mb-4">
        <ModuleQualityFeedback
          validationResult={validationResult}
          showDetails={true}
        />
      </div>
    )}

    {/* ... rest of JSX remains the same ... */}

    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border-color hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input").click()}
    >
      {/* ... input dan icon ... */}
    </div>

    {/* ... file display dan progress bar ... */}

    <div className="mt-4">
      <button
        onClick={handleUpload}
        disabled={!file || uploadStatus === "uploading"}
        className={`w-full py-2 px-4 rounded-lg font-bold transition-colors text-sm ${
          !file || uploadStatus === "uploading"
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        {uploadStatus === "uploading"
          ? "Memvalidasi & Upload..."
          : "Upload & Buat Quiz"}
      </button>

      {uploadStatus === "success" && (
        <div className="mt-2 bg-success/10 text-success p-2 rounded-lg flex items-center text-xs">
          ✅ Modul berhasil diupload dengan kualitas baik!
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="mt-2 bg-danger/10 text-danger p-2 rounded-lg flex items-center text-xs">
          ❌ Gagal memproses modul. Lihat pesan di atas.
        </div>
      )}
    </div>
  </>
);
```

---

## Step 5: Update Dependencies

Pastikan semua import di `UploadModule.js` sudah lengkap:

```javascript
import React, { useState } from "react";
import { FileText, X } from "lucide-react";
import { extractTextFromFile } from "../utils/fileExtractor";
import { generateQuizFromText } from "../utils/textAnalyzer";
import {
  saveQuiz,
  saveModuleInfo,
  generateModuleId,
} from "../utils/quizStorage";
import {
  generateSummaryFromText,
  saveSummary,
} from "../utils/aiSummaryGenerator";
import { validateCompleteModule } from "../utils/moduleValidator"; // NEW
import ModuleQualityFeedback from "./ModuleQualityFeedback"; // NEW
```

---

## Step 6: Testing Scenarios

### Test Case 1: Valid Module Upload

**Langkah:**

1. Upload file PDF dengan konten teks lengkap (500+ kata)
2. Klik "Upload & Buat Quiz"

**Expected Output:**

- ✅ Progress bar menampilkan 0-100%
- ✅ ModuleQualityFeedback muncul dengan status "Kualitas Good/Excellent"
- ✅ Skor kualitas >= 75
- ✅ Tidak ada error
- ✅ Success message tampil
- ✅ Modul muncul di daftar modul

### Test Case 2: Minimal Content

**Langkah:**

1. Upload file dengan konten minimal (100-200 kata)
2. Klik "Upload & Buat Quiz"

**Expected Output:**

- ✅ Validasi tetap lolos (readyForUpload = true)
- ⚠️ Quality feedback menampilkan warning
- ⚠️ Skor kualitas 60-75 (Fair)
- ✅ Tetap berhasil upload dengan catatan

### Test Case 3: Empty File

**Langkah:**

1. Upload file kosong
2. Klik "Upload & Buat Quiz"

**Expected Output:**

- ❌ Error message: "Tidak dapat mengekstrak teks dari file"
- ❌ Upload gagal
- ❌ Modul tidak disimpan
- ✅ User dapat retry dengan file lain

### Test Case 4: Image-Based PDF

**Langkah:**

1. Upload PDF yang hanya berisi gambar (scanned)
2. Klik "Upload & Buat Quiz"

**Expected Output:**

- ⚠️ Quality feedback warning: "File mungkin berbasis gambar"
- ⚠️ Validasi tetap lolos jika ada minimal teks
- ⚠️ Skor kualitas rendah
- ✅ Tetap bisa upload dengan warning

### Test Case 5: Very Large File

**Langkah:**

1. Upload file > 50MB
2. Klik "Upload & Buat Quiz"

**Expected Output:**

- ⏱️ Upload timeout setelah 30 detik
- ❌ Error message: "Upload timeout"
- ✅ User dapat retry dengan file lebih kecil

---

## Step 7: Monitor Quality Metrics

Monitor komponen untuk memastikan validasi bekerja:

```javascript
// Di browser console, setelah upload:
JSON.parse(localStorage.getItem("modules")).forEach((module, idx) => {
  console.log(`Module ${idx + 1}:`, {
    title: module.title,
    questions: module.questionCount,
    uploadDate: module.uploadDate,
    topics: module.keyTopics?.length || 0,
  });
});

// Check quiz quality
const quizzes = JSON.parse(localStorage.getItem("quizzes") || "{}");
Object.entries(quizzes).forEach(([moduleId, quiz]) => {
  const questionCount = quiz.length;
  console.log(`Quiz ${moduleId}: ${questionCount} questions`);

  quiz.forEach((q, idx) => {
    const isValid = q.question && q.options?.length === 4 && q.answer;
    console.log(`  Q${idx + 1}: ${isValid ? "✅" : "❌"}`);
  });
});
```

---

## Step 8: Error Handling Best Practices

### Display Error Messages to User

```javascript
// In catch block:
catch (error) {
  console.error('Upload error:', error);

  // Determine error type and show appropriate message
  let errorMessage = 'Gagal memproses modul.';

  if (error.message.includes('mengekstrak teks')) {
    errorMessage = '❌ Tidak dapat mengekstrak teks dari file.\n\nPastikan file Anda:\n• Berformat PDF/DOCX/TXT\n• Mengandung teks (bukan hanya gambar)\n• Tidak rusak atau korup';
  } else if (error.message.includes('membuat kuis')) {
    errorMessage = '❌ Tidak dapat membuat kuis dari file.\n\nKonten file terlalu sedikit. Gunakan file dengan minimal 100 kata.';
  } else if (error.message.includes('timeout')) {
    errorMessage = '⏱️ Upload timeout. File terlalu besar atau koneksi lambat. Coba dengan file yang lebih kecil.';
  } else if (error.message.includes('Validasi gagal')) {
    errorMessage = '❌ ' + error.message;
  }

  alert(errorMessage);
}
```

---

## Step 9: Performance Optimization

### Caching Validation Results

```javascript
// src/utils/moduleValidator.js - Add caching
const validationCache = {};

export const validateCompleteModuleWithCache = (validationData) => {
  const cacheKey = `${validationData.textContent.length}_${validationData.quiz.length}`;

  if (validationCache[cacheKey]) {
    return validationCache[cacheKey];
  }

  const result = validateCompleteModule(validationData);
  validationCache[cacheKey] = result;

  return result;
};
```

---

## Step 10: Additional Features

### A. Detailed Quality Report

```javascript
// Create detailed report for users
export const generateQualityReport = (validationResult) => {
  const report = {
    timestamp: new Date().toISOString(),
    status: validationResult.isValid ? "PASSED" : "FAILED",
    overallScore: validationResult.overallQuality,
    errorCount: validationResult.errors.length,
    warningCount: validationResult.warnings.length,
    details: {
      text: validationResult.validation.text,
      quiz: validationResult.validation.quiz,
      info: validationResult.validation.info,
    },
  };

  return report;
};

// Save report to localStorage
const report = generateQualityReport(validationResult);
const reports = JSON.parse(localStorage.getItem("qualityReports") || "{}");
reports[moduleId] = report;
localStorage.setItem("qualityReports", JSON.stringify(reports));
```

### B. User-Friendly Quality Rating

```javascript
// In ModuleQualityFeedback.js - Add visual rating
const qualityRating = validation.quiz.score;
const stars = Math.round(qualityRating / 20); // 0-5 stars

return (
  <div className="flex items-center gap-2">
    <span>Rating:</span>
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < stars ? "text-yellow-400" : "text-gray-300"}>
        ⭐
      </span>
    ))}
    <span className="text-sm text-text-light">({qualityRating}%)</span>
  </div>
);
```

---

## Troubleshooting

### Issue 1: Validation Always Fails

- Check if moduleValidator.js is imported correctly
- Verify validateCompleteModule function is called with correct parameters
- Check browser console for error messages

### Issue 2: Quality Feedback Not Showing

- Ensure `showQualityFeedback` state is true
- Check if ModuleQualityFeedback component is imported
- Verify validationResult is not null

### Issue 3: Slow Validation

- Implement caching for repeated validations
- Move validation to web worker for large files
- Implement progressive validation (validate while extracting text)

---

## Summary Checklist

- [ ] Import validator functions and component
- [ ] Add validation state to component
- [ ] Update handleUpload with validation logic
- [ ] Display ModuleQualityFeedback in JSX
- [ ] Test with various file types
- [ ] Test with edge cases
- [ ] Monitor quality metrics
- [ ] Implement error messages
- [ ] Add performance optimizations
- [ ] Document validation rules for team

---

## References

- `src/utils/moduleValidator.js` - Validation functions
- `src/components/ModuleQualityFeedback.js` - UI component
- `src/components/UploadModule.js` - Integration point
- `MODULE_COMPLETION_GUIDE.md` - Complete documentation
