# ⚡ QUICK REFERENCE CARD - Module System

**Print this for quick lookup during development!**

---

## 📦 FILES TO KNOW

| File                     | Location        | Purpose           | Lines |
| ------------------------ | --------------- | ----------------- | ----- |
| moduleValidator.js       | src/utils/      | Validation logic  | 500   |
| ModuleQualityFeedback.js | src/components/ | Display component | 200   |
| UploadModule.js          | src/components/ | (MODIFY)          | -     |

---

## 🎯 INTEGRATION IN 3 STEPS

### Step 1: Import

```javascript
import { validateCompleteModule } from "../utils/moduleValidator";
import ModuleQualityFeedback from "./ModuleQualityFeedback";
```

### Step 2: Add State

```javascript
const [validationResult, setValidationResult] = useState(null);
const [showQualityFeedback, setShowQualityFeedback] = useState(false);
```

### Step 3: Validate in handleUpload()

```javascript
const validation = validateCompleteModule({
  textContent,
  quiz: quizQuestions,
  moduleInfo,
});

if (!validation.readyForUpload) {
  throw new Error("Validasi gagal");
}
```

### Step 4: Display

```javascript
{
  showQualityFeedback && validationResult && (
    <ModuleQualityFeedback validationResult={validationResult} />
  );
}
```

---

## 🔍 VALIDATOR FUNCTIONS

### validateCompleteModule(data)

**Main validator - use this!**

```javascript
const result = validateCompleteModule({
  textContent: string,
  quiz: array,
  moduleInfo: object
});

// Returns:
{
  isValid: boolean,
  errors: string[],
  warnings: string[],
  readyForUpload: boolean,
  overallQuality: 0-100,
  validation: {
    text: {...},
    quiz: {...},
    info: {...}
  }
}
```

### validateTextContent(text)

**Check extracted text**

```javascript
const result = validateTextContent(textContent);
// Returns: { isValid, errors, warnings, metrics }
```

### validateQuizQuestions(questions)

**Check quiz structure**

```javascript
const result = validateQuizQuestions(quizArray);
// Returns: { isValid, errors, warnings, score, qualityPercentage }
```

---

## 🎯 QUALITY SCORE RANGES

| Range    | Status    | Color     | Icon |
| -------- | --------- | --------- | ---- |
| 90-100   | Excellent | 🟢 Green  | ✅   |
| 75-89    | Good      | 🔵 Blue   | ✅   |
| 60-74    | Fair      | 🟡 Yellow | ⚠️   |
| <60      | Poor      | 🟠 Orange | ⚠️   |
| + Errors | Invalid   | 🔴 Red    | ❌   |

---

## ❌ ERROR MESSAGES USERS SEE

| Error                    | When           | Solution            |
| ------------------------ | -------------- | ------------------- |
| "File kosong"            | Empty file     | Use non-empty file  |
| "File berbasis gambar"   | PDF is scanned | Use text-based PDF  |
| "Konten terlalu sedikit" | <100 words     | Add more content    |
| "Terjadi timeout"        | Network slow   | Retry, smaller file |
| "Data tidak valid"       | Corrupted file | Try different file  |

---

## 📊 TEST CHECKLIST (Quick)

- [ ] Upload PDF (500+ words) → Success ✅
- [ ] Upload empty file → Error ❌
- [ ] Upload image PDF → Warning ⚠️
- [ ] Complete quiz → Score saved ✅
- [ ] Refresh page → Data persists ✅
- [ ] Mobile responsive → Works ✅

---

## 🛠️ DEBUG COMMANDS

```javascript
// Check all modules
JSON.parse(localStorage.getItem("modules")).length;

// Check quiz count
const quizzes = JSON.parse(localStorage.getItem("quizzes"));
Object.keys(quizzes).length;

// Validate specific quiz
const quiz = quizzes[moduleId];
quiz.every((q) => q.options.length === 4); // Should be true

// Check user progress
JSON.parse(localStorage.getItem("userProgress"));

// Clear cache (if needed)
localStorage.clear();
```

---

## 📚 DOCUMENTATION MAP

```
START HERE
    ↓
README_MODULE_SYSTEM.md (overview)
    ↓
    ├─→ Need architecture? → MODULE_COMPLETION_GUIDE.md
    ├─→ Ready to code? → INTEGRATION_GUIDE.md
    ├─→ Ready to test? → TESTING_CHECKLIST.md
    └─→ Quick lookup? → This card!
```

---

## ✅ INTEGRATION CHECKLIST

- [ ] Copy moduleValidator.js to src/utils/
- [ ] Copy ModuleQualityFeedback.js to src/components/
- [ ] Add imports to UploadModule.js
- [ ] Add state for validation
- [ ] Add validation in handleUpload()
- [ ] Add component to JSX
- [ ] Test upload with good file
- [ ] Test upload with bad file
- [ ] Verify error messages
- [ ] Check localStorage data
- [ ] Test quiz completion
- [ ] Test on mobile
- [ ] ✅ Ready!

---

## 🔴 COMMON MISTAKES

```javascript
// ❌ DON'T: Call validator without proper error handling
const validation = validateCompleteModule(data);
saveModule(data); // Could fail!

// ✅ DO: Check validation first
const validation = validateCompleteModule(data);
if (!validation.readyForUpload) {
  throw new Error(validation.errors.join(", "));
}
saveModule(data);

// ❌ DON'T: Show raw error to user
alert("Error: null value at index 0");

// ✅ DO: Show friendly message
alert("❌ File tidak dapat diproses. Coba file lain.");

// ❌ DON'T: Forget error handling
const quiz = await generateQuiz(text);
setQuiz(quiz); // Could fail!

// ✅ DO: Always have try-catch
try {
  const quiz = await generateQuiz(text);
  setQuiz(quiz);
} catch (error) {
  console.error(error);
  setQuiz(fallbackQuiz);
}
```

---

## 🚀 PERFORMANCE TIPS

- Cache validation results
- Don't re-validate same file
- Use localStorage wisely (50MB limit)
- Clear old data periodically
- Optimize extraction for large files

---

## 📱 MOBILE CHECKLIST

- [ ] Buttons are 44x44px minimum
- [ ] Text is readable on small screens
- [ ] Form inputs are large enough
- [ ] No horizontal scroll needed
- [ ] Tap targets have spacing
- [ ] Works on iOS & Android

---

## 🔐 SECURITY CHECKLIST

- [ ] Validate file type (not just extension)
- [ ] Check file size (max 50MB)
- [ ] Sanitize input strings
- [ ] Validate JSON parsing
- [ ] Limit localStorage writes
- [ ] No sensitive data in storage

---

## 📈 MONITORING METRICS

```javascript
// Track upload success
totalUploads: 100
successfulUploads: 95
uploadSuccessRate: 95%

// Track quality
averageQualityScore: 78%
modulesWithExcellentQuality: 45
modulesWithPoorQuality: 5

// Track completion
quizzesStarted: 90
quizzesCompleted: 72
completionRate: 80%

// Track errors
totalErrors: 5
mostCommonError: "timeout"
errorRate: 5%
```

---

## 🎓 LEARNING RESOURCES

- React: https://react.dev
- Tailwind: https://tailwindcss.com
- localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Gemini AI: https://ai.google.dev/docs

---

## 🆘 EMERGENCY FIX GUIDE

**Quiz not generated:**

1. Check text extraction: `console.log(textContent.length)`
2. Use fallback quiz
3. Check API status

**Data not saving:**

1. Check localStorage quota
2. Clear old data
3. Check JSON structure

**Module not appearing:**

1. Check localStorage.modules
2. Refresh page
3. Check browser console

**Upload timeout:**

1. Use smaller file
2. Check network connection
3. Increase timeout value

---

## 📋 BEFORE PRODUCTION

- [ ] All tests pass (37+ tests)
- [ ] No console errors
- [ ] Error handling works
- [ ] Fallbacks work
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Documentation reviewed
- [ ] Code reviewed
- [ ] Stakeholder approval

---

## 🎯 SUCCESS INDICATORS

✅ Upload works consistently (95%+)  
✅ Quiz generated every time  
✅ No missing data  
✅ Errors handled gracefully  
✅ Users understand feedback  
✅ Mobile works  
✅ Performance is good

---

## 📞 QUICK HELP

**"How do I..."**

...add validation?
→ Follow INTEGRATION_GUIDE.md Step 3

...test everything?
→ Use TESTING_CHECKLIST.md

...understand the flow?
→ Read MODULE_COMPLETION_GUIDE.md

...debug an issue?
→ Check IMPLEMENTATION_SUMMARY.md troubleshooting

...integrate quickly?
→ Follow this Quick Reference Card!

---

## 🎉 YOU'RE READY!

This card is your pocket guide. Print it, keep it handy!

**Estimated Integration Time:** ~1 day
**Estimated Testing Time:** ~2-3 hours
**Total Effort:** ~1-2 days

**Status:** ✅ Ready to start!

---

_Last Updated: November 14, 2024_  
_Version: 1.0.0_  
_Print-Friendly: Yes_
