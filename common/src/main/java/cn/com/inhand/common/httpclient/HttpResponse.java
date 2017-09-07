/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.httpclient;

import java.io.UnsupportedEncodingException;

import org.apache.commons.httpclient.Header;

public class HttpResponse {
	/**
	 * �����е�Header��Ϣ
	 */
	private Header[] responseHeaders;

	/**
	 * String���͵�result
	 */
	private String stringResult;

	/**
	 * btye���͵�result
	 */
	private byte[] byteResult;

	public Header[] getResponseHeaders() {
		return responseHeaders;
	}

	public void setResponseHeaders(Header[] responseHeaders) {
		this.responseHeaders = responseHeaders;
	}

	public byte[] getByteResult() {
		if (byteResult != null) {
			return byteResult;
		}
		if (stringResult != null) {
			return stringResult.getBytes();
		}
		return null;
	}

	public void setByteResult(byte[] byteResult) {
		this.byteResult = byteResult;
	}

	public String getStringResult() throws UnsupportedEncodingException {
		if (stringResult != null) {
			return stringResult;
		}
		if (byteResult != null) {
			return new String(byteResult, "UTF-8");
		}
		return null;
	}

	public void setStringResult(String stringResult) {
		this.stringResult = stringResult;
	}
}
