import { useEffect } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/free-analysis", label: "Free analysis" },
  { href: "/kitchener", label: "Kitchener" },
];

/**
 * Branded not-found page. The build also writes this to dist/404.html
 * without the app bundle, so Pages can serve it as a real HTTP 404.
 */
export default function PageNotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found | AKW Marketing";
    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const previousRobots = robots.getAttribute("content");
    robots.setAttribute("content", "noindex, follow");
    return () => {
      document.title = previousTitle;
      if (created) robots.remove();
      else if (previousRobots == null) robots.removeAttribute("content");
      else robots.setAttribute("content", previousRobots);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      <nav className="border-b border-stone-200/60 px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/assets/logo-official.png"
              alt="AKW Marketing"
              className="w-8 h-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
          </a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-stone-400">404</p>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight mt-3">Page not found</h1>
          <p className="text-stone-600 leading-relaxed mt-4">
            That link does not go anywhere on AKW Marketing. It may have moved, or the address may be mistyped.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  link.href === "/"
                    ? "inline-flex items-center bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium"
                    : "inline-flex items-center bg-white border border-stone-200 hover:border-stone-300 text-stone-700 rounded-full px-5 h-9 text-sm font-medium"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-sm text-stone-500 mt-8">
            Or email{" "}
            <a href="mailto:contact@akwmarketing.com" className="underline hover:text-stone-800">
              contact@akwmarketing.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
