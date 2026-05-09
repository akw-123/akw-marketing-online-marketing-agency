import React from "react";
import { Phone, Mail, ArrowUpRight } from "lucide-react";

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

export default function FooterSection() {
  return (
    <footer className="border-t border-stone-200/60 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
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
              <a href="https://www.linkedin.com/company/akw-marketing" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                <LinkedInIcon />
              </a>
              <a href="https://x.com/akw_marketing" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                <XIcon />
              </a>
            </div>
          </div>


        </div>

        <div className="mt-8 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400 text-center sm:text-left">
            © {new Date().getFullYear()} All rights reserved by AKW Marketing. Legal information upon request at{" "}
            <a href="mailto:contact@akwmarketing.com" className="underline hover:text-stone-600 transition-colors">contact@akwmarketing.com</a>
            {" "}for legal information request.
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