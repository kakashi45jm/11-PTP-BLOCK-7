import React from 'react';
import {
  Home,
  Layers,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  MessageSquare,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import { iosSound } from '../utils/iosSound';

interface IOSDockProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadMessages?: number;
  unreadAnnouncements?: number;
}

export const IOSDock: React.FC<IOSDockProps> = ({
  currentTab,
  setCurrentTab,
  unreadMessages = 0,
  unreadAnnouncements = 0,
}) => {
  const dockItems = [
    { id: 'dashboard', label: 'Home', icon: Home, color: 'text-cyan-400' },
    { id: 'section', label: 'Block 7', icon: Layers, color: 'text-blue-400' },
    { id: 'schedule', label: 'Timetable', icon: Calendar, color: 'text-indigo-400' },
    { id: 'students', label: 'Students', icon: Users, color: 'text-emerald-400' },
    { id: 'teachers', label: 'Faculty', icon: GraduationCap, color: 'text-purple-400' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, color: 'text-amber-400' },
    { id: 'map', label: 'Campus Map', icon: MapPin, color: 'text-rose-400' },
    { id: 'messages', label: 'Chat', icon: MessageSquare, color: 'text-sky-400', badge: unreadMessages },
    { id: 'announcements', label: 'News', icon: Bell, color: 'text-pink-400', badge: unreadAnnouncements },
    { id: 'profile', label: 'ID Card', icon: UserIcon, color: 'text-violet-400' },
  ];

  const handleSelect = (id: string) => {
    iosSound.playTap();
    setCurrentTab(id);
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[96vw]">
      {/* Floating Liquid Glass Dock Container */}
      <div className="relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-[2rem] ios-dock-glass flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Prismatic edge reflection */}
        <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`group relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl transition-all duration-300 ease-out cursor-pointer select-none ${
                isActive
                  ? 'bg-white/20 text-white scale-110 -translate-y-1 shadow-[0_10px_20px_rgba(6,182,212,0.3)] ring-1 ring-white/40'
                  : 'text-white/65 hover:text-white hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5'
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-colors ${isActive ? 'text-cyan-300' : ''}`} />

              {/* Active Liquid Dot */}
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              )}

              {/* Badge for Messages / News */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-lg border border-white/40">
                  {item.badge}
                </span>
              )}

              {/* Floating Tooltip on Hover */}
              <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-black/80 text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 hidden sm:block">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
