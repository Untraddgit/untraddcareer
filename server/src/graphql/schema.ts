import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type CoursePerformance {
    courseId: ID!
    courseName: String!
    totalAssignments: Int!
    submittedAssignments: Int!
    averageGrade: Float
  }

  type ModulePerformance {
    week: Int
    module: String
    grade: Float
  }


    type AssignmentSubmission {
    week: Int
    module: String
    title: String
    score: Float
    maxScore: Float
    status: String
  }

  type Query {
  getStudentOverallPerformance(studentId: ID!,courseId: ID): [CoursePerformance]
  getStudentModulePerformance(studentId: ID!, courseId: ID): [ModulePerformance]
  getStudentAllSubmissions(studentId: ID!, courseId: ID): [AssignmentSubmission]
}

`;
