/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.constant;

import okhttp3.MediaType;

/**
 *
 * @author lenovo
 */
public class Constant {
    
    public static final MediaType TEXT = MediaType.parse("text/plain; charset=utf-8");
    
    public static final Integer SHELVES_TASK_NUMBER = 101; 
    public static final String PAYMENT_URL = "api/client/matchv2";
    public static final Integer DAY_SECOND = 86400;
    public static final Integer DAY_SECOND_TOW_HOUR = 7200;
    public static final Integer DAY_SECOND_FIVE_MIN = 300;
    
    //支付方式开关
    public static final Integer WECHAT_ACCEPT_OK_0 = 0;
    public static final Integer WECHAT_ACCEPT_NO_1 = 1; 
    public static final Integer ALIPAY_ACCEPT_OK_0 = 0;
    public static final Integer ALIPAY_ACCEPT_NO_1 = 1;
    public static final Integer BAIDU_ACCEPT_OK_0 = 0;
    public static final Integer BAIDU_ACCEPT_NO_1 = 1;
    public static final String ALIPAY_VERSION_1 = "1.0";
    public static final String ALIPAY_VERSION_2 = "2.0";
    public static final Integer BESTPAY_ACCEPT_OK_0 = 0;
    public static final Integer BESTPAY_ACCEPT_NO_1 = 1; 
    public static final Integer JDPAY_ACCEPT_OK_0 = 0;
    public static final Integer JDPAY_ACCEPT_NO_1 = 1; 
    
    //付款状态
    public static final Integer TRADE_PAY_STATUS_DEFAULT_0 = 0;
    public static final Integer TRADE_PAY_STATUS_SUCCESS_1 = 1;
    public static final Integer TRADE_PAY_STATUS_FAIL_2 = 2;
    
    public static final String TRADE_PAY_STATUS_BESTPAY_SUCCESS = "00000000";
    
    //退款状态
    public static final Integer TRADE_REFUND_STATUS_DEFAULT = 0;
    public static final Integer TRADE_REFUND_STATUS_ING = 1;
    public static final Integer TRADE_REFUND_STATUS_SUCCESS = 2;
    public static final Integer TRADE_REFUND_STATUS_FAIL = 3;
    
    public static final Integer [] TRADE_REFUND_PAY_SETTLE_ARRAY = new Integer[]{1,2};
    
    //出货状态
    public static final Integer DELIVER_STATUS_SUCCESS_0 = 0;
    public static final Integer DELIVER_STATUS_FAILED_2 = 2;
    public static final Integer DELIVER_STATUS_FAILED_3 = 3;
    public static final Integer DELIVER_STATUS_DEFAULT = -1;
    public static final Integer DELIVER_STATUS_FAILED_4 = 4;
    public static final Integer DELIVER_STATUS_FAILED_5 = 5;
    
    public static final Integer DELIVER_STYLE_AUTO_1 = 1;
    public static final Integer DELIVER_STYLE_CODE_2 = 2;
    
    //支付方式
    public static final String TRADE_ONLINE_PAY_STYLE_BAIDU = "1";
    public static final String TRADE_ONLINE_PAY_STYLE_WECHAT = "2";
    public static final String TRADE_ONLINE_PAY_STYLE_ALIPAY = "3";
    public static final String TRADE_LOCAL_PAY_STYLE_CASH = "4";
    public static final String TRADE_LOCAL_PAY_STYLE_CREDIT_CARD = "5";
    public static final String TRADE_LOCAL_PAY_STYLE_CARD = "6";
    public static final String TRADE_LOCAL_PAY_STYLE_CODE = "7";
    public static final String TRADE_LOCAL_PAY_STYLE_GAME = "8";
    public static final String TRADE_ONLINE_PAY_STYLE_SOUNDWAVE = "9";
    public static final String TRADE_LOCAL_PAY_STYLE_POST = "10";
    public static final String TRADE_LOCAL_PAY_STYLE_ONE_CARD = "11";
    public static final String TRADE_ONLINE_PAY_STYLE_ABCPAY = "12";
    public static final String TRADE_ONLINE_PAY_STYLE_WECHAT_BARCODE = "13";
    public static final String TRADE_ONLINE_PAY_STYLE_VIPPAY = "14";
    public static final String TRADE_ONLINE_PAY_STYLE_BESTPAY = "15";
    public static final String TRADE_ONLINE_PAY_STYLE_JDPAY = "16";
    public static final String TRADE_ONLINE_PAY_STYLE_APPLEPAY = "17";
    public static final String TRADE_ONLINE_PAY_STYLE_PAYPAL = "18";
    public static final String TRADE_ONLINE_PAY_STYLE_ALIPAY_BARCODE = "19";
    public static final String TRADE_ONLINE_PAY_STYLE_INTEGRAL = "20";
    public static final String TRADE_ONLINE_PAY_STYLE_UNIONPAY = "21";
    public static final String TRADE_ONLINE_PAY_STYLE_CCBIS = "22";
    public static final String TRADE_ONLINE_PAY_STYLE_QRCODEPAY = "23";
    public static final String TRADE_ONLINE_PAY_STYLE_ICBCPAY = "24";
    public static final String TRADE_ONLINE_PAY_STYLE_ONEPURSEPAY = "25";//壹钱包
    public static final String TRADE_ONLINE_PAY_STYLE_UNIONPAY_REVERSESCAN = "26";//银联反扫
    
    public static final String WECHAT_PAY_STYLE_SCAN = "1";
    public static final String WECHAT_PAY_STYLE_H5 = "2";
    public static final String WECHAT_PAY_STYLE_THIRD = "3";
    
    public static final String [] TRADE_ONLINE_PAY_SETTLE_ARRAY = new String[]{"2","3"};
    
    public static final String [] TRADE_OTHER_PAY_STYLE_ARRAY = new String[]{"6","7"};
    public static final String [] TRADE_ONLINE_PAY_STYLE_ARRAY = new String[]{"1","2","3","9","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26"};
    public static final String [] TRADE_LOCAL_PAY_STYLE_ARRAY = new String[]{"4","5","6","7","8","10","11"};
    
    //优惠方式
    public static final Integer SPECIAL_OFFER_FOCUS = 1;
    public static final Integer SPECIAL_OFFER_BUY_ONE = 2;
    public static final Integer SPECIAL_OFFER_DISCOUNT = 3;
    public static final Integer SPECIAL_OFFER_PERFERENCE = 4;
    
    //外部接口配置
    public static final Integer OUT_INTERFACE_ACCEPT_1 = 1;
    public static final Integer OUT_INTERFACE_ACCEPT_0 = 0;
    
    //对账流水号配置
    public static final Integer REPLENISHMENT_SERIAL_CONFIG_1 = 1;
    public static final Integer REPLENISHMENT_SERIAL_CONFIG_0 = 0;
    
    //饮料机结账数据
    public static final Integer REPLENISH_DRINK_SETTLE_1 = 1;
    public static final Integer REPLENISH_DRINK_SETTLE_2 = 2;
    
    //支付相关参数
    public static final String SIGN_INPUT_CHARSET_UTF_8 = "UTF-8";
    public static final String SIGN_INPUT_CHARSET_GBK = "GBK";
    public static final String DATA_CHARSET_GBK = "GBK";
    public static final String DATA_CHARSET_UTF8 = "UTF-8";
    public static final String DATA_TYPE_JSON = "json";
    public static final String SIGN_TYPE = "MD5";
    public static final String SIGN_TYPE_RSA = "RSA";
    public static final String ALIPAY_PRECREATE_URL = "https://mapi.alipay.com/gateway.do?_input_charset=UTF-8";
    public static final String ALIPAY_GATWAY_URL_V2 = "https://openapi.alipay.com/gateway.do";
    public static final String ALIPAY_CANEL_TRADE_SERVICE_NAME = "alipay.acquire.cancel";
    public static final String ALIPAY_QUERY_TRADE_SERVICE_NAME = "alipay.acquire.query";
    public static final String ALIPAY_PRECREATE_URL_V1 = "https://mapi.alipay.com/gateway.do";
    
    public static final String ALIPAY_TRADE_PAY_STATUS_SUCCESS = "TRADE_SUCCESS";
    public static final String ALIPAY_TRADE_PAY_STATUS_WAIT = "WAIT_BUYER_PAY";
    public static final String ALIPAY_TRADE_PAY_STATUS_FINISHED = "TRADE_FINISHED";
    public static final String ALIPAY_TRADE_PAY_STATUS_CLOSED = "TRADE_CLOSED";
    public static final String ALIPAY_GRANT_TYPE = "authorization_code";
    public static final String ALIPAY_PRECREATE_SERVICE_NAME = "alipay.acquire.precreate";
    public static final String ALIPAY_CREATEANDPAY_SERVICE_NAME = "alipay.acquire.createandpay";
    public static final String ALIPAY_CREATEANDPAY_REFUND_SERVICE_NAME = "alipay.acquire.refund";
    public static final String ALIPAY_PRECREATE_PAYBACK_SERVICE = "/api/alipay/precreate/back/";
    public static final String ALIPAY_PRECREATE_V2_PAYBACK_SERVICE = "/api/alipay/back/";
    public static final String ALIPAY_CREATEANDPAY_PAYBACK_SERVICE = "/api/alipay/createandpay/back/";
    public static final String ALIPAY_CREATEANDPAY_PAYBACK_TCP_SERVICE = "/api/alipay/createandpay/tcpback/";
    public static final String ALIPAY_CREATEANDPAY_PRODUCT_CODE_SOUNDWAVE = "SOUNDWAVE_PAY_OFFLINE";
    public static final String ALIPAY_CREATEANDPAY_PRODUCT_CODE_BARCODE = "BARCODE_PAY_OFFLINE";
    public static final String ALIPAY_CREATEANDPAY_PRODUCT_CODE_FINGERPRINT = "FINGERPRINT_FAST_PAY";
    public static final String ALIPAY_CREATEANDPAY_DYNAMIC_ID_TYPE_WAVE_CODE = "wave_code";
    public static final String ALIPAY_CREATEANDPAY_DYNAMIC_ID_TYPE_BAR_CODE = "bar_code";
    
    public static final String TCP_ALIPAY_PRECREATE_PAYBACK_SERVICE = "/api/alipay/tcpPayback/";
    public static final String TCP_ALIPAY_PRECREATE_V2_PAYBACK_SERVICE = "/api/alipay/tcpPaybackV2/";
    
    public static final String WECHAT_MICROPAY_URL = "https://api.mch.weixin.qq.com/pay/micropay";
    public static final String WECHAT_PRE_PAY_URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    public static final String WECHAT_ORDER_QUERY_URL = "https://api.mch.weixin.qq.com/pay/orderquery";
    public static final String WECHAT_ORDER_REVERSE_URL = "https://api.mch.weixin.qq.com/secapi/pay/reverse";
    public static final String WECHAT_ORDER_REFUND_URL = "https://api.mch.weixin.qq.com/secapi/pay/refund"; 
    public static final String WECHAT_REFUND_CHECK_URL = "https://api.mch.weixin.qq.com/pay/refundquery";
    public static final String WECHAT_CANEL_PAY_URL = "https://api.mch.weixin.qq.com/pay/closeorder";
    public static final String WECHAT_PAY_NOTIFY_URL = "/api/pay/payBack";
    public static final String ALIPAY_CREATEANDPAY_PAY_SUCCESS = "ORDER_SUCCESS_PAY_SUCCESS";
    
    public static final String WECHAT_PAY_THIRD_NOTIFY_URL = "/api/pay/paybackv3";

    
    public static final String BEST_PRE_PAY_URL = "https://barcodefront.bestpay.com.cn/barcode/newCreate";//"https://barcodefront.bestpay.com.cn/barcode/newCreate";//"https://b.bestpay.com.cn:8929/BarcodeFront/barcode/newCreate";//"http://183.62.49.171:7080/BarcodeFront/barcode/newCreate";
    public static final String BEST_ORDER_QUERY = "https://barcodefront.bestpay.com.cn/barcode/";//"http://183.62.49.171:7080/BarcodeFront/barcode/";
    
    public static final String BEST_KEY = "BarcodeFront@bestpay.com.cn";
    public final static String BAIFUBAO_PAY_URL_CODE = "https://www.baifubao.com/o2o/0/code/0/create/0";
    public final static String BAIFUBAO_PAY_CALL_BACK = "/api/baifubao/payBack";
    public final static String BAIFUBAO_PAY_URL = "https://www.baifubao.com/api/0/pay/0/wapdirect/0";
    public final static String BAIFUBAO_PAY_REFUND_CALL_BACK="/api/baifubao/refundCallBack";
    public final static String BAIFUBAO_PAY_REFUND = "https://www.baifubao.com/api/0/refund";
    public final static String BAIFUBAO_REFUND_RESULT_BY_ORDER_URl = "https://www.baifubao.com/api/0/refund/0/query";
    public final static String BAIFUBAO_PAY_VIEW_URL= "/baifubao/index.html";
    //会员支付
    public static final String VIP_PAY_HOST =  "yilian.yonyouup.com";    //"yla.yonyouup.com";
    public static final String VIP_WECHAT_NO =  "gh_32d7ab718969";   //"gh_824be94f968c";
    public static final String BESTPAY_SERVICE_TYPE = "BUSINESS_CHECKOUT";
    public static final String BESTPAY_CHANNEL_NO = "04";
    public static final String VIP_REFUND_TYPE_PLAFORM_1 = "1";
    public static final String VIP_REFUND_TYPE_AUTO_2 = "2";
    
    //QRCODE支付
    public static final String QRCODE_PAY_CODE_URL = "http://222.173.105.43:10030/aioweb/lelian/bill";
    public static final String QRCODE_REFUND_URL="http://222.173.105.43:10030/aioweb/lelian/bill/close";
    
    public static final String INTEGRABANK_PAY_CODE_URL = "http://3g3e.com/api/terminal/qrcode/getSweepImg";
    
    //积分兑换信息
//    public static final String INTEGRAL_HOST_URL = "http://124.74.102.114:8080/lemei";
    public static final String INTEGRAL_HOST_URL = "http://greenfortune.sh.cn/lemei";
    public static final String INTEGRAL_REQUEST_PRODUCTLIST = "/productList";
    public static final String INIEGRAL_REQEUST_ACCOUNTCHECK = "/accountCheck";
    public static final String INIEGRAL_REQEUST_ORDERCHECK = "/orderCheck";
    public static final String INIEGRAL_REQUEST_ENABLEEXCHANGELIST = "/enableExchangeList";
    public static final String INIEGRAL_REQUEST_POINTSCONSUME = "/pointsConsume";
    public static final String INIEGRAL_REQUEST_ORDERCHECK = "/orderCheck";
    public static final String INIEGRAL_MERCHANTCODE = "M1464945120141";
    public static final String INIEGRAL_RESULT_STATUS_SUCCESS = "1";
    
    
    public static final Integer OUTINTERFACE_ACCEPT_1 = 1;
    public static final Integer OUTINTERFACE_ACCEPT_0 = 0;
    
    //取货码状态
    public static final Integer TRADE_CODE_STATUS_1 = 1;
    public static final Integer TRADE_CODE_STATUS_0 = 0;
    public static final Integer TRADE_CODE_STATUS_2 = 2;
    public static final Integer TRADE_CODE_TYPE_6 = 6;
    public static final Integer TRADE_CODE_TYPE_7 = 7;
    public static final Integer TRADE_CODE_TYPE_8 = 8;
    public static final Integer TRADE_CODE_TYPE_10 = 10;
    public static final String TRADE_OTHER_CODE_CHECK_BY_10_URL = "http://data.zidongbox.com/data/pickupCode/query.do";
    public static final String TRADE_OTHER_CODE_CANCEL_10_URL = "http://data.zidongbox.com/data/pickupCode/use.do";
    public static final String TRADE_OTHER_CODE_STATUS_DEFAULT = "1";
    public static final String TRADE_OTHER_CODE_STATUS_USED = "2";
    public static final String TRADE_OTHER_CODE_STATUS_TIMEOUT = "3";
    
    public static final String COMMON_CODE_RESULT_SUCCESS = "SUCCESS";
    public static final String COMMON_CODE_RESULT_FAIL = "FAIL";
    //任务通知类型
    public static final String TASK_RESPONSE_TYPE_SET_CONFIG = "set config";
    public static final Integer TASK_RESPONSE_TYPE_NUMBER_SET_SHELVES_CONFIG = 101;
    public static final String TASK_RESPONSE_TYPE_SYNC = "sync";
    public static final Integer TASK_RESPONSE_TYPE_NUMBER_DEVICE_UPGRADE = 201;
    public static final Integer TASK_RESPONSE_TYPE_NUMBER_DEVICE_SYNC_AD = 202;
    
    //支付方式
    public static final String PAY_STYLE_NAME_WECHAT = "WECHAT";
    public static final String PAY_STYLE_NAME_ALIPAY = "ALIPAY";
    public static final String PAY_STYLE_NAME_BAIDU = "BAIDU";
    public static final String PAY_STYLE_NAME_BESTPAY = "BESTPAY";//翼支付
    public static final String PAY_STYLE_NAME_JDPAY = "JDPAY";//京东支付
    public static final String PAY_STYLE_NAME_UNIONPAY = "UNIONPAY";
    public static final String PAY_STYLE_NAME_UNIONPAY_REVERSE = "UNIONREVERSEPAY";//银联反扫
    public static final String PAY_STYLE_NAME_QRCODEPAY = "QRCODEPAY";
    public static final String PAY_STYLE_NAME_ICBCPAY = "ICBCPAY";
    public static final String PAY_STYLE_NAME_CCBPAY = "DRAGONPAY";
    public static final String PAY_STYLE_NAME_ONEPURSEPAY = "ONEPURSEPAY";//壹钱包
    
    //设备在线状态
    public static final Integer DEVICE_ONLINE_STATUS_LOGIN = 0;
    public static final Integer DEVICE_ONLINE_STATUS_LOGOUT = 1; 
    
    //设备操作类型
    public static final int DEVICE_STATUS_ACTION_LOGIN = 1;
    public static final int DEVICE_STATUS_ACTION_HEARTBEAT = 2;
    public static final int DEVICE_STATUS_ACTION_LOGOUT = 3;
    public static final int DEVICE_STATUS_ACTION_LOGOUT_INBOX = 100;
    public static final int DEVICE_STATUS_ACTION_LOGOUT_UPGRADE = 101;
    public static final int DEVICE_STATUS_ACTION_LOGOUT_SYNC_CONFIG = 102;
    public static final int DEVICE_STATUS_ACTION_LOGOUT_WEIHU = 103;
    public static final int DEVICE_STATUS_ACTION_LOGOUT_TIMEOUT = 201;
    public static final int DEVICE_STATUS_ACTION_LOGOUT_ERROR_DEVICE = 202;
    
    public static final int DEVICE_TYPE_1 = 1;
    
    public static final int DEVICE_SHELVES_RECORD_STATUS_FILL = 1;
    public static final int DEVICE_SHELVES_RECORD_STATUS_NOT_FILL = 2;
    
    //设备心跳间隔
    public static final long DEVICE_HEARTBEATTIME_55 = 55;
    
    //微信的支付类型
    public static final String WECHAT_TRADE_TYPE_JSAPI = "JSAPI";
    public static final String WECHAT_TRADE_TYPE_NATIVE = "NATIVE";
    public static final String WECHAT_TRADE_TYPE_APP = "APP";
    public static final String WECHAT_TRADE_TYPE_WAP = "WAP";
    public static final String WECHAT_NATIVE_PAYBACK_URL = "/api/pay/native/payBack";
    public static final String WECHAT_NATIVE_PAYBACK_URL_V2 = "/api/pay/native/payBackv2";
    public static final String TCP_WECHAT_NATIVE_PAYBACK_URL = "/api/pay/native/tcpPayBack";
    
    //百度支付地址
    public static final String BAIDU_NATIVE_PAYBACK_URL = "/api/baifubao/native/payBack";
    
    //银联扫码支付
    public static final String UNIONPAY_PAYBACK_URL = "/api/pay/unionpay/payBack";
    public static final String UNIONPAY_REFUNDBACK_URL = "/api/pay/unionpay/refundback";
    
    //京东
    public static final String JDPAY_NATIVE_PAYBACK_URL = "/api/jdpay/native/payBack";
    public static final String JD_KEY = "SMF360080003233950018";
    public static final String JD_PRE_PAY_URL = "https://payscc.jdpay.com/req/code";
    public static final String JD_REFUND_URL = "https://payscc.jdpay.com/order/refund";
    public static final String JD_PRE_CODE_URL = "https://pcplatform.jdpay.com/api/pay";
    

    //京东退款回调
    public static final String JDPAY_REFUNDBACK_URL = "/api/jdpay/refund/back";
    
    //支付回调配置
    public static final String PAYMENT_HTTP = "http://";
    public static final String PAYMENT_HTTPS = "https://";
    
    
    public static final String VIP_GETUSERINFO_URL ="http://115.28.224.157:8081/JH-INTERFACE-SERVICE/getRrpUserMessage.action";
    public static final String VIP_TRADENOTICE_URL = "http://115.28.224.157:8081/JH-INTERFACE-SERVICE/dealWithRrpUserOrder.action";
    public static final String VIP_SHIPMENTNOTICE_URL = "http://115.28.224.157:8081/JH-INTERFACE-SERVICE/dealWithShipmentRecord.action";

    public static final String JDPAY_TEST_REFUNDBACK_URL = "/api/jdpay/test/refund/back";

    public static final String JDPAY_NATIVE_TEST_PAYBACK_URL = "/api/jdpay/test/payBack";
    public static final String WECHAT_NATIVE_PAYBACK_URL_TEST = "/api/pay/test/payBack";
    public static final String ALIPAY_PRECREATE_V2_PAYBACK_SERVICE_TEST = "/api/alipay/test_back/";
    public static final String ALIPAY_PRECREATE_PAYBACK_SERVICE_TEST = "/api/alipay/precreate/test_back/";

    public static final String ALIPAY_DEFAULT_LOCAL_PUBLICKEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2vpxkZ3l5PCkwDmyFMLTLtQjissfLXalWTBCBA/+uwjNxGNwVs8aHLjF/xCwl8Rg6R5jqEolPprhNVSQAC16xUOrl5B+LdC4uM89RHJ/PqYbZnVd4aeum+iRIiyOlH/1+39DtavXIdwAvy4WnMtq9/lSsNHlTBSJ5P5yIL5oXSwIDAQAB";
    public static final String ALIPAY_DEFAULT_LOCAL_PRIVATEKEY = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALa+nGRneXk8KTAObIUwtMu1COKyx8tdqVZMEIED/67CM3EY3BWzxocuMX/ELCXxGDpHmOoSiU+muE1VJAALXrFQ6uXkH4t0Li4zz1Ecn8+phtmdV3hp66b6JEiLI6Uf/X7f0O1q9ch3AC/Lhacy2r3+VKw0eVMFInk/nIgvmhdLAgMBAAECgYAl3Sq0VwhBSWjTTznHAweC6bi0mAxzo61xdwM4aCazBAP6nAcF7CDnY3fYHEJ1fhXiBXG2li6jNU0coNZ7t99fje26ANl1eYSo0iZZtwNUCjObX8o0XUKJ/zANmEp+yX0QqWzKtYhWaO6Z+NlZTDslQV6Fn8rhspFD0nlgdxr8aQJBAO7EAnm9Q6PngjHCdfLV/X3m5OcIaTU2n54qFoPM1QvjYjI808uxXoVaQni64/ErH2KFFkYUyIp5mxk1//CWXQUCQQDD72zXJ6lbiblvR3i1OL+4+EA1oO76XCvhytxMmh2BsfeawUmO6865ni4v1UxvsmtgVcKRfwnbo2l51qs6QVQPAkBTHcy20Fnhjs/VvpoMpM2PrHb2rgjhy1gZWRFpZD6t2sPuNRqNh/sddOQ63uRGqfpM84Njdgyxl8+UISYtfEp5AkA9vXUzeujv0j8fZIsRt7caJwe8nmCPfXnKZWzzqmB/3L9kAWIXahCzBrgRFIpIbBVPvtZXmItXrW9wGAfOjIVbAkBP7QfgSW7lDesPKs1O4uvS0td21LP5nxsWoacAR+1cltftZPMw1aLBXOqIPuPLR0iCdIvvAHwrPKK2YnxQ7LiT";
    
    //翼支付
    public static final String BEST_REFUND_URL = "https://finance.bestpay.com.cn/fas/qRCodeRefund";
    
    //建行龙支付
    public static final String CCB_PAY_URL = "https://ibsbjstar.ccb.com.cn/CCBIS/ccbMain?CCB_IBSVersion=V6";
    public static final String CCB_PAYBACK_URL = "api/pay/ccbpayback";
    
    //售货机相关配置
    public static final Integer AUTOMAT_SYNC_YES = 0;
    public static final Integer AUTOMAT_SYNC_NO = 1;
    public static final Integer AUTOMAT_ONLINE_TYPE_NON_APPROVE = 1;
    public static final Integer AUTOMAT_ONLINE_TYPE_APPROVE = 0;
    public static final String AUTOMAT_VENDING_DATA_AD = "8001";
    public static final String AUTOMAT_VENDING_DATA_THEME = "8002";
    public static final String AUTOMAT_VENDING_UPGRADE = "8000";
    public static final Integer AUTOMAT_VENDING_TYPE_DRINK_MACHINE = 1;
    public static final Integer AUTOMAT_VENDING_TYPE_SPING_MACHINE = 2;
    public static final Integer AUTOMAT_VENDING_TYPE_GRID_MACHINE = 3;
    public static final Integer AUTOMAT_LOTTERY_STATUS_1 = 1;
    public static final Integer AUTOMAT_LOTTERY_STATUS_2 = 2;
    
    public static final Integer AUTOMAT_SPECIAL_STATUS_1 = 1;
    public static final Integer AUTOMAT_SPECIAL_STATUS_2 = 2;
    
    //设备远程控制配置
    public static final Integer AD_STATUS_PUSH = 1;
    public static final Integer AD_STATUS_SAVE = 2;
    public static final Integer DEVICE_UPGRADE_STATUS_PUSH = 1;
    public static final Integer DEVICE_UPGRADE_TYPE_APP = 1;
    public static final Integer DEVICE_UPDATE_TYPE_FIRMWARE = 2;
    public static final Integer DEVICE_UPDATE_TYPE_VMC = 3;
    public static final Integer UPGRADE_TYPE_PUSH = 1;
    public static final Integer DEVICE_STATUS_PUSH = 1;
    
    //售货机事件类型
    public static final Integer AUTOMAT_EVENT_LEVEL_NOTICE_1 = 1;
    public static final Integer AUTOMAT_EVENT_LEVEL_ALARM_2 = 2;
    public static final Integer AUTOMAT_EVENT_LEVEL_ALARM_3 = 3;
    public static final Integer AUTOMAT_EVENT_LEVEL_ALARM_4 = 4;
    
    public static final Integer AUTOMAT_EVENT_TYPE_AUTOMAT_APP = 5;
    public static final Integer AUTOMAT_EVENT_TYPE_AUTOMAT_BREAKDOWN = 3;
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_71 = "71";//纸币识别器通讯异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_80 = "80";//纸币堵塞
    public static final String AUTOMAT_VENDING_FAULT_CODE_81 = "81";//纸币支付异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_82 = "82";//纸币金库已经装满
    public static final String AUTOMAT_VENDING_FAULT_CODE_84 = "84";//纸币识别器异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_86 = "86";//纸币金库打开
    public static final String AUTOMAT_VENDING_FAULT_CODE_87 = "87";//纸币拔出打开
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_10 = "10";//硬币识别器通讯异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_15 = "15";//退币开关异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_16 = "16";//找零不良
    public static final String AUTOMAT_VENDING_FAULT_CODE_17 = "17";//安全开关异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_19 = "19";//硬币选别装置异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_20 = "20";//5元空管开关异常
    public static final String AUTOMAT_VENDING_FAULT_CODE_21 = "21";//10元空管开关异常
    
    public static final String [] AUTOMAT_VENDING_FAULT_PAPER_ARRAY = new String[]{"71","80","81","82","84","86","87"};
    public static final String [] AUTOMAT_VENDING_FAULT_COIN_ARRAY = new String[]{"10","15","16","17","19","20","21"};
    
    //售货故障代码描述
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT = "9001";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_DRIVERF = "90011";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_CLOCKF = "90012";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_LSENSORF = "90013";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_RSENSORF = "90014";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_INFRAREDF = "90015";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_CARDREADERF = "90016";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT = "9002";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_CONNF = "90021";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_MOTORF = "90022";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_CASHBOXREMOVED = "90023";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_CASHBOXFULL = "90024";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_ROMCHKF = "90025";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_SENSORF = "90026";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_INBOLOCK = "90027";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_OUTAGE = "90028";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT = "9003";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_CONNF = "90031";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_VOLTSLOW = "90032";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_SENSORF = "90033";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_ROMCHKF = "90034";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_INBLOCK = "90035";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_OUTBOLOCK = "90036";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_FIVELACK = "90037";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_ONELACK = "90038";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_EXCEPREMOVED = "90039";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_OUTAGE = "900311";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT = "9004";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX1F = "90041";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX2F = "90042";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX3F = "90043";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX4F = "90044";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX5F = "90045";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX6F = "90046";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX7F = "90047";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX8F = "90048";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_APPLICATION_NETWORK = "90051";   //网络故障
    public static final String AUTOMAT_VENDING_FAULT_CODE_APPLICATION_SALE_OUT = "90052";  //缺货
    public static final String AUTOMAT_VENDING_FAULT_CODE_FLOW="90053";//流量告警
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_DESC ="系统故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_DRIVERF_DESC = "驱动板故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_CLOCKF_DESC = "系统时钟故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_LSENSORF_DESC = "左室传感器故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_RSENSORF_DESC = "右室传感器故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_INFRAREDF_DESC = "红外模块故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_SYSFAULT_CARDREADERF_DESC = "读卡器故障";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_DESC = "纸币器故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_CONNF_DESC = "连接故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_MOTORF_DESC = "纸币器驱动马达故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_CASHBOXREMOVED_DESC = "纸币器钱箱被移除";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_CASHBOXFULL_DESC = "纸币器钱箱已满";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_ROMCHKF_DESC = "纸币器rom校验错误";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_SENSORF_DESC = "纸币器传感器故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_INBOLOCK_DESC = "纸币器堵塞";
    public static final String AUTOMAT_VENDING_FAULT_CODE_PAPERFAULT_OUTAGE_DESC = "纸币器停用";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_DESC = "硬币器故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_CONNF_DESC = "硬币器连接故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_VOLTSLOW_DESC = "硬币器工作电压低";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_SENSORF_DESC = "硬币器传感器故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_ROMCHKF_DESC = "硬币器ROM校验错误";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_INBLOCK_DESC = "硬币器接收堵塞";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_OUTBOLOCK_DESC = "硬币器支出堵塞";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_FIVELACK_DESC = "5角缺币";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_ONELACK_DESC = "1元缺币";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_EXCEPREMOVED_DESC = "硬币器异常移除";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COINFAULT_OUTAGE_DESC = "硬币器停用";
    
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_DESC = "通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX1F_DESC = "扩展柜1通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX2F_DESC = "扩展柜2通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX3F_DESC = "扩展柜3通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX4F_DESC = "扩展柜4通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX5F_DESC = "扩展柜5通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX6F_DESC = "扩展柜6通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX7F_DESC = "扩展柜7通讯故障";
    public static final String AUTOMAT_VENDING_FAULT_CODE_COMMFAULT_ADDTBOX8F_DESC = "扩展柜8通讯故障";
    //Redis Message KEY
    public static final String REDIS_DEVICE_INFO_KEY = "DEVICEINFO";
    public static final String REDIS_TRADE_INFO_KEY = "TRADEINFO";
    public static final String REDIS_TRADE_TEST_KEY = "TRADETEST";
    public static final String REDIS_DEVICE_TOKEN_KEY = "TOKEN";
    public static final String REDIS_ACTIVITY_CODE_KEY = "ACTIVITYCODE";//问卷调查 获取取货码
    public static final Integer REDIS_TRADE_TIME_OUT = 300;
    public static final Integer REDIS_TRADE_TIME_OUT_ONE_HOUR = 1200;
    
    //货道状态
    public static final Integer SHELVES_STATE_SOLD_OUT = 1;
    public static final Integer SHELVES_STATE_NORMAL = 0;
    
    public static final Integer AUTOMAT_MACHINE_TYPE_DRINK = 1;
    public static final Integer AUTOMAT_MACHINE_TYPE_SPRING = 2;
    public static final Integer AUTOMAT_MACHINE_TYPE_GRID = 3;
    public static final Integer AUTOMAT_MACHINE_TYPE_COFFEE = 4;
    public static final Integer AUTOMAT_MACHINE_TYPE_WINE = 5;
    
    public static final Integer TRADE_ORDER_MAXIMUM = 50;
    
    public static final String GET_DEVICE_ADDRESS_INFO = "http://api.cellocation.com/cell/";
    
    //冰山：wxb6b9ee729bd085c5
    //映翰通：wxef7cb53cab2eb437
    //澳柯码：wxf275f67c77e5910e
    public static final String WECHAT_SUBSCRIPTION_APPID = "wxf275f67c77e5910e";//"wxef7cb53cab2eb437";
    public static final String WECHAT_CODE_TEST_APPID = "wxf275f67c77e5910e";
    public static final String WECHAT_CODE_TEST_SECRET = "f7019d81f9afca8121a6d47cf41bd429";
    //冰山：47282d09183dd5825ccf26afb4062d90
    //映翰通智能售货机管家：66c44f0ba16db341da8e012da8277701
    //澳玛码：f7019d81f9afca8121a6d47cf41bd429
    public static final String WECHAT_SUBSCRIPTION_SECRET = "f7019d81f9afca8121a6d47cf41bd429";//"66c44f0ba16db341da8e012da8277701";
    //冰山：bS0BtcSog0DkTMePaRX4StafBfScJ-a8R7PgW7kkjss
    //映翰通：iULk4EPROyz3fJ7eLgM4mcaU5uTkzLZ4PU6wfVqjhbw(智能售货机管家)
    //澳柯玛：rrwXmBxQd9oiUCqpORroQZGR8pVJl5nGXAdIDAeGdkg
    public static final String WECHAT_MODULE_ID = "rrwXmBxQd9oiUCqpORroQZGR8pVJl5nGXAdIDAeGdkg";
    
    public static final Integer AUTOMAT_EVENTS_TYPE_EVENT = 1;
    public static final Integer AUTOMAT_EVENTS_TYPE_ALARM = 2;
    
    public static final Integer AUTOMAT_EVENTS_ACTION_CREATE = 1;
    public static final Integer AUTOMAT_EVENTS_ACTION_CANCEL_AUTO = 2;
    public static final Integer AUTOMAT_EVENTS_ACTION_CANCEL_HANDLE = 3;
    
    public static final Integer AUTOMAT_EVENTS_CLASS_DOOR_OPEN = 1;
    public static final Integer AUTOMAT_EVENTS_CLASS_DOOR_CLOSE = 9;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_SHELVES = 2;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_GOODS = 3;
    public static final Integer AUTOMAT_EVENTS_CLASS_REPLENISH = 4;
    public static final Integer AUTOMAT_EVENTS_CLASS_VCS_RE_REGISTRATIION = 5;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_UPGRADE_FILE = 6;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_AD_FILE = 7;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_GAME_FILE = 8;
    public static final Integer AUTOMAT_EVENTS_CLASS_UPDATE_SHELVES = 10;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_MODULE_CONFIG = 11;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_FIREWARE_UPGRADE = 12;
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_VSI_UPGRADE = 13;
    public static final Integer AUTOMAT_EVENTS_CLASS_START_RECORD = 14;
    public static final Integer AUTOMAT_EVENTS_CLASS_INBOX_RESTART = 15;
    
    public static final Integer AUTOMAT_EVENTS_CLASS_SYNC_SPECIAL_FILE = 16;
    
    public static final Integer AUTOMAT_EVENTS_LEVEL_GENERAL = 1;
    public static final Integer AUTOMAT_EVENTS_LEVEL_SERIOUS = 3;
    public static final Integer AUTOMAT_EVENTS_LEVEL_IMPORTANT = 2;
    
    public static final Integer AUTOMAT_DOOR_OPEN = 1;
    public static final Integer AUTOMAT_DOOR_CLOSE = 0;
    
    
    public static final Integer AUTOMAT_REPLENISH_RECORD_TYPE_0 = 0;
    public static final Integer AUTOMAT_REPLENISH_RECORD_TYPE_1 = 1;
    
    //取货码类型
    public static final Integer CODE_TYPE_MALL = 1;
    public static final Integer CODE_TYPE_FOLLOW = 2;
    public static final Integer CODE_TYPE_3 = 3;
    
    //关注出货方式
    public static final String WECHAT_FOLLOW_TYPE_AUTO = "1";
    public static final String WECHAT_FOLLOW_TYPE_CODE = "2";
    
    //二维码支付供应商类型
    public static final String QRCODEPAY_YINGLIAN = "1";//银联
    public static final String QRCODEPAY_WANZHONGHEYI = "2";//众合万宜
    public static final String QRCODEPAY_SHENGTU = "3";//升途
    
    public static final String QRCODEPAY_WZ_ORDERURL = "https://heemoney.heepay.com/Heemoney/TakeDeliverySubmit";
    public static final String QRCODEPAY_WZ_REFUNDURL = "https://heemoney.heepay.com/api/refund";
    
    public static final String ICBC_GET_TOKEN_URL = "https://imapi.icbc.com.cn/open/token";
    public static final String ICBC_GET_JSAPITICKET_URL = "https://imapi.icbc.com.cn";
    public static final String ICBC_ACCESSTOKEN_REDIS_KEY = "ICBCACCESSTOKEN";
    public static final String ICBC_SESSIONKEY_REDIS_KEY = "ICBCSESSIONKEY";
    public static final String ICBC_JSAPITICKET_REDIS_KEY = "ICBCJSAPITICKET";
    public static final String ICBC_JSAPIPAYTICKET_REDIS_KEY = "ICBCJSAPIPAYTICKET";
    
    public static final String OSS_SIGNATURE_KEY = "OSSSIGNATUREKEY";
    public static final String OSS_SIGNPOLICY_KEY = "OSSSIGNPOLICYKEY";
    
    public static final Long LOCK_HANDLE_TAG_RESULT = 1l;
    public static final String LOCK_HANDLE_TRADE_CALLBACK_TAG = "CALLBACK";
    
    
    
    
    //泥巴车配置
    
    public static final Integer SMART_DEVICE_TYPE_NOCONFIRM = 0;
    public static final Integer SMART_DEVICE_TYPE_CONFIRM = 1;
    
    public static final String SMART_REDICT_PARAMS_MYINFO = "myInfo";
    public static final String SMART_REDICT_PARAMS_MYCARTS = "myCarts";
    
    
    
}
