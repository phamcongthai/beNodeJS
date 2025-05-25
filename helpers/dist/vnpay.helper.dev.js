"use strict";

var _require = require('vnpay'),
    VNPay = _require.VNPay,
    ignoreLogger = _require.ignoreLogger;

var _require2 = require('vnpay'),
    Bank = _require2.Bank;

var _require3 = require('vnpay'),
    ProductCode = _require3.ProductCode,
    VnpLocale = _require3.VnpLocale,
    dateFormat = _require3.dateFormat; // Khởi tạo VNPay


var vnpay = new VNPay({
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
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list'
  }
}); // Hàm tạo URL thanh toán

function createPayment(vnp_Amount, vnp_TxnRef, vnp_IpAddr) {
  var bankList, tomorrow, paymentUrl;
  return regeneratorRuntime.async(function createPayment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(vnpay.getBankList());

        case 2:
          bankList = _context.sent;
          tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: vnp_Amount,
            vnp_IpAddr: vnp_IpAddr,
            vnp_TxnRef: vnp_TxnRef,
            vnp_OrderInfo: "Thanh toan don hang ".concat(vnp_TxnRef),
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL + "/".concat(vnp_TxnRef),
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow)
          });
          return _context.abrupt("return", paymentUrl);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
} // Export theo kiểu CommonJS


module.exports = createPayment;