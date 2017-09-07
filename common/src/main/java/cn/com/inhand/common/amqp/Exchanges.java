package cn.com.inhand.common.amqp;

public class Exchanges {
    public static final String RESOURCE = "dn.exchange.resource";
    public static final String AUTH = "dn.exchange.auth";
    public static final String TASK = "dn.exchange.task";
    public static final String LOG = "dn.exchange.log";
    public static final String ALARM = "dn.exchange.alarm";
    public static final String OVDP = "dn.exchange.ovdp";
    public static final String USER = "dn.exchange.user";
    public static final String MAIL = "dn.exchange.mail";
    public static final String SMS = "dn.exchange.sms";
    public static final String NODE = "dn.exchange.node";
    public static final String VPN = "dn.exchange.vpn";
    public static final String LBS = "dn.exchange.lbs";
    public static final String WIFI_ACCESS = "dn.exchange.wifi.access";
    public static final String WIFI_USER = "dn.exchange.wifi.user";
    public static final String WIFI_CONTENT_SYNC = "dn.exchange.content.sync";
    public static final String WIFI_WECHAT="dn.exchange.wifi.wechat";
    public static final String WIFI_PVUV = "dn.exchange.wifi.pvuv";
    
    //smart_vm
    public static final String TASK_SMART = "taskSmart1";
    public static final String TASK_SMART_V2 = "taskSmart1_v2";
    public static final String TRADE_SMART_WECHAT = "smartvm.exchange.wechat.trade";
    public static final String TRADE_SMART_BAIFUBAO = "smartvm.exchange.baifubao.trade";
    public static final String TRADE_SMART_ALIPAY = "smartvm.exchange.alipay.trade";
    public static final String SHELVES_CONFIG = "smartvm.exchange.shelves.config";
    public static final String ALIPAY_CREATEANDPAY_CONFIG = "smartvm.exchange.createandpay.config";
    public static final String AUTOMAT_EVENT_CONFIG = "smartvm.exchange.vendingEvent";
    public static final String TRADE_SMART_ABCPAY = "smartvm.exchange.abcpay.trade";
    
    public static final String TRADE = "dn.exchange.tradeStatistic";
    
    public static final String ADMIN_TRADE = "dn.exchange.adminTradeStatistic";
    
    public static final String SHELF_SOLD_OUT_EXCHANGE = "dn.exchange.soldOut";
    
    public static final String REQUEST_DELIVER = "dn.exchange.requestDeliver";
    
    
    public static final String SEND_REPLENISH_MSG = "dn.exchange.sendReplenishMsg";
    public static final String SEND_TRADE_MSG = "dn.exchange.sendTradeMsg";
    public static final String SEND_DEVICE_STATUS_MSG = "dn.exchange.sendDeviceStatusMsg";
    public static final String SEND_CODE_AUTH_MSG = "dn.exchange.sendCodeAuthMsg";
    public static final String SEND_CODE_CANCEL_MSG = "dn.exchange.sendCodeCancelMsg";
    
    public static final String BROADCAST_STATISTIC = "dn.exchange.broadcastStatistic";
}
