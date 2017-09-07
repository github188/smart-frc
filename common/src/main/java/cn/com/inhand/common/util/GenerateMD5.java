package cn.com.inhand.common.util;

import org.apache.commons.codec.binary.Hex;

import java.security.MessageDigest;

/**
 * @author inhand
 */
public class GenerateMD5 {

    private static String[] hexDigits = new String[]{"0", "1", "2", "3", "4",
            "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"};
    public static String md5Key = "0UH0UlWSd9jIlfag4THRjNaglrtFrGqK";
    
    public static String createPassword(String inputStr) {
        return encodeByMD5(inputStr);
    }

    private static String encodeByMD5(String originstr) {
        if (originstr != null) {
            try {
                MessageDigest md = MessageDigest.getInstance("MD5");
                byte[] results = md.digest(originstr.getBytes());
	            return new String(Hex.encodeHex(results)).toUpperCase();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    private static String byteArrayToHexString(byte[] b) {
        StringBuilder resultsb = new StringBuilder();
        int i = 0;
        for (i = 0; i < b.length; i++) {
            resultsb.append(byteToHexString(b[i]));
        }
        return resultsb.toString();
    }

    private static String byteToHexString(byte b) {
        int n = b;
        if (n < 0) {
            n = 256 + n;
        }
        int d1 = n / 16;
        int d2 = n / 16;
        return hexDigits[d1] + hexDigits[d2];
    }

    public static void main(String[] args) {
        // TODO Auto-generated method stub
        String account = "1qaz2wsx3edc";
        String channelId = "5270a3c12cdcbab1ef4430d0";
        String now = String.valueOf(System.currentTimeMillis());

        System.out.print(GenerateMD5.createPassword(account));


    }

}
