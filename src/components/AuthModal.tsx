import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  GraduationCap,
  ShieldAlert,
  Lock,
  X,
  CheckCircle,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  LogOut,
  Info,
} from 'lucide-react';
import { User as UserType, Role } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onSelectUser: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'president' | 'admin'>('president');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentialsReference, setShowCredentialsReference] = useState(true);

  if (!isOpen) return null;

  const roleOptions: {
    key: 'teacher' | 'president' | 'admin';
    title: string;
    personName: string;
    desc: string;
    expectedPassword: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      key: 'president',
      title: 'Class President',
      personName: 'John Carlo C. Bautista',
      desc: 'Student leader access (View schedule, participate in chat, edit own bio)',
      expectedPassword: 'admin123',
      icon: User,
      color: '#1e40af',
    },
    {
      key: 'teacher',
      title: 'Teacher / Faculty',
      personName: 'Eliza P. Zarate',
      desc: 'Faculty access (Publish announcements, consultation channels, view roster)',
      expectedPassword: 'admin123',
      icon: GraduationCap,
      color: '#1d4ed8',
    },
    {
      key: 'admin',
      title: 'Administrator',
      personName: 'Principal / Registrar Admin',
      desc: 'Full administrative control (Edit schedule, unmask IDs, update school map)',
      expectedPassword: 'cyratot23',
      icon: ShieldAlert,
      color: '#0f172a',
    },
  ];

  const currentOption = roleOptions.find((r) => r.key === selectedRole) || roleOptions[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await api.login(selectedRole, password);
      if (result.success && result.user) {
        onSelectUser(result.user);
        setSuccessMessage(`Welcome back, ${result.user.name}!`);
        setPassword('');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 500);
      } else {
        setErrorMessage(result.error || 'Incorrect password. Please try again.');
      }
    } catch {
      setErrorMessage('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillPassword = (pass: string) => {
    setPassword(pass);
    setErrorMessage(null);
  };

  const handleLogout = () => {
    const guestUser: UserType = {
      id: 'guest',
      name: 'Guest Visitor',
      email: 'visitor@school.edu.ph',
      role: 'guest',
      title: 'Visitor / Public View',
      avatar: '#64748b',
      canEdit: false,
    };
    onSelectUser(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-in fade-in">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0f294a]">
                Sign In to Section Portal
              </h3>
              <p className="text-xs text-gray-500">
                Grade 11 - PTP Block 7 Security Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Logged In Status Banner */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
              style={{ backgroundColor: currentUser.avatar || '#1e40af' }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 truncate">
              <div className="font-bold text-gray-800 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-gray-500 capitalize">Active Role: {currentUser.role}</div>
            </div>
          </div>
          {currentUser.role !== 'guest' && (
            <button
              onClick={handleLogout}
              className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer hover:underline"
              title="Log out of current account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-1.5 mb-4">
          <label className="block text-xs font-semibold text-gray-700 uppercase">
            Select Account to Sign In:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map((opt) => {
              const isSelected = selectedRole === opt.key;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(opt.key);
                    setPassword('');
                    setErrorMessage(null);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs ${
                      isSelected ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-[11px] leading-tight">{opt.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Account Summary Card */}
        <div className="mb-4 p-3 rounded-xl border border-blue-200 bg-blue-50/40 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-blue-950 text-xs">
              {currentOption.personName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
              {currentOption.key}
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">
            {currentOption.desc}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Enter Password for {currentOption.title}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter password..."
                required
                className="w-full pl-3 pr-10 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
          >
            {isSubmitting ? 'Verifying...' : `Sign In as ${currentOption.title}`}
          </button>
        </form>

        {/* Credentials Reference Accordion / Notice */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-700 flex items-center gap-1.5 text-[11px]">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Saved Passwords Reference:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowCredentialsReference(!showCredentialsReference)}
              className="text-[10px] text-blue-600 hover:underline cursor-pointer font-medium"
            >
              {showCredentialsReference ? 'Hide' : 'Show'}
            </button>
          </div>

          {showCredentialsReference && (
            <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Teacher:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('teacher');
                    handleQuickFillPassword('admin123');
                  }}
                  className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-blue-700 hover:bg-blue-50 cursor-pointer"
                  title="Click to auto-fill for Teacher"
                >
                  admin123
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">President:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('president');
                    handleQuickFillPassword('admin123');
                  }}
                  className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-blue-700 hover:bg-blue-50 cursor-pointer"
                  title="Click to auto-fill for President"
                >
                  admin123
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Admin:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    handleQuickFillPassword('cyratot23');
                  }}
                  className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-amber-700 hover:bg-amber-50 cursor-pointer"
                  title="Click to auto-fill for Admin"
                >
                  cyratot23
                </button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Saved for standalone, local, and hosting platforms (e.g. Vercel, Netlify).
          </p>
        </div>
      </div>
    </div>
  );
};
