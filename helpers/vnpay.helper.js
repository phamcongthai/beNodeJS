const { VNPay, ignoreLogger } = require('vnpay');
const { Bank } = require('vnpay');
const { ProductCode, VnpLocale, dateFormat } = require('vnpay');

// Khởi tạo VNPay
const vnpay = new VNPay({
    tmnCode: process.env.vnp_TmnCode,
    secureSecret: process.env.vnp_HashSecret,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    enableLog: true,
    loggerFn: ignoreLogger,
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});

// Hàm tạo URL thanh toán
async function createPayment(vnp_Amount, vnp_TxnRef, vnp_IpAddr) {
    const bankList = await vnpay.getBankList();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: vnp_Amount,
        vnp_IpAddr: vnp_IpAddr,
        vnp_TxnRef: vnp_TxnRef,
        vnp_OrderInfo: `Thanh toan don hang ${vnp_TxnRef}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL+`/${vnp_TxnRef}`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
    });

    return paymentUrl;
}

// Export theo kiểu CommonJS
module.exports = createPayment;
