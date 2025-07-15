import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Users,
  GraduationCap,
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../utils/axios";
// types of interfaces
import { AssignmentSubmission } from "@/types/assignment";
import { StudentData } from "@/types/studentdata";
import { TestResult } from "@/types/testresult";
import { UpcomingSession } from "@/types/upcommingsession";
import { StudentFeedback } from "@/types/studentfeedback";

// components
import OverviewTab from "@/components/AdminDashboard/OverviewTab";
import StudentsTab from "@/components/AdminDashboard/StudentsTab";
import TestResultsTab from "@/components/AdminDashboard/TestResultsTab";
import CoursesTab from "@/components/AdminDashboard/CoursesTab";
import CourseDetailsTab from "@/components/AdminDashboard/CourseDetailsTab";
import SubmissionsTab from "@/components/AdminDashboard/SubmissionsTab";
import SessionsTab from "@/components/AdminDashboard/SessionsTan";
import CounselingFeedbackTab from "@/components/AdminDashboard/CounsellingFeedbackTab";

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

  // Admin grade Module

  const [submissions, setSubmissions] = useState<
    Record<string, AssignmentSubmission[]>
  >({});
  const [studentsMap, setStudentsMap] = useState<Record<string, string>>({});
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  useEffect(() => {
    fetchAdminData();
    fetchSubmissions();
    fetchStudents();
  }, []);

  // student-performance
  const fetchSubmissions = async () => {
    try {
      const token = await getToken();
      const res = await api.get("/api/admin/all-students-performance", {
        headers: {
          Authorization: `Bearer ${token}`, // replace if using auth
        },
      });

      console.log("res_", res.data);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load performance", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get("/api/admin/students");
      console.log("resallstudent:-", res);
      const map: Record<string, string> = {};

      (res.data as StudentData[]).forEach((student: StudentData) => {
        map[student.clerkId] = `${student.firstName} ${student.lastName}`;
      });

      setStudentsMap(map);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

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
      console.log("response:-", response);
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
    setShowGradingModal(true);
  };

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

  // student score color
  function getScoreColor(score: any, maxScore: any) {
    if (
      typeof score !== "number" ||
      typeof maxScore !== "number" ||
      maxScore === 0
    ) {
      return "gray"; // fallback if no valid score or maxScore
    }

    const percentage = (score / maxScore) * 100;

    if (percentage >= 75) {
      return "green";
    } else if (percentage >= 50) {
      return "yellow";
    } else {
      return "red";
    }
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
            <OverviewTab
              students={students}
              testResults={testResults}
              submissions={submissions}
              studentsMap={studentsMap}
              getScoreColor={getScoreColor}
              loading={loading}
            />
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <StudentsTab
              students={students}
              formatDate={formatDate}
              openFeedbackModal={openFeedbackModal}
            />
          )}

          {/* Tests Tab */}
          {activeTab === "tests" && (
            <TestResultsTab
              filteredResults={filteredResults}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterScore={filterScore}
              setFilterScore={setFilterScore}
              getScholarshipLevel={getScholarshipLevel}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && !showCourseDetails && (
            <CoursesTab
              courses={courses}
              viewCourseDetails={viewCourseDetails}
              openCourseModal={openCourseModal}
              viewAssignmentSubmissions={viewAssignmentSubmissions}
              setCourses={setCourses}
            />
          )}

          {/* Course Details View */}
          {activeTab === "courses" && showCourseDetails && selectedCourse && (
            <CourseDetailsTab
              selectedCourse={selectedCourse}
              setShowCourseDetails={setShowCourseDetails}
              openResourceModal={openResourceModal}
              openAssignmentModal={openAssignmentModal}
            />
          )}

          {/* Assignment Submissions View */}
          {activeTab === "courses" && showSubmissions && selectedCourse && (
            <SubmissionsTab
              selectedCourse={selectedCourse}
              setShowSubmissions={setShowSubmissions}
              openGradingModal={openGradingModal}
              assignmentSubmissions={assignmentSubmissions}
            />
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <SessionsTab
              setShowSessionModal={setShowSessionModal}
              upcomingSessions={upcomingSessions}
              setUpcomingSessions={setUpcomingSessions}
            />
          )}

          {/* Counselling Tab */}
          {activeTab === "counselling" && (
            <CounselingFeedbackTab
              setShowSessionModal={setShowSessionModal}
              students={students}
              studentFeedback={studentFeedback}
              openFeedbackModal={openFeedbackModal}
            />
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

      {/* Grade Modal second*/}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Grade Assignment</h3>
            <p className="text-sm mb-2">
              <strong>Student:</strong>{" "}
              {studentsMap[selectedSubmission.studentId] ||
                selectedSubmission.studentId}
            </p>
            <p className="text-sm mb-4">
              <strong>Assignment:</strong> {selectedSubmission.assignmentId} |
              Week {selectedSubmission.week}
            </p>
            <input
              type="number"
              placeholder="Score"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Feedback"
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.post("/api/admin/grade-assignment", {
                      studentId: selectedSubmission.studentId,
                      courseId: selectedSubmission.courseId,
                      assignmentId: selectedSubmission.assignmentId,
                      week: selectedSubmission.week,
                      score: Number(scoreInput),
                      feedback: feedbackInput,
                      gradedBy: "admin_123",
                    });
                    setSelectedSubmission(null);
                    fetchSubmissions();
                  } catch (err) {
                    alert("Grading failed");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
