import  { useState, useEffect } from 'react';
import { BookOpen, Compass, Award, Rocket, Calendar, Users, Filter, Code, Briefcase, CheckCircle, TrendingUp, Star, MessageCircle, Zap, FileText, Settings, Mail, MessageSquare, Shield, Laptop, User, ChevronDown, Menu, X } from 'lucide-react';
import { createGlobalStyle } from 'styled-components';
import Modal from '../components/ui/Modal';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';
import TermsConditions from '../components/TermsConditions';
import PrivacyPolicy from '../components/PrivacyPolicy';
import Disclaimer from '../components/Disclaimer';
import ProgramOptions from '../components/ProgramOptions';

// Import profile images
import maleImage from '../assets/male.jpg';
import nehaImage from '../assets/neha.jpg';
import nehaGuptaImage from '../assets/nehagupta.jpeg';
import rahulImage from '../assets/rahul.jpeg';
import vikramImage from '../assets/vikram.jpg';
import arjuImage from '../assets/arju swami.webp';
import priyaImage from '../assets/priya.jpeg';
import chetanImage from '../assets/chetan.jpeg';
import tarunImage from '../assets/tarun.jpeg';
import bibhuImage from '../assets/bibhu.jpeg';


const GlobalStyle = createGlobalStyle`
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin-slow {
    animation: spin-slow 15s linear infinite;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  @keyframes autoScroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-auto-scroll {
    animation: autoScroll 15s linear infinite;
  }
  
  .animate-scroll-slow {
    animation: autoScroll 30s linear infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .animate-pulse-slow {
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes count-up {
    from {
      content: "1500";
    }
    to {
      content: "2300";
    }
  }
  
  .animate-count {
    counter-reset: count 1500;
    animation: count-up 3s forwards ease-out;
  }
  
  .animate-count::after {
    content: counter(count);
  }
`;
export default function StudentJourneyRoadmap() {
  const [activePhase, setActivePhase] = useState(1);
  const [count, setCount] = useState(1500);
  const [activeTab, setActiveTab] = useState('individual');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal states
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer' | null>(null);
  
  const openModal = (modal: 'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer') => {
    setActiveModal(modal);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const startCount = 1500;
    const endCount = 2300;
    const duration = 12000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = (endCount - startCount) / steps;
    
    let currentCount = startCount;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= endCount) {
        setCount(endCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentCount));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const whatsappNumber = "918789698369";
  
  const openWhatsApp = (message: string) => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const phases = [
    {
      id: 1,
      title: "Orientation & Consultation",
      icon: <Compass size={24} />,
      goal: "To understand the student's unique career path and passion to choose a secured career",
      description: "Comprehensive assessment of background, goals, and skills to chart the perfect career path.",
      benefits: [
        "1:1 Orientation session",
        "Personalized career consultation",
        "AI-proof career domain selection"
      ],
      domains: [
        "Product Management",
        "Web Development with AI",
        "Data Science with AI",
        "DevOps with AI",
        "AI/ML",
        "UI/UX with AI",
        "Cloud Architecture",
        "Cybersecurity",
        "Digital marketing",
        "HR", "Operations", "Sales", "Finance"
      ]
    },
    {
      id: 2,
      title: "Foundation Training",
      icon: <BookOpen size={24} />,
      goal: "Build professional competence with industry-ready practical skills",
      description: "Common industry-ready modules that build professional competence and relevance.",
      modules: [
        { name: "Personality Development", desc: "Confidence, grooming, presentation skills" },
        { name: "Work Ethics & Behavior", desc: "Professional mindset and discipline" },
        { name: "English Communication", desc: "Business communication and presentation" },
        { name: "Problem Solving & Aptitude", desc: "Logical reasoning and numerical skills" },
        { name: "Prompt Engineering & AI Tools", desc: "ChatGPT, Copilot, practical AI use" },
        { name: "Resume Building with AI", desc: "ATS-friendly resume and LinkedIn optimization" },
        { name: "Coding Basics", desc: "Foundation for logic and modular learning" },
        { name: "Mock Interviews", desc: "HR + Technical rounds practice" }
      ],
      perks: [
        "Weekly Expert Talks",
        "Industry Update Sessions",
        "Progress Tracker Access"
      ]
    },
    {
      id: 3,
      title: "Domain Projects",
      icon: <Code size={24} />,
      goal: "Apply learned skills in real-world projects",
      description: "Based on chosen path, students dive deep into domain-specific learning through hands-on projects.",
      benefits: [
        "Training by industry experts",
        "Hands-on live projects",
        "Real-world assignments",
        "Weekly reviews and feedback",
        "Dedicated mentors & tech support",
        "Weekly progress tracking"
      ]
    },
    {
      id: 4,
      title: "Internship & Certification",
      icon: <Briefcase size={24} />,
      goal: "Gain real industry experience and certification",
      description: "Guaranteed internship placement starting from Month 4, with early access for achievers.",
      details: [
        "Interview prep from Month 3",
        "Guaranteed internship assistance",
        "60-70% paid internships",
        "Placement assistance for all",
        "Partner company placements",
        "In-house projects & startups"
      ],
      benefits: [
        "Certificate of Excellence (6 months validity)",
        "Continued placement support",
        "ATS-optimized resume refinement",
        "Job application strategies"
      ]
    }
  ];
  

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 text-slate-800 font-sans relative">
      {/* Floating WhatsApp Button */}
      <button 
        onClick={() => openWhatsApp("Hi, I'd like to know more about UntraddCareer program.")}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 z-50 flex items-center gap-2 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare size={24} />
        <span className="hidden md:inline">Chat with Us</span>
      </button>

      {/* Header */}
      <header className="bg-white shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Compass className="text-blue-600 mr-2" size={28} />
              <h1 className="text-xl md:text-2xl font-bold text-blue-700">UntraddCareer</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile free counseling button (outside menu) */}
              <button 
                onClick={() => openWhatsApp("Hi, I'd like to schedule a free career counseling session for the UntraddCareer program.")}
                className="md:hidden bg-green-600 text-white px-2 py-1 rounded-full hover:bg-green-700 transition-colors shadow-sm flex items-center"
                aria-label="Free Counseling"
              >
                <Calendar size={14} className="mr-1" />
                <span className="text-xs">Take Free Counseling</span>
              </button>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex gap-6 items-center">
              <a 
                href="#take-it-now" 
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Programs
              </a>
              <button 
                onClick={() => openModal('about')}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={() => openModal('contact')}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Contact Us
              </button>
              <button 
                onClick={() => openWhatsApp("Hi, I'd like to schedule a free career counseling session for the UntraddCareer program.")}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Calendar size={16} />
                Take a Free Counseling
              </button>
            </nav>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-3 bg-white border-t border-gray-100 animate-fadeIn">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#take-it-now" 
                  className="text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Programs
                </a>
                <button 
                  onClick={() => {
                    openModal('about');
                    setMobileMenuOpen(false);
                  }}
                  className="text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 text-left block"
                >
                  About Us
                </button>
                <button 
                  onClick={() => {
                    openModal('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 text-left block"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-lg p-4 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold text-blue-700 mb-4">
                Get Industry-Ready with Guaranteed Internships
              </h1>
              <h2 className="text-lg font-semibold text-green-700 mb-2 animate-fadeIn">
                Earn While You Learn - Zero to Industry Professional
              </h2>
              
              <p className="text-lg text-slate-600 mb-6">
                No matter your background, our program transforms students into job-ready professionals through structured training, AI-proof skills, and guaranteed paid internships.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-2 flex items-center">
                  <Calendar size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm">Experience Letter</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 flex items-center">
                  <Briefcase size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm">100% Internship Guarantee</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 flex items-center">
                  <Award size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm">Industry Certification</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 flex items-center">
                  <Rocket size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm">AI-Proof Career Skills</span>
                </div>
              </div>

              {/* <button 
                onClick={() => openWhatsApp("Hi, I'd like to schedule a free career counseling session for UntraddCareer program.")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
                aria-label="Schedule Free Counseling"
              >
                <MessageSquare size={20} />
                <span className="font-medium">Schedule Free Career Counseling</span>
              </button> */}
            </div>

            
            <div className="md:w-1/2 flex justify-center flex-col items-center">
              <div className="relative h-64 w-64 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border-4 border-dashed border-blue-300 rounded-full animate-spin-slow"></div>
                <div className="bg-white h-48 w-48 rounded-full shadow-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <TrendingUp size={32} className="text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-blue-700">Future-Ready Skills</p>
                    <p className="text-sm text-slate-500">Industry-Aligned Training</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-600 rounded-lg p-3 shadow-lg w-full max-w-xs transform hover:scale-105 transition-transform mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {count}+
                  </div>
                  <p className="text-white text-sm font-medium">Internships Available - Claim Yours Now!</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button 
                  onClick={() => openWhatsApp("Hi, I'm interested in enrolling as an individual in the UntraddCareer program.")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer mb-2 sm:mb-0"
                  aria-label="Enroll as Individual"
                >
                  <MessageSquare size={16} className="flex-shrink-0" />
                  <span className="text-sm">I Want It for myself</span>
                </button>
                <button 
                  onClick={() => openWhatsApp("Hi, I'm interested in partnering with UntraddCareer for our college.")}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Partner as College"
                >
                  <MessageSquare size={16} className="flex-shrink-0" />
                  <span className="text-sm">For my college</span>
                </button>
              </div>
            </div>
            
          </div>
          <div className="bg-green-100 rounded-lg p-3 my-3 flex items-center justify-center">
              <span className="font-medium italic text-lg text-green-800 animate-fadeIn">"From Confusion to Crystal Clear Career with UntraddCareer"</span>
           </div>
        </section>
        
        {/* USP Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-8 flex items-center justify-center">
              <Award size={24} className="mr-2" />
              Why Choose UntraddCareer?
            </h2>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award size={32} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-700 mb-2">World-Class Faculty</h3>
                <p className="text-slate-600">Top 0.1% domain experts from IIT, IIM, Cambridge, Amazon, Microsoft, SAP Labs, and leading tech companies</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-700 mb-2">100% Result Guarantee</h3>
                <p className="text-slate-600">Complete refund if not satisfied with the program outcomes</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp size={32} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-purple-700 mb-2">Career Assurance</h3>
                <p className="text-slate-600">100% domain expertise guarantee with personalized mentorship to follow your passion</p>
              </div>
            </div>

            {/* Expert Profiles */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center justify-center">
                <Users size={24} className="mr-2" />
                Meet Our Expert Faculty
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
                <p className="text-blue-700 font-medium">
                  Our instructors represent the <span className="font-bold text-blue-800">top 0.01%</span> of world geniuses in their respective domains
                </p>
              </div>
              
              <div className="relative overflow-hidden">
                <div className="overflow-x-hidden">
                  <div className="flex space-x-6 animate-scroll-slow" style={{ minWidth: 'max-content' }}>
                    {/* Faculty profiles */}
                    {[
                      {
                        name: "Kaustav Choubey",
                        role: "Analytics & Mathematics Expert",
                        credentials: "MSc, University of Cambridge",
                        experience: "Data Science, 6+ years exp.",
                        image: "https://randomuser.me/api/portraits/men/77.jpg"
                      },
                      {
                        name: "Tarun Jain",
                        role: "Full Stack Developer",
                        credentials: "Senior Developer, SAP Labs",
                        experience: "Vibe Coder, 5+ years exp.",
                        image: tarunImage
                      },
                      {
                        name: "Chetan Verma",
                        role: "AI/ML Enthusiast",
                        credentials: "Microsoft",
                        experience: "4+ years exp.",
                        image: chetanImage
                      },
                      {
                        name: "Sai Krishnan",
                        role: "AI/ML Expert",
                        credentials: "MS, Northeastern University",
                        experience: "Ex-IBM, 5+ years exp.",
                        useIcon: true
                      },
                      {
                        name: "Krishna Bajpai",
                        role: "Business & Entrepreneurship",
                        credentials: "Founder, Posterwa",
                        experience: "7+ years exp.",
                        image: maleImage,
                        filter: "grayscale"
                      },
                      {
                        name: "Smruti Kumari",
                        role: "UI/UX Designer",
                        credentials: "Freelance Design Consultant",
                        experience: "5+ years exp.",
                        image: nehaImage
                      },
                      {
                        name: "Bibhu Ranjan",
                        role: "Product Management",
                        credentials: "Ex Blackline, Ieltsappeal",
                        experience: "5+ years exp.",
                        image: bibhuImage
                      },
                      {
                        name: "Arju Swami",
                        role: "Psychology and Biotechnology",
                        credentials: "PhD, IIT BHU",
                        experience: "4+ years exp.",
                        image: arjuImage
                      },
                      {
                        name: "Priya Sharma",
                        role: "Cloud Architecture & DevOps",
                        credentials: "MTech, IIT Delhi",
                        experience: "Ex-Microsoft, 6+ years exp.",
                        image: priyaImage
                      },
                      {
                        name: "Vikram Singh",
                        role: "Cybersecurity Expert",
                        credentials: "CISSP, CEH Certified",
                        experience: "Ex-Deloitte, 8+ years exp.",
                        image: vikramImage
                      },
                      {
                        name: "Neha Gupta",
                        role: "UI/UX with AI",
                        credentials: "Design Lead, Figma Expert",
                        experience: "Ex-Adobe, 5+ years exp.",
                        image: nehaGuptaImage
                      },
                      {
                        name: "Rahul Verma",
                        role: "Digital Marketing",
                        credentials: "MBA, IIM Ahmedabad",
                        experience: "Marketing Director, 7+ years exp.",
                        image: rahulImage
                      }
                    ].map((expert, idx) => (
                      <div key={idx} className="bg-white rounded-lg shadow-lg p-6 flex-shrink-0" style={{ width: '280px' }}>
                        <div className="flex items-center mb-4">
                          {expert.useIcon ? (
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <User size={30} className="text-blue-600" />
                            </div>
                          ) : (
                              <img
                                src={expert.image}
                                alt={expert.name}
                                className="w-16 h-16 rounded-full mr-4 object-cover"
                                style={{ filter: expert.filter ? "grayscale(100%)" : "none" }}
                              />
                          )}
                          <div>
                            <h4 className="font-bold text-blue-700">{expert.name}</h4>
                            <p className="text-sm text-blue-600">{expert.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600 flex items-center">
                            <Award size={16} className="mr-2" />
                            {expert.credentials}
                          </p>
                          <p className="text-sm text-slate-600 flex items-center">
                            <Briefcase size={16} className="mr-2" />
                            {expert.experience}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* More Experts Indicator */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 flex-shrink-0 flex flex-col items-center justify-center" style={{ width: '280px' }}>
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 shadow-md">
                        <Users size={30} className="text-blue-600" />
                      </div>
                      <h4 className="font-bold text-blue-700 text-center mb-1">And Many More...</h4>
                      <p className="text-sm text-slate-600 text-center">
                        Our faculty includes 40+ industry experts across all domains
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white to-transparent w-12 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white to-transparent w-12 pointer-events-none"></div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: <MessageCircle size={20} />,
                  title: "1:1 Feedback",
                  desc: "Personal attention & improvement tracking"
                },
                {
                  icon: <Rocket size={20} />,
                  title: "Industry Projects",
                  desc: "Real-world project experience"
                },
                {
                  icon: <Star size={20} />,
                  title: "Premium Content",
                  desc: "World-class curriculum & resources"
                },
                {
                  icon: <Users size={20} />,
                  title: "Expert Network",
                  desc: "Connect with industry leaders"
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <MessageCircle size={24} className="mr-2" />
              Success Stories from Our Students
            </h2>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
              <p className="text-blue-700 font-medium">
                From tier-3 colleges to top companies — our program has transformed <span className="font-bold">100s of</span> student careers
              </p>
            </div>
            
            <div className="relative overflow-hidden">
              <div className="overflow-x-hidden">
                <div className="flex space-x-6 animate-scroll-slow" style={{ minWidth: 'max-content' }}>
                  {[
                    {
                      name: "Princy",
                      role: "Marketing and Branding",
                      company: "Cosmos Digital",
                      background: "Tier-3 College Graduate",
                      useIcon: true,
                      quote: "Coming from a tier-3 college, I had minimal exposure to industry trends. UntraddCareer helped me build practical marketing skills that employers actually want. Within 3 months of completing the program, I secured a role at Cosmos Digital with a package I couldn't have imagined before."
                    },
                    {
                      name: "Prajwal",
                      role: "AI & Full Stack Developer",
                      company: "Cosmos Innovation",
                      background: "Non-CS Background",
                      useIcon: true,
                      quote: "The expert trainers at UntraddCareer are actually working professionals who taught us exactly what's needed in the industry right now. The AI and full stack modules were so practical that I was contributing to real projects during my internship from day one."
                    },
                    {
                      name: "Roushan Aggarwal",
                      role: "Full Stack Intern",
                      company: "IeltsAppeal Education",
                      background: "BBA Graduate",
                      useIcon: true,
                      quote: "Despite having zero coding experience, the structured training helped me transition from BBA to tech. UntraddCareer's program focuses only on what's relevant in the job market, not theoretical concepts. My internship converted to a full-time role within 2 months!"
                    },
                    {
                      name: "Kushal Singh",
                      role: "Digital Marketing Specialist",
                      company: "Freelancer",
                      background: "Recent Graduate",
                      useIcon: true,
                      quote: "The program's focus on freelancing skills alongside corporate training gave me the confidence to start my own client business. Now I work with multiple brands and earn more than my peers in traditional jobs, all while enjoying work flexibility."
                    },
                    {
                      name: "Chetan Verma",
                      role: "AI/ML Intern",
                      company: "IeltsAppeal",
                      background: "Tier-3 Engineering College",
                      useIcon: true,
                      quote: "The AI/ML curriculum is cutting-edge and industry-aligned. I went from struggling with basic concepts to implementing advanced models within months. The 1:1 mentorship from experts working at top tech companies made all the difference."
                    },
                    {
                      name: "Rahul Sharma",
                      role: "Entrepreneur",
                      company: "TechSprint Solutions",
                      background: "College Dropout",
                      useIcon: true,
                      quote: "I dropped out of college due to financial constraints. UntraddCareer not only trained me technically but also instilled the confidence to start my own venture. Their entrepreneurship modules and mentor support helped me launch my startup that now employs 5 people!"
                    }
                  ].map((testimonial, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 shadow-sm flex-shrink-0" style={{ width: '280px', maxHeight: '220px', overflow: 'auto' }}>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-700 text-sm">{testimonial.name}</h3>
                          <p className="text-xs text-blue-600">{testimonial.role} at {testimonial.company}</p>
                          <p className="text-xs text-slate-500">{testimonial.background}</p>
                        </div>
                      </div>
                      
                      <p className="italic text-slate-700 text-xs line-clamp-5">"{testimonial.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white to-transparent w-12 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white to-transparent w-12 pointer-events-none"></div>
            </div>
            
            
          </div>
        </section>
        
        {/* Program Options Section */}
        <ProgramOptions openWhatsApp={openWhatsApp} />
        
        {/* Interactive Student Journey */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <Compass size={24} className="mr-2" />
              Student Journey Roadmap
            </h2>
            
            {/* Interactive Instruction */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-center justify-center">
              <Zap size={20} className="text-blue-600 mr-2 animate-pulse" />
              <p className="text-blue-700 font-medium">Click on each phase below to explore detailed information</p>
            </div>
            
            {/* Timeline Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
              {phases.map(phase => (
                <button 
                  key={phase.id}
                  className={`px-4 py-2 rounded-full flex items-center transition-all transform hover:scale-105 ${
                    activePhase === phase.id 
                      ? 'bg-blue-600 text-white shadow-md scale-105' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${
                    activePhase === phase.id ? 'bg-white text-blue-700' : 'bg-white text-slate-600'
                  }`}>
                    {phase.id}
                  </span>
                  <span className="hidden md:inline">{phase.title}</span>
                </button>
              ))}
            </div>
            
            {/* Active Phase Content */}
            <div className="bg-blue-50 rounded-xl p-6">
              {phases.map(phase => (
                <div 
                  key={phase.id} 
                  className={`transition-all duration-300 ${
                    activePhase === phase.id ? 'opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="md:w-1/3">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md mb-4">
                        <div className="text-blue-600">
                          {phase.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-blue-700 mb-2">{phase.title}</h3>
                      <p className="text-blue-600 font-medium mb-4">{phase.goal}</p>
                      <p className="text-slate-600 mb-4">{phase.description}</p>
                    </div>
                    
                    <div className="md:w-2/3 bg-white rounded-lg p-6 shadow-sm">
                      {phase.modules && (
                        <div className="mb-6">
                          <h4 className="font-bold text-blue-700 mb-4">Training Modules</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {phase.modules.map((module, idx) => (
                              <div key={idx} className="bg-slate-50 rounded-lg p-3">
                                <div className="font-medium text-blue-700">{module.name}</div>
                                <div className="text-sm text-slate-600">{module.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {phase.domains && (
                        <div className="mb-6">
                          <h4 className="font-bold text-blue-700 mb-4">AI-Proof Career Domains</h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.domains.map((domain, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {domain}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {phase.benefits && (
                        <div className="mb-6">
                          <h4 className="font-bold text-blue-700 mb-4">Key Benefits</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {phase.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center">
                                <CheckCircle size={16} className="text-green-600 mr-2" />
                                <span className="text-slate-600">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {phase.perks && (
                        <div>
                          <h4 className="font-bold text-blue-700 mb-4">Additional Perks</h4>
                          <div className="flex flex-wrap gap-3">
                            {phase.perks.map((perk, idx) => (
                              <div key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                                <Star size={14} className="mr-1" />
                                {perk}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {phase.details && (
                        <div className="mb-6">
                          <h4 className="font-bold text-blue-700 mb-4">Program Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {phase.details.map((detail, idx) => (
                              <div key={idx} className="flex items-center">
                                <CheckCircle size={16} className="text-green-600 mr-2" />
                                <span className="text-slate-600">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Foundation Training */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <BookOpen size={24} className="mr-2" />
              Comprehensive Foundation Training
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-blue-700 border-b">Module</th>
                    <th className="py-3 px-4 text-left font-semibold text-blue-700 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Star size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Personality Development</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">Confidence, grooming, presentation, body language</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <CheckCircle size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Work Ethics & Behavior</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">Professional mindset, discipline, growth orientation</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <MessageCircle size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">English & Communication</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">Writing, speaking, business English, presentation</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Filter size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Problem Solving & Aptitude</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">Logical reasoning, numerical aptitude, GATE-style prep</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Zap size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Prompt Engineering & AI Tools</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">ChatGPT, Midjourney, Copilot, practical AI use</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Resume Building & LinkedIn</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">ATS-friendly resume creation, keyword optimization, personal branding, portfolios, digital identity</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Code size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Coding Basics & Spider Legs</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">Foundation for logic, branching, loops, modular learning</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <TrendingUp size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium">Mock Interviews</span>
                    </td>
                    <td className="py-3 px-4 border-b text-slate-600">HR + Technical rounds practice with feedback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Weekly Add-ons */}
        {/* <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <Calendar size={24} className="mr-2" />
              Weekly Program Enhancements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklyAddons.map((item, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-5 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <div className="text-blue-600">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700">{item.name}</h3>
                    <p className="text-sm text-slate-600">Regular engagement to enhance learning</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        
       
        


        {/* Eligibility Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <Users size={24} className="mr-2" />
              Eligibility & Target Students
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">Target Departments (Pilot Phase)</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle size={18} className="text-green-600 mr-2" />
                    <span>BCA</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={18} className="text-green-600 mr-2" />
                    <span>MCA</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={18} className="text-green-600 mr-2" />
                    <span>B.Com</span>
                  </li>
                   <li className="flex items-center">
                    <CheckCircle size={18} className="text-green-600 mr-2" />
                    <span>BBA</span>
                  </li>
                </ul>
                
                <div className="mt-4 bg-blue-100 rounded-lg p-3">
                  <p className="flex items-center text-blue-700">
                    <Laptop size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                    <span>You just need a laptop, and we'll take care of the rest!</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">Student Benefits by Year</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-medium text-blue-700">First/Second Year</h4>
                    <p className="text-sm text-slate-600">Early career clarity, longer internship duration, earning while studying</p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-medium text-blue-700">Pre-Final Year</h4>
                    <p className="text-sm text-slate-600">Strategic advantage in placements, industry-readiness</p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-medium text-blue-700">Final Year/Last Semester</h4>
                    <p className="text-sm text-slate-600">Accelerated internship placement, immediate industry integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Delivery Mode */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <Zap size={24} className="mr-2" />
              Hybrid Program Delivery
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
                  <Code size={20} className="mr-2" />
                  Online Components
                </h3>
                <ul className="space-y-3">
                  {[
                    "Live online training sessions by industry experts",
                    "1:1 Career Consultation with every student",
                    "Domain-specific technical training",
                    "Weekly industry expert talks",
                    "Career consultation and orientation",
                    "Progress tracking via proprietary application"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle size={18} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
                  <Users size={20} className="mr-2" />
                  Offline/College Components
                </h3>
                <ul className="space-y-3">
                  {[
                    "1 Month in Office Internship",
                    "Faculty supervision and mentoring",
                    "Selected foundation modules by college professors",
                    "Weekly progress reviews",
                    "Physical space for group projects",
                    "Computer lab sessions for practical exercises"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle size={18} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Program Roadmap */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <TrendingUp size={24} className="mr-2" />
              Detailed Program Roadmap
            </h2>
            
    



              {/* Monthly Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">Monthly Timeline</h3>
                <div className="space-y-4">
                  {[
                    { month: "Month 1", desc: "Orientation & Foundation Training", color: "bg-green-100 text-green-700" },
                    { month: "Month 2", desc: "Domain Selection & Live Training", color: "bg-yellow-100 text-yellow-700" },
                    { month: "Month 3", desc: "Advanced Training & Interview Prep", color: "bg-orange-100 text-orange-700" },
                    { month: "Month 4", desc: "Internship Placement Begins", color: "bg-red-100 text-red-700" },
                    { month: "Month 5", desc: "Internship & Job Support", color: "bg-purple-100 text-purple-700" },
                    { month: "Month 6", desc: "Certification & Portfolio", color: "bg-blue-100 text-blue-700" }
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center ${item.color} rounded-lg p-3`}>
                      <span className="font-bold mr-4">{item.month}</span>
                      <span>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          
        </section>

        {/* Career Assurance Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Career, Our Commitment</h2>
            
            <div className="text-center mb-8">
              <p className="text-xl font-bold italic bg-white/10 inline-block px-4 py-2 rounded-full">
                "We don't just train you, we future-proof you."
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-5 text-center hover:bg-white/20 transition-all">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Compass size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Find Your Ikigai</h3>
                <p className="text-sm">When passion meets purpose, AI can't compete. We'll help you find that sweet spot.</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-5 text-center hover:bg-white/20 transition-all">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI-Proof Career</h3>
                <p className="text-sm">In a world where AI replaces jobs, be the irreplaceable human that directs the AI.</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-5 text-center hover:bg-white/20 transition-all">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Rocket size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Self-Sufficient</h3>
                <p className="text-sm">We don't create employees. We create entrepreneurs of their own careers.</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-5 text-center mt-6 max-w-2xl mx-auto">
              <p className="font-medium">Once you're with us, your success is non-negotiable. Your career becomes our mission.</p>
            </div>
            
            <div className="text-center mt-6">
              <button 
                onClick={() => openWhatsApp("Hi, I want to become future-proof with UntraddCareer. How can I get started?")}
                className="bg-white text-blue-700 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <MessageSquare size={18} />
                Become Irreplaceable
              </button>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
              <TrendingUp size={24} className="mr-2" />
              Next Steps
            </h2>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 rounded-full p-1">
                <button 
                  onClick={() => setActiveTab('individual')}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeTab === 'individual' 
                      ? 'bg-white text-blue-700' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  For Individuals
                </button>
                <button 
                  onClick={() => setActiveTab('college')}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeTab === 'college' 
                      ? 'bg-white text-blue-700' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  For Colleges
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === 'individual' ? [
                {
                  icon: <Calendar size={24} />,
                  title: "Book Free Counseling",
                  desc: "One-on-one session to discuss your career goals and opportunities"
                },
                {
                  icon: <Users size={24} />,
                  title: "Career Assessment",
                  desc: "Evaluate your strengths and choose the right domain"
                },
                {
                  icon: <FileText size={24} />,
                  title: "Enrollment Process",
                  desc: "Simple documentation and program registration"
                },
                {
                  icon: <Settings size={24} />,
                  title: "Program Access",
                  desc: "Get access to learning platform and study materials"
                },
                {
                  icon: <MessageCircle size={24} />,
                  title: "Meet Your Mentor",
                  desc: "Connect with your dedicated mentor and support team"
                },
                {
                  icon: <Mail size={24} />,
                  title: "Start Learning",
                  desc: "Begin your journey to a successful career"
                }
              ] : [
                {
                  icon: <Calendar size={24} />,
                  title: "Schedule Presentation",
                  desc: "Detailed walkthrough for college leadership and faculty"
                },
                {
                  icon: <Users size={24} />,
                  title: "Department Meeting",
                  desc: "Coordinate with department heads and faculty members"
                },
                {
                  icon: <FileText size={24} />,
                  title: "MOU & Documentation",
                  desc: "Review and finalize partnership agreement"
                },
                {
                  icon: <Settings size={24} />,
                  title: "Infrastructure Setup",
                  desc: "Set up systems and processes for smooth implementation"
                },
                {
                  icon: <MessageCircle size={24} />,
                  title: "Faculty Orientation",
                  desc: "Training session for college faculty and coordinators"
                },
                {
                  icon: <Mail size={24} />,
                  title: "Program Launch",
                  desc: "Kickstart the program with your first batch"
                }
              ]).map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-blue-100">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-8 text-center">
              <p className="text-blue-100">
                Contact us: contactuntradd@gmail.com | WhatsApp available 24/7
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Secure Your Future Today</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Don't let career uncertainty hold you back. Our comprehensive 6-month program with guaranteed internships gives you the edge you need in today's competitive market.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={24} className="text-white" />
                </div>
                <h3 className="font-bold mb-1">Limited Spots</h3>
                <p className="text-sm text-blue-100">Next batch starting soon with limited seats available</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Briefcase size={24} className="text-white" />
                </div>
                <h3 className="font-bold mb-1">Guaranteed Results</h3>
                <p className="text-sm text-blue-100">100% internship placement or full refund</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Award size={24} className="text-white" />
                </div>
                <h3 className="font-bold mb-1">AI-Proof Skills</h3>
                <p className="text-sm text-blue-100">Future-ready training that automation can't replace</p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto text-center">
              <button 
                onClick={() => openWhatsApp("Hi, I want to secure my future with UntraddCareer. Please help me schedule a free counseling session!")}
                className="w-full bg-white text-blue-700 font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer mb-4 shadow-lg"
                aria-label="Book a Free Counseling Session"
              >
                <Calendar size={18} />
                Book a Free Counseling Session
              </button>
              
              <p className="text-sm flex items-center justify-center gap-1 mb-2">
                <Shield size={14} className="text-blue-200" />
                <span className="text-blue-200">No obligation, cancel anytime</span>
              </p>
              
              <p className="text-center text-sm text-blue-200">
                Our career advisors typically respond within 5 minutes
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <MessageCircle size={24} className="mr-2" />
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {/* FAQ Tabs */}
              <div className="flex justify-center mb-6">
                <div className="bg-slate-100 rounded-full p-1 inline-flex">
                  <button 
                    onClick={() => setActiveTab('individual')}
                    className={`px-6 py-2 rounded-full transition-all ${
                      activeTab === 'individual' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    For Students
                  </button>
                  <button 
                    onClick={() => setActiveTab('college')}
                    className={`px-6 py-2 rounded-full transition-all ${
                      activeTab === 'college' 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    For Colleges
                  </button>
                </div>
              </div>
              
              {/* Student FAQs */}
              <div className={`space-y-2 ${activeTab === 'individual' ? 'block' : 'hidden'}`}>
                {[
                  {
                    question: "How is the internship guaranteed?",
                    answer: "We have a large network of 500+ partner companies and startups. Our curriculum is designed based on their requirements, and we maintain quality training standards that these companies trust. If for any reason we can't place you in a partner company, we offer in-house projects and startup opportunities while continuing placement efforts."
                  },
                  {
                    question: "What if I have no technical background?",
                    answer: "Our program is designed for students from all backgrounds. We start with foundational modules that build your core skills before advancing to specialized domains. Many of our successful students started with zero technical knowledge."
                  },
                  {
                    question: "How much time commitment is required?",
                    answer: "The program requires approximately a 2-3 hour daily commitment for 6 months. We offer flexible scheduling options, including weekend batches for working professionals or busy students."
                  },
                  {
                    question: "Are the internships paid?",
                    answer: "Yes, approximately 70% of our internships offer stipends ranging from ₹5,000 to ₹35,000 per month, depending on your performance and the company. The remaining positions focus on providing exceptional learning experiences with higher job conversion rates."
                  },
                  {
                    question: "What makes your program different from other courses?",
                    answer: "Unlike typical courses that only provide theoretical knowledge, we focus on holistic development with personalized mentorship, real-world projects, and guaranteed internship placement. Our comprehensive foundation training builds your personality and work ethic alongside technical skills."
                  },
                  {
                    question: "What happens after the program ends?",
                    answer: "After completing the 6-month program, you receive continued placement support, access to our alumni network, and lifetime access to updated learning resources. Many students convert their internships into full-time roles or receive placement assistance for new opportunities."
                  },
                  {
                    question: "Can I participate while still in college?",
                    answer: "Absolutely! In fact, most of our students are current college students looking to gain real-world experience alongside their academics. Our flexible schedule is designed to accommodate your college commitments. And help you earn while you learn."
                  },
                  {
                    question: "What if I'm not satisfied with the program?",
                    answer: "We implement a weekly feedback system for the first month. Students rate their satisfaction on a scale of 1-10. If your average rating is below 7 after the first 4 weeks, you're eligible for a full refund on our terms. This ensures we're accountable for delivering quality and gives you time to properly evaluate the program."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-blue-100 rounded-lg overflow-hidden">
                    <button 
                      className="w-full flex justify-between items-center py-2 px-3 bg-blue-50 text-left hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        const el = document.getElementById(`student-faq-${idx}`);
                        if (el) {
                          el.classList.toggle('hidden');
                        }
                      }}
                    >
                      <h3 className="text-sm font-medium text-blue-700">{faq.question}</h3>
                      <ChevronDown size={16} className="text-blue-600 flex-shrink-0" />
                    </button>
                    <div id={`student-faq-${idx}`} className="hidden p-3 bg-white">
                      <p className="text-xs text-slate-700">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* College FAQs */}
              <div className={`space-y-2 ${activeTab === 'college' ? 'block' : 'hidden'}`}>
                {[
                  {
                    question: "How does the college partnership model work?",
                    answer: "We integrate our program into your institution's academic calendar, working alongside your existing curriculum. We provide the training, mentorship, internship placements, and progress tracking while your college provides the infrastructure and academic oversight. This creates a seamless industry-integrated education experience for your students."
                  },
                  {
                    question: "What's the cost structure for colleges?",
                    answer: "Colleges benefit from a discounted rate of ₹12,999 per student compared to individual enrollment at ₹16,999. Additionally, we offer volume-based discounts for larger student batches. The program is typically funded through a combination of college investment and student fees, with various models available to fit your institution's budget requirements."
                  },
                  {
                    question: "How does this improve our college placement metrics?",
                    answer: "Partner colleges experience an average 85% increase in placement rates within the first implemented batch. Our guaranteed internship model ensures every participating student gains industry experience, and approximately 80% of these internships convert to full-time offers or lead to other job opportunities through our network."
                  },
                  {
                    question: "Is there any burden on our faculty?",
                    answer: "No, our program requires minimal faculty involvement. We bring our own expert trainers and mentors for all specialized domains. However, we do offer faculty development programs to help your professors stay updated with industry trends and potentially participate in the program if interested."
                  },
                  {
                    question: "Can we customize the program for our college's specific needs?",
                    answer: "Yes, we offer customization options for college partnerships. We can adjust the curriculum focus based on your students' backgrounds and departmental requirements. We also provide specialized programs for specific departments like BCA, MCA, B.Com, and BBA with domain-relevant training."
                  },
                  {
                    question: "How do you handle program implementation and logistics?",
                    answer: "We provide a dedicated program coordinator for each college partnership who handles all implementation details. Our team manages scheduling, student onboarding, training sessions, mentor assignments, and internship placements. We also provide regular reports on student progress and outcomes for college administration."
                  },
                  {
                    question: "What infrastructure do we need to provide?",
                    answer: "The program is designed to be lightweight on infrastructure requirements. All you need is a standard classroom with internet connectivity for the offline components, and students need their own laptops. Most of our training happens online, with periodic in-person sessions that can be scheduled according to classroom availability."
                  },
                  {
                    question: "How do you measure and demonstrate program success?",
                    answer: "We provide comprehensive analytics including student performance metrics, skills development tracking, internship conversion rates, employer feedback, and post-program employment outcomes. These reports help quantify the program's impact on student outcomes and allow for continuous improvement based on data."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-green-100 rounded-lg overflow-hidden">
                    <button 
                      className="w-full flex justify-between items-center py-2 px-3 bg-green-50 text-left hover:bg-green-100 transition-colors"
                      onClick={() => {
                        const el = document.getElementById(`college-faq-${idx}`);
                        if (el) {
                          el.classList.toggle('hidden');
                        }
                      }}
                    >
                      <h3 className="text-sm font-medium text-green-700">{faq.question}</h3>
                      <ChevronDown size={16} className="text-green-600 flex-shrink-0" />
                    </button>
                    <div id={`college-faq-${idx}`} className="hidden p-3 bg-white">
                      <p className="text-xs text-slate-700">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 bg-blue-100 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-center text-blue-700">
                Have more questions? <button 
                  onClick={() => openWhatsApp("Hi, I have some questions about the UntraddCareer program.")}
                  className="font-medium text-blue-600 underline hover:text-blue-800 cursor-pointer"
                >
                  Chat with our counselors
                </button> for immediate assistance.
              </p>
            </div>
          </div>
        </section>
       
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Compass className="text-blue-400 mr-2" size={24} />
              <span className="font-bold text-lg">UntraddCareer</span>
            </div>
            <div className="text-slate-400 text-sm">
              Training • Internships • Career Acceleration
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-6 pt-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <button 
                onClick={() => openModal('about')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button 
                onClick={() => openModal('contact')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <button 
                onClick={() => openModal('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => openModal('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => openModal('disclaimer')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Disclaimer
              </button>
            </div>
            <div className="text-center mt-6 text-xs text-slate-500">
              © {new Date().getFullYear()} UntraddCareer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={closeModal} 
        title="About UntraddCareer"
      >
        <AboutUs />
      </Modal>
      
      <Modal 
        isOpen={activeModal === 'contact'} 
        onClose={closeModal} 
        title="Contact Us"
      >
        <ContactUs />
      </Modal>
      
      <Modal 
        isOpen={activeModal === 'terms'} 
        onClose={closeModal} 
        title="Terms & Conditions"
      >
        <TermsConditions />
      </Modal>
      
      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={closeModal} 
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </Modal>
      
      <Modal 
        isOpen={activeModal === 'disclaimer'} 
        onClose={closeModal} 
        title="Disclaimer"
      >
        <Disclaimer />
      </Modal>
      
      <GlobalStyle />

    </div>
  );
}
