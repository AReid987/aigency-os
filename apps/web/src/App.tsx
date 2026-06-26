// ─── Unified Aigency OS App ─────────────────────────────────────────────────

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Atmosphere } from './components/Atmosphere';
import { Canvas } from './canvas/Canvas';
import { BrainPage } from './pages/BrainPage';
import { CRMPage } from './pages/CRMPage';
import { PlannerPage } from './pages/PlannerPage';
import { QualityPage } from './pages/QualityPage';
import { AgentsPage } from './pages/AgentsPage';
import { VenturePage } from './pages/VenturePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Badge } from '@vscp/ui';
import {
  Layout, Brain, Users, FileText, Shield, Terminal, Lightbulb,
  LogOut, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';

// ─── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { path: '/', icon: Layout, label: 'Canvas', roles: ['admin', 'technical_founder', 'domain_expert'] },
    { path: '/brain', icon: Brain, label: 'Brain', roles: ['admin', 'technical_founder', 'domain_expert'] },
    { path: '/crm', icon: Users, label: 'CRM', roles: ['admin', 'technical_founder', 'domain_expert'] },
    { path: '/planner', icon: FileText, label: 'Planner', roles: ['admin', 'technical_founder', 'domain_expert'] },
    { path: '/quality', icon: Shield, label: 'Quality', roles: ['admin', 'technical_founder'] },
    { path: '/agents', icon: Terminal, label: 'Agents', roles: ['admin'] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role || ''));

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-surface/80 backdrop-blur-md border-r border-border flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-48'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        {!collapsed && <span className="text-sm font-bold font-display">Aigency</span>}
        <button onClick={onToggle} className="p-1 rounded hover:bg-hover/60 text-fg-muted">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* New Venture button */}
      <div className="px-2 py-2">
        <button
          onClick={() => navigate('/venture/new')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-fg-inverse text-xs font-semibold hover:bg-primary-dark transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <Plus size={14} />
          {!collapsed && 'New Venture'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60 hover:text-fg'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-border">
        <div className={`flex items-center gap-2 px-2 py-1.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-sm bg-primary-muted text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || '?'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-fg-muted truncate">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-error" title="Sign out">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── Auth Guard ─────────────────────────────────────────────────────────────

function AuthGuard({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ─── App Layout ─────────────────────────────────────────────────────────────

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative h-screen min-h-screen text-fg flex z-10 overflow-hidden">
      <Atmosphere />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`flex-1 min-h-0 transition-all duration-200 ${sidebarCollapsed ? 'ml-14' : 'ml-48'}`}>
        {children}
      </main>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> :
          authMode === 'login' ?
            <LoginPage onSwitchToSignup={() => setAuthMode('signup')} /> :
            <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/" replace /> :
          <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <AuthGuard><AppLayout><Canvas /></AppLayout></AuthGuard>
        } />
        <Route path="/brain" element={
          <AuthGuard><AppLayout><BrainPage /></AppLayout></AuthGuard>
        } />
        <Route path="/crm" element={
          <AuthGuard><AppLayout><CRMPage /></AppLayout></AuthGuard>
        } />
        <Route path="/planner" element={
          <AuthGuard><AppLayout><PlannerPage /></AppLayout></AuthGuard>
        } />
        <Route path="/quality" element={
          <AuthGuard roles={['admin', 'technical_founder']}><AppLayout><QualityPage /></AppLayout></AuthGuard>
        } />
        <Route path="/agents" element={
          <AuthGuard roles={['admin']}><AppLayout><AgentsPage /></AppLayout></AuthGuard>
        } />
        <Route path="/venture/new" element={
          <AuthGuard><AppLayout><VenturePage /></AppLayout></AuthGuard>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
