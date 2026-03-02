const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

// Classes
router.get('/classes', academicController.getAllClasses);
router.post('/classes', academicController.createClass);
router.put('/classes/:id', academicController.updateClass);
router.delete('/classes/:id', academicController.deleteClass);

// Sections
router.get('/sections', academicController.getAllSections);
router.post('/sections', academicController.createSection);
router.put('/sections/:id', academicController.updateSection);
router.delete('/sections/:id', academicController.deleteSection);

// Subjects
router.get('/subjects', academicController.getAllSubjects);
router.post('/subjects', academicController.createSubject);
router.put('/subjects/:id', academicController.updateSubject);
router.delete('/subjects/:id', academicController.deleteSubject);

module.exports = router;