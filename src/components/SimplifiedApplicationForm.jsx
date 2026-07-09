import React, { useState } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#85b6e9] focus:ring-1 focus:ring-[#85b6e9] transition-colors";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  business_name: "",
  website: "",
  gbp_link: "",
};

function Field({ required, placeholder, ...props }) {
  return (
    <div className="relative">
      <input required={required} placeholder={placeholder} className={inputClass} {...props} />
      {required && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-base pointer-events-none select-none" style={{ display: "none" }}>*</span>
      )}
    </div>
  );
}

export default function SimplifiedApplicationForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      full_name: `${form.first_name} ${form.last_name}`.trim(),
      email: form.email,
      phone: form.phone,
      business_name: form.business_name,
      website: form.website,
      gbp_link: form.gbp_link,
    };

    await base44.entities.StrategyApplication.create(payload);

    const emailBody = `
New GBP Strategy Application

Name: ${payload.full_name}
Email: ${payload.email}
Phone: ${payload.phone}
Company: ${payload.business_name}
Website: ${payload.website || "N/A"}
Google Business Profile Link: ${payload.gbp_link || "N/A"}
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: "andre@akwmarketing.com",
      subject: `New GBP Application: ${payload.business_name} (${payload.full_name})`,
      body: emailBody,
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-5" />
        <h3 className="text-2xl font-bold text-stone-900 mb-2">Application Received!</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
          Thank you, <strong>{form.first_name}</strong>! We'll review your application and reach out within 24–48 hours to schedule your free GBP strategy session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1 */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Your information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required type="text" placeholder="First name *" value={form.first_name} onChange={set("first_name")} className={inputClass} />
          <input required type="text" placeholder="Last name *" value={form.last_name} onChange={set("last_name")} className={inputClass} />
          <input required type="email" placeholder="Email *" value={form.email} onChange={set("email")} className={inputClass} />
          <input required type="tel" placeholder="Phone Number *" value={form.phone} onChange={set("phone")} className={inputClass} />
        </div>
      </div>

      {/* Section 2 */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Company information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required type="text" placeholder="Company Name *" value={form.business_name} onChange={set("business_name")} className={inputClass} />
          <input type="url" placeholder="Website" value={form.website} onChange={set("website")} className={inputClass} />
        </div>
      </div>

      {/* Section 3 */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Google Business profile information</h3>
        <input type="url" placeholder="Link to your Google Business Profile" value={form.gbp_link} onChange={set("gbp_link")} className={inputClass} />
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-stone-500 leading-relaxed">
        By clicking "Submit" you agree to receive marketing communications from AKW Marketing via email, phone, and/or SMS. You can unsubscribe at any time by clicking the unsubscribe link in our emails or by contacting us.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Submit <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}