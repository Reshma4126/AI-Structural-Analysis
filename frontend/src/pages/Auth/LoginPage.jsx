import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/structwise-logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  const [fullName, setFullName]                 = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [remember, setRemember]                 = useState(false);
  const [agreeTerms, setAgreeTerms]             = useState(false);
  const [errorMsg, setErrorMsg]                 = useState('');
  const [submitting, setSubmitting]             = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (isSignUp && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      if (isSignUp) {
        await register(fullName, email, password, 'Engineer');
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-body">

      {/* ─── Left Hero Panel ─── */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 overflow-hidden border-r border-[#1E293B]">

        {/* Blueprint grid background */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94A3B8" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Glow accents */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-[#F97316]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#334155]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo Image */}
        <div className="z-10">
          <img
            src={logoImg}
            alt="StructWise AI"
            className="h-14 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.3))' }}
          />
        </div>

        {/* Middle: Hero Text */}
        <div className="max-w-xl space-y-6 z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#10B981]">
              AI Engine Online
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-4xl xl:text-5xl text-white leading-[1.15] tracking-tight">
            Structural Engineering<br />
            Powered by{' '}
            <span className="text-[#F97316]">Explainable AI</span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed">
            Predict RC beam capacity, deflection, failure modes, and generate AI-assisted optimization recommendations — all in seconds.
          </p>

        </div>

        <p className="text-[11px] font-mono text-slate-600 z-10">
          StructWise AI • AI-Powered Structural Intelligence
        </p>
      </div>

      {/* ─── Right Auth Panel ─── */}
      <div className="w-full lg:w-5/12 bg-white text-[#0F172A] flex flex-col justify-between p-8 lg:p-14 overflow-y-auto">

        {/* Mobile header */}
        <div className="flex lg:hidden items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#F97316] text-xl">architecture</span>
          </div>
          <span className="font-heading font-bold text-lg text-[#0F172A]">
            StructWise <span className="text-[#F97316]">AI</span>
          </span>
        </div>

        <div className="my-auto max-w-md w-full mx-auto space-y-6">

          {/* Tabs */}
          <div className="flex border-b border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
              className={`pb-3 px-4 text-sm font-heading font-semibold transition-all border-b-2 -mb-px ${
                !isSignUp ? 'text-[#F97316] border-[#F97316]' : 'text-[#94A3B8] border-transparent hover:text-[#334155]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
              className={`pb-3 px-4 text-sm font-heading font-semibold transition-all border-b-2 -mb-px ${
                isSignUp ? 'text-[#F97316] border-[#F97316]' : 'text-[#94A3B8] border-transparent hover:text-[#334155]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div>
            <h2 className="font-heading font-extrabold text-3xl text-[#0F172A] tracking-tight">
              {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              {isSignUp ? 'Join the StructWise AI platform.' : 'Sign in to your engineering workspace.'}
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">person</span>
                  <input
                    type="text"
                    required={isSignUp}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-heading font-bold text-[#0F172A] uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-xs text-[#F97316] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">lock</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">lock_reset</span>
                  <input
                    type="password"
                    required={isSignUp}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition"
                  />
                </div>
              </div>
            )}

            {!isSignUp ? (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#F97316]"
                />
                <span className="text-xs text-[#334155]">Remember this device</span>
              </label>
            ) : (
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[#F97316]"
                />
                <span className="text-xs text-[#334155] leading-tight">
                  I agree to the Terms of Service and Privacy Policy for StructWise AI Platform.
                </span>
              </label>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full justify-center shadow-md py-3 mt-2"
              icon={isSignUp ? 'person_add' : 'login'}
              iconPosition="right"
              disabled={submitting}
            >
              {submitting
                ? 'Processing...'
                : isSignUp
                  ? 'Create Account & Access Workspace'
                  : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Toggle link */}
          <div className="pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
            {!isSignUp ? (
              <>Don't have an account?{' '}
                <button type="button" onClick={() => { setIsSignUp(true); setErrorMsg(''); }} className="font-bold text-[#F97316] hover:underline">
                  Create Your Account
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => { setIsSignUp(false); setErrorMsg(''); }} className="font-bold text-[#F97316] hover:underline">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 font-mono mt-4">
          StructWise AI Engine • AI-Powered Structural Intelligence for Reinforced Concrete Beams
        </div>
      </div>
    </div>
  );
}
