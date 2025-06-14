import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Users, 
  Award, 
  BarChart3, 
  TrendingUp, 
  Search,
  Eye,
  GraduationCap,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  LayoutDashboard,
  FileText,
  Calendar,
  ExternalLink
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

interface DashboardStats {
  totalStudents: number;
  totalTestsTaken: number;
  averageScore: number;
  scholarshipEligible: number;
  highPerformers: number; // 70%+
  topPerformers: number; // 80%+
}

interface Task {
  title: string;
  description: string;
  estimatedTime: number;
  estimatedTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
  resources?: string[];
}

interface Subtopic {
  title: string;
  description: string;
  estimatedTime: number;
  estimatedTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
  tasks: Task[];
  resources?: string[];
}

interface Topic {
  title: string;
  description: string;
  estimatedWeeks: number;
  estimatedTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
  subtopics: Subtopic[];
  resources?: string[];
}

interface Course {
  _id?: string;
  courseName: string;
  displayName: string;
  description: string;
  topics: Topic[];
  totalDuration: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

interface PredefinedCourseResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'document' | 'tool' | 'other';
}

interface PredefinedCourseAssignment {
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
  projects: (string | { title: string; description?: string })[];
  liveClassTopics: string[];
  resources?: PredefinedCourseResource[];
  assignments?: PredefinedCourseAssignment[];
}

interface PredefinedCourse {
  _id: string;
  courseName: string;
  displayName?: string;
  durationWeeks: number;
  effortPerWeek: string;
  liveClassesPerWeek: number;
  courseDescription: string;
  weeklyRoadmap: PredefinedCourseWeek[];
  toolsAndTechnologies: any;
  expectedOutcomes: string[];
  isActive: boolean;
}

interface StudentWithProgress {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  course: string;
  progress: {
    overallProgress: number;
    currentWeek: number;
    completedModules: number;
    totalModules: number;
  } | null;
}

interface AssignmentSubmission {
  _id: string;
  studentId: string;
  courseId: string;
  student: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assignmentId: string;
  assignmentTitle: string;
  week: number;
  status: 'pending' | 'graded' | 'needs_revision';
  score?: number;
  maxScore: number;
  submissionText?: string;
  submissionFiles?: string[];
  submissionLink: string;
  feedback?: string;
  submittedAt: string;
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

interface CounsellingSession {
  _id: string;
  studentId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: string;
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { getToken } = useAuth();
  
  // Time unit options
  const timeUnitOptions = [
    { value: 'hours', label: 'Hours', shortLabel: 'hrs' },
    { value: 'days', label: 'Days', shortLabel: 'days' },
    { value: 'weeks', label: 'Weeks', shortLabel: 'weeks' },
    { value: 'months', label: 'Months', shortLabel: 'months' }
  ] as const;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'tests' | 'counselling' | 'course-management'>('overview');
  
  // Course management state
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<Course>({
    courseName: '',
    displayName: '',
    description: '',
    topics: [],
    totalDuration: 0
  });

  // Predefined course management state
  const [predefinedCourses, setPredefinedCourses] = useState<PredefinedCourse[]>([]);
  const [selectedPredefinedCourse, setSelectedPredefinedCourse] = useState<string>('');
  const [courseStudents, setCourseStudents] = useState<StudentWithProgress[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>([]);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [resourceForm, setResourceForm] = useState<PredefinedCourseResource>({
    title: '',
    url: '',
    type: 'article'
  });
  const [assignmentForm, setAssignmentForm] = useState<PredefinedCourseAssignment>({
    title: '',
    description: '',
    maxScore: 100,
    instructions: ''
  });

  // Add these states after other states
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentSubmissions, setStudentSubmissions] = useState<AssignmentSubmission[]>([]);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  // Add this after other states
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    link: ''
  });

  const [counsellingSessions, setCounsellingSessions] = useState<CounsellingSession[]>([]);
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [counsellingForm, setCounsellingForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<StudentFeedback>({
    studentId: '',
    name: '',
    semester: '',
    college: '',
    threeWords: ['', '', ''],
    strengths: '',
    areasOfImprovement: '',
    stressHandling: '',
    motivation: '',
    englishRating: 5,
    hindiRating: 5,
    confidence: '',
    decisionMaking: '',
    biggestAchievement: '',
    turningPoint: '',
    conflicts: '',
    futureConcern: '',
    alignInThoughts: '',
    courseChosen: '',
    createdAt: ''
  });

  const [studentFeedback, setStudentFeedback] = useState<StudentFeedback[]>([]);

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
      
      // Fetch all courses
      const coursesResponse = await api.get('/api/courses/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch predefined courses
      const predefinedCoursesResponse = await api.get('/api/predefined-courses/admin/predefined-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch student feedback
      const feedbackResponse = await api.get('/api/admin/student-feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTestResults(testsResponse.data);
      setStudents(studentsResponse.data);
      setCourses(coursesResponse.data);
      setPredefinedCourses(predefinedCoursesResponse.data);
      setStudentFeedback(feedbackResponse.data);
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

  // Course management functions
  const handleCreateCourse = () => {
    setCourseForm({
      courseName: '',
      displayName: '',
      description: '',
      topics: [],
      totalDuration: 0
    });
    setEditingCourse(null);
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setCourseForm(course);
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    try {
      const token = await getToken();
      
      console.log('Saving course with data:', courseForm);
      
      if (editingCourse) {
        // Update existing course
        await api.put(`/api/courses/admin/courses/${editingCourse.courseName}`, courseForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new course
        await api.post('/api/courses/admin/courses', courseForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Refresh courses
      const coursesResponse = await api.get('/api/courses/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(coursesResponse.data);
      
      setShowCourseModal(false);
      alert('Course saved successfully!');
    } catch (error: any) {
      console.error('Error saving course:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      let errorMessage = 'Error saving course. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = `Server Error: ${error.response.data.message}`;
      } else if (error.response?.data?.error) {
        errorMessage = `Validation Error: ${error.response.data.error}`;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid course data. Please check all required fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check server logs.';
      }
      
      // Add detailed error info for debugging
      if (error.response?.data) {
        console.log('Full server response:', JSON.stringify(error.response.data, null, 2));
        errorMessage += `\n\nDebug Info: ${JSON.stringify(error.response.data).substring(0, 200)}...`;
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteCourse = async (courseName: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all student progress.')) {
      return;
    }
    
    try {
      const token = await getToken();
      await api.delete(`/api/courses/admin/courses/${courseName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses(courses.filter(c => c.courseName !== courseName));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course. Please try again.');
    }
  };

  const addTopic = () => {
    setCourseForm({
      ...courseForm,
      topics: [...courseForm.topics, {
        title: '',
        description: '',
        estimatedWeeks: 1,
        estimatedTimeUnit: 'weeks',
        subtopics: []
      }]
    });
  };

  const addSubtopic = (topicIndex: number) => {
    const updatedTopics = [...courseForm.topics];
    updatedTopics[topicIndex].subtopics.push({
      title: '',
      description: '',
      estimatedTime: 1,
      estimatedTimeUnit: 'weeks',
      tasks: []
    });
    setCourseForm({ ...courseForm, topics: updatedTopics });
  };

  const addTask = (topicIndex: number, subtopicIndex: number) => {
    const updatedTopics = [...courseForm.topics];
    updatedTopics[topicIndex].subtopics[subtopicIndex].tasks.push({
      title: '',
      description: '',
      estimatedTime: 30,
      estimatedTimeUnit: 'hours',
      resources: []
    });
    setCourseForm({ ...courseForm, topics: updatedTopics });
  };

  const addTopicResource = (topicIndex: number) => {
    const updatedTopics = [...courseForm.topics];
    if (!updatedTopics[topicIndex].resources) {
      updatedTopics[topicIndex].resources = [];
    }
    updatedTopics[topicIndex].resources!.push('');
    setCourseForm({ ...courseForm, topics: updatedTopics });
  };

  const updateTopicResource = (topicIndex: number, resourceIndex: number, value: string) => {
    const updatedTopics = [...courseForm.topics];
    if (updatedTopics[topicIndex].resources) {
      updatedTopics[topicIndex].resources![resourceIndex] = value;
      setCourseForm({ ...courseForm, topics: updatedTopics });
    }
  };

  const removeTopicResource = (topicIndex: number, resourceIndex: number) => {
    const updatedTopics = [...courseForm.topics];
    if (updatedTopics[topicIndex].resources) {
      updatedTopics[topicIndex].resources!.splice(resourceIndex, 1);
      setCourseForm({ ...courseForm, topics: updatedTopics });
    }
  };

  const addSubtopicResource = (topicIndex: number, subtopicIndex: number) => {
    const updatedTopics = [...courseForm.topics];
    if (!updatedTopics[topicIndex].subtopics[subtopicIndex].resources) {
      updatedTopics[topicIndex].subtopics[subtopicIndex].resources = [];
    }
    updatedTopics[topicIndex].subtopics[subtopicIndex].resources!.push('');
    setCourseForm({ ...courseForm, topics: updatedTopics });
  };

  const updateSubtopicResource = (topicIndex: number, subtopicIndex: number, resourceIndex: number, value: string) => {
    const updatedTopics = [...courseForm.topics];
    if (updatedTopics[topicIndex].subtopics[subtopicIndex].resources) {
      updatedTopics[topicIndex].subtopics[subtopicIndex].resources![resourceIndex] = value;
      setCourseForm({ ...courseForm, topics: updatedTopics });
    }
  };

  const removeSubtopicResource = (topicIndex: number, subtopicIndex: number, resourceIndex: number) => {
    const updatedTopics = [...courseForm.topics];
    if (updatedTopics[topicIndex].subtopics[subtopicIndex].resources) {
      updatedTopics[topicIndex].subtopics[subtopicIndex].resources!.splice(resourceIndex, 1);
      setCourseForm({ ...courseForm, topics: updatedTopics });
    }
  };

  // Predefined course management functions
  const fetchCourseStudents = async (courseName: string) => {
    try {
      const token = await getToken();
      const response = await api.get(`/api/predefined-courses/admin/predefined-courses/${courseName}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseStudents(response.data);
    } catch (error) {
      console.error('Error fetching course students:', error);
    }
  };

  const fetchAssignmentSubmissions = async (courseName: string) => {
    try {
      const token = await getToken();
      console.log('Fetching all submissions');
      
      // Fetch all submissions
      const response = await api.get('/api/predefined-courses/admin/all-submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Raw submission data:', response.data);
      setAssignmentSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
      alert('Error fetching assignment submissions. Please try again.');
    }
  };

  const handleCourseSelect = (courseName: string) => {
    setSelectedPredefinedCourse(courseName);
    fetchCourseStudents(courseName);
    fetchAssignmentSubmissions(courseName);
  };

  const handleAddResource = async () => {
    try {
      const token = await getToken();
      await api.post(`/api/predefined-courses/admin/predefined-courses/${selectedPredefinedCourse}/weeks/${selectedWeek}/resources`, resourceForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh predefined courses
      const response = await api.get('/api/predefined-courses/admin/predefined-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPredefinedCourses(response.data);
      
      setShowResourceModal(false);
      setResourceForm({ title: '', url: '', type: 'article' });
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Error adding resource. Please try again.');
    }
  };

  const handleAddAssignment = async () => {
    try {
      const token = await getToken();
      await api.post(`/api/predefined-courses/admin/predefined-courses/${selectedPredefinedCourse}/weeks/${selectedWeek}/assignments`, assignmentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh predefined courses
      const response = await api.get('/api/predefined-courses/admin/predefined-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPredefinedCourses(response.data);
      
      setShowAssignmentModal(false);
      setAssignmentForm({ title: '', description: '', maxScore: 100, instructions: '' });
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('Error adding assignment. Please try again.');
    }
  };

  const handleMarkModuleComplete = async (studentId: string, week: number, isCompleted: boolean, notes: string = '') => {
    try {
      const token = await getToken();
      await api.put(`/api/predefined-courses/admin/predefined-courses/${selectedPredefinedCourse}/students/${studentId}/modules/${week}`, {
        isCompleted,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh course students
      fetchCourseStudents(selectedPredefinedCourse);
    } catch (error) {
      console.error('Error updating module completion:', error);
      alert('Error updating module completion. Please try again.');
    }
  };

  const handleGradeAssignment = async (submissionId: string, score: number, feedback: string, status: 'graded' | 'needs_revision') => {
    try {
      const response = await fetch(`${API_URL}/api/assignments/${submissionId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        score,
        feedback,
          status,
        }),
      });

      if (!response.ok) throw new Error('Failed to grade assignment');

      // Update local state
      setAssignmentSubmissions(prev => 
        prev.map(submission => 
          submission._id === submissionId 
            ? { ...submission, score, feedback, status }
            : submission
        )
      );

      alert('Assignment graded successfully');
    } catch (error) {
      console.error('Error grading assignment:', error);
      alert('Failed to grade assignment');
    }
  };

  // Add this function after other handlers
  const handleViewSubmissions = async (studentId: string) => {
    try {
      const token = await getToken();
      console.log('Fetching submissions for student:', studentId);
      
      // Get all submissions and filter for this student
      const response = await api.get('/api/predefined-courses/admin/all-submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('All submissions:', response.data);
      
      // Filter submissions for this student
      const studentSubmissions = response.data.filter(
        (submission: any) => submission.studentId === studentId
      );
      
      console.log('Filtered student submissions:', studentSubmissions);
      setStudentSubmissions(studentSubmissions);
      setSelectedStudent(studentId);
      setShowSubmissionsModal(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Error fetching submissions. Please try again.');
    }
  };

  const handleUpdateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', feedback: string) => {
    try {
      const token = await getToken();
      await api.put(`/api/predefined-courses/admin/predefined-courses/${selectedPredefinedCourse}/submissions/${submissionId}`, {
        status,
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh submissions
      if (selectedStudent) {
        handleViewSubmissions(selectedStudent);
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Error updating submission. Please try again.');
    }
  };

  const handleDeleteResource = async (week: number, resourceIndex: number) => {
    try {
      const course = predefinedCourses.find(c => c.courseName === selectedPredefinedCourse);
      if (!course) return;

      const updatedResources = [...(course.weeklyRoadmap[week - 1].resources || [])];
      updatedResources.splice(resourceIndex, 1);

      const response = await fetch(`${API_URL}/api/predefined-courses/${course.courseName}/resources`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week,
          resources: updatedResources,
        }),
      });

      if (!response.ok) throw new Error('Failed to delete resource');
      
      // Update local state
      const updatedCourses = predefinedCourses.map(c => {
        if (c.courseName === selectedPredefinedCourse) {
          const updatedRoadmap = [...c.weeklyRoadmap];
          updatedRoadmap[week - 1] = {
            ...updatedRoadmap[week - 1],
            resources: updatedResources,
          };
          return { ...c, weeklyRoadmap: updatedRoadmap };
        }
        return c;
      });
      setPredefinedCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const handleDeleteAssignment = async (week: number, assignmentIndex: number) => {
    try {
      const course = predefinedCourses.find(c => c.courseName === selectedPredefinedCourse);
      if (!course) return;

      const updatedAssignments = [...(course.weeklyRoadmap[week - 1].assignments || [])];
      updatedAssignments.splice(assignmentIndex, 1);

      const response = await fetch(`${API_URL}/api/predefined-courses/${course.courseName}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week,
          assignments: updatedAssignments,
        }),
      });

      if (!response.ok) throw new Error('Failed to delete assignment');
      
      // Update local state
      const updatedCourses = predefinedCourses.map(c => {
        if (c.courseName === selectedPredefinedCourse) {
          const updatedRoadmap = [...c.weeklyRoadmap];
          updatedRoadmap[week - 1] = {
            ...updatedRoadmap[week - 1],
            assignments: updatedAssignments,
          };
          return { ...c, weeklyRoadmap: updatedRoadmap };
        }
        return c;
      });
      setPredefinedCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  // Add this after other useEffect hooks
  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/api/admin/upcoming-sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcomingSessions(response.data);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
    }
  };

  const handleAddSession = async () => {
    try {
      const token = await getToken();
      const response = await api.post('/api/admin/upcoming-sessions', sessionForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setShowSessionModal(false);
        setSessionForm({
          title: '',
          description: '',
          date: '',
          time: '',
          link: ''
        });
        
        fetchUpcomingSessions();
      }
    } catch (error: any) {
      console.error('Error adding session:', error);
      let errorMessage = 'Error adding session. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Session creation endpoint not found. Please contact support.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const token = await getToken();
      await api.delete(`/api/admin/upcoming-sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchUpcomingSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Error deleting session. Please try again.');
    }
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
            setSelectedStudent(student.clerkId);
            setFeedbackForm(prev => ({
              ...prev,
              studentId: student.clerkId,
              name: `${student.firstName} ${student.lastName}`
            }));
            setShowFeedbackModal(true);
          }}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          Record Feedback
        </button>
      </div>
    </div>
  );

  const feedbackModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Feedback Form</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const token = await getToken();
            await api.post('/api/admin/student-feedback', feedbackForm, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setShowFeedbackModal(false);
            alert('Feedback saved successfully!');
          } catch (error) {
            console.error('Error saving feedback:', error);
            alert('Error saving feedback. Please try again.');
          }
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <input
                type="text"
                value={feedbackForm.semester}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
              <input
                type="text"
                value={feedbackForm.college}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, college: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe yourself in 3 words</label>
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <input
                    key={index}
                    type="text"
                    value={feedbackForm.threeWords[index]}
                    onChange={(e) => {
                      const newWords = [...feedbackForm.threeWords];
                      newWords[index] = e.target.value;
                      setFeedbackForm(prev => ({ ...prev, threeWords: newWords }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
            <textarea
              value={feedbackForm.strengths}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, strengths: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Improvement</label>
            <textarea
              value={feedbackForm.areasOfImprovement}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, areasOfImprovement: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stress / Failure Handling</label>
            <textarea
              value={feedbackForm.stressHandling}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, stressHandling: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivation to Study and Work Hard</label>
            <textarea
              value={feedbackForm.motivation}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, motivation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={feedbackForm.englishRating}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, englishRating: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hindi (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={feedbackForm.hindiRating}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, hindiRating: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confidence</label>
            <textarea
              value={feedbackForm.confidence}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, confidence: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decision Making</label>
            <textarea
              value={feedbackForm.decisionMaking}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, decisionMaking: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biggest Achievement</label>
            <textarea
              value={feedbackForm.biggestAchievement}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, biggestAchievement: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Turning Point</label>
            <textarea
              value={feedbackForm.turningPoint}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, turningPoint: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conflicts</label>
            <textarea
              value={feedbackForm.conflicts}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, conflicts: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Future Concern</label>
            <textarea
              value={feedbackForm.futureConcern}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, futureConcern: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Align in Thoughts, Decisions</label>
            <textarea
              value={feedbackForm.alignInThoughts}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, alignInThoughts: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Chosen</label>
            <input
              type="text"
              value={feedbackForm.courseChosen}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, courseChosen: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowFeedbackModal(false);
                setSelectedStudent(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="/logo.png" 
                alt="UntraddCareer Logo" 
                className="h-16 w-16 object-contain mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900 mb-2">UntraddCareer</h2>
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading admin dashboard...</p>
          </div>
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
            <nav className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'overview' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
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
                <FileText className="h-4 w-4 mr-2" />
                Tests
              </button>
              <button
                onClick={() => setActiveTab('counselling')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'counselling' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Counselling & Feedback
              </button>
              <button
                onClick={() => setActiveTab('course-management')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === 'course-management' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Course Management
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

                        {/* Add this inside the student list section */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewSubmissions(student.clerkId)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            View Submissions
                          </button>
                        </div>
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

          {/* Counselling and Feedback Tab */}
          {activeTab === 'counselling' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Counselling and Feedback</h3>
                    <p className="text-gray-600 mt-1">Manage counselling sessions for premium students</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Premium Students</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.filter(student => student.plan === 'premium').map((student) => (
                      premiumStudentCard(student)
                    ))}
                    {students.filter(student => student.plan === 'premium').length === 0 && (
                      <div className="col-span-3 text-center py-8">
                        <p className="text-gray-500">No premium students found.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Scheduled Sessions</h4>
                  <div className="space-y-4">
                    {counsellingSessions.map((session) => {
                      const student = students.find(s => s.clerkId === session.studentId);
                      return (
                        <div key={session._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {student?.firstName} {student?.lastName}
                              </h5>
                              <div className="text-sm text-gray-500 mt-1">
                                {new Date(session.scheduledDate).toLocaleDateString()} at {session.scheduledTime}
                              </div>
                              {session.notes && (
                                <p className="text-sm text-gray-600 mt-2">
                                  Notes: {session.notes}
                                </p>
                              )}
                    </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </div>
                          </div>
                          {session.status === 'scheduled' && (
                            <div className="mt-4 flex space-x-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const token = await getToken();
                                    await api.put(`/api/admin/counselling-sessions/${session._id}`, {
                                      status: 'completed',
                                      feedback: prompt('Enter session feedback:')
                                    }, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    fetchAdminData();
                                  } catch (error) {
                                    console.error('Error updating session:', error);
                                    alert('Error updating session. Please try again.');
                                  }
                                }}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Mark Complete
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm('Are you sure you want to cancel this session?')) return;
                                  try {
                                    const token = await getToken();
                                    await api.put(`/api/admin/counselling-sessions/${session._id}`, {
                                      status: 'cancelled'
                                    }, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    fetchAdminData();
                                  } catch (error) {
                                    console.error('Error cancelling session:', error);
                                    alert('Error cancelling session. Please try again.');
                                  }
                                }}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Cancel Session
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Feedback History</h4>
                  <div className="space-y-4">
                    {studentFeedback.map((feedback) => {
                      const student = students.find(s => s.clerkId === feedback.studentId);
                      return (
                        <div key={feedback.studentId} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {feedback.name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {student?.email}
                              </p>
                              <div className="mt-4 space-y-2">
                                <div>
                                  <span className="text-sm font-medium text-gray-700">College:</span>
                                  <span className="text-sm text-gray-600 ml-2">{feedback.college}</span>
                  </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Semester:</span>
                                  <span className="text-sm text-gray-600 ml-2">{feedback.semester}</span>
                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Three Words:</span>
                                  <span className="text-sm text-gray-600 ml-2">{feedback.threeWords.join(', ')}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Course Chosen:</span>
                                  <span className="text-sm text-gray-600 ml-2">{feedback.courseChosen}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Language Proficiency:</span>
                                  <div className="text-sm text-gray-600 ml-2">
                                    English: {feedback.englishRating}/10, Hindi: {feedback.hindiRating}/10
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedStudent(feedback.studentId);
                              setFeedbackForm(feedback);
                              setShowFeedbackModal(true);
                            }}
                            className="mt-4 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                          >
                            View/Edit Feedback
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'course-management') && (
            <div className="space-y-6">
              {/* Course Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                            <select
                      value={selectedPredefinedCourse}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Choose a course to manage</option>
                      {predefinedCourses.map(course => (
                        <option key={course.courseName} value={course.courseName}>
                          {course.displayName || course.courseName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
              {selectedPredefinedCourse && (
                <>
                  {/* Course Modules */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h4>
                    <div className="space-y-4">
                      {predefinedCourses.find(c => c.courseName === selectedPredefinedCourse)?.weeklyRoadmap.map((week, weekIndex) => (
                        <div key={weekIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="font-medium text-gray-900">Week {week.week}: {week.title}</h5>
                            <div className="flex space-x-2">
                          <button
                                onClick={() => {
                                  setSelectedWeek(week.week);
                                  setShowResourceModal(true);
                                }}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                            Add Resource
                          </button>
                              <button
                                onClick={() => {
                                  setSelectedWeek(week.week);
                                  setShowAssignmentModal(true);
                                }}
                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                              >
                                Add Assignment
                              </button>
                        </div>
                      </div>
                      
                          {/* Topics */}
                          <div className="mb-4">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">Topics</h6>
                            <div className="space-y-1">
                              {week.topics.map((topic, topicIndex) => (
                                <div key={topicIndex} className="text-sm text-gray-600">• {topic}</div>
                              ))}
                                </div>
                              </div>
                              
                          {/* Resources */}
                          {week.resources && week.resources.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Resources</h6>
                              <div className="space-y-2">
                                {week.resources.map((resource, resourceIndex) => (
                                  <div key={resourceIndex} className="bg-gray-50 rounded p-2 flex justify-between items-center">
                                    <div>
                                      <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                      >
                                        {resource.title}
                                      </a>
                                      <span className="text-xs text-gray-500 ml-2 capitalize">{resource.type}</span>
                                </div>
                                      <button
                                      onClick={() => handleDeleteResource(week.week, resourceIndex)}
                                      className="text-red-600 hover:text-red-800"
                                      >
                                      <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                          )}

                          {/* Assignments */}
                          {week.assignments && week.assignments.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Assignments</h6>
                                <div className="space-y-2">
                                {week.assignments.map((assignment, assignmentIndex) => (
                                  <div key={assignmentIndex} className="bg-gray-50 rounded p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                        <h6 className="text-sm font-medium text-gray-900">{assignment.title}</h6>
                                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                        {assignment.dueDate && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                          </p>
                                        )}
                                          </div>
              <button
                                        onClick={() => handleDeleteAssignment(week.week, assignmentIndex)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
                                ))}
              </div>
              </div>
                          )}
                        </div>
                      ))}
            </div>
          </div>

              {/* Students Progress */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Students Progress</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courseStudents.map(student => (
                        <tr key={student.clerkId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{student.progress?.overallProgress || 0}%</div>
                          </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Week {student.progress?.currentWeek || 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleViewSubmissions(student.clerkId)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  View Submissions
                                </button>
                            <button
                              onClick={() => {
                                const week = prompt('Enter week number to mark as complete:');
                                const notes = prompt('Enter completion notes (optional):') || '';
                                if (week) {
                                  handleMarkModuleComplete(student.clerkId, parseInt(week), true, notes);
                                }
                              }}
                                  className="text-green-600 hover:text-green-900"
                            >
                              Mark Complete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assignment Submissions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Assignment Submissions</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignmentSubmissions.map(submission => (
                            <tr key={submission._id} className="border-t">
                              <td className="py-2">
                                {submission.student.firstName} {submission.student.lastName}
                                <br />
                                <span className="text-sm text-gray-500">{submission.student.email}</span>
                          </td>
                              <td className="py-2">{submission.assignmentTitle}</td>
                              <td className="py-2">Week {submission.week}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                              submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                              submission.status === 'needs_revision' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                            }`}>
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                          </td>
                              <td className="py-2">
                                {submission.score !== undefined ? `${submission.score}/${submission.maxScore}` : '-'}
                          </td>
                              <td className="py-2">
                                <div className="flex gap-2">
                            <button
                                    onClick={() => handleGradeAssignment(submission._id, submission.score || 0, submission.feedback || '', submission.status as 'graded' | 'needs_revision')}
                                    className="text-blue-600 hover:text-blue-800"
                            >
                              Grade
                            </button>
                            <button
                                    onClick={() => handleViewSubmissions(submission.studentId)}
                                    className="text-green-600 hover:text-green-800"
                            >
                              View
                            </button>
                                </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
        </div>
      </div>

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Resource</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Resource title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={resourceForm.type}
                  onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="document">Document</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowResourceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResource}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Detailed instructions for the assignment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                <input
                  type="number"
                  value={assignmentForm.maxScore}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, maxScore: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="100"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Detailed instructions for the assignment"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Details Modal */}
      {showSubmissionsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assignment Submissions
                </h3>
                <button
                  onClick={() => {
                    setShowSubmissionsModal(false);
                    setSelectedStudent(null);
                    setStudentSubmissions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {studentSubmissions.map((submission: any) => (
                  <div key={submission._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Week {submission.week}</h4>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                          submission.status === 'needs_revision' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Submission Link:</h5>
                      <a
                        href={submission.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {submission.submissionLink}
                      </a>
                    </div>
                    
                    {submission.feedback && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h5>
                        <p className="text-sm text-gray-600">{submission.feedback}</p>
                      </div>
                    )}
                    
                    {submission.score !== undefined && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Score:</h5>
                        <p className="text-sm text-gray-600">{submission.score}/{submission.maxScore}</p>
                    </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Sessions Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
          <button
            onClick={() => setShowSessionModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Session
          </button>
        </div>
        
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{session.title}</h4>
                  {session.description && (
                    <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(session.date).toLocaleDateString()} at {session.time}
                  </div>
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Session Link
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteSession(session._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Session title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Session description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                <input
                  type="url"
                  value={sessionForm.link}
                  onChange={(e) => setSessionForm({ ...sessionForm, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Session link (e.g., Zoom, Google Meet)"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSession}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counselling Modal */}
      {showCounsellingModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Counselling Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <div className="text-sm text-gray-900">
                  {students.find(s => s.clerkId === selectedStudent)?.firstName} {students.find(s => s.clerkId === selectedStudent)?.lastName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={counsellingForm.scheduledDate}
                  onChange={(e) => setCounsellingForm({ ...counsellingForm, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={counsellingForm.scheduledTime}
                  onChange={(e) => setCounsellingForm({ ...counsellingForm, scheduledTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={counsellingForm.notes}
                  onChange={(e) => setCounsellingForm({ ...counsellingForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes or topics to discuss..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCounsellingModal(false);
                  setSelectedStudent(null);
                  setCounsellingForm({
                    scheduledDate: '',
                    scheduledTime: '',
                    notes: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = await getToken();
                    const response = await api.post('/api/admin/counselling-sessions', {
                      studentId: selectedStudent,
                      ...counsellingForm
                    }, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    setCounsellingSessions([...counsellingSessions, response.data]);
                    setShowCounsellingModal(false);
                    setSelectedStudent(null);
                    setCounsellingForm({
                      scheduledDate: '',
                      scheduledTime: '',
                      notes: ''
                    });
                  } catch (error) {
                    console.error('Error scheduling counselling session:', error);
                    alert('Error scheduling counselling session. Please try again.');
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Schedule Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && feedbackModal()}
    </>
  );
};

export default AdminDashboard; 