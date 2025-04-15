// LearnMorePopup.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaArrowRight, FaUsers, FaCalendarAlt, FaLightbulb } from 'react-icons/fa';
import { animated, useSpring, useTrail, config } from 'react-spring';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import Lottie from 'react-lottie';

// Import program-specific animations
import digitalSafetyAnimation from '../animations/health.json';
import emotionalIntelligenceAnimation from '../animations/emotionalIntelligence.json';
import personalFinanceAnimation from '../animations/personalFinance.json';


const LearnMorePopup = ({ program, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Theme colors and styles based on program
  const programThemes = {
    "Digital Safety & Fraud Prevention": {
      primary: "#3B82F6", // Blue
      secondary: "#DBEAFE",
      gradient: "from-blue-500 to-indigo-600",
      accentColor: "#2563EB",
      icon: <FaShieldAlt className="text-white text-3xl" />,
      lottiePath: digitalSafetyAnimation,
    },
    "Emotional Intelligence": {
      primary: "#EC4899", // Pink
      secondary: "#FCE7F3",
      gradient: "from-pink-500 to-purple-600",
      accentColor: "#DB2777",
      icon: <FaBrain className="text-white text-3xl" />,
      lottiePath: emotionalIntelligenceAnimation,
    },
    "Personal Finance": {
      primary: "#10B981", // Green
      secondary: "#D1FAE5",
      gradient: "from-green-500 to-emerald-600",
      accentColor: "#059669",
      icon: <FaHandHoldingUsd className="text-white text-3xl" />,
      lottiePath: personalFinanceAnimation,
    },
    "Startup & Entrepreneurship": {
      primary: "#F59E0B", // Yellow/Orange
      secondary: "#FEF3C7",
      gradient: "from-yellow-500 to-orange-600",
      accentColor: "#D97706",
      icon: <MdOutlineWork className="text-white text-3xl" />,
      lottiePath: startupAnimation,
    },
    "Leadership & Responsibility": {
      primary: "#6366F1", // Indigo
      secondary: "#E0E7FF",
      gradient: "from-indigo-500 to-violet-600",
      accentColor: "#4F46E5",
      icon: <MdSupervisorAccount className="text-white text-3xl" />,
      lottiePath: leadershipAnimation,
    },
    "AI & Digital Literacy in 2025": {
      primary: "#8B5CF6", // Purple
      secondary: "#EDE9FE",
      gradient: "from-purple-500 to-violet-600",
      accentColor: "#7C3AED",
      icon: <MdTouchApp className="text-white text-3xl" />,
      lottiePath: digitalLiteracyAnimation,
    },
    "Mental & Physical Health": {
      primary: "#EF4444", // Red
      secondary: "#FEE2E2",
      gradient: "from-red-500 to-rose-600",
      accentColor: "#DC2626",
      icon: <FaHeart className="text-white text-3xl" />,
      lottiePath: healthAnimation,
    },
    "False Marketing Prevention": {
      primary: "#F97316", // Orange
      secondary: "#FFEDD5",
      gradient: "from-orange-500 to-amber-600",
      accentColor: "#EA580C",
      icon: <FaBan className="text-white text-3xl" />,
      lottiePath: marketingAnimation,
    },
    "Problem Solving & Critical Thinking": {
      primary: "#06B6D4", // Cyan
      secondary: "#CFFAFE",
      gradient: "from-cyan-500 to-sky-600",
      accentColor: "#0891B2",
      icon: <FaPuzzlePiece className="text-white text-3xl" />,
      lottiePath: problemSolvingAnimation,
    }
  };

  const theme = programThemes[program.title] || {
    primary: "#22C55E",
    secondary: "#DCFCE7",
    gradient: "from-green-500 to-teal-600",
    accentColor: "#16A34A",
    icon: program.icon
  };

  // Comprehensive program details
  const programDetails = {
    "Digital Safety & Fraud Prevention": {
      overview: "In an increasingly digital world, protecting students from online threats is paramount. Our comprehensive program equips students with essential digital safety skills and fraud prevention strategies.",
      benefits: [
        "Reduced risk of students falling victim to online scams and fraud",
        "Enhanced digital literacy and critical thinking when navigating online content",
        "Improved parent-child communication about online safety",
        "Increased confidence when using digital platforms safely",
        "Better understanding of privacy settings and data protection"
      ],
      itinerary: [
        "**Understanding the Digital Threat Landscape**",
        "- Common types of cyber threats targeting students",
        "- Real-world examples and case studies of digital fraud",
        "- Statistics on youth vulnerability to online scams",
        "**Identification & Prevention Techniques**",
        "- Recognizing red flags in emails, messages and websites",
        "- Creating strong, unique passwords and using password managers",
        "- Implementing two-factor authentication",
        "- Safe browsing habits and privacy settings",
        "**Responding to Threats**",
        "- Steps to take if personal information is compromised",
        "- Reporting mechanisms for online scams",
        "- Resources for assistance and further learning",
        "**Building a Family Digital Safety Plan**",
        "- Age-appropriate device usage guidelines",
        "- Family contracts for online behavior",
        "- Parental controls and monitoring tools"
      ],
      stats: [
        { label: "Students Protected", value: "15,000+" },
        { label: "Success Rate", value: "94%" },
        { label: "Schools Implementing", value: "250+" }
      ],
      testimonials: [
        {
          quote: "This program transformed how our students approach online safety. The hands-on activities made complex security concepts accessible and engaging.",
          author: "Principal Sarah Johnson, Lincoln Middle School"
        },
        {
          quote: "After implementing this program, we've seen a 65% reduction in reported phishing incidents among our student body.",
          author: "Dr. Michael Chen, Technology Director, Westlake Academy"
        }
      ],
      activities: [
        "Interactive phishing simulation games",
        "Digital safety escape room challenges",
        "Mock social media profile security audits",
        "Parent-student collaborative workshops"
      ]
    },
    "Emotional Intelligence": {
      overview: "Emotional intelligence is a critical life skill that helps students manage emotions, build strong relationships, and navigate social complexities. Our program develops these skills through interactive activities and real-world applications.",
      benefits: [
        "Improved academic performance through better focus and reduced emotional distraction",
        "Enhanced conflict resolution skills reducing behavioral incidents",
        "Stronger peer relationships and classroom cohesion",
        "Increased resilience when facing challenges",
        "Better preparation for future workplace success"
      ],
      itinerary: [
        "**Self-Awareness Foundations**",
        "- Identifying and naming emotions",
        "- Understanding emotional triggers",
        "- Recognizing strengths and growth areas",
        "**Self-Regulation Strategies**",
        "- Mindfulness and breathing techniques",
        "- Stress management and impulse control",
        "- Healthy expression of emotions",
        "**Social Awareness Development**",
        "- Active listening and empathy building",
        "- Recognizing others' perspectives",
        "- Cultural sensitivity and diversity appreciation",
        "**Relationship Management Skills**",
        "- Effective communication techniques",
        "- Conflict resolution frameworks",
        "- Teamwork and collaboration practices"
      ],
      stats: [
        { label: "Behavioral Incidents Reduced", value: "62%" },
        { label: "Student Engagement Increased", value: "78%" },
        { label: "Schools Implementing", value: "325+" }
      ],
      testimonials: [
        {
          quote: "The transformation in our students' ability to handle conflicts and work together has been remarkable. It's had a positive ripple effect throughout our entire school culture.",
          author: "Dr. Emily Watson, School Counselor, Oakridge Elementary"
        },
        {
          quote: "As a parent, I've noticed my daughter using the emotional vocabulary and calming techniques at home. These are skills that will benefit her for life.",
          author: "Jennifer Martinez, Parent"
        }
      ],
      activities: [
        "Emotion recognition games and exercises",
        "Peer feedback circles and active listening practice",
        "Role-playing scenarios for conflict resolution",
        "Mindfulness journaling and reflection activities"
      ]
    },
    "Personal Finance": {
      overview: "Financial literacy is essential for future success. Our program teaches students the fundamentals of money management, saving strategies, and investment principles in age-appropriate, engaging ways.",
      benefits: [
        "Stronger foundation for lifelong financial well-being",
        "Practical skills for budgeting and saving",
        "Increased confidence in making financial decisions",
        "Understanding of credit, debt, and financial responsibility",
        "Real-world math application that enhances numeracy skills"
      ],
      itinerary: [
        "**Money Basics & Financial Foundations**",
        "- Understanding currency, banking, and financial systems",
        "- Income sources and earning potential",
        "- The value of money and delayed gratification",
        "**Budgeting & Saving Strategies**",
        "- Creating and maintaining personal budgets",
        "- Setting financial goals and prioritizing expenses",
        "- Emergency funds and saving techniques",
        "**Smart Spending & Consumer Skills**",
        "- Comparison shopping and value assessment",
        "- Avoiding marketing traps and impulse purchases",
        "- Digital payment safety and management",
        "**Introduction to Investing & Future Planning**",
        "- Basic investment concepts (age-appropriate)",
        "- Compound interest and long-term growth",
        "- Educational and career financial planning"
      ],
      stats: [
        { label: "Students Reached", value: "22,000+" },
        { label: "Student Savings Created", value: "$450,000+" },
        { label: "Schools Implementing", value: "280+" }
      ],
      testimonials: [
        {
          quote: "The simulation-based approach to teaching budgeting made a traditionally dry subject exciting for our students. They're now bringing these conversations home!",
          author: "Timothy Green, Economics Teacher, Washington High School"
        },
        {
          quote: "My son started his first savings account after this program and is now saving for college. The real-world relevance made all the difference.",
          author: "Robert Wilson, Parent"
        }
      ],
      activities: [
        "Virtual stock market competitions",
        "Budget simulation games with real-world scenarios",
        "Entrepreneurial market days with student businesses",
        "Mock banking and financial decision-making exercises"
      ]
    },
    "Startup & Entrepreneurship": {
      overview: "Foster innovation and business acumen in students with our comprehensive entrepreneurship program. Students will learn to identify opportunities, develop business plans, and create sustainable ventures.",
      benefits: [
        "Development of creative problem-solving and innovation skills",
        "Understanding of business basics and market dynamics",
        "Improved confidence in public speaking and idea pitching",
        "Enhanced teamwork and project management abilities",
        "Practical application of math, writing, and research skills"
      ],
      itinerary: [
        "**Entrepreneurial Mindset Development**",
        "- Identifying problems and opportunities",
        "- Design thinking and innovation frameworks",
        "- Cultivating curiosity and resilience",
        "**Business Planning & Strategy**",
        "- Market research and competitive analysis",
        "- Value proposition development",
        "- Basic financial projections and budgeting",
        "**Product Development & Testing**",
        "- Minimum viable product creation",
        "- User feedback and iteration processes",
        "- Sustainable and ethical business considerations",
        "**Pitching & Presentation Skills**",
        "- Crafting compelling business pitches",
        "- Visual presentation and storytelling techniques",
        "- Handling questions and feedback constructively"
      ],
      stats: [
        { label: "Student Businesses Created", value: "320+" },
        { label: "Pitch Competition Winners", value: "75+" },
        { label: "Schools Implementing", value: "195+" }
      ],
      testimonials: [
        {
          quote: "The entrepreneurship program transformed our classroom into an innovation hub. Students who were previously disengaged are now leading business projects with enthusiasm.",
          author: "Victoria Adams, Business Studies Teacher, Eastside Academy"
        },
        {
          quote: "My daughter's confidence has skyrocketed since participating in the startup program. She's thinking more creatively about solving problems in all aspects of her life.",
          author: "David Thompson, Parent"
        }
      ],
      activities: [
        "Shark Tank-style pitch competitions",
        "Social enterprise challenges addressing community needs",
        "Product prototyping workshops",
        "Mentorship sessions with local entrepreneurs"
      ]
    },
    "Leadership & Responsibility": {
      overview: "Develop the leaders of tomorrow with our comprehensive leadership program. Students learn essential skills like decision-making, accountability, and effective communication that prepare them for success in any field.",
      benefits: [
        "Increased student ownership of learning and school culture",
        "Enhanced communication and interpersonal skills",
        "Stronger ethical decision-making frameworks",
        "Improved accountability and follow-through on commitments",
        "Greater preparedness for college and career leadership roles"
      ],
      itinerary: [
        "**Leadership Foundations**",
        "- Different leadership styles and their applications",
        "- Personal leadership vision development",
        "- Core values identification and alignment",
        "**Communication & Influence**",
        "- Effective public speaking and presentation skills",
        "- Active listening and feedback techniques",
        "- Persuasion and motivation strategies",
        "**Responsibility & Accountability**",
        "- Commitment setting and follow-through",
        "- Ethical decision-making frameworks",
        "- Taking ownership of outcomes",
        "**Team Dynamics & Collaboration**",
        "- Group facilitation and conflict resolution",
        "- Delegation and resource management",
        "- Creating inclusive and supportive environments"
      ],
      stats: [
        { label: "Student Leaders Developed", value: "5,000+" },
        { label: "Community Projects Implemented", value: "425+" },
        { label: "Schools Implementing", value: "210+" }
      ],
      testimonials: [
        {
          quote: "Since implementing this leadership program, we've seen a dramatic increase in student-led initiatives and a more positive school culture overall.",
          author: "Principal James Rodriguez, Northview High School"
        },
        {
          quote: "The program helped my son find his voice and develop confidence in guiding group projects. These skills have transferred to every aspect of his academic and personal life.",
          author: "Lisa Anderson, Parent"
        }
      ],
      activities: [
        "Student-led community service projects",
        "Peer mentoring programs",
        "Leadership reflection journals and goal setting",
        "School issue problem-solving challenges"
      ]
    },
    "AI & Digital Literacy in 2025": {
      overview: "Prepare students for the AI-driven future with our cutting-edge digital literacy program. Students learn to navigate, evaluate, and create digital content while understanding AI technologies and their ethical implications.",
      benefits: [
        "Enhanced preparedness for future careers involving AI technologies",
        "Improved critical evaluation of digital information sources",
        "Practical skills in using AI tools productively and ethically",
        "Increased confidence in navigating digital environments",
        "Understanding of digital citizenship and online responsibilities"
      ],
      itinerary: [
        "**Digital Literacy Foundations**",
        "- Information evaluation and source credibility",
        "- Digital content creation and sharing",
        "- Online privacy and digital footprint management",
        "**AI Fundamentals**",
        "- Understanding machine learning and AI capabilities",
        "- AI tools and applications in everyday life",
        "- Ethical considerations of AI implementation",
        "**Practical Digital Skills**",
        "- Productivity software mastery",
        "- Collaborative digital tools and platforms",
        "- Basic coding and automation concepts",
        "**Future of Work Preparation**",
        "- AI-human collaboration strategies",
        "- Careers enhanced by digital literacy",
        "- Continuous learning in a rapidly evolving digital landscape"
      ],
      stats: [
        { label: "Digital Projects Created", value: "12,000+" },
        { label: "Digital Literacy Improvement", value: "85%" },
        { label: "Schools Implementing", value: "310+" }
      ],
      testimonials: [
        {
          quote: "This program demystified AI for our students and transformed them from passive technology consumers to confident digital creators.",
          author: "Dr. Rebecca Liu, Technology Director, Central High School"
        },
        {
          quote: "My child now helps me understand AI tools and how to use them responsibly. The program has reversed the digital divide in our home!",
          author: "Mark Davis, Parent"
        }
      ],
      activities: [
        "AI tool exploration and ethical use workshops",
        "Digital misinformation detection challenges",
        "Collaborative cloud-based project creation",
        "Coding and automation introduction activities"
      ]
    },
    "Mental & Physical Health": {
      overview: "Promote holistic well-being with our comprehensive health program addressing both mental and physical aspects. Students learn stress management, nutrition, exercise habits, and mindfulness techniques for balanced living.",
      benefits: [
        "Improved stress management and emotional regulation",
        "Enhanced focus and academic performance",
        "Healthier nutrition and physical activity habits",
        "Reduced anxiety and depression symptoms",
        "Greater self-awareness and mind-body connection"
      ],
      itinerary: [
        "**Mental Health Foundations**",
        "- Understanding stress and anxiety mechanisms",
        "- Mindfulness and meditation techniques",
        "- Emotional processing and healthy coping strategies",
        "**Physical Wellness Essentials**",
        "- Nutrition fundamentals and meal planning",
        "- Exercise principles and activity planning",
        "- Sleep hygiene and rest importance",
        "**Mind-Body Connection**",
        "- Stress impacts on physical health",
        "- Movement for mental wellbeing",
        "- Breathing techniques and body awareness",
        "**Building Healthy Habits**",
        "- Goal setting for wellness",
        "- Accountability systems and tracking progress",
        "- Creating supportive environments"
      ],
      stats: [
        { label: "Student Wellness Improved", value: "78%" },
        { label: "Stress Reduction Reported", value: "65%" },
        { label: "Schools Implementing", value: "285+" }
      ],
      testimonials: [
        {
          quote: "The mindfulness techniques from this program have transformed our classroom environment. Students are more focused, less anxious, and better able to manage conflicts.",
          author: "Maria Gonzalez, School Counselor, Riverside Middle School"
        },
        {
          quote: "My daughter has completely changed her attitude toward physical activity and healthy eating. She's now teaching our family about balanced nutrition!",
          author: "Steven Chang, Parent"
        }
      ],
      activities: [
        "Mindfulness and meditation practice sessions",
        "Healthy cooking demonstrations and nutrition workshops",
        "Movement breaks and fitness challenges",
        "Stress management toolkit development"
      ]
    },
    "False Marketing Prevention": {
      overview: "Empower students to become savvy consumers who can identify and challenge false advertising. Our program builds critical thinking skills that help students navigate an increasingly complex marketing landscape.",
      benefits: [
        "Enhanced critical thinking and media literacy skills",
        "Improved ability to evaluate claims and evidence",
        "Protection from deceptive marketing tactics",
        "More informed consumer decision-making",
        "Increased awareness of persuasive techniques in media"
      ],
      itinerary: [
        "**Understanding Marketing & Advertising**",
        "- Basic marketing concepts and legitimate strategies",
        "- The psychology of persuasion",
        "- Advertising channels and their influence",
        "**Recognizing Deceptive Practices**",
        "- Common false marketing techniques",
        "- Misleading claims and fine print analysis",
        "- Social media influencer transparency issues",
        "**Fact-Checking & Research Skills**",
        "- Information verification strategies",
        "- Source credibility assessment",
        "- Data interpretation and statistical literacy",
        "**Consumer Rights & Reporting**",
        "- Understanding consumer protection laws",
        "- Reporting false advertising",
        "- Advocacy and ethical consumerism"
      ],
      stats: [
        { label: "Student Critical Thinking Improved", value: "76%" },
        { label: "Deceptive Ad Recognition Rate", value: "89%" },
        { label: "Schools Implementing", value: "175+" }
      ],
      testimonials: [
        {
          quote: "This program has completely changed how our students interact with advertising. They're now asking insightful questions and challenging claims rather than accepting them at face value.",
          author: "Olivia Martinez, Media Studies Teacher, Parkview High School"
        },
        {
          quote: "My son now points out misleading claims in commercials and teaches his younger siblings to be critical consumers. It's been eye-opening for our whole family.",
          author: "Andrew Wilson, Parent"
        }
      ],
      activities: [
        "Ad analysis and claim verification exercises",
        "Create-your-own ethical marketing campaigns",
        "Consumer research and comparative shopping projects",
        "False advertisement identification games"
      ]
    },
    "Problem Solving & Critical Thinking": {
      overview: "Develop students' analytical abilities with our systematic approach to problem-solving. Students learn frameworks for breaking down complex challenges, generating creative solutions, and making well-reasoned decisions.",
      benefits: [
        "Improved academic performance across all subjects",
        "Enhanced ability to tackle complex, multi-step problems",
        "Increased confidence when facing challenges",
        "More creative and innovative thinking patterns",
        "Better decision-making based on evidence and logic"
      ],
      itinerary: [
        "**Problem-Solving Frameworks**",
        "- Systematic approaches to problem identification",
        "- Breaking down complex problems into manageable parts",
        "- Decision-making models and matrices",
        "**Critical Thinking Development**",
        "- Logic and reasoning foundations",
        "- Cognitive bias awareness and mitigation",
        "- Evaluating evidence and arguments",
        "**Creative Solution Generation**",
        "- Brainstorming and ideation techniques",
        "- Design thinking and innovation processes",
        "- Lateral thinking and perspective shifting",
        "**Implementation & Evaluation**",
        "- Planning and executing solutions",
        "- Measuring outcomes and success metrics",
        "- Iterative improvement and feedback loops"
      ],
      stats: [
        { label: "Problem-Solving Improvement", value: "82%" },
        { label: "Academic Performance Increase", value: "67%" },
        { label: "Schools Implementing", value: "240+" }
      ],
      testimonials: [
        {
          quote: "The frameworks taught in this program have transformed how our students approach challenges in all subjects. They're more methodical, creative, and persistent.",
          author: "Dr. Jonathan Lee, Curriculum Director, Westfield Academy"
        },
        {
          quote: "My daughter now breaks down her homework into manageable steps and approaches problems systematically. Her confidence has soared!",
          author: "Michelle Parker, Parent"
        }
      ],
      activities: [
        "Real-world problem challenges with community impact",
        "Escape room-style logic puzzles",
        "Debate and structured argument activities",
        "Design thinking workshops for innovative solutions"
      ]
    }
  };

  const details = programDetails[program.title] || {};

  // Animation configurations
  const popupAnimation = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.9)' },
    config: config.gentle
  });

  const fadeIn = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 280, friction: 18 }
  });

  const trailAnimation = useTrail(details.benefits?.length || 0, {
    opacity: 1,
    transform: 'translateX(0)',
    from: { opacity: 0, transform: 'translateX(-20px)' },
    delay: 300,
    config: { mass: 1, tension: 280, friction: 20 }
  });

  const statsAnimation = useTrail(details.stats?.length || 0, {
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay: 600,
    config: { mass: 1, tension: 280, friction: 20 }
  });

  // Testimonial auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (details.testimonials?.length > 0) {
        setTestimonialIndex(prev => (prev + 1) % details.testimonials.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [details.testimonials]);

  // Confetti effect for CTA
  const triggerConfetti = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: theme.lottiePath,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm" onClick={onClose}></div>
      
      <animated.div 
        style={popupAnimation} 
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden`}
      >
        {/* Header Section with Animation */}
        <div className={`bg-gradient-to-r ${theme.gradient} p-8 relative`}>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-all"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 relative mr-6 flex-shrink-0">
              <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 rounded-full bg-white bg-opacity-30">
                  {theme.icon}
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left mt-4 md:mt-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{program.title}</h2>
              <p className="text-white text-opacity-90 text-lg max-w-2xl">{program.content}</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap space-x-1 mt-8 border-b border-white border-opacity-30 pb-1">
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              label="Overview"
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'curriculum'} 
              onClick={() => setActiveTab('curriculum')}
              label="Curriculum"
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'benefits'} 
              onClick={() => setActiveTab('benefits')}
              label="Benefits"
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'activities'} 
              onClick={() => setActiveTab('activities')}
              label="Activities"
              theme={theme}
            />
            <TabButton 
              active={activeTab === 'testimonials'} 
              onClick={() => setActiveTab('testimonials')}
              label="Testimonials"
              theme={theme}
            />
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <animated.div style={fadeIn} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Program Overview</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">{details.overview}</p>
                  
                  <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Program Highlights</h4>
                  <ul className="space-y-3">
                    {trailAnimation.map((props, index) => (
                      <animated.li 
                        key={index} 
                        style={props}
                        className="flex items-start"
                      >
                        <FaCheckCircle className={`mr-2 mt-1 text-${theme.primary.replace('#', '')}`} />
                        <span className="text-gray-700 dark:text-gray-300">{details.benefits?.[index]}</span>
                      </animated.li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:w-1/2">
                <div className="h-64 md:h-80 flex items-center justify-center">
                    <Lottie 
                      options={lottieOptions}
                      height={300}
                      width={300}
                    />
                  </div>
                  
                  {/* Stats Section */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {statsAnimation.map((props, index) => (
                      <animated.div 
                        key={index} 
                        style={props}
                        className={`p-4 rounded-lg bg-${theme.secondary.replace('#', '')} border border-${theme.primary.replace('#', '')} border-opacity-30`}
                      >
                        <p className={`text-3xl font-bold text-${theme.primary.replace('#', '')}`}>{details.stats?.[index]?.value}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{details.stats?.[index]?.label}</p>
                      </animated.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <motion.div 
                className={`mt-8 p-6 rounded-xl bg-${theme.primary.replace('#', '')} bg-opacity-10 border border-${theme.primary.replace('#', '')} border-opacity-30 text-center`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Ready to transform your students' future?</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Join the hundreds of schools already implementing our life-changing programs.</p>
                <button
                  onClick={triggerConfetti}
                  className={`bg-gradient-to-r ${theme.gradient} text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition duration-300 transform hover:-translate-y-1`}
                >
                  Schedule a Demo Session
                </button>
              </motion.div>
            </animated.div>
          )}
          
          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <animated.div style={fadeIn} className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Comprehensive Curriculum</h3>
              
              <div className="space-y-6">
                {details.itinerary?.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${item.startsWith("**") ? "mb-4" : "ml-6 mb-2"}`}
                  >
                    {item.startsWith("**") ? (
                      <h4 className={`text-xl font-semibold text-${theme.primary.replace('#', '')} flex items-center`}>
                        <FaLightbulb className="mr-2" />
                        {item.replace(/\*\*/g, '')}
                      </h4>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 flex items-start">
                        {item.startsWith("- ") ? (
                          <>
                            <FaArrowRight className={`text-${theme.primary.replace('#', '')} mr-2 mt-1 text-sm flex-shrink-0`} />
                            <span>{item.replace("- ", "")}</span>
                          </>
                        ) : (
                          item
                        )}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <FaCalendarAlt className={`text-${theme.primary.replace('#', '')} text-2xl mr-3`} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Program Duration</p>
                    <p className="font-semibold text-gray-800 dark:text-white">Flexible: 1-Day Workshop to 8-Week Course</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUsers className={`text-${theme.primary.replace('#', '')} text-2xl mr-3`} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ideal For</p>
                    <p className="font-semibold text-gray-800 dark:text-white">Grades 6-12</p>
                  </div>
                </div>
              </div>
            </animated.div>
          )}
          
          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <animated.div style={fadeIn} className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Program Benefits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.benefits?.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border border-${theme.primary.replace('#', '')} border-opacity-30 hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full bg-${theme.primary.replace('#', '')} bg-opacity-20 mr-3`}>
                        <FaCheckCircle className={`text-${theme.primary.replace('#', '')}`} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Long-Term Impact</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Students who complete our {program.title} program demonstrate significantly improved outcomes in both academic performance and social-emotional development. Schools report improved attendance, reduced behavioral incidents, and enhanced student engagement across all subjects.
                </p>
              </div>
            </animated.div>
          )}
          
          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <animated.div style={fadeIn} className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Engaging Activities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {details.activities?.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className={`p-5 rounded-lg bg-${theme.secondary.replace('#', '')} hover:shadow-md transition-all`}
                  >
                    <p className="font-medium text-gray-800 dark:text-white">{activity}</p>
                  </motion.div>
                ))}
              </div>
              
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards, Pagination, Autoplay]}
                className="mt-8 h-64 w-full md:w-3/4 mx-auto"
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
              >
                {[1, 2, 3].map((item) => (
                  <SwiperSlide key={item} className="rounded-xl overflow-hidden">
                    <div className={`h-full w-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-6 text-center`}>
                      <div className="text-white">
                        <h4 className="text-xl font-semibold mb-2">Activity Spotlight {item}</h4>
                        <p>Interactive {program.title} session with students actively engaged in hands-on learning.</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </animated.div>
          )}
          
          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <animated.div style={fadeIn} className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Success Stories</h3>
              
              <div className="mb-8">
                {details.testimonials?.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ 
                      opacity: testimonialIndex === index ? 1 : 0,
                      x: testimonialIndex === index ? 0 : 30,
                      position: testimonialIndex === index ? 'relative' : 'absolute'
                    }}
                    className={`p-6 rounded-xl bg-gray-50 dark:bg-gray-700 ${testimonialIndex === index ? 'block' : 'hidden'}`}
                  >
                    <svg className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-4">{testimonial.quote}</p>
                    <p className={`font-medium text-${theme.primary.replace('#', '')}`}>{testimonial.author}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Implementation Success</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm flex-1">
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">97%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm flex-1">
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">89%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Renewal Rate</p>
                  </div>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm flex-1">
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">35+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">States Served</p>
                  </div>
                </div>
              </div>
            </animated.div>
          )}
        </div>
        
        {/* Footer CTA */}
        <div className={`p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap justify-between items-center`}>
          <p className="text-gray-700 dark:text-gray-300 mb-4 md:mb-0">
            Ready to bring <span className="font-semibold">{program.title}</span> to your school?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerConfetti}
              className={`px-5 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-lg shadow-md hover:shadow-lg transition-all`}
            >
              Book a Consultation
            </motion.button>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, label, theme }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-t-lg transition-colors ${
      active 
        ? `bg-white dark:bg-gray-800 text-${theme.primary.replace('#', '')}` 
        : 'text-white bg-white bg-opacity-10 hover:bg-opacity-20'
    }`}
  >
    {label}
  </motion.button>
);

export default LearnMorePopup;