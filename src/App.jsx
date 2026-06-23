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
import Newsletter from './pages/Newsletter';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import OnlineMarketingAgency from './pages/OnlineMarketingAgency';
import Home from './pages/Home';
import FreeAnalysis from './pages/FreeAnalysis';
import NoIndexRedirect from './components/NoIndexRedirect';
import CaseStudies from './pages/CaseStudies';
import CaseStudyCambridgeHvac from './pages/CaseStudyCambridgeHvac';
import CaseStudyWaterlooDental from './pages/CaseStudyWaterlooDental';
import CaseStudyBurlingtonRealtor from './pages/CaseStudyBurlingtonRealtor';
import CaseStudyGuelphCafe from './pages/CaseStudyGuelphCafe';
import CaseStudyHamiltonAccountant from './pages/CaseStudyHamiltonAccountant';

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
      <Route path="/newsletter" element={<Newsletter />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/free-analysis" element={<FreeAnalysis />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/case-studies/cambridge-hvac-local-seo" element={<CaseStudyCambridgeHvac />} />
      <Route path="/case-studies/waterloo-dental-reviews" element={<CaseStudyWaterlooDental />} />
      <Route path="/case-studies/burlington-realtor-full-funnel" element={<CaseStudyBurlingtonRealtor />} />
      <Route path="/case-studies/guelph-cafe-gbp" element={<CaseStudyGuelphCafe />} />
      <Route path="/case-studies/hamilton-accountant-google-ads" element={<CaseStudyHamiltonAccountant />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
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