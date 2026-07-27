import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        if (password !== confirmPassword && confirmPassword.length > 0) {
          setError('Passwords do not match');
          return;
        }
        await register(fullName, email, password, 'Engineer');
        setIsSignUp(false);
        setError('Registration successful! Please sign in.');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex font-body">
      {/* Left Column - Hero & Structural Branding */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 bg-blueprint-dark border-r border-navy-700 overflow-hidden">
        {/* Top Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-lg bg-steel-500 flex items-center justify-center text-white font-bold shadow-lg border border-steel-400">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl tracking-tight text-white">
              STRUCTURA <span className="text-cyanAccent-500">AI</span>
            </h1>
            <p className="text-[10px] font-mono text-navy-300 uppercase tracking-widest">
              AI-Powered Structural Decision Support
            </p>
          </div>
        </div>

        {/* Middle Hero Copy */}
        <div className="max-w-xl space-y-7 z-10 my-auto">

          {/* Heading */}
          <h2 className="font-heading font-extrabold text-4xl xl:text-5xl text-white leading-[1.15] tracking-tight">
            Enhance Structural Engineering with <span className="text-transparent bg-clip-text bg-gradient-to-r from-steel-300 via-cyanAccent-400 to-white">Explainable AI</span>
          </h2>

          {/* Tagline */}
          <p className="text-navy-200 text-lg leading-relaxed font-body">
            AI-powered structural decision support for reinforced concrete beam evaluation.
          </p>
        </div>


        {/* Decorative Grid Graphic */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00A8CC" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00A8CC" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="50%" cy="50%" r="300" stroke="#4682B4" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      {/* Right Column - Auth Card Container */}
      <div className="w-full lg:w-5/12 bg-white text-navy-800 flex flex-col justify-between p-8 lg:p-14 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded bg-steel-500 flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <span className="font-heading font-bold text-lg text-navy-800">
            STRUCTURA <span className="text-steel-600">AI</span>
          </span>
        </div>

        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          {/* Card View Switcher Tabs */}
          <div className="flex border-b border-concrete-300">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`pb-3 px-4 text-sm font-heading font-bold transition-all relative ${!isSignUp
                ? 'text-steel-600 border-b-2 border-steel-500'
                : 'text-navy-400 hover:text-navy-700'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`pb-3 px-4 text-sm font-heading font-bold transition-all relative ${isSignUp
                ? 'text-steel-600 border-b-2 border-steel-500'
                : 'text-navy-400 hover:text-navy-700'
                }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Card Header */}
          {!isSignUp ? (
            <div>
              <h2 className="font-heading font-extrabold text-3xl text-navy-900 tracking-tight">
                Welcome Back!
              </h2>
            </div>
          ) : (
            <div>
              <h2 className="font-heading font-extrabold text-3xl text-navy-900 tracking-tight">
                Create Your Account
              </h2>
            </div>
          )}

          {error && (
            <div className={`p-3 rounded text-sm ${error.includes('successful') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required={isSignUp}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="username"
                    className="w-full pl-10 pr-4 py-2.5 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
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
                  placeholder="email id"
                  className="w-full pl-10 pr-4 py-2.5 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link sent to your registered email.');
                    }}
                    className="text-xs text-steel-600 hover:text-steel-800 font-medium"
                  >
                    Forgot password?
                  </a>
                )}
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
                  placeholder="password"
                  className="w-full pl-10 pr-4 py-2.5 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-lg">
                    lock_reset
                  </span>
                  <input
                    type="password"
                    required={isSignUp}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirm password"
                    className="w-full pl-10 pr-4 py-2.5 bg-concrete-50 border border-concrete-300 rounded text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            {!isSignUp ? (
              <div className="flex items-center justify-between pt-1">
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
            ) : (
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-steel-600 focus:ring-steel-500 border-concrete-300"
                  />
                  <span className="text-xs text-navy-600 leading-tight">
                    I agree to the Terms of Service and Privacy Policy for Structura AI Platform.
                  </span>
                </label>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md py-3 mt-2"
              icon={isSignUp ? 'person_add' : 'login'}
              iconPosition="right"
            >
              {isSignUp ? 'Create Account & Access Workspace' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Switch toggle footer link */}
          <div className="pt-4 border-t border-concrete-200 text-center">
            {!isSignUp ? (
              <p className="text-xs text-navy-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-steel-600 hover:underline"
                >
                  Create Your Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-navy-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-steel-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-navy-400 font-mono mt-4">
          Structura AI Engine • Enterprise Structural Analytics
        </div>
      </div>
    </div>
  );
}

