interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
}

const quizzes: Record<string, QuizData> = {
  'BCA': {
    title: 'BCA Technical Assessment',
    description: 'Assessment for BCA students to evaluate technical knowledge',
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
        correctAnswer: 3
      },
      {
        question: 'Which data structure uses LIFO?',
        options: [
          'Queue',
          'Stack',
          'Linked List',
          'Tree'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the time complexity of binary search?',
        options: [
          'O(n)',
          'O(log n)',
          'O(n²)',
          'O(1)'
        ],
        correctAnswer: 1
      }
    ]
  },
  'MCA': {
    title: 'MCA Advanced Programming',
    description: 'Advanced programming concepts assessment for MCA students',
    timeLimit: 30,
    questions: [
      {
        question: 'What is dependency injection in software design?',
        options: [
          'A design pattern for object creation',
          'A technique for managing object dependencies',
          'A method for code optimization',
          'A type of inheritance'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of these is not a principle of SOLID?',
        options: [
          'Single Responsibility',
          'Open-Closed',
          'Quick Response',
          'Dependency Inversion'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the main advantage of microservices architecture?',
        options: [
          'Easier deployment',
          'Better scalability',
          'Simplified testing',
          'All of the above'
        ],
        correctAnswer: 3
      }
    ]
  },
  'B.Com': {
    title: 'B.Com Financial Assessment',
    description: 'Assessment for B.Com students on financial concepts',
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
        correctAnswer: 1
      },
      {
        question: 'Which of these is a current asset?',
        options: [
          'Land',
          'Building',
          'Inventory',
          'Machinery'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the accounting equation?',
        options: [
          "Assets = Liabilities + Owner's Equity",
          "Assets = Liabilities - Owner's Equity",
          "Assets + Liabilities = Owner's Equity",
          "Assets - Liabilities = Owner's Equity"
        ],
        correctAnswer: 0
      }
    ]
  }
};

export default quizzes; 