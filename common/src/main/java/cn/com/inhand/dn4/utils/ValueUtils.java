package cn.com.inhand.dn4.utils;

import java.text.DecimalFormat;

/**
 * @author franklin.li
 */
public class ValueUtils {
    private final static int sec = 60;
    private final static int hour = 60 * 60;
    private final static int day = 60 * 60 * 24;

    /**
     * 格式化小数
     *
     * @param value float
     * @param j     省略到小数点后j位(j为大于零的整数)
     * @return
     */
    public static String decimalFormat(float value, int j) {
        if (j >= 1) {
            String formatStr = "#.0";
            for (int i = 1; i < j; i++) {
                formatStr += "0";
            }
            DecimalFormat df = new DecimalFormat(formatStr);
            String format = df.format(value);
            if (value < 1) {
                format = "0" + format;
            }
            return format;
        } else {
            return String.valueOf((int) value);
        }

    }

    /**
     * 格式化小数
     *
     * @param value double
     * @param j     省略到小数点后j位(j为大于零的整数)
     * @return
     */
    public static String decimalFormat(double value, int j) {
        if (j >= 1) {
            String formatStr = "#.0";
            for (int i = 1; i < j; i++) {
                formatStr += "0";
            }
            DecimalFormat df = new DecimalFormat(formatStr);
            String format = df.format(value);
            if (value < 1) {
                format = "0" + format;
            }
            return format;
        } else {
            return String.valueOf((int) value);
        }
    }

    public static boolean isIntString(String str) {
        try {
            Integer.parseInt(str);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static String getIntervalDimension(int language, String dimension) {
        if (language == 2) {
            if (dimension.toLowerCase().equals("d")) {
                return "天";
            } else if (dimension.toLowerCase().equals("h")) {
                return "小时";
            } else if (dimension.toLowerCase().equals("m")) {
                return "分钟";
            } else if (dimension.toLowerCase().equals("s")) {
                return "秒";
            }
        } else {
            if (dimension.toLowerCase().equals("d")) {
                return "d";
            } else if (dimension.toLowerCase().equals("h")) {
                return "h";
            } else if (dimension.toLowerCase().equals("m")) {
                return "m";
            } else if (dimension.toLowerCase().equals("s")) {
                return "s";
            }
        }
        return null;
    }

    public static String formatInterval(int language, long seconds) {
        String resultStr = "";
        if (seconds < 60) {
            resultStr = seconds + getIntervalDimension(language, "s");
        } else if (seconds >= 60 && seconds < 3600) {
            long remainM = seconds % (60 * 60) / 60;
            resultStr += remainM + getIntervalDimension(language, "m");
            resultStr += seconds % 60 + getIntervalDimension(language, "s");
        } else if (seconds >= 3600 && seconds < 3600 * 24) {
            long remainH = seconds / (60 * 60);
            resultStr += remainH + getIntervalDimension(language, "h");
            long modH = seconds % (60 * 60);
            long remainM = 0;
            if (modH >= 60) {
                remainM = modH / 60;
            }
            resultStr += remainM + getIntervalDimension(language, "m");
            long modM = modH % 60;
            resultStr += modM + getIntervalDimension(language, "s");
        } else {
            long remainD = seconds / (60 * 60 * 24);
            resultStr += remainD + getIntervalDimension(language, "d");
            long modD = seconds % (60 * 60 * 24);
            long remainH = 0;
            if (modD >= 60 * 60) {
                remainH = modD / (60 * 60);
            }
            resultStr += remainH + getIntervalDimension(language, "h");
            long modM = modD % (60 * 60);
            long remainM = 0;
            if (modM >= 60) {
                remainM = modM / 60;
            }
            resultStr += remainM + getIntervalDimension(language, "m");
            long modS = modM % 60;
            resultStr += modS + getIntervalDimension(language, "s");
        }
        return resultStr;
    }
}
