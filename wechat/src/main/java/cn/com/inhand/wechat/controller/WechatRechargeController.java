/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.pay.factory.AlipayFactory;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.PayTrade;
import cn.com.inhand.smart.formulacar.model.Rfid;
import cn.com.inhand.smart.formulacar.model.Special;
import cn.com.inhand.smart.formulacar.model.SpecialConfig;
import cn.com.inhand.wechat.dao.MemberDao;
import cn.com.inhand.wechat.dao.PayTradeDao;
import cn.com.inhand.wechat.dao.RfidDao;
import cn.com.inhand.wechat.dao.SpecialDao;
import cn.com.inhand.wechat.util.JsonUtil;
import cn.com.inhand.wechat.util.RequestHandler;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.request.AlipayTradePrecreateRequest;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.logging.Level;
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
    private AlipayFactory alipayFactory;
    @Autowired
    private SpecialDao specialDao;
    @Autowired
    private RestTemplate restTemplate;
    private String appid = "wxf0aed31cd2c95a0d";
    private String appSecret = "59a1202f4528018e46b83111414a644f";
    private String mch_id = "1243189202";
    private String clientSecret = "3zxmDW0dWethJquObwHO9wstpnTgJaOA";
    private final String ALIPAY_GATWAY_URL_V2 = "https://openapi.alipay.com/gateway.do";
    private final String appId = "2017101009226872";
    private final String privateKey = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAL3CCXWFCoOwXrulAD1pYNZRuJEUdZVU73El+1J+UUeSGC5URPDCk99xKypb3i7WdSNLf1WqSDJEjf/ckKFsAgVyL10zlR/hHFIx5N+un2Z0n9o9brw6EmOAKelHuW2ed4Wb1N1NwGY7QUZzHcn4vh02Ge4OYNkL6XZm+909HSRhAgMBAAECgYEAgLXtvpXoRNzL1RGdcQpaUeUKgPXUr971rtTpfNILhbVVy48DWB9TN/tGISxBL5ntyGv8Sfn/kIEppERSoftl/mmbRQ8eCtH/60FI/DWD/lwifYwVIQj8P7ol8njLPi5DB6eRUrua6LkO+PUK0yj8I2jgi26JFG2LBdnYFuSmcAECQQDv5LQUyh5aNay+OJFsroNqOYCddzJOGvMRdqM3mKlsK66l0idGat6lShD7wnUYYV2gKohAqjDbEuWD2TbOdsHhAkEAyn+aomrp2J2JI9SWF1LxuZ1smNzCXS3Q+OGJe9x4ytqUfoIJ1Rtrp8Yetng+6zpEgyfZrYHAEb5IwgWmXVeygQJBAKVTqsABI7Xr8+cMuTx7cNoOUxMyiJrHe+j3KDkynuCLoktpb+PZ1yN2zgmT1Hs+7vVpGonmQNFaTo71bg4QTkECQA4kZUdMkjJXpjlDYowUdd9RuEDgwg5B4eNP1Qs6dZEtPMutB0TD2nvoIUL7GOHSuvAx+0jb0+8pS+mI/XptYoECQQDfjIcOEQ/L3FPRH2VesogkoLH3kXHrJfzLIGO+S8VHfeUH8CKaHwjKlQh6+lJXKlLLeF3MwzFfaHYUY2ExxCf/";
    private final String alipayPublicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB";

    @RequestMapping(value = "/rfidInfo", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "rfid", required = true) String rfid,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, String> result = new HashMap<String, String>();
        result.put("result", "FAIL");
        Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
        if (rfiddb != null) {
            result.put("result", "SUCCESS");
            result.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
            result.put("amount", rfiddb.getCount() + "");
        }
        return result;
    }

    @RequestMapping(value = "/recharge", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "rfid", required = true) String rfid,
            @RequestParam(value = "payStyle", required = true) String payStyle,
            @RequestParam(value = "price", required = true) String price,
            @RequestParam(value = "count", required = true) String count,
            @RequestParam(value = "siteNum", required = false) String siteNum,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, String> result = new HashMap<String, String>();
        result.put("result", "FAIL");
        Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
        if (rfiddb != null) {
            String orderNo = System.currentTimeMillis() + getRandomString(8);
            PayTrade trade = new PayTrade();
            trade.setOrderNo(orderNo);
            trade.setPrice2(Integer.parseInt(price));
            trade.setOid(new ObjectId(oid));
            trade.setPayStatus(1);
            trade.setRfid(rfid);
            trade.setCreateTime(DateUtils.getUTC());

            Special special = specialDao.findSpecialByTime(new ObjectId(oid), DateUtils.getUTC());
            if (special != null) {
                List<SpecialConfig> specialConfig = special.getSpecialConfig();
                if (specialConfig != null) {
                    for (SpecialConfig sc : specialConfig) {
                        Integer sprice = sc.getMoney() * 100;
                        if (sprice == Integer.parseInt(price)) {
                            if (special.getType() == 1 && Integer.parseInt(price) > Integer.parseInt(sc.getDiscount())) { //1 打折
                                
                            } else if (special.getType() == 2 && Integer.parseInt(price) > Integer.parseInt(sc.getDiscount())) {  //立减
                                trade.setPrice(Integer.parseInt(price) - Integer.parseInt(sc.getDiscount()));
                            }else{
                                trade.setPrice(Integer.parseInt(price));
                            }
                            break;
                        }
                    }
                }
            } else {
                trade.setPrice(Integer.parseInt(price));
            }
            if (payStyle.equals("2")) {   //微信支付
                trade.setPayStyle("2");
                tradeDao.saveTrade(new ObjectId(oid), trade);
                result = WechatPay(trade, request, response, price, new ObjectId(oid), rfid, count);
            } else if (payStyle.equals("3")) {  //支付宝
                trade.setPayStyle("3");
                tradeDao.saveTrade(new ObjectId(oid), trade);
                result = alipayPay(trade, price, new ObjectId(oid), rfid, count);
            }
        }
        return result;
    }

    public Map alipayPay(PayTrade trade, String price, ObjectId oid, String rfid, String count) {
        Map<String, String> result = new HashMap<String, String>();
        result.put("result", "FAIL");

        String notifyUrl = Constant.PAYMENT_HTTP + webUrl + "/wbapi/wechat/alipayBack/" + "/" + rfid + "/" + trade.getOrderNo() + "/" + count;
        StringBuilder body = new StringBuilder();
        body.append("{\"out_trade_no\":\"" + trade.getOrderNo() + "\",");
        body.append("\"total_amount\":\"" + Float.parseFloat(trade.getPrice() + "") / 100 + "\",");
        body.append("\"terminal_id\":\"1000001\",");
        body.append("\"subject\":\"充值\",");
        body.append("\"goods_detail\":[{\"goods_name\":\"充值\",\"goods_category\":\"110000001\",\"price\":\"" + Float.parseFloat(trade.getPrice() + "") / 100 + "\"}]}");

        AlipayClient alipayClient = alipayFactory.getAlipayClient(ALIPAY_GATWAY_URL_V2, appId, privateKey, Constant.SIGN_INPUT_CHARSET_GBK, alipayPublicKey);

        AlipayTradePrecreateRequest request = new AlipayTradePrecreateRequest();
        request.setNotifyUrl(notifyUrl);
        request.setBizContent(body.toString());

        AlipayTradePrecreateResponse response = null;
        try {
            response = alipayClient.execute(request);
            if (null != response && response.isSuccess()) {
                result.put("result", "SUCCESS");
                result.put("qr_code", response.getQrCode());
                result.put("orderNo", trade.getOrderNo());
            }
        } catch (AlipayApiException ex) {
            java.util.logging.Logger.getLogger(AlipayFactory.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    public Map WechatPay(PayTrade trade, HttpServletRequest request, HttpServletResponse response, String price, ObjectId oid, String rfid, String count) throws Exception {
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
        String notify_url = Constant.PAYMENT_HTTP + webUrl + "/wbapi/wechat/payBack/" + rfid + "/" + count;
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

    @RequestMapping(value = "/alipayBack/{rfid}/{orderNo}/{count}", method = RequestMethod.POST)
    public void wechatPayBack(@PathVariable String rfid, @PathVariable String orderNo, @PathVariable String count,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        response.getWriter().println("success");
        Map<String, String> params = getAliPayBackParameter(request.getParameterMap());

        String trade_no = params.get("trade_no");
        //交易创建时间
        String gmt_create = params.get("gmt_create");
        //交易付款时间
        String gmt_payment = params.get("gmt_payment");
        String trade_status = params.get("trade_status");

        if (trade_status != null && trade_status.equals(Constant.ALIPAY_TRADE_PAY_STATUS_SUCCESS) && gmt_payment != null) {
            PayTrade trade = tradeDao.getTradeByOrderNo(new ObjectId(oid), orderNo);
            if (trade != null) {
                trade.setPayStatus(0);
                trade.setTransaction_id(trade_no);
                trade.setUpdateTime(DateUtils.getUTC());
                tradeDao.updateTrade(new ObjectId(oid), trade);

                Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
                if (rfiddb != null && rfiddb.getOpenid() != null) {
                    Member member = memberDao.findMemberByOpenId(new ObjectId(oid), rfiddb.getOpenid());
                    if (member != null) {
                        member.setMoney(member.getMoney() + Integer.parseInt(count));
                        memberDao.updateMember(new ObjectId(oid), member);
                    }
                }
                if (rfiddb != null) {
                    rfiddb.setCount(rfiddb.getCount() + Integer.parseInt(count));
                    rfidDao.updateRfidCount(new ObjectId(oid), rfiddb);
                }
            }
        }
    }

    @RequestMapping(value = "/payBack/{rfid}/{count}", method = RequestMethod.POST)
    public void wechatPayBack(@PathVariable String rfid, @PathVariable String count,
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
            if (trade != null) {
                trade.setPayStatus(0);
                trade.setTransaction_id(transaction_id);
                trade.setUpdateTime(DateUtils.getUTC());
                tradeDao.updateTrade(new ObjectId(oid), trade);

                Rfid rfiddb = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
                if (rfiddb != null && rfiddb.getOpenid() != null) {
                    Member member = memberDao.findMemberByOpenId(new ObjectId(oid), openid);
                    if (member != null) {
                        member.setMoney(member.getMoney() + Integer.parseInt(count));
                        memberDao.updateMember(new ObjectId(oid), member);
                    }
                }
                if (rfiddb != null) {
                    rfiddb.setCount(rfiddb.getCount() + Integer.parseInt(count));
                    rfidDao.updateRfidCount(new ObjectId(oid), rfiddb);
                }
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

    public Map<String, String> getAliPayBackParameter(Map requestParams) {
        Map<String, String> params = new HashMap<String, String>();
        for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i]
                        : valueStr + values[i] + ",";
            }
            params.put(name, valueStr);
        }
        return params;
    }
}