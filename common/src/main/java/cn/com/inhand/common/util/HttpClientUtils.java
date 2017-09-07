/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.util;

import cn.com.inhand.common.constant.Constant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.LoggerFactory;

/**
 *
 * @author lenovo
 */
public class HttpClientUtils {
    private final static org.slf4j.Logger logger = LoggerFactory.getLogger(HttpClientUtils.class);

    public static List<NameValuePair> getNameValuePair(Map paramMap) {
        List<NameValuePair> paramList = new ArrayList<NameValuePair>();
        Iterator itertor = paramMap.keySet().iterator();
        while (itertor.hasNext()) {
            String key = itertor.next().toString();
            paramList.add(new BasicNameValuePair(key, paramMap.get(key).toString()));
        }
        return paramList;
    }

    public static String requestPost(List<NameValuePair> paramList, String api) {
        String result = "";
        try {
            HttpClient httpclient = new DefaultHttpClient();
            HttpPost httpPost = new HttpPost(Constant.INTEGRAL_HOST_URL + api);

            httpPost.setEntity(new UrlEncodedFormEntity(paramList, "UTF-8"));
            HttpResponse response = httpclient.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == 200) {
                result = EntityUtils.toString(response.getEntity());
            }
        } catch (Exception ex) {
            Logger.getLogger(HttpClientUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }
}
