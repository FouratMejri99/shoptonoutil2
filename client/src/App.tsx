import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import { PageLoader } from "./components/PageLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy load all pages for better performance and code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogPostDetail = lazy(() => import("./pages/BlogPostDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const IndustryLanding = lazy(() => import("./pages/IndustryLanding"));
const LeadMagnet = lazy(() => import("./pages/LeadMagnet"));
const EmployeeLogin = lazy(() => import("./pages/EmployeeLogin"));
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard"));
const AdminReporting = lazy(() => import("./pages/AdminReporting"));
const AdminEmployees = lazy(() => import("./pages/AdminEmployees"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminCaseStudies = lazy(() => import("./pages/AdminCaseStudies"));
const AdminChangePassword = lazy(() => import("./pages/AdminChangePassword"));
const AdminSubscribers = lazy(() => import("./pages/AdminSubscribers"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  const [location] = useLocation();

  return (
    <Suspense fallback={<PageLoader fullScreen />}>
      <Switch location={location}>
        <Route path={"/"} component={Home} />
        <Route path={"/about"} component={About} />
        <Route path={"/services"} component={Services} />
        <Route path={"/services/:slug"} component={ServiceDetail} />
        <Route path={"/case-studies"} component={CaseStudies} />
        <Route path={"/case-studies/:slug"} component={CaseStudyDetail} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:slug"} component={BlogPostDetail} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/industries/:industry"} component={IndustryLanding} />
        <Route path={"/lead-magnet"} component={LeadMagnet} />
        {/* Admin routes - hidden from public navigation */}
        <Route path={"/admin/reporting"} component={AdminReporting} />
        <Route path={"/admin/employees"} component={AdminEmployees} />
        <Route path={"/solupedia-admin"} component={AdminLogin} />
        <Route path={"/admin/dashboard"} component={AdminDashboard} />
        <Route path={"/admin/blog"} component={AdminBlog} />
        <Route path={"/admin/case-studies"} component={AdminCaseStudies} />
        <Route path="/admin/change-password" component={AdminChangePassword} />
        <Route path="/admin/subscribers" component={AdminSubscribers} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Don't show navigation and footer for employee portal and admin pages
  const isPortalPage =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/employee") ||
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname === "/solupedia-admin");

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <div className="flex flex-col min-h-screen">
            {!isPortalPage && <Navigation />}
            <main className="flex-1">
              <Router />
            </main>
            {!isPortalPage && <Footer />}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
