import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  User,
  MapPin,
  Edit2,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Subject, Teacher, User as UserType } from '../types';

interface SubjectDirectoryProps {
  subjects: Subject[];
  teachers: Teacher[];
  currentUser: UserType;
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onNavigateToScheduleFilter: (subjectTitle: string) => void;
}

export const SubjectDirectory: React.FC<SubjectDirectoryProps> = ({
  subjects,
  teachers,
  currentUser,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onNavigateToScheduleFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formDays, setFormDays] = useState('Monday, Wednesday, Friday');
  const [formTimes, setFormTimes] = useState('7:15-8:45 AM');
  const [formDesc, setFormDesc] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formUnits, setFormUnits] = useState(4);
  const [formNote, setFormNote] = useState('');
  const [formColor, setFormColor] = useState('#1d4ed8');

  // Filtered subjects
  const filteredSubjects = subjects.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormCode('SUB-108');
    setFormTitle('');
    setFormTeacher(teachers[0]?.fullName || 'Eliza P. Zarate');
    setFormDays('Monday, Tuesday, Wednesday');
    setFormTimes('10:30 AM-12:00 PM');
    setFormDesc('');
    setFormRoom('Room 304');
    setFormUnits(4);
    setFormNote('');
    setFormColor('#2563eb');
    setModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormCode(sub.code);
    setFormTitle(sub.title);
    setFormTeacher(sub.assignedTeacher);
    setFormDays(sub.scheduledDays.join(', '));
    setFormTimes(sub.scheduledTimes);
    setFormDesc(sub.description);
    setFormRoom(sub.room);
    setFormUnits(sub.units || 4);
    setFormNote(sub.specialNote || '');
    setFormColor(sub.color);
    setModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const daysArray = formDays
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const subjectData: Subject = {
      id: editingSubject ? editingSubject.id : `sub-${Date.now()}`,
      code: formCode,
      title: formTitle,
      assignedTeacher: formTeacher,
      scheduledDays: daysArray,
      scheduledTimes: formTimes,
      description: formDesc,
      room: formRoom,
      units: Number(formUnits),
      specialNote: formNote || undefined,
      color: formColor,
    };

    if (editingSubject) {
      onUpdateSubject(subjectData);
    } else {
      onAddSubject(subjectData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Second Term Curriculum Offerings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Grade 11 - PTP Block 7 Subjects
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Official courses, faculty assignments, lecture rooms, and syllabus course descriptions.
            </p>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg shadow cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Curriculum Integrity Notice for Effective vs Mabisang Komunikasyon */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 shadow-2xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-950 text-sm">
            Curriculum Preservation Directive:
          </h4>
          <p className="text-amber-800 leading-relaxed">
            Per prompt directives, <strong>&quot;Effective Communication&quot;</strong> (handled by Emmanuel L. Cacapit)
            and <strong>&quot;Mabisang Komunikasyon&quot;</strong> (handled by Shela D. Paragas) are strictly preserved
            as separate subjects unless an administrator confirms that they are equivalent.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects by title, code, or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
        <div className="text-gray-500 font-medium">
          Showing <strong>{filteredSubjects.length}</strong> enrolled subjects
        </div>
      </div>

      {/* Subjects Cards Grid */}
      <div className="flex flex-wrap gap-5">
        {filteredSubjects.map((sub) => {
          const isCommSubject =
            sub.title.includes('Communication') || sub.title.includes('Komunikasyon');

          return (
            <div
              key={sub.id}
              className={`flex-1 min-w-[310px] max-w-[420px] bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isCommSubject
                  ? 'border-red-200 hover:border-red-400'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header with Code and Color Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color }}
                    ></span>
                    <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                  </div>
                  {sub.units && (
                    <span className="text-[11px] font-semibold text-gray-500 bg-blue-50 px-2 py-0.5 rounded">
                      {sub.units} Units
                    </span>
                  )}
                </div>

                {/* Subject Title */}
                <h3 className="text-base font-bold text-[#0f294a] mb-2 leading-tight">
                  {sub.title}
                </h3>

                {/* Assigned Teacher */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 mb-3 text-xs">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-blue-600" />
                    <span>Assigned Faculty:</span>
                  </div>
                  <div className="font-bold text-blue-900 text-xs">
                    {sub.assignedTeacher}
                  </div>
                  {sub.room && (
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{sub.room}</span>
                    </div>
                  )}
                </div>

                {/* Schedule Days & Times */}
                <div className="space-y-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">
                      Days: <strong>{sub.scheduledDays.join(', ')}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-mono text-[11px] text-gray-700">
                      {sub.scheduledTimes}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  {sub.description}
                </p>

                {/* Special Note if Communication Course */}
                {sub.specialNote && (
                  <div className="mb-3 p-2 rounded-md bg-amber-50 border border-amber-200 text-[10px] text-amber-800 italic">
                    ℹ️ {sub.specialNote}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                {currentUser.role === 'admin' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteSubject(sub.id)}
                      className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">
                    Required Subject
                  </span>
                )}

                <button
                  onClick={() => onNavigateToScheduleFilter(sub.title)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <span>View in Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Add/Edit Subject Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>{editingSubject ? 'Edit Subject Details' : 'Add New Curriculum Subject'}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Update course title, assigned instructor, lecture room, and time assignments.
            </p>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Units</label>
                  <input
                    type="number"
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    min={1}
                    max={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Computer Systems Servicing"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Teacher</label>
                <select
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  required
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.fullName}>
                      {t.fullName} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Scheduled Days</label>
                  <input
                    type="text"
                    value={formDays}
                    onChange={(e) => setFormDays(e.target.value)}
                    placeholder="e.g. Monday, Wednesday, Friday"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room / Laboratory</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. ICT Lab 2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Scheduled Time Slots</label>
                <input
                  type="text"
                  value={formTimes}
                  onChange={(e) => setFormTimes(e.target.value)}
                  placeholder="e.g. 7:15-8:45 AM, 10:30-12:00 PM"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Course Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Curricular Note (Optional)</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="e.g. Kept separate from other communication subjects"
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
