import { FC } from "react";
import { Calendar,MessageCircle } from "lucide-react";
// types 
import { StudentData } from "@/types/studentdata";
import { StudentFeedback } from "@/types/studentfeedback";


// props
interface CounselingFeedbackTabProps {
  setShowSessionModal: (value: boolean) => void;
  students: StudentData[] | null;
  studentFeedback: StudentFeedback[] | null;
  openFeedbackModal: (student: StudentData) => void;
}

/-----------------------Admin CounsellingFeedbackTab--------------------/ 
const CounselingFeedbackTab: FC<CounselingFeedbackTabProps> = ({
  setShowSessionModal,
  students,
  studentFeedback,
  openFeedbackModal,
}) => {
  // premmimStudentCard
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
  return (
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
            ?.filter((student) => student.plan === "premium")
            ?.map((student) => premiumStudentCard(student))}
        </div>
      </div>

      {/* Student Feedback */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Student Feedback
        </h4>
        <div className="space-y-4">
          {studentFeedback?.map((feedback: any, index: any) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{feedback.name}</h5>
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
  );
};

export default CounselingFeedbackTab;
