/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.PayTrade;
import cn.com.inhand.smart.formulacar.model.Rfid;
import cn.com.inhand.wechat.dao.MemberDao;
import cn.com.inhand.wechat.dao.PayTradeDao;
import cn.com.inhand.wechat.dao.RfidDao;
import cn.com.inhand.wechat.util.JsonUtil;
import cn.com.inhand.wechat.util.RequestHandler;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
@RequestMapping("wbapi/wechat")
public class WechatRechargeController {

    private static final Logger logger = LoggerFactory.getLogger(WechatRechargeController.class);
    @Value("#{config.project.oid}")
    private String oid;
    @Value("#{config.project.webUrl}")
    private String webUrl;
    @Autowired
    RestTemplate template;
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private RfidDao rfidDao;
    @Autowired
    private PayTradeDao tradeDao;
    @Autowired
    private RestTemplate restTemplate;
    private String appid = "wxf0aed31cd2c95a0d";
    private String appSecret = "59a1202f4528018e46b83111414a644f";
    private String mch_id = "1243189202";
    private String clientSecret = "3zxmDW0dWethJquObwHO9wstpnTgJaOA";

    @RequestMapping(value = "/rfidInfo", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "rfid", required = true) String rfid,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, String> result = new HashMap<String, String>();
        result.put("result", "FAIL");
        Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
        if(rfiddb != null){
            result.put("result", "SUCCESS");
            result.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
            result.put("amount", rfiddb.getCount()+"");
        }
        return result;
    }
    
    
    @RequestMapping(value = "/recharge", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "rfid", required = true) String rfid,
            @RequestParam(value = "payStyle", required = true) String payStyle,
            @RequestParam(value = "price", required = true) String price,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, String> result = new HashMap<String, String>();
        result.put("result", "FAIL");
        Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
        if (rfiddb != null) {
            String orderNo = System.currentTimeMillis() + getRandomString(8);
            PayTrade trade = new PayTrade();
            trade.setOrderNo(orderNo);
            trade.setPrice(Integer.parseInt(price));
            trade.setOid(new ObjectId(oid));
            trade.setPayStatus(1);
            trade.setRfid(rfid);
            trade.setCreateTime(DateUtils.getUTC());
            if (payStyle.equals("2")) {   //微信支付
                trade.setPayStyle("2");
                tradeDao.saveTrade(new ObjectId(oid), trade);
                result = WechatPay(trade,request, response, price, new ObjectId(oid), rfid);
            } else if (payStyle.equals("3")) {  //支付宝
            }
        }
        return result;
    }

    public Map WechatPay(PayTrade trade,HttpServletRequest request, HttpServletResponse response, String price, ObjectId oid, String rfid) throws Exception {
        InetAddress addr = InetAddress.getLocalHost();
        String ip = addr.getHostAddress().toString();// 获得本机IP
        String nonce_str = getRandomString(7);
        String url = Constant.WECHAT_PRE_PAY_URL;
        RequestHandler reqHandler = new RequestHandler(request, response);
        reqHandler.setParameter("appid", appid);
        reqHandler.setParameter("mch_id", mch_id);
        reqHandler.setParameter("nonce_str", nonce_str);
        reqHandler.setParameter("body", "微信充值");
        reqHandler.setParameter("out_trade_no", trade.getOrderNo());
        reqHandler.setParameter("total_fee", price);
        reqHandler.setParameter("spbill_create_ip", ip);
        reqHandler.setParameter("attach", oid + "," + price);
        String notify_url = Constant.PAYMENT_HTTP + webUrl + "/wbapi/wechat/payBack/" + rfid;
        reqHandler.setParameter("notify_url", notify_url);
        reqHandler.setParameter("trade_type", Constant.WECHAT_TRADE_TYPE_NATIVE);
        reqHandler.setParameter("product_id", "10000001");
        String requestUrl = reqHandler.getRequestURL(clientSecret);

        OkHttpClient client = new OkHttpClient.Builder().build();
        RequestBody body = RequestBody.create(Constant.TEXT, requestUrl);
        Request okrequest = new Request.Builder().url(url).post(body).build();
        Response okresponse = client.newCall(okrequest).execute();
        String resultMessage = okresponse.body().string();

        String json = JsonUtil.xml2JSON(resultMessage);

        Map<String, String> result = new HashMap<String, String>();
        result.put("result", "FAIL");
        JSONObject preObj = JSONObject.fromObject(json);
        if (preObj.has("xml")) {
            JSONObject preXml = preObj.getJSONObject("xml");
            if (preXml.has("result_code") && preXml.has("return_code") && preXml.getString("result_code").equals("SUCCESS") && preXml.getString("return_code").equals("SUCCESS")) {
                String qrCode = preXml.getString("code_url");
                result.put("result", "SUCCESS");
                result.put("qr_code", qrCode);
                result.put("orderNo", trade.getOrderNo());
            } else {
                logger.info(json);
            }
        } else {
            logger.info(json);
        }
        return result;
    }

    @RequestMapping(value = "/payOauth/{rfid}", method = RequestMethod.GET)
    public void oauthWechatOper(@PathVariable String rfid,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        String redirect_uri = "http://" + webUrl + "/wbapi/wechat/wechatPayOauth/" + rfid;
        String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="
                + appid
                + "&redirect_uri="
                + URLEncoder.encode(redirect_uri, "gbk")
                + "&response_type=code&scope=snsapi_base#wechat_redirect";
        response.sendRedirect(url);
    }

    @RequestMapping(value = "/wechatPayOauth/{rfid}", method = RequestMethod.GET)
    public void wechatPayOauthOper(@PathVariable String rfid,
            @RequestParam(value = "code", required = true) String code,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="
                + appid + "&secret=" + appSecret + "&code=" + code
                + "&grant_type=authorization_code";
        String tokenResult = restTemplate.getForObject(url, String.class);
        JSONObject tokenObj = JSONObject.fromObject(tokenResult);
        String openid = tokenObj.getString("openid");
        logger.info("Wechat recharge user openId is {} ", openid);
        String redirectUrl = "http://" + webUrl + "/wechatPay/index.html?openid=" + openid + "&rfid=" + rfid + "&code=" + code;
        response.sendRedirect(redirectUrl);
    }

    @RequestMapping(value = "/prePayId", method = RequestMethod.GET)
    public @ResponseBody
    Object wechatPrePayId(@RequestParam(value = "rfid", required = true) String rfid,
            @RequestParam(value = "code", required = true) String code,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "price", required = true) String price,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String payBackUrl = "http://" + webUrl + "/wbapi/wechat/payBack/" + rfid;
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("content-type", "text/html;charset=UTF-8");
        String nonce_str = getRandomString(7);
        InetAddress addr = InetAddress.getLocalHost();
        String ip = addr.getHostAddress().toString();// 获得本机IP
        String url = "https://api.mch.weixin.qq.com/pay/unifiedorder";

        RequestHandler reqHandler = new RequestHandler(request, response);
        reqHandler.setParameter("appid", appid);
        reqHandler.setParameter("mch_id", mch_id); // 商户号
        reqHandler.setParameter("nonce_str", nonce_str); // 随机字符串
        reqHandler.setParameter("body", "充值"); // 商品描述
        reqHandler.setParameter("out_trade_no", (System.currentTimeMillis() + getRandomString(8)) + ""); // 商家订单号
        reqHandler.setParameter("total_fee", (Math.round(Float.parseFloat(price) * 100)) + ""); // 商品金额,以分为单位
        reqHandler.setParameter("spbill_create_ip", ip); // 用户的公网ip
        // IpAddressUtil.getIpAddr(request)
        reqHandler.setParameter("attach", oid + "," + code); // 用户的公网ip
        // IpAddressUtil.getIpAddr(request)
        // 下面的notify_url是用户支付成功后为微信调用的action
        reqHandler.setParameter("notify_url", payBackUrl);

        reqHandler.setParameter("trade_type", "JSAPI");
        // ------------需要进行用户授权获取用户openid-------------
        reqHandler.setParameter("openid", openId);
        String requestUrl = reqHandler.getRequestURL(clientSecret);
        // 发送预支付请求
        URL url1 = new URL(url);
        URLConnection con = url1.openConnection();
        con.setDoOutput(true);
        con.setRequestProperty("Pragma", "no-cache");
        con.setRequestProperty("Cache-Control", "no-cache");
        con.setRequestProperty("Content-Type", "text/plain; charset=utf-8");
        OutputStream out = con.getOutputStream();//new OutputStreamWriter(con.getOutputStream());
        out.write(requestUrl.getBytes("UTF-8"));
        out.flush();
        out.close();
        BufferedReader br = new BufferedReader(new InputStreamReader(
                con.getInputStream()));
        String line = "";
        String result = "";
        for (line = br.readLine(); line != null; line = br.readLine()) {
            result = result + line;
        }
        logger.info("Wechat recharge result " + result);
        String prePayJson = JsonUtil.xml2JSON(result);

        Map<String, String> prePayIdResult = new HashMap<String, String>();
        JSONObject preObj = JSONObject.fromObject(prePayJson);

        if (preObj.getJSONObject("xml").has("prepay_id")) {
            String prePayId = JSONObject.fromObject(prePayJson).getJSONObject("xml").getString("prepay_id");
            prePayIdResult.put("result", "SUCCESS");
            prePayIdResult.put("appId", appid);
            prePayIdResult.put("prePayId", prePayId);
            prePayIdResult.put("nonce_str", getRandomString(10));
        } else {
            prePayIdResult.put("result", "FAIL");
        }
        return prePayIdResult;
    }

    @RequestMapping(value = "/paySign", method = RequestMethod.GET)
    public @ResponseBody
    Object wechatPaySign(@RequestParam(value = "appId", required = true) String appId,
            @RequestParam(value = "timeStamp", required = true) String timeStamp,
            @RequestParam(value = "nonceStr", required = true) String nonceStr,
            @RequestParam(value = "packageName", required = true) String packageName,
            @RequestParam(value = "signType", required = true) String signType,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        RequestHandler requestHandler = new RequestHandler(request, response);
        requestHandler.setParameter("appId", appId);
        requestHandler.setParameter("timeStamp", timeStamp);
        requestHandler.setParameter("nonceStr", nonceStr);
        requestHandler.setParameter("package", packageName);
        requestHandler.setParameter("signType", signType);
        String sign = requestHandler.createSign(clientSecret);
        Map map = new HashMap();
        map.put("paySign", sign);
        return map;
    }

    @RequestMapping(value = "/payBack/{rfid}", method = RequestMethod.POST)
    public void wechatPayBack(@PathVariable String rfid,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        java.io.BufferedReader bis = new java.io.BufferedReader(new java.io.InputStreamReader(request.getInputStream()));
        String line = null;
        String result = "";
        while ((line = bis.readLine()) != null) {
            result += line + "\r\n";
        }

        String payBackResult = JsonUtil.xml2JSON(result);
        logger.info(payBackResult);
        JSONObject object = JSONObject.fromObject(payBackResult);
        if (object.getJSONObject("xml").has("result_code") && object.getJSONObject("xml").has("return_code") && object.getJSONObject("xml").getString("result_code").equals("SUCCESS") && object.getJSONObject("xml").getString("return_code").equals("SUCCESS")) {
            String out_trade_no = object.getJSONObject("xml").getString("out_trade_no");
            String endTime = object.getJSONObject("xml").getString("time_end");
            String transaction_id = object.getJSONObject("xml").getString("transaction_id");
            String attach = object.getJSONObject("xml").getString("attach");
            String openid = object.getJSONObject("xml").getString("openid");
            String total_fee = object.getJSONObject("xml").getString("total_fee");
            String[] arrachA = attach.split(",");
            String oid = arrachA[0];
            
            PayTrade trade = tradeDao.getTradeByOrderNo(new ObjectId(oid), out_trade_no);
            trade.setPayStatus(0);
            tradeDao.updateTrade(new ObjectId(oid), trade);
            
            Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
            if (rfiddb != null && rfiddb.getOpenid() != null) {
                Member member = memberDao.findMemberByOpenId(new ObjectId(oid), openid);
                if (member != null) {
                    member.setMoney(member.getMoney() + (Integer.parseInt(total_fee) / 100));
                    memberDao.updateMember(new ObjectId(oid), member);
                }
            }
            if (rfiddb != null) {
                rfiddb.setCount(rfiddb.getCount() + (Integer.parseInt(total_fee) / 100));
                rfidDao.updateRfidCount(new ObjectId(oid), rfiddb);
            }
        } else {
            System.out.println(result);
        }

        String returnMsg = "<xml> <return_code>SUCCESS</return_code></xml>";
        response.getWriter().write(returnMsg);

    }

    public String getRandomString(int length) {
        StringBuffer buffer = new StringBuffer(
                "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        StringBuffer sb = new StringBuffer();
        Random random = new Random();
        int range = buffer.length();
        for (int i = 0; i < length; i++) {
            sb.append(buffer.charAt(random.nextInt(range)));
        }
        return sb.toString();
    }
}