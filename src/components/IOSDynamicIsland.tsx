import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Bell,
  Volume2,
  Calendar,
  Users,
  ChevronUp,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';
import { ScheduleEntry, SchoolInfo } from '../types';
import { iosSound } from '../utils/iosSound';

interface IOSDynamicIslandProps {
  scheduleEntries: ScheduleEntry[];
  schoolInfo: SchoolInfo;
  onNavigate: (tab: string) => void;
  activeFocusMode?: string;
}

export const IOSDynamicIsland: React.FC<IOSDynamicIslandProps> = ({
  scheduleEntries,
  schoolInfo,
  onNavigate,
  activeFocusMode = 'Normal',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(45);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      // Simulate live period progression based on seconds of current minute
      const sec = now.getSeconds();
      setProgressPercent(Math.min(100, Math.max(15, Math.floor((sec / 60) * 100))));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine current day & active class
  const dayNames: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  const dayIndex = new Date().getDay();
  const currentDay = dayIndex >= 1 && dayIndex <= 5 ? dayNames[dayIndex - 1] : 'Monday';
  
  const todayClasses = scheduleEntries.filter((e) => e.day === currentDay);
  const currentClass = todayClasses[0] || {
    subject: 'Practical Research 1',
    teacher: 'Eliza P. Zarate',
    room: 'Bldg C - Rm 304',
    displayTime: '07:15 - 08:45 AM',
  };
  const nextClass = todayClasses[1] || {
    subject: 'Empowerment Technologies',
    teacher: 'Mark Anthony C. De Vera',
    room: 'ICT Computer Lab',
    displayTime: '08:45 - 09:45 AM',
  };

  const handleToggle = () => {
    iosSound.playTap();
    setIsExpanded((prev) => !prev);
  };

  const handleRingBell = (e: React.MouseEvent) => {
    e.stopPropagation();
    iosSound.playSchoolBell();
  };

  return (
    <div className="fixed top-2.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto">
      {/* Dynamic Island Container with Liquid Morphing Animation */}
      <div
        onClick={handleToggle}
        className={`group relative cursor-pointer select-none overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded
            ? 'w-[92vw] max-w-lg rounded-3xl p-5 bg-[#091528]/95 border border-cyan-400/30 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.35)] backdrop-blur-3xl ring-1 ring-white/20'
            : 'h-9 px-4 rounded-full bg-[#071322]/85 hover:bg-[#0b1c33]/90 border border-white/20 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] backdrop-blur-2xl hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }`}
      >
        {/* Subtle Liquid Prismatic Sheen Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        {!isExpanded ? (
          /* Compact Island Pill View */
          <div className="flex items-center justify-between gap-3 h-full text-xs font-medium text-white tracking-tight">
            {/* Left Pill: Live Indicator & Active Subject */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
              </span>
              <span className="font-semibold text-cyan-200 truncate max-w-[140px] sm:max-w-[200px]">
                {currentClass.subject}
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-white/70 hidden sm:inline text-[11px]">
                {currentClass.room || 'Rm 304'}
              </span>
            </div>

            {/* Right Pill: Weather / Time / Audio Ring */}
            <div className="flex items-center gap-2 text-white/80">
              <span className="text-[11px] text-cyan-300 font-mono hidden md:inline">
                {currentTime || '10:45 AM'}
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>iOS 27</span>
              </div>
            </div>
          </div>
        ) : (
          /* Expanded Island Live Activity Card View */
          <div className="space-y-4 text-white">
            {/* Header: Title & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-white/20">
                  <Radio className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
                      Live Classroom Activity
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      {activeFocusMode} Focus
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {schoolInfo.gradeLevel} • {schoolInfo.section}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRingBell}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 transition-colors"
                  title="Test School Bell Tone"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                  title="Minimize"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Class Status */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30 text-[11px]">
                    Current Session
                  </span>
                  <span className="text-white/60">{currentClass.displayTime}</span>
                </div>
                <span className="text-cyan-300 font-mono text-[11px] font-bold">
                  {progressPercent}% Complete
                </span>
              </div>

              <div>
                <h5 className="font-bold text-base text-white tracking-tight">
                  {currentClass.subject}
                </h5>
                <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
                  <span>Instructor: <strong className="text-white">{currentClass.teacher}</strong></span>
                  <span>•</span>
                  <span className="text-cyan-300">{currentClass.room || 'Room 304'}</span>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_#06b6d4]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Next Class Preview */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white/50">Next:</span>
                <span className="font-medium text-white/90">{nextClass.subject}</span>
              </div>
              <span className="text-white/50 text-[11px]">{nextClass.displayTime}</span>
            </div>

            {/* Live Environment Pills */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-white/80">Sta. Barbara, Pangasinan</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-mono text-white/90">{currentTime}</span>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  iosSound.playTap();
                  setIsExpanded(false);
                  onNavigate('schedule');
                }}
                className="py-2 px-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-400/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Timetable</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  iosSound.playTap();
                  setIsExpanded(false);
                  onNavigate('map');
                }}
                className="py-2 px-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Campus Map</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  iosSound.playTap();
                  setIsExpanded(false);
                  onNavigate('students');
                }}
                className="py-2 px-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>36 Students</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
