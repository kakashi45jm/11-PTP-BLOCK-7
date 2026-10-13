import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle,
  Crown,
  Mail,
  Phone,
  UserCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { Student, User } from '../types';

interface StudentDirectoryProps {
  students: Student[];
  currentUser: User;
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudent?: (student: Student) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  currentUser,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [officerFilter, setOfficerFilter] = useState<'all' | 'officers' | 'regular'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected student for Profile Detail Modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelfEdit, setIsSelfEdit] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formOfficerRole, setFormOfficerRole] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formColor, setFormColor] = useState('#1e40af');

  const officerRolesList = [
    'None',
    'Class President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Auditor',
    'Public Information Officer (P.I.O.)',
    'Peace Officer',
    'Muse',
    'Escort',
  ];

  // Filtering & Sorting
  const filteredStudents = students
    .filter((stu) => {
      const matchSearch =
        stu.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stu.officerRole && stu.officerRole.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchSearch) return false;

      if (officerFilter === 'officers' && !stu.officerRole) return false;
      if (officerFilter === 'regular' && stu.officerRole) return false;

      return true;
    })
    .sort((a, b) => {
      const comp = a.fullName.localeCompare(b.fullName);
      return sortOrder === 'asc' ? comp : -comp;
    });

  // Open Add Modal (Admin only)
  const handleOpenAdd = () => {
    setIsEditing(false);
    setIsSelfEdit(false);
    setFormName('');
    setFormNumber(`2024-PTP-07${students.length + 1 < 10 ? '0' : ''}${students.length + 1}`);
    setFormOfficerRole('None');
    setFormBio('');
    setFormEmail('');
    setFormColor('#2563eb');
    setIsModalOpen(true);
  };

  // Open Edit Modal for Admin
  const handleOpenEdit = (stu: Student) => {
    setIsEditing(true);
    setIsSelfEdit(false);
    setFormName(stu.fullName);
    setFormNumber(stu.studentNumber);
    setFormOfficerRole(stu.officerRole || 'None');
    setFormBio(stu.bio || '');
    setFormEmail(stu.email || '');
    setFormColor(stu.avatarColor || '#2563eb');
    setIsModalOpen(true);
  };

  // Open Self Edit for Student
  const handleOpenSelfEdit = (stu: Student) => {
    setIsEditing(true);
    setIsSelfEdit(true);
    setFormName(stu.fullName);
    setFormNumber(stu.studentNumber);
    setFormOfficerRole(stu.officerRole || 'None');
    setFormBio(stu.bio || '');
    setFormEmail(stu.email || '');
    setFormColor(stu.avatarColor || '#2563eb');
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedStudent) {
      const updated: Student = {
        ...selectedStudent,
        fullName: isSelfEdit ? selectedStudent.fullName : formName,
        studentNumber: isSelfEdit ? selectedStudent.studentNumber : formNumber,
        officerRole: isSelfEdit
          ? selectedStudent.officerRole
          : formOfficerRole === 'None'
          ? undefined
          : formOfficerRole,
        bio: formBio,
        email: formEmail,
        avatarColor: formColor,
      };
      onUpdateStudent(updated);
      setSelectedStudent(updated);
    } else {
      const newStu: Student = {
        id: `stu-${Date.now()}`,
        fullName: formName,
        gradeAndSection: 'Grade 11 - PTP Block 7',
        studentNumber: formNumber,
        officerRole: formOfficerRole === 'None' ? undefined : formOfficerRole,
        bio: formBio,
        email: formEmail,
        avatarColor: formColor,
        isDemoRecord: true,
      };
      onAddStudent(newStu);
    }
    setIsModalOpen(false);
  };

  // Check if viewer can see student number unmasked
  const canViewStudentNumber = (stu: Student) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.id === stu.id) return true;
    return false;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Section Enrollment Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Grade 11 - PTP Block 7 Students
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Official student roster with role assignments, profiles, and data privacy safeguards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg shadow cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student Record</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Privacy & Sensitive Info Protection Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 shadow-2xs flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-blue-950 text-sm">
            Student Data Privacy &amp; Protection Protocol
          </h4>
          <p className="text-blue-800 leading-relaxed">
            In compliance with educational privacy protocols, student identification numbers and personal contacts are masked
            for regular visitors. Only administrators and authenticated students viewing their own profile may inspect unmasked IDs.
            Passphrases, home addresses, and private contact lines are strictly excluded.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search student by name or officer role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Filter:</span>
            <select
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value as any)}
              className="px-2.5 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            >
              <option value="all">All Students ({students.length})</option>
              <option value="officers">Class Officers Only</option>
              <option value="regular">Regular Students</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Name ({sortOrder === 'asc' ? 'A → Z' : 'Z → A'})
            </button>
          </div>
        </div>

        <div className="text-gray-500 font-medium">
          Showing <strong>{filteredStudents.length}</strong> student profiles
        </div>
      </div>

      {/* Student Cards Grid (Flexbox) */}
      <div className="flex flex-wrap gap-4">
        {filteredStudents.map((stu) => {
          const isOfficer = Boolean(stu.officerRole);
          const hasUnmaskedAccess = canViewStudentNumber(stu);
          const isSelf = currentUser.id === stu.id;

          return (
            <div
              key={stu.id}
              className={`flex-1 min-w-[280px] max-w-[380px] bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isSelf
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header with Avatar and Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0"
                      style={{ backgroundColor: stu.avatarColor || '#1e40af' }}
                    >
                      {stu.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f294a] leading-tight">
                        {stu.fullName}
                      </h3>
                      <div className="text-[11px] text-gray-500">
                        {stu.gradeAndSection}
                      </div>
                    </div>
                  </div>
                  {isSelf && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      You
                    </span>
                  )}
                </div>

                {/* Officer Role Tag */}
                {isOfficer && (
                  <div className="mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <Crown className="w-3 h-3 text-amber-600" />
                      <span>{stu.officerRole}</span>
                    </span>
                  </div>
                )}

                {/* Student Number Display (Masked if not authorized) */}
                <div className="text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-150 mb-3 flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Student ID:</span>
                  <span className="font-mono font-semibold text-gray-800 flex items-center gap-1">
                    {hasUnmaskedAccess ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{stu.studentNumber}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                        <span className="tracking-widest text-gray-400">••••••••••</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Bio / Intro */}
                <p className="text-xs text-gray-600 line-clamp-2 italic mb-3">
                  {stu.bio || 'Grade 11 PTP Block 7 student.'}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                {(currentUser.role === 'admin' || currentUser.role === 'teacher') ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to remove ${stu.fullName} from the section roster?`)) {
                        onDeleteStudent(stu.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded font-semibold cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Remove Student Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">
                    Sample Demo Record
                  </span>
                )}
                <button
                  onClick={() => setSelectedStudent(stu)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full text-white font-bold flex items-center justify-center text-xl shadow-md shrink-0"
                  style={{ backgroundColor: selectedStudent.avatarColor || '#1e40af' }}
                >
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0f294a]">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedStudent.gradeAndSection}
                  </p>
                  {selectedStudent.officerRole && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {selectedStudent.officerRole}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-4 text-xs">
              {/* Identification details */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Official Student Number:</span>
                  <span className="font-mono font-bold text-gray-800 flex items-center gap-1.5">
                    {canViewStudentNumber(selectedStudent) ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{selectedStudent.studentNumber}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-400 tracking-wider">•••••••••• (Authorized Access Only)</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Official School Email:</span>
                  <span className="font-semibold text-blue-700">
                    {selectedStudent.email || 'ptp7.student@school.edu.ph'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Record Type:</span>
                  <span className="text-emerald-700 font-semibold">Active Demo Student Record</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Student Introduction &amp; Bio:</h4>
                <p className="text-gray-600 bg-blue-50/40 p-3 rounded-lg border border-blue-100 leading-relaxed italic">
                  &quot;{selectedStudent.bio || 'No introduction provided yet.'}&quot;
                </p>
              </div>

              {/* Enrolled Curriculum Preview */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Curriculum Subjects Enrolled (Second Term):</h4>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium">Computer Systems Servicing</span>
                  <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-medium">Kasaysayan at Lipunang Pilipino</span>
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-medium">General Science</span>
                  <span className="px-2 py-1 rounded bg-sky-100 text-sky-800 font-medium">General Mathematics</span>
                  <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 font-medium">Life and Career Skills</span>
                  <span className="px-2 py-1 rounded bg-red-100 text-red-800 font-medium">Effective Communication</span>
                  <span className="px-2 py-1 rounded bg-fuchsia-100 text-fuchsia-800 font-medium">Mabisang Komunikasyon</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${selectedStudent.fullName}?`)) {
                        const id = selectedStudent.id;
                        setSelectedStudent(null);
                        onDeleteStudent(id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Student</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(currentUser.role === 'admin' || currentUser.role === 'teacher') ? (
                  <button
                    onClick={() => handleOpenEdit(selectedStudent)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Record</span>
                  </button>
                ) : currentUser.id === selectedStudent.id ? (
                  <button
                    onClick={() => handleOpenSelfEdit(selectedStudent)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit My Bio</span>
                  </button>
                ) : null}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>
                {isSelfEdit
                  ? 'Edit My Profile Details'
                  : isEditing
                  ? 'Edit Student Record (Admin)'
                  : 'Add New Student Record (Admin)'}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isSelfEdit
                ? 'You may update your introduction bio, official contact email preference, and avatar accent.'
                : 'Manage student name, student ID number, officer assignment, and biography.'}
            </p>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Student Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={isSelfEdit}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs ${
                    isSelfEdit ? 'bg-gray-100 text-gray-500' : ''
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Student Number</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    disabled={isSelfEdit}
                    required
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs ${
                      isSelfEdit ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Class Officer Position</label>
                  <select
                    value={formOfficerRole}
                    onChange={(e) => setFormOfficerRole(e.target.value)}
                    disabled={isSelfEdit}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs ${
                      isSelfEdit ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                  >
                    {officerRolesList.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Official School Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="student@school.edu.ph"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Introduction / Bio</label>
                <textarea
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  rows={3}
                  placeholder="Short bio, technical interests, or section duties..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Avatar Accent Color</label>
                <div className="flex items-center gap-3">
                  {['#1e40af', '#0369a1', '#047857', '#b45309', '#6d28d9', '#be185d', '#374151'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormColor(c)}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                        formColor === c ? 'scale-125 ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
