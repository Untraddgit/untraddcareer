import React from 'react';
import { Shield } from 'lucide-react';

const TermsConditions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-8">
        <Shield className="text-blue-600 mr-2" size={28} />
        <h3 className="text-xl font-bold text-blue-700">Terms and Conditions</h3>
      </div>

      <div className="text-sm text-slate-600">
        <p className="mb-2">Last Updated: August 27, 2024</p>
        <p className="mb-4">Please read these Terms and Conditions carefully before using the UntraddCareer program and services.</p>
      </div>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">1. Acceptance of Terms</h4>
        <p className="text-slate-600 mb-2">
          By enrolling in UntraddCareer programs or using our services, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, please do not use our services.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">2. Program Description</h4>
        <p className="text-slate-600 mb-2">
          UntraddCareer offers training and internship programs designed to prepare students for professional careers. While we strive to provide the highest quality education and placement assistance, specific outcomes cannot be guaranteed in specific conditions and may vary based on individual participation, effort, and market conditions.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">3. Registration and Payment</h4>
        <p className="text-slate-600 mb-2">
          Program fees must be paid according to the payment schedule provided at enrollment. Fees are non-refundable except as specified in our refund policy. Registration information must be accurate and complete.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">4. Refund Policy</h4>
        <p className="text-slate-600 mb-2">
          We implement a weekly feedback system for the first month. Students rate their satisfaction on a scale of 1-10. If your average rating is below 7 after the first 4 weeks, you're eligible for a full refund on our terms. This ensures we're accountable for delivering quality and gives you time to properly evaluate the program.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">5. Internship Placement</h4>
        <p className="text-slate-600 mb-2">
          UntraddCareer will make reasonable efforts to secure internship placements for all enrolled students who successfully complete the training portion of the program. Placements are subject to student performance, market availability, and qualification matches.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">6. Intellectual Property</h4>
        <p className="text-slate-600 mb-2">
          All content provided as part of the UntraddCareer program, including but not limited to videos, documents, and exercises, is the intellectual property of UntraddCareer or its licensors. Content may not be reproduced, distributed, or used for any commercial purpose without express written permission.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">7. Code of Conduct</h4>
        <p className="text-slate-600 mb-2">
          Students must adhere to professional standards of behavior in all program-related activities. Any form of harassment, discrimination, or disruptive behavior may result in immediate termination from the program without refund.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">8. Privacy Policy</h4>
        <p className="text-slate-600 mb-2">
          Student information is handled in accordance with our Privacy Policy. By enrolling, students consent to the collection and use of their information as outlined in the policy.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">9. Limitation of Liability</h4>
        <p className="text-slate-600 mb-2">
          UntraddCareer shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services or participation in our programs.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">10. Changes to Terms</h4>
        <p className="text-slate-600 mb-2">
          UntraddCareer reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of the modified Terms.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">11. Governing Law</h4>
        <p className="text-slate-600 mb-2">
          These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">12. Contact Information</h4>
        <p className="text-slate-600 mb-2">
          For questions regarding these Terms and Conditions, please contact us at contactuntradd@gmail.com.
        </p>
      </section>

      <div className="bg-blue-50 rounded-lg p-4 text-center text-slate-600 mt-8">
        By enrolling in UntraddCareer programs or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
      </div>
    </div>
  );
};

export default TermsConditions; 