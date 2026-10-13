import {
  SchoolInfo,
  Teacher,
  Subject,
  ScheduleEntry,
  Student,
  Announcement,
  Message,
  User,
} from '../types';
import {
  initialSchoolInfo,
  initialTeachers,
  initialSubjects,
  initialScheduleEntries,
  initialStudents,
  initialAnnouncements,
  initialMessages,
} from '../data/initialData';

const STORAGE_KEYS = {
  SCHOOL_INFO: 'ptp_block7_school_info_v4',
  TEACHERS: 'ptp_block7_teachers_v1',
  SUBJECTS: 'ptp_block7_subjects_v1',
  SCHEDULE: 'ptp_block7_schedule_v1',
  STUDENTS: 'ptp_block7_students_v1',
  ANNOUNCEMENTS: 'ptp_block7_announcements_v1',
  MESSAGES: 'ptp_block7_messages_v2',
  CURRENT_USER: 'ptp_block7_current_user_v1',
};

// Helper: load from localStorage with fallback
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
  }
  return defaultValue;
}

// Helper: save to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom storage event for local multi-tab sync
    window.dispatchEvent(new Event('ptp_storage_updated'));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
}

// Detect time overlap between two entries on the same day
export function checkScheduleOverlap(
  e1: { day: string; startTime: string; endTime: string; id?: string },
  e2: { day: string; startTime: string; endTime: string; id?: string }
): boolean {
  if (e1.day !== e2.day) return false;
  if (e1.id && e2.id && e1.id === e2.id) return false;

  const toMinutes = (timeStr: string) => {
    // Handle formats like "07:15", "7:15 AM", "12:00 PM"
    const cleaned = timeStr.trim().toUpperCase();
    let hours = 0;
    let minutes = 0;
    if (cleaned.includes('AM') || cleaned.includes('PM')) {
      const isPM = cleaned.includes('PM');
      const timePart = cleaned.replace(/AM|PM/g, '').trim();
      const parts = timePart.split(':');
      hours = parseInt(parts[0] || '0', 10);
      minutes = parseInt(parts[1] || '0', 10);
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    } else {
      const parts = cleaned.split(':');
      hours = parseInt(parts[0] || '0', 10);
      minutes = parseInt(parts[1] || '0', 10);
    }
    return hours * 60 + minutes;
  };

  const start1 = toMinutes(e1.startTime);
  const end1 = toMinutes(e1.endTime);
  const start2 = toMinutes(e2.startTime);
  const end2 = toMinutes(e2.endTime);

  return start1 < end2 && start2 < end1;
}

export const api = {
  // School Info
  async getSchoolInfo(): Promise<SchoolInfo> {
    try {
      const res = await fetch('/api/school');
      if (res.ok) {
        const data = await res.json();
        saveToStorage(STORAGE_KEYS.SCHOOL_INFO, data);
        return data;
      }
    } catch {
      // Fallback to storage
    }
    return loadFromStorage<SchoolInfo>(STORAGE_KEYS.SCHOOL_INFO, initialSchoolInfo);
  },

  async updateSchoolInfo(info: Partial<SchoolInfo>): Promise<SchoolInfo> {
    const current = await this.getSchoolInfo();
    const updated = { ...current, ...info };
    saveToStorage(STORAGE_KEYS.SCHOOL_INFO, updated);

    try {
      await fetch('/api/school', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    try {
      const res = await fetch('/api/teachers');
      if (res.ok) {
        const data = await res.json();
        saveToStorage(STORAGE_KEYS.TEACHERS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return loadFromStorage<Teacher[]>(STORAGE_KEYS.TEACHERS, initialTeachers);
  },

  async addTeacher(teacher: Teacher): Promise<Teacher[]> {
    const list = await this.getTeachers();
    const updated = [...list, teacher];
    saveToStorage(STORAGE_KEYS.TEACHERS, updated);
    try {
      await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async updateTeacher(teacher: Teacher): Promise<Teacher[]> {
    const list = await this.getTeachers();
    const updated = list.map((t) => (t.id === teacher.id ? teacher : t));
    saveToStorage(STORAGE_KEYS.TEACHERS, updated);
    try {
      await fetch(`/api/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async deleteTeacher(id: string): Promise<Teacher[]> {
    const list = await this.getTeachers();
    const updated = list.filter((t) => t.id !== id);
    saveToStorage(STORAGE_KEYS.TEACHERS, updated);
    try {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    } catch {
      // offline ok
    }
    return updated;
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    try {
      const res = await fetch('/api/subjects');
      if (res.ok) {
        const data = await res.json();
        saveToStorage(STORAGE_KEYS.SUBJECTS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return loadFromStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, initialSubjects);
  },

  async addSubject(subject: Subject): Promise<Subject[]> {
    const list = await this.getSubjects();
    const updated = [...list, subject];
    saveToStorage(STORAGE_KEYS.SUBJECTS, updated);
    try {
      await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async updateSubject(subject: Subject): Promise<Subject[]> {
    const list = await this.getSubjects();
    const updated = list.map((s) => (s.id === subject.id ? subject : s));
    saveToStorage(STORAGE_KEYS.SUBJECTS, updated);
    try {
      await fetch(`/api/subjects/${subject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async deleteSubject(id: string): Promise<Subject[]> {
    const list = await this.getSubjects();
    const updated = list.filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SUBJECTS, updated);
    try {
      await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    } catch {
      // offline ok
    }
    return updated;
  },

  // Schedule Entries
  async getSchedule(): Promise<ScheduleEntry[]> {
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        saveToStorage(STORAGE_KEYS.SCHEDULE, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return loadFromStorage<ScheduleEntry[]>(STORAGE_KEYS.SCHEDULE, initialScheduleEntries);
  },

  async addScheduleEntry(entry: ScheduleEntry): Promise<ScheduleEntry[]> {
    const list = await this.getSchedule();
    // Check conflicts
    const overlaps = list.filter((item) => item.type === 'class' && checkScheduleOverlap(item, entry));
    if (overlaps.length > 0) {
      entry.hasConflict = true;
      entry.conflictNote = `Conflicts with ${overlaps.map((o) => `${o.subject} (${o.displayTime})`).join(', ')}`;
    }

    const updated = [...list, entry];
    saveToStorage(STORAGE_KEYS.SCHEDULE, updated);
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async updateScheduleEntry(entry: ScheduleEntry): Promise<ScheduleEntry[]> {
    const list = await this.getSchedule();
    // Check conflicts with other entries
    const overlaps = list.filter(
      (item) => item.id !== entry.id && item.type === 'class' && checkScheduleOverlap(item, entry)
    );
    if (overlaps.length > 0) {
      entry.hasConflict = true;
      entry.conflictNote = `Conflicts with ${overlaps.map((o) => `${o.subject} (${o.displayTime})`).join(', ')}`;
    } else if (!entry.note?.includes('overlap')) {
      entry.hasConflict = false;
      entry.conflictNote = undefined;
    }

    const updated = list.map((item) => (item.id === entry.id ? entry : item));
    saveToStorage(STORAGE_KEYS.SCHEDULE, updated);
    try {
      await fetch(`/api/schedule/${entry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async deleteScheduleEntry(id: string): Promise<ScheduleEntry[]> {
    const list = await this.getSchedule();
    const updated = list.filter((item) => item.id !== id);
    saveToStorage(STORAGE_KEYS.SCHEDULE, updated);
    try {
      await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
    } catch {
      // offline ok
    }
    return updated;
  },

  // Students
  async getStudents(): Promise<Student[]> {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        saveToStorage(STORAGE_KEYS.STUDENTS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
  },

  async addStudent(student: Student): Promise<Student[]> {
    const list = await this.getStudents();
    const updated = [...list, student];
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async updateStudent(student: Student): Promise<Student[]> {
    const list = await this.getStudents();
    const updated = list.map((s) => (s.id === student.id ? student : s));
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
    try {
      await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async deleteStudent(id: string): Promise<Student[]> {
    const list = await this.getStudents();
    const updated = list.filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
    } catch {
      // offline ok
    }
    return updated;
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return loadFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  },

  async addAnnouncement(announcement: Announcement): Promise<Announcement[]> {
    const list = await this.getAnnouncements();
    const updated = [announcement, ...list];
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    try {
      await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
    } catch {
      // offline ok
    }
    return updated;
  },

  async deleteAnnouncement(id: string): Promise<Announcement[]> {
    const list = await this.getAnnouncements();
    const updated = list.filter((a) => a.id !== id);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    } catch {
      // offline ok
    }
    return updated;
  },

  // Messages
  async getMessages(channelId = 'group-block7'): Promise<Message[]> {
    try {
      const res = await fetch(`/api/messages?channelId=${encodeURIComponent(channelId)}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }
    const all = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, initialMessages);
    return all.filter((m) => m.channelId === channelId);
  },

  async sendMessage(message: Message): Promise<Message> {
    const all = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, initialMessages);
    all.push(message);
    saveToStorage(STORAGE_KEYS.MESSAGES, all);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline ok
    }
    return message;
  },

  async clearAllMessages(): Promise<void> {
    saveToStorage(STORAGE_KEYS.MESSAGES, []);
    try {
      await fetch('/api/messages', { method: 'DELETE' });
    } catch {
      // offline ok
    }
  },

  async deleteMessage(id: string): Promise<void> {
    const all = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const updated = all.filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.MESSAGES, updated);
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    } catch {
      // offline ok
    }
  },

  // Current User / Session
  getCurrentUser(): User {
    const defaultUser: User = {
      id: 'stu-1',
      name: 'John Carlo C. Bautista',
      email: 'jc.bautista@student.school.edu.ph',
      role: 'student',
      title: 'Class President',
      studentNumber: '2024-PTP-0701',
      officerRole: 'Class President',
      avatar: '#1e40af',
      canEdit: true,
    };
    return loadFromStorage<User>(STORAGE_KEYS.CURRENT_USER, defaultUser);
  },

  setCurrentUser(user: User): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  async login(role: 'teacher' | 'president' | 'student' | 'admin', password: string, username?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const normalizedRole = role === 'president' ? 'student' : role;
    
    // Try backend authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: normalizedRole, password, username }),
      });
      if (res.ok) {
        const data = await res.json();
        this.setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else if (res.status === 401) {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Incorrect password.' };
      }
    } catch {
      // offline / static hosting fallback (e.g. Vercel static build)
    }

    // Client-side authentication fallback for any hosting provider
    const correctPassword =
      normalizedRole === 'admin'
        ? 'cyratot23'
        : 'admin123'; // teacher and president/student use admin123

    if (password !== correctPassword) {
      const roleName = normalizedRole === 'admin' ? 'Administrator' : normalizedRole === 'teacher' ? 'Teacher' : 'Class President';
      return { success: false, error: `Incorrect password for ${roleName}. Please try again.` };
    }

    let userObj: User;
    if (normalizedRole === 'admin') {
      userObj = {
        id: 'admin-1',
        name: username || 'Principal / Registrar Admin',
        email: 'admin.office@school.edu.ph',
        role: 'admin',
        title: 'System Administrator & Registrar',
        avatar: '#0f172a',
        canEdit: true,
      };
    } else if (normalizedRole === 'teacher') {
      userObj = {
        id: 'teacher-eliza',
        name: username || 'Eliza P. Zarate',
        email: 'eliza.zarate@school.edu.ph',
        role: 'teacher',
        title: 'Class Adviser & CSS Instructor',
        avatar: '#1d4ed8',
        canEdit: true,
      };
    } else {
      userObj = {
        id: 'stu-1',
        name: username || 'John Carlo C. Bautista',
        email: 'jc.bautista@student.school.edu.ph',
        role: 'student',
        title: 'Class President',
        studentNumber: '2024-PTP-0701',
        officerRole: 'Class President',
        avatar: '#1e40af',
        canEdit: true,
      };
    }

    this.setCurrentUser(userObj);
    return { success: true, user: userObj };
  },
};
