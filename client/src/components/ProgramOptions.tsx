import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';

interface ProgramOptionsProps {
  openWhatsApp: (message: string) => void;
}

const ProgramOptions: React.FC<ProgramOptionsProps> = ({ openWhatsApp }) => {
  return (
    <section id="take-it-now" className="mb-12">
      <div className="bg-white rounded-lg shadow-lg py-8 px-4">
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
  );
};

export default ProgramOptions; 