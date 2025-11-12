import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserDashboard from './pages/user/Dashboard'
import Animals from './pages/user/Animals'
import Reports from './pages/user/Reports'
import Advisories from './pages/user/Advisories'
import UserSettings from './pages/user/Settings'
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageReports from './pages/admin/ManageReports'
import ManageAdvisories from './pages/admin/ManageAdvisories'
import InteractiveMap from './pages/admin/InteractiveMap'
import ExportReports from './pages/admin/ExportReports'
import AdminSettings from './pages/admin/Settings'
import PrivateRoute from './routes/PrivateRoute'
import RoleBasedRoute from './routes/RoleBasedRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes - Only for farmer role */}
      <Route
        path="/user/dashboard"
        element={
          <RoleBasedRoute allowedRoles={["farmer"]}>
            <UserDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/animals"
        element={
          <RoleBasedRoute allowedRoles={["farmer"]}>
            <Animals />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/reports"
        element={
          <RoleBasedRoute allowedRoles={["farmer"]}>
            <Reports />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/advisories"
        element={
          <RoleBasedRoute allowedRoles={["farmer"]}>
            <Advisories />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/settings"
        element={
          <RoleBasedRoute allowedRoles={["farmer"]}>
            <UserSettings />
          </RoleBasedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageReports />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/advisories"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageAdvisories />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/map"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <InteractiveMap />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/export"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ExportReports />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminSettings />
          </RoleBasedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<div className="p-8">404 - Not Found</div>} />
    </Routes>
  )
}

export default App
