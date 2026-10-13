import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeDashboard } from './components/HomeDashboard';
import { SectionOverview } from './components/SectionOverview';
import { ScheduleView } from './components/ScheduleView';
import { StudentDirectory } from './components/StudentDirectory';
import { TeacherDirectory } from './components/TeacherDirectory';
import { SubjectDirectory } from './components/SubjectDirectory';
import { SchoolMap } from './components/SchoolMap';
import { MessagingApp } from './components/MessagingApp';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';

import {
  SchoolInfo,
  Teacher,
  Subject,
  ScheduleEntry,
  Student,
  Announcement,
  Message,
  User,
} from './types';
import { api } from './services/api';
import {
  initialSchoolInfo,
  initialTeachers,
  initialSubjects,
  initialScheduleEntries,
  initialStudents,
  initialAnnouncements,
  initialMessages,
} from './data/initialData';
import { WifiOff, Loader2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Core Data States
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(initialSchoolInfo);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>(initialScheduleEntries);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentUser, setCurrentUser] = useState<User>(api.getCurrentUser());

  // Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial Load from API / Storage
  useEffect(() => {
    async function loadData() {
      try {
        const [info, tList, sList, schList, stuList, aList, mList] = await Promise.all([
          api.getSchoolInfo(),
          api.getTeachers(),
          api.getSubjects(),
          api.getSchedule(),
          api.getStudents(),
          api.getAnnouncements(),
          api.getMessages(),
        ]);
        setSchoolInfo(info);
        setTeachers(tList);
        setSubjects(sList);
        setScheduleEntries(schList);
        setStudents(stuList);
        setAnnouncements(aList);
        setMessages(mList);
      } catch (err) {
        console.warn('Data load error, using fallbacks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Listen to cross-tab storage sync
  useEffect(() => {
    const handleStorageUpdate = async () => {
      const [info, schList, stuList, aList] = await Promise.all([
        api.getSchoolInfo(),
        api.getSchedule(),
        api.getStudents(),
        api.getAnnouncements(),
      ]);
      setSchoolInfo(info);
      setScheduleEntries(schList);
      setStudents(stuList);
      setAnnouncements(aList);
    };
    window.addEventListener('ptp_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('ptp_storage_updated', handleStorageUpdate);
  }, []);

  // Handlers for School Info
  const handleUpdateSchoolInfo = async (updated: Partial<SchoolInfo>) => {
    const newInfo = await api.updateSchoolInfo(updated);
    setSchoolInfo(newInfo);
  };

  // Handlers for Schedule
  const handleAddScheduleEntry = async (entry: ScheduleEntry) => {
    const updated = await api.addScheduleEntry(entry);
    setScheduleEntries(updated);
  };

  const handleUpdateScheduleEntry = async (entry: ScheduleEntry) => {
    const updated = await api.updateScheduleEntry(entry);
    setScheduleEntries(updated);
  };

  const handleDeleteScheduleEntry = async (id: string) => {
    const updated = await api.deleteScheduleEntry(id);
    setScheduleEntries(updated);
  };

  // Handlers for Students
  const handleAddStudent = async (student: Student) => {
    const updated = await api.addStudent(student);
    setStudents(updated);
  };

  const handleUpdateStudent = async (student: Student) => {
    const updated = await api.updateStudent(student);
    setStudents(updated);
  };

  const handleDeleteStudent = async (id: string) => {
    const updated = await api.deleteStudent(id);
    setStudents(updated);
  };

  // Handlers for Teachers
  const handleAddTeacher = async (teacher: Teacher) => {
    const updated = await api.addTeacher(teacher);
    setTeachers(updated);
  };

  const handleUpdateTeacher = async (teacher: Teacher) => {
    const updated = await api.updateTeacher(teacher);
    setTeachers(updated);
  };

  const handleDeleteTeacher = async (id: string) => {
    const updated = await api.deleteTeacher(id);
    setTeachers(updated);
  };

  // Handlers for Subjects
  const handleAddSubject = async (subject: Subject) => {
    const updated = await api.addSubject(subject);
    setSubjects(updated);
  };

  const handleUpdateSubject = async (subject: Subject) => {
    const updated = await api.updateSubject(subject);
    setSubjects(updated);
  };

  const handleDeleteSubject = async (id: string) => {
    const updated = await api.deleteSubject(id);
    setSubjects(updated);
  };

  // Handlers for Announcements
  const handleAddAnnouncement = async (ann: Announcement) => {
    const updated = await api.addAnnouncement(ann);
    setAnnouncements(updated);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const updated = await api.deleteAnnouncement(id);
    setAnnouncements(updated);
  };

  // Handlers for Messages
  const handleSendMessage = async (msg: Message) => {
    const sent = await api.sendMessage(msg);
    setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    return sent;
  };

  const handleClearAllMessages = async () => {
    await api.clearAllMessages();
    setMessages([]);
  };

  const handleDeleteMessage = async (id: string) => {
    await api.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Switch Current User
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    api.setCurrentUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f294a] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-3" />
        <h2 className="text-lg font-bold">Grade 11 - PTP Block 7 Portal</h2>
        <p className="text-xs text-blue-200">Loading classroom records &amp; timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-900">
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You are currently in offline mode. Cached classroom records and schedule are preserved.</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        unreadCount={0}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <HomeDashboard
            schoolInfo={schoolInfo}
            onUpdateSchoolInfo={handleUpdateSchoolInfo}
            scheduleEntries={scheduleEntries}
            announcements={announcements}
            studentCount={students.length}
            teacherCount={teachers.length}
            subjectCount={subjects.length}
            currentUser={currentUser}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'section' && (
          <SectionOverview
            schoolInfo={schoolInfo}
            onUpdateSchoolInfo={handleUpdateSchoolInfo}
            students={students}
            announcements={announcements}
            currentUser={currentUser}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectStudent={() => setCurrentTab('students')}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleView
            scheduleEntries={scheduleEntries}
            subjects={subjects}
            teachers={teachers}
            currentUser={currentUser}
            onAddEntry={handleAddScheduleEntry}
            onUpdateEntry={handleUpdateScheduleEntry}
            onDeleteEntry={handleDeleteScheduleEntry}
          />
        )}

        {currentTab === 'students' && (
          <StudentDirectory
            students={students}
            currentUser={currentUser}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {currentTab === 'teachers' && (
          <TeacherDirectory
            teachers={teachers}
            currentUser={currentUser}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onNavigateToMessage={() => setCurrentTab('messages')}
          />
        )}

        {currentTab === 'subjects' && (
          <SubjectDirectory
            subjects={subjects}
            teachers={teachers}
            currentUser={currentUser}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
            onNavigateToScheduleFilter={() => setCurrentTab('schedule')}
          />
        )}

        {currentTab === 'map' && (
          <SchoolMap
            schoolInfo={schoolInfo}
            currentUser={currentUser}
            onUpdateLocation={handleUpdateSchoolInfo}
          />
        )}

        {currentTab === 'messages' && (
          <MessagingApp
            currentUser={currentUser}
            initialMessages={messages}
            students={students}
            teachers={teachers}
            onSendMessage={handleSendMessage}
            onClearAllMessages={handleClearAllMessages}
            onDeleteMessage={handleDeleteMessage}
          />
        )}

        {currentTab === 'announcements' && (
          <AnnouncementsView
            announcements={announcements}
            currentUser={currentUser}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUpdateCurrentUser={handleSelectUser}
            onSwitchRole={() => setAuthModalOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer schoolInfo={schoolInfo} onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Role Switcher & Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}
