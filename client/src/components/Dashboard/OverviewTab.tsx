import { FC, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  CheckCircle,
  DollarSign,
  ArrowRight,
  Award,
  Calendar,
  X,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, gql } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
interface OverviewTabProps {
  userData: User | null;
  hasAttemptedTest: boolean;
  testResult: any;
  handleStartTest: () => void;
}
type CoursePerformance = {
  courseId: string;
  courseName: string;
  totalAssignments: number;
  submittedAssignments: number;
  averageGrade: number | null;
};

interface OverallPerformanceChartProps {
  data: CoursePerformance[];
}
const OverallPerformanceChart: React.FC<OverallPerformanceChartProps> = ({
  data,
}) => {
  if (!data?.length)
    return (
      <p className="text-center text-sm text-gray-500 py-4">
        No performance data available.
      </p>
    );

  const labels = data.map((item) => item.courseName);
  const averages = data.map((item) => item.averageGrade ?? 0);
  const totalAssignments = data.map((item) => item.totalAssignments ?? 0);
  const submittedAssignments = data.map(
    (item) => item.submittedAssignments ?? 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Grade (%)",
        data: averages,
        backgroundColor: "#3B82F6", // Blue
        borderColor: "#3B82F6",
        borderWidth: 1,
        barThickness: 60, // Thinner bars for mobile
      },
      {
        label: "Total Assignments",
        data: totalAssignments,
        backgroundColor: "#FF6384", // Pink
        borderColor: "#FF6384",
        borderWidth: 1,
        barThickness: 60,
      },
      {
        label: "Submitted Assignments",
        data: submittedAssignments,
        backgroundColor: "#FFCE56", // Yellow
        borderColor: "#FFCE56",
        borderWidth: 1,
        barThickness: 60,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // Important for responsive resizing
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: { size: 10 },
        },
      },
      title: {
        display: true,
        text: "Overall Course Performance",
        font: { size: 14, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        padding: 8,
        bodyFont: { size: 12 },
        callbacks: {
          title: (tooltipItems) => {
            // Show full course name in tooltip title
            const index = tooltipItems[0].dataIndex;
            return labels[index] || "";
          },
          label: (context) => `${context.dataset.label}: ${context.raw ?? 0}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: {
          font: { size: 10 },
          padding: 4,
        },
        title: {
          display: true,
          text: "Values",
          font: { size: 12 },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          padding: 4,
          callback: function (value) {
            const label = this.getLabelForValue(value as number);
            return label.length > 8 ? label.slice(0, 8) + "…" : label;
          },
          maxRotation: 0,
          minRotation: 0,
        },
        title: {
          display: true,
          text: "Courses",
          font: { size: 12 },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const OverviewTab: FC<OverviewTabProps> = ({
  userData,
  hasAttemptedTest,
  testResult,
  handleStartTest,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"community" | "counseling">(
    "community"
  );

  const openModal = (type: "community" | "counseling") => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("community"); // Reset to default value instead of null
  };
  const getScholarshipDiscount = (score: number) => {
    if (score >= 80) return 15;
    if (score >= 70) return 10;
    if (score >= 60) return 5;
    return 0;
  };

  const renderProgressStep = (
    step: number,
    title: string,
    isCompleted: boolean,
    isCurrent: boolean
  ) => {
    return (
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isCompleted
              ? "bg-green-100 text-green-600"
              : isCurrent
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm font-medium ${
              isCompleted
                ? "text-green-600"
                : isCurrent
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    );
  };
  // GraphQL query

  // get student overall performance on course
  const GET_OVERALL_PERFORMANCE = gql`
    query GetStudentOverallPerformance($studentId: ID!, $courseId: ID) {
      getStudentOverallPerformance(studentId: $studentId, courseId: $courseId) {
        courseId
        courseName
        totalAssignments
        submittedAssignments
        averageGrade
      }
    }
  `;

  // get student module performance
  const GET_MODULE_PERFORMANCE = gql`
    query GetStudentModulePerformance($studentId: ID!, $courseId: ID) {
      getStudentModulePerformance(studentId: $studentId, courseId: $courseId) {
        week
        module
        grade
      }
    }
  `;

  // get student all submission details
  const GET_ALL_SUBMISSIONS = gql`
    query GetAllSubmissions($studentId: ID!, $courseId: ID) {
      getStudentAllSubmissions(studentId: $studentId, courseId: $courseId) {
        week
        module
        title
        score
        maxScore
        status
      }
    }
  `;

  const { data: overallData, loading: loadingOverall } = useQuery(
    GET_OVERALL_PERFORMANCE,
    {
      variables: { studentId: user?.id },
      skip: !user?.id,
    }
  );
  const overallPerformance = overallData?.getStudentOverallPerformance || [];

  const { data: groupedData, loading: loadingGrouped } = useQuery<{
    getStudentModulePerformance: {
      week: number;
      module: string;
      grade: number;
    }[];
  }>(GET_MODULE_PERFORMANCE, {
    variables: { studentId: user?.id },
    skip: !user?.id,
  });

  const { data: allSubsData, loading: loadingAll } = useQuery<{
    getStudentAllSubmissions: {
      week: number;
      module: string;
      title: string;
      score?: number;
      maxScore?: number;
      status: string;
    }[];
  }>(GET_ALL_SUBMISSIONS, {
    variables: { studentId: user?.id },
    skip: !user?.id,
  });

  const chartLabels =
    groupedData?.getStudentModulePerformance.map(
      (item) => `Week ${item.week} - ${item.module}`
    ) || [];
  const chartGrades =
    groupedData?.getStudentModulePerformance.map((item) => item.grade) || [];

  const scores =
    allSubsData?.getStudentAllSubmissions?.map((sc: any) => sc.score) || [];
  const maxScores =
    allSubsData?.getStudentAllSubmissions?.map((sc: any) => sc.maxScore) || [];

  //  Color function based on score % of maxScore
  function getScoreColor(score: number, maxScore: number): string {
    if (
      typeof score !== "number" ||
      typeof maxScore !== "number" ||
      maxScore === 0
    ) {
      return "#9ca3af"; // Gray for invalid values
    }

    const percentage = (score / maxScore) * 100;

    if (percentage >= 75) {
      return "#22c55e"; // Green
    } else if (percentage >= 50) {
      return "#eab308"; // Yellow
    } else {
      return "#ef4444"; // Red
    }
  }

  // Map scores and maxScores to background colors
  const backgroundColors = scores.map((score: number, index: number) =>
    getScoreColor(score, maxScores[index])
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Average Grade",
        data: chartGrades,
        fill: true,
        // borderColor: "#3b82f6",
        // backgroundColor: (ctx: any) => generateGradient(ctx),
        backgroundColor: backgroundColors,
        tension: 0.4,
        pointRadius: 3, // Smaller points
        pointBackgroundColor: "#3b82f6",
        borderWidth: 2, // Thinner line
        barThickness: 60,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom dimensions
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12, // Smaller legend box
          padding: 10,
        },
      },
      title: {
        display: true,
        text: "Modules Performance",
        font: { size: 14, weight: "bold" }, // Smaller title font
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` Grade: ${context.raw ?? 0}%`,
        },
        padding: 8,
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          padding: 5,
          callback: function (value) {
            const label = this.getLabelForValue(value as number);
            return label.length > 8 ? label.slice(0, 8) + "…" : label;
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.1)" }, // Lighter y-axis grid lines
        ticks: {
          font: { size: 10 }, // Smaller y-axis labels
          padding: 5,
        },
      },
    },
    onClick: (evt: any, elements) => {
      if (elements.length > 0) {
        // const index = elements[0].index;
        // const label = chartLabels[index];
        // const [weekText, moduleName] = label.split(" - ");
        // const weekNumber = parseInt(weekText.replace("Week ", ""));
        // navigate(
        //   `/student/performance/week/${weekNumber}/module/${moduleName}`
        // );
        console.log("Ctrl key pressed:", evt.ctrlKey);
      }
    },
  };

  return (
    <div className="p-6">
      {/* Your Path Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Career Path
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="space-y-6">
            {renderProgressStep(1, "Create Your Profile", true, false)}
            <div className="ml-4 w-px h-6 bg-gray-200"></div>
            {renderProgressStep(
              2,
              "Take Scholarship Test",
              hasAttemptedTest,
              !hasAttemptedTest
            )}
            <div className="ml-4 w-px h-6 bg-gray-200"></div>

            {/* Custom Step 3 with Scholarship Button */}
            <div className="flex items-start">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  hasAttemptedTest || userData?.plan === "premium"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {hasAttemptedTest || userData?.plan === "premium" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  3
                )}
              </div>
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    hasAttemptedTest || userData?.plan === "premium"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  Register for UntraddCareer Program
                </p>
                {userData?.plan === "premium" ? (
                  <div className="mt-2">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 mb-2 flex items-center">
                        🎉{" "}
                        <span className="ml-2 font-semibold">
                          Congratulations! Your true journey begins here!
                        </span>
                      </p>
                      <p className="text-xs text-green-600">
                        You are successfully enrolled in the{" "}
                        {userData.course || "UntraddCareer"} program with{" "}
                        {userData.plan} plan.
                      </p>
                    </div>
                  </div>
                ) : hasAttemptedTest && testResult && testResult.score >= 60 ? (
                  <div className="mt-2">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 mb-2">
                        🎉 Congratulations! You're eligible for{" "}
                        {getScholarshipDiscount(testResult.score)}% scholarship
                      </p>
                      {testResult.score >= 70 ? (
                        <button
                          onClick={() =>
                            window.open("https://rzp.io/rzp/wND9YCXB", "_blank")
                          }
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 text-xs flex items-center justify-center font-semibold shadow-md transform hover:scale-105 transition-all duration-200 w-full"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Register Now with{" "}
                          {getScholarshipDiscount(testResult.score)}%
                          Scholarship
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            window.open("https://rzp.io/rzp/wND9YCXB", "_blank")
                          }
                          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-xs flex items-center justify-center w-full"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Claim Your {getScholarshipDiscount(testResult.score)}%
                          Scholarship
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
                        onClick={() =>
                          window.open("https://rzp.io/rzp/wND9YCXB", "_blank")
                        }
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
            {renderProgressStep(
              4,
              "Your Journey has started!",
              userData?.plan === "premium",
              false
            )}
          </div>
        </div>
      </div>
      {/* Quick Actions Section */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          userData?.plan === "premium"
            ? "sm:grid-cols-1 lg:grid-cols-1"
            : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="ml-3 font-medium text-gray-900">Scholarship Test</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {hasAttemptedTest
              ? "You have completed the scholarship test."
              : "Take our assessment to qualify for scholarships up to 15%."}
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
                        <p className="text-lg font-bold text-blue-600">
                          {testResult.score}%
                        </p>
                      </div>
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    {testResult.score >= 60 && (
                      <p className="text-xs text-green-600 mt-1">
                        Eligible for {getScholarshipDiscount(testResult.score)}%
                        scholarship
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
        {userData?.plan !== "premium" && (
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600 w-5 h-5" />
              </div>
              <h3 className="ml-3 font-medium text-gray-900">
                Free Counseling
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Book a free career counseling session with our industry experts to
              get your career on track.
            </p>
            <button
              onClick={() => openModal("counseling")}
              className="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 flex items-center justify-center"
            >
              Scheduled for 3rd June
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {userData?.plan === "premium" && (
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Charts Section: Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Performance Chart */}
            <div className="bg-white p-4 rounded-2xl shadow border">
              <motion.div
                className="p-4 bg-white rounded-2xl shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
                  Overall Performance Chart
                </h3>
                <div className="w-full h-60 md:h-72 border border-gray-100 rounded-lg overflow-x-auto">
                  {loadingOverall ? (
                    <p className="text-center text-gray-600 py-4 text-sm md:text-base">
                      Loading chart...
                    </p>
                  ) : (
                    <OverallPerformanceChart data={overallPerformance} />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Modules Performance Chart */}
            <div className="bg-white p-4 rounded-2xl shadow border">
              <motion.div
                className="p-4 bg-white rounded-2xl shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
                  Modules Performance Chart
                </h3>
                <div className="w-full h-60 md:h-72 border border-gray-100 rounded-lg overflow-x-auto">
                  {loadingGrouped ? (
                    <p className="text-center text-gray-600 py-4 text-sm md:text-base">
                      Loading chart...
                    </p>
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Submission Details Table */}
          <div className="bg-white p-4 rounded-2xl shadow border">
            <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">
              Submission Details
            </h3>
            {loadingAll ? (
              <p className="text-center text-gray-600 py-4 text-sm md:text-base">
                Loading submissions...
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="min-w-[600px] w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-3">Week</th>
                      <th className="text-left py-2 px-3">Module</th>
                      <th className="text-left py-2 px-3">Title</th>
                      <th className="text-left py-2 px-3">Score</th>
                      <th className="text-left py-2 px-3">Max</th>
                      <th className="text-left py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSubsData?.getStudentAllSubmissions.map((sub, idx) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-2 px-3">{sub.week}</td>
                        <td className="py-2 px-3">{sub.module}</td>
                        <td className="py-2 px-3">{sub.title}</td>
                        <td className="py-2 px-3">{sub.score ?? "-"}</td>
                        <td className="py-2 px-3">{sub.maxScore ?? "-"}</td>
                        <td className="py-2 px-3 capitalize">{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
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
              <h3 className="text-lg font-medium text-gray-900">
                Membership Required
              </h3>
            </div>

            {modalType === "community" && (
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  To access the alumni community, you need to be a program
                  member. Currently, it seems you are not enrolled in any
                  program.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Join our program to connect with successful alumni and build
                  your professional network.
                </p>
              </div>
            )}

            {modalType === "counseling" && (
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  To take a free counseling session worth $100, you need to be a
                  program member. Currently, it seems you are not enrolled in
                  any program.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Take a program to become a member or talk to our program
                  coordinator for more information.
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Explore Programs
              </button>
              <a
                href={`https://wa.me/918789698369?text=Hello, I'm ${
                  user?.firstName || "a student"
                } and I would like to know more about becoming a program member at UntraddCareer.`}
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
    </div>
  );
};

export default OverviewTab;
