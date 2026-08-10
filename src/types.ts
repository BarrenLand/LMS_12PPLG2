export type UserRole = 'admin' | 'guru' | 'wali_kelas' | 'murid' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  classIds: string[]; // Classes assigned to or enrolled in
  homeroomClassId?: string; // Dedicated homeroom class assigned for 'wali_kelas'
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  homeroomTeacherId?: string; // Wali Kelas assigned to this class
  description: string;
  studentIds: string[];
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  checkInTime?: string;
  method: 'teacher_marked' | 'self_check_in' | 'admin_override';
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "11:00"
  isOpen: boolean; // whether self check-in is enabled
  createdBy: string;
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  classId: string;
  authorId: string;
  type: 'pdf' | 'video' | 'link' | 'doc';
  url: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  instructions: string;
  classId: string;
  teacherId: string;
  maxScore: number;
  dueDate: string;
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  gdriveUrl: string;
  note?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
}

export interface ForumComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  classId: string;
  authorId: string;
  isPinned?: boolean;
  createdAt: string;
  comments: ForumComment[];
}
