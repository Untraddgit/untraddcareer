import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <AlertTriangle className="text-amber-600 mr-2" size={28} />
        <h3 className="text-xl font-bold text-amber-700">Disclaimer</h3>
      </div>

      <div className="text-sm text-slate-600">
        <p className="mb-2">Last Updated: August 15, 2023</p>
      </div>

      <section className="mb-6">
        <h4 className="font-bold text-amber-700 mb-2">Program Outcomes</h4>
        <p className="text-slate-600">
          While UntraddCareer strives to provide high-quality training and internship opportunities, individual outcomes 
          may vary. Our success metrics represent typical results, but we cannot guarantee specific employment outcomes, 
          salary levels, or career advancement for every participant. Results depend on various factors including individual 
          effort, market conditions, and proper application of the skills and knowledge obtained.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-amber-700 mb-2">Third-Party Content</h4>
        <p className="text-slate-600">
          Our program may include links to third-party websites, resources, or content that is not owned or controlled 
          by UntraddCareer. We have no control over, and assume no responsibility for the content, privacy policies, 
          or practices of any third-party websites or services. We strongly advise you to read the terms and conditions 
          and privacy policy of any third-party website that you visit.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-amber-700 mb-2">Financial Considerations</h4>
        <p className="text-slate-600">
          Enrollment in UntraddCareer programs represents a financial commitment. Before enrolling, carefully consider 
          your financial situation and ensure that you understand all payment terms. While we offer certain financial 
          accommodations, we cannot guarantee specific financial outcomes resulting from program participation.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-amber-700 mb-2">Career Advice</h4>
        <p className="text-slate-600">
          Any career guidance or advice provided through UntraddCareer is based on current industry trends and best 
          practices. However, the job market and industry requirements continuously evolve, and advice that may be 
          relevant at one point may change over time. Always perform additional research and exercise judgment when 
          making career decisions.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-amber-700 mb-2">Accuracy of Information</h4>
        <p className="text-slate-600">
          While we strive to provide accurate and up-to-date information, UntraddCareer does not warrant that the 
          information on our website or in our materials is complete, reliable, current, or error-free. All content 
          is provided "as is" without warranties of any kind.
        </p>
      </section>

      <div className="bg-amber-50 rounded-lg p-4 text-center text-slate-600 mt-8">
        By enrolling in UntraddCareer programs or using our services, you acknowledge that you have read, understood, 
        and agree to this disclaimer.
      </div>
    </div>
  );
};

export default Disclaimer; 