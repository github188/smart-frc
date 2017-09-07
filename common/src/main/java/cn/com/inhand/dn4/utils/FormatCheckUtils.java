package cn.com.inhand.dn4.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FormatCheckUtils {
    public static String regex4IP = "((0|[1-9]|[1-9][0-9]|(1[0-9][0-9]|(2[0-4][0-9]|25[0-5]))).){3}(0|[1-9]|[1-9][0-9]|(1[0-9][0-9]|(2[0-4][0-9]|25[0-5])))";
    public static String regex4MobileNum = "^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$";

    /**
     * 通用正则匹配
     *
     * @param regex   正则表达式
     * @param content
     * @return 匹配成功返回true
     */
    public static boolean regexFilter(String regex, String content) {
        if (content != null && regex != null) {
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(content);
            return matcher.matches();
        } else {
            return false;
        }
    }
}
