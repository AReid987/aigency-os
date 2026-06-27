// ─── Unified Aigency OS App ─────────────────────────────────────────────────

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useVentureStore } from './stores/ventureStore';
import { Atmosphere } from './components/Atmosphere';
import { Canvas } from './canvas/Canvas';
import { OfficePage } from './pages/OfficePage';
import { BrainPage } from './pages/BrainPage';
import { CRMPage } from './pages/CRMPage';
import { PlannerPage } from './pages/PlannerPage';
import { QualityPage } from './pages/QualityPage';
import { AgentsPage } from './pages/AgentsPage';
import { VenturePage } from './pages/VenturePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SwarmPage } from './pages/SwarmPage';
import { ConductorPage } from './pages/ConductorPage';
import { OrchestratorPage } from './pages/OrchestratorPage';
import { ChatPage } from './pages/ChatPage';
import { FilesPage } from './pages/FilesPage';
import { TasksPage } from './pages/TasksPage';
import { TerminalPage } from './pages/TerminalPage';
import { SessionsPage } from './pages/SessionsPage';
import { CronPage } from './pages/CronPage';
import { SettingsPage } from './pages/SettingsPage';
import { Badge } from '@vscp/ui';
import {
  Layout, Brain, Users, FileText, Shield, Terminal, Lightbulb,
  LogOut, ChevronLeft, ChevronRight, Plus, Layers, Bug, Radio,
  Network, MessageSquare, FolderOpen, CheckSquare, Monitor,
  Clock, Settings,
} from 'lucide-react';

// ─── Sidebar Nav Groups ─────────────────────────────────────────────────────

type UserRole = 'admin' | 'technical_founder' | 'domain_expert';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { path: '/', icon: Layout, label: 'Office', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/canvas', icon: Layers, label: 'Canvas', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/swarm', icon: Bug, label: 'Swarm', roles: ['admin', 'technical_founder'] },
      { path: '/conductor', icon: Radio, label: 'Conductor', roles: ['admin', 'technical_founder'] },
      { path: '/orchestrator', icon: Network, label: 'Orchestrator', roles: ['admin', 'technical_founder'] },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/brain', icon: Brain, label: 'Brain', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/crm', icon: Users, label: 'CRM', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/planner', icon: FileText, label: 'Planner', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/quality', icon: Shield, label: 'Quality', roles: ['admin', 'technical_founder'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/chat', icon: MessageSquare, label: 'Chat', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/files', icon: FolderOpen, label: 'Files', roles: ['admin', 'technical_founder'] },
      { path: '/tasks', icon: CheckSquare, label: 'Tasks', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/terminal', icon: Terminal, label: 'Terminal', roles: ['admin'] },
      { path: '/sessions', icon: Monitor, label: 'Sessions', roles: ['admin', 'technical_founder'] },
      { path: '/cron', icon: Clock, label: 'Cron Jobs', roles: ['admin'] },
      { path: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
    ],
  },
];

// ─── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { ventures, activeVentureId, setActiveVenture } = useVentureStore();
  const [ventureOpen, setVentureOpen] = useState(false);

  const activeVenture = ventures.find((v) => v.id === activeVentureId);

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-surface/80 backdrop-blur-md border-r border-border flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-52'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        {!collapsed && <span className="text-sm font-bold font-display">Aigency</span>}
        <button onClick={onToggle} className="p-1 rounded hover:bg-hover/60 text-fg-muted">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Venture Switcher */}
      {!collapsed && (
        <div className="px-2 pt-2 pb-1">
          <button
            onClick={() => setVentureOpen(!ventureOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-elevated/70 border border-border hover:border-border-hover text-xs transition-colors"
          >
            <span className="font-medium truncate">{activeVenture?.name || 'Select Venture'}</span>
            <ChevronRight size={12} className={`text-fg-muted transition-transform ${ventureOpen ? 'rotate-90' : ''}`} />
          </button>
          {ventureOpen && (
            <div className="mt-1 bg-elevated/90 border border-border rounded-md overflow-hidden">
              {ventures.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setActiveVenture(v.id); setVentureOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-hover/60 transition-colors ${v.id === activeVentureId ? 'bg-primary-muted/30 text-primary' : 'text-fg-secondary'}`}
                >
                  <p className="font-medium">{v.name}</p>
                  <p className="text-[10px] text-fg-muted truncate">{v.mission}</p>
                </button>
              ))}
              <button
                onClick={() => { navigate('/venture/new'); setVentureOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-fg-muted hover:bg-hover/60 border-t border-border flex items-center gap-1.5"
              >
                <Plus size={10} /> New Venture
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Venture button (collapsed mode) */}
      {collapsed && (
        <div className="px-2 py-2">
          <button
            onClick={() => navigate('/venture/new')}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md bg-primary text-fg-inverse text-xs font-semibold hover:bg-primary-dark transition-colors"
            title="New Venture"
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes((user?.role as UserRole) || 'domain_expert'),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-fg-muted uppercase tracking-wider">
                  {group.label}
                </p>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60 hover:text-fg'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={15} />
                    {!collapsed && item.label}
                  </button>
                );
              })}
            </div>
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
      <main className={`flex-1 min-h-0 transition-all duration-200 ${sidebarCollapsed ? 'ml-14' : 'ml-52'}`}>
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

        {/* Protected routes — Workspace */}
        <Route path="/" element={
          <AuthGuard><AppLayout><OfficePage /></AppLayout></AuthGuard>
        } />
        <Route path="/canvas" element={
          <AuthGuard><AppLayout><Canvas /></AppLayout></AuthGuard>
        } />
        <Route path="/swarm" element={
          <AuthGuard roles={['admin', 'technical_founder']}><AppLayout><SwarmPage /></AppLayout></AuthGuard>
        } />
        <Route path="/conductor" element={
          <AuthGuard roles={['admin', 'technical_founder']}><AppLayout><ConductorPage /></AppLayout></AuthGuard>
        } />
        <Route path="/orchestrator" element={
          <AuthGuard roles={['admin', 'technical_founder']}><AppLayout><OrchestratorPage /></AppLayout></AuthGuard>
        } />

        {/* Protected routes — Intelligence */}
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

        {/* Protected routes — Operations */}
        <Route path="/chat" element={
          <AuthGuard><AppLayout><ChatPage /></AppLayout></AuthGuard>
        } />
        <Route path="/files" element={
          <AuthGuard roles={['admin', 'technical_founder']}><AppLayout><FilesPage /></AppLayout></AuthGuard>
        } />
        <Route path="/tasks" element={
          <AuthGuard><AppLayout><TasksPage /></AppLayout></AuthGuard>
        } />
        <Route path="/terminal" element={
          <AuthGuard roles={['admin']}><AppLayout><TerminalPage /></AppLayout></AuthGuard>
        } />
        <Route path="/sessions" element={
          <AuthGuard roles={['admin', 'technical_founder']}><AppLayout><SessionsPage /></AppLayout></AuthGuard>
        } />
        <Route path="/cron" element={
          <AuthGuard roles={['admin']}><AppLayout><CronPage /></AppLayout></AuthGuard>
        } />
        <Route path="/settings" element={
          <AuthGuard roles={['admin']}><AppLayout><SettingsPage /></AppLayout></AuthGuard>
        } />

        {/* Venture creation */}
        <Route path="/venture/new" element={
          <AuthGuard><AppLayout><VenturePage /></AppLayout></AuthGuard>
        } />

        {/* Legacy route — redirect /agents to /orchestrator */}
        <Route path="/agents" element={<Navigate to="/orchestrator" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
