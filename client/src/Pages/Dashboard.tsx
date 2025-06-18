import { useState, useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  BookOpen,
  GraduationCap,
  Users,
  BarChart,
  Home,
  CheckCircle,
  Calendar,
  ArrowRight,
  Star,
  TrendingUp,
  Briefcase,
  Clock,
  ExternalLink,
  MapPin,
  DollarSign,
  X,
  ChevronDown,
  ChevronRight,
  Play,
  Lock,
  Wrench,
  Target,
  MessageCircle
} from 'lucide-react';

import Navbar from '../components/Navbar';
import CounselingFeedbackTab from '../components/CounselingFeedbackTab';
import api from '../utils/axios';
import axios from 'axios';

interface User {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'student' | 'admin';
  course?: string;
  plan?: string;
  createdAt: string;
  updatedAt: string;
}

interface TestResult {
  score: number;
  completedAt: string;
  timeSpent: number;
}

// New interfaces for predefined courses
interface PredefinedCourseProject {
  title: string;
  description?: string;
}

interface PredefinedCourseResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'document' | 'tool' | 'other';
}

interface PredefinedCourseAssignment {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore: number;
  instructions: string;
}

interface PredefinedCourseWeek {
  week: number;
  title: string;
  topics: string[];
  projects: (string | PredefinedCourseProject)[];
  liveClassTopics: string[];
  resources?: PredefinedCourseResource[];
  assignments?: PredefinedCourseAssignment[];
  isCompleted?: boolean;
  completedAt?: string;
  isLocked?: boolean;
}

interface PredefinedCourseToolsAndTechnologies {
  languages?: string[];
  frontend?: string[];
  backend?: string[];
  databases?: string[];
  authentication?: string[];
  devops?: string[];
  deployment?: string[];
  ai?: string[];
  aiTools?: string[];
  testingMonitoring?: string[];
  tooling?: string[];
  csFundamentals?: string[];
  softSkills?: string[];
  platforms?: string[];
}

interface PredefinedCourseData {
  _id: string;
  courseName: string;
  displayName?: string;
  durationWeeks: number;
  effortPerWeek: string;
  liveClassesPerWeek: number;
  courseDescription: string;
  weeklyRoadmap: PredefinedCourseWeek[];
  toolsAndTechnologies: PredefinedCourseToolsAndTechnologies;
  expectedOutcomes: string[];
  isActive: boolean;
}

interface PredefinedCourseModuleProgress {
  week: number;
  isCompleted: boolean;
  completedAt?: string;
  isLocked: boolean;
  completedBy?: string;
  notes?: string;
}

interface PredefinedCourseProgress {
  _id: string;
  studentId: string;
  courseName: string;
  courseId: string;
  modules: PredefinedCourseModuleProgress[];
  overallProgress: number;
  currentWeek: number;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  totalTimeSpent: number;
}

interface StudentFeedback {
  studentId: string;
  name: string;
  semester: string;
  college: string;
  threeWords: string[];
  strengths: string;
  areasOfImprovement: string;
  stressHandling: string;
  motivation: string;
  englishRating: number;
  hindiRating: number;
  confidence: string;
  decisionMaking: string;
  biggestAchievement: string;
  turningPoint: string;
  conflicts: string;
  futureConcern: string;
  alignInThoughts: string;
  courseChosen: string;
  createdAt: string;
}

// Define scholarship tiers - same as in ScholarshipTest
const SCHOLARSHIP_TIERS = [
  { minScore: 80, discount: 15 },
  { minScore: 70, discount: 10 },
  { minScore: 60, discount: 5 },
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

// Sample internship opportunities data
const INTERNSHIP_OPPORTUNITIES = [
  {
    id: 1,
    company: "TechSolutions Inc.",
    logo: "TS",
    logoColor: "bg-blue-100 text-blue-600",
    position: "Frontend Developer Intern",
    duration: "3 months",
    positions: 5,
    stipend: "₹8,000/month",
    location: "Remote"
  },
  {
    id: 2,
    company: "DigitalWave",
    logo: "DW",
    logoColor: "bg-purple-100 text-purple-600",
    position: "Digital Marketing Intern",
    duration: "6 months",
    positions: 3,
    stipend: "₹12,000/month",
    location: "Bangalore"
  },
  {
    id: 3,
    company: "Games24x7",
    logo: "GT",
    logoColor: "bg-green-100 text-green-600",
    position: "Game Administration Intern",
    duration: "4 months",
    positions: 2,
    stipend: "₹10,000/month",
    location: "Hybrid"
  },
  {
    id: 4,
    company: "DataSmart Analytics",
    logo: "DA",
    logoColor: "bg-yellow-100 text-yellow-600",
    position: "Data Analysis Intern",
    duration: "3 months",
    positions: 4,
    stipend: "₹8,000/month",
    location: "Delhi NCR"
  },
  {
    id: 5,
    company: "CoreXtech IT Services Pvt. Ltd.",
    logo: "CX",
    logoColor: "bg-indigo-100 text-indigo-600",
    position: "Cloud Engineer Intern",
    duration: "6 months",
    positions: 2,
    stipend: "₹22,000/month",
    location: "Pune"
  },
  {
    id: 6,
    company: "CreativeSolutions",
    logo: "CS",
    logoColor: "bg-pink-100 text-pink-600",
    position: "UI/UX Design Intern",
    duration: "3 months",
    positions: 3,
    stipend: "₹15,000/month",
    location: "Remote"
  }
];

interface UpcomingSession {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  link: string;
}

const Dashboard = () => {
  const { user } = useUser();
  const { getToken, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [hasAttemptedTest, setHasAttemptedTest] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'course' | 'foundationcourses' | 'test' | 'counselingfeedback'>('overview');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'community' | 'counseling'>('community');

  // Predefined course state
  const [predefinedCourseData, setPredefinedCourseData] = useState<PredefinedCourseData | null>(null);
  const [predefinedCourseProgress, setPredefinedCourseProgress] = useState<PredefinedCourseProgress | null>(null);
  const [loadingPredefinedCourse, setLoadingPredefinedCourse] = useState(false);
  
  // Foundation course state
  const [foundationCourseData, setFoundationCourseData] = useState<PredefinedCourseData | null>(null);
  const [foundationCourseProgress, setFoundationCourseProgress] = useState<PredefinedCourseProgress | null>(null);
  const [loadingFoundationCourse, setLoadingFoundationCourse] = useState(false);
  const [expandedFoundationTopics, setExpandedFoundationTopics] = useState<{ [key: number]: boolean }>({});
  const [showFoundationSyllabus, setShowFoundationSyllabus] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{ week: number; assignment: PredefinedCourseAssignment } | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  
  // Collapsible state management
  const [expandedTopics, setExpandedTopics] = useState<{ [key: number]: boolean }>({});
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [studentFeedback, setStudentFeedback] = useState<StudentFeedback | null>(null);

  // New assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    studentName: '',
    submissionLink: '',
    description: '',
    notes: ''
  });

  // Initial data fetch
  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchUserData();
    checkTestStatus();
    fetchPredefinedCourseData();
    fetchUpcomingSessions();
    fetchStudentFeedback();
  }, [isLoaded, user]);

  useEffect(() => {
    if (userData && userData.course) {
      fetchPredefinedCourseData();
      fetchAssignmentSubmissions();
    }
    // Fetch foundation course for premium students
    if (userData && userData.plan === 'premium') {
      fetchFoundationCourse();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const token = isLoaded ? await getToken() : null;
      const response = await api.get(`/api/users/${user?.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPredefinedCourseData = async () => {
    try {
      setLoadingPredefinedCourse(true);
      const token = isLoaded ? await getToken() : null;
      
      const response = await api.get('/api/predefined-courses/student/predefined-course-materials', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setPredefinedCourseData(response.data.course);
      setPredefinedCourseProgress(response.data.progress);
    } catch (error) {
      console.error('Error fetching predefined course materials:', error);
      // Don't show error for students without assigned courses
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        console.error('Predefined course materials error:', error.response?.data);
      }
    } finally {
      setLoadingPredefinedCourse(false);
    }
  };

  const fetchFoundationCourse = async () => {
    if (!userData || userData.plan !== 'premium') return;
    
    setLoadingFoundationCourse(true);
    try {
      const token = isLoaded ? await getToken() : null;
      const response = await api.get('/api/predefined-courses/student/foundation-course', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setFoundationCourseData(response.data.course);
      setFoundationCourseProgress(response.data.progress);
    } catch (error) {
      console.error('Error fetching foundation course:', error);
    } finally {
      setLoadingFoundationCourse(false);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/api/student/upcoming-sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcomingSessions(response.data);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
    }
  };

  const fetchStudentFeedback = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/api/student/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentFeedback(response.data);
    } catch (error) {
      console.error('Error fetching student feedback:', error);
    }
  };

  const fetchAssignmentSubmissions = async () => {
    if (!userData || !userData.course) return;
    
    try {
      const token = await getToken();
      const response = await api.get('/api/predefined-courses/student/my-submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignmentSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
    }
  };

  // Auto-scroll effect for internship listings
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const totalWidth = scrollContainer.scrollWidth;
    const visibleWidth = scrollContainer.clientWidth;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollPosition += 0.5; // Controls scroll speed

      // Reset position when we've scrolled through all items
      if (scrollPosition >= totalWidth - visibleWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start scrolling animation
    animationFrameId = requestAnimationFrame(scroll);

    // Pause scrolling when hovering
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const checkTestStatus = async () => {
    try {
      const token = isLoaded ? await getToken() : null;
      console.log('Checking test status with token:', !!token);
      console.log('User ID:', user?.id);

      const response = await api.get('/api/quiz-results/check-test-status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id }
      });
      console.log('Test status response:', response.data);

      setHasAttemptedTest(response.data.hasAttempted);
      if (response.data.hasAttempted && response.data.result) {
        console.log('Setting test result:', response.data.result);
        setTestResult(response.data.result);
      } else {
        console.log('No test result found in response');
      }
    } catch (error) {
      console.error('Error checking test status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
    }
  };

  const handleStartTest = () => {
    console.log('handleStartTest called');
    console.log('hasAttemptedTest:', hasAttemptedTest);
    if (hasAttemptedTest) {
      alert('You have already taken the test. Only one attempt is allowed.');
      console.log('Navigation blocked: Test already attempted.');
      return;
    }
    console.log('Navigating to /scholarship-test...');
    navigate('/scholarship-test');
  };

  const renderProgressStep = (step: number, title: string, isCompleted: boolean, isCurrent: boolean) => {
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' :
            isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
          }`}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${isCompleted ? 'text-green-600' :
              isCurrent ? 'text-blue-600' : 'text-gray-500'
            }`}>
            {title}
          </p>
        </div>
      </div>
    );
  };

  const openModal = (type: 'community' | 'counseling') => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('community'); // Reset to default value instead of null
  };

  const handleAssignmentSubmission = (week: number, assignment: PredefinedCourseAssignment) => {
    console.log('Assignment submission clicked:', { week, assignment });
    setSelectedAssignment({ week, assignment });
    setAssignmentForm({
      studentName: user?.firstName + ' ' + (user?.lastName || ''),
      submissionLink: '',
      description: '',
      notes: ''
    });
    setShowAssignmentModal(true);
    console.log('Modal should be showing now');
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !assignmentForm.submissionLink.trim()) {
      alert('Please provide a valid assignment link');
      return;
    }

    try {
      const token = await getToken();
      await api.post(`/api/predefined-courses/student/assignments/${selectedAssignment.week}`, {
        assignmentId: selectedAssignment.assignment._id,
        submissionLink: assignmentForm.submissionLink.trim(),
        description: assignmentForm.description,
        notes: assignmentForm.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowAssignmentModal(false);
      setAssignmentForm({
        studentName: '',
        submissionLink: '',
        description: '',
        notes: ''
      });
      alert('Assignment submitted successfully!');
      
      // Refresh course data and assignment submissions to update status
      await fetchPredefinedCourseData();
      await fetchAssignmentSubmissions();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment. Please try again.');
    }
  };

  const toggleTopic = (weekIndex: number) => {
    setExpandedTopics(prev => ({
      ...prev,
      [weekIndex]: !prev[weekIndex]
    }));
  };

  const toggleFoundationTopic = (weekIndex: number) => {
    setExpandedFoundationTopics(prev => ({
      ...prev,
      [weekIndex]: !prev[weekIndex]
    }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-slate-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <nav className="flex space-x-8 border-b border-gray-200 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'overview' 
                    ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Overview
                </button>
                <button
                onClick={() => setActiveTab('course')}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'course' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Course
              </button>
              {/* Foundation Courses Tab - Only show for premium users */}
              {userData?.plan === 'premium' && (
                <button
                  onClick={() => setActiveTab('foundationcourses')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                    activeTab === 'foundationcourses' 
                      ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Foundation Courses
                </button>
              )}
              <button
                onClick={() => setActiveTab('test')}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'test' 
                    ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Award className="h-4 w-4 mr-2" />
                Test
                </button>
                <button
                onClick={() => setActiveTab('counselingfeedback')}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'counselingfeedback' 
                    ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                <MessageCircle className="h-4 w-4 mr-2" />
                My Counseling Feedback
                </button>
              </nav>
            </div>

          {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="p-6">
                {/* Your Path Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Career Path</h2>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="space-y-6">
                      {renderProgressStep(1, 'Create Your Profile', true, false)}
                      <div className="ml-4 w-px h-6 bg-gray-200"></div>
                      {renderProgressStep(2, 'Take Scholarship Test', hasAttemptedTest, !hasAttemptedTest)}
                      <div className="ml-4 w-px h-6 bg-gray-200"></div>

                      {/* Custom Step 3 with Scholarship Button */}
                      <div className="flex items-start">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${hasAttemptedTest || userData?.plan === 'premium' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                          {hasAttemptedTest || userData?.plan === 'premium' ? <CheckCircle className="w-5 h-5" /> : 3}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className={`text-sm font-medium ${hasAttemptedTest || userData?.plan === 'premium' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                            Register for UntraddCareer Program
                          </p>
                          {userData?.plan === 'premium' ? (
                            <div className="mt-2">
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700 mb-2 flex items-center">
                                  🎉 <span className="ml-2 font-semibold">Congratulations! Your true journey begins here!</span>
                                </p>
                                <p className="text-xs text-green-600">
                                  You are successfully enrolled in the {userData.course || 'UntraddCareer'} program with {userData.plan} plan.
                                </p>
                              </div>
                            </div>
                          ) : hasAttemptedTest && testResult && testResult.score >= 60 ? (
                            <div className="mt-2">
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                                <p className="text-xs text-green-700 mb-2">
                                  🎉 Congratulations! You're eligible for {getScholarshipDiscount(testResult.score)}% scholarship
                                </p>
                                {testResult.score >= 70 ? (
                                  <button
                                    onClick={() => window.open('https://rzp.io/rzp/wND9YCXB', '_blank')}
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 text-xs flex items-center justify-center font-semibold shadow-md transform hover:scale-105 transition-all duration-200 w-full"
                                  >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Register Now with {getScholarshipDiscount(testResult.score)}% Scholarship
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => window.open('https://rzp.io/rzp/wND9YCXB', '_blank')}
                                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-xs flex items-center justify-center w-full"
                                  >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Claim Your {getScholarshipDiscount(testResult.score)}% Scholarship
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : hasAttemptedTest && testResult && testResult.score < 60 ? (
                            <div className="mt-2">
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700 mb-2">
                                  Excited to start your career journey?
                                </p>
                                <button
                                  onClick={() => window.open('https://rzp.io/rzp/wND9YCXB', '_blank')}
                                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-xs flex items-center justify-center w-full"
                                >
                                  Claim Your 15 percent Schorship
                                  <ArrowRight className="ml-2 h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="ml-4 w-px h-6 bg-gray-200"></div>
                      {renderProgressStep(4, 'Your Journey has started!', userData?.plan === 'premium', false)}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className={`grid grid-cols-1 gap-4 ${userData?.plan === 'premium' ? 'sm:grid-cols-1 lg:grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Award className="text-blue-600 w-5 h-5" />
                      </div>
                      <h3 className="ml-3 font-medium text-gray-900">Scholarship Test</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {hasAttemptedTest
                        ? 'You have completed the scholarship test.'
                        : 'Take our assessment to qualify for scholarships up to 15%.'}
                    </p>
                    <div className="mt-2">
                      {hasAttemptedTest ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                          {testResult && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-gray-500">Your Score</p>
                                  <p className="text-lg font-bold text-blue-600">{testResult.score}%</p>
                                </div>
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <Award className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              {testResult.score >= 60 && (
                                <p className="text-xs text-green-600 mt-1">
                                  Eligible for {getScholarshipDiscount(testResult.score)}% scholarship
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                      <div>
                          <button
                            onClick={handleStartTest}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center mb-3"
                          >
                            Take Scholarship Test
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </button>
                          
                      </div>
                      )}
                    </div>
                  </div>

                  {/* Free Counseling Card - Only show if user doesn't have premium plan */}
                  {userData?.plan !== 'premium' && (
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="text-purple-600 w-5 h-5" />
                        </div>
                        <h3 className="ml-3 font-medium text-gray-900">Free Counseling</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Book a free career counseling session with our industry experts to get your career on track.
                      </p>
                      <button
                        onClick={() => openModal('counseling')}
                        className="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 flex items-center justify-center"
                      >
                        Scheduled for 3rd June
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="text-green-600 w-5 h-5" />
                      </div>
                      <h3 className="ml-3 font-medium text-gray-900">Alumni Community</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Connect with peers, alumni, and mentors in your field of study.
                    </p>
                    <button
                      onClick={() => openModal('community')}
                      className="w-full border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 flex items-center justify-center"
                    >
                      Join Community
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div> */}
                </div>
              </div>
            )}

          {activeTab === 'course' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Course Materials</h2>
                  <p className="text-gray-600 mb-4">
                    {predefinedCourseData ? `Follow your ${predefinedCourseData.displayName || predefinedCourseData.courseName} course roadmap and track your progress.` : 'Access your course materials and track your learning progress.'}
                  </p>
                </div>

                {loadingPredefinedCourse ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course materials...</p>
                  </div>
                ) : predefinedCourseData && predefinedCourseProgress ? (
                  <div className="space-y-6">
                    {/* Course Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{predefinedCourseData.displayName || predefinedCourseData.courseName}</h3>
                          <p className="text-gray-600 mt-1">{predefinedCourseData.courseDescription}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">{predefinedCourseProgress.overallProgress}%</div>
                          <div className="text-sm text-gray-500">Complete</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Duration: {predefinedCourseData.durationWeeks} weeks</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Modules: {predefinedCourseData.weeklyRoadmap.length}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Time Spent: {Math.floor(predefinedCourseProgress.totalTimeSpent / 60)}h {predefinedCourseProgress.totalTimeSpent % 60}m</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="bg-white rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                            style={{ width: `${predefinedCourseProgress.overallProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                     {/* Course Syllabus Overview */}
                     <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                       <button
                         onClick={() => setShowSyllabus(!showSyllabus)}
                         className="w-full p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors"
                       >
                         <div className="flex items-center justify-between">
                           <div className="flex items-center">
                             <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                             <div className="text-left">
                               <h4 className="font-semibold text-gray-900">Course Syllabus & Tools</h4>
                               <p className="text-gray-600 text-sm mt-1">Complete roadmap with technologies and expected outcomes</p>
                             </div>
                           </div>
                           {showSyllabus ? (
                             <ChevronDown className="h-5 w-5 text-gray-500" />
                           ) : (
                             <ChevronRight className="h-5 w-5 text-gray-500" />
                           )}
                         </div>
                       </button>
                       
                       {showSyllabus && (
                         <div className="p-4">
                           {/* Tools and Technologies */}
                           <div className="mb-6">
                             <h5 className="font-medium text-gray-900 mb-3">🛠️ Tools & Technologies</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {Object.entries(predefinedCourseData.toolsAndTechnologies || {}).map(([category, tools]) => (
                                 <div key={category} className="bg-gray-50 rounded-lg p-3">
                                   <h6 className="text-sm font-medium text-gray-800 mb-2 capitalize">
                                     {category.replace(/([A-Z])/g, ' $1').trim()}
                                   </h6>
                                   <div className="flex flex-wrap gap-1">
                                     {Array.isArray(tools) ? tools.map((tool: string, index: number) => (
                                       <span key={index} className="text-xs bg-white text-gray-700 px-2 py-1 rounded border">
                                         {tool}
                                       </span>
                                     )) : (
                                       <span className="text-xs text-gray-500">No tools specified</span>
                                     )}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>

                           {/* Expected Outcomes */}
                           <div className="mb-6">
                             <h5 className="font-medium text-gray-900 mb-3">🎯 Expected Outcomes</h5>
                             <div className="space-y-2">
                               {predefinedCourseData.expectedOutcomes.map((outcome, index) => (
                                 <div key={index} className="flex items-start">
                                   <span className="bg-green-100 text-green-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                     ✓
                                   </span>
                                   <p className="text-sm text-gray-700">{outcome}</p>
                                 </div>
                               ))}
                             </div>
                           </div>

                           {/* Course Details */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="bg-blue-50 rounded-lg p-3">
                               <h6 className="text-sm font-medium text-blue-800 mb-1">Effort Required</h6>
                               <p className="text-sm text-blue-700">{predefinedCourseData.effortPerWeek}</p>
                             </div>
                             <div className="bg-purple-50 rounded-lg p-3">
                               <h6 className="text-sm font-medium text-purple-800 mb-1">Live Classes</h6>
                               <p className="text-sm text-purple-700">{predefinedCourseData.liveClassesPerWeek} per week</p>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>

                     {/* Course Control Panel */}
                     <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                       <div className="flex items-center justify-between">
                         <h4 className="font-semibold text-gray-900 flex items-center">
                           <Play className="h-5 w-5 text-green-600 mr-2" />
                           Weekly Modules Progress
                         </h4>
                         <div className="text-sm text-gray-600">
                           Current Week: {predefinedCourseProgress.currentWeek} / {predefinedCourseData.durationWeeks}
                         </div>
                       </div>
                     </div>

                     {/* Weekly Modules */}
                     <div className="space-y-4">
                       {predefinedCourseData.weeklyRoadmap.map((week, weekIndex) => {
                         const moduleProgress = predefinedCourseProgress.modules.find(m => m.week === week.week);
                         const isLocked = false; // All modules are now unlocked for students
                         const isCompleted = moduleProgress?.isCompleted ?? false;
                       const isExpanded = expandedTopics[weekIndex];

                         return (
                           <div key={weekIndex} className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                             isLocked ? 'border-gray-300 opacity-75' : 
                             isCompleted ? 'border-green-300' : 'border-blue-300'
                           }`}>
                             <button
                               onClick={() => !isLocked && toggleTopic(weekIndex)}
                               disabled={isLocked}
                               className={`w-full p-4 border-b transition-colors ${
                                 isLocked ? 'bg-gray-100 cursor-not-allowed' :
                                 isCompleted ? 'bg-green-50 hover:bg-green-100 border-green-200' :
                                 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                               }`}
                             >
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center">
                                   <div className="flex items-center mr-3">
                                     {isLocked ? (
                                       <Lock className="h-5 w-5 text-gray-400 mr-2" />
                                     ) : isExpanded ? (
                                       <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                                     ) : (
                                       <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                                     )}
                                     <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                       isLocked ? 'bg-gray-200 text-gray-500' :
                                       isCompleted ? 'bg-green-100 text-green-600' :
                                       'bg-blue-100 text-blue-600'
                                     }`}>
                                       {week.week}
                                     </span>
                                   </div>
                                   <div className="text-left">
                                     <h4 className={`font-semibold ${
                                       isLocked ? 'text-gray-500' : 'text-gray-900'
                                     }`}>
                                       Week {week.week}: {week.title}
                                     </h4>
                                   </div>
                                 </div>
                                 <div className="flex items-center">
                                   {isCompleted && (
                                     <span className="text-green-600 text-sm mr-3">Completed</span>
                                   )}
                                   {isExpanded ? (
                                     <ChevronDown className="h-5 w-5 text-gray-500" />
                                   ) : (
                                     <ChevronRight className="h-5 w-5 text-gray-500" />
                                   )}
                                 </div>
                               </div>
                             </button>

                             {isExpanded && !isLocked && (
                               <div className="p-4 space-y-4">
                                 {/* Topics */}
                                 <div className="mb-4">
                                   <h6 className="text-sm font-medium text-gray-700 mb-2">📚 Topics:</h6>
                                   <div className="space-y-1">
                                     {week.topics.map((topic, topicIndex) => (
                                       <div key={topicIndex} className="bg-gray-50 rounded p-2">
                                         <span className="text-sm text-gray-700">• {topic}</span>
                                       </div>
                                     ))}
                                   </div>
                                 </div>

                                 {/* Projects */}
                                 <div className="mb-4">
                                   <h6 className="text-sm font-medium text-gray-700 mb-2">🚀 Projects:</h6>
                                   <div className="space-y-2">
                                     {week.projects.map((project, projectIndex) => (
                                       <div key={projectIndex} className="bg-blue-50 rounded p-3">
                                         <span className="text-sm font-medium text-blue-800">
                                           {typeof project === 'string' ? project : project.title}
                                         </span>
                                         {typeof project === 'object' && project.description && (
                                           <p className="text-xs text-blue-600 mt-1">{project.description}</p>
                                         )}
                                       </div>
                                     ))}
                                   </div>
                                 </div>

                                 {/* Live Class Topics */}
                                 <div className="mb-4">
                                   <h6 className="text-sm font-medium text-gray-700 mb-2">🎥 Live Class Topics:</h6>
                                   <div className="space-y-1">
                                     {week.liveClassTopics.map((topic, topicIndex) => (
                                       <div key={topicIndex} className="bg-purple-50 rounded p-2">
                                         <span className="text-sm text-purple-700">• {topic}</span>
                                       </div>
                                     ))}
                                   </div>
                                 </div>

                                 {/* Resources */}
                                 {week.resources && week.resources.length > 0 && (
                                   <div className="mb-4">
                                     <h6 className="text-sm font-medium text-gray-700 mb-2">📖 Resources:</h6>
                                     <div className="space-y-2">
                                       {week.resources.map((resource, resourceIndex) => (
                                         <div key={resourceIndex} className="bg-yellow-50 rounded p-3">
                                           <a 
                                             href={resource.url} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="text-sm font-medium text-yellow-800 hover:text-yellow-900 flex items-center"
                                           >
                                             <ExternalLink className="h-3 w-3 mr-1" />
                                             {resource.title}
                                           </a>
                                           <span className="text-xs text-yellow-600 capitalize">
                                             {resource.type}
                                           </span>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 )}

                                 {/* Assignments */}
                                 {week.assignments && week.assignments.length > 0 && (
                                   <div className="mb-4">
                                     <h6 className="text-sm font-medium text-gray-700 mb-2">📝 Assignments:</h6>
                                     <div className="space-y-2">
                                       {week.assignments.map((assignment, assignmentIndex) => {
                                         const submission = assignmentSubmissions.find(
                                           s => s.assignmentId === assignment._id && s.week === week.week
                                         );
                                         
                                         return (
                                           <div key={assignmentIndex} className="bg-green-50 rounded p-3">
                                             <div className="flex justify-between items-start">
                                               <div className="flex-1">
                                                 <h6 className="text-sm font-medium text-green-800">{assignment.title}</h6>
                                                 <p className="text-xs text-green-700 mt-1">{assignment.description}</p>
                                                 {assignment.dueDate && (
                                                   <p className="text-xs text-green-600 mt-1">
                                                     Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                   </p>
                                                 )}
                                                 
                                                 {/* Submission Status */}
                                                 {submission && (
                                                   <div className="mt-2 p-2 bg-white rounded border">
                                                     <div className="flex items-center justify-between text-xs">
                                                       <span className={`px-2 py-1 rounded font-medium ${
                                                         submission.isGraded 
                                                           ? 'bg-blue-100 text-blue-800' 
                                                           : 'bg-yellow-100 text-yellow-800'
                                                       }`}>
                                                         {submission.isGraded ? 'Graded' : 'Submitted - Pending Review'}
                                                       </span>
                                                       {submission.isGraded && (
                                                         <span className="font-medium text-green-600">
                                                           Score: {submission.score}/{assignment.maxScore}
                                                         </span>
                                                       )}
                                                     </div>
                                                     
                                                     {submission.feedback && (
                                                       <div className="mt-2">
                                                         <p className="text-xs text-gray-600 font-medium">Feedback:</p>
                                                         <p className="text-xs text-gray-700 mt-1">{submission.feedback}</p>
                                                       </div>
                                                     )}
                                                     
                                                     <div className="mt-1 text-xs text-gray-500">
                                                       Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                                     </div>
                                                   </div>
                                                 )}
                                               </div>
                                               
                                               {!submission && (
                                                 <button
                                                   onClick={() => handleAssignmentSubmission(week.week, assignment)}
                                                   className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                                 >
                                                   Submit
                                                 </button>
                                               )}
                                             </div>
                                           </div>
                                         );
                                       })}
                                     </div>
                                   </div>
                                 )}
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>

                     {/* Tools and Technologies */}
                     <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                       <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                         <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                         Tools & Technologies
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {Object.entries(predefinedCourseData.toolsAndTechnologies || {}).map(([category, tools]) => (
                           <div key={category} className="bg-gray-50 rounded-lg p-3">
                             <h6 className="text-sm font-medium text-gray-800 mb-2 capitalize">
                               {category.replace(/([A-Z])/g, ' $1').trim()}
                             </h6>
                             <div className="flex flex-wrap gap-1">
                               {Array.isArray(tools) ? tools.map((tool: string, index: number) => (
                                 <span key={index} className="text-xs bg-white text-gray-700 px-2 py-1 rounded border">
                                   {tool}
                                 </span>
                               )) : (
                                 <span className="text-xs text-gray-500">No tools specified</span>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Expected Outcomes */}
                     <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                       <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                         <Target className="h-5 w-5 text-green-600 mr-2" />
                         Expected Outcomes
                       </h4>
                       <div className="space-y-2">
                         {predefinedCourseData.expectedOutcomes.map((outcome, index) => (
                           <div key={index} className="flex items-start">
                             <span className="bg-green-100 text-green-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                               ✓
                             </span>
                             <p className="text-sm text-gray-700">{outcome}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Assigned</h3>
                    <p className="text-gray-600 mb-4">
                      You don't have a course assigned yet. Contact your administrator to get enrolled in a course.
                    </p>
                    <a
                      href={`https://wa.me/918789698369?text=Hello, I'm ${user?.firstName || 'a student'} and I would like to know about course enrollment.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                      Contact Support
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                )}

                {userData?.course && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8 mt-8">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-purple-50">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                          Upcoming Sessions
                        </h3>
                      </div>
                      <div className="p-4">
                        {upcomingSessions.length > 0 ? (
                          <ul className="space-y-3">
                            {upcomingSessions.map((session) => (
                              <li key={session._id} className="border-b border-gray-100 pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-gray-900 text-sm font-medium">{session.title}</p>
                                    {session.description && (
                                      <p className="text-gray-600 text-xs mt-1">{session.description}</p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                      {new Date(session.date).toLocaleDateString()} • {session.time}
                                    </p>
                                  </div>
                                  <a
                                    href={session.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-2 rounded"
                                  >
                                    Join
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm text-center py-4">
                            No upcoming sessions scheduled at the moment.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Stories */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-green-50">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Users className="h-5 w-5 text-green-600 mr-2" />
                      Student Success Stories
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-start">
                          <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            P
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 text-sm font-medium">Princy</p>
                            <p className="text-gray-500 text-xs">Marketing and Branding, Cosmos Digital</p>
                            <p className="text-gray-600 text-sm mt-1">
                              "Coming from a tier-3 college, I had minimal exposure to industry trends. UntraddCareer helped me build practical marketing skills that employers actually want."
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start">
                          <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            R
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 text-sm font-medium">Roushan</p>
                            <p className="text-gray-500 text-xs">Full Stack Intern, IeltsAppeal Education</p>
                            <p className="text-gray-600 text-sm mt-1">
                              "Despite having zero coding experience, the structured training helped me transition from BBA to tech. My internship converted to a full-time role within 2 months!"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'test' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Scholarship Test</h2>
                <p className="text-gray-600 mb-4">
                  Our scholarship test assesses your aptitude and knowledge. Based on your performance,
                  you may qualify for tuition discounts up to 15%.
                </p>
                {testHistory.length > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    You have taken {testHistory.length} test{testHistory.length > 1 ? 's' : ''} so far.
                  </p>
                )}
              </div>

              {hasAttemptedTest ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Your Test Result</h3>
                  </div>
                  <div className="p-5">
                    {testResult && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Test Score</p>
                            <p className="text-3xl font-bold text-blue-600">{testResult.score}%</p>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Award className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Completed On</p>
                            <p className="text-sm font-medium">
                              {new Date(testResult.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Time Spent</p>
                            <p className="text-sm font-medium">
                              {Math.floor(testResult.timeSpent / 60)} minutes
                            </p>
                          </div>
                        </div>

                        {/* Scholarship Eligibility Information */}
                        {testResult.score >= 60 ? (
                          <div className="mt-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <p className="text-green-800 flex items-center mb-2">
                              <Award className="h-5 w-5 mr-2" />
                              <span className="font-semibold">Congratulations!</span>
                            </p>
                            <p className="text-green-700">
                              You are eligible for a <span className="font-bold">{getScholarshipDiscount(testResult.score)}% scholarship discount</span> on your program fees!
                            </p>
                            <div className="mt-3 flex flex-col space-y-2">
                              {testResult.score >= 70 ? (
                                <button
                                  onClick={() => window.open('https://rzp.io/rzp/wND9YCXB', '_blank')}
                                  className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 text-sm flex items-center justify-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                  <DollarSign className="mr-2 h-5 w-5" />
                                  Register Now with {getScholarshipDiscount(testResult.score)}% Scholarship
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => window.open('https://rzp.io/rzp/wND9YCXB', '_blank')}
                                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"
                                >
                                  Claim Your Scholarship
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => window.open(`https://wa.me/918789698369?text=Hello, I'm ${user?.firstName || 'a student'} and I scored ${testResult.score}% on the scholarship test. I would like to know more about claiming my ${getScholarshipDiscount(testResult.score)}% scholarship discount.`, '_blank')}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                              >
                                Contact for Scholarship Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                            <p className="text-yellow-800 text-sm">
                              You need a score of at least 60% to qualify for a scholarship discount.
                            </p>
                            <a
                              href={`https://wa.me/918789698369?text=Hello, I'm ${user?.firstName || 'a student'} and I would like to request a retest for the UntraddCareer scholarship test.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm flex items-center inline-block"
                            >
                              Request a retest
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <div className="text-center py-6">
                    <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to qualify for a scholarship?</h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                      Take our assessment to demonstrate your skills and knowledge.
                      Score at least 60% to qualify for tuition discounts.
                    </p>
                    <div>
                      <div className="mb-6 flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-center text-gray-700">
                          <Star className="text-yellow-500 h-4 w-4 mr-2" />
                          <span className="text-sm">Score 80% or above for a 15% scholarship</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Star className="text-yellow-500 h-4 w-4 mr-2" />
                          <span className="text-sm">Score 70% or above for a 10% scholarship</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Star className="text-yellow-500 h-4 w-4 mr-2" />
                          <span className="text-sm">Score 60% or above for a 5% scholarship</span>
                        </div>
                      </div>
                      <button
                        onClick={handleStartTest}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center mb-4"
                      >
                        Take Scholarship Test
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                      <button
                        onClick={() => window.open('https://rzp.io/rzp/wND9YCXB', '_blank')}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        Register Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scholarship Statistics */}
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Scholarship Impact</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="font-medium text-gray-900">100+</p>
                      </div>
                      <p className="text-sm text-gray-600">Students received scholarships</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        <p className="font-medium text-gray-900">96%</p>
                      </div>
                      <p className="text-sm text-gray-600">Placement success rate</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                        <p className="font-medium text-gray-900">₹3T - ₹25T</p>
                      </div>
                      <p className="text-sm text-gray-600">Monthly Stipend Range</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'foundationcourses' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Foundation Training Course</h2>
                <p className="text-gray-600 mb-4">
                  {foundationCourseData ? `Follow your ${foundationCourseData.displayName || foundationCourseData.courseName} course roadmap and track your progress.` : 'Access your foundation training course materials and track your learning progress.'}
                </p>
              </div>

              {loadingFoundationCourse ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading foundation course...</p>
                </div>
              ) : foundationCourseData && foundationCourseProgress ? (
                <div className="space-y-6">
                  {/* Course Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{foundationCourseData.displayName || foundationCourseData.courseName}</h3>
                        <p className="text-gray-600 mt-1">{foundationCourseData.courseDescription}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{foundationCourseProgress.overallProgress}%</div>
                        <div className="text-sm text-gray-500">Complete</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Duration: {foundationCourseData.durationWeeks} weeks</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Modules: {foundationCourseData.weeklyRoadmap.length}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Time Spent: {Math.floor(foundationCourseProgress.totalTimeSpent / 60)}h {foundationCourseProgress.totalTimeSpent % 60}m</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="bg-white rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                          style={{ width: `${foundationCourseProgress.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Course Syllabus Overview */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setShowFoundationSyllabus(!showFoundationSyllabus)}
                      className="w-full p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">Course Syllabus & Tools</h4>
                            <p className="text-gray-600 text-sm mt-1">Complete roadmap with technologies and expected outcomes</p>
                          </div>
                        </div>
                        {showFoundationSyllabus ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    
                    {showFoundationSyllabus && (
                      <div className="p-4">
                        {/* Tools and Technologies */}
                        <div className="mb-6">
                          <h5 className="font-medium text-gray-900 mb-3">🛠️ Tools & Technologies</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(foundationCourseData.toolsAndTechnologies || {}).map(([category, tools]) => (
                              <div key={category} className="bg-gray-50 rounded-lg p-3">
                                <h6 className="text-sm font-medium text-gray-800 mb-2 capitalize">
                                  {category.replace(/([A-Z])/g, ' $1').trim()}
                                </h6>
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(tools) ? tools.map((tool: string, index: number) => (
                                    <span key={index} className="text-xs bg-white text-gray-700 px-2 py-1 rounded border">
                                      {tool}
                                    </span>
                                  )) : (
                                    <span className="text-xs text-gray-500">No tools specified</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expected Outcomes */}
                        <div className="mb-6">
                          <h5 className="font-medium text-gray-900 mb-3">🎯 Expected Outcomes</h5>
                          <div className="space-y-2">
                            {foundationCourseData.expectedOutcomes.map((outcome, index) => (
                              <div key={index} className="flex items-start">
                                <span className="bg-green-100 text-green-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                  ✓
                                </span>
                                <p className="text-sm text-gray-700">{outcome}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h6 className="text-sm font-medium text-blue-800 mb-1">Effort Required</h6>
                            <p className="text-sm text-blue-700">{foundationCourseData.effortPerWeek}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <h6 className="text-sm font-medium text-purple-800 mb-1">Live Classes</h6>
                            <p className="text-sm text-purple-700">{foundationCourseData.liveClassesPerWeek} per week</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Control Panel */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Play className="h-5 w-5 text-green-600 mr-2" />
                        Weekly Modules Progress
                      </h4>
                      <div className="text-sm text-gray-600">
                        Current Week: {foundationCourseProgress.currentWeek} / {foundationCourseData.durationWeeks}
                      </div>
                    </div>
                  </div>

                  {/* Weekly Modules */}
                  <div className="space-y-4">
                    {foundationCourseData.weeklyRoadmap.map((week, weekIndex) => {
                      const moduleProgress = foundationCourseProgress.modules.find(m => m.week === week.week);
                      const isLocked = false; // All modules are now unlocked for students
                      const isCompleted = moduleProgress?.isCompleted ?? false;
                      const isExpanded = expandedFoundationTopics[weekIndex];

                      return (
                        <div key={weekIndex} className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                          isLocked ? 'border-gray-300 opacity-75' : 
                          isCompleted ? 'border-green-300' : 'border-blue-300'
                        }`}>
                          <button
                            onClick={() => !isLocked && toggleFoundationTopic(weekIndex)}
                            disabled={isLocked}
                            className={`w-full p-4 border-b transition-colors ${
                              isLocked ? 'bg-gray-100 cursor-not-allowed' :
                              isCompleted ? 'bg-green-50 hover:bg-green-100 border-green-200' :
                              'bg-blue-50 hover:bg-blue-100 border-blue-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex items-center mr-3">
                                  {isLocked ? (
                                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                                  ) : isExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                                  )}
                                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isLocked ? 'bg-gray-200 text-gray-500' :
                                    isCompleted ? 'bg-green-100 text-green-600' :
                                    'bg-blue-100 text-blue-600'
                                  }`}>
                                    {week.week}
                                  </span>
                                </div>
                                <div className="text-left">
                                  <h4 className={`font-semibold ${
                                    isLocked ? 'text-gray-500' : 'text-gray-900'
                                  }`}>
                                    Week {week.week}: {week.title}
                                  </h4>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {isCompleted && (
                                  <span className="text-green-600 text-sm mr-3">Completed</span>
                                )}
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                            </div>
                          </button>

                          {isExpanded && !isLocked && (
                            <div className="p-4 space-y-4">
                              {/* Topics */}
                              <div className="mb-4">
                                <h6 className="text-sm font-medium text-gray-700 mb-2">📚 Topics:</h6>
                                <div className="space-y-1">
                                  {week.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="bg-gray-50 rounded p-2">
                                      <span className="text-sm text-gray-700">• {topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Projects */}
                              <div className="mb-4">
                                <h6 className="text-sm font-medium text-gray-700 mb-2">🚀 Projects:</h6>
                                <div className="space-y-2">
                                  {week.projects.map((project, projectIndex) => (
                                    <div key={projectIndex} className="bg-blue-50 rounded p-3">
                                      <span className="text-sm font-medium text-blue-800">
                                        {typeof project === 'string' ? project : project.title}
                                      </span>
                                      {typeof project === 'object' && project.description && (
                                        <p className="text-xs text-blue-600 mt-1">{project.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Live Class Topics */}
                              <div className="mb-4">
                                <h6 className="text-sm font-medium text-gray-700 mb-2">🎥 Live Class Topics:</h6>
                                <div className="space-y-1">
                                  {week.liveClassTopics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="bg-purple-50 rounded p-2">
                                      <span className="text-sm text-purple-700">• {topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Foundation Course Not Available</h3>
                  <p className="text-gray-600">
                    The foundation training course will appear here when it becomes available.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'counselingfeedback' && (
            <div className="space-y-6">
              <CounselingFeedbackTab feedback={studentFeedback} />
            </div>
          )}
        </div>
          </div>

          {/* Stats Section (visible at all times) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Student Trust</p>
                  <h3 className="text-2xl font-bold text-gray-900">10/10</h3>
                </div>
                <Users className="text-blue-600 w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900">96%+</h3>
                </div>
                <BarChart className="text-green-600 w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scholarships Awarded</p>
                  <h3 className="text-2xl font-bold text-gray-900">100+</h3>
                </div>
                <Award className="text-purple-600 w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Company Tieups</p>
                  <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                </div>
                <GraduationCap className="text-orange-600 w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Active Hirings Section - New Addition */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active Hirings</h2>
                <p className="text-sm text-gray-600">Latest internship opportunities from our partner companies</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Updated daily
              </span>
            </div>

            <div className="p-5">
              <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
              >
                {INTERNSHIP_OPPORTUNITIES.map(internship => (
                  <div
                    key={internship.id}
                    className="flex-shrink-0 w-72 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${internship.logoColor} flex items-center justify-center font-bold`}>
                        {internship.logo}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{internship.company}</h3>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {internship.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">{internship.position}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Duration: {internship.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Positions: {internship.positions}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Stipend: {internship.stipend}</span>
                        </div>
                      </div>
                      {/* <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </button> */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto">
                  And hundreds more opportunities
                </button>
              </div>
            </div>
          </div>
        </div>
  );

  // Membership Required Modal
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Membership Required</h3>
            </div>

            {modalType === 'community' && (
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  To access the alumni community, you need to be a program member.
                  Currently, it seems you are not enrolled in any program.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Join our program to connect with successful alumni and build your professional network.
                </p>
              </div>
            )}

            {modalType === 'counseling' && (
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  To take a free counseling session worth $100, you need to be a program member.
                  Currently, it seems you are not enrolled in any program.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Take a program to become a member or talk to our program coordinator for more information.
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Explore Programs
              </button>
              <a
                href={`https://wa.me/918789698369?text=Hello, I'm ${user?.firstName || 'a student'} and I would like to know more about becoming a program member at UntraddCareer.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center"
              >
                Chat with Program Coordinator
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

  // Assignment Modal
      {showAssignmentModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Submit Assignment: {(selectedAssignment as { assignment: { title: string } }).assignment.title}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setAssignmentForm({
                      studentName: '',
                      submissionLink: '',
                      description: '',
                      notes: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.studentName}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, studentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                {/* Assignment Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Submission Link *
                  </label>
                  <input
                    type="url"
                    value={assignmentForm.submissionLink}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, submissionLink: e.target.value })}
                    placeholder="Paste your assignment submission link here (Google Drive, GitHub, etc.)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Description
                  </label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    placeholder="Briefly describe your assignment submission..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={assignmentForm.notes}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                    placeholder="Any additional notes or comments for your instructor..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                {/* Assignment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Assignment Details</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Week:</strong> {selectedAssignment?.week}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Title:</strong> {selectedAssignment?.assignment.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Description:</strong> {selectedAssignment?.assignment.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Max Score:</strong> {selectedAssignment?.assignment.maxScore} points
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setAssignmentForm({
                      studentName: '',
                      submissionLink: '',
                      description: '',
                      notes: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!assignmentForm.submissionLink.trim()}
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
}

export default Dashboard; 
