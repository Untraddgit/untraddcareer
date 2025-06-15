import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Search,
  GraduationCap,
  LayoutDashboard,
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../utils/axios';

interface TestResult {
  _id: string;
  userId: string;
  studentName: string;
  score: number;
  completedAt: string;
  timeSpent: number;
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }>;
}

interface StudentData {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'student' | 'admin';
  plan?: string;
  createdAt: string;
}

interface UpcomingSession {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  link: string;
  isActive: boolean;
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

const AdminDashboard = () => {
  const { getToken } = useAuth();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'scholarship'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'tests' | 'courses' | 'sessions' | 'counselling'>('overview');
  
  // Counselling and feedback state
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [studentFeedback, setStudentFeedback] = useState<StudentFeedback[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    link: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Fetch test results
      const testsResponse = await api.get('/api/admin/test-results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch students
      const studentsResponse = await api.get('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch student feedback
      const feedbackResponse = await api.get('/api/admin/student-feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch courses
      const coursesResponse = await api.get('/api/predefined-courses/admin/predefined-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch upcoming sessions
      const sessionsResponse = await api.get('/api/admin/upcoming-sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTestResults(testsResponse.data);
      setStudents(studentsResponse.data);
      setStudentFeedback(feedbackResponse.data);
      setCourses(coursesResponse.data);
      setUpcomingSessions(sessionsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScholarshipLevel = (score: number) => {
    if (score >= 80) return { level: '15%', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { level: '10%', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { level: '5%', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'None', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterScore === 'all' || 
                         (filterScore === 'high' && result.score >= 70) ||
                         (filterScore === 'scholarship' && result.score >= 60);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const premiumStudentCard = (student: StudentData) => (
    <div key={student.clerkId} className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{student.firstName} {student.lastName}</h4>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
          Premium
        </div>
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => {
            // Simple feedback recording - could be expanded
            alert('Feedback recording feature coming soon!');
          }}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          Record Feedback
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage students, tests, and counselling sessions</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Students
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tests'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Test Results
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('counselling')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'counselling'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <GraduationCap className="w-4 h-4 inline mr-2" />
              Counselling & Feedback
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tests Taken</p>
                    <p className="text-2xl font-bold text-gray-900">{testResults.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Performers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {testResults.filter(r => r.score >= 70).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Premium Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.filter(s => s.plan === 'premium').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.clerkId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.plan === 'premium' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.plan || 'Free'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(student.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by student name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={filterScore}
                    onChange={(e) => setFilterScore(e.target.value as 'all' | 'high' | 'scholarship')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High Performers (70%+)</option>
                    <option value="scholarship">Scholarship Eligible (60%+)</option>
                  </select>
                </div>
              </div>

              {/* Test Results */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scholarship
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.map((result) => {
                        const scholarship = getScholarshipLevel(result.score);
                        return (
                          <tr key={result._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                              <div className="text-sm text-gray-500">{result.userId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{result.score}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${scholarship.bg} ${scholarship.color}`}>
                                {scholarship.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatTime(result.timeSpent)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(result.completedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Management</h3>
                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{course.displayName || course.courseName}</h4>
                          <p className="text-sm text-gray-500">{course.courseDescription}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.durationWeeks} weeks • {course.liveClassesPerWeek} classes/week
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            View Details
                          </button>
                          <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions Management</h2>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Session
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">All Sessions</h4>
                <div className="space-y-3">
                  {upcomingSessions.map(session => (
                    <div key={session._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{session.title}</h5>
                        <p className="text-sm text-gray-500">{session.description}</p>
                        <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          session.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {session.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Join
                        </a>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this session?')) {
                              try {
                                const token = await getToken();
                                await api.delete(`/api/admin/upcoming-sessions/${session._id}`, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                setUpcomingSessions(upcomingSessions.filter(s => s._id !== session._id));
                              } catch (error) {
                                console.error('Error deleting session:', error);
                                alert('Error deleting session');
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No sessions scheduled yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Counselling Tab */}
          {activeTab === 'counselling' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Counselling & Feedback</h2>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </button>
              </div>

              {/* Premium Students */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Premium Students</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.filter(student => student.plan === 'premium').map(student => 
                    premiumStudentCard(student)
                  )}
                </div>
              </div>

              {/* Student Feedback */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Feedback</h4>
                <div className="space-y-4">
                  {studentFeedback.map((feedback, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{feedback.name}</h5>
                          <p className="text-sm text-gray-500">{feedback.college} - {feedback.semester}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Course:</strong> {feedback.courseChosen}</p>
                          <p><strong>Three Words:</strong> {feedback.threeWords.join(', ')}</p>
                          <p><strong>English:</strong> {feedback.englishRating}/10</p>
                          <p><strong>Hindi:</strong> {feedback.hindiRating}/10</p>
                        </div>
                        <div>
                          <p><strong>Strengths:</strong> {feedback.strengths}</p>
                          <p><strong>Areas to Improve:</strong> {feedback.areasOfImprovement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Session</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = await getToken();
                const response = await api.post('/api/admin/upcoming-sessions', sessionForm, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setUpcomingSessions([...upcomingSessions, response.data]);
                setShowSessionModal(false);
                setSessionForm({ title: '', description: '', date: '', time: '', link: '' });
                alert('Session scheduled successfully!');
              } catch (error) {
                console.error('Error scheduling session:', error);
                alert('Error scheduling session. Please try again.');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                <input
                  type="url"
                  value={sessionForm.link}
                  onChange={(e) => setSessionForm({ ...sessionForm, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 