import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Eagerly loaded (above the fold)
import Index from "./pages/Index";

// Lazy loaded pages
const About = lazy(() => import("./pages/About"));
const Store = lazy(() => import("./pages/Store"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEbooks = lazy(() => import("./pages/admin/AdminEbooks"));
const AdminEbookNew = lazy(() => import("./pages/admin/AdminEbookNew"));
const AdminEbookEdit = lazy(() => import("./pages/admin/AdminEbookEdit"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminBlogNew = lazy(() => import("./pages/admin/AdminBlogNew"));
const AdminBlogEdit = lazy(() => import("./pages/admin/AdminBlogEdit"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminDiscountCodes = lazy(() => import("./pages/admin/AdminDiscountCodes"));

const BlogPost = lazy(() => import("./pages/BlogPost"));
const EbookDetail = lazy(() => import("./pages/EbookDetail"));

const Terms = lazy(() => import("./pages/legal/Terms"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING...</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:slug" element={<EbookDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />

              {/* Legal */}
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              <Route path="/legal/refund" element={<RefundPolicy />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Customer */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />

              {/* Admin */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/ebooks" element={<AdminEbooks />} />
                <Route path="/admin/ebooks/new" element={<AdminEbookNew />} />
                <Route path="/admin/ebooks/:id/edit" element={<AdminEbookEdit />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/blog/new" element={<AdminBlogNew />} />
                <Route path="/admin/blog/:id/edit" element={<AdminBlogEdit />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/newsletter" element={<AdminNewsletter />} />
                <Route path="/admin/discounts" element={<AdminDiscountCodes />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
