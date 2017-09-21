package cn.com.inhand.wechat.util;

import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;

public class RequestHandler {

    private SortedMap parameters;
    private HttpServletRequest request;
    private HttpServletResponse response;

    public RequestHandler(HttpServletRequest request,
            HttpServletResponse response) {
        this.request = request;
        this.response = response;
        this.parameters = new TreeMap<String, String>();
    }

    public RequestHandler() {
        this.parameters = new TreeMap<String, String>();
    }

    /**
     * 获取参数值
     *
     * @param parameter 参数名称
     * @return String
     */
    public String getParameter(String parameter) {
        String s = (String) this.parameters.get(parameter);
        return (null == s) ? "" : s;
    }

    /**
     *
     * 设置参数值
     *
     * @param parameter 参数名称
     * @param parameterValue 参数值
     */
    public void setParameter(String parameter, String parameterValue) {
        String v = "";
        if (null != parameterValue) {
            v = parameterValue.trim();
        }
        this.parameters.put(parameter, v);
    }

    public String getRequestURL(String clientSecret)
            throws UnsupportedEncodingException {

        this.createSign(clientSecret);
        StringBuffer sb = new StringBuffer();
        sb.append("<xml>");
        String enc = TenpayUtil.getCharacterEncoding(this.request,
                this.response);
        Set es = this.parameters.entrySet();
        Iterator it = es.iterator();
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            String k = (String) entry.getKey();
            String v = (String) entry.getValue();
            if ("attach".equalsIgnoreCase(k) || "body".equalsIgnoreCase(k)
                    || "sign".equalsIgnoreCase(k)) {
                sb.append("<" + k + ">" + "<![CDATA[" + v + "]]></" + k + ">");
            } else {
                sb.append("<" + k + ">" + v + "</" + k + ">");
            }
        }
        sb.append("</xml>");
        return sb.toString();
    }

    public String createSign(String clientSecret) {
        StringBuffer sb = new StringBuffer();
        Set es = this.parameters.entrySet();
        Iterator it = es.iterator();
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            String k = (String) entry.getKey();
            String v = (String) entry.getValue();
            if (null != v && !"".equals(v) && !"sign".equals(k)
                    && !"key".equals(k)) {
                sb.append(k + "=" + v + "&");
            }
        }
        sb.append("key=" + clientSecret); // 自己的API密钥
        String enc = "UTF-8";
        String sign = MD5Util.MD5Encode(sb.toString(), enc).toUpperCase();
        sign = DigestUtils.md5Hex(sb.toString()).toUpperCase();
        this.setParameter("sign", sign);
        return sign;
    }
}
