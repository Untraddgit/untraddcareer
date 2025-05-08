import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight,  AlertCircle, CheckCircle, Award, Percent } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../utils/axios';
import axios from 'axios';

// Define scholarship tiers
const SCHOLARSHIP_TIERS = [
  { minScore: 85, discount: 15 }, // 25-26 correct out of 30
  { minScore: 75, discount: 10 }, // 22-23 correct out of 30
  { minScore: 65, discount: 5 },  // 19-20 correct out of 30
];

// Function to determine scholarship eligibility
const getScholarshipDiscount = (score: number): number => {
  for (const tier of SCHOLARSHIP_TIERS) {
    if (score >= tier.minScore) {
      return tier.discount;
    }
  }
  return 0;
};

// Define quiz interface
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  branch: string;
  questions: Question[];
  timeLimit: number;
  isActive: boolean;
}

const ScholarshipTest = () => {
  const { user } = useUser();
  const { getToken, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Test instructions states
  const [showInstructions, setShowInstructions] = useState(true);
  const [collegeName, setCollegeName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [testCode, setTestCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    // Get user's branch from profile - only needed when not showing instructions
    if (!showInstructions) {
      fetchUserProfile();
    }
  }, [isLoaded, user, showInstructions]);

  const fetchUserProfile = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/api/user-profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id }
      });
      
      if (response.data?.branch) {
        await fetchQuiz(response.data.branch);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If profile not found, create a default one
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        try {
          console.log('Creating default profile for user');
          const token = await getToken();
          const response = await api.post('/api/user-profile', {
            userId: user?.id,
            branch: selectedBranch || 'BCA', // Use selected branch or default
            collegeName: collegeName || 'Default College',
            principalName: 'Default Principal'
          }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          
          if (response.data?.branch) {
            await fetchQuiz(response.data.branch);
          }
        } catch (createError) {
          console.error('Error creating default profile:', createError);
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    }
  };

  // New function to fetch quiz from the API
  const fetchQuiz = async (branchName: string) => {
    try {
      setLoading(true);
      console.log(`Fetching quiz for branch: ${branchName}`);
      const token = await getToken();
      const response = await api.get(`/api/quizzes/branch/${branchName}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data) {
        console.log('Quiz data received:', response.data);
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(-1));
        
        // Set time limit from quiz data if available
        if (response.data.timeLimit) {
          setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
        }
      } else {
        console.error('No quiz data received for branch:', branchName);
        alert(`No quiz available for ${branchName} branch`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Error loading quiz. Please try again later.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!quizCompleted && timeLeft > 0 && !showInstructions && quiz) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizCompleted, showInstructions, quiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handleSubmitTest = async () => {
    if (quizCompleted || !quiz) return;

    // Save last answer if not saved
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }

    // Calculate score
    let correctAnswers = 0;
    const formattedAnswers = answers.map((answer, index) => {
      const isCorrect = quiz.questions[index].correctAnswer === answer;
      if (isCorrect) correctAnswers++;
      return {
        questionIndex: index,
        selectedAnswer: answer,
        isCorrect
      };
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);

    try {
      const token = await getToken();
      console.log('Submitting test with token:', !!token);
      
      await api.post('/api/quiz-results', {
        quizId: quiz.title,
        userId: user?.id,
        score: finalScore,
        answers: formattedAnswers,
        timeSpent: (quiz.timeLimit * 60) - timeLeft,
        completedAt: new Date().toISOString()
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setScore(finalScore);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    }
  };

  // Function to reset previous test results
  const resetPreviousTestResults = async () => {
    try {
      console.log('Resetting previous test results');
      const token = await getToken();
      await api.delete('/api/quiz-results/reset', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id }
      });
      console.log('Previous test results reset successfully');
    } catch (error) {
      console.error('Error resetting test results:', error);
      // Continue even if reset fails
    }
  };

  const handleStartTest = async () => {
    // Validate form
    if (!selectedBranch || !collegeName || !testCode) {
      setFormError(true);
      return;
    }

    // Validate test code
    if (testCode !== 'Simsn') {
      setCodeError(true);
      return;
    }

    // Save user profile with provided information
    try {
      setLoading(true);
      
      // First, reset any previous test results for this user
      await resetPreviousTestResults();

      const token = await getToken();
      await api.post('/api/user-profile', {
        userId: user?.id,
        branch: selectedBranch,
        collegeName: collegeName,
        principalName: 'Default Principal'
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      // Set branch and fetch quiz
      await fetchQuiz(selectedBranch);
      setShowInstructions(false);
    } catch (error) {
      console.error('Error saving profile or fetching quiz:', error);
      alert('Failed to start test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showInstructions) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h1 className="text-2xl font-bold">Scholarship Test Instructions</h1>
              </div>
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Before You Begin</h2>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-blue-600 w-5 h-5 mt-0.5 mr-3" />
                      <p className="text-blue-800">This test will assess your knowledge in your selected field of study. Your performance will determine your eligibility for our scholarship program.</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>The test consists of 30 multiple-choice questions.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>You have 20 minutes to complete all 30 questions.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>Once you start, you cannot pause or restart the test.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-600 w-5 h-5 mt-0.5 mr-2" />
                      <span>Do not refresh the page during the test.</span>
                    </li>
                  </ul>
                  
                  {/* Scholarship Eligibility Information */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                    <h3 className="font-semibold text-blue-800 flex items-center mb-2">
                      <Award className="mr-2 h-5 w-5" /> Scholarship Eligibility
                    </h3>
                    <p className="text-blue-700 mb-2">Based on your test performance in 30 questions, you may qualify for the following scholarship discounts:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li className="flex items-center">
                        <Percent className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Score 85% or above (25+ correct): <strong>15% discount</strong></span>
                      </li>
                      <li className="flex items-center">
                        <Percent className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Score 75% or above (22+ correct): <strong>10% discount</strong></span>
                      </li>
                      <li className="flex items-center">
                        <Percent className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Score 65% or above (19+ correct): <strong>5% discount</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>

                <form className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Your Branch
                    </label>
                    <select
                      id="branch"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className={`w-full p-3 border rounded-lg ${formError && !selectedBranch ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={loading}
                    >
                      <option value="">Select a branch</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Com">B.Com</option>
                    </select>
                    {formError && !selectedBranch && (
                      <p className="text-red-500 text-sm mt-1">Please select your branch</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                      College Name
                    </label>
                    <input
                      id="college"
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="Enter your college name"
                      className={`w-full p-3 border rounded-lg ${formError && !collegeName ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={loading}
                    />
                    {formError && !collegeName && (
                      <p className="text-red-500 text-sm mt-1">Please enter your college name</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="testCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Test Code
                    </label>
                    <input
                      id="testCode"
                      type="text"
                      value={testCode}
                      onChange={(e) => {
                        setTestCode(e.target.value);
                        setCodeError(false);
                      }}
                      placeholder="Enter the test code provided"
                      className={`w-full p-3 border rounded-lg ${(formError && !testCode) || codeError ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={loading}
                    />
                    {formError && !testCode && (
                      <p className="text-red-500 text-sm mt-1">Please enter the test code</p>
                    )}
                    {codeError && (
                      <p className="text-red-500 text-sm mt-1">Invalid test code</p>
                    )}
                  </div>
                </form>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="text-yellow-600 w-5 h-5 mt-0.5 mr-3" />
                    <p className="text-yellow-800">By starting this test, you agree to complete it honestly without any external assistance or reference materials.</p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleStartTest}
                    className={`bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Start Test'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading || !quiz) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <p className="text-gray-600">Loading your test...</p>
          </div>
        </div>
      </>
    );
  }

  if (quizCompleted) {
    const scholarshipDiscount = getScholarshipDiscount(score);
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 select-none">Test Completed!</h2>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-blue-600 select-none">Your Score: {score}%</p>
                
                {scholarshipDiscount > 0 ? (
                  <div className="mt-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-green-800 flex items-center justify-center mb-2 select-none">
                      <Award className="h-5 w-5 mr-2" />
                      <span className="font-bold">Congratulations!</span>
                    </p>
                    <p className="text-green-700 select-none">
                      You are eligible for a <span className="font-bold">{scholarshipDiscount}% scholarship discount</span> on your program fees!
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-yellow-800 select-none">
                      You need a score of at least 65% (19 correct answers) to qualify for a scholarship discount.
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Quiz Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">{quiz.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-white/90">
                  Question {currentQuestionIndex + 1} of 30
                </div>
              </div>
            </div>

            {/* Question Area */}
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6 select-none">
                {quiz.questions[currentQuestionIndex].question}
              </h2>
              <div className="space-y-3">
                {quiz.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 select-none ${
                      selectedAnswer === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    } transition-all`}
                  >
                    <div className="flex items-center">
                      <span className={`inline-block w-8 h-8 rounded-full ${
                        selectedAnswer === index 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-700'
                        } font-medium mr-3 text-center leading-8`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="mt-6 flex justify-end">
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    disabled={selectedAnswer === null}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Submit Test
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    Next Question
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipTest; 