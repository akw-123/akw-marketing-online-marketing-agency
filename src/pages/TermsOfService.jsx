import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = 'By accessing and using the services provided by AKW Marketing ("Company", "we", "our", "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.';
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-stone max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                By accessing and using the services provided by AKW Marketing ("Company", "we", "our", "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Use License</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Permission is granted to temporarily access the materials (information or software) on AKW Marketing's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
                <li>Attempt to decompile or reverse engineer any software contained on AKW Marketing's website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. Services Description</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                AKW Marketing provides Google Maps SEO and local search optimization services. Our services include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Google Business Profile optimization</li>
                <li>Local SEO strategies</li>
                <li>Review management</li>
                <li>Citation building</li>
                <li>Ranking improvement services</li>
              </ul>
              <p className="text-stone-600 leading-relaxed mt-4">
                While we strive to achieve top rankings for our clients, results may vary based on competition, location, industry, and other factors beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Performance Guarantee</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                AKW Marketing offers a 90-day ranking guarantee for eligible clients. Specific terms and conditions of this guarantee are outlined in your service agreement. The guarantee is subject to:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Client compliance with all service requirements</li>
                <li>Timely provision of necessary access and information</li>
                <li>Adherence to Google's Terms of Service and guidelines</li>
                <li>Market conditions and competitive landscape</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Payment Terms</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Payment for services is due according to the payment schedule outlined in your service agreement. We accept payment via credit card, bank transfer, or other agreed-upon methods. Late payments may result in:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Suspension of services</li>
                <li>Late payment fees as specified in your agreement</li>
                <li>Termination of services for accounts more than 30 days overdue</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Client Responsibilities</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                As a client of AKW Marketing, you agree to:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Provide accurate and complete information about your business</li>
                <li>Grant necessary access to your Google Business Profile and other relevant accounts</li>
                <li>Respond to our requests for information in a timely manner</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in practices that violate Google's guidelines</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Intellectual Property</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                All content, strategies, and materials created by AKW Marketing remain our intellectual property unless otherwise specified in writing. Upon full payment, clients receive a non-exclusive license to use deliverables for their business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Confidentiality</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Both parties agree to maintain confidentiality of any proprietary information shared during the course of our business relationship. This obligation continues even after the termination of services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                AKW Marketing shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">10. Termination</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Either party may terminate services with written notice according to the terms specified in your service agreement. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Client remains responsible for payment of services rendered</li>
                <li>AKW Marketing will provide a final report of work completed</li>
                <li>Access to client accounts will be transferred back to the client</li>
                <li>Any ongoing campaigns will be concluded in a professional manner</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">11. Modifications to Terms</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                AKW Marketing reserves the right to modify these terms at any time. We will notify clients of any material changes via email. Continued use of our services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">12. Governing Law</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which AKW Marketing operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">13. Contact Information</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-stone-600 space-y-2">
                <li>Email: contact@akwmarketing.com</li>
                <li>Phone: +1 437 475 0076</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}