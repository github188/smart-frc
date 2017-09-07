package cn.com.inhand.common.httpclient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SignUtil {

	public static String sign(Map<String, String> sArray, String signType,
			String key, String inputCharset) {
		Map<String, String> sPara = paraFilter(sArray);
		String prestr = createLinkString(sPara); // ����������Ԫ�أ����ա�����=����ֵ����ģʽ�á�&���ַ�ƴ�ӳ��ַ�
		String mysign = "";
		if (signType.equals("MD5")) {
			mysign = MD5.sign(prestr, key, inputCharset);
		}
		return mysign;
	}

	public static Map<String, String> paraFilter(Map<String, String> sArray) {
		Map<String, String> result = new HashMap<String, String>();
		if (sArray == null || sArray.size() <= 0) {
			return result;
		}
		for (String key : sArray.keySet()) {
			String value = sArray.get(key);
			if (value == null || value.equals("")
					|| key.equalsIgnoreCase("sign")
					|| key.equalsIgnoreCase("sign_type")) {
				continue;
			}
			result.put(key, value);
		}
		return result;
	}

	public static String createLinkString(Map<String, String> params) {
		List<String> keys = new ArrayList<String>(params.keySet());
		Collections.sort(keys);
		String prestr = "";
		for (int i = 0; i < keys.size(); i++) {
			String key = keys.get(i);
			String value = params.get(key);
			if (i == keys.size() - 1) {// ƴ��ʱ�����������һ��&�ַ�
				prestr = prestr + key + "=" + value;
			} else {
				prestr = prestr + key + "=" + value + "&";
			}
		}
		return prestr;
	}
	
	public static void main(String[] args) {
		String str = "clientId=2066080201&cursor=0&limit=20&nonce_str=859623";
		
		System.out.println(MD5.sign(str, "WnXEcqnCgUEGm4zVqYaVeLVGbIFRmvGJ", "UTF-8"));
		
	}
}
