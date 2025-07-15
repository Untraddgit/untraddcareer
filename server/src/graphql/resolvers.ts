import mongoose, { Query } from "mongoose";
import PredefinedCourse, {
  IPredefinedCourse,
} from "../models/PredefinedCourse";
import AssignmentSubmission, {
  IAssignmentSubmission,
} from "../models/AssignmentSubmission";

export const resolvers = {
  Query: {
     getStudentOverallPerformance: async (
      _: any,
      { studentId, courseId }: { studentId: string; courseId?: string }
    ) => {
      const courseQuery = courseId
        ? { _id: new mongoose.Types.ObjectId(courseId) }
        : {};
      const courses: IPredefinedCourse[] = await PredefinedCourse.find(
        courseQuery
      );
      const results: any[] = [];

      for (const course of courses) {
        const submissions = await AssignmentSubmission.find({
          studentId,
          courseId: course._id,
        });

        if (submissions.length === 0) continue;

        const gradedSubmissions = submissions.filter(
          (s) => s.status === "graded"
        );
        const averageGrade =
          gradedSubmissions.length > 0
            ? gradedSubmissions.reduce(
                (sum, sub) => sum + (sub.score || 0),
                0
              ) / gradedSubmissions.length
            : null;

        results.push({
          courseId: course._id,
          courseName: course.courseName,
          totalAssignments: submissions.length,
          submittedAssignments: gradedSubmissions.length,
          averageGrade,
        });
      }

      return results;
    },


        // Resolver 1: Grouped Average Grade (for Chart)
    getStudentModulePerformance: async (_:any, { studentId, courseId }:{studentId:string,courseId:string}) => {
      const matchStage = { studentId, status: 'graded' };
      // if (courseId) matchStage.courseId = courseId;
      const results = await AssignmentSubmission.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { week: "$week", module: "$module" },
            averageGrade: { $avg: "$score" },
          },
        },
        {
          $project: {
            week: "$_id.week",
            module: "$_id.module",
            grade: { $round: ["$averageGrade", 2] },
            _id: 0,
          },
        },
        { $sort: { week: 1 } },
      ]);

      return results;
    },

    // Resolver 2: All Graded Submissions (for Table)
    getStudentAllSubmissions: async (_:any, { studentId, courseId }:{studentId:string;courseId:string}) => {
      const filter = { studentId, status: 'graded' };
      // if (courseId) filter.courseId = courseId;

      const submissions = await AssignmentSubmission.find(filter)
        .select('week module title score maxScore status')
        .sort({ week: 1 })
        .lean();

      return submissions;
    },

  },
};


