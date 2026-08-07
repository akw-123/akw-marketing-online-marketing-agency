import React from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function KitchenerFooter() {
  return (
    <footer className="border-t border-stone-200/60 pt-12 px-6 pb-8">
      <div className="max-w-7xl mx-auto">

        {/* Google Map */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-stone-200/60 shadow-sm" style={{ height: "280px" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92380.27710558447!2d-80.57403!3d43.45178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf48c03ee5105%3A0x9525f8e6df5f544b!2sKitchener%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sca!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AKW Marketing Kitchener"
          />
        </div>

        {/* NAP + Info Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <a href="/" className="flex items-center gap-2 cursor-pointer mb-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
                alt="AKW Marketing Logo"
                className="w-8 h-8 rounded-md object-contain"
              />
              <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
            </a>
            <p className="text-sm text-stone-600 font-medium">Dominate your local market.</p>
            <p className="text-sm text-stone-400">Built for local businesses.</p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://www.instagram.com/akw_marketing/" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                <InstagramIcon />
              </a>
              <a href="https://www.youtube.com/@AKWMarketing" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                <YoutubeIcon />
              </a>
              <a href="https://www.linkedin.com/company/akw-marketing" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                <LinkedInIcon />
              </a>
              <a href="https://x.com/akw_marketing" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                <XIcon />
              </a>
            </div>
          </div>

          {/* NAP Block */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">Contact</p>
            <div className="flex items-start gap-2 text-sm text-stone-700 font-medium">
              <span className="text-stone-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <span>
                AKW Marketing Agency Kitchener<br />
                <span className="text-stone-500 font-normal">Serving Kitchener, Ontario</span>
              </span>
            </div>
            <a href="tel:+14374750076" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">
              <Phone className="w-4 h-4" />
              +1 437-475-0076
            </a>
            <a href="mailto:contact@akwmarketing.com" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">
              <Mail className="w-4 h-4" />
              contact@akwmarketing.com
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400 text-center sm:text-left">
            © {new Date().getFullYear()} All rights reserved by AKW Marketing Agency. Legal information upon request at{" "}
            <a href="mailto:contact@akwmarketing.com" className="underline hover:text-stone-600 transition-colors">contact@akwmarketing.com</a>.
          </p>
          <div className="flex items-center gap-6">
            <a href="/PrivacyPolicy" className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1">
              Privacy Policy <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="/TermsOfService" className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1">
              Terms of Service <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}