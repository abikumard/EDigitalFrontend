import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import BottomNav from './components/BottomNav.jsx'
import AdminSidebar from './components/AdminSidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ContentDetail from './pages/ContentDetail.jsx'
import MyPurchases from './pages/MyPurchases.jsx'
import Account from './pages/Account.jsx'
import KdpDashboard from './pages/KdpDashboard.jsx'
import KdpPublishWizard from './pages/KdpPublishWizard.jsx'
import PublisherProfile from './pages/PublisherProfile.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminContentManage from './pages/AdminContentManage.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminSellers from './pages/AdminSellers.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import ShippingPolicy from './pages/ShippingPolicy.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'

function SiteLayout({ children }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">{children}</main>
      <BottomNav />
      <footer className="kindle-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <span className="footer-brand-title">📖 KDP Cloud • Self-Publishing Marketplace</span>
            <p className="footer-brand-sub">Direct digital self-publishing platform with 97% author royalties &amp; global in-browser Kindle distribution.</p>
          </div>
          <div className="footer-admin-link-box">
            <Link to="/admin/login" className="footer-admin-btn">Admin Portal</Link>
          </div>
        </div>

        <nav className="footer-links">
          <Link to="/">Kindle Store</Link>
          <Link to="/kdp">KDP Author Studio</Link>
          <Link to="/kdp/publish">Publish a Book</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/shipping-policy">Digital Delivery Policy</Link>
          <Link to="/contact-us">Support &amp; Help</Link>
        </nav>
        <div className="footer-copyright">
          © {new Date().getFullYear()} KDP Cloud (MediaVault). Created for Abikumar Dharmaraj &amp; Global Independent Authors. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/login" element={<SiteLayout><Login /></SiteLayout>} />
      <Route path="/signup" element={<SiteLayout><Signup /></SiteLayout>} />
      <Route path="/content/:id" element={<SiteLayout><ContentDetail /></SiteLayout>} />
      <Route path="/library" element={<SiteLayout><ProtectedRoute><MyPurchases /></ProtectedRoute></SiteLayout>} />
      <Route path="/cart" element={<SiteLayout><ProtectedRoute><Cart /></ProtectedRoute></SiteLayout>} />
      <Route path="/wishlist" element={<SiteLayout><ProtectedRoute><Wishlist /></ProtectedRoute></SiteLayout>} />
      
      {/* KDP Studio & Publisher routes */}
      <Route path="/kdp" element={<SiteLayout><ProtectedRoute><KdpDashboard /></ProtectedRoute></SiteLayout>} />
      <Route path="/kdp/publish" element={<SiteLayout><ProtectedRoute><KdpPublishWizard /></ProtectedRoute></SiteLayout>} />
      <Route path="/publisher/profile" element={<SiteLayout><ProtectedRoute><PublisherProfile /></ProtectedRoute></SiteLayout>} />
      <Route path="/sell" element={<SiteLayout><ProtectedRoute><PublisherProfile /></ProtectedRoute></SiteLayout>} />
      
      <Route path="/account" element={<SiteLayout><ProtectedRoute><Account /></ProtectedRoute></SiteLayout>} />
      <Route path="/terms" element={<SiteLayout><TermsAndConditions /></SiteLayout>} />
      <Route path="/privacy-policy" element={<SiteLayout><PrivacyPolicy /></SiteLayout>} />
      <Route path="/refund-policy" element={<SiteLayout><RefundPolicy /></SiteLayout>} />
      <Route path="/shipping-policy" element={<SiteLayout><ShippingPolicy /></SiteLayout>} />
      <Route path="/contact-us" element={<SiteLayout><ContactUs /></SiteLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/admin/content" element={<AdminProtectedRoute><AdminLayout><AdminContentManage /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/admin/sellers" element={<AdminProtectedRoute><AdminLayout><AdminSellers /></AdminLayout></AdminProtectedRoute>} />

      <Route path="*" element={<SiteLayout><Home /></SiteLayout>} />
    </Routes>
  )
}
