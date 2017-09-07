package cn.com.inhand.common.util;

/**
 * @author franklin.li
 */
public class TrafficUtils {
    /**
     * 格式化流量
     *
     * @param traffic
     * @return
     */
    public static String formatTraffic(long traffic) {
        double result = 0f;
        String resultStr = null;
        if (traffic / 1073741824 >= 1) {//G
            result = traffic / 1073741824f;
            resultStr = ValueUtils.decimalFormat(result, 3) + "GB";
        } else if (traffic / 1048576 >= 1) {//M
            result = traffic / 1048576f;
            resultStr = ValueUtils.decimalFormat(result, 3) + "MB";
        } else if (traffic / 1024 >= 1) {//K
            result = traffic / 1024f;
            resultStr = ValueUtils.decimalFormat(result, 3) + "KB";
        } else {
            result = traffic;
            resultStr = ValueUtils.decimalFormat(result, 0) + "B";
        }
        return resultStr;
    }
}
