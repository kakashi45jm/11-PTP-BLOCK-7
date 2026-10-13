import React, { useState } from 'react';
import {
  X,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Phone,
  Compass,
  GraduationCap,
  ShieldCheck,
  Search,
  BookOpen,
  MapPin,
  Clock,
  Check,
  Eye,
  Radio,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { SchoolInfo, User } from '../types';
import { iosSound } from '../utils/iosSound';

export type IOSTheme = 'liquid-cyan' | 'deep-space' | 'cyber-aurora' | 'sunset-coral' | 'pure-crystal';
export type IOSFocusMode = 'Normal' | 'Study Focus' | 'Exam Mode';

interface IOSControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: IOSTheme;
  onSelectTheme: (theme: IOSTheme) => void;
  focusMode: IOSFocusMode;
  onSelectFocusMode: (mode: IOSFocusMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  schoolInfo: SchoolInfo;
  currentUser: User;
  onOpenAuth: () => void;
  onOpenSpotlight: () => void;
  onNavigate: (tab: string) => void;
}

export const IOSControlCenter: React.FC<IOSControlCenterProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  focusMode,
  onSelectFocusMode,
  soundEnabled,
  onToggleSound,
  schoolInfo,
  currentUser,
  onOpenAuth,
  onOpenSpotlight,
  onNavigate,
}) => {
  const [blurIntensity, setBlurIntensity] = useState<'ultra' | 'liquid'>('liquid');

  if (!isOpen) return null;

  const themes: { id: IOSTheme; name: string; gradient: string; dotColor: string }[] = [
    {
      id: 'liquid-cyan',
      name: 'Liquid Cyan Prism',
      gradient: 'from-cyan-500 via-blue-600 to-indigo-800',
      dotColor: 'bg-cyan-400',
    },
    {
      id: 'deep-space',
      name: 'Deep Space Vision',
      gradient: 'from-purple-600 via-indigo-900 to-slate-950',
      dotColor: 'bg-purple-400',
    },
    {
      id: 'cyber-aurora',
      name: 'Cyber Aurora',
      gradient: 'from-emerald-500 via-teal-700 to-blue-900',
      dotColor: 'bg-emerald-400',
    },
    {
      id: 'sunset-coral',
      name: 'Sunset Rose Gold',
      gradient: 'from-rose-500 via-amber-600 to-violet-900',
      dotColor: 'bg-rose-400',
    },
    {
      id: 'pure-crystal',
      name: 'Pure Crystal Glass',
      gradient: 'from-slate-200 via-blue-200 to-indigo-300',
      dotColor: 'bg-blue-300',
    },
  ];

  const focusModes: { id: IOSFocusMode; label: string; desc: string; icon: string }[] = [
    { id: 'Normal', label: 'All Active', desc: 'Standard classroom notifications & activities', icon: '✨' },
    { id: 'Study Focus', label: 'Study Focus', desc: 'Prioritizes current subject notes & room 304 timetable', icon: '📖' },
    { id: 'Exam Mode', label: 'Exam Mode', desc: 'Mutes alerts, elevates official DepEd guidelines', icon: '🎯' },
  ];

  const handleThemeChange = (t: IOSTheme) => {
    iosSound.playGlassChime();
    onSelectTheme(t);
  };

  const handleFocusChange = (m: IOSFocusMode) => {
    iosSound.playTap();
    onSelectFocusMode(m);
  };

  const handleSoundSwitch = () => {
    onToggleSound();
    iosSound.playToggle(!soundEnabled);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end sm:p-6 p-3 bg-black/60 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      {/* Control Center Panel with Liquid Glass aesthetic */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[2.5rem] bg-[#0c182e]/85 backdrop-blur-3xl border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] text-white p-6 space-y-6 relative ring-1 ring-white/20 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-white/20">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Control Center
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  iOS 27 Spatial
                </span>
              </div>
              <h3 className="font-bold text-lg text-white">System &amp; Experience</h3>
            </div>
          </div>
          <button
            onClick={() => {
              iosSound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2x2 Primary Toggles Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Audio Synthesizer */}
          <div
            onClick={handleSoundSwitch}
            className={`cursor-pointer p-4 rounded-3xl border transition-all flex flex-col justify-between h-28 ${
              soundEnabled
                ? 'bg-cyan-500/20 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-white/5 border-white/10 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-2xl ${soundEnabled ? 'bg-cyan-500 text-white shadow-md' : 'bg-white/10 text-white/60'}`}>
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${soundEnabled ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/10 text-white/40'}`}>
                {soundEnabled ? 'ON' : 'MUTED'}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Liquid Sound</h4>
              <p className="text-[11px] text-white/60">Spatial Web Audio haptics</p>
            </div>
          </div>

          {/* Spotlight Launcher */}
          <div
            onClick={() => {
              iosSound.playTap();
              onClose();
              onOpenSpotlight();
            }}
            className="cursor-pointer p-4 rounded-3xl bg-blue-500/20 border border-blue-400/40 hover:bg-blue-500/30 transition-all flex flex-col justify-between h-28 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-blue-500 text-white shadow-md">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                ⌘K
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Spotlight 27</h4>
              <p className="text-[11px] text-white/60">Instant portal search</p>
            </div>
          </div>
        </div>

        {/* Focus Mode Segmented Bar */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center justify-between">
            <span>Focus Mode</span>
            <span className="text-cyan-400 font-normal lowercase">current: {focusMode}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/10">
            {focusModes.map((fm) => (
              <button
                key={fm.id}
                onClick={() => handleFocusChange(fm.id)}
                className={`py-2 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                  focusMode === fm.id
                    ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{fm.icon}</span>
                <span className="truncate">{fm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wallpaper & Liquid Themes */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Liquid Mesh Wallpaper
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => handleThemeChange(th.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                  currentTheme === th.id
                    ? 'bg-white/15 border-cyan-400 ring-2 ring-cyan-400/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${th.gradient} shadow-md shrink-0 border border-white/20`} />
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{th.name}</div>
                  <div className="text-[10px] text-white/50">Dynamic Liquid</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* School Quick Contacts & Info */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              {schoolInfo.schoolName}
            </span>
            <span className="text-white/50 text-[10px]">Santa Barbara</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href="tel:+63756536329"
              className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <div className="truncate">
                <div className="text-[10px] text-emerald-400/80">Official Hotline</div>
                <div className="font-semibold text-[11px] truncate">+63 75 653 6329</div>
              </div>
            </a>
            <div
              onClick={() => {
                onClose();
                onNavigate('map');
              }}
              className="p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <div className="truncate">
                <div className="text-[10px] text-blue-400/80">Campus Map</div>
                <div className="font-semibold text-[11px] truncate">Bldg C - Rm 304</div>
              </div>
            </div>
          </div>
        </div>

        {/* Account & Role Switcher */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50">Current Access</div>
            <div className="text-sm font-bold text-white capitalize flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              {currentUser.title || currentUser.role}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5">
              Pass: Teacher/Pres: admin123 • Admin: cyratot23
            </div>
          </div>
          <button
            onClick={() => {
              iosSound.playTap();
              onClose();
              onOpenAuth();
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-colors"
          >
            Switch Role
          </button>
        </div>
      </div>
    </div>
  );
};
