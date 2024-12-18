const express = require('express');
const xlsx = require('xlsx');
const multer = require('multer');
const Marks = require('../models/Marks');
const { checkRole } = require('../middleware/auth');
const router = express.Router();
const  User=require('../models/User');

const upload = multer({ dest: 'uploads/' });

// Upload Excel file and parse marks
router.post('/upload', checkRole(['anchor']), upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Save parsed data to the database
    for (let record of data) {
      const { name, batch, registernumber, subject, marks, date, department } = record;
      console.log(data);
      const markData = {
        name,
        department,
        registernumber,
        subject,
        batch,
        marks: parseFloat(marks),
        date: new Date(date),
      };
      const mark = new Marks(markData);
      await mark.save();
    }

    res.status(200).json({ message: 'Marks uploaded successfully' });
  } catch (error) {
    console.error('Error uploading marks:', error);
    res.status(500).json({ message: 'Error uploading marks', error });
  }
});

// Get marks for a student
router.get('/student/:name', checkRole(['student']), async (req, res) => {
  try {
    const { name } = req.params;
    const marks = await Marks.find({
      name,
    });
    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Error fetching marks', error });
  }
});

// Save test result for a student
router.post('/save', checkRole(['student']), async (req, res) => {
  try {
    const { testName, score, total, studentId } = req.body;
    const student = await User.findById(studentId); // Assuming you have a Student model

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const markData = {
      name: student.name,
      department: student.department,
      registernumber: student.registernumber,
      subject: testName,
      batch: student.batch,
      marks: (score / total) * 100,
      date: new Date(),
    };

    const mark = new Marks(markData);
    await mark.save();

    res.status(200).json({ message: 'Test result saved successfully' });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ message: 'Error saving test result', error });
  }
});

module.exports = router;
