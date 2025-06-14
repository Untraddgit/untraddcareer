import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PredefinedCourse from '../models/PredefinedCourse';

dotenv.config();

const courseData = {
  "courseName": "webdevelopmentwithai",
  "displayName": "Full Stack Web Development Internship Track (MERN + DevOps + AI)",
  "durationWeeks": 10,
  "effortPerWeek": "15-20 hours",
  "liveClassesPerWeek": 2,
  "courseDescription": "An intensive 10-week program to train BCA students in Full Stack Development using MERN stack, with real-world projects, DevOps tools, cloud deployment, and AI integration. Prepares students for internships and job-ready portfolios.",
  "weeklyRoadmap": [
    {
      "week": 1,
      "title": "HTML, CSS & Responsive Design",
      "topics": [
        "HTML5 basics, forms, tables, screen structure",
        "CSS3 fundamentals: Box model, Flexbox, Grid",
        "Responsive Design with Media Queries",
        "Tailwind CSS basics"
      ],
      "projects": [
        "Login Page",
        "Portfolio UI",
        "Landing Page",
        "Responsive Card Layout",
        "Form UI"
      ],
      "liveClassTopics": [
        "HTML structure and semantic design",
        "Responsive design using Tailwind and Flexbox"
      ]
    },
    {
      "week": 2,
      "title": "JavaScript & Programming Fundamentals",
      "topics": [
        "JavaScript basics: Variables, Loops, Arrays, Objects",
        "DOM Manipulation",
        "ES6 Features: Arrow Functions, Destructuring",
        "Async/Await, Closures",
        "Intro to DSA: Arrays, Sorting (2 hours/week)"
      ],
      "projects": [
        "ToDo List App",
        "Calculator",
        "Quiz App",
        "Weather App (API)",
        "Form Validator"
      ],
      "liveClassTopics": [
        "JavaScript fundamentals",
        "DOM manipulation and event handling"
      ]
    },
    {
      "week": 3,
      "title": "React Basics & Frontend Foundations",
      "topics": [
        "Introduction to React",
        "JSX, Props, State",
        "React Hooks (useState, useEffect)",
        "React Router"
      ],
      "projects": [
        "Notes App",
        "Expense Tracker",
        "User Dashboard",
        "Mini Blog",
        "Quote Generator"
      ],
      "liveClassTopics": [
        "React components and props",
        "React Router and Hooks"
      ]
    },
    {
      "week": 4,
      "title": "Advanced React + Tailwind + GitHub",
      "topics": [
        "Forms and Form Validation in React",
        "Component Patterns and State Lifting",
        "Tailwind CSS styling",
        "Git & GitHub Workflow"
      ],
      "projects": [
        "Product Dashboard",
        "E-Card Generator",
        "Portfolio V1 (React)",
        "Mobile-first UI",
        "Feedback App"
      ],
      "liveClassTopics": [
        "Using Tailwind with React",
        "GitHub Collaboration & CI basics"
      ]
    },
    {
      "week": 5,
      "title": "Node.js + Express.js + REST APIs",
      "topics": [
        "Node.js Basics, File Handling",
        "Express Routing and Middleware",
        "REST API Creation",
        "API Testing using Postman"
      ],
      "projects": [
        "Blog API",
        "User Auth API",
        "Feedback Submission API",
        "CRUD App with Express",
        "Contact Form API"
      ],
      "liveClassTopics": [
        "API development and testing",
        "Express.js architecture"
      ]
    },
    {
      "week": 6,
      "title": "MongoDB, Auth Systems & Clerk",
      "topics": [
        "MongoDB CRUD Operations",
        "Mongoose Schema & Models",
        "JWT Authentication",
        "Password Encryption with bcrypt",
        "Clerk Authentication Setup",
        "Firebase Auth (optional)"
      ],
      "projects": [
        "User Auth App",
        "Blog CRUD with Auth",
        "Notes App with DB",
        "Admin-User CRUD",
        "Clerk-based Login System"
      ],
      "liveClassTopics": [
        "MongoDB with Mongoose",
        "Clerk & JWT-based authentication"
      ]
    },
    {
      "week": 7,
      "title": "Full Stack Projects + ChatGPT + Firebase",
      "topics": [
        "Integrating Frontend + Backend",
        "Firebase Hosting & Analytics",
        "ChatGPT API integration",
        "Real-time features using Firebase/Clerk"
      ],
      "projects": [
        "WhatsApp Clone",
        "Instagram Clone",
        "ChatGPT Clone",
        "Task Manager",
        "Blog System with Auth"
      ],
      "liveClassTopics": [
        "Connecting MERN stack apps",
        "Integrating OpenAI APIs"
      ]
    },
    {
      "week": 8,
      "title": "DevOps Basics + GitHub Actions + Jenkins",
      "topics": [
        "CI/CD Fundamentals",
        "GitHub Actions: Build & Deploy Workflows",
        "Intro to Jenkins and Pipelines",
        "Continuous Deployment with Render/Vercel"
      ],
      "projects": [
        "CI/CD Pipeline for React App",
        "Automated Deployment for API",
        "Jenkins-based Node.js deployment"
      ],
      "liveClassTopics": [
        "GitHub Actions demo",
        "Jenkins pipeline walkthrough"
      ]
    },
    {
      "week": 9,
      "title": "Docker + AWS + Production Deployments",
      "topics": [
        "Docker Basics: Containers, Images, Dockerfile",
        "AWS EC2 Hosting for Node Apps",
        "AWS S3 for Static Hosting",
        "Monitoring with Firebase & CloudWatch"
      ],
      "projects": [
        "Dockerized Blog App",
        "Deployed React App on EC2",
        "S3 File Upload System"
      ],
      "liveClassTopics": [
        "Dockerize your app",
        "Hosting with AWS EC2 and S3"
      ]
    },
    {
      "week": 10,
      "title": "Capstone Projects + Portfolio + Resume",
      "topics": [
        "Major Projects: LMS, Stock Tracker, Zomato Clone",
        "Portfolio V2: Tailwind + Animations + Hosting",
        "Resume Preparation & LinkedIn Optimization",
        "Launch your own idea-based app"
      ],
      "projects": [
        "Capstone Project 1",
        "Capstone Project 2",
        "Portfolio V2 (Deployed)",
        "Live Product Launch"
      ],
      "liveClassTopics": [
        "Showcasing portfolio & resume feedback",
        "Demo your projects & GitHub walkthrough"
      ]
    }
  ],
  "toolsAndTechnologies": {
    "languages": ["HTML5", "CSS3", "JavaScript (ES6+)", "SQL", "JSON"],
    "frontend": ["ReactJS", "Tailwind CSS", "JSX", "React Router"],
    "backend": ["Node.js", "Express.js", "REST API", "Mongoose"],
    "databases": ["MongoDB", "MongoDB Atlas"],
    "authentication": ["JWT", "bcrypt", "Clerk.dev", "Firebase Auth"],
    "devops": ["Git", "GitHub", "GitHub Actions", "Jenkins", "Docker", "AWS EC2", "AWS S3"],
    "deployment": ["Vercel", "Render", "Firebase Hosting", "GitHub Pages"],
    "ai": ["OpenAI API (ChatGPT)"],
    "testingMonitoring": ["Postman", "Google Analytics", "Firebase Analytics", "React Dev Tools", "Chrome Dev Tools"],
    "tooling": ["VS Code", "Live Server", "dotenv", "Nodemon", "CORS", "Proxy Setup"],
    "csFundamentals": ["Data Structures", "Algorithms", "Sorting", "Searching"]
  },
  "expectedOutcomes": [
    "Build and deploy 40+ mini and 2 major real-world projects",
    "Launch your personal portfolio with GitHub and analytics",
    "Master MERN stack with DevOps, cloud, and AI integration",
    "Apply to internships confidently with production-ready experience",
    "Work with Git, GitHub, CI/CD pipelines, Docker, and AWS",
    "Understand the basics of DSA and SQL"
  ]
};

async function populatePredefinedCourses() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if course already exists
    const existingCourse = await PredefinedCourse.findOne({ 
      courseName: courseData.courseName 
    });

    if (existingCourse) {
      console.log('Course already exists, updating...');
      await PredefinedCourse.findOneAndUpdate(
        { courseName: courseData.courseName },
        courseData,
        { new: true }
      );
      console.log('Course updated successfully');
    } else {
      console.log('Creating new course...');
      const course = new PredefinedCourse(courseData);
      await course.save();
      console.log('Course created successfully');
    }

    console.log('Predefined course data populated successfully');
  } catch (error) {
    console.error('Error populating predefined courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
populatePredefinedCourses(); 