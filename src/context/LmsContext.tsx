import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Class,
  StudyMaterial,
  Task,
  TaskSubmission,
  ForumPost,
  UserRole,
  AttendanceSession,
  AttendanceRecord,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_MATERIALS,
  INITIAL_TASKS,
  INITIAL_SUBMISSIONS,
  INITIAL_FORUMS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
} from '../data/mockData';

interface LmsContextType {
  currentUser: User;
  isLoggedIn: boolean;
  users: User[];
  classes: Class[];
  materials: StudyMaterial[];
  tasks: Task[];
  submissions: TaskSubmission[];
  forumPosts: ForumPost[];
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;

  // Auth & User Actions
  login: (email: string, password?: string) => { success: boolean; message?: string };
  loginAsUser: (userId: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  editUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  // Class Actions (Admin)
  addClass: (cls: Omit<Class, 'id' | 'createdAt'>) => void;
  editClass: (cls: Class) => void;
  deleteClass: (classId: string) => void;
  addStudentToClass: (classId: string, studentId: string) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
  moveStudentBetweenClasses: (studentId: string, fromClassId: string, toClassId: string) => void;

  // Attendance Actions (Teacher / Student / Admin)
  createAttendanceSession: (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>) => AttendanceSession;
  toggleAttendanceSessionOpen: (sessionId: string, isOpen: boolean) => void;
  deleteAttendanceSession: (sessionId: string) => void;
  markAttendance: (
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    notes?: string,
    method?: 'teacher_marked' | 'self_check_in' | 'admin_override'
  ) => void;
  studentSelfCheckIn: (sessionId: string, studentId: string) => { success: boolean; message: string };
  adminOverrideAttendance: (sessionId: string, studentId: string, status: AttendanceStatus, notes?: string) => void;

  // Material Actions (Teacher)
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => void;
  deleteMaterial: (materialId: string) => void;

  // Task & Grading Actions (Teacher)
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (taskId: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Submission Actions (Student)
  submitTask: (taskId: string, gdriveUrl: string, note?: string) => void;

  // Forum Actions
  addForumPost: (title: string, content: string, classId: string, isPinned?: boolean) => void;
  deleteForumPost: (postId: string) => void;
  addForumComment: (postId: string, content: string) => void;

  // Reset
  resetData: () => void;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

const STORAGE_KEY = 'GOLANG_LMS_DATA_V2';

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = users.find((u) => u.id === parsed.id);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // Admin by default
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_is_logged_in`);
    return saved !== null ? saved === 'true' : true;
  });

  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_materials`);
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_forums`);
    return saved ? JSON.parse(saved) : INITIAL_FORUMS;
  });

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_att_sessions`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_SESSIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_att_records`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_materials`, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_forums`, JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_att_sessions`, JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_att_records`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_is_logged_in`, String(isLoggedIn));
  }, [isLoggedIn]);

  const login = (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      return { success: true };
    }
    return {
      success: false,
      message: 'Account not found with this email. Please check your credentials or click a 1-Click Role Login.',
    };
  };

  const loginAsUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${userData.role}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const editUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    // Also remove user from classes
    setClasses((prev) =>
      prev.map((c) => ({
        ...c,
        studentIds: c.studentIds.filter((id) => id !== userId),
      }))
    );
    if (currentUser.id === userId) {
      const fallback = users.find((u) => u.role === 'admin' && u.id !== userId) || INITIAL_USERS[0];
      setCurrentUser(fallback);
    }
  };

  const addClass = (clsData: Omit<Class, 'id' | 'createdAt'>) => {
    const newClass: Class = {
      ...clsData,
      id: `cls-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const editClass = (updatedClass: Class) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
  };

  const deleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  // Student Placement Functions
  const addStudentToClass = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          const exists = c.studentIds.includes(studentId);
          return exists ? c : { ...c, studentIds: [...c.studentIds, studentId] };
        }
        return c;
      })
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === studentId) {
          const exists = u.classIds.includes(classId);
          return exists ? u : { ...u, classIds: [...u.classIds, classId] };
        }
        return u;
      })
    );
  };

  const removeStudentFromClass = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return { ...c, studentIds: c.studentIds.filter((id) => id !== studentId) };
        }
        return c;
      })
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === studentId) {
          return { ...u, classIds: u.classIds.filter((id) => id !== classId) };
        }
        return u;
      })
    );
  };

  const moveStudentBetweenClasses = (studentId: string, fromClassId: string, toClassId: string) => {
    removeStudentFromClass(fromClassId, studentId);
    addStudentToClass(toClassId, studentId);
  };

  // Attendance Functions
  const createAttendanceSession = (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>) => {
    const newSession: AttendanceSession = {
      ...sessionData,
      id: `att-sess-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAttendanceSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const toggleAttendanceSessionOpen = (sessionId: string, isOpen: boolean) => {
    setAttendanceSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isOpen } : s))
    );
  };

  const deleteAttendanceSession = (sessionId: string) => {
    setAttendanceSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setAttendanceRecords((prev) => prev.filter((r) => r.sessionId !== sessionId));
  };

  const markAttendance = (
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    notes?: string,
    method: 'teacher_marked' | 'self_check_in' | 'admin_override' = 'teacher_marked'
  ) => {
    const existingIndex = attendanceRecords.findIndex(
      (r) => r.sessionId === sessionId && r.studentId === studentId
    );

    const record: AttendanceRecord = {
      id: existingIndex >= 0 ? attendanceRecords[existingIndex].id : `att-rec-${Date.now()}`,
      sessionId,
      studentId,
      status,
      checkInTime: new Date().toISOString(),
      method,
      notes,
    };

    if (existingIndex >= 0) {
      setAttendanceRecords((prev) => prev.map((r, i) => (i === existingIndex ? record : r)));
    } else {
      setAttendanceRecords((prev) => [record, ...prev]);
    }
  };

  const studentSelfCheckIn = (sessionId: string, studentId: string) => {
    const session = attendanceSessions.find((s) => s.id === sessionId);
    if (!session) {
      return { success: false, message: 'Attendance session not found.' };
    }
    if (!session.isOpen) {
      return { success: false, message: 'This attendance session is closed by the instructor.' };
    }

    const existing = attendanceRecords.find(
      (r) => r.sessionId === sessionId && r.studentId === studentId
    );
    if (existing && existing.status === 'present') {
      return { success: true, message: 'You have already checked in for this session!' };
    }

    markAttendance(sessionId, studentId, 'present', 'Student self check-in', 'self_check_in');
    return { success: true, message: 'Attendance marked successfully! You are recorded as Present.' };
  };

  const adminOverrideAttendance = (
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    notes?: string
  ) => {
    markAttendance(
      sessionId,
      studentId,
      status,
      notes ? `[Admin Re-check]: ${notes}` : '[Admin Re-check]',
      'admin_override'
    );
  };

  const addMaterial = (matData: Omit<StudyMaterial, 'id' | 'createdAt'>) => {
    const newMat: StudyMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  const deleteMaterial = (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSubmissions((prev) => prev.filter((s) => s.taskId !== taskId));
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, score, feedback } : sub))
    );
  };

  const submitTask = (taskId: string, gdriveUrl: string, note?: string) => {
    const existingIndex = submissions.findIndex(
      (s) => s.taskId === taskId && s.studentId === currentUser.id
    );

    const newSub: TaskSubmission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      taskId,
      studentId: currentUser.id,
      gdriveUrl,
      note,
      submittedAt: new Date().toISOString(),
      score: existingIndex >= 0 ? submissions[existingIndex].score : undefined,
      feedback: existingIndex >= 0 ? submissions[existingIndex].feedback : undefined,
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) => prev.map((s, idx) => (idx === existingIndex ? newSub : s)));
    } else {
      setSubmissions((prev) => [newSub, ...prev]);
    }
  };

  const addForumPost = (title: string, content: string, classId: string, isPinned = false) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      classId,
      authorId: currentUser.id,
      isPinned,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setForumPosts((prev) => [newPost, ...prev]);
  };

  const deleteForumPost = (postId: string) => {
    setForumPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const addForumComment = (postId: string, content: string) => {
    const newComment = {
      id: `cmt-${Date.now()}`,
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };

    setForumPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    );
  };

  const resetData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${STORAGE_KEY}_is_logged_in`);
    localStorage.removeItem(`${STORAGE_KEY}_classes`);
    localStorage.removeItem(`${STORAGE_KEY}_materials`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_submissions`);
    localStorage.removeItem(`${STORAGE_KEY}_forums`);
    localStorage.removeItem(`${STORAGE_KEY}_att_sessions`);
    localStorage.removeItem(`${STORAGE_KEY}_att_records`);

    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoggedIn(true);
    setClasses(INITIAL_CLASSES);
    setMaterials(INITIAL_MATERIALS);
    setTasks(INITIAL_TASKS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setForumPosts(INITIAL_FORUMS);
    setAttendanceSessions(INITIAL_ATTENDANCE_SESSIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
  };

  return (
    <LmsContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        users,
        classes,
        materials,
        tasks,
        submissions,
        forumPosts,
        attendanceSessions,
        attendanceRecords,
        activeTab,
        setActiveTab,
        selectedClassId,
        setSelectedClassId,
        login,
        loginAsUser,
        logout,
        switchUser,
        addUser,
        editUser,
        deleteUser,
        addClass,
        editClass,
        deleteClass,
        addStudentToClass,
        removeStudentFromClass,
        moveStudentBetweenClasses,
        createAttendanceSession,
        toggleAttendanceSessionOpen,
        deleteAttendanceSession,
        markAttendance,
        studentSelfCheckIn,
        adminOverrideAttendance,
        addMaterial,
        deleteMaterial,
        addTask,
        deleteTask,
        gradeSubmission,
        submitTask,
        addForumPost,
        deleteForumPost,
        addForumComment,
        resetData,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within a LmsProvider');
  }
  return context;
};
