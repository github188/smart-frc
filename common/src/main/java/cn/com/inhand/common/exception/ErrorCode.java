package cn.com.inhand.common.exception;

public enum ErrorCode {

    //System Error
    SYSTEM_ERROR(10001, "System error"),
    SERVICE_UNAVAILABLE(10002, "Service unavailable"),
    IP_LIMIT(10004, "IP limit"),
    PERMISSTON_DENIED(10005, "Permission denied,need a high level appkey"),
    PARAM_ERROR(10008, "Param error,see doc for more info"),
    TOO_MANY_PENDING_TASKS(10009, "Too many pending tasks,system is busy"),
    ILLEGAL_REQUEST(10012, "Illegal request"),
    INVALID_USER(10013, "Invalid user"),
    INSUFFICIENT_APP_PRIVILEGES(10014, "Insufficient app privileges"),
    MISS_REQUIRED_PARAMETER(10016, "Miss requred parameter (%s),see doc for more info"),
    PARAMETER_VALUE_INVALID(10017, "Parameter (%s)'s value invalid, see doc for more info"),
    HTTP_BODY_FORMAT_ERROR(10018, "HTTP body format error, see doc for more info"),
    HTTP_METHOD_SUPORT_ERROR(10021, "HTTP method is not suported for this request"),
    IP_REQUESTS_OUT_OF_RATE_LIMIT(10022, "IP requests for (%s) out of rate limit"),
    USER_RQUESTS_OUT_OF_RATE_LIMIT(10024, "User requests for (%s) out of rate limit"),
    APP_RQUESTS_OUT_OF_RATE_LIMIT(10025, "App requests for (%s) out of rate limit"),
    ORGANIZATION__RQUESTS_OUT_OF_RATE_LIMIT(10026, "Organization requests out of rate limit"),
    MODEL_DUPLICATE_VAR_IDS(100027, "Duplicate variable IDs (%s)"),
    MODEL_VAR_ID_IS_NULL(100028, "Variable ID is null"),

    //Server Error
    ORGANIZATION_DOES_NOT_EXIST(20002, "Organization does not exist"),
    USER_DOES_NOT_EXIST(20003, "User does not exists"),
    ROLE_DOES_NOT_EXIST(20004, "Role does not exists"),
    RESOURCE_DOES_NOT_ALLOWED(20005, "Resource (%s) does not allowed"),
    RESOURCE_DOES_NOT_EXIST(20006, "Resource (%s) does not exist"),
    RESOURCE_ALREADY_EXISTS(20007, "Resource (%s) already exists"),
    ORGANIZATION_DOES_NOT_APPROVED(20009, "Organization does not approved"),
    ORGANIZATION_APPROVES_FAILED(20010, "Organization approves failed"),
    ORGANIZATION_DOES_NOT_ACTIVATED(20011, "Organization does not approved"),
    TEXT_TOO_LONG(20012, "Text too long"),
    VARIFICATION_CODE_ERROR(20013, "Varification code error"),
    OPERATION_OUT_OF_LIMIT(20016, "Operation out of limit"),
    GATEWAY_ALREADY_EXISTS(20020, "Gateway already exists in site(%s)"),
    AUTH_FAILED(21301, "Auth failed"),
    USERNAME_OR_PASSWORD_ERROR(21302, "Username or password error"),
    USERNAME_ADD_PWD_AUTH_OUT_OF_RATE_LIMIT(21303, "Username and pwd auth out of rate limit"),

    USER_LOCKED(21304, "User locked, unlock left (%s)"),
    USER_LOGIN_REQUIRED(21305, "User login requried"),
    CAPTCHA_CODE_ERROR(21306, "captcha code error"),
    APP_KEY_DOES_NOT_EXIST(21311, "App key does not exist"),
    APPLICATIONS_OVER_THE_UNAUDITED_USE_RESTRICATIONS(21321, "Application over the unaudited use restrictions"),
    RESOURCE_NAME_ALREADY_EXISTS(21322, "Resource name (%s) already exists"),
    
    LINE_SITE_ADDRESS_ALREADY_EXISTS(21312, "Site name (%s) the address already exists"),
    //oAuth error
    REDIRECT_URI_MISMATCH(21322, "Redirect uri mismatch"),
    INVALID_REQUEST(21323, "Invalid request"),
    INVALID_CLIENT(21324, "Invalid client"),
    INVALID_GRANT(21325, "Invalid grant"),
    UNAUTHORIZED_CLIENT(21326, "Unauthorized client"),
    EXPIRED_TOKEN(21327, "Expired token"),
    UNSUPPORTED_GRANT_TYPE(21328, "Unsupported grant type"),
    UNSUPPORTED_RESPONSE_TYPE(21329, "Unsupported response type"),
    ACCESS_DENIED(21330, "Access denied"),
    TEMPORARILY_UNAVAILABLE(21331, "Temporarily unavailable"),
    REFRESH_TOKEN_ERROR(21332, "Refresh token (%s) error"),
    REFRESH_TOKEN_EXPIRED(21333, "Refresh token (%s) expired"),
    CODE_ERROR(21334, "Code (%s) error"),
    CODE_EXPIRED(21335, "Code (%s) expired"),
    TOKEN_ERROR(21336, "Token (%s) error"),
    SERVER_TOKEN_ERROR(21337, "Server token (%s) error"),
    SERVER_TOKEN_EXPIRED(21338, "Server token (%s) expired"),
    HTTP_CONNECTION_TO_REFUSED(21801, "Http connection to (%s) refused"),
    HTTP_RESPONSE_TIMEOUT(21802, "Http response from (%s) timeout"),
    HTTP_INVALID_RESPONSE(21803, "Http invalid response from (%s)"),
    HTTP_RESPONSE_BAD_STATUS_CODE(21804, "Http response bad status code (%s) from (%s)"),
    FILE_READ_ERROR(22001, "File read error (%s)"),
    FILE_TYPE_INCONFORMITY(22002, "File type nconformity"),
    FILE_CONTENT_ERROR(22003, "File content error, see doc for more info"),
    CREATE_CHANNEL_FAILED(23001, "Create channel failed"),
    CHANNEL_EXISTED_ERROR(23002, "Channel of (%s) already created"),
    USER_OF_SITE_NOT_CONNECTED(23003, "The site's user(%s) must be connected."),
    USER_HAS_CONTROLLED_ONE_SITE_CONNECTED(23004, "The user(%s) has controlled one site connected to vpn server."),
    VPN_SERVERS_NODE_UNAVAILABLE(23004, "vpn server node unavaliable"),
    DEVICE_APPOINT_MODEL_ERROR(24001, "Device appoint model error, see doc for more info"),
    MODEL_VARIABLE_FILE_FORMAT_ERROR(24002, "Model varivable file format error"),
    DEVICE_UPPER_LIMIT(25001, "Device upper limit,call admin for more info"),
    SIMI_UPPER_LIMIT(25002, "SIMI upper limit,call admin for more info"),
    DEVICE_KEY_ALREADY_EXISTS(25003, "Device key already exists"),
    DEVICE_KEY_DOES_NOT_EXIST(25004, "Device key does not exists"),
    DATABASE_CONNECTION_ERROR(30002, "Database connection error"),
    DATABASE_OPERATION_ERROR(30003, "Database operation error"),
    SCADA_ALREADY_EXISTS(30004, "Scada already exists in site(%s)"),
    DEVICE_IS_NOT_ONLINE(30005, "Device is not online(%s)"),
    SITE_WITHOUT_GATEWAY(30006, "Site(%s) does not has a gateway "),

    //Batch Add Device
    DEVICE_NAME_LENGTH_LIMIT(30007, "The length of the name (%s) exceeds the limit"),
    DEVICE_NAME_CHAR_LIMIT(30008, "The name (%s) contains illegal characters"),
    DEVICE_SERIALNUMBER_ERROR(30009, "The SerialNumber (%s) format error"),

    BATCH_MOBILE_FORMAT_ERROR(30010, "The mobileNum (%s) format error"),
    BATCH_IMSI_FORMAT_ERROR(30011, "The imsi (%s) format error"),

    // About Excel Check Error
    EXCEL_CELL_VALUE_EMPTY(31001, "You must provide the %s at line %s in Excel"),
    EXCEL_CELL_VALUE_SAME(31002, "The value (%s) is same on line (%s) in Excel"),
    EXCEL_ROWS_LIMIT(31003, "The Excel rows out of limit (%s)"),

    // Machine-->alias
 	ALIAS_ALREADY_EXISTS(32001, "The alias (%s) already exists in site(%s)"),
 	ALIAS_FORMAT_ERROR(32002, "The alias (%s) contain some special characters"),
 	ALIAS_MACHINE_DOES_NOT_EXIST(32003, "There is no machine in site (%s) that alias is (%s)"),
 	
 	//Model
 	DEVICE_NOT_NULL_IN_MODEL(32004, "The model (%s) can not be deleted, because it is non-zero number of devices below"),
    
    //XML validate error
 	MODEL_XML_FILE_FORMAT_ERROR(32005, "The model file format error"),
 	
 	//Token Error
 	API_KEY_NUMBER_LIMIT(40001, "Reach the upper limit of the number APIKeys"),
     
    
    //Rainbow Cloud
    WIFIUSER_ERROR_MAC(60001, "Mac address error or blacklist(%s)"),
    WIFIUSER_DOES_NOT_EXIST(60002,"Wifi User does not exist(%s)"),
    SMSCODE_ID_ERROR(60003,"SmsCodeId format error or empty(%s)"),
    SMSCODE_ERROR_EXPIRED(60004,"SmsCode expired(%s)"),
    SMSCODE_DOES_NOT_EXIST(60005,"SmsCode does not exist(%s)"),
    WIFIUSER_PASSWORD_ERROR(60006,"WifiUser's password or varificationCode error(%s)"),
    WIFIUSER_ERROR_BLACK(60007,"WifiUser's username blacklist(%s)"),
    WIFIUSER_ERROR_LOGIN_TERMINAL_LIMIT(60008,"One WifiUser can only login at 10 terminals."),
    WIFIUSER_ERROR_PHONE_NUMBER(60009,"Phone number error(%s)."),
    WIFIUSER_OAUTHCODE_ERROR(60010,"Oauth2 authorization code error or expired(%s)."),
    WIFIUSER_GROUP_NAME_REPEATED(60011,"Wifi User's group name repeated(%s)."),
    WIFIUSER_BLACKWHITE_NAME_REPEATED(60012,"Blacklist or Whitelist name repeated(%s)."),
    WIFIUSER_PARTY3_LOGIN_ERROR(60013,"Party 3rd username can not login by this way(%s)"),
    SMSCODE_IS_NOT_PHONE_RECIEVED(600014,"This phone number is not the authenticated one!(%s)"),
    WIFIUSER_SMS_FREQUENCY_ERROR(60250,"Sms frequency error by mac or phone(%s)."),
    WIFIUSER_PARTY3CODE_REPEATED_ERROR(60251,"Party 3rd code repeated(%s)."),
    
    WECHAT_DEVNAME_REPEAT_ERRROR(60252,"This devName(%s) had been bind!"),
    WECHAT_CONFIG_NOT_INITIAL(60253,"Current organization (%s) does'nt initialize wechat config !"),
    
    CONTENTSYNC_FILE_MOVING_EXCEPITON(60501,"content sync file moving exception(%s)!"),
    CONTENTSYNC_CREATE_FILE_ERROR(60502,"Create file error(%s)!"),
    CONTENTSYNC_FILE_TOO_LARGE(60503,"File is too large(%s)!"),
    CONTENTSYNC_UNZIP_FILE_ERROR(60504,"Unzip file error(%s)!"),
    CONTENTSYNC_ZIP_CHARACTER_ERROR(60505,"Cannot support chinese character in zip file(%s)!"),
    CONTENTSYNC_FILE_NOT_EXIST(60500,"content sync file does not exist(%s)!"),
    
	//SIMPackage
    SIMPACKAGE_DEFAULT_NULL(70001,"Default package is null！"),
    
//SMART Error code
    
    SMART_ASSERT_ALREADY_EXISTS(70002, "Resource number (%s) already exists"),
    SMART_ORDER_NO_NULL(70003, "Resource order number is null"),
    OAUTH_3DES_ERROR(70004,"3 des key (%s) is error"),
    OAUTH_3DES_FORMAT_ERROR(70005,"3 des source (%s) format error"),
    DEVICE_NOT_EXISIT(70006,"Device (%s) not exisit!"),
    DEVICE_SN_NOT_EXISIT(70007,"Device serialNumber (%s) not exisit!"),
    DEVICE_ASSETID_NOT_EXISIT(70008,"Device asset id (%s) not exisit!"),
    DEVICE_ACTION_NOT_EXISIT(70009,"Device action id (%s) not exisit!"),
    GOODS_NUMBER_ALREADY_EXISTS(70010,"Goods number (%s) already exists!"),
    MODEL_NAME_ALREADY_EXISTS(70011,"Model name (%s) already exists!"),
    MODEL_NUMBER_ALREADY_EXISTS(70012,"Model number (%s) already exists!"),
    MODEL_RELATE_AUTOMAT_NOT_NULL(70013,"Model related aumount is not null"),
    SMART_WECHAT_TRADE_NOT_EXISTT(70014,"Wechat Trade OrderNo (%s) is not exists"),
    SMART_FIND_BY_PARAM(70015,"Params (%s) is not null"),
    DEVICE_KEY_NOT_EXISIT(70016,"Device key (%s) not exisit!"),
    SMART_MODEL_NAME_EXISIT(70017,"Model name (%s) already exisit"),
    SMART_MODEL_NNUMBER_EXISIT(70018,"Model No. (%s) already exisit"),
    SMART_ORGANIZATION_EXISIT(70019,"Organization (%s) not exisit"),
    SMART_FACEBOOK_ACTIVITY_OUTOF_DATE(23012,"The redeem code is out of date."),
    SMART_FACEBOOK_CODE_ALREADY_USED(23013,"The redeem code was already used."),
    DEVICE_ID_NOT_EXISIT(70020,"Device id (%s) not exisit!"),
    SMART_DEVICE_GWID_NOT_NULL(70021,"Device gwId id (%s) not null!"),
    SMART_GOODS_NOT_EXISIT(70022,"Goods id (%s) not exisit!"),
    SMART_MODELVERSION_NAME_EXISIT(70023,"ModelVersion name (%s) already exisit"),
    SMART_CHANNELMODEL_NAME_EXISIT(70024,"ChannelModel name (%s) already exists!"),
    SMART_FACEBOOK_CODE_NO_SUCH_REDEEM_CODE(70025,"No such redeem code."),
    MODEL_NAME_NOT_EXISTS(70026,"Model name (%s) not exists!"),
    MODEL_VERSION_NOT_EXISTS(70027,"Model version (%s) not exists!"),
    MODEL_TEMPLATE_EXISTS(70028,"Model Template (%s) is exist!"),
    GOODS_TYPE_NAME_ALREADY_EXISTS(70029,"Goods Type name (%s) already exists!"),
    VERSION_DESC_ALREADY_EXISTS(70030,"Version Desc (%s) already exists!"),
    FILE_DATA_NOT_NULL(70031,"File Data not null!"),
    CLIENTID_IS_NOT_NULL(70032,"ClientId is not null!"),
    AREA_PAYCONFIG_ALREADY_EXISTS(70033,"Area Pay Config (%s) already exists!"),
    PLEASE_SET_WECHAT_CONFIG(70034,"Please set wechat!"),
    GOODS_ALREADY_USED(70035,"Goods (%s) is already used!"),
    SETTLE_ALREADY_EXISTS(70036,"Settle (%s) is already exists!"),
    AUTOMAT_GWID_NOT_EXISIT(70037,"Automat gwId (%s) not exisit!"),
    SET_RATE(70038,"Please set rate!"),
    SET_CORRECT_RATE(70039,"Please set correct rate!"),
    VENDER_NAME_ALREADY_EXISTS(70040,"vender name (%s) already exists!"),
    VENDER_NUMBER_ALREADY_EXISTS(70041,"vender number (%s) already exists!"),
    CONTRACT_NUMBER_ALREADY_EXISTS(70042,"contract number (%s) already exists!"),
    WAREHOUSE_NAME_ALREADY_EXISTS(70043,"warehouse name already exists!"),
    ORGNAME_NOT_CONNECTION_PLAT(70044,"The connection number overflow!");
    private int errorCode;
    private String error;

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    private ErrorCode(int errorCode, String error) {
        this.errorCode = errorCode;
        this.error = error;
    }

}
