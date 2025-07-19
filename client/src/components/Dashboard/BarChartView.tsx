// components/BarChartView.tsx
import { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels);

interface Props {
  courseName: string;
  completionPercent: number;
  assignmentPercent: number;
}

const BarChartView: FC<Props> = ({
  completionPercent,
  assignmentPercent,
}) => {
  const data = {
    labels: ["Modules", "Assignments"],
    datasets: [
      {
        label: "Progress",
        data: [completionPercent, assignmentPercent],
        backgroundColor: ["#3B82F6", "#10B981"],
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
        grid: {
          drawTicks: false,
        },
      },
      y: {
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#111827",
        formatter: (val: number) => `${val.toFixed(1)}%`,
        font: {
          weight: "bold",
        },
      },
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x.toFixed(1)}%`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChartView;
