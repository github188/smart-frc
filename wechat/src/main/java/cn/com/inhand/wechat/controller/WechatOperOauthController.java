/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.smart.model.AppInfo;
import cn.com.inhand.common.smart.model.User;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.wechat.dao.MemberDao;
import cn.com.inhand.wechat.dto.AccessToken;
import cn.com.inhand.wechat.handler.WechatOauthHandler;
import cn.com.inhand.wechat.util.JsonObject;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.logging.Level;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("wbapi/oper")
public class WechatOperOauthController {

    private static final Logger logger = LoggerFactory.getLogger(WechatOperOauthController.class);
    private String appid = "wxf0aed31cd2c95a0d";
    private String appSecret = "59a1202f4528018e46b83111414a644f";
    @Value("#{config.project.webUrl}")
    private String webUrl;
    @Value("#{config.project.oid}")
    private String oid;
    @Autowired
    RestTemplate template;
    @Autowired
    private MemberDao memberDao;
    @Autowired
    WechatOauthHandler handler;

    @RequestMapping(value = "/turn", method = RequestMethod.GET)
    public @ResponseBody
    void bindWechatOper(@RequestParam(value = "params", required = true) String params,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        OnlyResultDTO result = new OnlyResultDTO();

        String redirect_uri = "http://" + webUrl + "/wbapi/oper/wechatOauth?type=" + params;
        String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri="
                + URLEncoder.encode(redirect_uri, "gbk") + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        response.sendRedirect(url);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/wechat_code")
    public @ResponseBody
    void wechatBindOauth(
            @RequestParam("code") String code,
            @RequestParam("rfid") String rfid,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException, Exception {
        
        String openId = "";
        String oauthResult = handler.getWechatOauthAccessToken(code);
        if (oauthResult.indexOf("errcode") == -1) {
            AccessToken token = (AccessToken) JsonObject.unserializedJson(oauthResult, AccessToken.class);
            openId = token.getOpenid();
        }
        String token = handler.getWechatAccessToken();
        logger.info(token);
        
        if(!openId.equals("")){
            Member member = memberDao.findMemberByOpenId(new ObjectId(oid), openId);
            if(member != null){//已注册
                if (member.getStatus() == 0) {
                        response.sendRedirect("http://"+webUrl+"/FomulaG/bindcar.html?rfid="+rfid+"&openid="+openId);
                }else{
                    response.sendRedirect("http://" + webUrl + "/FomulaG/login.html?params=myInfo");
                }
                
            }else{
                response.sendRedirect("http://" + webUrl + "/FomulaG/register.html?token=" + token + "&openid=" + openId);
            }
                
        }else{
            response.sendRedirect("http://" + webUrl + "/FomulaG/login.html?params=myInfo");
        }

    }
    @RequestMapping(value = "/bind/{rfid}", method = RequestMethod.GET)
    public void getLoginInfo(
            @PathVariable String rfid,
            HttpServletRequest request, HttpServletResponse response) {

        String uri = handler.getWechatOauthCodeUrl(rfid);
        logger.info("redirecturi is {}", uri);
        try {
            response.sendRedirect(uri);
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(WechatOperOauthController.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    @RequestMapping(value = "/wechatOauth", method = RequestMethod.GET)
    public @ResponseBody
    void getWechatOauth(@RequestParam("code") String code,
            @RequestParam("type") String type,
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(value = "oid_user", required = false) ObjectId oId,
            @RequestParam(value = "uid", required = false) ObjectId uid,
            @RequestParam(value = "key", required = false) String key) throws Exception {
        logger.info("Wechat oper bind code is [" + code + "]");

        String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code";
        String wechatTokenJson = template.getForObject(url, String.class);
        logger.info("Wechat oper bind oauth token is [" + wechatTokenJson + "]");
        JSONObject tokenObj = JSONObject.fromObject(wechatTokenJson);
        String token = tokenObj.getString("access_token");
        logger.info("Wechat oper bind oauth token is [" + token + "]");
        String openId = tokenObj.getString("openid");
        logger.info("Wechat oper bind oauth openId is [" + openId + "]");

        String redirectUrl = "";
        if (type.equals("register")) {
            redirectUrl = "http://" + webUrl + "/FomulaG/register.html?params=" + type + "&token=" + token + "&openid=" + openId;
        } else {
            Member member = memberDao.findMemberByOpenId(new ObjectId(oid), openId);
            if (member != null) {
                if (member.getStatus() == 0) {
                    if (type.equals("myInfo")) {
                        redirectUrl = "http://" + webUrl + "/FomulaG/home.html?openid=" + openId;
                    }else if(type.equals("carList")){
                        redirectUrl = "http://" + webUrl + "/FomulaG/carlist.html?openid=" + openId;
                    }
                }else{
                    redirectUrl = "http://" + webUrl + "/FomulaG/login.html?params=myInfo";
                }
            } else {
                redirectUrl = "http://" + webUrl + "/FomulaG/register.html?params=" + type + "&token=" + token + "&openid=" + openId;
            }
        }
        response.sendRedirect(redirectUrl);
    }
}
