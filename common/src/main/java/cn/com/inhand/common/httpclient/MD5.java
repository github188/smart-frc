package cn.com.inhand.common.httpclient;

import java.io.UnsupportedEncodingException;
import java.security.SignatureException;

import org.apache.commons.codec.digest.DigestUtils;

public class MD5 {
	
	
	/**
     * ǩ���ַ�
     * @param text ��Ҫǩ����ַ�
     * @param key ��Կ
     * @param input_charset �����ʽ
     * @return ǩ����
     */
    public static String sign(String text, String key, String input_charset) {
    	text = text + key;
    	System.out.println(text);
        return DigestUtils.md5Hex(getContentBytes(text, input_charset));
    }
    
    /**
     * ǩ���ַ�
     * @param text ��Ҫǩ����ַ�
     * @param sign ǩ����
     * @param key ��Կ
     * @param input_charset �����ʽ
     * @return ǩ����
     */
    public static boolean verify(String text, String sign, String key, String input_charset) {
    	text = text + key;
    	String mysign = DigestUtils.md5Hex(getContentBytes(text, input_charset));
    	if(mysign.equals(sign)) {
    		return true;
    	}
    	else {
    		return false;
    	}
    }

    /**
     * @param content
     * @param charset
     * @return
     * @throws SignatureException
     * @throws UnsupportedEncodingException 
     */
    private static byte[] getContentBytes(String content, String charset) {
        if (charset == null || "".equals(charset)) {
            return content.getBytes();
        }
        try {
            return content.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("MD5ǩ�����г��ִ���,ָ���ı��뼯����,��Ŀǰָ���ı��뼯��:" + charset);
        }
    }
	
}
