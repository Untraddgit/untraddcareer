import PredefinedCourse from "../models/PredefinedCourse";
import AssignmentSubmission from "../models/AssignmentSubmission";
export const resolvers = {
  Query: {
    getStudentOverallPerformance: async (
      _: any,
      { studentId }: { studentId: string }
    ) => {
      const submissions = await AssignmentSubmission.find({
        studentId,
        status: { $in: ["submitted", "graded"] },
      });

      const courseMap = new Map();

      for (const sub of submissions) {
        const key = sub.courseId.toString();

        if (!courseMap.has(key)) {
          courseMap.set(key, {
            submittedAssignments: 0,
            completedModulesSet: new Set(),
          });
        }

        const courseEntry = courseMap.get(key);
        courseEntry.submittedAssignments += 1;
        courseEntry.completedModulesSet.add(`${sub.week}-${sub.module}`);
      }

      const result = [];

      for (const [courseId, data] of courseMap.entries()) {
        const course = await PredefinedCourse.findById(courseId);
        if (!course) continue;

        const totalModules = course.weeklyRoadmap.length;
        // Count completed modules (unique week-module combos)
        const completedModuleSet = new Set();
        let totalScore = 0;
        let maxScore = 0;

        for (const sub of submissions) {
          completedModuleSet.add(`${sub.week}-${sub.module}`);
          if (
            typeof sub.score === "number" &&
            typeof sub.maxScore === "number"
          ) {
            totalScore += sub.score;
            maxScore += sub.maxScore;
          }
        }

        const totalAssignments = course.weeklyRoadmap.reduce((sum, week) => {
          return sum + (week.assignments?.length || 0);
        }, 0);

        const averageGrade =
          maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : null;

        result.push({
          courseId,
          courseName: course.displayName,
          totalModules,
          completedModules: data.completedModulesSet.size,
          totalAssignments,
          submittedAssignments: data.submittedAssignments,
          averageGrade,
        });
      }

      return result;
    },
  },
};
