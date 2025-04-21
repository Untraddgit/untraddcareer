import  { useState, useEffect } from 'react';
import { BookOpen, Compass, Award, Rocket, Calendar, Users, Filter, Code, Briefcase, CheckCircle, TrendingUp, Star, MessageCircle, Zap, FileText, Settings, Mail, MessageSquare, Shield } from 'lucide-react';
import { createGlobalStyle } from 'styled-components';

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

  useEffect(() => {
    const startCount = 1500;
    const endCount = 2300;
    const duration = 3000;
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
  
  const foundations = [
    { name: "Personality Development", icon: <Star size={20} /> },
    { name: "Work Ethics & Behavior", icon: <CheckCircle size={20} /> },
    { name: "English Communication", icon: <MessageCircle size={20} /> },
    { name: "Problem Solving & Aptitude", icon: <Filter size={20} /> },
    { name: "AI Tools & Prompting", icon: <Zap size={20} /> },
    { name: "Resume Building", icon: <BookOpen size={20} /> },
    { name: "Coding Basics", icon: <Code size={20} /> },
    { name: "Spider Leg Management", icon: <TrendingUp size={20} /> }
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
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Compass className="text-blue-600 mr-2" size={32} />
              <h1 className="text-2xl font-bold text-blue-700">UntraddCareer</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-lg p-4 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold text-blue-700 mb-4">
                Training with Guaranteed Internship Program
              </h1>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Grab a seat before it's too late
              </h2>
              
              <p className="text-lg text-slate-600 mb-6">
                Our comprehensive program transforms students into industry-ready professionals through structured training and guaranteed paid internships.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Calendar size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Career Counseling with Experts</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Briefcase size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Guaranteed Internship (WFH + Remote)</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Award size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Industry Certification</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Rocket  size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">AI Proof- Future Secured Jobs</span>
                </div>
              </div>
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
              <div className="flex gap-3 w-full max-w-xs">
                <button 
                  onClick={() => openWhatsApp("Hi, I'm interested in enrolling as an individual in the UntraddCareer program.")}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Enroll as Individual"
                >
                  <MessageSquare size={16} />
                  I Want It
                </button>
                <button 
                  onClick={() => openWhatsApp("Hi, I'm interested in partnering with UntraddCareer for our college.")}
                  className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Partner as College"
                >
                  <MessageSquare size={16} />
                  College Invitation
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Take It Now Section */}
        <section id="take-it-now" className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center justify-center">
              <Star size={24} className="mr-2" />
              Choose Your Program Option
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Individual Option */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 relative overflow-hidden pt-14">
                <div className="absolute top-0 right-0 left-0 px-6 py-2 flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm shadow-sm">
                    Individual Plan
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-blue-700 mb-2 text-center">Join as Individual</h3>
                <div className="text-3xl font-bold text-blue-800 mb-4 text-center">
                  ₹16,999
                  <span className="text-sm font-normal text-blue-600 ml-2">one-time</span>
                </div>
                
                <div className="mb-6 bg-blue-200/50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-700 text-center mb-3 text-base">Internship Outcomes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-blue-700">80%+</div>
                      <div className="text-sm text-slate-600">Internship-to-Job Conversion</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-blue-700">100%</div>
                      <div className="text-sm text-slate-600">Career Confusion solution</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-blue-700">35%</div>
                      <div className="text-sm text-slate-600">Start Own Ventures</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-blue-700">9/10</div>
                      <div className="text-sm text-slate-600">Satisfaction Score</div>
                    </div>
                  </div>
                </div>

                
                <div className="bg-green-100/50 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-green-700 text-center mb-2">Your Career, Secured</h4>
                  <p className="text-sm text-center text-slate-700 mb-2">
                    With our training and guidance, you never stay unemployed
                  </p>
                  <div className="flex justify-center">
                    <div className="text-sm text-center bg-white rounded-full px-2 py-1 text-green-700 mb-2 inline-block">
                      <span className="font-bold">Beyond Employment:</span> You become a job creator
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {[
                    "Personal career counseling",
                    "1:1 mentorship",
                    "Flexible learning schedule",
                    "Direct internship placement",
                    "Lifetime access to resources",
                    "Access to alumni network",
                    "Entrepreneurship guidance",
                    "Freelancing skill development"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600 mr-2" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => openWhatsApp("Hi, I want to enroll in the Individual Plan (₹16,999). Please guide me through the process.")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Chat to Enroll Now
                </button>
              </div>

              {/* College Option */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 relative overflow-hidden pt-14">
                <div className="absolute top-0 right-0 left-0 px-6 py-2 flex justify-end">
                  <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm shadow-sm">
                    Recommended for Colleges
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-green-700 mb-2">Partner Through College</h3>
                <div className="text-3xl font-bold text-green-800 mb-4">
                  ₹12,999
                  <span className="text-sm font-normal text-green-600 ml-2">per student</span>
                </div>

                <div className="bg-white rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-green-800 mb-3 text-base text-center">Why Colleges Choose Us:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-700">85%</div>
                      <div className="text-sm text-slate-600">Placement Rate Increase</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-700">40%</div>
                      <div className="text-sm text-slate-600">Higher Package Offers</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-700">100%</div>
                      <div className="text-sm text-slate-600">Risk-Free Implementation</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-700">3x</div>
                      <div className="text-sm text-slate-600">Admission Inquiries</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 text-center">
                  <h4 className="font-bold text-xl text-green-800">College Benefits:</h4>
                  <ul className="space-y-3">
                    {[
                      {
                        title: "Enhanced Placement Metrics",
                        desc: "85% increase in placement rates within first batch"
                      },
                      {
                        title: "Zero Risk Implementation",
                        desc: "No infrastructure cost, no faculty burden"
                      },
                      {
                        title: "Trust Building",
                        desc: "Improved reputation among parents & students"
                      },
                      {
                        title: "Pioneer Status",
                        desc: "Be recognized as an industry-integrated institution"
                      },
                      {
                        title: "Data-Driven Insights",
                        desc: "Access to placement analytics and industry trends"
                      },
                      {
                        title: "Faculty Development",
                        desc: "Training programs for college professors"
                      }
                    ].map((benefit, idx) => (
                      <li key={idx} className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center mb-1">
                          <CheckCircle size={16} className="text-green-600 mr-2" />
                          <div className="font-medium text-green-800">{benefit.title}</div>
                        </div>
                        <div className="text-sm text-slate-600">{benefit.desc}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-700/10 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-green-800 mb-2">Trusted By Leading Institutions</h4>
                  <div className="text-sm text-slate-600">
                    Join our network of partner colleges achieving exceptional placement results
                  </div>
                </div>

                <button 
                  onClick={() => openWhatsApp("Hi, I want to explore the College Partnership Program (₹12,999/student). Please provide more details.")}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Chat to Partner With Us
                </button>
                
                <p className="text-center text-sm text-green-700 mt-3">
                  Limited partnerships available for 2025 batch
                </p>
              </div>
            </div>
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
                <p className="text-slate-600">Top 0.1% domain experts from IIT, IIM, Harvard, and leading tech companies</p>
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
                  Our instructors represent the <span className="font-bold text-blue-800">top 0.1%</span> of world geniuses in their respective domains
                </p>
              </div>
              
              <div className="relative">
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                  <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
                    {[
                      {
                        name: "Kaustav Choubey",
                        role: "Analytics & Mathematics Expert",
                        credentials: "MSc, University of Cambridge",
                        experience: "Data Science, 6+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/46.jpg"
                      },
                      {
                        name: "Tarun Jain",
                        role: "Full Stack Developer",
                        credentials: "Senior Developer, SAP Labs",
                        experience: "Vibe Coder, 5+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/52.jpg"
                      },
                      {
                        name: "Chetan Verma",
                        role: "AI/ML Enthusiast",
                        credentials: "Microsoft",
                        experience: "4+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/33.jpg"
                      },
                      {
                        name: "Sai Krishnan",
                        role: "AI/ML Expert",
                        credentials: "MS, Northeastern University",
                        experience: "Ex-IBM, 5+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/38.jpg"
                      },
                      {
                        name: "Krishna Bajpai",
                        role: "Business & Entrepreneurship",
                        credentials: "Founder, Posterwa",
                        experience: "7+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/41.jpg"
                      },
                      {
                        name: "Smruti Kumari",
                        role: "UI/UX Designer",
                        credentials: "Freelance Design Consultant",
                        experience: "5+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/female/25.jpg"
                      },
                      {
                        name: "Bibhu Ranjan",
                        role: "Product Management",
                        credentials: "Ex Blackline, Ieltsappeal",
                        experience: "5+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/35.jpg"
                      },
                      {
                        name: "Arju Swami",
                        role: "Psychology and Biotechnology",
                        credentials: "PhD, IIT BHU",
                        experience: "4+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/female/32.jpg"
                      },
                      {
                        name: "Priya Sharma",
                        role: "Cloud Architecture & DevOps",
                        credentials: "MTech, IIT Delhi",
                        experience: "Ex-Microsoft, 6+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/female/22.jpg"
                      },
                      {
                        name: "Vikram Singh",
                        role: "Cybersecurity Expert",
                        credentials: "CISSP, CEH Certified",
                        experience: "Ex-Deloitte, 8+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/56.jpg"
                      },
                      {
                        name: "Neha Gupta",
                        role: "UI/UX with AI",
                        credentials: "Design Lead, Figma Expert",
                        experience: "Ex-Adobe, 5+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/female/42.jpg"
                      },
                      {
                        name: "Rahul Verma",
                        role: "Digital Marketing",
                        credentials: "MBA, IIM Ahmedabad",
                        experience: "Marketing Director, 7+ years exp.",
                        image: "https://xsgames.co/randomusers/assets/avatars/male/62.jpg"
                      }
                    ].map((expert, idx) => (
                      <div key={idx} className="bg-white rounded-lg shadow-lg p-6 flex-shrink-0" style={{ width: '300px' }}>
                        <div className="flex items-center mb-4">
                          <img
                            src={expert.image}
                            alt={expert.name}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                          />
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
                  </div>
                </div>
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white to-transparent w-8 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white to-transparent w-8 pointer-events-none"></div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {foundations.map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 shadow-sm flex items-start">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <div className="text-blue-600">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">{item.name}</h3>
                  </div>
                </div>
              ))}
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
                </ul>
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
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Transform Your Outcomes?</h2>
              <p className="text-blue-100">We have the only course which has comprehensive training and guaranteed internship for a future proof career</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <button 
                  onClick={() => openWhatsApp("Hi, I want to secure my future with UntraddCareer. Please help me get started!")}
                  className="w-full bg-white text-blue-700 font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Start Chat"
                >
                  <MessageSquare size={18} />
                  Chat to Get Started
                </button>
                <p className="text-center text-sm text-blue-200">
                  Our career advisors typically respond within 5 minutes
                </p>
              </div>
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
        </div>
      </footer>
      
      <GlobalStyle />

    </div>
  );
}
