package cn.com.inhand.common.amqp;

            public class RoutingKeys {
    //smart_vm

      public static final String REQUEST_DELIVER_TOTAL = "dn.key.request.trade.Deliver";           
                
    public static final String TRADE_TOTAL = "dn.key.trade.Statistic";
    public static final String ADMIN_TRADE_TOTAL = "dn.key.admin.trade.Statistic";
    
    ///////////////////////////////////
    public static final String SEND_REPLENISH_MSG = "dn.key.send.replenish.msg";
    public static final String SEND_TRADE_MSG = "dn.key.send.trade.msg";
    public static final String SEND_DEVICE_STATUS_MSG = "dn.key.send.device.status.msg";
    public static final String SEND_CODE_AUTH_MSG = "dn.key.send.code.auth.msg";
    public static final String SEND_CODE_CANCEL_MSG = "dn.key.send.code.cancel.msg";
    
    public static final String ADD_TASKSMART = "dn.key.taskSmart.add";
    public static final String ADD_TASKSMART_V2 = "dn.key.taskSmart.add_v2";
    public static final String ADD_TASKSMARTAUTOMAT = "dn.key.taskSmartAutomat.add";
    public static final String ADD_TASKSMART_BAIFUBAO = "dn.key.taskSmartBaifubao.add";
    public static final String ADD_SMARTVM_WECHAT = "smartvm.key.wechat.add";
    public static final String ADD_SMARTVM_BAIFUBAO = "smartvm.key.baifubao.add";
    public static final String ADD_SMARTVM_ALIPAY = "smartvm.key.alipay.add";
    public static final String ADD_SMARTVM_ABCPAY = "smartvm.key.abcpay.add";
    public static final String SHELVES_INFO = "smartvm.key.shelves.info";
    public static final String ALIPAY_CREATEANDPAY_INFO = "smartvm.key.createandpay.info";
    public static final String AUTOMAT_EVENT_KEY = "smartvm.key.vendingEvent";
    
    public static final String SHELF_SOLD_OUT_KEY = "dn.key.shelf.soldout";
    /**
     * dn.key.resource.add.$oid.$type";
     */
    public static final String ADD_RESOURCE = "dn.key.resource.add";
    /**
     * dn.key.resource.update
     */
    public static final String UPDATE_RESOURCE = "dn.key.resource.update";
    /**
     * dn.key.resource.delete
     */
    public static final String DELETE_RESOURCE = "dn.key.resource.delete";
    public static final String ADD_TOKEN = "dn.key.token.add";
    public static final String DELETE_TOKEN = "dn.key.token.delete";
    public static final String ADD_CODE = "dn.key.code.add";
    /**
     * dn.key.task.update.$oid";
     */
    public static final String UPDATE_TASK = "dn.key.task.update";
    /**
     * dn.key.task.add.$oid.$type";
     */
    public static final String ADD_TASK = "dn.key.task.add";
    /**
     * dn.key.task.delete.$oid.$type";
     */
    public static final String DELETE_TASK = "dn.key.task.delete";
    /**
     * dn.key.log.$oid.1";
     */
    public static final String BUSINESS_LOG = "dn.key.log";
    /**
     * dn.key.log.$oid.2";
     */
    public static final String DEVICE_LOG = "dn.key.log";
    /**
     * dn.key.alarm.add.2.$oid.$type";
     */
    public static final String BUSINESS_ALARM = "dn.key.alarm.add.2";
    /**
     * dn.key.alarm.add.1.$type";
     */
    public static final String SYSTEM_ALARM = "dn.key.alarm.add.1";
    public static final String DEVICES = "dn.key.devices.operation";
    public static final String UNSET_DEVICES = "dn.key.devices.unset";
    public static final String DEVICE_CONFIG = "dn.key.devices.config";
    /**
     * dn.key.devices.data.$oid.$deviceId.$sensorId";
     */
    public static final String DEVICE_TLV = "dn.key.devices.data";
    /**
     * dn.key.device.data.$id
     */
    public static final String DEVICE_DATA = "dn.key.device.data";
    /**
     * dn.key.devices.location.$oid.$deviceId.$sensorId";
     */
    public static final String DEVICE_LOC = "dn.key.devices.location";
    /**
     * dn.key.device.event.$oid.$deviceId.$type"; type: 1. 网关登陆 2. 网关登出 3. 基站信息
     * 4. GPS
     */
    public static final String DEVICE_EVENT = "dn.key.device.event.$oid.$deviceId.$type";
    /**
     * dn.key.user
     */
    public static final String USER_LOGIN = "dn.key.user.login";
    public static final String USER_LOGOUT = "dn.key.user.logout";
    /**
     * dn.key.devices.status.$oid.$deviceId";
     */
    public static final String DEVICE_STATUS = "dn.key.devices.status";
    public static final String MAIL = "dn.key.mail";
    public static final String SMS = "dn.key.sms";
    public static final String NODE = "dn.key.node.ap";
    /**
     * dn.key.client.options.*;
     */
    public static final String CLIENT_CONNECTED = "dn.key.client.operation.1";
    public static final String CLIENT_DISCONNECTED = "dn.key.client.operation.0";
    /**
     * dn.key.client.kill
     */
    public static final String KILL_CHANNEL = "dn.key.client.kill";
    /**
     * dn.key.lbs.$oid
     */
    public static final String REQUEST_LOCATION = "dn.key.lbs";
    /**
     * dn.key.wifi.access.$oid;
     */
    public static final String WIFI_TERMINAL = "dn.key.wifi.terminal";
    public static final String WIFI_USER = "dn.key.wifi.user";
    public static final String WIFI_USER_ACCESS = "dn.key.wifi.user.access";
    public static final String WIFI_SEND_SMSCODE = "dn.key.wifi.user.smscode";
    /**
     * dn.key.wifi.content.sync.$oid;
     */
    public static final String WIFI_DEVICE_SECRET = "dn.key.wifi.content.sync.secret";
    public static final String WIFI_SYNC_STATE = "dn.key.wifi.content.sync.state";
    /**
     * dn.key.wifi.wechat.event
     */
    public static final String WIFI_WECHAT_EVENT = "dn.key.wifi.wechat.event";
    
    public static final String WIFI_WECHAT_PVUV="dn.key.wifi.wechat.wifi.pvuv";

    public static final String AD_BROADCAST_STATISTIC = "dn.key.broadcast.Statistic";   
}
