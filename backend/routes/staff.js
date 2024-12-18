// In routes/staff.js
const express = require('express');
const User = require('../models/User');
const { checkRole } = require('../middleware/auth'); 
const router = express.Router();
const Marks=require('../models/Marks');
const Attendance=require('../models/Attendance');


router.get('/profile', checkRole(['anchor']), async (req, res) => {
  try {
    console.log(`Fetching details for user ID: ${req.user.id}`); 
    const anchor = await User.findById(req.user.id).select('-password');
    if (!anchor) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }
    console.log(`Staff details: ${anchor}`);
    res.json(anchor);
  } catch (error) {
    console.error('Error fetching staff details:', error); 
    res.status(500).send('Error fetching staff details');
  }
});






router.get('/students', checkRole(['anchor']), async (req, res) => {
  try {
    const batch = req.user.batch; // Assuming department is stored in user object

    // Fetch all students in the staff's department
    const students = await User.find({ role: 'student', batch });

    // Fetch all marks and attendance for these students
    const studentNames = students.map(student => student.name);
    const marks = await Marks.find({ name: { $in: studentNames } });
    const attendance = await Attendance.find({ name: { $in: studentNames } });

    // Combine student details with their marks and attendance
    const studentDetails = students.map(student => {
      const studentMarks = marks.filter(mark => 
        mark.name === student.name && 
        mark.batch === student.batch
      );
      const studentAttendance = attendance.filter(record => 
        record.name === student.name && 
        record.batch === student.batch
      );
      return {
        ...student._doc,
        marks: studentMarks,
        attendance: studentAttendance,
      };
    });

    res.json(studentDetails);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});




module.exports = router;

