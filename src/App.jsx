import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MetaAds from './pages/MetaAds';
import Kitchener from './pages/Kitchener';
import SeoServicesKitchener from './pages/SeoServicesKitchener';
import Waterloo from './pages/Waterloo';
import GoogleAdsKitchener from './pages/GoogleAdsKitchener';
import MetaAdsKitchener from './pages/MetaAdsKitchener';
import LocalSeoKitchener from './pages/LocalSeoKitchener';
import AiSeoKitchener from './pages/AiSeoKitchener';
import Cambridge from './pages/Cambridge';
import Guelph from './pages/Guelph';
import Hamilton from './pages/Hamilton';
import Burlington from './pages/Burlington';
import Brantford from './pages/Brantford';
import Stratford from './pages/Stratford';
import Newsletter from './pages/Newsletter';
import NewsletterThankYou from './pages/NewsletterThankYou';
import GbpThreeFree from './pages/GbpThreeFree';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import OnlineMarketingAgency from './pages/OnlineMarketingAgency';
import Home from './pages/Home';
import FreeAnalysis from './pages/FreeAnalysis';
import About from './pages/About';
import WebsiteDesignKitchener from './pages/WebsiteDesignKitchener';
import ContentMarketingKitchener from './pages/ContentMarketingKitchener';
import NoIndexRedirect from './components/NoIndexRedirect';
import { canonicalUrl } from '@/lib/canonicalPath';
import { LEGACY_REDIRECTS } from '@/lib/siteRoutes';
import { applySocialMeta, socialImageUrl, socialType } from '@/lib/socialMeta';
import { getPublishedPost } from '@/data/blog';
import Dashboard from './pages/Dashboard';
import HardestWorkingSeoExpert from './pages/HardestWorkingSeoExpert';
import HardestWorkingMarketingAgency from './pages/HardestWorkingMarketingAgency';
import GetMoreClients from './pages/GetMoreClients';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;
const clientRedirects = LEGACY_REDIRECTS.filter(
  (entry) => entry.from !== "/landing" && entry.from !== "/Landing",
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const CanonicalUpdater = () => {
  const location = useLocation();
  React.useEffect(() => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl(location.pathname);
  }, [location.pathname]);
  return null;
};

/** Runs after the page title and description effects because it wraps the routes. */
const SocialMeta = ({ children }) => {
  const location = useLocation();
  React.useEffect(() => {
    const slug = location.pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/)?.[1] || "";
    const post = slug ? getPublishedPost(slug) : null;
    applySocialMeta(document, {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
      url: canonicalUrl(location.pathname),
      image: socialImageUrl(post?.cover_image_url),
      type: socialType(location.pathname),
    });
  }, [location.pathname]);
  return children;
};

export const PublicApp = () => {
  return (
    <>
    <CanonicalUpdater />
    <SocialMeta>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/landing" element={<NoIndexRedirect to="/" />} />
      <Route path="/Landing" element={<NoIndexRedirect to="/" />} />
      {Object.entries(Pages).filter(([path]) => path !== "Home").map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/gbp" element={<MetaAds />} />
      <Route path="/kitchener" element={<Kitchener />} />
      <Route path="/seo-services-kitchener" element={<SeoServicesKitchener />} />
      <Route path="/waterloo" element={<Waterloo />} />
      <Route path="/google-ads-kitchener" element={<GoogleAdsKitchener />} />
      <Route path="/meta-ads-kitchener" element={<MetaAdsKitchener />} />
      <Route path="/local-seo-kitchener" element={<LocalSeoKitchener />} />
      <Route path="/ai-seo-kitchener" element={<AiSeoKitchener />} />
      <Route path="/cambridge" element={<Cambridge />} />
      <Route path="/guelph" element={<Guelph />} />
      <Route path="/hamilton" element={<Hamilton />} />
      <Route path="/burlington" element={<Burlington />} />
      <Route path="/brantford" element={<Brantford />} />
      <Route path="/stratford" element={<Stratford />} />
      <Route path="/newsletter" element={<Newsletter />} />
      <Route path="/newsletter-thank-you" element={<NewsletterThankYou />} />
      <Route path="/gbp-three-free" element={<GbpThreeFree />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/free-analysis" element={<FreeAnalysis />} />
      <Route path="/about" element={<About />} />
      <Route path="/hardest-working-seo-expert-kitchener-waterloo" element={<HardestWorkingSeoExpert />} />
      <Route path="/hardest-working-marketing-agency-kitchener-waterloo" element={<HardestWorkingMarketingAgency />} />
      <Route path="/get-more-clients" element={<GetMoreClients />} />
      <Route path="/website-design-kitchener" element={<WebsiteDesignKitchener />} />
      <Route path="/content-marketing-kitchener" element={<ContentMarketingKitchener />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {clientRedirects.map((entry) => (
        <Route key={entry.from} path={entry.from} element={<Navigate to={entry.to} replace />} />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </SocialMeta>
    </>
  );
};


function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <PublicApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App