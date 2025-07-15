import { FC } from "react";
import {ExternalLink,} from "lucide-react";

// types
import { PredefinedCourseData } from "@/types/predefinedcourses";

interface CourseDetailsTabProps {
  selectedCourse: PredefinedCourseData | null;
  setShowCourseDetails: (value: boolean) => void;
  openResourceModal:(weekNumber: number) => void;
  openAssignmentModal:(weekNumber :number) => void;
}

const CourseDetailsTab: FC<CourseDetailsTabProps> = ({
  selectedCourse,
  setShowCourseDetails,
  openResourceModal,
  openAssignmentModal
}) => {
  if (!selectedCourse) return null;

  return (
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
            {selectedCourse.displayName || selectedCourse.courseName} - Detailed
            Management
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
                selectedCourse.isActive ? "text-green-600" : "text-red-600"
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
          {selectedCourse.weeklyRoadmap?.map((week: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">
                    Week {week.week}: {week.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Topics: {week.topics?.join(", ") || "No topics defined"}
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
                    {week.resources.map((resource: any, rIndex: number) => (
                      <div
                        key={rIndex}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                            {resource.type}
                          </span>
                          <span className="text-sm">{resource.title}</span>
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
                    ))}
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
                    {week.assignments.map((assignment: any, aIndex: number) => (
                      <div key={aIndex} className="bg-yellow-50 p-2 rounded">
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsTab;
