package cn.com.inhand.dn4.utils;


public class EnCodeUtils {
    /**
     * url中的参数编码转换
     *
     * @param src
     * @param srcEncode  (ISO-8859-1)
     * @param destEncode (UTF-8)
     * @return
     * @throws Exception
     */
    public static String encoder(String src, String srcEncode, String destEncode) throws Exception {
        String encodedString = null;
        if (src != null) {
            if (srcEncode == null) {
                srcEncode = "ISO-8859-1";
            }
            if (destEncode == null) {
                destEncode = "UTF-8";
            }
            encodedString = new String(src.getBytes(srcEncode), destEncode);
        }
        return encodedString;
    }
}
