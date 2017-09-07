package cn.com.inhand.dn4.utils;

public class LogUtils {
    public static String getLoglevel(int level, int language) {
        if (language == 2) {
            switch (level) {
                case 1:
                    return "编码信息";
                case 2:
                    return "调试信息";
                case 3:
                    return "运行信息";
                case 4:
                    return "警告信息";
                case 5:
                    return "错误信息";
                case 6:
                    return "致命信息";
            }
        } else {
            switch (level) {
                case 1:
                    return "trace";
                case 2:
                    return "debug";
                case 3:
                    return "info";
                case 4:
                    return "warning";
                case 5:
                    return "error";
                case 6:
                    return "fatal";
                default:
                    break;
            }
        }
        return null;
    }
}
