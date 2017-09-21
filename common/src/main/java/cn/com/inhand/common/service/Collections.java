package cn.com.inhand.common.service;

public class Collections {

    public static final String ORGANIZATIONS = "organizations";
    public static final String SITE = "site";
    public static final String DEVICE = "device";
    public static final String MODEL = "model";
    public static final String MACHINE = "machine";
    public static final String TOPOLOGY = "topology";
    public static final String POLICY = "policy";
    public static final String TAG = "resource_tag";
    public static final String CUSTOMER = "customer";
    public static final String SYSTEM = "abcde";
    public static final String PP = "dn_pp";
    public static final String OVDP_DEVICE = "ovdp_device";
    public static final String HISTORY_DATA = "data";
    public static final String REALTIME_DATA = "rt_data";
    public static final String LICENSE = "license";
    public static final String USERS = "users";
    public static final String TASKS = "tasks";
    public static final String DEVICE_ONLINE_STAT = "device_online_stat";
    public static final String TRAFFIC_DAY = "traffic_day";
    public static final String SCADA = "scada";
    public static final String CAPTCHA = "captcha";
    public static final String CLIENTS = "clients";
    public static final String CHANNEL = "channel";
    public static final String SCADA_COMPONENT = "scada.component";
    public static final String SCADA_VIEWS = "scada.views";
    public static final String VPN_ACCOUNT = "vpn_account";
    public static final String IMSI_MAPPING = "imsi_mapping";
    public static final String OAUTH2_CODE = "oauth2.code";
    public static final String TOKEN = "oauth2.token";
    public static final String REFRESH_TOKEN = "oauth2.refresh.token";
    public static final String USER_DBS = "user_dbs";
    public static final String ROLE = "roles";
    public static final String API_KEYS = "api_keys";
    public static final String DEVICE_KEY = "device.key";
    public static final String KEY_VALUE_STORAGE = "key_value_storage";
    public static final String RESOURCE_TAG = "resource_tag";
    public static final String VPN_SERVER_CONNECTIONS = "vpn.servers";
    public static final String DEVICE_SUMMARY = "device.summary";
    public static final String WIFI_USERS = "wifi.users";
    public static final String WIFI_TERMINALS = "wifi.terminals";
    public static final String WIFI_BLACKWHITE = "wifi.blackwhite";
    public static final String WIFI_OAUTH2_CLIENT = "wifi.oauth2.client";
    public static final String WIFI_OAUTH2_CODE = "wifi.oauth2.code";
    public static final String WIFI_REFRESH_TOKEN = "wifi.oauth2.refresh_token";
    public static final String WIFI_ACCESS_TOKEN = "wifi.oauth2.access_token";
    public static final String WIFI_SMS_CODE_INSTANT = "wifi.sms.instant";
    public static final String WIFI_SMS_CODE_HISTORY = "wifi.sms.history";
    public static final String WIFI_USER_GROUP = "wifi.group";
    public static final String WIFI_USER_TOTAL = "wifi.user.total";
    public static final String WIFI_USER_NEW = "wifi.user.new";
    public static final String WIFI_USER_ONLINE = "wifi.user.online";
    public static final String WIFI_USER_ONLINE_DAIYLY = "wifi.user.online.daily";
    public static final String WIFI_USER_DAILY_ACTIVE = "wifi.user.active.daily";
    public static final String WIFI_USER_WEEKLY_ACTIVE = "wifi.user.active.weekly";
    public static final String WIFI_TERMINAL_TOTAL = "wifi.terminal.total";
    public static final String WIFI_TERMINAL_NEW = "wifi.terminal.new";
    public static final String WIFI_TERMINAL_ONLINE = "wifi.terminal.online";
    public static final String WIFI_TERMINAL_ONLINE_DAILY = "wifi.terminal.online.daily";
    public static final String WIFI_TERMINAL_DAILY_ACTIVE = "wifi.terminal.active.daily";
    public static final String WIFI_TERMINAL_WEEKLY_ACTIVE = "wifi.terminal.active.weekly";
    public static final String WIFI_PVUV_RESOURCE = "wifi.pvuv.resource";
    public static final String WIFI_PVUV_TYPE = "wifi.pvuv.type";
    public static final String WIFI_PVUV_STAT = "wifi.pvuv.stat";
    public static final String WIFI_PVUV_CLICK = "wifi.pvuv.click";
    public static final String WIFI_USER_ACCESS = "wifi.user.access";
    public static final String WIFI_TERMINAL_ACCESS = "wifi.terminal.access";
    public static final String WIFI_TERMINAL_STATUS = "wifi.terminal.status";
    public static final String WIFI_USER_STATUS = "wifi.user.status";
    public static final String WIFI_USER_TRAFFIC = "wifi.user.traffic";
    public static final String WIFI_TERMINAL_STAY = "wifi.terminal.stay";
    public static final String WIFI_STAT = "wifi.stat";
    public static final String WIFI_PUBLISH_POINT = "wifi.publish.point";
    public static final String WIFI_CONTENT_PUBLISHED = "wifi.content.pubished";
    public static final String WIFI_SYNC_POINT = "wifi.sync.point";
    public static final String WIFI_SYNC_LOG = "wifi.sync.log";
    public static final String WIFI_DEVICE_ONLINE = "wifi.device.online";
    public static final String WIFI_DEVICE_TOTAL = "wifi.device.total";
    public static final String WIFI_JOB = "wifi.job";
    public static final String WIFI_FlOW = "wifi.flow";
    public static final String WIFI_PACK = "wifi.pack";
    public static final String WIFI_SIM_PACK = "wifi.sim.pack";
    public static final String WIFI_PARTY3_CODE = "wifi.party3.code";
    public static final String WIFI_ORGANIZATION_CONFIG = "wifi.org.config";
    
    public static final String SMART_AREAPAY = "smart.areapay";
    /*
     * wechat
     */
    public static final String WIFI_WECHAT_EVENT_LOG = "wifi.wechat.eventlog";
    public static final String WIFI_WECHAT_GLOBAL_TOKEN = "wifi.wechat.globaltoken";
    public static final String WIFI_WECHAT_QR_CODE = "wifi.wechat.qrcode";
    public static final String WIFI_WECHAT_MESSAGE_FREQUENCY = "wifi.wechat.frequency";
    public static final String WIFI_WECHAT_REPLY = "wifi.wechat.reply";
    public static final String WIFI_WECHAT_METADATA = "wifi.wechat.metadata";
    public static final String WIFI_WECHAT_REPLYKEY = "wifi.wechat.replykey";
    
	public static final String WIFI_WECHAT_CODE = "wifi.wechat.code";
	public static final String WIFI_GLOBAL_CONFIG = "wifi.global.public.config";
	public static final String WIFI_WECHAT_SSID = "wifi.wechat.ssid";
    
	/**
	 * ad
	 */
	public static final String WIFI_AD_PROJECT="wifi.ad.project";
	public static final String WIFI_AD_PUBLISHED="wifi.ad.published";
    
    /**
     * GE REPORT
     */
    public static final String GE_Report = "GeReport";
    /*
     * samrt
     */
    public static final String SMART_GROUP = "smart.group";//分组表
    public static final String SMART_DELIVERY = "smart.delivery";//配送人员信息表
    public static final String SMART_MODEL = "smart.model";//机型表
    public static final String SMART_MODEL_MANAGE = "smart.model.manage";//
    public static final String SMART_ALARM = "smart.alarm";//告警事件表
    public static final String SMART_GOODS = "smart.goods";//商品表
    public static final String SMART_TRADE = "smart.trade";//交易表
    public static final String SMART_TRADE_TEMP = "smart.trade.temp"; //交易的临时表
    public static final String SMART_SITE = "smart.site";//点位表
    public static final String SMART_AUTOMAT = "smart.automat";//点位表
    public static final String SMART_GOODSCONFIG = "smart.goodsconfig";//货道模板表
    public static final String SMART_PAYSTYLE = "smart.paystyle";//支付方式
    public static final String SMART_PAYLIST = "smart.paylist";//设置支付方式
    
    public static final String SMART_OUTINTERFACE_CONFIG = "smart.outinterface.config";//设置外部接口配置
    public static final String SMART_PARAMETER_CONFIG = "smart.parameter.config";//参数配置
    
    public static final String SMART_STOCK_MANAGEMENT = "smart.stock.management";  //库存管理
    
    
    public static final String SMART_ACTIVITY = "smart.activity";//优惠活动表
    public static final String SMART_ACTIVITY_SYNC = "smart.activitytask";//优惠活动同步任务表
    public static final String SMART_APP_TASK = "smart.apptask";//应用任务表
    public static final String SMART_SYS_TASK = "smart.systask";//系统任务表
    public static final String SMART_SMART_DEVICE = "smart_device";
    public static final String SMART_OVDP_INBOX = "ovdp_inbox";
    public static final String SMART_INBOX = "smart.inbox";
    public static final String SMART_INBOX_HISTORY_DATA = "smart.inbox.history.data";
    public static final String SMART_DN_PP = "dn_pp";
    public static final String SMART_TASK = "smart.task";//任务汇总表
    public static final String SMART_ORDER_DBNAME = "";//订单数据库
    public static final String SMART_ORDER_COLLECTIONNAME = "";//订单数据库
    public static final String WECHAT_OAUTH_INFO = "wechat_oauth_info";
    public static final String TRADE_STATISTIC = "trade.statistic.day";
    public static final String TRADE_STATISTIC_SITE = "trade.site.statistic.day";
    public static final String ONLINE_STATISTIC = "online.statistic.day";
    public static final String SITE_STATISTIC_DAY = "smart.site.statistic.day";
    public static final String SITE_STATISTIC_MONTH = "smart.site.statistic.month";
    public static final String SITE_STATISTIC_YEAR = "smart.site.statistic.year";
    public static final String SMART_AREA = "smart.area";//区域表
    public static final String GOODS_STATISTIC = "smart.goods.statistic";
    public static final String GOODS_TYPE_STATISTIC = "smart.goodstype.statistic";
    public static final String SMART_USERS = "smart.users";//用户表
    public static final String SMART_GOODS_TYPE = "smart.goods.type";
    public static final String SMART_CARD = "smart.card";
    public static final String SMART_FACEBOOK = "smart.facebook";
    public static final String SMART_SYSACTIVITY_CODE = "smart.sysactivity.code";
    public static final String SMART_DEVICE_MONEY = "smart.device.money";
    public static final String SMART_SALE_SUM = "smart.device.salesAmount";//售货机上报货道销售数量
    public static final String SMART_REPLENISHMENT_RECORD = "smart.device.replenishment";//补货记录
    public static final String SMART_REPLENISHMENT_RECORD_V2 = "smart.device.replenish";//补货记录
    
    public static final String SMART_REPLENISHMENT_RECORD_V4 = "smart.device.rmrecordV4";//新补货记录表
    public static final String SMART_REPLENISHMENT_RECORD_V5 = "smart.device.rmrecordV5";//新补货记录表
    
     public static final String SMART_REPLENISHMENT_RECORD_COMMON = "smart.device.common.rmrecord";//补货表
    
    public static final String SMART_REPLENISHMENT_CASH_RECORD = "smart.device.cashrecord";//补货现金记录
    
    public static final String SMART_REPLENISHMENT_CID_RECORD = "smart.device.cidrecord";//补货货道记录
    
    public static final String SMART_REPLENISHMENT_RECORD_V3 = "smart.device.rmrecord";//旧补货记录表
    
    public static final String SMART_REPLENISHMENT_RECORD_PLAN = "smart.device.recordplan";//
    public static final String SMART_REPLENISHMENT_RECORD_PLANV2 = "smart.device.recordplanV2";//
    public static final String SMART_RELATE_REPLENISHMENT_RECORD_PLAN = "smart.device.relateplan";//
    
    public static final String SMART_RELATE_REPLENISHMENT_DEVICE_FORECAST = "smart.device.recordplan.forecast";//
    
    public static final String SMART_MODEL_TREAT = "smart.model.treat";
    
    
    public static final String SMART_CHANNEL_MODEL = "smart.channel.model";
    public static final String SMART_LINE = "smart.line";//线路表
    public static final String SMART_CODE = "smart.code";
    public static final String SMART_DEVICE_EXCEPTION = "smart.device.exception";
    public static final String SMART_AD = "smart.ad";//广告升级
    public static final String SMART_DEVICE_UPGRADE = "smart.device.upgrade";//设备升级
    public static final String SMART_LOTTERY = "smart.lottery";//抽奖配置
    public static final String SMART_APP_VERSION = "smart.app.version";//app版本
    public static final String SMART_MEDIAS = "smart.medias";
    public static final String SMART_SITE_TYPE = "smart.site.type";
    public static final String SMART_CUSTOMER_RESOURCE = "smart.customer.resources";
    
    public static final String SMART_SPECIAL_OFFER = "smart.special.offer";//优惠活动
    
    public static final String SMART_SALES_DATA = "smart.sales.data";
    
    public static final String SMART_SUGGEST_REPLENISHMENT = "smart.suggest.replenishment";
    
    public static final String SMART_SETTLEMENT_RECORD = "smart.settlement.record";
    
    public static final String SMART_TRAFFIC = "smart.traffic";//流量
    
    public static final String SMART_TRAFFIC_STATISTIC = "smart.traffic.statistic";
    
    public static final String SMART_SCAN_TRADE = "smart.scan.trade";//交易表
    public static final String SMART_AP = "smart.frc.ap";//AP
    public static final String SMART_VENDER = "smart.vender";//AP
    public static final String SMART_EVENT = "smart.event";//告警事件表
    public static final String SMART_DEX_INFO="smart.dex.info";//基于dex协议的文件信息
    public static final String SMART_CONTRACT = "smart.contract";//合同表
    public static final String WARE_HOUSE = "ware.house";//出货仓库
    public static final String SMART_CLIENT_SECRET = "smart.customer.resources";
    public static final String SMART_WECHAT_USER = "smart.wechat.user";
    public static final String LINE_STATISTIC_DAY = "smart.line.statistic.day";
    public static final String AREA_STATISTIC_DAY = "smart.area.statistic.day";
    public static final String SMART_AD_RECORD = "smart.ad.record";
    public static final String SMART_GRADES = "smart.grades";
    public static final String AD_STATISTIC_HOUR = "smart.ad.statistic.hour";
    public static final String SMART_THIRD_CODE = "smart.third.code";
    public static final String SMART_ACTIVITY_CODE = "smart.activity.code";
    public static final String SMART_HELPDOC  = "smart.helpdoc";
    public static final String SMART_ALARM_SUBSCRIBE  = "smart.alarmSubscribe";
    public static final String SMART_SALES  = "smart.saler";
    
    public static final String SMART_BILL = "smart.bill";//账单
    public static final String SMART_BILLDETAIL= "smart.billDetail";//账单详情
    public static final String LOGINCODE= "loginCode";//登录口令
    
    public static final String SMART_TGCODE =  "smart.tgcode";//太古取货码
    public static final String SMART_TGCODE_USE_LOG =  "smart.tgcodeuselog";//太古取货码
    //出货失败 admin 统计表
    public static final String ADMIN_DF_STATISTIC_DAY = "smart.admin.deliver.faliure.day";
    public static final String ADMIN_DF_STATISTIC_MONTH = "smart.admin.deliver.faliure.month";
    public static final String ADMIN_DF_STATISTIC_YEAR = "smart.admin.deliver.faliure.year";
    
    public static final String SMART_NOTICE =  "smart.notice";//系统公告
    
    public static final String SMART_FLOW_CONFIG = "smart.flowAlarm.config";//流量告警配置
    public static final String SMART_FLOW_ALARM="smart.flow_alarm";
    
    public static final String SMART_STAR_CONFIG="smart.star.config";//销量星级配置表
    
    
    //泥巴车数据库表
    
    public static final String SMART_FM_DEVICE = "smart.fm.device";
    public static final String SMART_FM_MEMBER = "smart.fm.member";
    public static final String SMART_FM_CARDS = "smart.fm.cards";
    public static final String SMART_FM_TRADE = "smart.fm.trade";
    public static final String SMART_FM_AREA = "smart.fm.area";
    public static final String SMART_FM_DEALER = "smart.fm.dealer";
    public static final String SMART_FM_SITE = "smart.fm.site";
    public static final String SMART_FM_MODULE = "smart.fm.module";
    public static final String SMART_FM_RFID = "smart.fm.rfid";
    public static final String SMART_FM_PAYTRADE = "smart.fm.paytrade";
}
