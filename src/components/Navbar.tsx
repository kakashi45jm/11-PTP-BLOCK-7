import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  MessageSquare,
  Bell,
  Home,
  User,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Layers,
  Search,
  Sliders,
  Wifi,
  Battery,
  Sparkles,
} from 'lucide-react';
import { User as UserType } from '../types';
import { iosSound } from '../utils/iosSound';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserType;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenControlCenter?: () => void;
  onOpenSpotlight?: () => void;
  unreadCount?: number;
  unreadAnnouncements?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenControlCenter,
  onOpenSpotlight,
  unreadCount = 0,
  unreadAnnouncements = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clockString, setClockString] = useState('10:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'section', label: 'Block 7', icon: Layers },
    { id: 'schedule', label: 'Timetable', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Faculty', icon: GraduationCap },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'map', label: 'Campus Map', icon: MapPin },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { id: 'announcements', label: 'Announcements', icon: Bell, badge: unreadAnnouncements },
  ];

  const handleNavClick = (tabId: string) => {
    iosSound.playTap();
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 text-white select-none">
      {/* iOS 27 System Status Bar */}
      <div className="bg-[#050d1a]/85 backdrop-blur-xl border-b border-white/10 px-4 py-1 text-xs text-white/80 flex justify-between items-center">
        {/* Left: Time & Location */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-tight">{clockString}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/70 text-[11px] hidden sm:inline">Santa Barbara, Pangasinan</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-cyan-400 text-[11px] font-medium hidden md:inline">DMNHS Portal</span>
        </div>

        {/* Right: iOS System Indicators & Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Spotlight Search Launcher */}
          {onOpenSpotlight && (
            <button
              onClick={() => {
                iosSound.playTap();
                onOpenSpotlight();
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors text-[11px] font-medium cursor-pointer border border-white/10"
              title="Open Spotlight Search (⌘K)"
            >
              <Search className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[9px] bg-white/20 px-1 rounded font-mono text-white/80">⌘K</kbd>
            </button>
          )}

          {/* Control Center Trigger */}
          {onOpenControlCenter && (
            <button
              onClick={() => {
                iosSound.playTap();
                onOpenControlCenter();
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 transition-colors text-[11px] font-medium cursor-pointer border border-cyan-400/30"
              title="iOS 27 Control Center"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Controls</span>
            </button>
          )}

          {/* Wifi & Battery Icon */}
          <div className="flex items-center gap-1.5 text-white/70 pl-1 border-l border-white/10">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-white/80">100%</span>
              <div className="w-5 h-2.5 rounded-sm border border-white/40 p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Liquid Glass Bar */}
      <div className="ios-glass border-b border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand with Liquid Squircles */}
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-cyan-500/25 border border-white/30 group-hover:scale-105 transition-transform">
                P7
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                    GRADE 11 • PTP BLOCK 7
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold uppercase tracking-wider">
                    iOS 27
                  </span>
                </div>
                <span className="text-xs text-white/60 font-medium">
                  Daniel Maramba NHS • Second Term S.Y. 2024-2025
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner border border-white/30 ring-1 ring-cyan-400/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Account Switcher & Profile Badge */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  iosSound.playTap();
                  onOpenAuth();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-xs font-semibold cursor-pointer shadow-sm hover:border-cyan-400/40"
                title="Switch Role: Teacher (admin123), President (admin123), Admin (cyratot23)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="capitalize">
                  {currentUser.title?.includes('President') ? 'President' : currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              <button
                onClick={() => {
                  iosSound.playTap();
                  onOpenProfile();
                }}
                className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/30 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-md"
                title={currentUser.name}
              >
                <User className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  iosSound.playTap();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="xl:hidden p-2 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden ios-glass border-b border-white/20 p-4 space-y-1 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/30 text-white border border-cyan-400/40 shadow-sm'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
