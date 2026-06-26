import express from 'express';
import { db } from './db.js';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Admin hardcoded
const ADMIN = { username: 'admin', password: 'admin' };

// Admin login (frontend check)
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// Add class
app.post('/add-class', async (req, res) => {
  const { name } = req.body;
  console.log(name);
  await db.query('INSERT INTO classes (name) VALUES (?)', [name]);
  res.json({ success: true });
});

// Add subject
app.post('/add-subject', async (req, res) => {
  const { name } = req.body;
  await db.query('INSERT INTO subjects (name) VALUES (?)', [name]);
  res.json({ success: true });
});

// Create staff
app.post('/create-staff', async (req, res) => {
  const { username, password } = req.body;
  const [user] = await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, 'staff']);
  const userId = user.insertId;
  await db.query('INSERT INTO staff (user_id) VALUES (?)', [userId]);
  res.json({ success: true });
});

// Assign class and subject to staff
app.post('/assign-class-subject', async (req, res) => {
  const { staffId, classId, subjectId } = req.body;
  await db.query('INSERT INTO staff_assignments (staff_id, class_id, subject_id) VALUES (?, ?, ?)', [staffId, classId, subjectId]);
  res.json({ success: true });
});

//create student
app.post('/create-student', async (req, res) => {
    const { username, password, classId } = req.body;
    console.log(username);
  
    try {
      const [user] = await db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, password, 'student']
      );
      const userId = user.insertId;
  
      await db.query('INSERT INTO students (user_id, class_id) VALUES (?, ?)', [
        userId,
        classId,
      ]);
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  });
  
  // get classes for dropdown
  app.get('/classes', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM classes');
    res.json(rows);
  });
  

// Staff login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (rows.length > 0) {
    res.json({ success: true, user: rows[0] });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/studentlogin', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
  
    if (rows.length > 0) {
      const user = rows[0];
  
      if (user.role === 'student') {
        const [studentData] = await db.query(
          'SELECT * FROM students WHERE user_id = ?',
          [user.id]
        );
  
        if (studentData.length > 0) {
          const student = studentData[0];
          return res.json({
            success: true,
            user: {
              ...user,
              studentId: student.id,
              classId: student.class_id
            }
          });
        }
      }
  
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false });
    }
  });
  


  
//to get staff assignments
app.get("/staff-assignments/:staffId", async (req, res) => {
    const { staffId } = req.params;
    const [rows] = await db.query(
      `SELECT sa.id, c.name AS class_name, s.name AS subject_name
       FROM staff_assignments sa
       JOIN classes c ON sa.class_id = c.id
       JOIN subjects s ON sa.subject_id = s.id
       JOIN staff st ON sa.staff_id = st.id
       WHERE st.user_id = ?`,
      [staffId]
    );
    res.json(rows);
  });
  
// Add journal topic
app.post('/add-journal-topic', upload.single('file'), async (req, res) => {
  const { staff_assignment_id, title, description } = req.body;
  const filePath = req.file ? req.file.path : null;
  await db.query('INSERT INTO journal_topics (staff_assignment_id, title, description, file_path) VALUES (?, ?, ?, ?)', [staff_assignment_id, title, description, filePath]);
  res.json({ success: true });
});

// Student journal submission
app.post('/submit-journal', upload.single('file'), async (req, res) => {
  const { topic_id, student_id, content } = req.body;
  const filePath = req.file ? req.file.path : null;
  await db.query('INSERT INTO journal_submissions (topic_id, student_id, content, file_path) VALUES (?, ?, ?, ?)', [topic_id, student_id, content, filePath]);
  res.json({ success: true });
});

// Get topics for student
app.get('/get-topics/:classId/:subjectId', async (req, res) => {
  const { classId, subjectId } = req.params;
  const [rows] = await db.query(`
    SELECT jt.*, sa.class_id, sa.subject_id FROM journal_topics jt
    JOIN staff_assignments sa ON jt.staff_assignment_id = sa.id
    WHERE sa.class_id = ? AND sa.subject_id = ?
  `, [classId, subjectId]);
  res.json(rows);
});

//Journal Topic by class id
app.get('/journal-topics/:classId', async (req, res) => {
    const { classId } = req.params;
  
    const [rows] = await db.query(`
      SELECT jt.id, jt.title, jt.description, jt.file_path, jt.created_at, s.name AS subject_name
      FROM journal_topics jt
      JOIN staff_assignments sa ON jt.staff_assignment_id = sa.id
      JOIN subjects s ON sa.subject_id = s.id
      WHERE sa.class_id = ?
      ORDER BY jt.created_at DESC
    `, [classId]);
  
    res.json(rows);
  });
  

// Get submissions for staff
app.get('/get-submissions/:topicId', async (req, res) => {
  const { topicId } = req.params;
  const [rows] = await db.query(`
    SELECT js.*, u.username FROM journal_submissions js
    JOIN students s ON js.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE js.topic_id = ?
  `, [topicId]);
  res.json(rows);
});


// Fetch all classes
app.get('/classes', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM classes');
    res.json(rows);
  });
  
  // Fetch all subjects
  app.get('/subjects', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM subjects');
    res.json(rows);
  });
  
  // Fetch all staff with username
  app.get('/staffs', async (req, res) => {
    const [rows] = await db.query(`
      SELECT staff.id, users.username 
      FROM staff 
      JOIN users ON staff.user_id = users.id
    `);
    res.json(rows);
  });
  


  app.post('/upload-journal', upload.single('file'), async (req, res) => {
    const { topic_id, student_id, content } = req.body;
    const filePath = req.file ? req.file.path : null;
  
    try {
      await db.query(
        `INSERT INTO journal_submissions (topic_id, student_id, content, file_path) VALUES (?, ?, ?, ?)`,
        [topic_id, student_id, content, filePath]
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Error uploading journal:', error);
      res.status(500).json({ success: false, message: 'Failed to upload journal' });
    }
  });

  //Journal for staff
  app.get('/submitted-journals/:staffId', async (req, res) => {
    const { staffId } = req.params;
  
    try {
      const [rows] = await db.query(`
        SELECT 
          js.id as submission_id,
          js.content,
          js.file_path,
          js.feedback,
          js.submitted_at,
          s.user_id,
          u.username,
          jt.title as topic_title
        FROM journal_submissions js
        JOIN students s ON js.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN journal_topics jt ON js.topic_id = jt.id
        JOIN staff_assignments sa ON jt.staff_assignment_id = sa.id
        WHERE sa.staff_id = ?
        ORDER BY js.submitted_at DESC
      `, [staffId]);
  
      res.json(rows);
    } catch (err) {
      console.error("Error fetching journal submissions:", err);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  //Give Feedback
  app.post('/give-feedback', async (req, res) => {
    const { submission_id, feedback } = req.body;
  
    try {
      await db.query(`UPDATE journal_submissions SET feedback = ? WHERE id = ?`, [feedback, submission_id]);
      res.json({ success: true });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      res.status(500).json({ success: false });
    }
  });

  app.get('/student/journal-submissions/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
      const [rows] = await db.query(
        `SELECT js.*, jt.title 
         FROM journal_submissions js 
         JOIN journal_topics jt ON js.topic_id = jt.id 
         WHERE js.student_id = ?`,
        [studentId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  });
  
  
  
app.listen(5000, () => console.log("Server running on port 5000"));
