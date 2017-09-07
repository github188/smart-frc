/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.websocket.controller;

import cn.com.inhand.devicenetworks.ap.util.SignUtil;
import cn.com.inhand.devicenetworks.ap.websocket.Config;
import cn.com.inhand.devicenetworks.ap.websocket.WSDNSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 *
 * @author inhand
 */
@Controller
public class MonitorController {

    private Logger logger = Logger.getLogger(WSDNSession.class.getName());

    @RequestMapping(method = RequestMethod.GET, value = "/systeminfoes", headers = "Accept=application/json")
    public @ResponseBody
    SysInfoBean getSystemInfoes() {
        SysInfoBean infoes = new SysInfoBean();
        infoes.init();
        return infoes;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/closesession", headers = "Accept=application/json")
    public @ResponseBody
    Object closeSessionInfoes(@RequestParam(value = "gwId", required = true) String gwId) throws IOException {
        Map<String, String> result = new HashMap<String, String>();
        Iterator<WSDNSession> it = Config.info.getWsdnsn_map().values().iterator();
        WebSocketSession wssession = null;
        while (it.hasNext()) {
            AssetBean asset = new AssetBean();
            WSDNSession session = it.next();
            if (session.getGwId().equals(gwId)) {
                wssession = session.getSession();
                wssession.close();
                break;
            }
        }

        if (wssession != null) {
            result.put("result", "OK");
        } else {
            result.put("result", "not fine session");
        }
        return result;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/match", headers = "Accept=application/json")
    public @ResponseBody
    Object matchSessionInfoes() throws IOException {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, WebSocketSession> wssnMap = Config.info.getWssn_map();
        Iterator<WSDNSession> it = Config.info.getWsdnsn_map().values().iterator();
        List<Map<String, String>> wssnResult = new ArrayList<Map<String, String>>();
        while (it.hasNext()) {
            WSDNSession session = it.next();
            if (wssnMap.get(session.getGwId()) == null) {
                Map<String, String> matchMap = new HashMap<String, String>();
                matchMap.put("gwId", session.getGwId());
                matchMap.put("deviceId", session.getAssets());
                matchMap.put("host", session.getHost());
                matchMap.put("port", session.getPort() + "");
                wssnResult.add(matchMap);
            }
        }
        result.put("result", wssnResult);
        return result;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/reboot", headers = "Accept=application/json")
    @ResponseBody
    public Object matchReboot(@RequestParam(value = "gwId", required = false) String gwId) throws IOException, InterruptedException {
        RestTemplate restTemplate = new RestTemplate();
        Map result = new HashMap();
        Iterator it = Config.info.getWsdnsn_map().values().iterator();
        List wssnResult = new ArrayList();
        Map<String, String> paramMap = new HashMap<String, String>();
        while (it.hasNext()) {
            WSDNSession session = (WSDNSession) it.next();
            String localGwId = "";
            if (gwId == null) {
                localGwId = session.getGwId();
            }else{
                localGwId = gwId;
            }
            if (session.getGwId().equals(localGwId)) {
                logger.info("WSAP CMD  Reboot device id is " + session.getGwId()+ " oid is "+session.getOid() + "parmaGwID is "+gwId);
                
                String existResult = restTemplate.getForObject("http://nginx.networks.com/osapi/device/exist?oid="+session.getOid()+"&gwId="+session.getGwId(), String.class);
                logger.info("WSAP CMD Device exist request result is "+existResult);
                JSONObject obj = JSONObject.fromObject(existResult);
                if (obj.getString("cmd").equals("reboot")) {
                    paramMap.put("config", "");
                    paramMap.put("gwId", session.getGwId());
                    paramMap.put("action", "reboot");
                    paramMap.put("noticeUrl", "5990fe210cf274590d6a031d");
                    paramMap.put("encrypt", "2");
                    String txid = System.currentTimeMillis() + "";
                    String sign = SignUtil.sign(paramMap, "MD5", "0UH0UlWSd9jIlfag4THRjNaglrtFrGqK", "UTF-8", txid);
                    String common = "{\"name\":\"deviceManager\",\"txid\":\"" + txid + "\",\"type\":\"request\",\"sign\":\"" + sign + "\",\"params\":[{\"name\":\"config\",\"value\":\"\"},{\"name\":\"gwId\",\"value\":\"" + session.getGwId() + "\"},{\"name\":\"action\",\"value\":\"reboot\"},{\"name\":\"noticeUrl\",\"value\":\"5990fe210cf274590d6a031d\"},{\"name\":\"encrypt\",\"value\":\"2\"}]}";
                    logger.info("WSAP CMD Reboot cmd is " + common);
                    session.getSession().sendMessage(new TextMessage(common));
                    wssnResult.add(session.getGwId());
                }
            }
        }
        result.put("result", wssnResult);
        return result;
    }
}