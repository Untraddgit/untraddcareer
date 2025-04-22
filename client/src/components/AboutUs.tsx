import React from 'react';
import { Award, Users, Compass, TrendingUp, CheckCircle } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="mb-6">
        <div className="flex items-center mb-4">
          <Compass className="text-blue-600 mr-3" size={28} />
          <h3 className="text-xl font-bold text-blue-700">Our Mission</h3>
        </div>
        <p className="text-slate-600 mb-4">
          At UntraddCareer, we bridge the gap between education and industry by transforming students into industry-ready professionals. We believe in a future where every student can find their purpose and build a secure, fulfilling career that aligns with their strengths and passions.
        </p>
        <p className="text-slate-600">
          Our comprehensive program combines structured training with guaranteed internships, ensuring students don't just learn theory but gain practical experience that makes them stand out in the job market.
        </p>
      </section>

      <section className="mb-6">
        <div className="flex items-center mb-4">
          <Users className="text-blue-600 mr-3" size={28} />
          <h3 className="text-xl font-bold text-blue-700">Who We Are</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Founded by industry experts and educational innovators, UntraddCareer is a team dedicated to solving the employment crisis faced by graduates. We've assembled faculty from the top 0.01% of global experts, bringing experience from prestigious institutions like IIT, IIM, Cambridge, and leading tech companies.
        </p>
        <p className="text-slate-600">
          Our team understands both academic excellence and real-world requirements, allowing us to create programs that truly prepare students for successful careers.
        </p>
      </section>

      <section className="mb-6">
        <div className="flex items-center mb-4">
          <Award className="text-blue-600 mr-3" size={28} />
          <h3 className="text-xl font-bold text-blue-700">Our Approach</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start">
            <CheckCircle size={18} className="text-green-600 mr-2 mt-1" />
            <div>
              <span className="font-medium text-slate-800">Personalized Career Guidance</span>
              <p className="text-sm text-slate-600">One-on-one consulting to help students discover their ideal career path</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle size={18} className="text-green-600 mr-2 mt-1" />
            <div>
              <span className="font-medium text-slate-800">Comprehensive Foundation Training</span>
              <p className="text-sm text-slate-600">Essential skills development that transcends technical knowledge</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle size={18} className="text-green-600 mr-2 mt-1" />
            <div>
              <span className="font-medium text-slate-800">Industry-Aligned Domain Specialization</span>
              <p className="text-sm text-slate-600">Focused training in AI-proof career domains with high growth potential</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle size={18} className="text-green-600 mr-2 mt-1" />
            <div>
              <span className="font-medium text-slate-800">Guaranteed Internship Placement</span>
              <p className="text-sm text-slate-600">Real-world experience with partner companies or in-house projects</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center mb-4">
          <TrendingUp className="text-blue-600 mr-3" size={28} />
          <h3 className="text-xl font-bold text-blue-700">Our Impact</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">80%+</div>
            <div className="text-sm text-slate-600">Internship-to-Job Conversion</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">100%</div>
            <div className="text-sm text-slate-600">Career Confusion Solved</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">35%</div>
            <div className="text-sm text-slate-600">Start Own Ventures</div>
          </div>
        </div>
      </section>
      
      <div className="bg-blue-50 rounded-lg p-5 text-center mt-8">
        <p className="text-lg italic text-blue-700">"From Confusion to Crystal Clear Career with UntraddCareer"</p>
      </div>
    </div>
  );
};

export default AboutUs; 