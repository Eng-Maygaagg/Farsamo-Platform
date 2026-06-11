import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Providers from './pages/public/Providers';
import ProviderDetail from './pages/public/ProviderDetail';
import TrackBooking from './pages/public/TrackBooking';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';
import CustomerBookingDetail from './pages/customer/CustomerBookingDetail';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerReviews from './pages/customer/CustomerReviews';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderBookings from './pages/provider/ProviderBookings';
import ProviderAvailability from './pages/provider/ProviderAvailability';
import ProviderProfile from './pages/provider/ProviderProfile';
import ProviderReviews from './pages/provider/ProviderReviews';
import ProviderEarnings from './pages/provider/ProviderEarnings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminServices from './pages/admin/AdminServices';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

const customerNav = [
  { path: '/customer', label: 'Dashboard', icon: '📊', end: true },
  { path: '/customer/bookings', label: 'My Bookings', icon: '📅' },
  { path: '/customer/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/customer/profile', label: 'Profile', icon: '👤' },
];

const providerNav = [
  { path: '/provider', label: 'Dashboard', icon: '📊', end: true },
  { path: '/provider/bookings', label: 'Bookings', icon: '📅' },
  { path: '/provider/availability', label: 'Availability', icon: '🗓️' },
  { path: '/provider/profile', label: 'Profile', icon: '👤' },
  { path: '/provider/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/provider/earnings', label: 'Earnings', icon: '💰' },
];

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/verifications', label: 'Verifications', icon: '✅' },
  { path: '/admin/services', label: 'Services', icon: '🔧' },
  { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/admin/reports', label: 'Reports', icon: '📈' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:id" element={<ServiceDetail />} />
              <Route path="providers" element={<Providers />} />
              <Route path="providers/:id" element={<ProviderDetail />} />
              <Route path="track-booking" element={<TrackBooking />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route path="/customer" element={
              <ProtectedRoute roles={['customer']}>
                <DashboardLayout navItems={customerNav} title="Customer Dashboard" />
              </ProtectedRoute>
            }>
              <Route index element={<CustomerDashboard />} />
              <Route path="bookings" element={<CustomerBookings />} />
              <Route path="bookings/:id" element={<CustomerBookingDetail />} />
              <Route path="reviews" element={<CustomerReviews />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            <Route path="/provider" element={
              <ProtectedRoute roles={['provider']}>
                <DashboardLayout navItems={providerNav} title="Provider Dashboard" />
              </ProtectedRoute>
            }>
              <Route index element={<ProviderDashboard />} />
              <Route path="bookings" element={<ProviderBookings />} />
              <Route path="availability" element={<ProviderAvailability />} />
              <Route path="profile" element={<ProviderProfile />} />
              <Route path="reviews" element={<ProviderReviews />} />
              <Route path="earnings" element={<ProviderEarnings />} />
            </Route>

            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <DashboardLayout navItems={adminNav} title="Admin Dashboard" />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="verifications" element={<AdminVerifications />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
