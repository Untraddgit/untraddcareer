import React from 'react';
import { RefreshCw } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-8">
        <RefreshCw className="text-blue-600 mr-2" size={28} />
        <h3 className="text-xl font-bold text-blue-700">Refund Policy</h3>
      </div>

      <div className="text-sm text-slate-600">
        <p className="mb-2">Last Updated: May 27, 2025</p>
        <p className="mb-4">
          UntraddCareer is committed to student satisfaction. Our refund policy is designed to be fair while ensuring accountability from both students and our organization.
        </p>
      </div>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">1. Full Refund Eligibility</h4>
        <p className="text-slate-600 mb-2">
          Students may request a full refund within the first 4 weeks of the program if:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>The average weekly satisfaction rating is below 7/10</li>
          <li>The request is made before completing 30% of the program content</li>
          <li>No internship placement assistance has been initiated</li>
        </ul>
        <p className="text-slate-600">
          Refunds will be processed within 15 business days of approval.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">2. Partial Refund Policy</h4>
        <p className="text-slate-600 mb-2">
          After the initial 4 weeks, partial refunds may be granted based on:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>Weekly feedback scores (average below 7/10)</li>
          <li>Program completion percentage</li>
          <li>Student performance metrics</li>
          <li>Mutual agreement between student and UntraddCareer</li>
        </ul>
        <p className="text-slate-600">
          The partial refund amount will be calculated as follows:
          <br />
          (Remaining program weeks ÷ Total program weeks) × (Program fee - ₹2000 administrative fee)
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">3. Performance-Based Refunds</h4>
        <p className="text-slate-600 mb-2">
          If a student's weekly feedback scores average below 7/10 for any 4 consecutive weeks:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>We will conduct a review meeting with the student</li>
          <li>Develop an improvement plan with measurable goals</li>
          <li>If improvement isn't achieved within 2 weeks, a partial refund may be offered</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">4. Non-Refundable Items</h4>
        <p className="text-slate-600 mb-2">
          The following are not eligible for refund:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Completed training modules</li>
          <li>Initiated internship placement processes</li>
          <li>Any issued certificates or materials</li>
          <li>Administrative fees (₹2000)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">5. Refund Process</h4>
        <p className="text-slate-600 mb-2">
          To request a refund:
        </p>
        <ol className="list-decimal pl-6 text-slate-600 space-y-1 mb-2">
          <li>Submit a written request to contactuntradd@gmail.com</li>
          <li>Include your student ID and reason for request</li>
          <li>Allow 5 business days for review</li>
          <li>If approved, refund will be issued via original payment method</li>
        </ol>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">6. Special Circumstances</h4>
        <p className="text-slate-600 mb-2">
          In cases of documented medical emergencies or other exceptional circumstances, UntraddCareer may offer:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Program deferral</li>
          <li>Credit for future programs</li>
          <li>Case-by-case refund consideration</li>
        </ul>
      </section>

      <div className="bg-blue-50 rounded-lg p-4 text-center text-slate-600 mt-8">
        For any questions about our refund policy, please contact us at contactuntradd@gmail.com
      </div>
    </div>
  );
};

export default RefundPolicy;
