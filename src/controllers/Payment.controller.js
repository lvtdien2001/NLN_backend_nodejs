let $ = require('jquery');
const moment = require('moment');

const sortObject = obj => {
    let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// @route POST /api/payment
// @desc create a payment for user
// @access protected (customer)
exports.create = async (req, res) => {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
    
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
    
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let vnpUrl = process.env.vnp_Url;
        const orderId = moment(date).format('DDHHmmss');
        const amount = req.body.amount;

        if (!amount) {
            return res.status(404).json({
                success: false,
                message: 'Amount not found'
            })
        }

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = process.env.vnp_TmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = process.env.vnp_ReturnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_BankCode'] = 'VNBANK';

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", process.env.vnp_HashSecret);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        res.json({
            success: true,
            url: vnpUrl
        })
        // res.redirect(vnpUrl)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route POST /api/payment/vnpay_ipn?<Params>
// @desc Check data has not been changed
// @access protected (customer)
exports.checksum = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.vnp_HashSecret;
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
     
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if(secureHash === signed){ //kiểm tra checksum
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if(rspCode=="00"){
                        
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                    else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        switch(rspCode){
                            case '07':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).'
                                    });
                            case '09':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.'
                                    });
                            case '10':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần'
                                    })
                            case '10':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần'
                                    })
                            case '11':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.'
                                    })
                            case '12':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.'
                                    })
                            case '13':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.'
                                    })
                            case '24':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Khách hàng hủy giao dịch'
                                    })
                            case '51':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.'
                                    })
                            case '65':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.'
                                    })
                            case '75':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Ngân hàng thanh toán đang bảo trì.'
                                    })
                            case '79':
                                return res
                                    .status(200)
                                    .json({
                                        RspCode: rspCode, 
                                        Message: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch'
                                    })
                            default:
                                return res.status(200).json({RspCode: rspCode, Message: 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng liên hệ 1900 55 55 77 để được hỗ trợ'})
                        }
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
}
