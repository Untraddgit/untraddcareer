import React from 'react';
import { Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-8">
        <Lock className="text-blue-600 mr-2" size={28} />
        <h3 className="text-xl font-bold text-blue-700">Privacy Policy</h3>
      </div>

      <div className="text-sm text-slate-600">
        <p className="mb-2">Last Updated: August 15, 2023</p>
        <p className="mb-4">This Privacy Policy explains how UntraddCareer collects, uses, and protects your personal information.</p>
      </div>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">1. Information We Collect</h4>
        <p className="text-slate-600 mb-2">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Personal information (name, email address, phone number, etc.)</li>
          <li>Educational background and career information</li>
          <li>Payment information for program enrollment</li>
          <li>Performance data during the program</li>
          <li>Usage data when interacting with our website and learning platform</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">2. How We Use Your Information</h4>
        <p className="text-slate-600 mb-2">We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Communicate with you about our services, updates, and promotions</li>
          <li>Facilitate internship placements and career opportunities</li>
          <li>Analyze usage patterns to improve user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">3. Information Sharing</h4>
        <p className="text-slate-600 mb-2">
          We may share your information with the following parties:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Partner companies for internship placements (with your consent)</li>
          <li>Service providers who help us deliver our services</li>
          <li>Legal authorities when required by law</li>
          <li>Educational institutions (for college partnership programs, with institutional consent)</li>
        </ul>
        <p className="text-slate-600 mt-2">
          We do not sell or rent your personal information to third parties for marketing purposes.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">4. Data Security</h4>
        <p className="text-slate-600 mb-2">
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">5. Your Rights and Choices</h4>
        <p className="text-slate-600 mb-2">You have the following rights regarding your personal information:</p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Access, correct, or delete your personal information</li>
          <li>Object to or restrict certain processing of your data</li>
          <li>Receive a copy of your data in a structured, machine-readable format</li>
          <li>Withdraw consent at any time (where processing is based on consent)</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">6. Cookies and Tracking Technologies</h4>
        <p className="text-slate-600 mb-2">
          We use cookies and similar tracking technologies to track activity on our website and improve user experience. You can control cookies through your browser settings.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">7. Changes to This Policy</h4>
        <p className="text-slate-600 mb-2">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website with a revised "Last Updated" date.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">8. Contact Us</h4>
        <p className="text-slate-600 mb-2">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="text-blue-600">contactuntradd@gmail.com</p>
      </section>

      <div className="bg-blue-50 rounded-lg p-4 text-center text-slate-600 mt-8">
        By using UntraddCareer services, you consent to the collection and use of information in accordance with this policy.
      </div>
    </div>
  );
};

export default PrivacyPolicy; 