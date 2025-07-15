import { FC} from "react";
import { BookOpen } from "lucide-react";
import api from "@/utils/axios";

import { PredefinedCourseData } from "@/types/predefinedcourses";
import { useAuth } from "@clerk/clerk-react";

interface CoursesTabProps {
  courses:  PredefinedCourseData[];
//   formatDate: (date: string) => string;
  viewCourseDetails: (course: any) => void;
 openCourseModal: (course?: any) => void;
  viewAssignmentSubmissions: (course?: any) => void;
  setCourses: React.Dispatch<React.SetStateAction<PredefinedCourseData[]>>;
//   onEditCourse: (course: Course) => void;
//   onDeleteCourse: (id: string) => void;
//   onAddCourse: () => void;
}

const CoursesTab: FC<CoursesTabProps> = ({
  courses,
  viewCourseDetails,
  openCourseModal,
  viewAssignmentSubmissions,
  setCourses,
//   formatDate,
//   onEditCourse,
//   onDeleteCourse,
//   onAddCourse,
}) => {
    // get token form clerk
  const { getToken } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Course Management
        </h2>
        <div className="flex space-x-3">
          <select
            onChange={(e) => {
              const course = courses.find((c) => c._id === e.target.value);
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
                  {course.durationWeeks} weeks • {course.liveClassesPerWeek}{" "}
                  classes/week
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
                        confirm("Are you sure you want to delete this course?")
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
                          console.error("Error deleting course:", error);
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
  );
};

export default CoursesTab;
