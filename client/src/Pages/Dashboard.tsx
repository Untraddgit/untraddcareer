import { useState, useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  GraduationCap,
  Users,
  BarChart,
  Home,
  Clock,
  MapPin,
  DollarSign,
  X,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

import api from "../utils/axios";
import axios from "axios";
// types
import { StudentFeedback } from "@/types/studentfeedback";
import { TestResult } from "@/types/testresult";
import { User } from "@/types/user";
import {
  PredefinedCourseAssignment,
  PredefinedCourseData,
  PredefinedCourseProgress,
  PredefinedCourseWeek,
} from "@/types/predefinedcourses";
import { UpcomingSession } from "@/types/upcommingsession";
import { AssignmentSubmission } from "@/types/assignment";

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
    location: "Remote",
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
    location: "Bangalore",
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
    location: "Hybrid",
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
    location: "Delhi NCR",
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
    location: "Pune",
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
    location: "Remote",
  },
];

// Components
import Navbar from "@/components/Navbar";
import OverviewTab from "@/components/Dashboard/OverviewTab";
import CourseTab from "@/components/Dashboard/CourseTab";
import FoundationCoursesTab from "@/components/Dashboard/FoundationCoursesTab";
import TestTab from "@/components/Dashboard/TestTab";
import CounselingFeedbackTab from "@/components/Dashboard/CounselingFeedbackTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "course" | "foundationcourses" | "test" | "counselingfeedback"
  >("overview");

  const { user } = useUser();
  const { getToken, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [hasAttemptedTest, setHasAttemptedTest] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory] = useState<TestResult[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Predefined course state
  const [predefinedCourseData, setPredefinedCourseData] =
    useState<PredefinedCourseData | null>(null);
  const [predefinedCourseProgress, setPredefinedCourseProgress] =
    useState<PredefinedCourseProgress | null>(null);
  const [loadingPredefinedCourse, setLoadingPredefinedCourse] = useState(false);

  // Foundation course state
  const [foundationCourseData, setFoundationCourseData] =
    useState<PredefinedCourseData | null>(null);
  const [foundationCourseProgress, setFoundationCourseProgress] =
    useState<PredefinedCourseProgress | null>(null);
  const [loadingFoundationCourse, setLoadingFoundationCourse] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    week: PredefinedCourseWeek;
    assignment: PredefinedCourseAssignment;
  } | null>(null);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<
    AssignmentSubmission[] | null
  >([]);

  // UpcomingSession states
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    []
  );

  // Counselling Feedback states
  const [studentFeedback, setStudentFeedback] =
    useState<StudentFeedback | null>(null);

  // New Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    studentName: "",
    submissionLink: "",
    description: "",
    notes: "",
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
    if (userData && userData.plan === "premium") {
      fetchFoundationCourse();
    }
  }, [userData]);

  // fecting user data
  const fetchUserData = async () => {
    try {
      const token = isLoaded ? await getToken() : null;
      const response = await api.get(`/api/users/${user?.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // fecting prdefinedCouseData
  const fetchPredefinedCourseData = async () => {
    try {
      setLoadingPredefinedCourse(true);
      const token = isLoaded ? await getToken() : null;

      const response = await api.get(
        "/api/predefined-courses/student/predefined-course-materials",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setPredefinedCourseData(response.data.course);
      setPredefinedCourseProgress(response.data.progress);
    } catch (error) {
      console.error("Error fetching predefined course materials:", error);
      // Don't show error for students without assigned courses
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        console.error(
          "Predefined course materials error:",
          error.response?.data
        );
      }
    } finally {
      setLoadingPredefinedCourse(false);
    }
  };
  // fetchFoundationCourse data
  const fetchFoundationCourse = async () => {
    if (!userData || userData.plan !== "premium") return;

    setLoadingFoundationCourse(true);
    try {
      const token = isLoaded ? await getToken() : null;
      const response = await api.get(
        "/api/predefined-courses/student/foundation-course",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      // console.log("foundation-course:-", response.data);
      setFoundationCourseData(response.data.course);
      setFoundationCourseProgress(response.data.progress);
    } catch (error) {
      console.error("Error fetching foundation course:", error);
    } finally {
      setLoadingFoundationCourse(false);
    }
  };

  // fetchUpcomingSessions data
  const fetchUpcomingSessions = async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/student/upcoming-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpcomingSessions(response.data);
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
    }
  };
  //  fetchStudentFeedback data
  const fetchStudentFeedback = async () => {
    try {
      const token = await getToken();
      const response = await api.get("/api/student/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentFeedback(response.data);
    } catch (error) {
      console.error("Error fetching student feedback:", error);
    }
  };
  // fetchAssignmentSubmissions
  const fetchAssignmentSubmissions = async () => {
    if (!userData || !userData.course) return;

    try {
      const token = await getToken();
      const response = await api.get(
        "/api/predefined-courses/student/my-submissions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignmentSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching assignment submissions:", error);
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

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const checkTestStatus = async () => {
    try {
      const token = isLoaded ? await getToken() : null;
      console.log("Checking test status with token:", !!token);
      console.log("User ID:", user?.id);

      const response = await api.get("/api/quiz-results/check-test-status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { userId: user?.id },
      });
      console.log("Test status response:", response.data);

      setHasAttemptedTest(response.data.hasAttempted);
      if (response.data.hasAttempted && response.data.result) {
        console.log("Setting test result:", response.data.result);
        setTestResult(response.data.result);
      } else {
        console.log("No test result found in response");
      }
    } catch (error) {
      console.error("Error checking test status:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }
    }
  };

  const handleStartTest = () => {
    console.log("handleStartTest called");
    console.log("hasAttemptedTest:", hasAttemptedTest);
    if (hasAttemptedTest) {
      alert("You have already taken the test. Only one attempt is allowed.");
      console.log("Navigation blocked: Test already attempted.");
      return;
    }
    console.log("Navigating to /scholarship-test...");
    navigate("/scholarship-test");
  };

  // handler AssignmentSubmission
  const handleAssignmentSubmission = (
    week: PredefinedCourseWeek,
    assignment: PredefinedCourseAssignment
  ) => {
    setSelectedAssignment({ week, assignment });

    setAssignmentForm({
      studentName: user?.firstName + " " + (user?.lastName || ""),
      submissionLink: "",
      description: "",
      notes: "",
    });
    setShowAssignmentModal(true);
  };
  // error handler Assignmet sumbit
  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !assignmentForm.submissionLink.trim()) {
      alert("Please provide a valid assignment link");
      return;
    }

    try {
      const token = await getToken();
      const res = await api.post(
        `/api/predefined-courses/student/assignments/${selectedAssignment.week.week}`,
        {
          assignmentId: selectedAssignment.assignment._id,
          submissionLink: assignmentForm.submissionLink.trim(),
          module: selectedAssignment.week.title,
          maxScore: selectedAssignment.assignment.maxScore,
          title: selectedAssignment.assignment.title,
          description: assignmentForm.description,
          notes: assignmentForm.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("form:-", res);
      setShowAssignmentModal(false);
      setAssignmentForm({
        studentName: "",
        submissionLink: "",
        description: "",
        notes: "",
      });
      alert("Assignment submitted successfully!");

      // Refresh course data and assignment submissions to update status
      await fetchPredefinedCourseData();
      await fetchAssignmentSubmissions();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Error submitting assignment. Please try again.");
    }
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
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === "overview"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("course")}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === "course"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Course
              </button>
              {/* Foundation Courses Tab - Only show for premium users */}
              {userData?.plan === "premium" && (
                <button
                  onClick={() => setActiveTab("foundationcourses")}
                  className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                    activeTab === "foundationcourses"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Foundation Courses
                </button>
              )}
              <button
                onClick={() => setActiveTab("test")}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === "test"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Award className="h-4 w-4 mr-2" />
                Test
              </button>
              <button
                onClick={() => setActiveTab("counselingfeedback")}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center ${
                  activeTab === "counselingfeedback"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                My Counseling Feedback
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <OverviewTab
              userData={userData}
              hasAttemptedTest={hasAttemptedTest}
              testResult={testResult}
              handleStartTest={handleStartTest}
            />
          )}

          {activeTab === "course" && (
            <CourseTab
              userData={userData}
              upcomingSessions={upcomingSessions}
              predefinedCourseData={predefinedCourseData}
              predefinedCourseProgress={predefinedCourseProgress}
              loadingPredefinedCourse={loadingPredefinedCourse}
              handleAssignmentSubmission={handleAssignmentSubmission}
              assignmentSubmissions={assignmentSubmissions}
            />
          )}

          {activeTab === "foundationcourses" && (
            <FoundationCoursesTab
              foundationCourseData={foundationCourseData}
              foundationCourseProgress={foundationCourseProgress}
              loadingFoundationCourse={loadingFoundationCourse}
              handleAssignmentSubmission={handleAssignmentSubmission}
              assignmentSubmissions={assignmentSubmissions}
            />
          )}

          {activeTab === "test" && (
            <TestTab
              hasAttemptedTest={hasAttemptedTest}
              testResult={testResult}
              testHistory={testHistory}
              handleStartTest={handleStartTest}
            />
          )}

          {activeTab === "counselingfeedback" && (
            <CounselingFeedbackTab studentFeedback={studentFeedback} />
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
            <h2 className="text-lg font-semibold text-gray-900">
              Active Hirings
            </h2>
            <p className="text-sm text-gray-600">
              Latest internship opportunities from our partner companies
            </p>
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
            style={{ scrollBehavior: "smooth" }}
          >
            {INTERNSHIP_OPPORTUNITIES.map((internship) => (
              <div
                key={internship.id}
                className="flex-shrink-0 w-72 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full ${internship.logoColor} flex items-center justify-center font-bold`}
                  >
                    {internship.logo}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {internship.company}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {internship.location}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {internship.position}
                  </h4>
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
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
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
      {/* Assignment Modal */}
      {showAssignmentModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Submit Assignment
                </h3>
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setAssignmentForm({
                      studentName: "",
                      submissionLink: "",
                      description: "",
                      notes: "",
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
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        studentName: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        submissionLink: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        description: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Any additional notes or comments for your instructor..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                {/* Assignment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Assignment Details
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Module:</strong> {selectedAssignment?.week?.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Week:</strong> {selectedAssignment?.week?.week}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Title:</strong>{" "}
                    {selectedAssignment?.assignment.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Description:</strong>{" "}
                    {selectedAssignment?.assignment.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Max Score:</strong>{" "}
                    {selectedAssignment?.assignment.maxScore} points
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setAssignmentForm({
                      studentName: "",
                      submissionLink: "",
                      description: "",
                      notes: "",
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
    </div>
  );
};

export default Dashboard;
