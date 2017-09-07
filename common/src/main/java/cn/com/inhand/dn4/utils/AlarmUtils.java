package cn.com.inhand.dn4.utils;

public class AlarmUtils {
    public static String getAlarmType(int type, int language) {
        if (language == 2) {//汉语
            switch (type) {
                case 1001:
                    return "网关登录失败告警";
                case 1002:
                    return "网关异常退出告警";
                case 1003:
                    return "网关DT通道建立失败告警";
                case 1004:
                    return "网关DT连接异常中断告警";
                case 1005:
                    return "网关状态异常告警";
                case 1006:
                    return "网关配置同步异常告警";
                case 1007:
                    return "网关升级异常告警";
                case 1101:
                    return "设备数据超出正常范围告警";
                case 1201:
                    return "用户账户异常告警";
                case 1202:
                    return "机构费用告警";
                case 1203:
                    return "机构数据备份异常告警";
                case 1204:
                    return "机构服务授权告警";
                case 1205:
                    return "机构流量告警";
                case 2101:
                    return "系统数据库服务告警";
                case 2102:
                    return "系统模块异常退出告警";
                case 2103:
                    return "系统模块启动异常告警";
                case 2104:
                    return "系统主机服务器资源告警";
                case 2105:
                    return "系统安全告警";
                default:
                    break;
            }
        }
        return null;
    }

    public static String getAlarmLevel(int level, int language) {
        if (language == 2) {//汉语
            switch (level) {
                case 1:
                    return "提醒";
                case 2:
                    return "警告";
                case 3:
                    return "次要告警";
                case 4:
                    return "重要告警";
                case 5:
                    return "严重告警";
                default:
                    break;
            }
        }
        return null;
    }

    public static String getAlarmState(int state, int language) {
        if (language == 2) {
            switch (state) {
                case 0:
                    return "已确认";
                case 1:
                    return "未确认";
                case -1:
                    return "已清除";
                default:
                    break;
            }
        }
        return null;
    }

    public static String getAlarmRuleState(int state, int language) {
        if (language == 2) {
            switch (state) {
                case 0:
                    return "未激活";
                case 1:
                    return "已激活";
            }
        }
        return null;
    }
}
