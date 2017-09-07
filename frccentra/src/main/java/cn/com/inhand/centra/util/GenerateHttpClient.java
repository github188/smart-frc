/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.util;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;

/**
 *
 * @author lenovo
 */
public class GenerateHttpClient {
     public static String getMethod(String url) {
        HttpClient client = new HttpClient();
        HttpMethod method = new GetMethod(url);
        String result = null;
        try {
            client.executeMethod(method);
            result = method.getResponseBodyAsString();
            method.releaseConnection();
        } catch (IOException ex) {
            Logger.getLogger(GenerateHttpClient.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    public static String requestPostMethodByJson(String url, String body) {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(url);
        String result = "";
        if (body != null) {
            try {
                method.setRequestEntity(new StringRequestEntity(body, "application/json", null));
                method.addRequestHeader("Content-Type", "application/json");
                client.executeMethod(method);
                result = method.getResponseBodyAsString();
            } catch (Exception ex) {
                Logger.getLogger(GenerateHttpClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return result;
    }
    
    public static String requestPostMethodByFormData(String url,Map<String,String> parameter){
        NameValuePair[] nameValuePair = new NameValuePair[parameter.size()];
        int i = 0;
        for (Map.Entry<String, String> entry : parameter.entrySet()) {
            nameValuePair[i++] = new NameValuePair(entry.getKey(), entry.getValue());
        }
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(url);
        String result = "";
        if (nameValuePair != null) {
            try {
            	method.addParameters(nameValuePair);
                method.addRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
                client.executeMethod(method);
                result = method.getResponseBodyAsString();
            } catch (Exception ex) {
            }
        }
        return result;
    }
}
