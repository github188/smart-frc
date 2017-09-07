package cn.com.inhand.common.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;

/**
 * User: Jerolin Date: 13-10-12
 */
public class HttpRequestUtils {

    public static String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0];
        }
        return ip;
    }

    public static String getMethod(String url) {
        HttpClient client = new HttpClient();
        HttpMethod method = new GetMethod(url);
        String result = null;
        try {
            client.executeMethod(method);
            result = method.getResponseBodyAsString();
            method.releaseConnection();
        } catch (IOException ex) {
            //java.util.logging.Logger.getLogger(GenerateHttpClient.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    public static String postMethod(String url, Map<String, String> param) {
        HttpClient client = new HttpClient();
        PostMethod post = new PostMethod(url);
        String result = null;
        if (param != null) {
            NameValuePair [] nvps1 = new NameValuePair[]{};
            List<NameValuePair> nvps = new ArrayList <NameValuePair>(); 
            Set<String> keySet = param.keySet();
            for (String key : keySet) {
                nvps.add(new NameValuePair(key, param.get(key)));
            }
            post.setRequestBody(nvps.toArray(nvps1));
        }
        try {
            client.executeMethod(post);
            result = post.getResponseBodyAsString();
        } catch (IOException ex) {
            Logger.getLogger(HttpRequestUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }
}
