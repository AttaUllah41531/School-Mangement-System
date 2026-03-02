const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendanceByClassAndDate);
router.post('/', attendanceController.markAttendance);

module.exports = router;