/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.util;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;

/**
 *
 * @author cttc
 */
public class Generate3DES {

    private static final String Algorithm = "DESede";
    public static final byte[] keyBytes = {0x11, 0x22, 0x4F, 0x58, (byte) 0x88, 0x10, 0x40, 0x38, 0x28, 0x25, 0x79, 0x51, (byte) 0xCB, (byte) 0xDD, 0x55, 0x66, 0x77, 0x29, 0x74, (byte) 0x98, 0x30, 0x40, 0x36, (byte) 0xE2};

    public static byte[] encryptMode(byte[] keybyte, byte[] src) throws Exception {
        //生成密钥
        SecretKey deskey = new SecretKeySpec(keybyte, Algorithm);
        //加密
        Cipher c1 = Cipher.getInstance(Algorithm);
        c1.init(Cipher.ENCRYPT_MODE, deskey);
        return c1.doFinal(src);
    }

    public static byte[] decryptMode(byte[] keybyte, byte[] src) throws Exception {
        SecretKey deskey = new SecretKeySpec(keybyte, Algorithm);
        Cipher c1 = Cipher.getInstance(Algorithm);
        c1.init(Cipher.DECRYPT_MODE, deskey);
        return c1.doFinal(src);
    }

    public static String bytesToHexString(byte[] src) {
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }
        return stringBuilder.toString();
    }

    /**
     * Convert hex string to byte[]
     *
     * @param hexString the hex string
     * @return byte[]
     */
    public static byte[] hexStringToBytes(String hexString) {
        int temp1;
        int i = hexString.length() / 2;
        byte[] bytes = new byte[i];
        for (int j = 0; j < i; j++) {
            temp1 = Integer.parseInt(hexString.substring(j * 2, j * 2 + 2), 16);
            bytes[j] = (byte) temp1;
        }
        return bytes;
    }

    public static void main(String[] org) {

//        String szSrc = "test_1234567;shixj;NCOX8989889;14302932291";
//        String szSrc = "55ada8400cf21447158d47ce;55ada8400cf21447158d47d0;14302932291";

//        String szSrc = "冯浩亮";
        
        String key = "asdfghjklzxcvbnmqwertyui";
        
        String szSrc = "abcd";
        
        System.out.println("加密前的字符串:" + szSrc);

        byte[] encoded = null;
        try {
            encoded = encryptMode(key.getBytes(), szSrc.getBytes());
        } catch (Exception ex) {
            Logger.getLogger(Generate3DES.class.getName()).log(Level.SEVERE, null, ex);
        }
        String enStr = bytesToHexString(encoded);
        System.out.println(enStr);
        String enStr1 = "beac245418d57276";
        
        byte[] enen = hexStringToBytes(enStr1.toUpperCase());


        byte[] srcBytes = null;
        try {
            srcBytes = decryptMode(key.getBytes(), enen);
        } catch (Exception ex) {
            Logger.getLogger(Generate3DES.class.getName()).log(Level.SEVERE, null, ex);
        }
        System.out.println("解密后的字符串:" + (new String(srcBytes)));

    }

    private static byte charToByte(char c) {
        return (byte) "0123456789abcdef".indexOf(c);
    }
}
