import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function NoIndexRedirect({ to }) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    return () => {
      if (meta && meta.parentNode) meta.remove();
    };
  }, []);

  return <Navigate to={to} replace />;
}