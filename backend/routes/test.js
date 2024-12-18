const express = require('express');
const Test = require('../models/Test');
const Question = require('../models/Test');
const { checkRole } = require('../middleware/auth');
const router = express.Router();

// Create a test
router.post('/create', checkRole(['admin']), async (req, res) => {
  const { testName,questions} = req.body;
  try {
    const test = new Test({ testName,questions, createdBy: req.user.id });
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error });
  }
});

// Add a question to a test
router.post('/question', checkRole(['admin']), async (req, res) => {
  const { text, choices, correctAnswer, testId } = req.body;
  try {
    const question = new Question({ text, choices, correctAnswer, test: testId });
    await question.save();
    const test = await Test.findById(testId);
    test.questions.push(question);
    await test.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error adding question', error });
  }
});

// Fetch all tests for a student
router.get('/student', checkRole(['student']), async (req, res) => {
  try {
    const tests = await Test.find().populate('questions');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error });
  }
});

module.exports = router;
