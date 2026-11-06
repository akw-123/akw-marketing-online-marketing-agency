import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { leadCaptureEnabled, submitFormLead } from "@/lib/previewLeadCapture";
import TurnstileWidget from "@/components/TurnstileWidget";

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
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const captureReady = leadCaptureEnabled();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError("");
    setSubmitOk("");
    setSubmitting(true);
    const result = await submitFormLead({
      source: "gbp",
      payload: form,
      formEl: e.currentTarget,
      hostname: window.location.hostname,
    });
    setSubmitting(false);
    if (result.ok) setSubmitOk(result.message);
    else setSubmitError(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-lead-capture={captureReady ? "ready" : "unavailable"}>
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        className="hidden"
      />
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

      <TurnstileWidget />
      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit"} <ArrowRight className="w-4 h-4" />
      </button>
      {submitError && (
        <p className="text-sm text-stone-600 leading-relaxed" role="alert">
          {submitError}
        </p>
      )}
      {submitOk && (
        <p className="text-sm text-stone-600 leading-relaxed" role="status">
          {submitOk}
        </p>
      )}
    </form>
  );
}