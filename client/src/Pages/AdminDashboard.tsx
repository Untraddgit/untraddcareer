import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
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
  BookOpen,
  MessageCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../utils/axios";


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
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "student" | "admin";
  course:string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState<
    "all" | "high" | "scholarship"
  >("all");
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "tests" | "courses" | "sessions" | "counselling"
  >("overview");

  // Counselling and feedback state
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    []
  );
  const [studentFeedback, setStudentFeedback] = useState<StudentFeedback[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    link: "",
  });

  // Course editing state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    displayName: "",
    courseDescription: "",
    durationWeeks: 0,
    effortPerWeek: "",
    liveClassesPerWeek: 0,
    isActive: true,
  });

  // Detailed course management state
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [resourceForm, setResourceForm] = useState({
    title: "",
    url: "",
    type: "video" as "video" | "article" | "document" | "tool" | "other",
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: 100,
    instructions: "",
  });

  // Assignment submissions management
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingForm, setGradingForm] = useState({
    score: 0,
    feedback: "",
    isGraded: false,
  });

  // Feedback editing state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    studentId: "",
    name: "",
    semester: "",
    college: "",
    threeWords: ["", "", ""],
    strengths: "",
    areasOfImprovement: "",
    stressHandling: "",
    motivation: "",
    englishRating: 5,
    hindiRating: 5,
    confidence: "",
    decisionMaking: "",
    biggestAchievement: "",
    turningPoint: "",
    conflicts: "",
    futureConcern: "",
    alignInThoughts: "",
    courseChosen: "",
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Fetch test results
      const testsResponse = await api.get("/api/admin/test-results", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch students
      const studentsResponse = await api.get("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch student feedback
      const feedbackResponse = await api.get("/api/admin/student-feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch courses
      const coursesResponse = await api.get(
        "/api/predefined-courses/admin/predefined-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch upcoming sessions
      const sessionsResponse = await api.get("/api/admin/upcoming-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTestResults(testsResponse.data);
      setStudents(studentsResponse.data);
      setStudentFeedback(feedbackResponse.data);
      setCourses(coursesResponse.data);
      setUpcomingSessions(sessionsResponse.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScholarshipLevel = (score: number) => {
    if (score >= 80)
      return { level: "15%", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 70)
      return { level: "10%", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 60)
      return { level: "5%", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "None", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const filteredResults = testResults.filter((result) => {
    const matchesSearch =
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterScore === "all" ||
      (filterScore === "high" && result.score >= 70) ||
      (filterScore === "scholarship" && result.score >= 60);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Helper functions for course editing
  const openCourseModal = (course: any = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        courseName: course.courseName,
        displayName: course.displayName || "",
        courseDescription: course.courseDescription,
        durationWeeks: course.durationWeeks,
        effortPerWeek: course.effortPerWeek,
        liveClassesPerWeek: course.liveClassesPerWeek,
        isActive: course.isActive,
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        courseName: "",
        displayName: "",
        courseDescription: "",
        durationWeeks: 0,
        effortPerWeek: "",
        liveClassesPerWeek: 0,
        isActive: true,
      });
    }
    setShowCourseModal(true);
  };

  const saveCourse = async () => {
    try {
      const token = await getToken();
      if (editingCourse) {
        // Update existing course
        const response = await api.put(
          `/api/predefined-courses/admin/predefined-courses/${encodeURIComponent(
            editingCourse.courseName
          )}`,
          courseForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(
          courses.map((c) => (c._id === editingCourse._id ? response.data : c))
        );
      } else {
        // Create new course
        const response = await api.post(
          "/api/predefined-courses/admin/predefined-courses",
          courseForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses([...courses, response.data]);
      }
      setShowCourseModal(false);
      alert("Course saved successfully!");
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Error saving course. Please try again.");
    }
  };

  // Helper functions for feedback editing
  const openFeedbackModal = async (student: StudentData) => {
    try {
      const token = await getToken();
      setEditingStudent(student);

      // Try to fetch existing feedback for this student
      try {
        const response = await api.get(
          `/api/admin/student-feedback/${student.clerkId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const feedback = response.data;
        setFeedbackForm({
          studentId: feedback.studentId,
          name: feedback.name,
          semester: feedback.semester,
          college: feedback.college,
          threeWords: feedback.threeWords,
          strengths: feedback.strengths,
          areasOfImprovement: feedback.areasOfImprovement,
          stressHandling: feedback.stressHandling,
          motivation: feedback.motivation,
          englishRating: feedback.englishRating,
          hindiRating: feedback.hindiRating,
          confidence: feedback.confidence,
          decisionMaking: feedback.decisionMaking,
          biggestAchievement: feedback.biggestAchievement,
          turningPoint: feedback.turningPoint,
          conflicts: feedback.conflicts,
          futureConcern: feedback.futureConcern,
          alignInThoughts: feedback.alignInThoughts,
          courseChosen: feedback.courseChosen,
        });
      } catch (error) {
        // No existing feedback, initialize with student data
        setFeedbackForm({
          studentId: student.clerkId,
          name: `${student.firstName} ${student.lastName}`,
          semester: "",
          college: "",
          threeWords: ["", "", ""],
          strengths: "",
          areasOfImprovement: "",
          stressHandling: "",
          motivation: "",
          englishRating: 5,
          hindiRating: 5,
          confidence: "",
          decisionMaking: "",
          biggestAchievement: "",
          turningPoint: "",
          conflicts: "",
          futureConcern: "",
          alignInThoughts: "",
          courseChosen: "",
        });
      }

      setShowFeedbackModal(true);
    } catch (error) {
      console.error("Error opening feedback modal:", error);
      alert("Error loading student feedback");
    }
  };

  const saveFeedback = async () => {
    try {
      const token = await getToken();
      await api.post("/api/admin/student-feedback", feedbackForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh feedback data
      const feedbackResponse = await api.get("/api/admin/student-feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentFeedback(feedbackResponse.data);

      setShowFeedbackModal(false);
      alert("Feedback saved successfully!");
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Error saving feedback. Please try again.");
    }
  };

  // Detailed course management functions
  const viewCourseDetails = async (course: any) => {
    try {
      const token = await getToken();
      const response = await api.get(
        `/api/predefined-courses/admin/predefined-courses/${encodeURIComponent(
          course.courseName
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedCourse(response.data);
      setShowCourseDetails(true);
    } catch (error) {
      console.error("Error fetching course details:", error);
      alert("Error loading course details");
    }
  };

  const openResourceModal = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    setResourceForm({ title: "", url: "", type: "video" });
    setShowResourceModal(true);
  };

  const openAssignmentModal = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    setAssignmentForm({
      title: "",
      description: "",
      dueDate: "",
      maxScore: 100,
      instructions: "",
    });
    setShowAssignmentModal(true);
  };

  const addResource = async () => {
    try {
      const token = await getToken();
      await api.post(
        `/api/predefined-courses/admin/predefined-courses/${encodeURIComponent(
          selectedCourse.courseName
        )}/weeks/${selectedWeek}/resources`,
        resourceForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh course details
      await viewCourseDetails(selectedCourse);
      setShowResourceModal(false);
      alert("Resource added successfully!");
    } catch (error) {
      console.error("Error adding resource:", error);
      alert("Error adding resource. Please try again.");
    }
  };

  const addAssignment = async () => {
    try {
      const token = await getToken();
      await api.post(
        `/api/predefined-courses/admin/predefined-courses/${encodeURIComponent(
          selectedCourse.courseName
        )}/weeks/${selectedWeek}/assignments`,
        assignmentForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh course details
      await viewCourseDetails(selectedCourse);
      setShowAssignmentModal(false);
      alert("Assignment added successfully!");
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Error adding assignment. Please try again.");
    }
  };

  // Assignment submissions management functions
  const viewAssignmentSubmissions = async (course: any) => {
    try {
      const token = await getToken();
      const response = await api.get(
        `/api/predefined-courses/admin/assignments/${course._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignmentSubmissions(response.data);
      setSelectedCourse(course);
      setShowSubmissions(true);
    } catch (error) {
      console.error("Error fetching assignment submissions:", error);
      alert("Error loading assignment submissions");
    }
  };

  const openGradingModal = (submission: any) => {
    setSelectedSubmission(submission);
    setGradingForm({
      score: submission.score || 0,
      feedback: submission.feedback || "",
      isGraded: submission.isGraded || false,
    });
    setShowGradingModal(true);
  };

  const saveGrading = async () => {
    if (!selectedSubmission) return;

    try {
      const token = await getToken();
      await api.put(
        `/api/predefined-courses/admin/assignments/${selectedSubmission._id}/grade`,
        {
          score: gradingForm.score,
          feedback: gradingForm.feedback,
          isGraded: gradingForm.isGraded,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowGradingModal(false);
      setGradingForm({ score: 0, feedback: "", isGraded: false });
      setSelectedSubmission(null);
      alert("Grade saved successfully!");

      // Refresh assignment submissions to show updated status
      if (selectedCourse) {
        await viewAssignmentSubmissions(selectedCourse);
      }
    } catch (error) {
      console.error("Error saving grade:", error);
      alert("Error saving grade. Please try again.");
    }
  };

  const premiumStudentCard = (student: StudentData) => (
    <div
      key={student.clerkId}
      className="border border-gray-200 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">
            {student.firstName} {student.lastName}
          </h4>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
          Premium
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => openFeedbackModal(student)}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Edit Feedback
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
          <p className="text-gray-600 mt-2">
            Manage students, tests, and counselling sessions
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "students"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Students
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tests"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Test Results
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "courses"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sessions"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Sessions
            </button>
            <button
              onClick={() => setActiveTab("counselling")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "counselling"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {students.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Tests Taken
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {testResults.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        High Performers
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {testResults.filter((r) => r.score >= 70).length}
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
                      <p className="text-sm font-medium text-gray-600">
                        Premium Students
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {students.filter((s) => s.plan === "premium").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  All Students
                </h3>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
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
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.plan === "premium"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {student.plan || "Free"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(student.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openFeedbackModal(student)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit Feedback
                          </button>
                          {student.plan === "premium" && (
                            <span className="text-green-600 text-xs">
                              Premium Student
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === "tests" && (
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
                    onChange={(e) =>
                      setFilterScore(
                        e.target.value as "all" | "high" | "scholarship"
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High Performers (70%+)</option>
                    <option value="scholarship">
                      Scholarship Eligible (60%+)
                    </option>
                  </select>
                </div>
              </div>

              {/* Test Results */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Test Results
                  </h3>
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
                              <div className="text-sm font-medium text-gray-900">
                                {result.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {result.userId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {result.score}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${scholarship.bg} ${scholarship.color}`}
                              >
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
          {activeTab === "courses" && !showCourseDetails && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Course Management
                </h2>
                <div className="flex space-x-3">
                  <select
                    onChange={(e) => {
                      const course = courses.find(
                        (c) => c._id === e.target.value
                      );
                      if (course) viewCourseDetails(course);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">Select course to manage details</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.displayName || course.courseName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => openCourseModal()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add New Course
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Courses
                </h3>
                <div className="grid gap-4">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {course.displayName || course.courseName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {course.courseDescription}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.durationWeeks} weeks •{" "}
                          {course.liveClassesPerWeek} classes/week
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewCourseDetails(course)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Manage Details
                          </button>
                          <button
                            onClick={() => viewAssignmentSubmissions(course)}
                            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                          >
                            View Submissions
                          </button>
                          <button
                            onClick={() => openCourseModal(course)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Edit Course
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this course?"
                                )
                              ) {
                                try {
                                  const token = await getToken();
                                  await api.delete(
                                    `/api/predefined-courses/admin/predefined-courses/${encodeURIComponent(
                                      course.courseName
                                    )}`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  setCourses(
                                    courses.filter((c) => c._id !== course._id)
                                  );
                                  alert("Course deleted successfully!");
                                } catch (error) {
                                  console.error(
                                    "Error deleting course:",
                                    error
                                  );
                                  alert("Error deleting course");
                                }
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No courses available yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Course Details View */}
          {activeTab === "courses" && showCourseDetails && selectedCourse && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={() => setShowCourseDetails(false)}
                    className="text-purple-600 hover:text-purple-800 mb-2"
                  >
                    ← Back to Courses
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedCourse.displayName || selectedCourse.courseName} -
                    Detailed Management
                  </h2>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold">
                      {selectedCourse.durationWeeks} weeks
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Effort/Week</p>
                    <p className="text-lg font-semibold">
                      {selectedCourse.effortPerWeek}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Live Classes</p>
                    <p className="text-lg font-semibold">
                      {selectedCourse.liveClassesPerWeek}/week
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p
                      className={`text-lg font-semibold ${
                        selectedCourse.isActive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedCourse.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Weekly Modules
                  </h4>
                  {selectedCourse.weeklyRoadmap?.map(
                    (week: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              Week {week.week}: {week.title}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              Topics:{" "}
                              {week.topics?.join(", ") || "No topics defined"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openResourceModal(week.week)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Add Resource
                            </button>
                            <button
                              onClick={() => openAssignmentModal(week.week)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Add Assignment
                            </button>
                          </div>
                        </div>

                        {/* Resources */}
                        {week.resources && week.resources.length > 0 && (
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                              Resources:
                            </h6>
                            <div className="space-y-1">
                              {week.resources.map(
                                (resource: any, rIndex: number) => (
                                  <div
                                    key={rIndex}
                                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                  >
                                    <div className="flex items-center">
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                        {resource.type}
                                      </span>
                                      <span className="text-sm">
                                        {resource.title}
                                      </span>
                                    </div>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Assignments */}
                        {week.assignments && week.assignments.length > 0 && (
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                              Assignments:
                            </h6>
                            <div className="space-y-1">
                              {week.assignments.map(
                                (assignment: any, aIndex: number) => (
                                  <div
                                    key={aIndex}
                                    className="bg-yellow-50 p-2 rounded"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="text-sm font-medium">
                                          {assignment.title}
                                        </span>
                                        <p className="text-xs text-gray-600">
                                          {assignment.description}
                                        </p>
                                      </div>
                                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                        Max: {assignment.maxScore} pts
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Assignment Submissions View */}
          {activeTab === "courses" && showSubmissions && selectedCourse && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={() => setShowSubmissions(false)}
                    className="text-purple-600 hover:text-purple-800 mb-2"
                  >
                    ← Back to Courses
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assignment Submissions -{" "}
                    {selectedCourse.displayName || selectedCourse.courseName}
                  </h2>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Submissions
                </h3>

                {assignmentSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {assignmentSubmissions.map((submission) => (
                      <div
                        key={submission._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {submission.studentName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Assignment: {submission.assignmentTitle}
                            </p>
                            <p className="text-sm text-gray-500">
                              Week: {submission.week}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  submission.isGraded
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {submission.isGraded ? "Graded" : "Pending"}
                              </span>
                              {submission.isGraded && (
                                <span className="text-sm font-medium text-gray-900">
                                  Score: {submission.score}/
                                  {submission.maxScore}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            Submission Link:
                          </p>
                          <a
                            href={submission.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all flex items-center"
                          >
                            {submission.submissionLink}
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500">
                            Submitted:{" "}
                            {new Date(
                              submission.submittedAt
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              submission.submittedAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>

                        {submission.feedback && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">
                              Feedback:
                            </p>
                            <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                              {submission.feedback}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openGradingModal(submission)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            {submission.isGraded
                              ? "Edit Grade"
                              : "Grade Assignment"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No assignment submissions yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Sessions Management
                </h2>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Session
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  All Sessions
                </h4>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {session.title}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {session.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.date} at {session.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            session.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {session.isActive ? "Active" : "Inactive"}
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
                            if (
                              confirm(
                                "Are you sure you want to delete this session?"
                              )
                            ) {
                              try {
                                const token = await getToken();
                                await api.delete(
                                  `/api/admin/upcoming-sessions/${session._id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                setUpcomingSessions(
                                  upcomingSessions.filter(
                                    (s) => s._id !== session._id
                                  )
                                );
                              } catch (error) {
                                console.error("Error deleting session:", error);
                                alert("Error deleting session");
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
                    <p className="text-gray-500 text-center py-8">
                      No sessions scheduled yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Counselling Tab */}
          {activeTab === "counselling" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Counselling & Feedback
                </h2>
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
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Premium Students
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students
                    .filter((student) => student.plan === "premium")
                    .map((student) => premiumStudentCard(student))}
                </div>
              </div>

              {/* Student Feedback */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Student Feedback
                </h4>
                <div className="space-y-4">
                  {studentFeedback.map((feedback, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {feedback.name}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {feedback.college} - {feedback.semester}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <strong>Course:</strong> {feedback.courseChosen}
                          </p>
                          <p>
                            <strong>Three Words:</strong>{" "}
                            {feedback.threeWords.join(", ")}
                          </p>
                          <p>
                            <strong>English:</strong> {feedback.englishRating}
                            /10
                          </p>
                          <p>
                            <strong>Hindi:</strong> {feedback.hindiRating}/10
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Strengths:</strong> {feedback.strengths}
                          </p>
                          <p>
                            <strong>Areas to Improve:</strong>{" "}
                            {feedback.areasOfImprovement}
                          </p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule Session
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = await getToken();
                  const response = await api.post(
                    "/api/admin/upcoming-sessions",
                    sessionForm,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  setUpcomingSessions([...upcomingSessions, response.data]);
                  setShowSessionModal(false);
                  setSessionForm({
                    title: "",
                    description: "",
                    date: "",
                    time: "",
                    link: "",
                  });
                  alert("Session scheduled successfully!");
                } catch (error) {
                  console.error("Error scheduling session:", error);
                  alert("Error scheduling session. Please try again.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={sessionForm.link}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, link: e.target.value })
                  }
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

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCourse();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={courseForm.courseName}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                    disabled={!!editingCourse}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={courseForm.displayName}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        displayName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description
                </label>
                <textarea
                  value={courseForm.courseDescription}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      courseDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    value={courseForm.durationWeeks}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        durationWeeks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effort Per Week
                  </label>
                  <input
                    type="text"
                    value={courseForm.effortPerWeek}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        effortPerWeek: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 10-12 hours"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live Classes/Week
                  </label>
                  <input
                    type="number"
                    value={courseForm.liveClassesPerWeek}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        liveClassesPerWeek: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={courseForm.isActive}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        isActive: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active Course
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Student Feedback - {editingStudent?.firstName}{" "}
              {editingStudent?.lastName}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveFeedback();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.name}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Chosen
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.courseChosen}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        courseChosen: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.college}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        college: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.semester}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        semester: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Rating (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={feedbackForm.englishRating}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        englishRating: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hindi Rating (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={feedbackForm.hindiRating}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        hindiRating: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strengths
                </label>
                <textarea
                  value={feedbackForm.strengths}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      strengths: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Improvement
                </label>
                <textarea
                  value={feedbackForm.areasOfImprovement}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      areasOfImprovement: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivation & Goals
                </label>
                <textarea
                  value={feedbackForm.motivation}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      motivation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
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
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Resource to Week {selectedWeek}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addResource();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={resourceForm.title}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL
                </label>
                <input
                  type="url"
                  value={resourceForm.url}
                  onChange={(e) =>
                    setResourceForm({ ...resourceForm, url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type
                </label>
                <select
                  value={resourceForm.type}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="document">Document</option>
                  <option value="tool">Tool</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Assignment to Week {selectedWeek}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAssignment();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.maxScore}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        maxScore: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      instructions: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Detailed instructions for the assignment..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Grade Assignment - {selectedSubmission.studentName}
            </h3>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Assignment Details
                </h4>
                <p className="text-sm text-gray-600 mb-1">
                  Assignment: {selectedSubmission.assignmentTitle}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Week: {selectedSubmission.week}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Max Score: {selectedSubmission.maxScore}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Submission Link:</p>
                  <a
                    href={selectedSubmission.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all flex items-center"
                  >
                    {selectedSubmission.submissionLink}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveGrading();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (out of {selectedSubmission.maxScore})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedSubmission.maxScore}
                    value={gradingForm.score}
                    onChange={(e) =>
                      setGradingForm({
                        ...gradingForm,
                        score: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center mt-7">
                    <input
                      type="checkbox"
                      checked={gradingForm.isGraded}
                      onChange={(e) =>
                        setGradingForm({
                          ...gradingForm,
                          isGraded: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Mark as Graded
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  value={gradingForm.feedback}
                  onChange={(e) =>
                    setGradingForm({ ...gradingForm, feedback: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Provide feedback on the assignment..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Grade
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
