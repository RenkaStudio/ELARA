// utils/aiSummaryGenerator.js
import { analyzePDFContent } from './geminiAI';

/**
 * Generates a summary of the given text using the configured AI provider.
 * @param {string} text - The text to summarize.
 * @param {Object} learningProfile - Optional learning profile to customize summary
 * @returns {Promise<Object>} - The generated summary object with additional metadata
 */
export const generateSummaryFromText = async (text, learningProfile = null) => {
  try {
    // Use the new Gemini utility for PDF content analysis
    const analysis = await analyzePDFContent(text, learningProfile);
    
    // Return a comprehensive summary object with all metadata
    return {
      summary: analysis.summary,
      learningStyleSummary: analysis.learningStyleSummary,
      keyTopics: analysis.keyTopics,
      difficulty: analysis.difficulty,
      estimatedTime: analysis.estimatedTime,
      learningObjectives: analysis.learningObjectives
    };
  } catch (error) {
    console.error('Error in generateSummaryFromText:', error);
    // Fallback to basic summary if AI fails
    const basicSummary = text.substring(0, 250) + (text.length > 250 ? '...' : '');
    return {
      summary: `(Analisis AI Gagal) Ringkasan: ${basicSummary}`,
      learningStyleSummary: `(Analisis AI Gagal) Ringkasan: ${basicSummary}`,
      keyTopics: ["Analisis AI Gagal"],
      difficulty: "tidak dapat ditentukan",
      estimatedTime: "tidak dapat ditentukan",
      learningObjectives: ["Tidak dapat mengekstrak tujuan pembelajaran"]
    };
  }
};

/**
 * Saves the summary to local storage.
 * @param {string} moduleId - The module ID.
 * @param {Object} summary - The summary object.
 */
export const saveSummary = (moduleId, summary) => {
  try {
    const summaries = JSON.parse(localStorage.getItem('summaries') || '{}');
    summaries[moduleId] = summary;
    localStorage.setItem('summaries', JSON.stringify(summaries));
  } catch (error) {
    console.error("Failed to save summary to localStorage:", error);
  }
};

/**
 * Loads the summary for a module.
 * @param {string} moduleId - The module ID.
 * @returns {Object | string | null} - The summary object or string, or null if not found.
 */
export const loadSummary = (moduleId) => {
  try {
    const summaries = JSON.parse(localStorage.getItem('summaries') || '{}');
    return summaries[moduleId] || null;
  } catch (error) {
    console.error("Failed to load summary from localStorage:", error);
    return null;
  }
};