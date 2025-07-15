import { FC } from "react";
import {
  Users,
  Award,
  TrendingUp,
  FileText,
} from "lucide-react";


// types 
import { StudentData } from "@/types/studentdata";
import { TestResult } from "@/types/testresult";
import { AssignmentSubmission } from "@/types/assignment";
// props
interface OverviewTabProps {
  students: StudentData[];
  testResults: TestResult[];
  submissions: Record<string, AssignmentSubmission[]>;
  studentsMap: Record<string, string>;
  getScoreColor: (score: number, maxScore: number) => string;
  loading: boolean;
}

const OverviewTab: FC<OverviewTabProps> = ({
  students,
  testResults,
  submissions,
  studentsMap,
  getScoreColor,
  loading,
}) => {
  if (loading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">
              {students.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tests Taken</p>
            <p className="text-2xl font-bold text-gray-900">
              {testResults.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">High Performers</p>
            <p className="text-2xl font-bold text-gray-900">
              {testResults.filter((r) => r.score >= 70).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Premium Students
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {students.filter((s) => s.plan === "premium").length}
            </p>
          </div>
        </div>
      </div>

      {/* paste  */}

      {/* Performance Table */}
      <div className="col-span-full bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Student Module Performance
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : Object.keys(submissions).length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Week
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    MaxScore
                  </th>
                  {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Action
                          </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(submissions).map(([studentId, subs]) =>
                  subs.map((s, idx) => (
                    <tr key={`${studentId}-${idx}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700 max-w-[180px] truncate">
                        {studentsMap[studentId] || studentId}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {s.courseId?.courseName || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{s.week}</td>
                      <td className="px-4 py-2 text-gray-700">{s.module}</td>
                      <td className="px-4 py-2 text-gray-700">{s.title}</td>
                      <td className="px-4 py-2">
                        {s.score !== undefined ? (
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              getScoreColor(s.score, s.maxScore) === "green"
                                ? "bg-green-100 text-green-800"
                                : getScoreColor(s.score, s.maxScore) ===
                                  "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : getScoreColor(s.score, s.maxScore) === "red"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {s.score}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{s.maxScore}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
