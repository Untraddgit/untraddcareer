import { FC } from "react";
import {Search} from "lucide-react";
// typs
import { TestResult } from "@/types/testresult";
// props
interface TestResultsTabProps {
  filteredResults: TestResult[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterScore: "all" | "high" | "scholarship";
  setFilterScore: (filter: "all" | "high" | "scholarship") => void;
  getScholarshipLevel: (score: number) => {
    level: string;
    color: string;
    bg: string;
  };
  formatDate: (date: string) => string;
  formatTime: (seconds: number) => string;
}

const TestResultsTab: FC<TestResultsTabProps> = ({
  filteredResults,
  searchTerm,
  setSearchTerm,
  filterScore,
  setFilterScore,
  getScholarshipLevel,
  formatDate,
  formatTime,
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterScore}
            onChange={(e) =>
              setFilterScore(e.target.value as "all" | "high" | "scholarship")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Scores</option>
            <option value="high">High Performers (70%+)</option>
            <option value="scholarship">Scholarship Eligible (60%+)</option>
          </select>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scholarship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => {
                const scholarship = getScholarshipLevel(result.score);
                return (
                  <tr key={result._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.score}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${scholarship.bg} ${scholarship.color}`}
                      >
                        {scholarship.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(result.timeSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(result.completedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestResultsTab;
