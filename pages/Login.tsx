
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, CheckCircle, ShieldAlert, Loader2, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Recovery states
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  
  const { login, register, sendMockEmail, t } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      if (login(email, password)) {
        navigate(-1);
      } else {
        setError('Invalid email or password');
      }
    } else if (view === 'signup') {
      register(name, email, password);
      navigate(-1);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    setError('');
    
    // Simulate API call for password reset
    setTimeout(() => {
      sendMockEmail(email, "Password Reset - Brightify BD", "Hello! You requested a password reset. Click the link below to set a new password.");
      setIsRecovering(false);
      setRecoverySent(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        
        {/* VIEW: LOGIN or SIGNUP */}
        {(view === 'login' || view === 'signup') && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                {view === 'login' ? t('login') : t('signup')}
              </h1>
              <p className="text-slate-500 text-sm">
                {view === 'login' 
                  ? 'Enter your credentials to access your account' 
                  : 'Join us for a premium shopping experience'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {view === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required 
                      type="text" 
                      className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" 
                      placeholder="Abdullah" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required 
                    type="email" 
                    className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" 
                    placeholder="user@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('password')}</label>
                  {view === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setView('forgot')}
                      className="text-[10px] font-bold text-violet-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    className="w-full pl-12 pr-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-rose-500 font-bold ml-1">{error}</p>}

              <button type="submit" className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-violet-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4">
                {view === 'login' ? t('login') : t('createAccount')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); setShowPassword(false); }} className="text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors">
                {view === 'login' 
                  ? <>{t('noAccount')} <span className="font-bold text-violet-600">{t('signup')}</span></> 
                  : <>{t('alreadyAccount')} <span className="font-bold text-violet-600">{t('login')}</span></>}
              </button>
            </div>
          </>
        )}

        {/* VIEW: FORGOT PASSWORD */}
        {view === 'forgot' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Account Recovery</h1>
              <p className="text-slate-500 text-sm">Enter your email and we'll send a reset link</p>
            </div>

            {recoverySent ? (
              <div className="space-y-6 text-center">
                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col items-center">
                  <CheckCircle size={40} className="text-emerald-500 mb-4" />
                  <p className="text-sm font-bold text-emerald-800">Recovery email sent successfully!</p>
                  <p className="text-xs text-emerald-600/70 mt-1">Please check your inbox (and spam folder).</p>
                </div>
                <button 
                  onClick={() => { setView('login'); setRecoverySent(false); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" 
                    placeholder="your-registered@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isRecovering}
                  className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-violet-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isRecovering ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                  {isRecovering ? 'Processing...' : 'Send Recovery Link'}
                </button>
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel and Return
                </button>
              </form>
            )}
          </div>
        )}

        <Link to="/" className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 mt-10 w-full text-[10px] font-black uppercase tracking-[0.2em]">
           <ArrowLeft size={14} /> Back to browsing
        </Link>
      </div>
    </div>
  );
};
