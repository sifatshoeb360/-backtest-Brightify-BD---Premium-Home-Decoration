
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Contact: React.FC = () => {
  const { settings, addSubmission, t } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate database delay
    setTimeout(() => {
      addSubmission('contact', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{t('getInTouch')}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">{t('getInTouchText')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12 text-slate-800">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">{t('contactInfo')}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl text-violet-600"><Phone size={24} /></div>
                <div><h4 className="font-bold">{t('phoneLabel')}</h4><p className="text-slate-600">{settings.phoneNumber}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl text-violet-600"><Mail size={24} /></div>
                <div><h4 className="font-bold">{t('emailLabel')}</h4><p className="text-slate-600">{settings.contactEmail}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl text-violet-600"><MapPin size={24} /></div>
                <div><h4 className="font-bold">{t('officeAddress')}</h4><p className="text-slate-600">{settings.address}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
          {isSubmitted ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"><CheckCircle size={32} /></div>
              <h3 className="text-2xl font-bold mb-4">{t('messageSent')}</h3>
              <p className="text-slate-500 mb-8">{t('messageSentText')}</p>
              <button onClick={() => setIsSubmitted(false)} className="text-violet-600 font-bold hover:underline">{t('sendAnother')}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('nameLabel')}</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20 text-slate-800" placeholder={t('nameLabel')} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('emailLabel')}</label>
                  <input required type="email" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20 text-slate-800" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('phoneLabel')}</label>
                <input required type="tel" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20 text-slate-800" placeholder="01XXXXXXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('messageLabel')}</label>
                <textarea required rows={5} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20 resize-none text-slate-800" placeholder="..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-violet-600 text-white p-5 rounded-2xl font-bold shadow-lg hover:bg-violet-700 transition-all flex items-center justify-center gap-3">
                {isSubmitting ? <><Loader2 className="animate-spin" /> {t('sending')}</> : <><Send size={20} /> {t('sendMessage')}</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
