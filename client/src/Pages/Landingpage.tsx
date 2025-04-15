import { useState, useCallback } from 'react';
import { FaChartLine } from 'react-icons/fa';

import {
  FaGraduationCap, FaChevronDown, FaChevronUp ,
  FaShieldAlt, FaHandHoldingUsd, FaBrain,FaUsers,
  FaChalkboardTeacher,
    FaBars,
  FaBan,
  FaHeart,
  FaPuzzlePiece,
  FaStar,
  FaCheck,
  FaArrowRight,
  FaTimes
} from 'react-icons/fa';
import { MdOutlineWork, MdTouchApp, MdSupervisorAccount } from 'react-icons/md';
import seminar from '../assets/seminar.jpg';

import howitworks from '../assets/howitworks.jpg';

import chetanImage from '../assets/teachers/seminar.jpg';


const LandingPage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

// To this (add the string type annotation)
const scrollToSection = useCallback((id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    setIsNavOpen(false);
  }
}, []);

const openModal = (id: string) => {
  setActiveModal(id);
  document.body.style.overflow = 'hidden';
};

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const approachCards = [
    {
      icon: <FaGraduationCap className="text-green-600 text-2xl" />,
      title: "World-Class Expertise",
      content: "Course designed by the top 0.1% of experts in their field, shaping future leaders."
    },
    {
      icon: <FaUsers className="text-green-600 text-2xl" />,
      title: "Global Course Design",
      content: "Crafted specifically for top institutions like IIT, IIM, Harvard, and Oxford, and tailored for the Netherlands' schools."
    },
    {
      icon: <FaChalkboardTeacher className="text-green-600 text-2xl" />,
      title: "Future-Focused Skills",
      content: "Courses focused on the skills and learning that matter now and in the future."
    }
  ];

  const teachers = [
    { name: "Chetan Verma", credentials: "IIT Madras, Microsoft", expertise: "AI & Digital Literacy Lead", icon: <MdTouchApp className="inline mr-1" size={10} />, image: chetanImage },
    { name: "Iyer Sai Krishnan", credentials: "NorthEastern University, MS AI/ML", expertise: "Problem Solving & Critical Thinking", icon: <FaHandHoldingUsd className="inline mr-1" size={10} />, image: "/api/placeholder/80/80" },
    { name: "Arju Swami", credentials: "IIT-BHU", expertise: "Human Psychology", icon: <FaShieldAlt className="inline mr-1" size={10} />, image: "/api/placeholder/80/80" },
    { name: "Krishna Bajpai", credentials: "Founder Posterwa", expertise: "Startup & Entrepreneurship Coach", icon: <FaChartLine className="inline mr-1" size={10} />, image: "/api/placeholder/80/80" },
      ];
  

  const programCards = [
    {
      id: "digital-safety",
      icon: <FaShieldAlt className="text-yellow-500 text-2xl" />,
      title: "Digital Safety & Fraud Prevention",
      content: "Scammers prey on kids, teens and senior citizens—don't let yours be the next victim. This powerful session arms students and parents with essential skills to detect and prevent digital frauds before it's too late.",
      itinerary: [
        "Understanding digital threats in 2025",
        "Recognizingvlatest and common scam techniques",
        "Social engineering and manipulation tactics",
        "Secure digital practices for daily life",
        "Protecting personal information online",
        "Digital rights and fraud blackmails",
        "Identifying phishing attempts",
        "Interactive and practical fraud detection exercises",
        "Certificate and free exercise platform"

      ],
      outcomes: [
        "80% reduction in student vulnerability to online scams",
        "Ability to identify and avoid 9 out of 10 common online threats",
        "Practical tools to verify information authenticity",
        "Improved digital citizenship and responsibility"
      ],
      testimonial: {
        content: "After implementing the Digital Safety workshop, reported incidents of students falling victim to online scams dropped to near zero. The interactive format kept students engaged while teaching critical skills that extend beyond the classroom.",
        author: "Dr. Rajesh Kumar",
        position: "Principal, Delhi Public School"
      }
    },
    {
      id: "emotional-intelligence",
      icon: <FaBrain className="text-yellow-500 text-2xl" />,
      title: "Emotional Intelligence",
      content: "Academic excellence alone isn't enough—students must master self-awareness, empathy, and resilience to thrive in life and career. Learn how to always stay happy, manage anger, and build strong relationships through self-awareness, self-regulation, social awareness, and relationship management.",
      itinerary: [
        "The four pillars of emotional intelligence",
        "Self-awareness exercises and reflection",
        "Emotion regulation techniques on Anger, stress and guilt",
        "Building empathy through perspective-taking",
        "Conflict resolution strategies",
        "Stress management and resilience building",
        "Communication skills for healthy relationships",        "Certificate and practice platform"

      ],
      outcomes: [
        "42% reduction in classroom conflicts and bullying incidents",
        "80% Improved behaivior and social presence ",
        "Enhanced cooperation and teamwork among students",
        "Development of leadership qualities and social skills"
      ],
      testimonial: {
        content: "The transformation in our school culture has been remarkable since introducing the Emotional Intelligence program. Students are more collaborative, conflicts are resolved constructively, and teachers report a more positive learning environment across all grades.",
        author: "Smt. Anita Sharma",
        position: "Principal, Kendriya Vidyalaya"
      }
    },
    {
      id: "personal-finance",
      icon: <FaHandHoldingUsd className="text-yellow-500 text-2xl" />,
      title: "Personal Finance",
      content: "Equip students with essential money management skills from an early age. Learn budgeting, saving, and smart investments that can lay the foundation for a successful financial future.",
      itinerary: [
        "Fundamentals of money management",
        "Creating and maintaining a personal budget",
        "Saving strategies for different goals",
        "Why and how to avoid wasting money on unecessary things",
        "Introduction to banking and financial institutions",
        "Understanding debt and credit responsibly",
        "Assets vs liability and breaking uneccessary purchasing habits",
        "Practical financial decision-making exercises",
        "Certificate and practice platform"
      ],
      outcomes: [
        "95% of students create their first personal budget",
        "Students demonstrate ability to make informed financial decisions",
        "Development of healthy money attitudes and habits",
        "Increased awareness of financial planning for future goals"
      ],
      testimonial: {
        content: "Parents have reached out to thank us for introducing the Personal Finance seminar. Many reported their children initiating family budget discussions and even helping younger siblings understand the value of saving. It's teaching life skills that extend well beyond our campus.",
        author: "Shri Vikram Mehta",
        position: "Headmaster, Modern Academy"
      }
    },
    {
      id: "startup-entrepreneurship",
      icon: <MdOutlineWork className="text-yellow-500 text-2xl" />,
      title: "Startup & Entrepreneurship",
      content: "Ignite entrepreneurial spirit—teach idea validation, business planning, and how to build their own venture.",
      itinerary: [
        "Entrepreneurial mindset development",
        "Problem identification and solution brainstorming",
        "Business model canvas creation",
        "Market research methodologies",
        "Minimum viable product development",
        "Pitch creation and presentation skills",
        "Team building and resource management",
        "Certificate and practice platform"

      ],
      outcomes: [
        "Students develop and pitch original business ideas",
        "Understanding of basic business economics and operations",
        "Improved creative problem-solving abilities",
        "Enhanced presentation and communication skills"
      ],
      testimonial: {
        content: "The Entrepreneurship program created a buzz unlike anything we've seen before. Students have formed innovation clubs, started small ventures within the school, and two teams even participated in national-level startup competitions. It's unlocked potential we didn't know existed.",
        author: "Mr. Sunil Agarwal",
        position: "Director, Sunrise International School"
      }
    },
    {
      id: "leadership-responsibility",
      icon: <MdSupervisorAccount className="text-yellow-500 text-2xl" />,
      title: "Leadership & Responsibility",
      content: "Cultivate strong leaders—teach accountability, responsibility, and the mindset needed for future success.",
      itinerary: [
        "Core leadership values and principles",
        "Responsibility and accountability frameworks",
        "Decision-making under pressure",
        "Teamwork, delegation and jeolousy avoidance",
        "Effective communication for leaders",
        "Ethical leadership practices",
        "Project planning and execution",
        "Certificate and practice platform"

      ],
      outcomes: [
        "60% increase in student-led initiatives",
        "Development of ethical decision-making frameworks",
        "Enhanced ability to motivate and work with teams",
        "Improved planning and organizational skills"
      ],
      testimonial: {
        content: "We've seen remarkable growth in student ownership of school initiatives after the Leadership program. The student council has become more effective, and we've noticed increased participation in community service projects as students apply their leadership skills in meaningful ways.",
        author: "Dr. Meenakshi Gupta",
        position: "Principal, Heritage School"
      }
    },
    {
      id: "ai-digital-literacy",
      icon: <MdTouchApp className="text-yellow-500 text-2xl" />,
      title: "AI & Digital Literacy in 2025",
      content: "Equip students with essential digital tools and skills, including AI technologies, required for success in today's tech-driven world. From using basic software to navigating online platforms and understanding AI's role, prepare them for the future workplace.",
      itinerary: [
        "Current AI landscape and applications",
        "Real exercise to build a website in 20 mins",
        "Critical evaluation of AI-generated content",
        "Practical AI tools for productivity and learning",
        "Digital research and information literacy",
        "Responsible AI usage and ethics",
        "Future of work in an AI-augmented world",
        "Hands-on experience with common AI platforms",
        "Real exercise to build a website in 20 mins",
        "Certificate and practice platform"

      ],
      outcomes: [
        "85% of students demonstrate proficiency with common AI tools",
        "Improved critical thinking when consuming digital content",
        "Enhanced productivity using digital organization tools",
        "Understanding of AI's capabilities, limitations and ethical considerations"
      ],
      testimonial: {
        content: "The AI & Digital Literacy program has transformed how our students engage with technology. They're now not just consumers but intelligent evaluators and creators, using AI tools responsibly while maintaining critical thinking. This is precisely the preparation they need for higher education and future careers.",
        author: "Mrs. Priyanka Joshi",
        position: "Principal, Springfield Academy"
      }
    },
    {
      id: "mental-physical-health",
      icon: <FaHeart className="text-yellow-500 text-2xl" />,
      title: "Mental & Physical Health",
      content: "Teach students the importance of balancing mental and physical well-being. Learn stress management, mindfulness, Healthy Eating, nutrition, and exercise habits to lead a healthy and fulfilling life.",
      itinerary: [
        "Mind-body connection fundamentals",
        "Stress recognition and healthy management",
        "Mindfulness and meditation practices",
        "Nutrition basics for adolescents",
        "Developing sustainable exercise habits",
        "Sleep hygiene and its impact on performance",
        "Building healthy daily routines",
        "Certificate and practice platform"

      ],
      outcomes: [
        "7/10 students have Reduced stress levels and improved focus in class after seminar",
        "80% Adoption of healthier eating habits and physical activity",
        "80% Better sleep quality reported by students and parents",
        "Development of coping strategies for academic pressure"
      ],
      testimonial: {
        content: "The holistic approach of the Mental & Physical Health program resonated deeply with our school's philosophy. We've seen improvements in attendance, focus, and even academic performance as students implement the wellness practices. Parents particularly appreciate the practical nutrition guidance.",
        author: "Dr. Anjali Desai",
        position: "Principal, The Wellness Academy"
      }
    },
    {
      id: "false-marketing-prevention",
      icon: <FaBan className="text-yellow-500 text-2xl" />,
      title: "False Marketing Prevention",
      content: "Empower students to identify and avoid false advertising, misleading claims, and manipulative marketing tactics. Develop critical thinking skills to make informed decisions as consumers.",
      itinerary: [
        "Psychology behind marketing and advertising",
        "Common persuasion and biases techniques in media",
        "Identifying misleading claims and statistics",
        "Digital advertising and targeted marketing",
        "Media literacy and critical evaluation",
        "Responsible consumption practices",
        "Case studies of false marketing campaigns",
        "Certificate and practice platform"

      ],
      outcomes: [
        "75% improvement in ability to identify misleading claims",
        "Development of analytical media consumption habits",
        "More informed consumer choices and spending patterns",
        "Reduced susceptibility to manipulative marketing"
      ],
      testimonial: {
        content: "In today's media-saturated environment, the False Marketing Prevention program has been invaluable. Our students now approach advertisements with healthy skepticism and apply critical thinking before making decisions. Parents have noted more thoughtful consumption habits at home as well.",
        author: "Mr. Rajeev Malhotra",
        position: "Director, Progressive Public School"
      }
    },
    {
      id: "problem-solving",
      icon: <FaPuzzlePiece className="text-yellow-500 text-2xl" />,
      title: "Problem Solving & Critical Thinking",
      content: "Develop analytical and creative problem-solving skills to tackle real-world challenges. Learn techniques like brainstorming, decision-making frameworks, and logical reasoning to approach problems effectively and innovatively.",
      itinerary: [
        "Critical thinking fundamentals and frameworks",
        "Creative problem-solving methodologies with real examples",
        "Systems thinking and complex problem analysis",
        "Decision-making processes and biases",
        "Design thinking for student applications",
        "Collaborative problem-solving techniques",
        "Real-world challenge activities",
        "Certificate and practice platform"

      ],
      outcomes: [
        "Significant improvement in academic problem-solving tasks",
        "Enhanced ability to approach unfamiliar challenges",
        "Development of structured thinking processes",
        "Increased confidence in tackling complex issues"
      ],
      testimonial: {
        content: "The Problem Solving program transformed our students' approach to challenges both inside and outside the classroom. Teachers report more thoughtful discussions, more innovative project solutions, and greater persistence when faced with difficult tasks. These are truly future-ready skills.",
        author: "Prof. Sameer Khanna",
        position: "Principal, Excellence Academy"
      }
    }
  ];

  const testimonials = [
    {
      content: "The digital safety workshop was eye-opening for both our students and teachers. It addressed critical issues that our standard curriculum simply doesn't cover.",
      name: "Rajesh Sharma",
      title: "Principal, GD Public School"
    },
    {
      content: "The personal finance module has transformed how our students think about money. They're now teaching budgeting concepts to their parents and they are less stubborn for asking money!",
      name: "Priya Patel",
      title: "Vice Principal, Modern Academy"
    },
    {
      content: "Finally, a program that teaches what students actually need for the future. The entrepreneurship module has inspired several student-led projects, They are literally conscious out business at this early stage, Its really nice to see.",
      name: "Amit Verma",
      title: "School Board Member, Sunrise Schools"
    }
  ];

  const impactStats = [
    { value: "25+", label: "Schools Engaged" },
    { value: "5,000+", label: "Students Reached" },
    { value: "15+", label: "Practical Courses" },
    { value: "94%", label: "Satisfaction Rate" }
  ];

  const satisfactionStats = [
    { value: "9/10", label: "of schools would recommend our programs to other institutions" },
    { value: "95+ %", label: "of parents noticed positive changes in their children's behavior" },
    { value: "84%", label: "of students continued using skills 1 months after completion" }
  ];

  const academicImpact = [
    { value: "32%", label: "Improvement in classroom participation" },
    { value: "60%", label: "Increase in self studies and task completion rates" },
    { value: "60%", label: "Boost in leadership initiative among students" },
    { value: "40%", label: "Growth in academic performance" }
  ];

  const howItWorksSteps = [
    { title: "Presentations", content: "We visit schools or provide online seminars to deliver engaging presentations on essential topics like digital safety, emotional intelligence, and more." },
    { title: "Online Platform Access", content: "Students get access to our online platform with self-paced preactical exercises and interactive learning materials." },
    { title: "Community Support", content: "Join a community of learners, mentors, and experts who support each other's growth journey." },
    { title: "Skills Certification", content: "Earn certificates that validate your practical skills and knowledge to future employers." }
  ];

  const faqs = [
    {
      question: "Are your programs aligned with the school curriculum?",
      answer: "While our programs complement the traditional curriculum, they focus on practical skills often overlooked in standard education. We work with schools to ensure our content integrates well with their academic calendar."
    },
    {
      question: "How do you make your courses affordable?",
      answer: "We operate on a community-supported model. Schools and students can access many resources for free, while premium content is available through voluntary donations or minimal subscription fees. No student is denied access due to financial constraints."
    },
    {
      question: "How can schools partner with you?",
      answer: "Schools can request free presentations on specific topics, integrate our online modules into their existing programs, or work with us to develop custom content for their students' specific needs."
    },
    {
      question: "Do you offer certificates for completed courses?",
      answer: "Yes, students receive digital certificates upon completion of courses that they can add to their portfolios or resumes, validating their practical skills."
    }
  ];

  const footerLinks = {
    programs: ["Digital Safety", "Emotional Intelligence", "Personal Finance", "Entrepreneurship", "Leadership"],
    forSchools: ["Book a Presentation", "Partner With Us"],
    legal: ["Privacy Policy", "Terms of Service"]
  };

  return (
    <div className="font-sans bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-50 bg-opacity-90 backdrop-filter backdrop-blur-lg z-50 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-yellow-700 text-3xl font-bold cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            Untradd.
          </div>
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => scrollToSection('core-programs')}
              className="px-4 py-2 text-sm text-black hover:text-yellow-700 border border-gray-500 rounded-md hover:border-yellow-400 transition duration-300"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-sm text-black hover:text-yellow-700 border border-gray-500 rounded-md hover:border-yellow-400 transition duration-300"
            >
              Contact Us
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsNavOpen(!isNavOpen)}>
              <FaBars className="text-yellow-400 text-2xl" />
            </button>
          </div>
        </div>
        <div
          className={`md:hidden ${isNavOpen ? 'block' : 'hidden'} bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg`}
        >
          <div className="flex flex-col space-y-4 p-4">
            <button
              onClick={() => scrollToSection('core-programs')}
              className="text-gray-300 hover:text-yellow-400 transition duration-300 text-left"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-yellow-400 transition duration-300 text-left"
            >
              Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20 mt-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering India's Youth with Future-Ready Skills</h1>
              <p className="text-xl mb-8">Practical education designed for the challenges of the 21st century</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => scrollToSection('core-programs')}
                  className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300"
                >
                  Explore Courses
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent border-2 border-yellow-500 font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition duration-300"
                >
                  For Schools
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src={seminar} alt="Students learning" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-16 bg-white">
    <div className="container mx-auto px-6 md:px-12 text-center">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Bridging the Gap Between Education and Real World</h2>
      <p className="text-xl text-gray-900 max-w-3xl mx-auto mb-12">
        We're on a mission to democratize quality education, ensuring every Indian student gains the same practical skills that empower graduates of IITs, IIMs, and the world's top 1% experts in their fields to thrive in today's competitive landscape.
      </p>
      
      <h3 className="text-2xl font-bold mb-8 text-yellow-700">Learn From The Best</h3>
      
      {/* Scrollable container */}
      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-4 min-w-max px-2">
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-green-900 p-5 rounded-xl shadow-lg border border-green-700 w-64 flex-shrink-0">
                <div className="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden mx-auto mb-3">
                  <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-bold mb-1 text-white">{teacher.name}</h4>
                <p className="text-gray-300 text-sm mb-1">{teacher.credentials}</p>
                <div className="bg-green-800 text-yellow-400 text-xs py-1 px-3 rounded-full inline-block mt-1">
                  {teacher.icon}
                  {teacher.expertise}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Optional scroll indicators/controls */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-700"></div>
            <div className="w-2 h-2 rounded-full bg-green-700"></div>
            <div className="w-2 h-2 rounded-full bg-green-700"></div>
            <div className="w-2 h-2 rounded-full bg-green-700"></div>
          </div>
        </div>
      </div>
    </div>
    
    <style>{`
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  </section>

      {/* Core Programs */}
      <section id="core-programs" className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-2 text-center text-yellow-400">Premium Seminars by Untradd</h2>
          <p className="text-gray-300 mb-12 text-center">Practical programs designed by experts to prepare students for real challenges</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programCards.map((card) => (
              <div key={card.id} className="bg-green-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-green-700 flex flex-col">
                <div className="bg-green-800 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">{card.title}</h3>
                <p className="text-gray-300 mb-6">{card.content}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => openModal(card.id)}
                    className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition duration-300 flex items-center justify-center"
                  >
                    Learn More
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Detail Modals */}
      {programCards.map((program) => (
        <div
          key={`modal-${program.id}`}
          className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center ${activeModal === program.id ? 'block' : 'hidden'
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-gray-800 rounded-2xl w-full max-w-4xl mx-4 my-8 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="text-gray-300" />
            </button>

            {/* Header section */}
            <div className="p-8 border-b border-gray-700">
              <div className="flex items-start">
                <div className="bg-green-800 p-4 rounded-full mr-6 flex items-center justify-center">
                  <div className="text-yellow-400 text-3xl">
                    {program.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">{program.title}</h2>
                  <p className="text-gray-300">{program.content}</p>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Itinerary */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Seminar Itinerary</h3>
                <ul className="space-y-2">
                  {program.itinerary.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-green-900 p-1 rounded-full mr-3 mt-1">
                        <FaCheck className="text-yellow-400 text-xs" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Learning Outcomes</h3>
                <div className="bg-green-900 p-6 rounded-xl">
                  <ul className="space-y-3">
                    {program.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-yellow-500 p-1 rounded-full mr-3 mt-1">
                          <FaStar className="text-gray-900 text-xs" />
                        </div>
                        <span className="text-gray-300">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">What Schools Say</h3>
                <div className="bg-gray-700 p-6 rounded-xl">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="mr-1" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-4">"{program.testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      <span className="text-yellow-400 font-bold text-lg">
                        {program.testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white">{program.testimonial.author}</p>
                      <p className="text-sm text-gray-400">{program.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-800 rounded-b-2xl">
              <button
                onClick={() => {
                  closeModal();
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300 flex items-center justify-center"
              >
                Book This Seminar
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      ))}

     {/* Our Approach */}
     <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-700">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {approachCards.map((card, index) => (
              <div key={index} className="bg-green-900 p-8 rounded-xl shadow-md text-center">
                <div className="bg-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">{card.title}</h3>
                <p className="text-gray-300">{card.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Course Success Metrics */}
<section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
  <div className="container mx-auto px-6 md:px-12">
    <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">Proven Impact: Student Success Metrics</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {/* Course Penetration Rate */}
      <div className="bg-green-900 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">92%</div>
        <p className="text-gray-300">Course Penetration Rate</p>
        <p className="text-gray-400 mt-2">Students who enrolled vs. total students targeted</p>
      </div>
      {/* Course Completion Rate */}
      <div className="bg-green-900 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">89%</div>
        <p className="text-gray-300">Course Completion Rate</p>
        <p className="text-gray-400 mt-2">Students who completed the course without dropping out</p>
      </div>
      {/* Skill Adoption Rate */}
      <div className="bg-green-900 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">85%</div>
        <p className="text-gray-300">Skill Adoption Rate</p>
        <p className="text-gray-400 mt-2">Students who applied skills in real-life after the course</p>
      </div>
      {/* Skill Retention */}
      <div className="bg-green-900 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-yellow-400 mb-2">78%</div>
        <p className="text-gray-300">Skill Retention Rate</p>
        <p className="text-gray-400 mt-2">Students who retained skills 1 month after the seminar</p>
      </div>
      {/* Action Taken Percentage */}
      <div className="bg-green-900 p-8 rounded-xl shadow-lg text-center md:col-span-2">
        <div className="text-4xl font-bold text-yellow-400 mb-2">65%</div>
        <p className="text-gray-300">Action Taken Percentage</p>
        <p className="text-gray-400 mt-2">Students who took actionable steps using the skills learned</p>
      </div>
    </div>
  </div>
</section>
     

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-200">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-700">How It Works</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <img src={howitworks} alt="Students learning" className="rounded-xl shadow-2xl" />
            </div>
            <div className="md:w-1/2">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="mb-8">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-gray-900 font-bold mr-4 flex-shrink-0 mt-1">{index + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-yellow-700">{step.title}</h3>
                      <p className="text-gray-800">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


{/* Testimonials */}
<section className="py-16 bg-gray-800">
  <div className="container mx-auto px-6 md:px-12">
    <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">
      What Schools Are Saying
    </h2>
    <div className="overflow-x-auto">
      <div className="flex gap-8 min-w-max px-1">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-80 bg-green-900 p-6 rounded-xl shadow-md flex-shrink-0"
          >
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-gray-300 mb-6 italic break-words">
              "{testimonial.content}"
            </p>
            <div className="flex items-center">
              
              <div>
                <h4 className="font-bold text-white">{testimonial.name}</h4>
                <p className="text-sm text-gray-400">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>





       {/* Measurable Outcomes */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">75% of Schools Have Modern Subjects: Is Yours Falling Behind?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12">
            Our programs don't just teach—they transform. Here's how our students perform after completing our seminars:
          </p>

          {/* Teacher and Parent Feedback */}
          <div className="mt-16 bg-green-900 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center text-yellow-400">School & Parent Satisfaction</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {satisfactionStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-green-800 rounded-full mb-4">
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Impact */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-yellow-400">Beyond Skills: Academic Impact</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {academicImpact.map((impact, index) => (
                <div key={index} className="bg-green-900 p-6 rounded-xl shadow-md text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{impact.value}</div>
                  <p className="text-gray-300">{impact.label}</p>
                </div>
              ))}
            </div>
          </div>

         {/* Limited Availability Alert */}

        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">Our Impact So Far</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {impactStats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2 text-yellow-400">{stat.value}</div>
                <p className="text-gray-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
      </section>

{/* Limited Availability Alert */}
<div className="mt-16 bg-green-800 text-white p-8 rounded-xl shadow-lg">
  <div className="flex flex-col md:flex-row items-center justify-between">
    <div className="md:w-1/2 mb-6 md:mb-0">
      <h3 className="text-2xl font-bold mb-3 text-yellow-400">Limited Monthly Availability</h3>
      <div className="flex items-center ml-16 mb-4">
        <div className="text-5xl font-bold text-yellow-400 mr-3">20</div>
        <div className="text-lg">presentations<br/>per Month only</div>
      </div>
      <p className="text-sm mb-2"></p>
      <button className="bg-yellow-400 text-green-900 font-bold py-2 px-4 rounded hover:bg-yellow-300 transition">
        Reserve Your Spot
      </button>
    </div>
    <div className="md:w-1/2 flex justify-center">
      <div className="relative">
        <svg className="w-48 h-48" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1a4725" strokeWidth="8"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#eab308" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70"/>
          <text x="50" y="45" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Limited</text>
          <text x="50" y="65" textAnchor="middle" fill="white" fontSize="14">Spots Left</text>
        </svg>
      </div>
    </div>
  </div>
</div>

{/* Call To Action */}
{/* CTA Section with TypeScript-friendly modal handling */}
<section className="py-16 bg-gray-900">
  <div className="container mx-auto px-6 md:px-12 text-center">
    <h2 className="text-3xl font-bold mb-4 text-yellow-400">Ready to Bring 21st Century Skills to Your School?</h2>
    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
      Book a presentation for your school or get early access to our online platform.
    </p>

    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button
        onClick={() => {
          const modal = document.querySelector('[data-modal="presentation"]');
          if (modal) modal.classList.remove('hidden');
        }}
        className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300"
      >
        Book a Presentation
      </button>

      <button
        onClick={() => {
          const modal = document.querySelector('[data-modal="online-access"]');
          if (modal) modal.classList.remove('hidden');
        }}
        className="bg-green-700 text-gray-200 font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Talk to Our Experts
      </button>
    </div>
  </div>

  {/* Presentation Modal */}
  <div
    data-modal="presentation"
    className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={(e) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-modal')) {
        target.classList.add('hidden');
      }
    }}
  >
    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Book a Presentation</h3>
        <button
          onClick={() => {
            const modal = document.querySelector('[data-modal="presentation"]');
            if (modal) modal.classList.add('hidden');
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <p className="text-gray-600 mb-6">How would you like to contact us about booking a presentation?</p>

      <div className="space-y-4">
        <a
          href="tel:+918789698369"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Call to Schedule
        </a>

        <a
          href="https://wa.me/918789698369?text=Hello%20Untradd,%20I%20would%20like%20to%20book%20a%20presentation%20for%20my%20school.%20Please%20contact%20me%20with%20more%20information."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
          Inquire via WhatsApp
        </a>
      </div>
    </div>
  </div>

  {/* Online Access Modal */}
  <div
    data-modal="online-access"
    className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={(e) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-modal')) {
        target.classList.add('hidden');
      }
    }}
  >
    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Request Online Access</h3>
        <button
          onClick={() => {
            const modal = document.querySelector('[data-modal="online-access"]');
            if (modal) modal.classList.add('hidden');
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <p className="text-gray-600 mb-6">How would you like to request access to our online platform?</p>

      <div className="space-y-4">
        <a
          href="tel:+918789698369"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Call Us
        </a>

        <a
          href="https://wa.me/918789698369?text=Hello%20Untradd,%20I'm%20interested%20in%20getting%20access%20to%20your%20online%20platform.%20Please%20provide%20me%20with%20more%20information."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
          Message via WhatsApp
        </a>
      </div>
    </div>
  </div>
</section>

{/* FAQ Section */}
<section className="py-16 bg-gray-800">
  <div className="container mx-auto px-6 md:px-12">
    <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">
      Frequently Asked Questions
    </h2>

    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const [open, setOpen] = useState<number | null>(null);

        const toggle = (i: number) => setOpen(open === i ? null : i);

        return (
          <div
            key={index}
            className="bg-green-900 rounded-lg shadow-md"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left p-6"
            >
              <h3 className="text-xl font-bold text-yellow-400">{faq.question}</h3>
              <span className="text-yellow-400">
                {open === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {open === index && (
              <div className="px-6 pb-6 text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>


      <section id="contact" className="py-16 bg-gray-900">
  <div className="container mx-auto px-6 md:px-12">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Contact on WhatsApp</h2>
        <p className="text-gray-300 mb-8">
          Have questions or want to bring our programs to your school? Reach out to us on WhatsApp, and we'll get back to you within 24 hours.
        </p>

        <form className="space-y-4" id="whatsappForm" onSubmit={(e) => {
          e.preventDefault();
          const nameInput = document.getElementById('name') as HTMLInputElement;
          const name = nameInput?.value || "";
          if (!name) return;
          const message = `Hey Untradd, I am ${name}, I wanted to know more about the presentation.`;
          const whatsappUrl = `https://wa.me/918789698369?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        }}>
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-green-700 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300"
          >
            Chat on WhatsApp
          </button>
        </form>
      </div>
      <div className="md:w-1/2 md:pl-12">
        <div className="bg-green-900 p-8 rounded-xl h-full">
          <h3 className="text-xl font-bold mb-6 text-yellow-400">Quick Contact Info</h3>

          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="bg-green-800 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Email</h4>
                <p className="text-gray-300">contactuntradd@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-800 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Phone</h4>
                <p className="text-gray-300">+91 8789698369</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-800 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Location</h4>
                <p className="text-gray-300">Hyderabad, India</p>
                <p className="text-gray-300">(Available for presentations across India)</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-bold mb-4 text-yellow-400">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-green-800 p-3 rounded-full text-yellow-400 hover:bg-green-700 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                </svg>
              </a>
              <a href="#" className="bg-green-800 p-3 rounded-full text-yellow-400 hover:bg-green-700 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                </svg>
              </a>
              <a href="https://wa.me/918789698369" className="bg-green-800 p-3 rounded-full text-yellow-400 hover:bg-green-700 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Footer */}
<footer className="bg-gray-900 text-white py-10">
  <div className="container mx-auto px-6 md:px-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <h3 className="text-xl font-bold mb-4 text-yellow-400">Future Ready</h3>
        <p className="text-gray-400">
          Empowering India's youth with practical skills for the 21st century.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-4 text-yellow-400">Programs</h4>
        <ul className="space-y-2 text-gray-400">
          {footerLinks.programs.map((program, index) => (
            <li key={index}>
              <a href="#" className="hover:text-yellow-400 transition duration-300">{program}</a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-4 text-yellow-400">For Schools</h4>
        <ul className="space-y-2 text-gray-400">
          {footerLinks.forSchools.map((link, index) => (
            <li key={index}>
              <a href="#" className="hover:text-yellow-400 transition duration-300">{link}</a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-4 text-yellow-400">Legal</h4>
        <ul className="space-y-2 text-gray-400">
          {footerLinks.legal.map((link, index) => (
            <li key={index}>
              <a href="#" className="hover:text-yellow-400 transition duration-300">{link}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Future Ready Education. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;
