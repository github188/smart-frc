/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.handler;

import cn.com.inhand.common.constant.Constant;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author liqiang
 */
@Component
public class WechatOauthHandler {
    private final static org.slf4j.Logger logger = LoggerFactory.getLogger(WechatOauthHandler.class);
    @Value("#{config.project.webUrl}")
    private String webUrl;
    @Autowired
    RestTemplate template;
   // private static String CREATE_QR_CODE_URI="https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=";
    public String getWechatOauthCodeUrl(String rfid){
        
        String url = "";
        String redirect_uri = "http://"+webUrl+"/wapi/opera/wechat_code?rfid="+rfid;
         try {
            url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+Constant.WECHAT_SUBSCRIPTION_APPID
                           +"&redirect_uri="
                           + URLEncoder.encode(redirect_uri, "gbk") + "&response_type=code&scope=snsapi_base#wechat_redirect";
        
        
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(WechatOauthHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return url;
    }
    public String getWechatOauthAccessToken(String code) {
        String appid = Constant.WECHAT_SUBSCRIPTION_APPID;
        String appSecret = Constant.WECHAT_SUBSCRIPTION_SECRET;
        String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code";
        return template.getForObject(url, String.class);
    }
    
    public String getWechatAccessToken(){

        String appid = Constant.WECHAT_SUBSCRIPTION_APPID;
        String appSecret = Constant.WECHAT_SUBSCRIPTION_SECRET;
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appSecret;
        
        return getHttpString(url);
        //return template.getForObject(url, String.class);
    }
    
    public String getHttpString(String url){
        
        StringBuilder result = new StringBuilder();
        
        try {
            //StringBuilder buffer = new StringBuilder(); 
            URL httpUrl = new URL(url); 
            URLConnection connection = httpUrl.openConnection();   
            connection.connect();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                result.append(line);
            }
            bufferedReader.close();
            
        } catch (MalformedURLException ex) {
            Logger.getLogger(WechatOauthHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(WechatOauthHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result.toString();
        
    }
}
