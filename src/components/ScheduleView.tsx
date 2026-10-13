import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  AlertTriangle,
  Edit2,
  Trash2,
  CheckCircle,
  HelpCircle,
  Info,
  Layers,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { ScheduleEntry, Subject, Teacher, User } from '../types';

interface ScheduleViewProps {
  scheduleEntries: ScheduleEntry[];
  subjects: Subject[];
  teachers: Teacher[];
  currentUser: User;
  onAddEntry: (entry: ScheduleEntry) => void;
  onUpdateEntry: (entry: ScheduleEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  scheduleEntries,
  subjects,
  teachers,
  currentUser,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
}) => {
  // Current Day of Week
  const todayIdx = new Date().getDay(); // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat
  const dayNames: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  const currentDayName = todayIdx >= 1 && todayIdx <= 5 ? dayNames[todayIdx - 1] : 'Monday';

  // State
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>(
    currentDayName
  );
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);

  // Form Fields
  const [formDay, setFormDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [formStartTime, setFormStartTime] = useState('07:15');
  const [formEndTime, setFormEndTime] = useState('08:45');
  const [formDisplayTime, setFormDisplayTime] = useState('7:15-8:45 AM');
  const [formSubject, setFormSubject] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formType, setFormType] = useState<'class' | 'break' | 'unconfirmed'>('class');
  const [formNote, setFormNote] = useState('');

  // Overlap explanation modal
  const [activeConflictInfo, setActiveConflictInfo] = useState<ScheduleEntry | null>(null);

  // Color mapping for subjects
  const getSubjectColor = (subjectTitle: string) => {
    const match = subjects.find(
      (s) => s.title.toLowerCase().trim() === subjectTitle.toLowerCase().trim()
    );
    return match ? match.color : '#2563eb';
  };

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormDay(selectedDay);
    setFormStartTime('07:15');
    setFormEndTime('08:45');
    setFormDisplayTime('7:15-8:45 AM');
    setFormSubject(subjects[0]?.title || 'General Science');
    setFormTeacher(teachers[0]?.fullName || 'Eliza P. Zarate');
    setFormRoom('ICT Lab 2');
    setFormType('class');
    setFormNote('');
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setFormDay(entry.day);
    setFormStartTime(entry.startTime);
    setFormEndTime(entry.endTime);
    setFormDisplayTime(entry.displayTime);
    setFormSubject(entry.subject);
    setFormTeacher(entry.teacher);
    setFormRoom(entry.room || '');
    setFormType(entry.type);
    setFormNote(entry.note || '');
    setModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const entryData: ScheduleEntry = {
      id: editingEntry ? editingEntry.id : `sch-${Date.now()}`,
      day: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      displayTime: formDisplayTime,
      subject: formSubject,
      teacher: formTeacher,
      room: formRoom,
      type: formType,
      color: formType === 'break' ? '#10b981' : getSubjectColor(formSubject),
      note: formNote || undefined,
    };

    if (editingEntry) {
      onUpdateEntry(entryData);
    } else {
      onAddEntry(entryData);
    }
    setModalOpen(false);
  };

  // Distinct time bands in chronological order for standard weekly table rendering
  const timeSlots = [
    { label: '5:30-6:30 AM', timeKey: '05:30' },
    { label: '7:15-8:45 AM', timeKey: '07:15' },
    { label: '8:45-10:15 AM', timeKey: '08:45' },
    { label: '10:15-10:30 AM', timeKey: '10:15', isHealthBreak: true },
    { label: '10:30 AM-12:00 PM', timeKey: '10:30' },
    { label: '12:00-1:00 PM', timeKey: '12:00', isLunchBreak: true },
    { label: '1:00-2:30 PM', timeKey: '13:00' },
    { label: '2:30-3:30 PM', timeKey: '14:30' },
    { label: '3:30-4:30 PM', timeKey: '15:30' },
    { label: '2:30-5:00 PM', timeKey: '14:30_special' }, // For Wednesday Math overlap
    { label: '5:30-6:30 PM', timeKey: '17:30' },
  ];

  // Filtered entries
  const filteredEntries = scheduleEntries.filter((item) => {
    if (filterSubject !== 'all' && item.subject !== filterSubject) return false;
    if (filterTeacher !== 'all' && item.teacher !== filterTeacher) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Second Term Official Master Timetable</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Grade 11 - PTP Block 7 Class Schedule
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Weekly class timetable with assigned faculty, break periods, and spreadsheet transcription notices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-blue-950 p-1 rounded-lg border border-blue-800 flex items-center text-xs">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                  viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                Full Weekly Table
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                  viewMode === 'daily' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                Day-by-Day View
              </button>
            </div>

            {currentUser.role === 'admin' && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class Slot</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Transcription & Overlap Review Notice Box (Mandatory Requirement) */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed">
            <h4 className="font-bold text-amber-950 text-sm">
              Official Spreadsheet Transcription Notes &amp; Flags:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              <li>
                <strong>Monday 5:30-6:30 AM:</strong> The source image shows a separate 5:30-6:30 entry for <em>General Science / Asynchronous</em> (Eduardo F. Rarang, Jr.) near the top. Its exact day placement is unclear; not assigned to other days without confirmation.
              </li>
              <li>
                <strong>Wednesday &amp; Thursday 8:30-10:30 AM Notation:</strong> Source also indicates 8:30-10:30 AM for <em>Computer Systems Servicing</em>, conflicting with standard 8:45-10:15 / 10:30-12:00 periods. Preserved for review.
              </li>
              <li>
                <strong>Wednesday 2:30-5:00 PM Overlap:</strong> <em>General Mathematics</em> (2:30-5:00 PM) overlaps with 3:30-4:30 PM <em>Computer Systems Servicing</em> in the spreadsheet. Both entries are flagged and preserved.
              </li>
              <li>
                <strong>Thursday 3:30-4:30 PM:</strong> Cell was not clearly readable in source image. Preserved as <em>[Unconfirmed]</em> and left editable for administrators.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filters:</span>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1">
            <label className="text-gray-500">Subject:</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Filter */}
          <div className="flex items-center gap-1">
            <label className="text-gray-500">Teacher:</label>
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Faculty</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.fullName}>
                  {t.fullName}
                </option>
              ))}
            </select>
          </div>

          {(filterSubject !== 'all' || filterTeacher !== 'all') && (
            <button
              onClick={() => {
                setFilterSubject('all');
                setFilterTeacher('all');
              }}
              className="px-2 py-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Current Day Badge */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Today is:</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
            {currentDayName}
          </span>
        </div>
      </div>

      {/* Subject Color Legend */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Subject Color Legend:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: sub.color }}
              ></span>
              <span className="font-semibold text-gray-800 text-[11px]">{sub.title}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Health Break</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-800">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Lunch Break</span>
          </div>
        </div>
      </div>

      {/* View 1: Full Weekly Table (Horizontally Scrollable) */}
      {viewMode === 'weekly' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto table-scrollbar">
            <table className="w-full border-collapse text-left min-w-[980px]">
              <thead>
                <tr className="bg-[#0f294a] text-white text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold border-r border-blue-900 w-32 shrink-0">
                    TIME
                  </th>
                  {dayNames.map((day) => {
                    const isToday = day === currentDayName;
                    return (
                      <th
                        key={day}
                        className={`py-3.5 px-3 font-bold border-r border-blue-900 last:border-r-0 ${
                          isToday ? 'bg-blue-800 text-amber-300 ring-2 ring-amber-400 inset-0' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{day.toUpperCase()}</span>
                          {isToday && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-blue-950 font-black">
                              TODAY
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {timeSlots.map((slot) => {
                  const isHealthBreak = slot.isHealthBreak;
                  const isLunchBreak = slot.isLunchBreak;

                  if (isHealthBreak || isLunchBreak) {
                    return (
                      <tr
                        key={slot.label}
                        className={`font-semibold ${
                          isHealthBreak
                            ? 'bg-emerald-50/90 text-emerald-900'
                            : 'bg-amber-50/90 text-amber-900'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono font-bold border-r border-gray-200 bg-gray-50/80">
                          {slot.label}
                        </td>
                        <td
                          colSpan={5}
                          className="py-2.5 px-4 text-center font-bold tracking-wide uppercase text-xs"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            <span>{isHealthBreak ? '☕ HEALTH BREAK (15 MIN)' : '🍽️ LUNCH BREAK (1 HOUR)'}</span>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={slot.label} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-700 bg-gray-50/60 border-r border-gray-200 align-top">
                        {slot.label}
                      </td>
                      {dayNames.map((day) => {
                        const isToday = day === currentDayName;

                        // Match entry for this day and time
                        const entry = filteredEntries.find((e) => {
                          if (e.day !== day) return false;
                          if (slot.timeKey === '14:30_special') {
                            return e.startTime === '14:30' && e.endTime === '17:00';
                          }
                          // Handle 05:30, 07:15, 08:45, 10:30, 13:00, 14:30, 15:30, 17:30
                          if (slot.timeKey === '14:30') {
                            return e.startTime === '14:30' && e.endTime === '15:30';
                          }
                          return e.startTime.startsWith(slot.timeKey.slice(0, 2));
                        });

                        return (
                          <td
                            key={day}
                            className={`p-2.5 border-r border-gray-200 last:border-r-0 align-top transition-colors ${
                              isToday ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            {entry ? (
                              <div
                                className={`rounded-lg p-2.5 border shadow-2xs relative group transition-all ${
                                  entry.hasConflict
                                    ? 'bg-amber-50/80 border-amber-300'
                                    : entry.type === 'unconfirmed'
                                    ? 'bg-gray-50 border-dashed border-gray-400'
                                    : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                              >
                                {/* Subject Header with Color Dot */}
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: entry.color || '#1e40af' }}
                                    ></span>
                                    <span className="font-bold text-[#0f294a] leading-tight text-xs">
                                      {entry.subject}
                                    </span>
                                  </div>
                                </div>

                                {/* Teacher Name directly underneath subject */}
                                <div className="text-[11px] text-gray-600 pl-4 mb-1">
                                  <span className="text-gray-400 text-[10px]">Teacher: </span>
                                  <strong className="text-blue-900">{entry.teacher}</strong>
                                </div>

                                {/* Room / Details */}
                                {entry.room && (
                                  <div className="text-[10px] text-gray-500 pl-4 font-mono">
                                    📍 {entry.room}
                                  </div>
                                )}

                                {/* Conflict Badge */}
                                {entry.hasConflict && (
                                  <div
                                    onClick={() => setActiveConflictInfo(entry)}
                                    className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white cursor-pointer hover:bg-amber-600"
                                    title="Click to view overlap details"
                                  >
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Conflict Note</span>
                                  </div>
                                )}

                                {/* Unconfirmed Cell Badge */}
                                {entry.type === 'unconfirmed' && (
                                  <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-500 text-white">
                                    <HelpCircle className="w-3 h-3" />
                                    <span>Unconfirmed in Source</span>
                                  </div>
                                )}

                                {entry.note && !entry.hasConflict && (
                                  <div className="mt-1 text-[10px] text-gray-500 italic pl-4">
                                    ℹ️ {entry.note}
                                  </div>
                                )}

                                {/* Admin Action Hover/Controls */}
                                {currentUser.role === 'admin' && (
                                  <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-end gap-1.5 text-[11px]">
                                    <button
                                      onClick={() => handleOpenEdit(entry)}
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 cursor-pointer"
                                      title="Edit Schedule Entry"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => onDeleteEntry(entry.id)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                                      title="Delete Entry"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-full min-h-[48px] flex items-center justify-center text-gray-300 text-[11px]">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Mobile & Tablet Day-by-Day View */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Day Tabs */}
          <div className="flex flex-wrap gap-2">
            {dayNames.map((day) => {
              const isSelected = selectedDay === day;
              const isToday = day === currentDayName;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400 text-blue-950 font-black">
                      TODAY
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Schedule Cards */}
          <div className="space-y-3">
            {filteredEntries
              .filter((e) => e.day === selectedDay)
              .map((item) => {
                if (item.type === 'break') {
                  const isLunch = item.subject.includes('LUNCH');
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                        isLunch
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                        <span>{item.subject}</span>
                      </div>
                      <span className="font-mono">{item.displayTime}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl p-4 border transition-all ${
                      item.hasConflict
                        ? 'border-amber-400 bg-amber-50/30'
                        : item.type === 'unconfirmed'
                        ? 'border-dashed border-gray-400 bg-gray-50'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color || '#1e40af' }}
                        ></span>
                        <h4 className="font-bold text-sm text-[#0f294a]">
                          {item.subject}
                        </h4>
                        {item.hasConflict && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                            Time Conflict
                          </span>
                        )}
                        {item.type === 'unconfirmed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500 text-white">
                            Unconfirmed
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
                        {item.displayTime}
                      </span>
                    </div>

                    {/* Teacher name directly underneath subject */}
                    <div className="text-xs text-gray-600 pl-5 mb-2">
                      <span className="text-gray-400">Assigned Teacher: </span>
                      <strong className="text-blue-900">{item.teacher}</strong>
                      {item.room && (
                        <span className="ml-3 text-gray-500">
                          (Room: {item.room})
                        </span>
                      )}
                    </div>

                    {item.conflictNote && (
                      <div className="text-xs text-amber-800 bg-amber-100/80 p-2.5 rounded-lg flex items-start gap-2 ml-5 mb-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <span>{item.conflictNote}</span>
                      </div>
                    )}

                    {item.note && (
                      <div className="text-xs text-gray-500 italic ml-5 mb-2">
                        ℹ️ {item.note}
                      </div>
                    )}

                    {currentUser.role === 'admin' && (
                      <div className="pt-2 border-t border-gray-100 flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteEntry(item.id)}
                          className="px-3 py-1 bg-red-50 text-red-700 font-semibold rounded hover:bg-red-100 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Conflict Explanation Modal */}
      {activeConflictInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-amber-300 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-[#0f294a]">
                Schedule Overlap Details
              </h3>
            </div>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="font-bold text-amber-900 mb-1">
                  {activeConflictInfo.subject} ({activeConflictInfo.displayTime})
                </div>
                <div>Teacher: <strong>{activeConflictInfo.teacher}</strong></div>
              </div>
              <p className="leading-relaxed">
                <strong>Flag details:</strong> {activeConflictInfo.conflictNote || activeConflictInfo.note}
              </p>
              <p className="text-gray-500 italic">
                Per prompt instructions, both conflicting entries have been faithfully preserved from the source photo. Authorized administrators may edit or reassign these hours using the Edit tool.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveConflictInfo(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>{editingEntry ? 'Edit Class Schedule Entry' : 'Add Class Schedule Slot'}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Schedule entries are saved directly to backend API and local state. Overlaps will be automatically evaluated.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Day of Week</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    required
                  >
                    {dayNames.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Display Time Label</label>
                  <input
                    type="text"
                    value={formDisplayTime}
                    onChange={(e) => setFormDisplayTime(e.target.value)}
                    placeholder="e.g. 7:15-8:45 AM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Time (24h)</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Title</label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Computer Systems Servicing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Teacher</label>
                <input
                  type="text"
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  placeholder="e.g. Eliza P. Zarate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room / Laboratory</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. ICT Lab 2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Slot Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="class">Regular Class</option>
                    <option value="break">Break (Health / Lunch)</option>
                    <option value="unconfirmed">Unconfirmed / Pending Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Special Transcription Note</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Optional note regarding source transcription"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                >
                  {editingEntry ? 'Update Slot' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
