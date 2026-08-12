import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MetaAds from './pages/MetaAds';
import Kitchener from './pages/Kitchener';
import SeoServicesKitchener from './pages/SeoServicesKitchener';
import Waterloo from './pages/Waterloo';
import GoogleAdsKitchener from './pages/GoogleAdsKitchener';
import MetaAdsKitchener from './pages/MetaAdsKitchener';
import LocalSeoKitchener from './pages/LocalSeoKitchener';
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
import NoIndexRedirect from './components/NoIndexRedirect';
import Dashboard from './pages/Dashboard';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const CanonicalUpdater = () => {
  const location = useLocation();
  React.useEffect(() => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `https://akwmarketing.com${location.pathname}`;
  }, [location.pathname]);
  return null;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
    <CanonicalUpdater />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/landing" element={<NoIndexRedirect to="/" />} />
      <Route path="/Landing" element={<NoIndexRedirect to="/" />} />
      {Object.entries(Pages).map(([path, Page]) => (
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
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/TermsOfService" element={<TermsOfService />} />
      <Route path="/gbp" element={<MetaAds />} />
      <Route path="/kitchener" element={<Kitchener />} />
      <Route path="/seo-services-kitchener" element={<SeoServicesKitchener />} />
      <Route path="/waterloo" element={<Waterloo />} />
      <Route path="/google-ads-kitchener" element={<GoogleAdsKitchener />} />
      <Route path="/meta-ads-kitchener" element={<MetaAdsKitchener />} />
      <Route path="/local-seo-kitchener" element={<LocalSeoKitchener />} />
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
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App