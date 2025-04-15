

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Lottie from 'react-lottie';

// Import Lottie animations
import digitalSafetyAnimation from "../animations/digitalSafety.json";
import emotionalIntelligenceAnimation from "../animations/emotionalIntelligence.json";
import personalFinanceAnimation from "../animations/personalFinance.json";
import entrepreneurshipAnimation from "../animations/entrepreneurship.json";

const programAnimations = {
  "Digital Safety & Fraud Prevention": digitalSafetyAnimation,
  "Emotional Intelligence": emotionalIntelligenceAnimation,
  "Personal Finance": personalFinanceAnimation,
  "Startup & Entrepreneurship": entrepreneurshipAnimation,
  // Add other program titles and corresponding animations here
};


const programDetails = {
  "Digital Safety & Fraud Prevention": {
    itinerary: [
      { title: "Types of Cyber Threats", content: "Deep dive into phishing, malware, scams targeting youth" },
      { title: "Real-Life Examples", content: "Analysis of recent fraud cases specifically targeting kids and teens" },
      { title: "Identifying Suspicious Activities", content: "Interactive exercises to spot red flags in emails, messages, and websites" },
      { title: "Secure Passwords & 2FA", content: "Workshop on creating strong passwords and setting up two-factor authentication" },
      { title: "Safe Browsing Habits", content: "Hands-on training with privacy settings, ad blockers, and VPNs" },
      { title: "Parental Involvement", content: "Tools and strategies for monitoring online activity and educating parents" },
      { title: "Family Digital Safety Plan", content: "Collaborative session to create personalized family safety protocols" }
    ],
    outcomes: {
      title: "Digital Safety",
      tag: "Top Result",
      tagColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-green-600",
      metrics: [
        { name: "Fraud Detection Skills", value: "94% Improvement", width: "94%" },
        { name: "Online Safety Practices", value: "89%", width: "89%" },
        { name: "Parental Awareness Increase", value: "78%", width: "78%" }
      ],
      achievement: "97% of students successfully identified and avoided simulated phishing attempts after our program."
    },
    testimonial: {
      quote: "This program completely transformed how my daughter approaches online safety. She's now teaching ME about digital security!",
      author: "Jessica Miller",
      role: "Parent of 14-year-old"
    }
  },
  "Emotional Intelligence": {
    itinerary: [
      { title: "Understanding Emotions", content: "Tools to identify and effectively manage emotions in various situations" },
      { title: "Mindfulness Techniques", content: "Practical exercises for staying calm and focused under pressure" },
      { title: "Empathy Building", content: "Role-playing activities to understand perspectives beyond your own" },
      { title: "Active Listening", content: "Structured conversation practices that improve communication skills" },
      { title: "Conflict Resolution", content: "Step-by-step strategies for peacefully resolving disagreements" },
      { title: "Relationship Building", content: "Techniques for creating and maintaining strong connections with others" },
      { title: "Practical Exercises", content: "Hands-on activities that reinforce emotional intelligence concepts" }
    ],
    outcomes: {
      title: "Emotional Intelligence",
      tag: "Parent Favorite",
      tagColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-yellow-600",
      metrics: [
        { name: "Conflict Resolution", value: "70% Improvement", width: "70%" },
        { name: "Emotional Control", value: "85%", width: "85%" },
        { name: "Behavior Change", value: "82%", width: "82%" }
      ],
      achievement: "73% reduction in disciplinary incidents reported in schools and home after implementing our emotional intelligence curriculum."
    },
    testimonial: {
      quote: "The emotional intelligence program has helped our entire school community. Students are more empathetic and conflicts are resolved much more peacefully.",
      author: "Principal Sarah Johnson",
      role: "Washington Middle School"
    }
  },
  "Personal Finance": {
    itinerary: [
      { title: "Money Basics", content: "Understanding currency, banking systems, and financial terminology" },
      { title: "Budgeting 101", content: "Creating and maintaining effective personal budgets" },
      { title: "Smart Saving Strategies", content: "Techniques for short-term and long-term saving goals" },
      { title: "Responsible Spending", content: "Distinguishing needs vs. wants and making informed purchases" },
      { title: "Introduction to Investing", content: "Age-appropriate overview of how investments work" },
      { title: "Financial Goal Setting", content: "Workshops on creating achievable financial milestones" },
      { title: "Digital Financial Tools", content: "Hands-on experience with safe banking and budgeting apps" }
    ],
    outcomes: {
      title: "Personal Finance",
      tag: "Life-Changing",
      tagColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-green-600",
      metrics: [
        { name: "Budgeting Skills", value: "80% Adoption", width: "80%" },
        { name: "Saving Habit Formation", value: "88%", width: "88%" },
        { name: "Financial awareness Score", value: "79%", width: "79%" }
      ],
      achievement: "Students started average savings of 60% of there monthly pocket money after the program, with 64% maintaining this habit for over a months."
    },
    testimonial: {
      quote: "I never thought learning about finances could be fun! Now I'm saving up for my first investment and tracking my spending.",
      author: "Tyler Johnson",
      role: "16-year-old student"
    }
  },
  "Entrepreneurship": {
    itinerary: [
      { title: "Entrepreneurial Mindset", content: "Developing problem-solving and opportunity-spotting skills" },
      { title: "Idea Generation", content: "Creative workshops to identify needs and innovative solutions" },
      { title: "Business Planning Basics", content: "Step-by-step guide to creating a simple business plan" },
      { title: "Marketing Fundamentals", content: "Understanding your audience and communicating value" },
      { title: "Financial Literacy", content: "Pricing strategies, profit calculations, and budget management" },
      { title: "Presentation Skills", content: "Training on how to pitch ideas effectively" },
      { title: "Mini Startup Challenge", content: "Hands-on experience launching a small entrepreneurial project" }
    ],
    outcomes: {
      title: "Entrepreneurship",
      tag: "Most Popular",
      tagColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-yellow-600",
      metrics: [
        { name: "Business Plan Creation", value: "90% Adoption", width: "90%" },
        { name: "Startup conversation", value: "83%", width: "83%" },
        { name: "Goal Skill Acquisition", value: "65%", width: "65%" }
      ],
      achievement: "40% of students were serious about there idea and had converstation, idea sharing with there teacher and family members"
    },
    testimonial: {
      quote: "The entrepreneurship program sparked incredible creativity in our students. Several have already started small businesses!",
      author: "Mark Thompson",
      role: "High School Business Teacher"
    }
  }
};

const LearnMorePopup = ({ program, onClose }) => {
  if (!program) return null;

  const programInfo = programDetails[program.title] || {};
  const animationData = programAnimations[program.title] || null;

  const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
    >
      <div 
        className="bg-white text-gray-900 rounded-lg shadow-xl p-8 m-4 max-w-4xl w-full overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
      >
        {/* Header with Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-yellow-600">{program.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Lottie Animation */}
        {animationData && (
          <div className="mb-8">
            <Lottie options={defaultLottieOptions} height={200} width={"100%"} />
          </div>
        )}

        {/* Program Content */}
        <p className="text-gray-700 text-lg mb-8">{program.content}</p>

        {/* Itinerary */}
        {programInfo.itinerary && (
          <div className="mb-8">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Program Itinerary</h4>
            <ul className="space-y-4">
              {programInfo.itinerary.map((item, index) => (
                <li key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                  <h5 className="text-xl font-medium text-gray-900">{item.title}</h5>
                  <p className="text-gray-600 mt-2">{item.content}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Outcomes */}
        {programInfo.outcomes && (
          <div className="mb-8">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Key Outcomes</h4>
            <div className="p-6 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: programInfo.outcomes.borderColor }}>
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${programInfo.outcomes.tagColor}`}>
                  {programInfo.outcomes.tag}
                </span>
                <h5 className="text-xl font-medium text-gray-900 ml-4">{programInfo.outcomes.title}</h5>
              </div>
              <div className="space-y-4">
                {programInfo.outcomes.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3 text-gray-700">{metric.name}</div>
                    <div className="w-2/3">
                      <div className="bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: metric.width }}
                        ></div>
                      </div>
                      <div className="text-right text-gray-600 mt-1">{metric.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6">{programInfo.outcomes.achievement}</p>
            </div>
          </div>
        )}

        {/* Testimonial */}
        {programInfo.testimonial && (
          <div className="mb-8">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">What People Are Saying</h4>
            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <p className="text-gray-700 text-lg italic mb-4">"{programInfo.testimonial.quote}"</p>
              <div className="text-right">
                <span className="text-gray-900 font-medium">{programInfo.testimonial.author}</span>
                <br />
                <span className="text-gray-600">{programInfo.testimonial.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePopup;


the outcome card version of the landking page with prograss bar outcomes-

"import { useState, useEffect } from 'react';
import {
  FaGraduationCap,
  FaBrain,
  FaShieldAlt,
  FaHandHoldingUsd,
  FaChalkboardTeacher,
  FaUsers,FaBars,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import { MdOutlineWork, MdTouchApp, MdSupervisorAccount } from 'react-icons/md';
import seminar from '../assets/seminar.jpg';
import howitworks from '../assets/howitworks.jpg';

const LandingPage = () => {
  // Data for dynamic rendering

  const [isNavOpen, setIsNavOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsNavOpen(false); // Close mobile menu after clicking
    }
  };
  
  const programCards = [
    {
      icon: <FaShieldAlt className="text-yellow-500 text-2xl" />,
      title: "Digital Safety & Fraud Prevention",
      content: "Scammers prey on kids and teens and senior citizens—don't let yours be the next victim. This powerful session arms students and parents with essential skills to detect and prevent digital frauds before it's too late."
    },
    {
      icon: <FaBrain className="text-yellow-500 text-2xl" />,
      title: "Emotional Intelligence",
      content: "Academic excellence alone isn't enough—students must master self-awareness, empathy, and resilience to thrive in life and career. Learn how to always stay happy, manage anger, and build strong relationships through self-awareness, self-regulation, social awareness, and relationship management."
    },
    {
      icon: <FaHandHoldingUsd className="text-yellow-500 text-2xl" />,
      title: "Personal Finance",
      content: "Equip students with essential money management skills from an early age. Learn budgeting, saving, and smart investments that can lay the foundation for a successful financial future."
    },
    {
      icon: <MdOutlineWork className="text-yellow-500 text-2xl" />,
      title: "Startup & Entrepreneurship",
      content: "Ignite entrepreneurial spirit—teach idea validation, business planning, and how to build their own venture."
    },
    {
      icon: <MdSupervisorAccount className="text-yellow-500 text-2xl" />,
      title: "Leadership & Responsibility",
      content: "Cultivate strong leaders—teach accountability, responsibility, and the mindset needed for future success."
    },
    {
      icon: <MdTouchApp className="text-yellow-500 text-2xl" />,
      title: "Digital Literacy",
      content: "Equip students with essential digital tools and skills, including AI technologies, required for success in today's tech-driven world. From using basic software to navigating online platforms and understanding AI's role, prepare them for the future workplace."
    }
  ];

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

  const outcomeCards = [
    {
      title: "Digital Safety",
      tag: "Top Result",
      tagColor: "bg-green-100 text-green-800",
      borderColor: "border-green-600",
      metrics: [
        { name: "Fraud Detection Skills", value: "94% Improvement", width: "94%" },
        { name: "Online Safety Practices", value: "89%", width: "89%" },
        { name: "Parental Awareness Increase", value: "78%", width: "78%" }
      ],
      achievement: "97% of students successfully identified and avoided simulated phishing attempts after our program."
    },
    {
      title: "Emotional Intelligence",
      tag: "Parent Favorite",
      tagColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-yellow-600",
      metrics: [
        { name: "Conflict Resolution", value: "70% Improvement", width: "70%" },
        { name: "Emotional Control", value: "85%", width: "85%" },
        { name: "Behavior Change", value: "82%", width: "82%" }
      ],
      achievement: "73% reduction in disciplinary incidents reported in schools and home after implementing our emotional intelligence curriculum."
    },
    {
      title: "Personal Finance",
      tag: "Life-Changing",
      tagColor: "bg-green-100 text-green-800",
      borderColor: "border-green-600",
      metrics: [
        { name: "Budgeting Skills", value: "80% Adoption", width: "80%" },
        { name: "Saving Habit Formation", value: "88%", width: "88%" },
        { name: "Financial awareness Score", value: "79%", width: "79%" }
      ],
      achievement: "Students started average savings of 60% of there monthly pocket money after the program, with 64% maintaining this habit for over a months."
    },
    {
      title: "Entrepreneurship",
      tag: "Most Popular",
      tagColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-yellow-600",
      metrics: [
        { name: "Business Plan Creation", value: "90% Adoptioon", width: "90%" },
        { name: "Startup conversation", value: "83%", width: "83%" },
        { name: "Goal Skill Acquisition", value: "65%", width: "65%" }
      ],
      achievement: "40% of students were serious about there idea and had converstation, idea sharing with there teacher and family members"
    }
  ];

  const testimonials = [
    {
      content: "The digital safety workshop was eye-opening for both our students and teachers. It addressed critical issues that our standard curriculum simply doesn't cover.",
      name: "Rajesh Sharma",
      title: "Principal, GD Public School"
    },
    {
      content: "The personal finance module has transformed how our students think about money. They're now teaching budgeting concepts to their parents and they are less stubburn for asking money!",
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
    { value: "95+ %", label: "of parents noticed positive changes in there children's behaiviour" },
    { value: "84%", label: "of students continued using skills 1 months after completion" }
  ];

  const academicImpact = [
    { value: "32%", label: "Improvement in classroom participation" },
    { value: "30%", label: "Increase in project completion rates" },
    { value: "60%", label: "Boost in leadership initiative among students" },
    { value: "40%", label: "Growth in academic performance" }
  ];

  const howItWorksSteps = [
    { title: "Free School Presentations", content: "We visit schools or provide online presentations to deliver engaging presentations on essential topics like digital safety, emotional intelligence, and more." },
    { title: "Online Course Access", content: "Students get access to our online platform with self-paced courses and interactive learning materials." },
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
    forSchools: ["Book a Presentation", "Partner With Us", "Success Stories", "Resources"],
    legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
  };

  return (
    <div className="font-sans bg-gray-900 text-gray-100">

      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg z-50 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-yellow-400 text-3xl font-bold cursor-pointer" onClick={() => scrollToSection('hero')}>
            Untradd.
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('core-programs')} 
              className="text-gray-300 hover:text-yellow-400 transition duration-300"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-300 hover:text-yellow-400 transition duration-300"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsNavOpen(!isNavOpen)}>
              <FaBars className="text-yellow-400 text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isNavOpen ? 'block' : 'hidden'} bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg`}>
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
      <section className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering India's Youth with Future-Ready Skills</h1>
              <p className="text-xl mb-8">Practical education designed for the challenges of the 21st century</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
  onClick={() => {
    const coreProgramsSection = document.getElementById('core-programs');
    if (coreProgramsSection) {
      coreProgramsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }}
  className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300"
>
  Explore Courses
</button>
<button 
  onClick={() => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  }}
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

      {/* Mission Statement */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">Bridging the Gap Between Education and Real World</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're on a mission to democratize quality education, ensuring every Indian student gains the same practical skills that empower graduates of IITs, IIMs, and the world's top 1% experts in their fields to thrive in today's competitive landscape.
          </p>
        </div>
      </section>

      {/* Core Programs */}
      <section id="core-programs" className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-2 text-center text-yellow-400">Essential Skills for Today's World</h2>
          <p className="text-gray-300 mb-12 text-center">Practical programs designed by experts to prepare students for real challenges</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programCards.map((card, index) => (
              <div key={index} className="bg-green-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-green-700">
                <div className="bg-green-800 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">{card.title}</h3>
                <p className="text-gray-300">
                  {card.content}
                </p>
                <a href="#" className="flex items-center mt-4 text-yellow-400 font-medium">
                  Learn more <FaArrowRight className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">What Makes Us Different</h2>

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

      {/* Measurable Outcomes */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Real Results for Students</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12">
            Our programs don't just teach—they "transform". Here's how our students perform after completing our seminars:
            we took feedback from more than 500 students and 300+ parents-
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outcomeCards.map((card, index) => (
              <div key={index} className={`bg-green-900 p-8 rounded-xl shadow-lg border-t-4 ${card.borderColor}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-yellow-400">{card.title}</h3>
                  <div className={`${card.tagColor} font-bold py-1 px-3 rounded-full text-sm`}>
                    {card.tag}
                  </div>
                </div>
                <div className="space-y-4">
                  {card.metrics.map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-300">{metric.name}</span>
                        <span className="text-yellow-400 font-bold">{metric.value}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: metric.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-gray-300">
                  <span className="font-bold text-yellow-400">Key Achievement:</span> {card.achievement}
                </p>
              </div>
            ))}
          </div>

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

          {/* Case Study Highlight */}
          <div className="mt-16 bg-green-800 text-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Case Study: G D Public School, Rohtas</h3>
                <p className="mb-4">After implementing our complete skill development program:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Digital fraud attempts against students dropped by 87%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Student-led initiatives increased by 63%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>95% of parents reported higher confidence in their child's future readiness</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3 text-center">
                <div className="bg-gray-900 text-yellow-400 rounded-full p-6 inline-block">
                  <div className="text-5xl font-bold">9.2</div>
                  <div className="font-medium">out of 10</div>
                </div>
                <p className="mt-4 font-medium">Overall Satisfaction Score</p>
              </div>
            </div>
          </div>

         {/* Original button with popup functionality */}
<div className="mt-12 text-center">
  <button 
    onClick={() => {
      const popup = document.getElementById('contact-options-popup');
      if (popup) popup.classList.toggle('hidden');
    }}
    className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
  >
    Schedule a Session
    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
    </svg>
  </button>
  
  {/* Popup Card - Hidden by default */}
  <div 
    id="contact-options-popup" 
    className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={(e) => {
      if (e.target.id === 'contact-options-popup') {
        document.getElementById('contact-options-popup').classList.add('hidden');
      }
    }}
  >
    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Contact Us</h3>
        <button 
          onClick={() => document.getElementById('contact-options-popup').classList.add('hidden')}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">How would you like to connect with us?</p>
      
      <div className="space-y-4">
        <a 
          href="tel:+918789698369" 
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Call Us Now
        </a>
        
        <a 
          href="https://wa.me/918789698369?text=Hi%20Untradd,%20I'm%20interested%20in%20learning%20more%20about%20your%20presentation%20and%20would%20like%20to%20schedule%20a%20free%20assessment." 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">How It Works</h2>

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
                      <h3 className="text-xl font-bold mb-2 text-yellow-400">{step.title}</h3>
                      <p className="text-gray-300">{step.content}</p>
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
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">What Schools Are Saying</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-green-900 p-8 rounded-xl shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img src="/api/placeholder/48/48" alt="Person" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Call To Action */}
     {/* CTA Section with TypeScript-friendly modal handling */}
<section className="py-16 bg-gray-900">
  <div className="container mx-auto px-6 md:px-12 text-center">
    <h2 className="text-3xl font-bold mb-4 text-yellow-400">Ready to Bring 21st Century Skills to Your School?</h2>
    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
      Book a free presentation for your school or get early access to our online platform.
    </p>
    
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button 
        onClick={() => {
          // Using React state would be better in a React component
          // This is a DOM-based approach that will work with plain JS/TS
          const modal = document.querySelector('[data-modal="presentation"]');
          if (modal) modal.classList.remove('hidden');
        }}
        className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition duration-300"
      >
        Book a Free Presentation
      </button>
      
      <button 
        onClick={() => {
          const modal = document.querySelector('[data-modal="online-access"]');
          if (modal) modal.classList.remove('hidden');
        }}
        className="bg-green-700 text-gray-200 font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Request Online Access
      </button>
    </div>
  </div>
  
  {/* Presentation Modal */}
  <div 
    data-modal="presentation"
    className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={(e) => {
      // TypeScript-friendly event handling
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
          <h2 className="text-3xl font-bold mb-12 text-center text-yellow-400">Frequently Asked Questions</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-green-900 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-yellow-400">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Contact Section */}
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
          const name = document.getElementById('name').value;
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
                <p className="text-gray-300">Hydrabad, India</p>
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
                  <li key={index}><a href="#" className="hover:text-yellow-400 transition duration-300">{program}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-yellow-400">For Schools</h4>
              <ul className="space-y-2 text-gray-400">
                {footerLinks.forSchools.map((link, index) => (
                  <li key={index}><a href="#" className="hover:text-yellow-400 transition duration-300">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-yellow-400">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}><a href="#" className="hover:text-yellow-400 transition duration-300">{link}</a></li>
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


export default LandingPage;"

