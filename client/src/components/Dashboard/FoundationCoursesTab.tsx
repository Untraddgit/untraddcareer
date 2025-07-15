import { PredefinedCourseData, PredefinedCourseProgress } from "@/types/predefinedcourses";
import { Clock,BookOpen,TrendingUp,ChevronDown,ChevronRight,Play,GraduationCap,Lock} from "lucide-react";
import { FC, useState } from "react";

interface FoundationCoursesTabProps {
  foundationCourseData?: PredefinedCourseData | null;
  foundationCourseProgress?: PredefinedCourseProgress | null;
  loadingFoundationCourse?: boolean;
  handleAssignmentSubmission?: (week: any, assignment: any) => void;
  assignmentSubmissions?: any | null;
}

const FoundationCoursesTab: FC<FoundationCoursesTabProps> = ({
  foundationCourseData,
  foundationCourseProgress,
  loadingFoundationCourse,
}) => {

  // foundation course state 
  const [showFoundationSyllabus, setShowFoundationSyllabus] = useState(false);
  const [expandedFoundationTopics, setExpandedFoundationTopics] = useState<{
      [key: number]: boolean;
    }>({});


   const toggleFoundationTopic = (weekIndex: number) => {
    setExpandedFoundationTopics((prev) => ({
      ...prev,
      [weekIndex]: !prev[weekIndex],
    }));
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Foundation Training Course
        </h2>
        <p className="text-gray-600 mb-4">
          {foundationCourseData
            ? `Follow your ${
                foundationCourseData.displayName ||
                foundationCourseData.courseName
              } course roadmap and track your progress.`
            : "Access your foundation training course materials and track your learning progress."}
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
                <h3 className="text-xl font-bold text-gray-900">
                  {foundationCourseData.displayName ||
                    foundationCourseData.courseName}
                </h3>
                <p className="text-gray-600 mt-1">
                  {foundationCourseData.courseDescription}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {foundationCourseProgress.overallProgress}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  Duration: {foundationCourseData.durationWeeks} weeks
                </span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  Modules: {foundationCourseData.weeklyRoadmap.length}
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  Time Spent:{" "}
                  {Math.floor(foundationCourseProgress.totalTimeSpent / 60)}h{" "}
                  {foundationCourseProgress.totalTimeSpent % 60}m
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-white rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                  style={{
                    width: `${foundationCourseProgress.overallProgress}%`,
                  }}
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
                    <h4 className="font-semibold text-gray-900">
                      Course Syllabus & Tools
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Complete roadmap with technologies and expected outcomes
                    </p>
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
                  <h5 className="font-medium text-gray-900 mb-3">
                    🛠️ Tools & Technologies
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      foundationCourseData.toolsAndTechnologies || {}
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
                    {foundationCourseData.expectedOutcomes.map(
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
                      {foundationCourseData.effortPerWeek}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-purple-800 mb-1">
                      Live Classes
                    </h6>
                    <p className="text-sm text-purple-700">
                      {foundationCourseData.liveClassesPerWeek} per week
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
                Current Week: {foundationCourseProgress.currentWeek} /{" "}
                {foundationCourseData.durationWeeks}
              </div>
            </div>
          </div>

          {/* Weekly Modules */}
          <div className="space-y-4">
            {foundationCourseData.weeklyRoadmap.map((week, weekIndex) => {
              const moduleProgress = foundationCourseProgress.modules.find(
                (m) => m.week === week.week
              );
              const isLocked = false; // All modules are now unlocked for students
              const isCompleted = moduleProgress?.isCompleted ?? false;
              const isExpanded = expandedFoundationTopics[weekIndex];

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
                    onClick={() =>
                      !isLocked && toggleFoundationTopic(weekIndex)
                    }
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Foundation Course Not Available
          </h3>
          <p className="text-gray-600">
            The foundation training course will appear here when it becomes
            available.
          </p>
        </div>
      )}
    </div>
  );
};

export default FoundationCoursesTab;
