package cn.com.inhand.wechat.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TenpayUtil {

    public static String getCharacterEncoding(HttpServletRequest request,
            HttpServletResponse response) {

        if (null == request || null == response) {

            return "gbk";

        }

        String enc = request.getCharacterEncoding();

        if (null == enc || "".equals(enc)) {

            enc = response.getCharacterEncoding();

        }

        if (null == enc || "".equals(enc)) {

            enc = "gbk";

        }

        return enc;

    }
}
