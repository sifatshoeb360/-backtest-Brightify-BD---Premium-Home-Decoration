
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register, t } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (login(email, password)) {
        navigate(-1);
      } else {
        setError('Invalid email or password');
      }
    } else {
      register(name, email, password);
      navigate(-1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{isLogin ? t('login') : t('signup')}</h1>
          <p className="text-slate-500 text-sm">{isLogin ? 'Enter your credentials to access your account' : 'Join us for a premium shopping experience'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="text" className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" placeholder="Abdullah" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required type="email" className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required type="password" className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-bold ml-1">{error}</p>}

          <button type="submit" className="w-full bg-violet-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-violet-700 transition-all flex items-center justify-center gap-2 mt-4">
            {isLogin ? t('login') : t('createAccount')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors">
            {isLogin ? <>{t('noAccount')} <span className="font-bold text-violet-600">{t('signup')}</span></> : <>{t('alreadyAccount')} <span className="font-bold text-violet-600">{t('login')}</span></>}
          </button>
        </div>

        <Link to="/" className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 mt-8 w-full text-xs font-bold">
           <ArrowLeft size={14} /> Back to browsing
        </Link>
      </div>
    </div>
  );
};
