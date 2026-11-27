import React from "react";
import { HEARD_DETAIL_LABELS, HEARD_OPTIONS } from "@/lib/heardFrom";

export default function HeardFromFields({ heardFrom, detail, onHeardFrom, onDetail, inputClass }) {
  const followUp = HEARD_DETAIL_LABELS[heardFrom] || "";
  return (
    <div className="space-y-3">
      <select
        required
        value={heardFrom}
        onChange={(event) => onHeardFrom(event.target.value)}
        className={inputClass}
        aria-label="How did you hear about us?"
      >
        <option value="">How did you hear about us? *</option>
        {HEARD_OPTIONS.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {followUp ? (
        <label className="block text-sm text-stone-700">
          <span className="block mb-1">{followUp}</span>
          <input
            type="text"
            maxLength={200}
            value={detail}
            onChange={(event) => onDetail(event.target.value)}
            className={inputClass}
          />
        </label>
      ) : null}
    </div>
  );
}
