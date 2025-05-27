import React from 'react';
import { Truck } from 'lucide-react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-8">
        <Truck className="text-blue-600 mr-2" size={28} />
        <h3 className="text-xl font-bold text-blue-700">Shipping Policy</h3>
      </div>

      <div className="text-sm text-slate-600">
        <p className="mb-2">Last Updated: May 27, 2025</p>
        <p className="mb-4">
          UntraddCareer primarily delivers digital services and products. This policy outlines our shipping and delivery processes.
        </p>
      </div>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">1. Digital Product Delivery</h4>
        <p className="text-slate-600 mb-2">
          All digital products and services (course materials, access credentials, etc.) are delivered:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>Instantly via email upon successful payment</li>
          <li>Through our learning platform within 24 hours of enrollment</li>
          <li>With detailed setup instructions</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">2. Physical Materials (If Applicable)</h4>
        <p className="text-slate-600 mb-2">
          For programs that include physical materials:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>Standard shipping: 5-7 business days within India</li>
          <li>Express shipping: 2-3 business days (additional charges may apply)</li>
          <li>International shipping: 7-14 business days</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">3. Tracking Information</h4>
        <p className="text-slate-600 mb-2">
          For physical shipments, tracking information will be provided via:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>Email notification with tracking number</li>
          <li>SMS alerts for major milestones</li>
          <li>Accessible through your student dashboard</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">4. Shipping Charges</h4>
        <p className="text-slate-600 mb-2">
          Shipping costs vary based on:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mb-2">
          <li>Delivery location</li>
          <li>Package weight and dimensions</li>
          <li>Selected shipping method</li>
        </ul>
        <p className="text-slate-600 mt-2">
          Free shipping is available for select programs within India.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">5. Delivery Issues</h4>
        <p className="text-slate-600 mb-2">
          In case of delivery problems:
        </p>
        <ol className="list-decimal pl-6 text-slate-600 space-y-1 mb-2">
          <li>Contact us within 7 days of expected delivery</li>
          <li>Provide your order details and tracking information</li>
          <li>We will investigate and resolve the issue promptly</li>
        </ol>
      </section>

      <section className="mb-6">
        <h4 className="font-bold text-blue-700 mb-2">6. International Shipping</h4>
        <p className="text-slate-600 mb-2">
          For international students:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1">
          <li>Customs duties and taxes are the responsibility of the recipient</li>
          <li>Delivery times may vary based on customs processing</li>
          <li>Some digital restrictions may apply based on local regulations</li>
        </ul>
      </section>

      <div className="bg-blue-50 rounded-lg p-4 text-center text-slate-600 mt-8">
        For any shipping-related inquiries, please contact us at contactuntradd@gmail.com
      </div>
    </div>
  );
};

export default ShippingPolicy;
