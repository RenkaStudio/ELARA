// utils/textAnalyzer.js
import { aiConfig } from '../config/aiConfig';

/**
 * Analyzes text and generates quiz questions using external API or local simulation
 * @param {string} text - The text to analyze
 * @returns {Promise<Array>} - Array of quiz questions with options and answers
 */
export const generateQuizFromText = async (text) => {
  try {
    // If using external API
    if (aiConfig.apiService.provider !== 'local' && aiConfig.apiService.apiKey) {
      return await generateQuizFromExternalAPI(text);
    } else {
      // Fallback to local simulation
      return await generateQuizLocally(text);
    }
  } catch (error) {
    console.error('Error in generateQuizFromText:', error);
    // Fallback to local simulation on any error
    return await generateQuizLocally(text);
  }
};

/**
 * Generates quiz using external AI API
 * @param {string} text - The text to analyze
 * @returns {Promise<Array>} - Array of quiz questions with options and answers
 */
const generateQuizFromExternalAPI = async (text) => {
  const maxRetries = aiConfig.localService.quiz.maxRetries;
  let lastError;

  // Ensure baseURL is properly set
  const baseURL = aiConfig.apiService.baseURL || 'http://localhost:3001/api';
  
  // Validate baseURL
  if (!baseURL || baseURL === 'undefined') {
    console.error('Invalid baseURL configuration:', baseURL);
    throw new Error('Invalid baseURL configuration');
  }
  
  console.log('Using API base URL:', baseURL); // Debug log
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), aiConfig.apiService.timeout || 30000);
      
      const response = await fetch(`${baseURL}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiService.apiKey}`,
        },
        body: JSON.stringify({
          text: text,
          num_questions: aiConfig.localService.quiz.numQuestions,
          model_params: aiConfig.modelParameters
        }),
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.questions || data.quiz || [];
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed to call external API:`, error);
      lastError = error;
      
      // If the error is due to network issues, fallback immediately
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.warn('Network error detected, falling back to local generation immediately');
        break; // Break out of retry loop for network errors
      }
      
      // If the error is due to abort (timeout), throw immediately
      if (error.name === 'AbortError') {
        throw new Error('API request timed out');
      }
      
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  console.warn(`All ${maxRetries} attempts to call external API failed. Throwing error to trigger fallback.`);
  throw lastError;
};

/**
 * Generates quiz using local algorithm (fallback)
 * @param {string} text - The text to analyze
 * @returns {Promise<Array>} - Array of quiz questions with options and answers
 */
const generateQuizLocally = async (text) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, aiConfig.localService.quiz.delay || 1000));
  
  // Split the text into sentences
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  
  // Jika tidak ada kalimat yang cukup panjang, gunakan seluruh teks
  if (sentences.length === 0) {
    sentences.push(text);
  }
  
  // Generate quiz questions based on the sentences
  const quizQuestions = [];
  const numQuestions = Math.min(aiConfig.localService.quiz.numQuestions || 5, sentences.length);
  
  for (let i = 0; i < numQuestions; i++) {
    const sentence = sentences[i] || sentences[0]; // Gunakan kalimat pertama jika indeks tidak valid
    const words = sentence.trim().split(/\s+/).filter(word => word.length > 3);
    
    // Jika tidak ada kata yang cukup panjang, lewati kalimat ini
    if (words.length < 4) {
      continue;
    }
    
    // Pilih kata acak sebagai jawaban
    const answerIndex = Math.floor(Math.random() * words.length);
    const answer = words[answerIndex];
    
    // Escape special regex characters in the answer to avoid invalid regex
    const escapedAnswer = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Buat pertanyaan dengan mengganti kata jawaban dengan '...'
    const questionText = sentence.replace(new RegExp('\\b' + escapedAnswer + '\\b', 'gi'), '...');
    
    // Buat opsi jawaban
    const options = [answer];
    
    // Tambahkan 3 opsi jawaban palsu
    while (options.length < 4 && words.length > options.length) {
      const randomIndex = Math.floor(Math.random() * words.length);
      if (!options.includes(words[randomIndex])) {
        options.push(words[randomIndex]);
      }
    }
    
    // Jika masih kurang dari 4 opsi, tambahkan opsi placeholder
    while (options.length < 4) {
      options.push(`Opsi ${options.length + 1}`);
    }
    
    // Acak urutan opsi
    for (let j = options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [options[j], options[k]] = [options[k], options[j]];
    }
    
    quizQuestions.push({
      id: i + 1,
      question: questionText.trim() + '?',
      options: options,
      answer: answer
    });
  }
  
  // Jika tidak ada pertanyaan yang berhasil dibuat, buat pertanyaan placeholder
  if (quizQuestions.length === 0) {
    quizQuestions.push({
      id: 1,
      question: 'Apa topik utama dokumen ini?',
      options: ['Topik 1', 'Topik 2', 'Topik 3', 'Topik 4'],
      answer: 'Topik 1'
    });
  }
  
  // Tambahkan pertanyaan placeholder jika jumlahnya kurang dari yang diharapkan
  while (quizQuestions.length < (aiConfig.localService.quiz.numQuestions || 5)) {
    const index = quizQuestions.length;
    quizQuestions.push({
      id: index + 1,
      question: `Pertanyaan tambahan ${index + 1} tentang isi dokumen`,
      options: [`Opsi A${index + 1}`, `Opsi B${index + 1}`, `Opsi C${index + 1}`, `Opsi D${index + 1}`],
      answer: `Opsi A${index + 1}`
    });
  }
  
  return quizQuestions;
};