import { FC } from "react";
// types
import { PredefinedCourseData } from "@/types/predefinedcourses";
import { ExternalLink } from "lucide-react";

// props pass
interface SubmissionsTabProps {
  selectedCourse: PredefinedCourseData | null;
  setShowSubmissions: (value: boolean) => void;
  openGradingModal: (submission: any) => void;
  assignmentSubmissions: any | null;
}

const SubmissionsTab: FC<SubmissionsTabProps> = ({
  selectedCourse,
  setShowSubmissions,
  openGradingModal,
  assignmentSubmissions,
}) => {
  return (
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
            {selectedCourse?.displayName || selectedCourse?.courseName}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Submissions
        </h3>

        {assignmentSubmissions?.length > 0 ? (
          <div className="space-y-4">
            {assignmentSubmissions?.map((submission: any) => (
              <div
                key={submission._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {submission.student.firstName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Assignment: {submission.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Week: {submission.week}
                    </p>
                    <p className="text-sm text-gray-500">
                      Moule: {submission.module}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          submission.status
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.status ? "Graded" : "Pending"}
                      </span>
                      {submission.status && (
                        <span className="text-sm font-medium text-gray-900">
                          Score: {submission.score}/{submission.maxScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Submission Link:</p>
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
                    {new Date(submission.submittedAt).toLocaleDateString()} at{" "}
                    {new Date(submission.submittedAt).toLocaleTimeString()}
                  </p>
                </div>

                {submission.feedback && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Feedback:</p>
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
                    {submission.status ? "Edit Grade" : "Grade Assignment"}
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
  );
};

export default SubmissionsTab;
