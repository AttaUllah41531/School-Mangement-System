const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const upload = require('../middleware/upload');

// All endpoints require authentication
router.post('/jazzcash/submit', upload, paymentController.submitOnlinePayment);
router.post('/easypaisa/submit', upload, paymentController.submitOnlinePayment);
router.post('/bank-transfer/submit', upload, paymentController.submitBankPayment);
router.post('/cash/submit', paymentController.submitCashPayment);
router.get('/fee/:feeId', paymentController.getPaymentByFeeId);
router.post('/verify/:id', paymentController.verifyPayment);

// Gateway Webhooks
router.post('/callback', paymentController.handleCallback);

module.exports = router;