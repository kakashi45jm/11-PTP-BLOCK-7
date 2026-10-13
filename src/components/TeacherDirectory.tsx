import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Clock,
  MapPin,
  BookOpen,
  AlertCircle,
  MessageSquare,
  Edit2,
  Trash2,
  X,
  CheckCircle,
} from 'lucide-react';
import { Teacher, User } from '../types';

interface TeacherDirectoryProps {
  teachers: Teacher[];
  currentUser: User;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onNavigateToMessage?: (teacherName: string) => void;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  teachers,
  currentUser,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onNavigateToMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSubjects, setFormSubjects] = useState('');
  const [formConsultation, setFormConsultation] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formColor, setFormColor] = useState('#1d4ed8');

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjectsHandled.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (deptFilter !== 'all' && t.department !== deptFilter) return false;
    return true;
  });

  const departments = Array.from(new Set(teachers.map((t) => t.department)));

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormName('');
    setFormSubjects('');
    setFormConsultation('Monday to Friday, 3:30 PM - 4:30 PM');
    setFormEmail('@school.edu.ph');
    setFormDept('Academic Faculty');
    setFormRoom('Faculty Room');
    setFormNote('');
    setFormColor('#1d4ed8');
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormName(t.fullName);
    setFormSubjects(t.subjectsHandled.join(', '));
    setFormConsultation(t.consultationSchedule);
    setFormEmail(t.officialEmail);
    setFormDept(t.department);
    setFormRoom(t.roomOrOffice);
    setFormNote(t.specialNote || '');
    setFormColor(t.avatarColor || '#1d4ed8');
    setModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = formSubjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const teacherData: Teacher = {
      id: editingTeacher ? editingTeacher.id : `t-${Date.now()}`,
      fullName: formName,
      subjectsHandled: subjectsArray,
      consultationSchedule: formConsultation,
      officialEmail: formEmail,
      department: formDept,
      roomOrOffice: formRoom,
      specialNote: formNote || undefined,
      avatarColor: formColor,
    };

    if (editingTeacher) {
      onUpdateTeacher(teacherData);
    } else {
      onAddTeacher(teacherData);
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
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Assigned Faculty Roster</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Grade 11 - PTP Block 7 Faculty Directory
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Official subject teachers, consultation office hours, and verified departmental contact lines.
            </p>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg shadow cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Administrative Directive Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 shadow-2xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-purple-950 text-sm">
            Faculty Roster Integrity Notice:
          </h4>
          <p className="text-purple-800 leading-relaxed">
            Per strict source directives, <strong>&quot;Christian David U.&quot;</strong> and{' '}
            <strong>&quot;Christian David U. Andaya&quot;</strong> are maintained as two distinct teacher records.
            They are not automatically merged until an administrator confirms whether they refer to the same person.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teacher by name or subject handled..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-gray-500">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-gray-500 font-medium">
          Showing <strong>{filteredTeachers.length}</strong> of {teachers.length} faculty records
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="flex flex-wrap gap-5">
        {filteredTeachers.map((teacher) => {
          const isSeparatedRecord =
            teacher.fullName.includes('Christian David');

          return (
            <div
              key={teacher.id}
              className={`flex-1 min-w-[300px] max-w-[390px] bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isSeparatedRecord
                  ? 'border-purple-300 bg-purple-50/20'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div
                    className="w-13 h-13 rounded-xl text-white font-bold flex items-center justify-center text-lg shadow-xs shrink-0"
                    style={{ backgroundColor: teacher.avatarColor || '#1d4ed8' }}
                  >
                    {teacher.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0f294a] leading-tight">
                      {teacher.fullName}
                    </h3>
                    <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                      {teacher.department}
                    </div>
                    {teacher.roomOrOffice && (
                      <div className="text-[10px] text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{teacher.roomOrOffice}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Note for Unmerged Record */}
                {teacher.specialNote && (
                  <div className="mb-3 p-2.5 rounded-lg bg-purple-100/70 border border-purple-200 text-[11px] text-purple-900 leading-snug">
                    <span className="font-bold">⚠️ Distinct Record: </span>
                    {teacher.specialNote}
                  </div>
                )}

                {/* Subjects Handled */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-600" />
                    <span>Subjects Handled:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjectsHandled.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consultation Schedule */}
                <div className="mb-3 bg-gray-50 p-2.5 rounded-lg border border-gray-150 text-xs">
                  <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1 mb-0.5">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>Consultation Hours:</span>
                  </div>
                  <div className="text-gray-700 font-medium">
                    {teacher.consultationSchedule}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <a
                    href={`mailto:${teacher.officialEmail}`}
                    className="text-blue-700 hover:underline truncate font-mono text-[11px]"
                  >
                    {teacher.officialEmail}
                  </a>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                {currentUser.role === 'admin' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteTeacher(teacher.id)}
                      className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">
                    Official Faculty Member
                  </span>
                )}

                <button
                  onClick={() =>
                    onNavigateToMessage ? onNavigateToMessage(teacher.fullName) : null
                  }
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Add/Edit Teacher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-1 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>{editingTeacher ? 'Edit Teacher Record' : 'Add New Teacher Record'}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter official teacher name, handled courses, consultation hours, and department office.
            </p>

            <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Teacher Full Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Eliza P. Zarate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Subjects Handled (comma-separated)
                </label>
                <input
                  type="text"
                  value={formSubjects}
                  onChange={(e) => setFormSubjects(e.target.value)}
                  placeholder="e.g. Computer Systems Servicing, ICT Work Immersion"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Consultation Schedule</label>
                <input
                  type="text"
                  value={formConsultation}
                  onChange={(e) => setFormConsultation(e.target.value)}
                  placeholder="e.g. Monday & Wednesday, 1:00 PM – 2:00 PM"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Official School Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Office / Classroom Room</label>
                <input
                  type="text"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="e.g. ICT Lab 2 / Faculty Center Rm 204"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Special Administrative Note</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Optional note for unconfirmed merges or duplicate roster entries"
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
                  Save Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
