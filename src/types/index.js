// User and Authentication Types
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const SKILL_TYPES = {
  CONVERSATION: 'conversation',
  IMAGE: 'image', 
  SUMMARIZATION: 'summarization'
};

// API Response Types
export const createConversationResult = (transcript, diarization, summary) => ({
  transcript,
  diarization,
  summary
});

export const createImageResult = (description, tags, confidence) => ({
  description,
  tags: tags || [],
  confidence: confidence || 0
});

export const createSummarizationResult = (summary, keyPoints, wordCount) => ({
  summary,
  keyPoints: keyPoints || [],
  wordCount: wordCount || 0
});

export const createHistoryItem = (id, skill, inputType, inputName, result, createdAt) => ({
  id,
  skill,
  inputType,
  inputName,
  result,
  createdAt
});