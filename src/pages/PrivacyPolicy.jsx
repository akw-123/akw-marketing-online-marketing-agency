import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | AKW Marketing";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = 'Welcome to AKW Marketing ("Company", "we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.';
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-stone-500 mb-8">Last updated: October 6, 2026</p>

          <div className="prose prose-stone max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">1. Introduction</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Welcome to AKW Marketing ("Company", "we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">2. Information We Collect</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
                <li><strong>Contact Data:</strong> Email address, telephone numbers, billing address</li>
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and your communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our services</li>
                <li>To monitor the usage of our services</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To provide you with news, special offers and general information about other services we offer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">4. Data Security</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">5. Data Retention</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">6. Your Legal Rights</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 text-stone-600 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">7. Third-Party Links</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Our website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">8. Cookies</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">9. Google User Data and Google Business Profile Access</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                AKW Marketing accesses Google Business Profile data only for business locations whose owners have added us as a manager, and only to audit profile completeness, apply edits those owners have approved, and publish approved posts. We use this data solely to provide these services to the owner of that profile.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                We do not sell Google user data, share it with third parties for advertising, or use it to train artificial intelligence models. We retain it only as long as needed to provide the service. Owners can revoke our access at any time from their Google Business Profile settings, and can ask us to delete related data by emailing contact@akwmarketing.com.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                AKW Marketing's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">11. Contact Us</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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