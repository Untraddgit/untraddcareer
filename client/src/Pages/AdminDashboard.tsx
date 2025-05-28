import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  Users, 
  Award, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  DollarSign
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
  createdAt: string;
}

interface DashboardStats {
  totalStudents: number;
  totalTestsTaken: number;
  averageScore: number;
  scholarshipEligible: number;
  highPerformers: number; // 70%+
  topPerformers: number; // 80%+
}

const AdminDashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTestsTaken: 0,
    averageScore: 0,
    scholarshipEligible: 0,
    highPerformers: 0,
    topPerformers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'scholarship'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'tests'>('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Fetch all test results
      const testsResponse = await api.get('/api/admin/test-results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch all students
      const studentsResponse = await api.get('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTestResults(testsResponse.data);
      setStudents(studentsResponse.data);
      
      // Calculate stats
      calculateStats(testsResponse.data, studentsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tests: TestResult[], studentList: StudentData[]) => {
    const totalTests = tests.length;
    const totalStudents = studentList.length;
    const averageScore = totalTests > 0 ? tests.reduce((sum, test) => sum + test.score, 0) / totalTests : 0;
    const scholarshipEligible = tests.filter(test => test.score >= 60).length;
    const highPerformers = tests.filter(test => test.score >= 70).length;
    const topPerformers = tests.filter(test => test.score >= 80).length;

    setStats({
      totalStudents,
      totalTestsTaken: totalTests,
      averageScore: Math.round(averageScore * 100) / 100,
      scholarshipEligible,
      highPerformers,
      topPerformers
    });
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Admin Dashboard 👨‍💼</h1>
              <p className="text-purple-100">Monitor student performance and scholarship eligibility</p>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex -mb-px px-4 sm:px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'overview' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'students' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Students
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'tests' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Award className="h-4 w-4 mr-2" />
                Test Results
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents}</h3>
                    </div>
                    <Users className="text-blue-600 w-8 h-8 opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tests Taken</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.totalTestsTaken}</h3>
                    </div>
                    <Award className="text-green-600 w-8 h-8 opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average Score</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.averageScore}%</h3>
                    </div>
                    <TrendingUp className="text-purple-600 w-8 h-8 opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Scholarship Eligible</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.scholarshipEligible}</h3>
                    </div>
                    <GraduationCap className="text-orange-600 w-8 h-8 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">Top Performers (80%+)</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{stats.topPerformers}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">High Performers (70%+)</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{stats.highPerformers}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">Scholarship Eligible (60%+)</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">{stats.scholarshipEligible}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Activity</h3>
                  <div className="space-y-3">
                    {testResults.slice(0, 5).map((result) => (
                      <div key={result._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{result.studentName}</p>
                          <p className="text-xs text-gray-500">{formatDate(result.completedAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{result.score}%</p>
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getScholarshipLevel(result.score).bg} ${getScholarshipLevel(result.score).color}`}>
                            {getScholarshipLevel(result.score).level}
                          </div>
                        </div>
                      </div>
                    ))}
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
                <p className="text-gray-600 mt-1">Manage and view all registered students</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => {
                    const studentTest = testResults.find(test => test.userId === student.clerkId);
                    return (
                      <div key={student.clerkId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{student.firstName} {student.lastName}</h4>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.userType === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {student.userType}
                          </div>
                        </div>
                        
                        {studentTest ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Test Score:</span>
                              <span className="font-medium">{studentTest.score}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Scholarship:</span>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${getScholarshipLevel(studentTest.score).bg} ${getScholarshipLevel(studentTest.score).color}`}>
                                {getScholarshipLevel(studentTest.score).level}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-sm text-gray-500">No test taken yet</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Test Results Tab */}
          {activeTab === 'tests' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
                    <p className="text-gray-600 mt-1">Detailed view of all scholarship test results</p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={filterScore}
                      onChange={(e) => setFilterScore(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Scores</option>
                      <option value="scholarship">Scholarship Eligible (60%+)</option>
                      <option value="high">High Performers (70%+)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((result) => {
                      const scholarship = getScholarshipLevel(result.score);
                      return (
                        <tr key={result._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                              <div className="text-sm text-gray-500">{result.userId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{result.score}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${scholarship.bg} ${scholarship.color}`}>
                              {scholarship.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(result.timeSpent)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(result.completedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900 flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No test results found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 