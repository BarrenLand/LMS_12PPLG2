import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Connection Setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms_db';
let isMongoConnected = false;
let mongoError: string | null = null;

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    mongoError = null;
    console.log('MongoDB connected successfully at', MONGODB_URI);
  } catch (err: any) {
    isMongoConnected = false;
    mongoError = err?.message || 'Failed to connect to MongoDB';
    console.warn('MongoDB Connection Warning:', mongoError);
  }
}

connectMongoDB();

// Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true }, // admin | guru | wali_kelas | murid
  avatar: { type: String },
  classIds: [{ type: String }],
  homeroomClassId: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const classSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  teacherId: { type: String, required: true },
  homeroomTeacherId: { type: String },
  description: { type: String },
  studentIds: [{ type: String }],
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const attendanceSessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  classId: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String },
  isOpen: { type: Boolean, default: true },
  createdBy: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const attendanceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true },
  studentId: { type: String, required: true },
  status: { type: String, required: true }, // present | absent | late | excused
  checkInTime: { type: String },
  method: { type: String, default: 'teacher_marked' },
  notes: { type: String },
});

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  instructions: { type: String },
  classId: { type: String, required: true },
  teacherId: { type: String, required: true },
  maxScore: { type: Number, default: 100 },
  dueDate: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const taskSubmissionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  taskId: { type: String, required: true },
  studentId: { type: String, required: true },
  gdriveUrl: { type: String, required: true },
  note: { type: String },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  score: { type: Number },
  feedback: { type: String },
});

const studyMaterialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: String, required: true },
  authorId: { type: String, required: true },
  type: { type: String, default: 'link' },
  url: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const forumPostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  classId: { type: String, required: true },
  authorId: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() },
  comments: [
    {
      id: { type: String },
      authorId: { type: String },
      content: { type: String },
      createdAt: { type: String },
    },
  ],
});

const UserModel = mongoose.model('User', userSchema);
const ClassModel = mongoose.model('Class', classSchema);
const AttendanceSessionModel = mongoose.model('AttendanceSession', attendanceSessionSchema);
const AttendanceRecordModel = mongoose.model('AttendanceRecord', attendanceRecordSchema);
const TaskModel = mongoose.model('Task', taskSchema);
const TaskSubmissionModel = mongoose.model('TaskSubmission', taskSubmissionSchema);
const StudyMaterialModel = mongoose.model('StudyMaterial', studyMaterialSchema);
const ForumPostModel = mongoose.model('ForumPost', forumPostSchema);

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongoConnected: isMongoConnected,
  });
});

app.get('/api/mongodb/status', async (req, res) => {
  if (!isMongoConnected) {
    // Retry connection
    await connectMongoDB();
  }

  let counts = { users: 0, classes: 0, sessions: 0, records: 0, tasks: 0 };
  if (isMongoConnected) {
    try {
      counts = {
        users: await UserModel.countDocuments(),
        classes: await ClassModel.countDocuments(),
        sessions: await AttendanceSessionModel.countDocuments(),
        records: await AttendanceRecordModel.countDocuments(),
        tasks: await TaskModel.countDocuments(),
      };
    } catch (err) {
      console.error(err);
    }
  }

  res.json({
    connected: isMongoConnected,
    uri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'),
    error: mongoError,
    counts,
  });
});

// Seed API endpoint
app.post('/api/seed', async (req, res) => {
  if (!isMongoConnected) {
    return res.status(503).json({ error: 'MongoDB not connected. Check MONGODB_URI.' });
  }

  try {
    const body = req.body;
    if (body.users) {
      await UserModel.deleteMany({});
      await UserModel.insertMany(body.users);
    }
    if (body.classes) {
      await ClassModel.deleteMany({});
      await ClassModel.insertMany(body.classes);
    }
    if (body.attendanceSessions) {
      await AttendanceSessionModel.deleteMany({});
      await AttendanceSessionModel.insertMany(body.attendanceSessions);
    }
    if (body.attendanceRecords) {
      await AttendanceRecordModel.deleteMany({});
      await AttendanceRecordModel.insertMany(body.attendanceRecords);
    }

    res.json({ success: true, message: 'MongoDB successfully seeded with LMS collections!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes for Users
app.get('/api/users', async (req, res) => {
  if (!isMongoConnected) return res.status(503).json({ error: 'MongoDB offline' });
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  if (!isMongoConnected) return res.status(503).json({ error: 'MongoDB offline' });
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  if (!isMongoConnected) return res.status(503).json({ error: 'MongoDB offline' });
  try {
    const updated = await UserModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  if (!isMongoConnected) return res.status(503).json({ error: 'MongoDB offline' });
  try {
    await UserModel.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes for Classes
app.get('/api/classes', async (req, res) => {
  if (!isMongoConnected) return res.status(503).json({ error: 'MongoDB offline' });
  try {
    const classes = await ClassModel.find();
    res.json(classes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/classes', async (req, res) => {
  if (!isMongoConnected) return res.status(503).json({ error: 'MongoDB offline' });
  try {
    const newClass = new ClassModel(req.body);
    await newClass.save();
    res.json(newClass);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server & Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GoLMS full-stack server with MongoDB listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
