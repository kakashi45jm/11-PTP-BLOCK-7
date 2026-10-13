import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  MapPin,
  Bell,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Student, Teacher, Subject, Announcement, ScheduleEntry } from '../types';
import { iosSound } from '../utils/iosSound';

interface IOSSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  announcements: Announcement[];
  scheduleEntries: ScheduleEntry[];
  onNavigate: (tab: string, targetId?: string) => void;
}

export const IOSSpotlight: React.FC<IOSSpotlightProps> = ({
  isOpen,
  onClose,
  students,
  teachers,
  subjects,
  announcements,
  scheduleEntries,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items
  const cleanQuery = query.toLowerCase().trim();

  const matchedStudents = cleanQuery
    ? students
        .filter(
          (s) =>
            s.fullName.toLowerCase().includes(cleanQuery) ||
            s.studentNumber.toLowerCase().includes(cleanQuery) ||
            s.officerRole?.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 5)
    : [];

  const matchedTeachers = cleanQuery
    ? teachers
        .filter(
          (t) =>
            t.fullName.toLowerCase().includes(cleanQuery) ||
            t.department.toLowerCase().includes(cleanQuery) ||
            t.subjectsHandled.some((sub) => sub.toLowerCase().includes(cleanQuery))
        )
        .slice(0, 3)
    : [];

  const matchedSubjects = cleanQuery
    ? subjects
        .filter(
          (s) =>
            s.title.toLowerCase().includes(cleanQuery) ||
            s.code.toLowerCase().includes(cleanQuery) ||
            s.room.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const matchedAnnouncements = cleanQuery
    ? announcements
        .filter(
          (a) =>
            a.title.toLowerCase().includes(cleanQuery) ||
            a.content.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  // Default quick actions when query is empty
  const defaultActions = [
    { id: 'schedule', title: 'Weekly Timetable', desc: 'Room 304 schedule & periods', icon: Calendar, tab: 'schedule' },
    { id: 'students', title: 'Grade 11 Enrolled Students', desc: 'Full 36-student roster', icon: Users, tab: 'students' },
    { id: 'map', title: 'Daniel Maramba NHS Digital Map', desc: 'GPS 16.00146, 120.39953', icon: MapPin, tab: 'map' },
    { id: 'announcements', title: 'Official Announcements', desc: 'DepEd and section updates', icon: Bell, tab: 'announcements' },
    { id: 'messages', title: 'Class Messages & Chat', desc: 'Real-time discussion board', icon: MessageSquare, tab: 'messages' },
  ];

  const handleSelectTab = (tab: string) => {
    iosSound.playTap();
    onNavigate(tab);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-[#0a1628]/90 backdrop-blur-3xl border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/20 overflow-hidden text-white flex flex-col max-h-[80vh]"
      >
        {/* Spotlight Search Input */}
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-white/10 bg-white/[0.04]">
          <Search className="w-6 h-6 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spotlight 27: Search students, teachers, subjects, rooms..."
            className="w-full bg-transparent text-base sm:text-lg font-medium text-white placeholder-white/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/60"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/60 border border-white/10">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Quick Default Actions when empty */}
          {!cleanQuery && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-2 flex items-center justify-between">
                <span>Suggested Shortcuts</span>
                <span className="text-cyan-400 font-normal">iOS 27 Spotlight</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {defaultActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={() => handleSelectTab(act.tab)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-3 text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/20 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-xs font-bold text-white truncate">{act.title}</div>
                        <div className="text-[10px] text-white/50 truncate">{act.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student Results */}
          {matchedStudents.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 px-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Enrolled Students ({matchedStudents.length})</span>
              </div>
              {matchedStudents.map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => handleSelectTab('students')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-300 border border-blue-400/30 flex items-center justify-center font-bold text-xs">
                      {stu.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{stu.fullName}</div>
                      <div className="text-[11px] text-white/50">
                        {stu.gradeAndSection} {stu.officerRole ? `• ${stu.officerRole}` : ''}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              ))}
            </div>
          )}

          {/* Teacher Results */}
          {matchedTeachers.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 px-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Faculty ({matchedTeachers.length})</span>
              </div>
              {matchedTeachers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTab('teachers')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{t.fullName}</div>
                    <div className="text-[11px] text-white/50">{t.department} • {t.roomOrOffice}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              ))}
            </div>
          )}

          {/* Subject Results */}
          {matchedSubjects.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Subjects ({matchedSubjects.length})</span>
              </div>
              {matchedSubjects.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectTab('subjects')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{s.title} ({s.code})</div>
                    <div className="text-[11px] text-white/50">{s.assignedTeacher} • {s.room}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              ))}
            </div>
          )}

          {/* Announcements Results */}
          {matchedAnnouncements.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>Announcements ({matchedAnnouncements.length})</span>
              </div>
              {matchedAnnouncements.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleSelectTab('announcements')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{a.title}</div>
                    <div className="text-[11px] text-white/50 truncate max-w-md">{a.content}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              ))}
            </div>
          )}

          {/* No matches */}
          {cleanQuery &&
            matchedStudents.length === 0 &&
            matchedTeachers.length === 0 &&
            matchedSubjects.length === 0 &&
            matchedAnnouncements.length === 0 && (
              <div className="py-12 text-center text-white/50 space-y-2">
                <Search className="w-8 h-8 mx-auto text-white/30" />
                <p className="text-sm">No records found matching "{query}"</p>
                <p className="text-xs text-white/30">
                  Try searching for a student name, room (e.g. "304"), or teacher
                </p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-black/40 text-[11px] text-white/50 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>PTP Block 7 Spatial Intelligence</span>
          </div>
          <span>Santa Barbara, Pangasinan</span>
        </div>
      </div>
    </div>
  );
};
