import React from "react";
import KitchenerNav from "@/components/landing/KitchenerNav";
import KitchenerFooter from "@/components/landing/KitchenerFooter";

const articleClasses = [
  "[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-bold [&_h1]:text-stone-900 [&_h1]:tracking-tight [&_h1]:leading-[1.1] [&_h1]:mb-6",
  "[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-stone-900 [&_h2]:tracking-tight [&_h2]:mt-14 [&_h2]:mb-4",
  "[&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-semibold [&_h3]:text-stone-900 [&_h3]:mt-8 [&_h3]:mb-3",
  "[&_p]:text-stone-600 [&_p]:leading-relaxed [&_p]:mb-5",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-stone-600 [&_ul]:leading-relaxed [&_ul]:mb-5 [&_ul]:space-y-3",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-stone-600 [&_ol]:leading-relaxed [&_ol]:mb-5 [&_ol]:space-y-3",
  "[&_li]:pl-1",
  "[&_a]:text-stone-900 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-stone-400 [&_a]:hover:text-stone-700 [&_a]:transition-colors",
  "[&_code]:bg-stone-200/60 [&_code]:text-stone-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em] [&_code]:font-mono",
].join(" ");

export default function SeoArticlePage({ children, belowArticle }) {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <KitchenerNav />
      <article className="pt-28 pb-24 px-6">
        <div className={`max-w-3xl mx-auto ${articleClasses}`}>
          {children}
        </div>
      </article>
      {belowArticle}
      <KitchenerFooter />
    </div>
  );
}