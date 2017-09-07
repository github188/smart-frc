/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.websocket;

import cn.com.inhand.devicenetworks.ap.entity.App;
import cn.com.inhand.devicenetworks.ap.entity.Plugin;
import cn.com.inhand.devicenetworks.ap.entity.api.LoginExtRsp;
import cn.com.inhand.devicenetworks.ap.websocket.packet.DNMessage;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.web.socket.WebSocketSession;

/**
 *
 * @author han
 */
public class WSDNSession {

    private Logger logger = Logger.getLogger(WSDNSession.class.getName() + "[" + this.gwId + "]");
    private String key = null;
    private String gwId = null;
//private String deviceId = null;
    //private String assetid = null;
    //private String sn = null;
    private String oid = null;
    //private String current_txid=null;
    private boolean isLogin = false;
    private long connection_time = 0l;

    private long last_msg = 0l;
    private String token = null;
    private WebSocketSession session = null;
    //状态类型。0:未登录;1：登录;2：维持心跳;101：升级固件（正常）退出;102：应用新配置（正常）退出; 103:维护（正常退出）; 201：超时断开; 202:设备端异常断开;其它：待定义
    private int action = 0;
    private String host = "";
    private int port = 0;

    //private List<Asset> assets = new ArrayList<Asset>();
    private String assets;
    private List<Plugin> plugins = new ArrayList<Plugin>();
    private List<App> apps = new ArrayList<App>();

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }
    /*
     public String getAssetid() {
     return assetid;
     }

     public void setAssetid(String assetid) {
     this.assetid = assetid;
     }

     public String getSn() {
     return sn;
     }

     public void setSn(String sn) {
     this.sn = sn;
     }
     */

    public boolean isIsLogin() {
        return isLogin;
    }

    public void setIsLogin(boolean isLogin) {
        this.isLogin = isLogin;
    }

    public long getConnection_time() {
        return connection_time;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public void setConnection_time(long connection_time) {
        this.connection_time = connection_time;
    }

    public long getLast_msg() {
        return last_msg;
    }

    public void setLast_msg(long last_msg) {
        this.last_msg = last_msg;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public void init(DNMessage login, WebSocketSession session) {
        this.key = (String) login.getParameter("key").getValue();

        this.token = (String) login.getParameter("access_token").getValue();
        this.last_msg = System.currentTimeMillis();
        this.connection_time = this.last_msg;
        this.isLogin = true;
        this.session = session;
        this.host = session.getRemoteAddress().getHostString();
        this.port = session.getRemoteAddress().getPort();
        if (login.getName().equals("login")) {

            this.gwId = (String) login.getParameter("deviceId").getValue();
            this.assets = (String) login.getParameter("asset_id").getValue();

            //this.sn = login.getParameter("sn").getValue();
        } else {

            try {

                this.gwId = (String) login.getParameter("gwId").getValue();
                this.oid = (String)login.getParameter("oid").getValue();
                ObjectMapper mapper = new ObjectMapper();
//                String assetsStr = (String)login.getParameter("assets").getValue();

//                if (assetsStr != null) {
//                    this.assets = mapper.readValue(assetsStr, new TypeReference<List<Asset>>() {
//                    });
//                }
                String pluginsStr = (String) login.getParameter("plugins").getValue();
                if (pluginsStr != null) {
                    this.plugins = mapper.readValue(pluginsStr, new TypeReference<List<Plugin>>() {
                    });

                }
                String appsStr = (String) login.getParameter("apps").getValue();
                if (appsStr != null) {
                    this.apps = mapper.readValue(appsStr, new TypeReference<List<App>>() {
                    });

                }
            } catch (IOException ex) {
                Logger.getLogger(WSDNSession.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        this.setLast_msg(this.last_msg);
    }

    public WSDNSession(DNMessage login, WebSocketSession session) {
        this.init(login, session);
    }

//    public void run(){
//        logger.log(Level.INFO, "is starting ...");
//        while(this.isRunning()){
//            //查询是否有消息下发
//            //----待实现
//            sleep(1000);
//        }
//        logger.log(Level.INFO, "is starting ...");
//    }
//    
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getGwId() {
        return gwId;
    }

    public void setGwId(String gwId) {
        this.gwId = gwId;
    }

    public String getAssets() {
        return assets;
    }

    public void setAssets(String assets) {
        this.assets = assets;
    }

    public List<Plugin> getPlugins() {
        return plugins;
    }

    public void setPlugins(List<Plugin> plugins) {
        this.plugins = plugins;
    }

    public List<App> getApps() {
        return apps;
    }

    public void setApps(List<App> apps) {
        this.apps = apps;
    }

    public String getOid() {
        return oid;
    }

    public void setOid(String oid) {
        this.oid = oid;
    }
    

    public static void main(String[] args) {
        try {
            /*       try {
             String json = "{\n"
             + "    \"name\": \"login_ext\",\n"
             + "    \"type\": \"request\",\n"
             + "    \"txid\": \"1\",\n"
             + "    \"params\": [\n"
             + "        {\"name\": \"access_token\",\"value\": \"f3e7af0971d23927f3998e1ca996f099\" },\n"
             + "        {\"name\": \"gwId\",\"value\": \"54cf39dd0cf2970d30466688\"},\n"
             + "        {\"name\": \"timestamp\",\"value\": \"1422869742\"},\n"
             + "        {\"name\": \"key\",\"value\": \"AABBCCDDEEFF231254252144123413414231213212312\"},\n"
             + "        {\"name\": \"oid\",\"value\": \"2323ei232323i2323isioqw23323\"},\n"
             //  + "        {\"name\":\"assets\",\"value\":[\n"
             //     + "            {\"assetId\":\"uuid1\",\"vender\":\"fushibingshan\",\"protocol\":1,\"type\":1,\"port\":\"ttys0\"},\n"
             //   + "            {\"assetId\":\"uuid2\",\"vender\":\"shandian\",\"protocol\":2,\"type\":2,\"port\":\"eth0\"}\n"
             //    + "          ]\n"
             //  + "        },\n"
             + "        {\"name\":\"plugins\",\"value\":[{\"model\":\"qr scanner\",\"protocol\":1001,\"type\":1002,\"port\":\"ttys0\"}]},\n"
             + "        {\"name\":\"apps\",\"value\":[\n"
             + "            {\"name\":\"firmware\",\"type\":8001,\"version\":\"v10.2.1\"},\n"
             + "            {\"name\":\"selling-ui\",\"type\":8002,\"version\":\"v2.0\"}\n"
             + "          ]\n"
             + "        }\n"
             + "   ]\n"
             + "}";
             DNMsgProcessorInterface parser = new WSv1Processor();
             DNMessage pkt = parser.unwrap(json.getBytes());
             WSDNSession s = new WSDNSession(pkt, null);
             System.out.println(s.assets);
             } catch (PacketException ex) {
             Logger.getLogger(WSDNSession.class.getName()).log(Level.SEVERE, null, ex);
             }
             */
            String json = "{\n"
                    + "     \"registered\": [\"5028cd0a966823e783b450d1\",\"5028cd0a966823e783b450d2\"],\n"
                    + "     \"unregistered\":[\"5028cd0a966823e783b450aa\"],   \n"
                    + "     \"gwId\":\"4528cd0a966823e783b450ff\"\n"
                    + "  }";
            ObjectMapper mapper = new ObjectMapper();
            LoginExtRsp rsp = mapper.readValue(json, LoginExtRsp.class);
            System.out.println(rsp.getRegistered());
        } catch (IOException ex) {
            Logger.getLogger(WSDNSession.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
}
