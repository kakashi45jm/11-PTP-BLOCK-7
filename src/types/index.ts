export type Role = 'student' | 'teacher' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  title?: string;
  studentNumber?: string;
  officerRole?: string;
  canEdit?: boolean;
}

export interface Student {
  id: string;
  fullName: string;
  gradeAndSection: string;
  studentNumber: string; // Masked for unauthorized viewers
  officerRole?: string;
  bio?: string;
  email?: string;
  phone?: string;
  avatarColor?: string;
  isDemoRecord: boolean;
}

export interface Teacher {
  id: string;
  fullName: string;
  subjectsHandled: string[];
  consultationSchedule: string;
  officialEmail: string;
  department: string;
  roomOrOffice: string;
  specialNote?: string; // For Christian David U. vs Christian David U. Andaya
  avatarColor?: string;
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  assignedTeacher: string;
  scheduledDays: string[];
  scheduledTimes: string;
  description: string;
  color: string;
  specialNote?: string; // For Effective Communication vs Mabisang Komunikasyon
  room: string;
  units?: number;
}

export interface ScheduleEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "07:15" or "7:15 AM"
  endTime: string;   // e.g. "08:45" or "8:45 AM"
  displayTime: string; // e.g. "7:15-8:45 AM"
  subject: string;
  teacher: string;
  type: 'class' | 'break' | 'unconfirmed';
  color?: string;
  room?: string;
  note?: string;           // Special transcription note
  conflictNote?: string;   // Specific overlap alert
  hasConflict?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: 'Class Reminder' | 'Assignment' | 'Exam Notice' | 'Schedule Change' | 'School Activity';
  priority: 'High' | 'Normal' | 'Low';
  attachmentName?: string;
}

export interface Message {
  id: string;
  channelId: string; // 'group-block7' or direct conversation ID
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  timestamp: string;
  avatarColor?: string;
}

export interface SchoolInfo {
  schoolName: string;
  gradeLevel: string;
  programStrand: string;
  section: string;
  term: string;
  schoolYear: string;
  adviser: string;
  roomNumber: string;
  campusAddress: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
  motto: string;
  classSize: number;
}
