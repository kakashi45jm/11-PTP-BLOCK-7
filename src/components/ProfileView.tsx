import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Key,
  Mail,
  CheckCircle,
  Edit2,
  Crown,
  BookOpen,
  Calendar,
  Lock,
} from 'lucide-react';
import { User, Student } from '../types';

interface ProfileViewProps {
  currentUser: User;
  onUpdateCurrentUser: (user: User) => void;
  onSwitchRole: () => void;
  onNavigate: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onSwitchRole,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState('Senior High School student specializing in Computer Systems Servicing.');
  const [avatarColor, setAvatarColor] = useState(currentUser.avatar || '#1e40af');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCurrentUser({
      ...currentUser,
      name,
      email,
      avatar: avatarColor,
    });
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsEditing(false);
    }, 700);
  };

  const getRolePermissions = () => {
    if (currentUser.role === 'admin') {
      return [
        'Full Administrative Control: Can modify EVERYTHING in the portal',
        'Add, edit, and remove student records',
        'Manage faculty teachers, consultation hours, and departments',
        'Manage curriculum subjects, credits, and rooms',
        'Add, edit, and delete class schedule timetable slots',
        'Update digital school map coordinates and physical address',
        'Publish, moderate, and delete any class announcement',
        'Inspect unmasked student ID numbers',
      ];
    }
    if (currentUser.role === 'teacher') {
      return [
        'Faculty Permissions: Can remove and add student records in the section',
        'Publish, update, and manage official class announcements',
        'Communicate with students in section group and direct chats',
        'View authorized student directory and class schedule',
        'Inspect enrolled section roster',
      ];
    }
    if (currentUser.title?.toLowerCase().includes('president') || currentUser.officerRole?.toLowerCase().includes('president')) {
      return [
        'Class President Permissions: Can publish and post class announcements and reminders',
        'View section class schedule and today’s periods',
        'Participate in Grade 11 - PTP Block 7 group discussions',
        'Edit personal profile biography and avatar accent',
        'Inspect unmasked student ID for self',
      ];
    }
    return [
      'Student Permissions: View section class schedule & today’s periods',
      'View teacher consultation hours & subjects',
      'Read official announcements and notices',
      'Participate in Grade 11 - PTP Block 7 group chats',
      'Edit own profile biography and avatar accent',
      'Inspect unmasked student ID for self',
    ];
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shrink-0 border-2 border-white/20"
              style={{ backgroundColor: currentUser.avatar || '#1e40af' }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/40 text-blue-200 border border-blue-400/30 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {currentUser.title || 'Grade 11 - PTP Block 7'}
              </p>
              <p className="text-xs text-blue-300 font-mono mt-0.5">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchRole}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Switch Role / Account
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Cards (Flexbox) */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: User Details & Edit Form */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#0f294a] flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Fields</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={currentUser.role === 'student'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs ${
                    currentUser.role === 'student' ? 'bg-gray-100 text-gray-500' : ''
                  }`}
                />
                {currentUser.role === 'student' && (
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Student name is locked by registrar.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">School Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Biography / About Me</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Avatar Accent Color</label>
                <div className="flex items-center gap-2">
                  {['#1e40af', '#0369a1', '#047857', '#b45309', '#6d28d9', '#be185d', '#0f172a'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setAvatarColor(c)}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                        avatarColor === c ? 'scale-125 ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {successMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Official Name:</span>
                <span className="font-bold text-gray-800">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Role &amp; Title:</span>
                <span className="font-semibold text-blue-800 capitalize">
                  {currentUser.role} {currentUser.title ? `(${currentUser.title})` : ''}
                </span>
              </div>
              {currentUser.studentNumber && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Student ID Number:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {currentUser.studentNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">School Email:</span>
                <span className="font-mono text-gray-700">{currentUser.email}</span>
              </div>
              <div className="py-2">
                <span className="text-gray-500 block mb-1">Biography / Introduction:</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-150 italic leading-relaxed">
                  &quot;{bio}&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Role Permissions Matrix */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-[#0f294a] flex items-center gap-2 border-b border-gray-100 pb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Active Role Permissions ({currentUser.role.toUpperCase()})</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {getRolePermissions().map((perm, idx) => (
              <div key={idx} className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{perm}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-900 space-y-1">
              <span className="font-bold block">Need elevated access?</span>
              <p>
                Use the &quot;Switch Role&quot; button in the top navigation bar to test as Administrator or Faculty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
