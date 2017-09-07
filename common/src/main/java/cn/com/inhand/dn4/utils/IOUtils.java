package cn.com.inhand.dn4.utils;

import java.io.IOException;
import java.io.InputStream;

public class IOUtils {
    public static String stream2String(InputStream in) {
        if (in != null) {
            try {
                byte[] b = new byte[1024];
                int size;
                StringBuffer sb = new StringBuffer();
                while ((size = in.read(b)) > 0) {
                    sb.append(new String(b, 0, size, "UTF-8"));
                }
                return sb.toString();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}
