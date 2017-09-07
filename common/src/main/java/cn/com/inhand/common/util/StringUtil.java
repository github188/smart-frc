package cn.com.inhand.common.util;

import java.util.HashMap;
import java.util.Map;

public class StringUtil {

    /**
     * @desc check char whether in the string
     * @param str
     * @param cr
     * @return
     */
    public static boolean checkChar(String str, char cr) {
        boolean has_ = false;
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c == cr) {
                has_ = true;
                continue;
            }
        }
        return has_;
    }

    public static boolean checkStringByArray(String str, String[] array) {
        boolean has_ = false;
        for (int i = 0; i < array.length; i++) {
            if (str != null && str.equals(array[i])) {
                has_ = true;
            }
        }
        return has_;
    }

    public static Map<String, String> makeParameToMap(String parames) {
        Map<String, String> paramesMap = new HashMap<String, String>();
        String[] paramesA = parames.split("&");
        for (int i = 0; i < paramesA.length; i++) {
            paramesMap.put(paramesA[i].split("=")[0], paramesA[i].split("=")[1]);
        }
        return paramesMap;
    }

    /**
     * 字符转16进制
     *
     * @param s
     * @return
     */
    public static String toHexString(String s) {
        String str = "";
        for (int i = 0; i < s.length(); i++) {
            int ch = (int) s.charAt(i);
            String s4 = Integer.toHexString(ch);
            str = str + s4;
        }
        return str;
    }
    /**
     * 16进制转字符
     * @param s
     * @return 
     */
    public static String toStringHex(String s) {
        byte[] baKeyword = new byte[s.length() / 2];
        for (int i = 0; i < baKeyword.length; i++) {
            try {
                baKeyword[i] = (byte) (0xff & Integer.parseInt(
                        s.substring(i * 2, i * 2 + 2), 16));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        try {
            s = new String(baKeyword, "utf-8");// UTF-16le:Not
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        return s;
    }
}
