import { MessageCircle, Star } from 'lucide-react';

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

interface CounselingFeedbackTabProps {
  feedback: StudentFeedback | null;
}

const CounselingFeedbackTab: React.FC<CounselingFeedbackTabProps> = ({ feedback }) => {
  if (!feedback) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Feedback Available</h3>
        <p className="text-gray-600">
          Your counseling feedback will appear here after your counseling session.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Counseling Feedback</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p><span className="font-medium">Name:</span> {feedback.name}</p>
              <p><span className="font-medium">Semester:</span> {feedback.semester}</p>
              <p><span className="font-medium">College:</span> {feedback.college}</p>
              <p>
                <span className="font-medium">Three Words:</span>{' '}
                {feedback.threeWords.join(', ')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Profile</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p><span className="font-medium">Course Chosen:</span> {feedback.courseChosen}</p>
              <div className="mt-2">
                <p className="font-medium mb-1">Language Proficiency:</p>
                <div className="flex space-x-4">
                  <div>
                    <p className="text-sm text-gray-600">English</p>
                    <div className="flex items-center">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.englishRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hindi</p>
                    <div className="flex items-center">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.hindiRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Strengths & Areas of Growth</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3">
                <p className="font-medium text-gray-900">Strengths</p>
                <p className="text-gray-600">{feedback.strengths}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Areas for Improvement</p>
                <p className="text-gray-600">{feedback.areasOfImprovement}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Development</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="font-medium text-gray-900">Stress Handling</p>
                <p className="text-gray-600">{feedback.stressHandling}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Motivation</p>
                <p className="text-gray-600">{feedback.motivation}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Confidence</p>
                <p className="text-gray-600">{feedback.confidence}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Decision Making</p>
                <p className="text-gray-600">{feedback.decisionMaking}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Journey</h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-900">Biggest Achievement</p>
                <p className="text-gray-600">{feedback.biggestAchievement}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Turning Point</p>
                <p className="text-gray-600">{feedback.turningPoint}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Handling Conflicts</p>
                <p className="text-gray-600">{feedback.conflicts}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Future Concerns</p>
                <p className="text-gray-600">{feedback.futureConcern}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Insights</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">Alignment in Thoughts and Decisions</p>
              <p className="text-gray-600">{feedback.alignInThoughts}</p>
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            Last Updated: {new Date(feedback.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingFeedbackTab; 