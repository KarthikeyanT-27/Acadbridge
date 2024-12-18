const express = require('express');
const Attendance = require('../models/Attendance');
const { checkRole } = require('../middleware/auth');
const router = express.Router();
const User=require('../models/User');

let attendanceOpenedAt = null; // Variable to track when attendance was opened

// Admin opens attendance
router.post('/open', checkRole(['admin']), (req, res) => {
  attendanceOpenedAt = new Date(); // Set the time when attendance is opened
  res.json({ message: 'Attendance opened for 3 minutes', openedAt: attendanceOpenedAt });
});

// Student marks attendance
router.post('/mark', checkRole(['student']), async (req, res) => {
  const studentId = req.user.id;

  // Check if attendance is opened and within 2 minutes
  const now = new Date();
  const timeElapsed = (now - attendanceOpenedAt) / 1000 / 60; // Convert to minutes

  if (!attendanceOpenedAt || timeElapsed > 3) {
    return res.status(400).json({ message: 'Attendance window has closed' });
  }

  try {
    const student=await User.findById(studentId);
    const existingRecord = await Attendance.findOne({ studentId, date: new Date().setHours(0, 0, 0, 0) });
    if (existingRecord) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = new Attendance({
       studentId,
       name:student.name,
       batch:student.batch,
       });
    await attendance.save();
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
});
// Get student's attendance 
router.get('/student', checkRole(['student']), async (req, res) => {
 const studentId = req.user.id;
  try { 
    const attendanceRecords = await Attendance.find({ studentId }); 
    res.json(attendanceRecords);
 } catch (error) { 
    res.status(500).json({ message: 'Error fetching attendance records', error });
 }
});

// Get all students' attendance (for staff) 
router.get('/all', checkRole(['anchor']), async (req, res) => {
  
  try { 
        const attendanceRecords = await Attendance.find().populate('studentId');
         res.json(attendanceRecords); 
    } catch (error) {
     res.status(500).json({ message: 'Error fetching attendance records', error });
     } 
});

router.get('/open-time',checkRole(['student']),(req,res)=>{
    res.json({ openedAt:attendanceOpenedAt});
});

module.exports = router;
