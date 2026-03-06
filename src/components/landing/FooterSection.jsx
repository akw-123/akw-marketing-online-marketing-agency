import React from "react";
import { Phone, Mail, ArrowUpRight } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="border-t border-stone-200/60 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
              alt="AKW Marketing Logo"
              className="w-8 h-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="tel:+447400487527"
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +44 7400 487527
            </a>
            <a
              href="mailto:hello@profresults.com"
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@profresults.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} ProfResults. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1">
              Privacy Policy <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1">
              Terms of Service <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}