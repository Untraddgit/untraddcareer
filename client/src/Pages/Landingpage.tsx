import  { useState } from 'react';
import { BookOpen, Compass, Award, Calendar, Users, Filter, Code, Briefcase, CheckCircle, TrendingUp, Star, BarChart, MessageCircle, Zap } from 'lucide-react';

export default function StudentJourneyRoadmap() {
  const [activePhase, setActivePhase] = useState(1);
  
  const phases = [
    {
      id: 1,
      title: "Initial Orientation",
      icon: <Compass size={24} />,
      description: "Students begin with a comprehensive overview of the program, career paths, and industry landscape.",
      benefits: ["Career path exploration", "Program overview", "Industry insights"]
    },
    {
      id: 2,
      title: "1:1 Consultation",
      icon: <MessageCircle size={24} />,
      description: "Personalized sessions with career advisors to assess skills, interests, and optimal career paths.",
      benefits: ["Personalized guidance", "Skill assessment", "Career mapping"]
    },
    {
      id: 3,
      title: "Course Selection",
      icon: <Filter size={24} />,
      description: "Students select their domain specialization based on consultation and interest (Web Dev, AI, DevOps, etc).",
      benefits: ["Domain selection", "Specialization focus", "Personalized learning path"]
    },
    {
      id: 4,
      title: "Domain Orientation",
      icon: <BookOpen size={24} />,
      description: "Focused introduction to their chosen specialization with roadmap and expectations.",
      benefits: ["Domain introduction", "Technology stack overview", "Learning roadmap"]
    },
    {
      id: 5,
      title: "Foundation Training",
      icon: <Code size={24} />,
      description: "Core skills development across essential professional competencies.",
      benefits: ["Soft skills", "Technical foundations", "Industry readiness"]
    },
    {
      id: 6,
      title: "Specialized Training",
      icon: <Zap size={24} />,
      description: "Intensive domain-specific training with live projects guided by industry experts.",
      benefits: ["Hands-on experience", "Industry projects", "Expert mentorship"]
    },
    {
      id: 7, 
      title: "Internship Placement",
      icon: <Briefcase size={24} />,
      description: "Guaranteed paid internship placement with partner companies beginning from month 4.",
      benefits: ["Real work experience", "Industry networking", "Professional portfolio"]
    },
    {
      id: 8,
      title: "Certification",
      icon: <Award size={24} />,
      description: "Students receive 6-month industry certification validating their skills and experience.",
      benefits: ["Industry recognition", "Resume enhancement", "Career advancement"]
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
  
  const weeklyAddons = [
    { name: "Expert Speaker Sessions", icon: <Users size={20} /> },
    { name: "Industry Updates Live", icon: <TrendingUp size={20} /> },
    { name: "Progress Tracking Dashboard", icon: <BarChart size={20} /> },
    { name: "Mock Interviews", icon: <MessageCircle size={20} /> }
  ];
  
  const collegeAdvantages = [
    "Enhanced placement rates",
    "Increased student satisfaction",
    "Industry-aligned curriculum",
    "Pioneer in placement-driven education",
    "No implementation effort required",
    "Revenue sharing opportunities",
    "Improved college reputation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Compass className="text-blue-600 mr-2" size={32} />
              <h1 className="text-2xl font-bold text-blue-700">CareerLaunch</h1>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-medium">Training & Guaranteed Internship Program</h2>
              <p className="text-slate-500 text-sm">Industry-Aligned Skill Development</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-700 mb-4">
                Bridging the Gap Between Education and Industry
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Our comprehensive program transforms students into industry-ready professionals through structured training and guaranteed paid internships.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Calendar size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">6-Month Program</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Briefcase size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Guaranteed Internship</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                  <Award size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Industry Certification</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative h-64 w-64 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-dashed border-blue-300 rounded-full animate-spin-slow"></div>
                <div className="bg-white h-48 w-48 rounded-full shadow-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <TrendingUp size={32} className="text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-blue-700">Future-Ready Skills</p>
                    <p className="text-sm text-slate-500">Industry-Aligned Training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Interactive Student Journey */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <Compass size={24} className="mr-2" />
              Student Journey Roadmap
            </h2>
            
            {/* Timeline Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
              {phases.map(phase => (
                <button 
                  key={phase.id}
                  className={`px-4 py-2 rounded-full flex items-center transition-all ${
                    activePhase === phase.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2 text-xs font-bold text-blue-700">
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
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                      <div className="text-blue-600">
                        {phase.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-700 mb-2">{phase.title}</h3>
                      <p className="text-slate-600 mb-4">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.benefits.map((benefit, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm text-blue-600 shadow-sm">
                            {benefit}
                          </span>
                        ))}
                      </div>
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
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
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
        <section className="mb-12">
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
        </section>
        
        {/* College Benefits */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <Award size={24} className="mr-2" />
              Benefits for Your College
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collegeAdvantages.map((benefit, idx) => (
                <div key={idx} className="bg-green-50 rounded-lg p-4 flex items-center">
                  <CheckCircle size={18} className="text-green-600 mr-2" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Transform Student Outcomes?</h2>
              <p className="text-blue-100">Partner with us to provide industry-aligned training and guaranteed internships</p>
            </div>
            
            <div className="max-w-md mx-auto bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Partnership Model</h3>
                    <p className="text-xs text-blue-100">Revenue-sharing opportunity</p>
                  </div>
                </div>
                <div className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Win-Win
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-300 mr-2" />
                  <span className="text-sm">No implementation costs for the college</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-300 mr-2" />
                  <span className="text-sm">Fixed % revenue share on each enrollment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-300 mr-2" />
                  <span className="text-sm">Enhanced placement metrics</span>
                </li>
              </ul>
              
              <button className="w-full bg-white text-blue-700 font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Schedule a Detailed Presentation
              </button>
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
              <span className="font-bold text-lg">CareerLaunch</span>
            </div>
            <div className="text-slate-400 text-sm">
              Training • Internships • Career Acceleration
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
