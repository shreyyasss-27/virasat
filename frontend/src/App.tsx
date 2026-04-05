// import React, { useEffect } from "react";
// import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router";

// import BhartiyamPage from "./pages/Bhartiyam.tsx";
// import CommunityPage from "./pages/CommunityChannel.tsx";
// import DharoharTVPage from "./pages/DharoharTV.tsx";
// import HeritageBazzarPage from "./pages/HeritageBazzar.tsx";
// import HomePage from "./pages/Homepage.tsx";
// import LearnPage from "./pages/Learn.tsx";
// import MarketplacePage from "./pages/MarketPlace.tsx";
// import SangamPage from "./pages/Sangam.tsx";
// import SignInPage from "./pages/Signin.tsx";
// import SignUpPage from "./pages/Signup.tsx";
// import ProfilePage from "./pages/Profile.tsx";

// import Footer from "./components/layout/footer.tsx";
// import Navbar from "./components/layout/navbar.tsx";
// import { ThemeProvider } from "./components/theme-provider.tsx";
// import { useAuthStore } from "./store/useAuthStore.ts";
// import { Loader } from "lucide-react";
// import { Toaster } from "sonner";
// import CartPage from "./pages/CartPage.tsx";
// import OrderPage from "./pages/OrderPage.tsx";
// import ProductPage from "./pages/ProductPage.tsx";
// import SellerDashboard from "./pages/SellerDashboard.tsx";
// import MediaUpload from "./pages/Upload.tsx";
// import CreatorDashboard from "./pages/CreatorDashboard.tsx";
// import VideoPage from "./pages/VideoPage.tsx";
// import SangamDashboard from "./pages/SangamDashboard.tsx";
// import PostPage from "./pages/PostPage.tsx";
// import DiscussionPage from "./pages/DiscussionPage.tsx";

// const NotFound = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-10">
//     <h1 className="text-6xl font-black text-red-600">404</h1>
//     <p className="text-xl text-red-800 mt-2 mb-6">Page Not Found</p>
//     <Link
//       to="/"
//       className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out"
//     >
//       Go back to Homepage
//     </Link>
//   </div>
// );

// const App: React.FC = () => {
//   const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   if (isCheckingAuth && !authUser) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <BrowserRouter>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//       >
//         <div className="min-h-screen flex flex-col bg-background">
//           <Navbar />
//           <main className="flex-grow">
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/bhartiyam/:id?" element={<BhartiyamPage />} />
//               <Route path="/community" element={<CommunityPage />} />
//               <Route path="/heritagebazzar" element={<HeritageBazzarPage />} />
//               <Route path="/learn" element={<LearnPage />} />
//               <Route path="/sangam" element={<SangamPage />} />
//               <Route path="/dharohar-tv" element={<DharoharTVPage />} />
//               <Route path="/marketplace" element={<MarketplacePage />} />
//               <Route path="/heritagebazzar/cart" element={<CartPage />} />
//               <Route path="/heritagebazzar/orders" element={<OrderPage />} />
//               <Route path="/heritagebazzar/dashboard" element={<SellerDashboard />} />
//               <Route path="/dharohartv/dashboard" element={<CreatorDashboard />} />
//               <Route path="/dharohartv/watch/:id" element={<VideoPage />} />
//               <Route path="/sangam/dashboard" element={<SangamDashboard />} />
//               <Route path="/sangam/communities/:id" element={<CommunityPage />} />
//               <Route path="/sangam/discussions/:id" element={<DiscussionPage />} />
//               <Route path="/posts/:id" element={<PostPage />} />
//               <Route path="/product/:id" element={<ProductPage />} />
//               <Route path="/orders" element={<OrderPage />} />
//               <Route path="/upload" element={<MediaUpload module={"profile"} />} />
//               <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth/signin" />}/>
//               <Route path="/auth/signin" element={!authUser ? <SignInPage /> : <Navigate to="/" />}/>
//               <Route path="/auth/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/>
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//         <Toaster richColors position="bottom-right" duration={2000} />
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// };

// export default App;


import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router";
import { Loader } from "lucide-react";
import { Toaster } from "sonner";

// Layout & Providers
import Footer from "./components/layout/footer.tsx";
import Navbar from "./components/layout/navbar.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { useAuthStore } from "./store/useAuthStore.ts";

// Pages
import HomePage from "./pages/Homepage.tsx";
import BhartiyamPage from "./pages/Bhartiyam.tsx";
import CommunityPage from "./pages/CommunityChannel.tsx";
import DharoharTVPage from "./pages/DharoharTV.tsx";
import HeritageBazzarPage from "./pages/HeritageBazzar.tsx";
import LearnPage from "./pages/Learn.tsx";
import MarketplacePage from "./pages/MarketPlace.tsx";
import SignInPage from "./pages/Signin.tsx";
import SignUpPage from "./pages/Signup.tsx";
import ProfilePage from "./pages/Profile.tsx";
import CartPage from "./pages/CartPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import SellerDashboard from "./pages/SellerDashboard.tsx";
import MediaUpload from "./pages/Upload.tsx";
import CreatorDashboard from "./pages/CreatorDashboard.tsx";
import VideoPage from "./pages/VideoPage.tsx";
import SangamDashboard from "./pages/SangamDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import AdminOrders from "./pages/AdminOrders.tsx";
import PostPage from "./pages/PostPage.tsx";
import DiscussionPage from "./pages/DiscussionPage.tsx";
import SangamPage from "./pages/Sangam.tsx";
import { Button } from "./components/ui/button.tsx";

/**
 * Role-Based Access Control Wrapper
 * Restricts access based on auth status and specific roles.
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) => {
  const { authUser } = useAuthStore();

  // Debug logging
  console.log("RoleProtectedRoute - authUser:", authUser);
  console.log("RoleProtectedRoute - allowedRoles:", allowedRoles);
  console.log("RoleProtectedRoute - user roles:", authUser?.roles);

  if (!authUser) return <Navigate to="/auth/signin" replace />;

  if (allowedRoles && !allowedRoles.some(role => authUser.roles?.includes(role))) {
    console.log("RoleProtectedRoute - Access denied, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background p-10 text-center">
    <h1 className="text-9xl font-black text-orange-500/20">404</h1>
    <div className="absolute">
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The path you are looking for doesn't exist.</p>
        <Button asChild variant="outline">
            <Link to="/">Go back to Homepage</Link>
        </Button>
    </div>
  </div>
);



const App: React.FC = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/bhartiyam/:id?" element={<BhartiyamPage />} />
              <Route path="/heritagebazzar" element={<HeritageBazzarPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/dharohar-tv" element={<DharoharTVPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/sangam" element={<SangamPage />} />
              <Route path="/posts/:id" element={<PostPage />} />

              {/* --- General Auth Protected Routes --- */}
              <Route path="/profile" element={<RoleProtectedRoute><ProfilePage /></RoleProtectedRoute>} />
              <Route path="/heritagebazzar/cart" element={<RoleProtectedRoute><CartPage /></RoleProtectedRoute>} />
              <Route path="/heritagebazzar/orders" element={<RoleProtectedRoute><OrderPage /></RoleProtectedRoute>} />
              <Route path="/orders" element={<RoleProtectedRoute><OrderPage /></RoleProtectedRoute>} />
              <Route path="/upload" element={<RoleProtectedRoute><MediaUpload module={"profile"} /></RoleProtectedRoute>} />
              
              {/* --- Specific Community/Discussion Routes --- */}
              <Route path="/sangam/communities/:id" element={<RoleProtectedRoute><CommunityPage /></RoleProtectedRoute>} />
              <Route path="/sangam/discussions/:id" element={<RoleProtectedRoute><DiscussionPage /></RoleProtectedRoute>} />
              <Route path="/dharohartv/watch/:id" element={<RoleProtectedRoute><VideoPage /></RoleProtectedRoute>} />

              {/* --- Role-Specific Dashboards --- */}
              
              {/* Admin Dashboard */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </RoleProtectedRoute>
                } 
              />

              {/* Admin Users */}
              <Route 
                path="/admin/users" 
                element={
                  <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminUsers />
                  </RoleProtectedRoute>
                } 
              />

              {/* Admin Products */}
              <Route 
                path="/admin/products" 
                element={
                  <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminProducts />
                  </RoleProtectedRoute>
                } 
              />

              {/* Admin Orders */}
              <Route 
                path="/admin/orders" 
                element={
                  <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminOrders />
                  </RoleProtectedRoute>
                } 
              />

              {/* Seller Dashboard */}
              <Route 
                path="/heritagebazzar/dashboard" 
                element={
                  <RoleProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
                    <SellerDashboard />
                  </RoleProtectedRoute>
                } 
              />

              {/* Creator Dashboard */}
              <Route 
                path="/dharohartv/dashboard" 
                element={
                  <RoleProtectedRoute allowedRoles={["CREATOR", "ADMIN"]}>
                    <CreatorDashboard />
                  </RoleProtectedRoute>
                } 
              />

              {/* Expert Dashboard */}
              <Route 
                path="/sangam/dashboard" 
                element={
                  <RoleProtectedRoute allowedRoles={["EXPERT", "ADMIN"]}>
                    <SangamDashboard />
                  </RoleProtectedRoute>
                } 
              />

              {/* --- Auth Pages --- */}
              <Route path="/auth/signin" element={!authUser ? <SignInPage /> : <Navigate to="/" />} />
              <Route path="/auth/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

              {/* --- 404 --- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster richColors position="bottom-right" duration={2500} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;