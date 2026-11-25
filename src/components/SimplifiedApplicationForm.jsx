import React, { useState } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { submitLead } from "@/lib/submitLead";
import TurnstileWidget from "@/components/TurnstileWidget";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#85b6e9] focus:ring-1 focus:ring-[#85b6e9] transition-colors";

const HEARD_OPTIONS = ["Google search", "Google Maps", "ChatGPT or another AI tool", "Facebook or Instagram", "YouTube", "Friend or colleague", "Other"];
const emptyForm = {
  heard_from: "",
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
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setError("");
    const result = await submitLead("gbp", {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      business_name: form.business_name,
      website: form.website,
      gbp_link: form.gbp_link,
      heard_from: form.heard_from,
    }, token);
    if (!result.ok) {
      setLoading(false);
      setError("Sorry, something went wrong sending your details. Please try again, or call 437-475-0076.");
      return;
    }
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

      <div>
        <select value={form.heard_from} onChange={set("heard_from")} className={inputClass} aria-label="How did you hear about us?">
          <option value="">How did you hear about us?</option>
          {HEARD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-stone-500 leading-relaxed">
        By clicking "Submit" you agree to receive marketing communications from AKW Marketing via email, phone, and/or SMS. You can unsubscribe at any time by clicking the unsubscribe link in our emails or by contacting us.
      </p>

      <TurnstileWidget onToken={setToken} />
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !token}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Submit <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}