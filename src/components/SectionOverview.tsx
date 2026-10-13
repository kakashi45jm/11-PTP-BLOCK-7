import React, { useState } from 'react';
import {
  Layers,
  Award,
  Users,
  Calendar,
  BookOpen,
  Edit3,
  Search,
  CheckCircle,
  GraduationCap,
  ShieldAlert,
  Crown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { SchoolInfo, Student, Announcement, User } from '../types';

interface SectionOverviewProps {
  schoolInfo: SchoolInfo;
  onUpdateSchoolInfo: (info: Partial<SchoolInfo>) => void;
  students: Student[];
  announcements: Announcement[];
  currentUser: User;
  onNavigate: (tab: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const SectionOverview: React.FC<SectionOverviewProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  students,
  announcements,
  currentUser,
  onNavigate,
  onSelectStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [roomNumber, setRoomNumber] = useState(schoolInfo.roomNumber);
  const [adviser, setAdviser] = useState(schoolInfo.adviser);
  const [motto, setMotto] = useState(schoolInfo.motto);
  const [schoolYear, setSchoolYear] = useState(schoolInfo.schoolYear);

  // Officers list
  const officers = students.filter((s) => Boolean(s.officerRole));

  // Filtered students for quick search
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.officerRole && s.officerRole.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo({
      roomNumber,
      adviser,
      motto,
      schoolYear,
    });
    setIsEditingSection(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Section Profile • {schoolInfo.gradeLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {schoolInfo.programStrand} — {schoolInfo.section}
            </h1>
            <p className="text-blue-200 text-sm italic">
              &quot;{schoolInfo.motto}&quot;
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-blue-900/90 text-blue-100 border border-blue-800">
                School Year: <strong>{schoolInfo.schoolYear}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-900/90 text-blue-100 border border-blue-800">
                Homeroom: <strong>{schoolInfo.roomNumber}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                Adviser: <strong>{schoolInfo.adviser}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-800 text-white font-bold">
                Student Count: {students.length} Records
              </span>
            </div>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsEditingSection(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg shadow cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Section Details</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Section Modal */}
      {isEditingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <span>Update Section Details</span>
            </h3>
            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  School Year
                </label>
                <input
                  type="text"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Homeroom Room Number / Wing
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Class Adviser
                </label>
                <input
                  type="text"
                  value={adviser}
                  onChange={(e) => setAdviser(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Section Motto
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSection(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program / Strand Description Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <h2 className="text-lg font-bold text-[#0f294a] mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>About the Poly-Technical Program (PTP)</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          The <strong>Poly-Technical Program (PTP)</strong> in Senior High School equips Grade 11 learners with advanced,
          industry-aligned technical competencies alongside rigorous academic courses. Section <strong>Block 7</strong> specializes
          in <em>Computer Systems Servicing</em> (hardware diagnostic installation, operating systems deployment, and network cabling),
          grounded in General Science, Mathematics, Philippine History, Communication Arts, and Career Preparedness.
        </p>
      </div>

      {/* Class Officers Roster */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f294a] flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Class Officers • Block 7</span>
            </h2>
            <p className="text-xs text-gray-500">
              Elected student leaders for Second Term S.Y. {schoolInfo.schoolYear}
            </p>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All {students.length} Students</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {officers.map((officer) => (
            <div
              key={officer.id}
              onClick={() => onSelectStudent(officer)}
              className="flex-1 min-w-[240px] bg-gray-50/80 hover:bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
            >
              <div
                className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs"
                style={{ backgroundColor: officer.avatarColor || '#1e40af' }}
              >
                {officer.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mb-0.5">
                  {officer.officerRole}
                </span>
                <h4 className="font-bold text-sm text-[#0f294a] truncate">
                  {officer.fullName}
                </h4>
                <div className="text-[11px] text-gray-500 truncate">
                  {officer.bio || 'PTP Block 7 Officer'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable Student Directory Preview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f294a] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Section Student Roster</span>
            </h2>
            <p className="text-xs text-gray-500">
              Showing {filteredStudents.length} of {students.length} saved student records
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Flexbox Student List */}
        <div className="flex flex-wrap gap-3">
          {filteredStudents.slice(0, 12).map((stu) => (
            <div
              key={stu.id}
              onClick={() => onSelectStudent(stu)}
              className="flex-1 min-w-[200px] p-3 rounded-lg border border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: stu.avatarColor || '#3b82f6' }}
                >
                  {stu.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#0f294a] truncate">
                    {stu.fullName}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {stu.officerRole || 'Student'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>
          ))}
        </div>

        {filteredStudents.length > 12 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigate('students')}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              View All {students.length} Students in Directory →
            </button>
          </div>
        )}
      </div>

      {/* Class Announcements for Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <h2 className="text-lg font-bold text-[#0f294a] mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Class Announcements for Block 7</span>
        </h2>
        <div className="space-y-3">
          {announcements.slice(0, 3).map((ann) => (
            <div key={ann.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-blue-700">{ann.title}</span>
                <span className="text-gray-400 text-[11px]">{ann.date}</span>
              </div>
              <p className="text-xs text-gray-600">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
