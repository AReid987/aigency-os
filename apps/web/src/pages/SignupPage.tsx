import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Atmosphere } from '../components/Atmosphere';
import { Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signup({ email, password, name, company: company || undefined });
    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center z-10">
      <Atmosphere />
      <div className="w-full max-w-md p-8 bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-display">Join Aigency</h1>
          <p className="text-sm text-fg-muted mt-1">Create a domain expert account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-fg-secondary mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full pl-10 pr-4 py-2.5 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-fg-secondary mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-fg-secondary mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-fg-secondary mb-1.5">Company (optional)</label>
            <div className="relative">
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company name"
                className="w-full pl-10 pr-4 py-2.5 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-error bg-error-muted px-3 py-2 rounded-md">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-fg-muted">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>

        <div className="mt-4 p-3 bg-elevated/50 rounded-md border border-border">
          <p className="text-[10px] text-fg-muted">
            Sign up creates a <strong>Domain Expert</strong> account with access to business views, plan review, and milestone approvals.
            You can add LLM inference API keys after signing up via the API Keys page.
          </p>
        </div>
      </div>
    </div>
  );
}
