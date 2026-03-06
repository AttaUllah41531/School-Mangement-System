const db = require('../config/db');
const {
    v4: uuidv4
} = require('uuid');
const {
    generateJazzCashHash
} = require('../utils/paymentUtils');
require('dotenv').config();

/**
 * GET PAYMENT BY FEE ID
 */
exports.getPaymentByFeeId = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM payments WHERE fee_id = ? ORDER BY created_at DESC LIMIT 1',
            [req.params.feeId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'No payment record found for this fee invoice.'
            });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching payment record.',
            error: error.message
        });
    }
};

/**
 * JAZZCASH - Initiate Payment
 */
exports.initiateJazzCash = async (req, res) => {
    try {
        const {
            fee_id,
            amount
        } = req.body;
        const txnRef = `JC-${uuidv4().substring(0, 8).toUpperCase()}`;
        const amountPaisa = Math.round(parseFloat(amount) * 100);

        const payload = {
            'pp_Version': '1.1',
            'pp_TxnType': 'MWALLET',
            'pp_Language': 'EN',
            'pp_MerchantID': process.env.JAZZ_MERCHANT_ID,
            'pp_Password': process.env.JAZZ_PASSWORD,
            'pp_TxnRefNo': txnRef,
            'pp_Amount': amountPaisa.toString(),
            'pp_ReturnURL': process.env.JAZZ_RETURN_URL,
            'pp_TxnDateTime': new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
            'pp_BillReference': `FEE-${fee_id}`,
            'pp_Description': `School Fee Payment for Invoice ${fee_id}`
        };

        const secureHash = generateJazzCashHash(process.env.JAZZ_INTEGRITY_SALT, payload);
        payload['pp_SecureHash'] = secureHash;

        // Save transaction to DB as pending
        await db.execute(
            'INSERT INTO payments (id, fee_id, method, transaction_ref, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), fee_id, 'jazzcash', txnRef, amount, 'pending']
        );

        res.status(200).json({
            paymentUrl: process.env.JAZZ_PAYMENT_URL,
            formData: payload
        });
    } catch (error) {
        console.error('JazzCash initiation failed:', error);
        res.status(500).json({
            message: 'Error initiating JazzCash payment.',
            error: error.message
        });
    }
};

/**
 * EASYPAISA - Initiate Payment
 */
exports.initiateEasyPaisa = async (req, res) => {
    try {
        const {
            fee_id,
            amount
        } = req.body;
        const orderRefNum = `EP-${uuidv4().substring(0, 8).toUpperCase()}`;

        // Basic payload. EasyPaisa often requires a redirect with these params.
        const payload = {
            storeId: process.env.EASY_STORE_ID,
            amount: amount.toString(),
            postBackURL: process.env.EASY_CALLBACK_URL,
            orderRefNum: orderRefNum,
            expiryDate: new Date(Date.now() + 30 * 60000).toISOString().replace(/[-:T]/g, '').slice(0, 14)
        };

        // If EasyPaisa requires hash/signature for your account type, calculate it here.
        // For simplicity, we assume standard Checkout.

        await db.execute(
            'INSERT INTO payments (id, fee_id, method, transaction_ref, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), fee_id, 'easypaisa', orderRefNum, amount, 'pending']
        );

        res.status(200).json({
            paymentUrl: process.env.EASY_PAYMENT_URL,
            formData: payload
        });
    } catch (error) {
        console.error('EasyPaisa initiation failed:', error);
        res.status(500).json({
            message: 'Error initiating EasyPaisa payment.',
            error: error.message
        });
    }
};

/**
 * ONLINE (Easypaisa/JazzCash) - Submit Screenshot/Verification
 */
exports.submitOnlinePayment = async (req, res) => {
    try {
        const {
            fee_id,
            amount,
            transaction_ref
        } = req.body;
        const method = req.path.includes('easypaisa') ? 'easypaisa' : 'jazzcash';
        const screenshot_url = req.file ? `/uploads/screenshots/${req.file.filename}` : null;

        await db.execute(
            'INSERT INTO payments (id, fee_id, method, transaction_ref, amount, screenshot_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), fee_id, method, transaction_ref, amount, screenshot_url, 'pending']
        );

        // Update fee record with payment method (marks it as "awaiting verification")
        await db.execute('UPDATE fees SET payment_method = ? WHERE id = ?', [method, fee_id]);

        res.status(200).json({
            message: `${method.charAt(0).toUpperCase() + method.slice(1)} payment submitted for verification.`
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error submitting payment.',
            error: error.message
        });
    }
};

/**
 * BANK TRANSFER - Submit Reference
 */
exports.submitBankPayment = async (req, res) => {
    try {
        const {
            fee_id,
            amount,
            transaction_ref
        } = req.body;

        const screenshot_url = req.file ? `/uploads/screenshots/${req.file.filename}` : null;

        await db.execute(
            'INSERT INTO payments (id, fee_id, method, transaction_ref, amount, screenshot_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), fee_id, 'bank', transaction_ref, amount, screenshot_url, 'pending']
        );

        // Update fee record with payment method
        await db.execute('UPDATE fees SET payment_method = "bank" WHERE id = ?', [fee_id]);

        res.status(200).json({
            message: 'Bank payment submitted for approval.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error submitting bank payment.',
            error: error.message
        });
    }
};

/**
 * CASH - Direct Mark as Paid
 */
exports.submitCashPayment = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const {
            fee_id,
            amount,
            received_by
        } = req.body;
        const txnRef = `CASH-${uuidv4().substring(0, 8).toUpperCase()}`;

        // 1. Log payment
        await connection.execute(
            'INSERT INTO payments (id, fee_id, method, transaction_ref, amount, received_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), fee_id, 'cash', txnRef, amount, received_by, 'success']
        );

        // 2. Update fee status
        await connection.execute(
            'UPDATE fees SET status = "paid", paid_date = CURDATE(), transaction_id = ?, payment_method = "cash" WHERE id = ?',
            [txnRef, fee_id]
        );

        await connection.commit();
        res.status(200).json({
            message: 'Cash payment recorded and invoice updated to Paid.',
            transactionRef: txnRef
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            message: 'Error recording cash payment.',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

/**
 * CALLBACK - Gateway Webhooks
 */
exports.handleCallback = async (req, res) => {
    try {
        const responseData = req.body;
        console.log('Payment Callback Received:', responseData);

        // Logic check for JazzCash
        let txnStatus = 'failed';
        let txnRef = '';
        let feeId = '';

        if (responseData.pp_ResponseCode === '000') {
            txnStatus = 'success';
            txnRef = responseData.pp_TxnRefNo;
            feeId = responseData.pp_BillReference.replace('FEE-', '');
        } else {
            txnRef = responseData.pp_TxnRefNo || 'UNKNOWN';
        }

        // 1. Find the original payment record to get the fee_id and method
        const [payments] = await db.execute('SELECT * FROM payments WHERE transaction_ref = ?', [txnRef]);

        if (payments.length === 0) {
            console.error('Payment record not found for ref:', txnRef);
            return res.status(404).send('Transaction reference not found');
        }

        const payment = payments[0];
        feeId = payment.fee_id;

        // 2. Update Payment record
        await db.execute(
            'UPDATE payments SET status = ?, gateway_response = ? WHERE transaction_ref = ?',
            [txnStatus, JSON.stringify(responseData), txnRef]
        );

        // 3. If success, update Fee record
        if (txnStatus === 'success') {
            await db.execute(
                'UPDATE fees SET status = "paid", paid_date = CURDATE(), transaction_id = ?, payment_method = ? WHERE id = ?',
                [txnRef, payment.method, feeId]
            );
        }

        // Gateway response (redirect or OK)
        res.send('<html><body><h3>Processing payment status...</h3><script>window.location.href="/payment-status"</script></body></html>');
    } catch (error) {
        console.error('Callback handling failed:', error);
        res.status(500).send('Verification Error');
    }
};

/**
 * VERIFY/APPROVE PAYMENT (By Admin)
 */
exports.verifyPayment = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const [payments] = await db.execute('SELECT * FROM payments WHERE id = ?', [id]);
        if (payments.length === 0) return res.status(404).json({
            message: 'Payment not found'
        });

        const payment = payments[0];

        await db.execute('UPDATE payments SET status = "success" WHERE id = ?', [id]);

        await db.execute(
            'UPDATE fees SET status = "paid", paid_date = CURDATE(), transaction_id = ?, payment_method = ? WHERE id = ?',
            [payment.transaction_ref, payment.method, payment.fee_id]
        );

        res.json({
            message: 'Payment verified and fee marked as paid!'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Verification failed',
            error: error.message
        });
    }
};