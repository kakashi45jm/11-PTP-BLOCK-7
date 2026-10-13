import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialSchoolInfo,
  initialTeachers,
  initialSubjects,
  initialScheduleEntries,
  initialStudents,
  initialAnnouncements,
  initialMessages,
} from './src/data/initialData.ts';
import {
  SchoolInfo,
  Teacher,
  Subject,
  ScheduleEntry,
  Student,
  Announcement,
  Message,
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store on the server
let schoolInfo: SchoolInfo = { ...initialSchoolInfo };
let teachers: Teacher[] = [...initialTeachers];
let subjects: Subject[] = [...initialSubjects];
let scheduleEntries: ScheduleEntry[] = [...initialScheduleEntries];
let students: Student[] = [...initialStudents];
let announcements: Announcement[] = [...initialAnnouncements];
let messages: Message[] = [...initialMessages];

// List of connected SSE clients for real-time messaging
const sseClients: Response[] = [];

function broadcastMessage(msg: Message) {
  const data = JSON.stringify(msg);
  sseClients.forEach((client) => {
    try {
      client.write(`event: new_message\ndata: ${data}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  // 1. School Info
  app.get('/api/school', (_req: Request, res: Response) => {
    res.json(schoolInfo);
  });

  app.put('/api/school', (req: Request, res: Response) => {
    schoolInfo = { ...schoolInfo, ...req.body };
    res.json(schoolInfo);
  });

  // 2. Teachers
  app.get('/api/teachers', (_req: Request, res: Response) => {
    res.json(teachers);
  });

  app.post('/api/teachers', (req: Request, res: Response) => {
    const newTeacher: Teacher = {
      ...req.body,
      id: req.body.id || `t-${Date.now()}`,
    };
    teachers.push(newTeacher);
    res.status(201).json(newTeacher);
  });

  app.put('/api/teachers/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = teachers.findIndex((t) => t.id === id);
    if (index !== -1) {
      teachers[index] = { ...teachers[index], ...req.body };
      res.json(teachers[index]);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  });

  app.delete('/api/teachers/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    teachers = teachers.filter((t) => t.id !== id);
    res.json({ success: true });
  });

  // 3. Subjects
  app.get('/api/subjects', (_req: Request, res: Response) => {
    res.json(subjects);
  });

  app.post('/api/subjects', (req: Request, res: Response) => {
    const newSubject: Subject = {
      ...req.body,
      id: req.body.id || `sub-${Date.now()}`,
    };
    subjects.push(newSubject);
    res.status(201).json(newSubject);
  });

  app.put('/api/subjects/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = subjects.findIndex((s) => s.id === id);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...req.body };
      res.json(subjects[index]);
    } else {
      res.status(404).json({ error: 'Subject not found' });
    }
  });

  app.delete('/api/subjects/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    subjects = subjects.filter((s) => s.id !== id);
    res.json({ success: true });
  });

  // 4. Schedule
  app.get('/api/schedule', (_req: Request, res: Response) => {
    res.json(scheduleEntries);
  });

  app.post('/api/schedule', (req: Request, res: Response) => {
    const newEntry: ScheduleEntry = {
      ...req.body,
      id: req.body.id || `sch-${Date.now()}`,
    };
    scheduleEntries.push(newEntry);
    res.status(201).json(newEntry);
  });

  app.put('/api/schedule/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = scheduleEntries.findIndex((s) => s.id === id);
    if (index !== -1) {
      scheduleEntries[index] = { ...scheduleEntries[index], ...req.body };
      res.json(scheduleEntries[index]);
    } else {
      res.status(404).json({ error: 'Schedule entry not found' });
    }
  });

  app.delete('/api/schedule/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    scheduleEntries = scheduleEntries.filter((s) => s.id !== id);
    res.json({ success: true });
  });

  // 5. Students
  app.get('/api/students', (_req: Request, res: Response) => {
    res.json(students);
  });

  app.post('/api/students', (req: Request, res: Response) => {
    const newStudent: Student = {
      ...req.body,
      id: req.body.id || `stu-${Date.now()}`,
      isDemoRecord: true,
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
  });

  app.put('/api/students/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...req.body };
      res.json(students[index]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  });

  app.delete('/api/students/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    students = students.filter((s) => s.id !== id);
    res.json({ success: true });
  });

  // 6. Announcements
  app.get('/api/announcements', (_req: Request, res: Response) => {
    res.json(announcements);
  });

  app.post('/api/announcements', (req: Request, res: Response) => {
    const newAnn: Announcement = {
      ...req.body,
      id: req.body.id || `ann-${Date.now()}`,
    };
    announcements = [newAnn, ...announcements];
    res.status(201).json(newAnn);
  });

  app.delete('/api/announcements/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    announcements = announcements.filter((a) => a.id !== id);
    res.json({ success: true });
  });

  // 7. Messages & SSE Realtime
  app.get('/api/messages', (req: Request, res: Response) => {
    const channelId = (req.query.channelId as string) || 'group-block7';
    const filtered = messages.filter((m) => m.channelId === channelId);
    res.json(filtered);
  });

  app.post('/api/messages', (req: Request, res: Response) => {
    const newMsg: Message = {
      ...req.body,
      id: req.body.id || `msg-${Date.now()}`,
      timestamp:
        req.body.timestamp ||
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    messages.push(newMsg);
    broadcastMessage(newMsg);
    res.status(201).json(newMsg);
  });

  app.delete('/api/messages', (_req: Request, res: Response) => {
    messages = [];
    broadcastMessage({
      id: `clear-${Date.now()}`,
      channelId: 'all',
      senderId: 'system',
      senderName: 'System',
      senderRole: 'admin',
      text: '__MESSAGES_CLEARED__',
      timestamp: '',
    });
    res.json({ success: true, count: 0 });
  });

  app.delete('/api/messages/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    messages = messages.filter((m) => m.id !== id);
    res.json({ success: true });
  });

  // Server-Sent Events stream for real-time messaging
  app.get('/api/messages/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) {
        sseClients.splice(idx, 1);
      }
    });
  });

  // 8. Auth simulation endpoint
  // 8. Auth endpoint with strict password enforcement
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { role, username, password } = req.body;
    const normalizedRole = role === 'president' ? 'student' : role;

    // Password validation per user specification
    if (normalizedRole === 'admin') {
      if (password !== 'cyratot23') {
        return res.status(401).json({ error: 'Incorrect password for Administrator.' });
      }
    } else if (normalizedRole === 'teacher') {
      if (password !== 'admin123') {
        return res.status(401).json({ error: 'Incorrect password for Teacher.' });
      }
    } else {
      // president / student
      if (password !== 'admin123') {
        return res.status(401).json({ error: 'Incorrect password for Class President.' });
      }
    }

    let userObj;
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
    res.json({ success: true, user: userObj });
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Grade 11 - PTP Block 7 server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
