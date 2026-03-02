const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
    protect,
    authorize
} = require('../middleware/auth');

router.get('/', protect, studentController.getAllStudents);
router.get('/:id', protect, studentController.getStudentById);
router.post('/', protect, authorize('admin'), studentController.createStudent);
router.put('/:id', protect, authorize('admin'), studentController.updateStudent);
router.delete('/:id', protect, authorize('admin'), studentController.deleteStudent);

module.exports = router;