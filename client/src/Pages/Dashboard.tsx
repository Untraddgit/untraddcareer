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
  Bell,

  MapPin,
  DollarSign,
  X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../utils/axios';
import axios from 'axios';

interface UserProfile {
  branch: string;
  collegeName: string;
  principalName: string;
}

interface TestResult {
  score: number;
  completedAt: string;
  timeSpent: number;
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

const Dashboard = () => {
  const { user } = useUser();
  const { getToken, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasAttemptedTest, setHasAttemptedTest] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotification, setShowNotification] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'community' | 'counseling' | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchUserProfile();
    checkTestStatus();
    fetchTestHistory();
  }, [isLoaded, user]);

  const fetchUserProfile = async () => {
    try {
      const token = isLoaded ? await getToken() : null;
      const response = await api.get('/api/user-profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id }
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If profile not found, create a default one
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        try {
          const token = isLoaded ? await getToken() : null;
          const response = await api.post('/api/user-profile', {
            userId: user?.id,
            branch: 'BCA', // Default branch
            collegeName: 'Default College',
            principalName: 'Default Principal'
          }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          setUserProfile(response.data);
        } catch (createError) {
          console.error('Error creating default profile:', createError);
        }
      }
    }
  };

  const fetchTestHistory = async () => {
    try {
      const token = isLoaded ? await getToken() : null;
      const response = await api.get('/api/quiz-results', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id }
      });
      setTestHistory(response.data);
    } catch (error) {
      console.error('Error fetching test history:', error);
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
      const response = await api.get('/api/quiz-results/check-test-status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id }
      });
      setHasAttemptedTest(response.data.hasAttempted);
      if (response.data.hasAttempted) {
        setTestResult(response.data.latestResult);
      }
    } catch (error) {
      console.error('Error checking test status:', error);
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
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isCompleted ? 'bg-green-100 text-green-600' : 
          isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${
            isCompleted ? 'text-green-600' : 
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
    setModalType(null);
  };

    return (
      <>
        <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex justify-between items-start">
              <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome, {user?.firstName}! 👋</h1>
                  <p className="text-blue-100">
                    {userProfile ? `Your ${userProfile.branch} journey begins here at UntraddCareer` : 'Your journey begins here at UntraddCareer'}
                  </p>
              </div>
                
                {showNotification && (
                  <div className="hidden sm:block bg-white/20 px-4 py-3 rounded-lg max-w-xs">
                    <div className="flex items-start">
                      <Bell className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
              <div>
                        <p className="text-sm font-medium">Complete your scholarship test to unlock special discounts!</p>
              <button
                          onClick={() => setShowNotification(false)}
                          className="text-xs text-blue-100 mt-1 hover:text-white"
              >
                          Dismiss
              </button>
          </div>
        </div>
            </div>
                )}
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px px-4 sm:px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('scholarship')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                    activeTab === 'scholarship' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Scholarship
                </button>
              <button
                  onClick={() => setActiveTab('resources')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                    activeTab === 'resources' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Resources
              </button>
              </nav>
            </div>
            
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
                      {renderProgressStep(3, 'Explore Career Resources', false, hasAttemptedTest)}
                      <div className="ml-4 w-px h-6 bg-gray-200"></div>
                      {renderProgressStep(4, 'Join UntraddCareer Program', false, false)}
            </div>
          </div>
        </div>
                
                {/* Quick Actions Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : (
            <button
                          onClick={handleStartTest}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
                          Start Test
                          <ArrowRight className="ml-2 h-4 w-4" />
            </button>
                      )}
          </div>
        </div>
                  
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="text-purple-600 w-5 h-5" />
      </div>
                      <h3 className="ml-3 font-medium text-gray-900">Free Counseling</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Book a free career counseling session with our industry experts.
                    </p>
                    <button
                      onClick={() => openModal('counseling')}
                      className="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 flex items-center justify-center"
                    >
                      Book Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
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
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scholarship' && (
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
                              <div className="mt-3 flex">
                                <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center">
                                  Claim Your Scholarship
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
                          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 inline-flex items-center"
                        >
                          Start Scholarship Test
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
                          <p className="font-medium text-gray-900">5,000+</p>
              </div>
                        <p className="text-sm text-gray-600">Students received scholarships</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                          <p className="font-medium text-gray-900">92%</p>
                        </div>
                        <p className="text-sm text-gray-600">Placement success rate</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                          <p className="font-medium text-gray-900">₹5L - ₹12L</p>
                        </div>
                        <p className="text-sm text-gray-600">Annual package range</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Learning Resources</h2>
                  <p className="text-gray-600 mb-4">
                    Access exclusive study materials, tutorials, and career guidance resources to help you succeed.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-blue-50">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                        Study Materials
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="border-b border-gray-100 pb-2">
                          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                            <div className="bg-blue-100 p-1 rounded mr-3">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            Introduction to Programming Concepts
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                        <li className="border-b border-gray-100 pb-2">
                          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                            <div className="bg-blue-100 p-1 rounded mr-3">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            Web Development Fundamentals
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                        <li className="border-b border-gray-100 pb-2">
                          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                            <div className="bg-blue-100 p-1 rounded mr-3">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            Data Structures and Algorithms
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                            <div className="bg-blue-100 p-1 rounded mr-3">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            Interview Preparation Guide
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-purple-50">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        Upcoming Webinars
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="border-b border-gray-100 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-900 text-sm font-medium">Career Opportunities in AI & ML</p>
                              <p className="text-gray-500 text-xs">May 30, 2023 • 5:00 PM</p>
                            </div>
                            <button 
                              onClick={() => navigate('/#programs')}
                              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-2 rounded"
                            >
                              Register
                            </button>
                          </div>
                        </li>
                        <li className="border-b border-gray-100 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-900 text-sm font-medium">How to Build Your Portfolio</p>
                              <p className="text-gray-500 text-xs">June 2, 2023 • 6:00 PM</p>
                            </div>
                            <button 
                              onClick={() => navigate('/#programs')}
                              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-2 rounded"
                            >
                              Register
                            </button>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-900 text-sm font-medium">Resume Building Workshop</p>
                              <p className="text-gray-500 text-xs">June 10, 2023 • 4:00 PM</p>
                            </div>
                            <button 
                              onClick={() => navigate('/#programs')}
                              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-2 rounded"
                            >
                              Register
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
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
      </div>

      {/* Membership Required Modal */}
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
    </>
  );
};

export default Dashboard; 