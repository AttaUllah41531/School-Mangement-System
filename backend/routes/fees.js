const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const {
    protect,
    authorize
} = require('../middleware/auth');

router.get('/', protect, feeController.getAllFees);
router.get('/student/:studentId', protect, feeController.getFeesByStudent);
router.post('/', protect, authorize('admin', 'student'), feeController.createFee);
router.put('/:id', protect, authorize('admin'), feeController.payFee);
router.delete('/:id', protect, authorize('admin'), feeController.deleteFee);

module.exports = router;