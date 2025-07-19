import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type CoursePerformance {
    courseId: ID!
    courseName: String!
    totalModules: Int!
    completedModules: Int!
    totalAssignments: Int!
    submittedAssignments: Int!
    averageGrade: Int
  }
    
  type Query {
    getStudentOverallPerformance(
      studentId: ID!
      courseId: ID
    ): [CoursePerformance]
  }
`;
