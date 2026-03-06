const crypto = require('crypto');

/**
 * Generates JazzCash Secure Hash (HMAC-SHA256)
 */
exports.generateJazzCashHash = (salt, data) => {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(data).sort();

    // Construct the message string with Integrity Salt
    let message = salt;
    for (const key of sortedKeys) {
        if (data[key] !== '' && data[key] !== undefined && data[key] !== null) {
            message += '&' + data[key];
        }
    }

    // Create HMAC SHA256
    return crypto.createHmac('sha256', salt)
        .update(message)
        .digest('hex')
        .toUpperCase();
};

/**
 * Placeholder for EasyPaisa hash/Signature logic
 * Depending on account type (merchant/OTC), EasyPaisa implementation varies.
 */
exports.generateEasyPaisaPayload = (config, orderData) => {
    return {
        storeId: config.EASY_STORE_ID,
        amount: orderData.amount,
        orderRefNum: orderData.orderRefNum,
        postBackURL: config.EASY_CALLBACK_URL,
    };
};