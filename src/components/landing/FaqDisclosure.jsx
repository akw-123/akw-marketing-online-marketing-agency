import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Native details/summary so the answer is in the prerendered HTML while closed.
 * Pages pass their own classes so each accordion keeps its current look.
 */
export default function FaqDisclosure({
  question,
  answer,
  name,
  className = "",
  summaryClassName = "",
  questionClassName = "",
  answerClassName = "",
  answerAs = "div",
}) {
  const AnswerTag = answerAs;
  return (
    <details name={name || undefined} className={`group ${className}`.trim()}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between font-normal [&::-webkit-details-marker]:hidden ${summaryClassName}`.trim()}
      >
        <span className={questionClassName}>{question}</span>
        <ChevronDown
          aria-hidden="true"
          className="w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <AnswerTag className={answerClassName}>{answer}</AnswerTag>
    </details>
  );
}
