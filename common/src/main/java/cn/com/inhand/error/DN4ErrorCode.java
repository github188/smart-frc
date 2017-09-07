package cn.com.inhand.error;

public class DN4ErrorCode {
    //系统级错误
    public static final int SYSTEM_ERROR = 10001;
    public static final String SYSTEM_ERROR_INFO = "System error";
    public static final int SERVICE_UNAVAILABLE = 10002;
    public static final String SERVICE_UNAVAILABLE_INFO = "Service unavailable";

    public static final int IP_LIMIT_ = 10004;
    public static final String IP_LIMIT_INFO = "IP limit";
    public static final int PERMISSTON_DENIED = 10005;
    public static final String PERMISSTON_DENIED_INFO = "Permission denied,need a high level appkey";
    public static final int PARAM_ERROR = 10008;
    public static final String PARAM_ERROR_INFO = "Param error,see doc for more info";
    public static final int TOO_MANY_PENDING_TASKS = 10009;
    public static final String TOO_MANY_PENDING_TASKS_INFO = "Too many pending tasks,system is busy";
    public static final int ILLEGAL_REQUEST = 10012;
    public static final String ILLEGAL_REQUEST_INFO = "Illegal request";
    public static final int INVALID_USER = 10013;
    public static final String INVALID_USER_INFO = "Invalid user";
    public static final int INSUFFICIENT_APP_PRIVILEGES = 10014;
    public static final String INSUFFICIENT_APP_PRIVILEGES_INFO = "Insufficient app privileges";
    public static final int MISS_REQUIRED_PARAMETER = 10016;
    public static final String MISS_REQUIRED_PARAMETER_INFO = "Miss requred parameter (%s),see doc for more info";
    public static final int PARAMETER_VALUE_INVALID = 10017;
    public static final String PARAMETER_VALUE_INVALID_INFO = "Parameter (%s)'s value invalid, see doc for more info";
    public static final int HTTP_BODY_FORMAT_ERROR = 10018;
    public static final String HTTP_BODY_FORMAT_ERROR_INFO = "HTTP body format error, see doc for more info";

    public static final int HTTP_METHOD_SUPORT_ERROR = 10021;
    public static final String HTTP_METHOD_SUPORT_ERROR_MESSAFE = "HTTP method is not suported for this request";
    public static final int IP_REQUESTS_OUT_OF_RATE_LIMIT = 10022;
    public static final String IP_REQUESTS_OUT_OF_RATE_LIMIT_INFO = "IP requests for (%s) out of rate limit";
    public static final int USER_RQUESTS_OUT_OF_RATE_LIMIT = 10024;
    public static final String USER_REQUESTS_OUT_OF_RATE_LIMIT_INFO = "User requests for (%s) out of rate limit";
    public static final int APP_RQUESTS_OUT_OF_RATE_LIMIT = 10025;
    public static final String APP_RQUESTS_REQUESTS_OUT_OF_RATE_LIMIT_INFO = "App requests for (%s) out of rate limit";
    public static final int ORGANIZATION__RQUESTS_OUT_OF_RATE_LIMIT = 10026;
    public static final String ORGANIZATION_REQUESTS_OUT_OF_RATE_LIMIT_INFO = "Organization requests out of rate limit";


    //服务级错误代码
    public static final int ORGANIZATION_DOES_NOT_EXIST = 20002;
    public static final String ORGANIZATION_DOES_NOT_EXIST_INFO = "Organization does not exist";
    public static final int USER_DOES_NOT_EXIST = 20003;
    public static final String USER_DOES_NOT_EXIST_INFO = "User does not exists";
    public static final int ROLE_DOES_NOT_EXIST = 20004;
    public static final String ROLE_DOES_NOT_EXIST_INFO = "Role does not exists";
    public static final int RESOURCE_DOES_NOT_ALLOWED = 20005;
    public static final String RESOURCE_DOES_NOT_ALLOWED_INFO = "Resource (%s) does not allowed";
    public static final int RESOURCE_DOES_NOT_EXIST = 20006;
    public static final String RESOURCE_DOES_NOT_EXIST_INFO = "Resource (%s) does not exist";
    public static final int RESOURCE_ALREADY_EXISTS = 20007;
    public static final String RESOURCE_ALREADY_EXISTS_INFO = "Resource (%s) already exists";
    public static final int ORGANIZATION_DOES_NOT_APPROVED = 20009;
    public static final String ORGANIZATION_DOES_NOT_APPROVED_INFO = "Organization does not approved";
    public static final int ORGANIZATION_APPROVES_FAILED = 20010;
    public static final String ORGANIZATION_APPROVES_FAILED_INFO = "Organization approves failed";
    public static final int ORGANIZATION_DOES_NOT_ACTIVATED = 20011;
    public static final String ORGANIZATION_DOES_NOT_ACTIVATED_INFO = "Organization does not approved";
    public static final int TEXT_TOO_LONG = 20012;
    public static final String TEXT_TOO_LONG_INFO = "Text too long";
    public static final int VARIFICATION_CODE_ERROR = 20013;
    public static final String VARIFICATION_CODE_ERROR_INFO = "Varification code error";
    public static final int OPERATION_OUT_OF_LIMIT = 20016;
    public static final String OPERATION_OUT_OF_LIMIT_INFO = "Operation out of limit";

    public static final int GATEWAY_ALREADY_EXISTS = 20020;
    public static final String GATEWAY_ALREADY_EXISTS_INFO = "Gateway already exists in site(%s)";

    public static final int AUTH_FAILED = 21301;
    public static final String AUTH_FAILED_INFO = "Auth failed";
    public static final int USERNAME_OR_PASSWORD_ERROR = 21302;
    public static final String USERNAME_OR_PASSWORD_ERROR_INFO = "Username or password error";
    public static final int USERNAME_ADD_PWD_AUTH_OUT_OF_RATE_LIMIT = 21303;
    public static final String USERNAME_ADD_PWD_AUTH_OUT_OF_RATE_LIMIT_INFO = "Username and pwd auth out of rate limit";
    public static final int USER_LOCKED = 21304;
    public static final String USER_LOCKED_INFO = "User locked, unlock left (%s)";
    public static final int USER_LOGIN_REQUIRED = 21305;
    public static final String USER_LOGIN_REQUIRED_INFO = "User login requried";
    public static final int CAPTCHA_CODE_ERROR = 21306;
    public static final String CAPTCHA_CODE_ERROR_INFO = "captcha code error";
    public static final int APP_KEY_DOES_NOT_EXIST = 21311;
    public static final String APP_KEY_DOES_NOT_EXIST_INFO = "App key does not exist";
    public static final int APPLICATIONS_OVER_THE_UNAUDITED_USE_RESTRICATIONS = 21321;
    public static final String APPLICATIONS_OVER_THE_UNAUDITED_USE_RESTRICATIONS_INFO = "Application over the unaudited use restrictions";

    //oAuth error
    public static final int REDIRECT_URI_MISMATCH = 21322;
    public static final String REDIRECT_URI_MISMATCH_INFO = "Redirect uri mismatch";

    public static final int INVALID_REQUEST = 21323;
    public static final String INVALID_REQUEST_INFO = "Invalid request";
    public static final int INVALID_CLIENT = 21324;
    public static final String INVALID_CLIENT_INFO = "Invalid client";
    public static final int INVALID_GRANT = 21325;
    public static final String INVALID_GRANT_INFO = "Invalid grant";
    public static final int UNAUTHORIZED_CLIENT = 21326;
    public static final String UNAUTHORIZED_CLIENT_INFO = "Unauthorized client";
    public static final int EXPIRED_TOKEN = 21327;
    public static final String EXPIRED_TOKEN_INFO = "Expired token";
    public static final int UNSUPPORTED_GRANT_TYPE = 21328;
    public static final String UNSUPPORTED_GRANT_TYPE_INFO = "Unsupported grant type";
    public static final int UNSUPPORTED_RESPONSE_TYPE = 21329;
    public static final String UNSUPPORTED_RESPONSE_TYPE_INFO = "Unsupported response type";
    public static final int ACCESS_DENIED = 21330;
    public static final String ACCESS_DENIED_INFO = "Access denied";
    public static final int TEMPORARILY_UNAVAILABLE = 21331;
    public static final String TEMPORARILY_UNAVAILABLE_INFO = "Temporarily unavailable";
    public static final int REFRESH_TOKEN_ERROR = 21332;
    public static final String REFRESH_TOKEN_ERROR_INFO = "Refresh token (%s) error";
    public static final int REFRESH_TOKEN_EXPIRED = 21333;
    public static final String REFRESH_TOKEN_EXPIRED_INFO = "Refresh token (%s) expired";
    public static final int CODE_ERROR = 21334;
    public static final String CODE_ERROR_INFO = "Code (%s) error";
    public static final int CODE_EXPIRED = 21335;
    public static final String CODE_EXPIRED_INFO = "Code (%s) expired";
    public static final int TOKEN_ERROR = 21336;
    public static final String TOKEN_ERROR_INFO = "Token (%s) error";
    public static final int SERVER_TOKEN_ERROR = 21337;
    public static final String SERVER_TOKEN_ERROR_INFO = "Server token (%s) error";
    public static final int SERVER_TOKEN_EXPIRED = 21338;
    public static final String SERVER_TOKEN_EXPIRED_INFO = "Server token (%s) expired";

    public static final int HTTP_CONNECTION_TO_REFUSED = 21801;
    public static final String HTTP_CONNECTION_TO_REFUSED_INFO = "Http connection to (%s) refused";
    public static final int HTTP_RESPONSE_TIMEOUT = 21802;
    public static final String HTTP_RESPONSE_TIMEOUT_INFO = "Http response from (%s) timeout";
    public static final int HTTP_INVALID_RESPONSE = 21803;
    public static final String HTTP_INVALID_RESPONSE_INFO = "Http invalid response from (%s)";
    public static final int HTTP_RESPONSE_BAD_STATUS_CODE = 21804;
    public static final String HTTP_RESPONSE_BAD_STATUS_CODE_INFO = "Http response bad status code (%s) from (%s)";

    public static final int FILE_READ_ERROR = 22001;
    public static final String FILE_READ_ERROR_INFO = "File read error (%s)";
    public static final int FILE_TYPE_INCONFORMITY = 22002;
    public static final String FILE_TYPE_INCONFORMITY_INFO = "File type nconformity";
    public static final int FILE_CONTENT_ERROR = 22003;
    public static final String FILE_CONTENT_ERROR_INFO = "File content error, see doc for more info";
    public static final int CREATE_CHANNEL_FAILED = 23001;
    public static final String CREATE_CHANNEL_FAILED_INFO = "Create channel failed";
    public static final int CHANNEL_EXISTED_ERROR = 23002;
    public static final String CHANNEL_EXISTED_ERROR_INFO = "Channel of (%s) already created";

    public static final int DEVICE_APPOINT_MODEL_ERROR = 24001;
    public static final String DEVICE_APPOINT_MODEL_ERROR_INFO = "Device appoint model error, see doc for more info";
    public static final int MODEL_VARIABLE_FILE_FORMAT_ERROR = 24002;
    public static final String MODEL_VARIABLE_FILE_FORMAT_ERROR_INFO = "Model varivable file format error";

    public static final int DEVICE_UPPER_LIMIT = 25001;
    public static final String DEVICE_UPPER_LIMIT_INFO = "Device upper limit,call admin for more info";

    public static final int DATABASE_CONNECTION_ERROR = 30002;
    public static final String DATABASE_CONNECTION_ERROR_INFO = "Database connection error";
    public static final int DATABASE_OPERATION_ERROR = 30003;
    public static final String DATABASE_OPERATION_ERROR_INFO = "Database operation error";

}
