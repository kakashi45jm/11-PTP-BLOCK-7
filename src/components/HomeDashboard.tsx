import React, { useState } from 'react';
import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  MessageSquare,
  Bell,
  Clock,
  Sparkles,
  Edit3,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Layers,
  Award,
  Phone,
  Radio,
  Volume2,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { SchoolInfo, ScheduleEntry, Announcement, User } from '../types';
import { HolographicIDCard } from './HolographicIDCard';
import { iosSound } from '../utils/iosSound';

interface HomeDashboardProps {
  schoolInfo: SchoolInfo;
  onUpdateSchoolInfo: (info: Partial<SchoolInfo>) => void;
  scheduleEntries: ScheduleEntry[];
  announcements: Announcement[];
  studentCount: number;
  teacherCount: number;
  subjectCount: number;
  currentUser: User;
  onNavigate: (tab: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  scheduleEntries,
  announcements,
  studentCount,
  teacherCount,
  subjectCount,
  currentUser,
  onNavigate,
}) => {
  // Current day of week
  const currentDayOfWeek = new Date().getDay();
  const dayNames: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  const defaultSelectedDay =
    currentDayOfWeek >= 1 && currentDayOfWeek <= 5
      ? dayNames[currentDayOfWeek - 1]
      : 'Monday';

  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>(
    defaultSelectedDay
  );

  // Edit School Details Modal State (Admin)
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [editSchoolName, setEditSchoolName] = useState(schoolInfo.schoolName);
  const [editSchoolYear, setEditSchoolYear] = useState(schoolInfo.schoolYear);
  const [editMotto, setEditMotto] = useState(schoolInfo.motto);
  const [editContactNumber, setEditContactNumber] = useState(schoolInfo.contactNumber || '+63 75 653 6329');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSchoolInfo = (e: React.FormEvent) => {
    e.preventDefault();
    iosSound.playGlassChime();
    onUpdateSchoolInfo({
      schoolName: editSchoolName,
      schoolYear: editSchoolYear,
      motto: editMotto,
      contactNumber: editContactNumber,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingSchool(false);
    }, 700);
  };

  // Filter today's timetable
  const todayClasses = scheduleEntries.filter((entry) => entry.day === selectedDay);

  const quickWidgets = [
    {
      id: 'schedule',
      title: 'Class Schedule',
      kicker: 'Second Term Timetable',
      desc: 'Weekly subjects, room assignments & breaks',
      icon: Calendar,
      accent: 'from-blue-500 to-cyan-500',
      badge: `${scheduleEntries.length} periods`,
    },
    {
      id: 'students',
      title: 'Student Directory',
      kicker: 'Enrolled Records',
      desc: `${studentCount} official Block 7 student records`,
      icon: Users,
      accent: 'from-emerald-500 to-teal-500',
      badge: `${studentCount} learners`,
    },
    {
      id: 'teachers',
      title: 'Faculty Members',
      kicker: 'Department Faculty',
      desc: `${teacherCount} subject instructors & adviser`,
      icon: GraduationCap,
      accent: 'from-purple-500 to-indigo-500',
      badge: `${teacherCount} faculty`,
    },
    {
      id: 'subjects',
      title: 'Curriculum & Units',
      kicker: 'Technical-Vocational Track',
      desc: `${subjectCount} technical, applied & core subjects`,
      icon: BookOpen,
      accent: 'from-amber-500 to-orange-500',
      badge: `${subjectCount} subjects`,
    },
    {
      id: 'map',
      title: 'Campus Map',
      kicker: 'Santa Barbara, Pangasinan',
      desc: 'GPS 16.00146, 120.39953 • Bldg C, Rm 304',
      icon: MapPin,
      accent: 'from-rose-500 to-pink-500',
      badge: 'Interactive GPS',
    },
    {
      id: 'messages',
      title: 'Class Messages',
      kicker: 'Digital Discussion',
      desc: 'Real-time section chat & instant notices',
      icon: MessageSquare,
      accent: 'from-cyan-500 to-sky-500',
      badge: 'Live Board',
    },
  ];

  return (
    <div className="space-y-8 pb-28 text-white">
      {/* Top Hero: Liquid Glass Command Center */}
      <div className="relative rounded-[2.5rem] p-6 sm:p-10 ios-glass-card overflow-hidden shadow-[0_25px_60px_-15px_rgba(6,182,212,0.25)] border border-white/20">
        {/* Dynamic Liquid Glass Ambient Mesh */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none animate-liquid-1" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none animate-liquid-2" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3 max-w-2xl">
            {/* Liquid Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>DepEd Region I • Pangasinan Division II</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">iOS 27 Liquid Spatial</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Grade 11 • PTP Block 7
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Official Digital Portal for <strong className="text-cyan-300">{schoolInfo.schoolName}</strong>.
              Second Term, School Year {schoolInfo.schoolYear}. Section Adviser: <strong className="text-white">{schoolInfo.adviser}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-white/70">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Maramba St, Santa Barbara, Pangasinan</span>
              </div>
              <a
                href="tel:+63756536329"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+63 75 653 6329</span>
              </a>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setIsEditingSchool(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-all cursor-pointer font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Edit Details</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive 3D Holographic ID Card widget */}
          <div className="w-full lg:w-auto shrink-0">
            <HolographicIDCard currentUser={currentUser} schoolInfo={schoolInfo} />
          </div>
        </div>
      </div>

      {/* Live Classroom Status & Bell Bar */}
      <div className="p-4 sm:p-5 rounded-3xl ios-glass-card flex flex-col md:flex-row items-center justify-between gap-4 border border-white/15">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Current Timetable Status
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-white/80 font-medium">Room 304, Building C</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Second Term Daily Sessions • Regular Timetable Active
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              iosSound.playSchoolBell();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-semibold transition-all cursor-pointer"
            title="Play school bell harmonic"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Chime Bell</span>
          </button>

          <button
            onClick={() => {
              iosSound.playTap();
              onNavigate('schedule');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <span>Full Timetable</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 6 iOS 27 Liquid Glass Feature Widgets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              System Applications
            </h2>
            <p className="text-xs text-white/60">
              Grade 11 Technical-Vocational &amp; Academic modules
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-medium">iOS 27 Spatial Suite</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickWidgets.map((w) => {
            const Icon = w.icon;
            return (
              <div
                key={w.id}
                onClick={() => {
                  iosSound.playTap();
                  onNavigate(w.id);
                }}
                className="group relative p-6 rounded-[2rem] ios-glass-card hover:bg-white/[0.12] border border-white/15 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_20px_40px_-10px_rgba(6,182,212,0.25)] flex flex-col justify-between h-56 ios-pressable"
              >
                {/* Top header row */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${w.accent} flex items-center justify-center text-white shadow-lg border border-white/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 text-[10px] font-semibold">
                    {w.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    {w.kicker}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2">
                    {w.desc}
                  </p>
                </div>

                {/* Bottom link indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Application</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timetable Interactive Day Viewer */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] ios-glass-card border border-white/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Weekly Timetable
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Schedule Overview for {selectedDay}
            </h2>
          </div>

          {/* iOS 27 Liquid Segmented Day Tabs */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-black/40 border border-white/10 overflow-x-auto">
            {dayNames.map((day) => (
              <button
                key={day}
                onClick={() => {
                  iosSound.playTap();
                  setSelectedDay(day);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedDay === day
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Classes List */}
        {todayClasses.length === 0 ? (
          <div className="py-12 text-center text-white/50 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-white/30" />
            <p className="text-sm">No regular classes scheduled for {selectedDay}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayClasses.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 space-y-2.5 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30">
                    {item.displayTime}
                  </span>
                  <span className="text-white/60 text-[11px]">{item.room || 'Room 304'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.subject}</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    Instructor: <strong className="text-white">{item.teacher}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest Announcements Liquid Glass Carousel */}
      {announcements.length > 0 && (
        <div className="p-6 sm:p-8 rounded-[2.5rem] ios-glass-card border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Official Updates
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Class Announcements</h2>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-cyan-300 hover:text-white font-semibold transition-colors"
            >
              View All ({announcements.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                onClick={() => onNavigate('announcements')}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 space-y-2 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-semibold">
                    {ann.category}
                  </span>
                  <span className="text-white/50 text-[11px]">{ann.date}</span>
                </div>
                <h3 className="font-bold text-base text-white">{ann.title}</h3>
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="text-[11px] text-white/50 pt-1">
                  By: <strong className="text-white">{ann.author}</strong> ({ann.authorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {isEditingSchool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setIsEditingSchool(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl ios-glass-card p-6 border border-white/20 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Edit School Information</h3>
              <button
                onClick={() => setIsEditingSchool(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchoolInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={editSchoolName}
                  onChange={(e) => setEditSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  School Year
                </label>
                <input
                  type="text"
                  value={editSchoolYear}
                  onChange={(e) => setEditSchoolYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Official Hotline
                </label>
                <input
                  type="text"
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Motto / Description
                </label>
                <textarea
                  value={editMotto}
                  onChange={(e) => setEditMotto(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>School details successfully updated!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSchool(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
