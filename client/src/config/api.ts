export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
  quizzes: `${API_BASE_URL}/quizzes`,
  quizResults: `${API_BASE_URL}/quiz-results`,
};