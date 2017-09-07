package cn.com.inhand.dn4.utils;

import java.util.ArrayList;
import java.util.Random;

/**
 * @author franklin.li
 */
public class Utilities {
	private static final String randomString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static final String captchaString = "3456789ABCDEFGHJKMNPQRSTUVWXY";

	/**
	 * 数字和字母
	 *
	 * @param n
	 * @return
	 */
	public static String randomStr(int n) {
		Random ran = new Random();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < n; i++) {
			sb.append(randomString.charAt(ran.nextInt(randomString.length())));
		}
		return sb.toString();
	}

	/**
	 * 数字和字母 ，除去了0 1 2 i l z o
	 *
	 * @param n
	 * @return
	 */
	public static String captchaStr(int n) {
		Random ran = new Random();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < n; i++) {
			sb.append(captchaString.charAt(ran.nextInt(captchaString.length())));
		}
		return sb.toString();
	}

	/**
	 * 随机字母
	 *
	 * @param n
	 * @return
	 */
	public static String randomString(int n) {
		char[] ch = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
		StringBuffer sb = new StringBuffer();
		Random ran = new Random();
		if (n < 0) {
			return null;
		}
		for (int i = 0; i < n; i++) {
			sb.append(ch[ran.nextInt((i + 33)) % 26]);
		}
		return sb.toString();
	}

	public static String formatePercent(float n) {
		return String.valueOf(n * 100 + "%");
	}

	public static String formatePercent(double n) {
		return String.valueOf(n * 100 + "%");
	}

	/**
	 * 返回字符串数组对应的标记数组中为1的字符串数组
	 *
	 * @param strList 字符串数组
	 * @param intList 标记数字（只有0跟1）
	 * @return
	 */
	public static String[] compareList(String[] strList, int[] intList) {
		if (strList.length < intList.length) {
			return null;
		}
		int[] authedList = intList;
		String[] resultList = strList;
		int count = 0;

		ArrayList<String> list = new ArrayList<String>();
		for (int i = 0; i < resultList.length; i++) {
			if (i < authedList.length) {
				if (authedList[i] == 1) {
					count++;
					list.add(resultList[i]);
				}
			} else {
				count++;
				list.add(resultList[i]);
			}
		}

		String[] result = new String[count];
		for (int j = 0; j < count; j++) {
			result[j] = list.get(j);
		}
		return result;
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
	
	public static byte[] toByteArray(int iSource, int iArrayLen) {
		byte[] bLocalArr = new byte[iArrayLen];
		for (int i = 0; (i < 4) && (i < iArrayLen); i++) {
			bLocalArr[i] = (byte) (iSource >> 8 * i & 0xFF);
		}
		return bLocalArr;
	}
	
	public static byte[] hexStringToBytes(String hexString) {
		if (hexString == null || hexString.equals("")) {
			return null;
		}
		hexString = hexString.toUpperCase();
		int length = hexString.length() / 2;
		char[] hexChars = hexString.toCharArray();
		byte[] d = new byte[length];
		for (int i = 0; i < length; i++) {
			int pos = i * 2;
			d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
		}
		return d;
	}

	private static byte charToByte(char c) {
		return (byte) "0123456789ABCDEF".indexOf(c);
	}
}
