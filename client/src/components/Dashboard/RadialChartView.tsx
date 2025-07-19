import { FC } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  ChartOptions,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Title);

interface Props {
  completionPercent: number;
  assignmentPercent: number;
}

const RadialChartView: FC<Props> = ({
  completionPercent,
  assignmentPercent,
}) => {
  const createChartData = (value: number, color: string) => ({
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#E5E7EB"], 
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  });

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center space-x-6">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <Doughnut data={createChartData(completionPercent, "#3B82F6")} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-600">Modules</span>
          <span className="text-sm font-bold text-blue-600">
            {completionPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <Doughnut data={createChartData(assignmentPercent, "#10B981")} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-600">Assignments</span>
          <span className="text-sm font-bold text-green-600">
            {assignmentPercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadialChartView;
