import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('e.vance@precisionlabs.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex font-body">
      {/* Left Column - High Precision Structural Branding */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 bg-blueprint-dark border-r border-navy-700 overflow-hidden">
        {/* Top Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded bg-steel-500 flex items-center justify-center text-white font-bold shadow-lg border border-steel-400">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl tracking-tight text-white">
              STRUCTURA <span className="text-cyanAccent-400">AI</span>
            </h1>
            <p className="text-[10px] font-mono text-navy-300 uppercase tracking-widest">
              AI-Powered Structural Decision Support
            </p>
          </div>
        </div>

        {/* Middle Hero Copy */}
        <div className="max-w-xl space-y-6 z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanAccent-900/60 border border-cyanAccent-500/40 text-cyanAccent-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyanAccent-400 animate-pulse"></span>
            Version 4.2.1-stable • Eurocode & AISC LRFD Certified
          </div>
          <h2 className="font-heading font-extrabold text-4xl xl:text-5xl text-white leading-tight">
            Accelerate Structural Engineering with <span className="text-transparent bg-clip-text bg-gradient-to-r from-steel-300 via-cyanAccent-400 to-white">Explainable AI</span>
          </h2>
          <p className="text-navy-200 text-base leading-relaxed">
            Perform real-time section optimization, FEA stress validation, and SHAP explainable decision intelligence for high-stakes enterprise projects.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-700/80">
            <div>
              <p className="font-heading font-bold text-2xl text-cyanAccent-400">18.4%</p>
              <p className="text-xs font-mono text-navy-300">Avg Weight Reduction</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-steel-400">100%</p>
              <p className="text-xs font-mono text-navy-300">AISC 360 LRFD Check</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-emerald-400">&lt; 200ms</p>
              <p className="text-xs font-mono text-navy-300">ML Inference Speed</p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-xs text-navy-400 z-10 font-mono">
          <span>© 2026 Precision Structural Intelligence Inc.</span>
          <span>Security Level: Enterprise Grade (ISO 27001)</span>
        </div>

        {/* Decorative Grid SVG Graphic */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00A8CC" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00A8CC" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="50%" cy="50%" r="300" stroke="#4682B4" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      {/* Right Column - Login Form Container */}
      <div className="w-full lg:w-5/12 bg-white text-navy-800 flex flex-col justify-between p-8 lg:p-14">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded bg-steel-500 flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <span className="font-heading font-bold text-lg text-navy-800">
            STRUCTURA <span className="text-steel-600">AI</span>
          </span>
        </div>

        <div className="my-auto max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="font-heading font-extrabold text-3xl text-navy-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-navy-500 mt-2">
              Sign in with your enterprise credentials to access active calculations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }} className="text-xs text-steel-600 hover:text-steel-800 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-steel-600 focus:ring-steel-500 border-concrete-300"
                />
                <span className="text-xs text-navy-600">Remember this device</span>
              </label>
              <span className="text-[11px] font-mono text-cyanAccent-600 bg-cyanAccent-50 px-2 py-0.5 rounded">
                SSO Enabled
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md py-3"
              icon="login"
              iconPosition="right"
            >
              Login to Console
            </Button>
          </form>

          <div className="pt-4 border-t border-concrete-200 text-center">
            <p className="text-xs text-navy-500">
              Need access for your engineering team?{' '}
              <a href="#request" onClick={(e) => { e.preventDefault(); alert('Request sent! An administrator will contact your engineering leads.'); }} className="font-semibold text-steel-600 hover:underline">
                Request Console Access
              </a>
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-navy-400 font-mono">
          Structura AI Engine v4.2 • Precision Systems
        </div>
      </div>
    </div>
  );
}
