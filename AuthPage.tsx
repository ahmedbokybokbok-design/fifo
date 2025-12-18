
import React, { useState } from 'react';
import { Pill, UserPlus, LogIn, Lock, Phone, Building2, MapPin, FileText, Store } from 'lucide-react';
import { RegistrationRequest } from '../types';

interface AuthPageProps {
  onLogin: (phone: string, pass: string) => void;
  onRegister: (data: Partial<RegistrationRequest>) => void;
  error?: string;
  successMsg?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, error, successMsg }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regType, setRegType] = useState<'PHARMACY' | 'WAREHOUSE'>('PHARMACY');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regLocation, setRegLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(loginPhone, loginPass);
    } else {
      onRegister({
        name: regName,
        type: regType,
        contactPhone: regPhone,
        password: regPass, // In real app, never store plain text
        licenseNumber: regLicense,
        location: regLocation,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-teal-200">
          <Pill size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dawaa<span className="text-orange-500">Connect</span></h1>
          <p className="text-sm text-gray-500 font-medium tracking-wide">منصة الدواء الموحدة</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-md border border-gray-100">
        {/* Toggle Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${isLogin ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            تسجيل الدخول
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${!isLogin ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6 text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-bold mb-6 text-center animate-in fade-in slide-in-from-top-2">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setRegType('PHARMACY')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${regType === 'PHARMACY' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-400'}`}
                  >
                    <Store size={20} />
                    <span className="text-xs font-bold">صيدلية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType('WAREHOUSE')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${regType === 'WAREHOUSE' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-400'}`}
                  >
                    <Building2 size={20} />
                    <span className="text-xs font-bold">مخزن</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Store className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="اسم المنشأة"
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-right"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <FileText className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="رقم الترخيص"
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-right"
                      value={regLicense}
                      onChange={e => setRegLicense(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="العنوان"
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-right"
                      value={regLocation}
                      onChange={e => setRegLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Phone className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="tel" 
                placeholder="رقم الهاتف"
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-right font-sans"
                dir="ltr"
                value={isLogin ? loginPhone : regPhone}
                onChange={e => isLogin ? setLoginPhone(e.target.value) : setRegPhone(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="كلمة المرور"
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-right font-sans"
                dir="ltr"
                value={isLogin ? loginPass : regPass}
                onChange={e => isLogin ? setLoginPass(e.target.value) : setRegPass(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2"
            >
              {isLogin ? (
                <>
                  <LogIn size={20} />
                  دخول
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  تسجيل حساب جديد
                </>
              )}
            </button>
          </form>
        </div>
        
        {isLogin && (
          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              للتجربة: الادمن (01000000000 / admin123)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
