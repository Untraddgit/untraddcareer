import { FC, useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Play,
  Lock,
  Wrench,
  Target,
} from "lucide-react";
// types
import {
  PredefinedCourseData,
  PredefinedCourseProgress,
} from "@/types/predefinedcourses";
import { User } from "@/types/user";
// clerk  Id
import { useUser } from "@clerk/clerk-react";

// CourseTabProps import
interface CourseTabProps {
  userData?: User | null;
  upcomingSessions?: any;
  predefinedCourseData?: PredefinedCourseData | null;
  predefinedCourseProgress?: PredefinedCourseProgress | null;
  loadingPredefinedCourse?: boolean;
  handleAssignmentSubmission: (week: any, assignment: any) => void;
  assignmentSubmissions?: any | null;
}


const CourseTab: FC<CourseTabProps> = ({
  userData,
  upcomingSessions,
  predefinedCourseData,
  predefinedCourseProgress,
  loadingPredefinedCourse,
  handleAssignmentSubmission,
  assignmentSubmissions,
}) => {
  // import user form clerk
const { user } = useUser();

// course states 
const [showSyllabus, setShowSyllabus] = useState(false);
const [expandedTopics, setExpandedTopics] = useState<{
  [key: number]: boolean;
}>({});

const toggleTopic = (weekIndex: number) => {
  setExpandedTopics((prev) => ({
    ...prev,
    [weekIndex]: !prev[weekIndex],
  }));
};

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Course Materials
        </h2>
        <p className="text-gray-600 mb-4">
          {predefinedCourseData
            ? `Follow your ${
                predefinedCourseData.displayName ||
                predefinedCourseData.courseName
              } course roadmap and track your progress.`
            : "Access your course materials and track your learning progress."}
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
                <h3 className="text-xl font-bold text-gray-900">
                  {predefinedCourseData.displayName ||
                    predefinedCourseData.courseName}
                </h3>
                <p className="text-gray-600 mt-1">
                  {predefinedCourseData.courseDescription}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {predefinedCourseProgress.overallProgress}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  Duration: {predefinedCourseData.durationWeeks} weeks
                </span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  Modules: {predefinedCourseData.weeklyRoadmap.length}
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  Time Spent:{" "}
                  {Math.floor(predefinedCourseProgress.totalTimeSpent / 60)}h{" "}
                  {predefinedCourseProgress.totalTimeSpent % 60}m
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-white rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                  style={{
                    width: `${predefinedCourseProgress.overallProgress}%`,
                  }}
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
                    <h4 className="font-semibold text-gray-900">
                      Course Syllabus & Tools
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Complete roadmap with technologies and expected outcomes
                    </p>
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
                  <h5 className="font-medium text-gray-900 mb-3">
                    🛠️ Tools & Technologies
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      predefinedCourseData.toolsAndTechnologies || {}
                    ).map(([category, tools]) => (
                      <div key={category} className="bg-gray-50 rounded-lg p-3">
                        <h6 className="text-sm font-medium text-gray-800 mb-2 capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h6>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(tools) ? (
                            tools.map((tool: string, index: number) => (
                              <span
                                key={index}
                                className="text-xs bg-white text-gray-700 px-2 py-1 rounded border"
                              >
                                {tool}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No tools specified
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcomes */}
                <div className="mb-6">
                  <h5 className="font-medium text-gray-900 mb-3">
                    🎯 Expected Outcomes
                  </h5>
                  <div className="space-y-2">
                    {predefinedCourseData.expectedOutcomes.map(
                      (outcome, index) => (
                        <div key={index} className="flex items-start">
                          <span className="bg-green-100 text-green-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            ✓
                          </span>
                          <p className="text-sm text-gray-700">{outcome}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-blue-800 mb-1">
                      Effort Required
                    </h6>
                    <p className="text-sm text-blue-700">
                      {predefinedCourseData.effortPerWeek}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-purple-800 mb-1">
                      Live Classes
                    </h6>
                    <p className="text-sm text-purple-700">
                      {predefinedCourseData.liveClassesPerWeek} per week
                    </p>
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
                Current Week: {predefinedCourseProgress.currentWeek} /{" "}
                {predefinedCourseData.durationWeeks}
              </div>
            </div>
          </div>

          {/* Weekly Modules */}
          <div className="space-y-4">
            {predefinedCourseData.weeklyRoadmap.map((week, weekIndex) => {
              const moduleProgress = predefinedCourseProgress.modules.find(
                (m) => m.week === week.week
              );
              const isLocked = false; // All modules are now unlocked for students
              const isCompleted = moduleProgress?.isCompleted ?? false;
              const isExpanded = expandedTopics[weekIndex];

              return (
                <div
                  key={weekIndex}
                  className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                    isLocked
                      ? "border-gray-300 opacity-75"
                      : isCompleted
                      ? "border-green-300"
                      : "border-blue-300"
                  }`}
                >
                  <button
                    onClick={() => !isLocked && toggleTopic(weekIndex)}
                    disabled={isLocked}
                    className={`w-full p-4 border-b transition-colors ${
                      isLocked
                        ? "bg-gray-100 cursor-not-allowed"
                        : isCompleted
                        ? "bg-green-50 hover:bg-green-100 border-green-200"
                        : "bg-blue-50 hover:bg-blue-100 border-blue-200"
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
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isLocked
                                ? "bg-gray-200 text-gray-500"
                                : isCompleted
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {week.week}
                          </span>
                        </div>
                        <div className="text-left">
                          <h4
                            className={`font-semibold ${
                              isLocked ? "text-gray-500" : "text-gray-900"
                            }`}
                          >
                            Week {week.week}: {week.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isCompleted && (
                          <span className="text-green-600 text-sm mr-3">
                            Completed
                          </span>
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
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          📚 Topics:
                        </h6>
                        <div className="space-y-1">
                          {week.topics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="bg-gray-50 rounded p-2"
                            >
                              <span className="text-sm text-gray-700">
                                • {topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects */}
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          🚀 Projects:
                        </h6>
                        <div className="space-y-2">
                          {week.projects.map((project, projectIndex) => (
                            <div
                              key={projectIndex}
                              className="bg-blue-50 rounded p-3"
                            >
                              <span className="text-sm font-medium text-blue-800">
                                {typeof project === "string"
                                  ? project
                                  : project.title}
                              </span>
                              {typeof project === "object" &&
                                project.description && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {project.description}
                                  </p>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live Class Topics */}
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          🎥 Live Class Topics:
                        </h6>
                        <div className="space-y-1">
                          {week.liveClassTopics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="bg-purple-50 rounded p-2"
                            >
                              <span className="text-sm text-purple-700">
                                • {topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      {week.resources && week.resources.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-sm font-medium text-gray-700 mb-2">
                            📖 Resources:
                          </h6>
                          <div className="space-y-2">
                            {week.resources.map((resource, resourceIndex) => (
                              <div
                                key={resourceIndex}
                                className="bg-yellow-50 rounded p-3"
                              >
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
                          <h6 className="text-sm font-medium text-gray-700 mb-2">
                            📝 Assignments:
                          </h6>
                          <div className="space-y-2">
                            {week.assignments.map(
                              (assignment, assignmentIndex) => {
                                const submission = assignmentSubmissions.find(
                                  (s:any) =>
                                    s.assignmentId === assignment._id &&
                                    s.week === week.week
                                );

                                return (
                                  <div
                                    key={assignmentIndex}
                                    className="bg-green-50 rounded p-3"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h6 className="text-sm font-medium text-green-800">
                                          {assignment.title}
                                        </h6>
                                        <p className="text-xs text-green-700 mt-1">
                                          {assignment.description}
                                        </p>
                                        {assignment.dueDate && (
                                          <p className="text-xs text-green-600 mt-1">
                                            Due:{" "}
                                            {new Date(
                                              assignment.dueDate
                                            ).toLocaleDateString()}
                                          </p>
                                        )}

                                        {/* Submission Status */}
                                        {submission && (
                                          <div className="mt-2 p-2 bg-white rounded border">
                                            <div className="flex items-center justify-between text-xs">
                                              <span
                                                className={`px-2 py-1 rounded font-medium ${
                                                  submission.status
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                              >
                                                {submission.status
                                                  ? "Graded"
                                                  : "Submitted - Pending Review"}
                                              </span>
                                              {submission.status && (
                                                <span className="font-medium text-green-600">
                                                  Score: {submission.score}/
                                                  {assignment.maxScore}
                                                </span>
                                              )}
                                            </div>

                                            {submission.feedback && (
                                              <div className="mt-2">
                                                <p className="text-xs text-gray-600 font-medium">
                                                  Feedback:
                                                </p>
                                                <p className="text-xs text-gray-700 mt-1">
                                                  {submission.feedback}
                                                </p>
                                              </div>
                                            )}

                                            <div className="mt-1 text-xs text-gray-500">
                                              Submitted:{" "}
                                              {new Date(
                                                submission.submittedAt
                                              ).toLocaleDateString()}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {!submission && (
                                        <button
                                          onClick={() =>
                                            handleAssignmentSubmission(
                                              week,
                                              assignment
                                            )
                                          }
                                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                        >
                                          Submit
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
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
              {Object.entries(
                predefinedCourseData.toolsAndTechnologies || {}
              ).map(([category, tools]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3">
                  <h6 className="text-sm font-medium text-gray-800 mb-2 capitalize">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </h6>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(tools) ? (
                      tools.map((tool: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-white text-gray-700 px-2 py-1 rounded border"
                        >
                          {tool}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">
                        No tools specified
                      </span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Course Assigned
          </h3>
          <p className="text-gray-600 mb-4">
            You don't have a course assigned yet. Contact your administrator to
            get enrolled in a course.
          </p>
          <a
            href={`https://wa.me/918789698369?text=Hello, I'm ${
              user?.firstName || "a student"
            } and I would like to know about course enrollment.`}
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
                  {upcomingSessions.map((session:any) => (
                    <li
                      key={session._id}
                      className="border-b border-gray-100 pb-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            {session.title}
                          </p>
                          {session.description && (
                            <p className="text-gray-600 text-xs mt-1">
                              {session.description}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(session.date).toLocaleDateString()} •{" "}
                            {session.time}
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
                  <p className="text-gray-500 text-xs">
                    Marketing and Branding, Cosmos Digital
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "Coming from a tier-3 college, I had minimal exposure to
                    industry trends. UntraddCareer helped me build practical
                    marketing skills that employers actually want."
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
                  <p className="text-gray-500 text-xs">
                    Full Stack Intern, IeltsAppeal Education
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "Despite having zero coding experience, the structured
                    training helped me transition from BBA to tech. My
                    internship converted to a full-time role within 2 months!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTab;
