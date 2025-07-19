import { FC, useState } from "react";
import BarChartView from "./BarChartView";
import RadialChartView from "./RadialChartView";
import { Switch } from "@radix-ui/react-switch";

interface Props {
  courseName: string;
  completionPercent: number;
  assignmentPercent: number;
  completedModules: number;
  totalModules: number;
  submittedAssignments: number;
  totalAssignments: number;
}

const CourseProgressCard: FC<Props> = ({
  courseName,
  completionPercent,
  assignmentPercent,
  completedModules,
  totalModules,
  submittedAssignments,
  totalAssignments,
}) => {
  const [viewType, setViewType] = useState<"bar" | "radial">("radial");

  return (
    <div className="min-w-[320px] max-w-[400px] w-full p-4 bg-white rounded-2xl shadow border border-gray-200 space-y-4 transition hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900">
          {courseName.length > 40
            ? courseName.slice(0, 40) + "..."
            : courseName}
        </h3>

        <div className="flex items-center space-x-2 text-sm">
          <span>Bar</span>
          <Switch
            checked={viewType === "radial"}
            onCheckedChange={(val) => setViewType(val ? "radial" : "bar")}
          />
          <span>Radial</span>
        </div>
      </div>

      {viewType === "radial" ? (
        <RadialChartView
          completionPercent={completionPercent}
          assignmentPercent={assignmentPercent}
        />
      ) : (
        <BarChartView
          completionPercent={completionPercent}
          assignmentPercent={assignmentPercent}
          courseName={courseName}
        />
      )}

      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mt-2">
        <div>
          <span className="block font-medium text-gray-800">
            {completedModules} / {totalModules}
          </span>
          <span>Modules Completed</span>
        </div>
        <div>
          <span className="block font-medium text-gray-800">
            {submittedAssignments} / {totalAssignments}
          </span>
          <span>Assignments Submitted</span>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressCard;
