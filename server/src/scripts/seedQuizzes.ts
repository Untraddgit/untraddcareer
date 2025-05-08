import mongoose from 'mongoose';
import Quiz from '../models/Quiz';
import dotenv from 'dotenv';

dotenv.config();

const quizzes = [
  {
    title: 'BCA Technical Assessment',
    description: 'Assessment for BCA students to evaluate technical knowledge',
    branch: 'BCA',
    timeLimit: 30,
    questions: [
      {
        question: 'What is the primary purpose of an operating system?',
        options: [
          'To provide a user interface',
          'To manage hardware resources',
          'To run applications',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'An operating system performs all these functions: providing UI, managing resources, and running applications.'
      },
      {
        question: 'Which data structure uses LIFO?',
        options: [
          'Queue',
          'Stack',
          'Linked List',
          'Tree'
        ],
        correctAnswer: 1,
        explanation: 'Stack follows Last In First Out (LIFO) principle.'
      },
      {
        question: 'What is the time complexity of binary search?',
        options: [
          'O(n)',
          'O(log n)',
          'O(n²)',
          'O(1)'
        ],
        correctAnswer: 1,
        explanation: 'Binary search has a logarithmic time complexity of O(log n).'
      }
    ]
  },
  {
    title: 'MCA Advanced Programming',
    description: 'Advanced programming concepts assessment for MCA students',
    branch: 'MCA',
    timeLimit: 45,
    questions: [
      {
        question: 'What is dependency injection in software design?',
        options: [
          'A design pattern for object creation',
          'A technique for managing object dependencies',
          'A method for code optimization',
          'A type of inheritance'
        ],
        correctAnswer: 1,
        explanation: 'Dependency injection is a technique for managing object dependencies and promoting loose coupling.'
      },
      {
        question: 'Which of these is not a principle of SOLID?',
        options: [
          'Single Responsibility',
          'Open-Closed',
          'Quick Response',
          'Dependency Inversion'
        ],
        correctAnswer: 2,
        explanation: 'Quick Response is not part of SOLID principles. The actual principles are: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.'
      },
      {
        question: 'What is the main advantage of microservices architecture?',
        options: [
          'Easier deployment',
          'Better scalability',
          'Simplified testing',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'Microservices architecture provides all these benefits: easier deployment, better scalability, and simplified testing.'
      }
    ]
  },
  {
    title: 'B.Com Financial Assessment',
    description: 'Assessment for B.Com students on financial concepts',
    branch: 'B.Com',
    timeLimit: 30,
    questions: [
      {
        question: 'What is the primary purpose of a balance sheet?',
        options: [
          'Show profit and loss',
          'Show assets and liabilities',
          'Show cash flow',
          'Show sales revenue'
        ],
        correctAnswer: 1,
        explanation: 'A balance sheet shows the financial position of a company by listing assets, liabilities, and equity.'
      },
      {
        question: 'Which of these is a current asset?',
        options: [
          'Land',
          'Building',
          'Inventory',
          'Machinery'
        ],
        correctAnswer: 2,
        explanation: 'Inventory is a current asset as it is expected to be converted into cash within one year.'
      },
      {
        question: 'What is the accounting equation?',
        options: [
          "Assets = Liabilities + Owner's Equity",
          "Assets = Liabilities - Owner's Equity",
          "Assets + Liabilities = Owner's Equity",
          "Assets - Liabilities = Owner's Equity"
        ],
        correctAnswer: 0,
        explanation: "The fundamental accounting equation is: Assets = Liabilities + Owner's Equity"
      }
    ]
  }
];

async function seedQuizzes() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Insert new quizzes
    await Quiz.insertMany(quizzes);
    console.log('Seeded quizzes successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedQuizzes(); 