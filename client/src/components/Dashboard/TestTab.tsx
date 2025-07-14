import { FC} from "react";
import {ArrowRight ,Award,DollarSign,Star,GraduationCap,TrendingUp,Briefcase} from "lucide-react";
import { TestResult } from "@/types/testresult";
import { useUser } from "@clerk/clerk-react";


interface TestTabProps {
  hasAttemptedTest?: boolean;
  testResult?: TestResult | null;
  testHistory?: TestResult[] | null;
  handleStartTest?: () => void;
}

const TestTab: FC<TestTabProps> = ({
  hasAttemptedTest,
  testResult,
  testHistory,
  handleStartTest,
}) => {

  const { user } = useUser();

  const SCHOLARSHIP_TIERS = [
  { minScore: 80, discount: 15 },
  { minScore: 70, discount: 10 },
  { minScore: 60, discount: 5 },
];
  // Function to determine scholarship eligibility
const getScholarshipDiscount = (score: number): number => {
  for (const tier of SCHOLARSHIP_TIERS) {
    if (score >= tier.minScore) {
      return tier.discount;
    }
  }
  return 0;
};

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Scholarship Test
        </h2>
        <p className="text-gray-600 mb-4">
          Our scholarship test assesses your aptitude and knowledge. Based on
          your performance, you may qualify for tuition discounts up to 15%.
        </p>
        {testHistory && testHistory.length > 0 && (
  <p className="text-sm text-gray-500 mb-4">
    You have taken {testHistory.length} test
    {testHistory.length > 1 ? "s" : ""} so far.
  </p>
)}
      </div>

      {hasAttemptedTest ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Your Test Result</h3>
          </div>
          <div className="p-5">
            {testResult && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Test Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {testResult.score}%
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Completed On</p>
                    <p className="text-sm font-medium">
                      {new Date(testResult.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Time Spent</p>
                    <p className="text-sm font-medium">
                      {Math.floor(testResult.timeSpent / 60)} minutes
                    </p>
                  </div>
                </div>

                {/* Scholarship Eligibility Information */}
                {testResult.score >= 60 ? (
                  <div className="mt-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-green-800 flex items-center mb-2">
                      <Award className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Congratulations!</span>
                    </p>
                    <p className="text-green-700">
                      You are eligible for a{" "}
                      <span className="font-bold">
                        {getScholarshipDiscount(testResult.score)}% scholarship
                        discount
                      </span>{" "}
                      on your program fees!
                    </p>
                    <div className="mt-3 flex flex-col space-y-2">
                      {testResult.score >= 70 ? (
                        <button
                          onClick={() =>
                            window.open("https://rzp.io/rzp/wND9YCXB", "_blank")
                          }
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 text-sm flex items-center justify-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <DollarSign className="mr-2 h-5 w-5" />
                          Register Now with{" "}
                          {getScholarshipDiscount(testResult.score)}%
                          Scholarship
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            window.open("https://rzp.io/rzp/wND9YCXB", "_blank")
                          }
                          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"
                        >
                          Claim Your Scholarship
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          window.open(
                            `https://wa.me/918789698369?text=Hello, I'm ${
                              user?.firstName || "a student"
                            } and I scored ${
                              testResult.score
                            }% on the scholarship test. I would like to know more about claiming my ${getScholarshipDiscount(
                              testResult.score
                            )}% scholarship discount.`,
                            "_blank"
                          )
                        }
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                      >
                        Contact for Scholarship Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-yellow-800 text-sm">
                      You need a score of at least 60% to qualify for a
                      scholarship discount.
                    </p>
                    <a
                      href={`https://wa.me/918789698369?text=Hello, I'm ${
                        user?.firstName || "a student"
                      } and I would like to request a retest for the UntraddCareer scholarship test.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm flex items-center"
                    >
                      Request a retest
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="text-center py-6">
            <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to qualify for a scholarship?
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Take our assessment to demonstrate your skills and knowledge.
              Score at least 60% to qualify for tuition discounts.
            </p>
            <div>
              <div className="mb-6 flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center text-gray-700">
                  <Star className="text-yellow-500 h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Score 80% or above for a 15% scholarship
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Star className="text-yellow-500 h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Score 70% or above for a 10% scholarship
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Star className="text-yellow-500 h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Score 60% or above for a 5% scholarship
                  </span>
                </div>
              </div>
              <button
                onClick={handleStartTest}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center mb-4"
              >
                Take Scholarship Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  window.open("https://rzp.io/rzp/wND9YCXB", "_blank")
                }
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship Statistics */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Scholarship Impact</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                <p className="font-medium text-gray-900">100+</p>
              </div>
              <p className="text-sm text-gray-600">
                Students received scholarships
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <p className="font-medium text-gray-900">96%</p>
              </div>
              <p className="text-sm text-gray-600">Placement success rate</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                <p className="font-medium text-gray-900">₹3T - ₹25T</p>
              </div>
              <p className="text-sm text-gray-600">Monthly Stipend Range</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTab;
