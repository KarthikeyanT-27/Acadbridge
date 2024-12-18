// In routes/student.js
const express = require('express');
const User = require('../models/User');
const { checkRole } = require('../middleware/auth');
const router = express.Router();


// Fetch student details
router.get('/profileinfo', checkRole(['student']), async (req, res) => {
  try {
    console.log(`fetching detail for userid :${req.user.id}`);
    const student = await User.findById(req.user.id).select('-password'); // Exclude the password field
    if(!student){
      return res.status(404).send("user not found");
    }
    res.json(student);
  } catch (error) {
    res.status(500).send('Error fetching student details');
  }
});

module.exports = router;
