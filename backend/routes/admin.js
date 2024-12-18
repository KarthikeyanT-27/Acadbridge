const express = require('express');
const User = require('../models/User');
const Marks = require('../models/Marks');
const { checkRole } = require('../middleware/auth');
const router = express.Router();

const Attendance = require('../models/Attendance');




router.get('/students', checkRole(['admin']), async (req, res) => {
  try {
    // Fetch all students
    const students = await User.find({ role: 'student' });

    // Fetch all marks
    const marks = await Marks.find();

    // Fetch all attendance
    const attendance = await Attendance.find();

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

    // Group by department
    const groupedByDepartment = studentDetails.reduce((acc, student) => {
      if (!acc[student.batch]) acc[student.batch] = [];
      acc[student.batch].push(student);
      return acc;
    }, {});

    res.json(groupedByDepartment);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});





module.exports = router;
