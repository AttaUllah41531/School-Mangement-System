const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Exams
router.get('/', examController.getAllExams);
router.post('/', examController.createExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

// Marks
router.get('/marks/exam/:examId', examController.getMarksByExam);
router.get('/marks/student/:studentId', examController.getStudentMarks);
router.post('/marks', examController.upsertMarks);

module.exports = router;