const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const {
    protect,
    authorize
} = require('../middleware/auth');

router.get('/', protect, teacherController.getAllTeachers);
router.get('/:id', protect, teacherController.getTeacherById);
router.post('/', protect, authorize('admin'), teacherController.createTeacher);
router.put('/:id', protect, authorize('admin'), teacherController.updateTeacher);
router.delete('/:id', protect, authorize('admin'), teacherController.deleteTeacher);

module.exports = router;