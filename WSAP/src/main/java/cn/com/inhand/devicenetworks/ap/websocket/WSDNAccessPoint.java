/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.websocket;

import cn.com.inhand.devicenetworks.ap.mq.rabbitmq.DeliveringResultProducer;
import cn.com.inhand.devicenetworks.ap.websocket.packet.DNMessage;
import cn.com.inhand.devicenetworks.ap.websocket.processor.DNMsgProcessorInterface;
import cn.com.inhand.devicenetworks.ap.websocket.packet.Parameter;
import cn.com.inhand.devicenetworks.ap.websocket.processor.WSv1Processor;

import cn.com.inhand.common.dto.Error;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.PacketException;
import cn.com.inhand.devicenetworks.ap.websocket.packet.LoginResultPacket;

import cn.com.inhand.devicenetworks.ap.entity.api.LoginExtRsp;
import cn.com.inhand.devicenetworks.ap.mq.rabbitmq.SessionStatusProducer;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 *
 * @author han
 */
public class WSDNAccessPoint extends TextWebSocketHandler {

    //@Autowired
    RestTemplate restTemplate;
    private final static Logger logger = Logger.getLogger("WSDANAccessPoint[v1.1.0]");

    public RestTemplate getRestTemplate() {
        return restTemplate;
    }

    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ObjectMapper getMapper() {
        return mapper;
    }

    public void setMapper(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public DNMsgProcessorInterface getParser() {
        return parser;
    }

    public void setParser(DNMsgProcessorInterface parser) {
        this.parser = parser;
    }

    public ConnectionInfo getCinfo() {
        return cinfo;
    }

    public void setCinfo(ConnectionInfo cinfo) {
        this.cinfo = cinfo;
    }

    public DeliveringResultProducer getProducer() {
        return producer;
    }

    public void setProducer(DeliveringResultProducer producer) {
        this.producer = producer;
    }

    public String getServer_addr() {
        return server_addr;
    }

    public void setServer_addr(String server_addr) {
        this.server_addr = server_addr;
    }
    //@Autowired
    ObjectMapper mapper;
    //private WebSocketSession session = null;
    private DNMsgProcessorInterface parser = null;
    private ConnectionInfo cinfo = null;
    private DeliveringResultProducer producer = null;
    private SessionStatusProducer statusProducer = null;
    private String server_addr = "";

    /**
     * 初始化
     */
    public WSDNAccessPoint(ConnectionInfo info, DNMsgProcessorInterface parser, DeliveringResultProducer producer, SessionStatusProducer prdc, String host) {
        super();
        this.cinfo = info;
        Config.info = info;
        this.parser = parser;
        this.producer = producer;
        this.statusProducer = prdc;
        this.server_addr = host;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //----此处应该补充call 在线状态的api上报 该设备的websocket断开
        WSDNSession wsdnsn = this.cinfo.getWsdnsn_map().remove(session.toString());
        try {
            if (wsdnsn != null) {
                logger.info("WebSocket session close id is [" + session.toString() + "] and assetid is [" + wsdnsn.getAssets() + "] ");
                //System.out.println("WSAP Device Connection closed By deviceId  is " + wsdnsn.getGwId());
//                WebSocketSession cursession = wsdnsn.getSession();
                WebSocketSession cursession = this.cinfo.getWssn_map().get(wsdnsn.getGwId());
                if (cursession != null && cursession == session) {
                    logger.info("WebSocket closeed assets is [" + wsdnsn.getAssets() + "] oldSession is [" + session.toString() + "] newSession is [" + cursession.toString() + "]");
                    wsdnsn.setLast_msg(System.currentTimeMillis());
                    this.cinfo.getWssn_map().remove(wsdnsn.getGwId());
                    wsdnsn.setIsLogin(false);
                    wsdnsn.setSession(null);
                }

                int action = wsdnsn.getAction();
                /**
                 * status.getCode() 1000客戶端異常斷掉 1001服務端主動斷掉 ？ 超時
                 *
                 */
                int status_code = status.getCode();

                logger.info("WebSocket Session[" + wsdnsn.getAssets() + "]WSAP status code  " + status_code);

                if (status_code == 1000) {
                    if (action >= 3) {
                        this.updateStatus(action, wsdnsn, session.toString());
                    } else {
                        this.updateStatus(202, wsdnsn, session.toString());
                    }
                } else if (status_code == 1001) {
                    if (wsdnsn.getAction() >= 3) {
                        this.updateStatus(action, wsdnsn, session.toString());
                    } else {
                        this.updateStatus(202, wsdnsn, session.toString());
                    }
                } else if (status_code == 1006) {
                    this.updateStatus(201, wsdnsn, session.toString());
                } else {
                    this.updateStatus(202, wsdnsn, session.toString());
                }
            }
            super.afterConnectionClosed(session, status);
        } catch (Exception e) {
            super.afterConnectionClosed(session, status);
        }
        //从map中去掉该session  
        //this.cinfo.getWsdnsn_map().remove(session.toString());
    }

    /**
     * 关闭该websocket连接
     *
     * @param session
     */
    protected void close(WebSocketSession session) {

        try {
            session.close();
        } catch (IOException ex) {
            Logger.getLogger(WSDNAccessPoint.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    @Override
    protected void handleTextMessage(WebSocketSession session,
            TextMessage message) throws Exception {

        super.handleTextMessage(session, message);
        TextMessage returnMessage = new TextMessage(message.getPayload() + " received at server");
        //session.sendMessage(returnMessage);

        try {
            String string = message.getPayload();
            if (string == null || string.trim().equals("") || string.equals("undefined")) {
                System.out.println("Debug in WSDNAccessPoint.java [Ln:64] : WebSocketSession recv:null msg");
                return;
            }
            DNMessage msg = parser.unwrap(message.getPayload().getBytes());
            if (!msg.getName().equalsIgnoreCase("heartbeat")) {
                logger.info("Debug in WSDNAccessPoint.java Ln:199 : WebSocket message : " + msg.getName());
            }
            WSDNSession wsdnsn = this.cinfo.getWsdnsn(session.toString());

            if (wsdnsn == null) {
               if (msg.getName().equals("login_ext")) {
                    try {
                        this.onLoginExt(msg, session, wsdnsn);
                    } catch (PacketException pe) {
                        //登陆失败
                        logger.warning("Failed to Login_ext from "+ session.getRemoteAddress() + ":"+ pe.toString());
                        this.close(session);
                    }
                } else {
                    //第一个包不是login报文
                    logger.warning("Illegal connection from + " + session.getRemoteAddress() + ", the msg:"
                            + string);
                    this.close(session);
                }
            } else if (!wsdnsn.isIsLogin()) {
                if (msg.getName().equals("login_ext")) {
                    try {
                        this.onLoginExt(msg, session, wsdnsn);
                    } catch (PacketException pe) {
                        //登陆失败
                        logger.warning("Failed to Login_ext from "+ session.getRemoteAddress() + ":"+ pe.toString());
                        this.close(session);
                    }
                } else {
                    //第一个包不是login报文
                    logger.warning("Illegal connection from + " + session.getRemoteAddress() + ", the msg:"
                            + string);
                    this.close(session);
                }
            } else {
                //已经登录
                if (msg.getName().equalsIgnoreCase("heartbeat") && msg.getType() == 0) {
                    this.onHeartbeat(msg, session, wsdnsn);
                    //this.updateStatus(2, wsdnsn);
                } else if (msg.getName().equalsIgnoreCase("logout")) {//&& msg.getType() == 0) {
                    this.onLogout(msg, session, wsdnsn);
                    session.close();
                } else if (msg.getType() == 1) {
                    this.onAck(msg, session, wsdnsn);
                } else {
                    this.onUnkownMsg(msg, session, wsdnsn);
                    logger.warning("Unsupported msg from "+ session.getRemoteAddress() + ":" + msg.toString());
                }
            }

        } catch (PacketException ex) {
            Logger.getLogger(WSv1Processor.class.getName()).log(Level.SEVERE, "while handling a text message", ex);
        }
    }

    /**
     *
     * @param type 1:login,2:heatbeat,3:logout,others:undefined
     * @param wsdnsn ,Websocket DN会话
     * @return 执行结果
     */
    private int updateStatus(int action, WSDNSession wsdnsn, String sessionId) {
        Map map = new HashMap();
        String id = wsdnsn.getGwId();
        String key = wsdnsn.getKey();
        String token = wsdnsn.getToken();
        if (id == null || key == null) {
            return 23007;
        }
        map.put("key", key);
        map.put("action", action);

        map.put("host", wsdnsn.getHost());
        map.put("port", wsdnsn.getPort());
        map.put("sid", sessionId);

        String result = null;
        try {
            result = restTemplate.postForObject("http://" + server_addr + "/fmapi/device_login_ext" + "?access_token=" + token, map, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        map.clear();
        if (!result.contains("error_code")) {
            //认证成功
            //取_id,asset_id
            return 0;
        } else {
            try {
                Error error = mapper.readValue(result, Error.class);

                return error.getErrorCode();//.getErrorCode();
            } catch (Exception ex) {
                Logger.getLogger(WSDNAccessPoint.class.getName()).log(Level.SEVERE, null, ex);
                return -1;
            }
        }
    }

    private Map authExt(DNMessage loginExt) {
        Map rMap = new HashMap();
        Map map = new HashMap();
        String id = (String) loginExt.getParameter("gwId").getValue();
        String key = (String) loginExt.getParameter("key").getValue();
        String token = (String) loginExt.getParameter("access_token").getValue();

        //String oid = login.getParameter("oid").getValue();
        String host = (String) loginExt.getParameter("host").getValue();
        String port = (String) loginExt.getParameter("port").getValue();

        //host += ":" + login.getParameter("port").getValue();
        if (id == null || key == null || token == null) {
            // return 23007;
            rMap.put("result", "23007");
            rMap.put("reason", "invalid gwId, key or access_token");
            return rMap;
        }
        map.put("key", key);
        map.put("action", 1);
        map.put("host", host);
        map.put("port", Integer.parseInt(port));
        map.put("sid", (String) loginExt.getParameter("sid").getValue());

        String result = null;
        try {
            result = restTemplate.postForObject("http://" + server_addr + "/fmapi/device_login_ext?access_token=" + token, map, String.class);
            logger.info("Login ext reuslt Info " + result);
        } catch (Exception e) {
            logger.info("Auth error@" + server_addr);

            e.printStackTrace();
        }
        map.clear();
        if (!result.contains("error_code")) {
            try {
                //认证成功
                //取_id,asset_id
                //valueMap = (Map) rmap.get("result");
                // LoginResultPacket packet=mapper.readValue(result,LoginResultPacket.class);
                //Logger.getLogger(WSDNAccessPoint.class.getName()).info(result);
                OnlyResultDTO rd = mapper.readValue(result, OnlyResultDTO.class);

                LoginExtRsp rsp = mapper.convertValue(rd.getResult(), LoginExtRsp.class);
                rMap.put("result", "0");
                rMap.put("reason", "ok");
                rMap.put("parameter", rsp);
                return rMap;
            } catch (Exception ex) {
                Logger.getLogger(WSDNAccessPoint.class.getName()).log(Level.SEVERE, null, ex);
                rMap.put("result", "-1");
                rMap.put("reason", ex.getMessage());
                return rMap;
            }
        } else {
            try {
                Error error = mapper.readValue(result, Error.class);

                rMap.put("result", "" + error.getErrorCode());
                rMap.put("reason", error.getError());
                return rMap;
            } catch (Exception ex) {
                Logger.getLogger(WSDNAccessPoint.class.getName()).log(Level.SEVERE, null, ex);

                rMap.put("result", "-1");
                rMap.put("reason", ex.getMessage());
                return rMap;
            }
        }
    }

    private void onLoginExt(DNMessage loginExt, WebSocketSession session, WSDNSession wsdnsn) throws PacketException, IOException {

        //System.out.println("Debug at WSDNAccessPoint.java at 699 onLoginExt sessionId str is "+session.toString());

        if (loginExt.getName().equals("login_ext") && loginExt.getType() == 0) {
            loginExt.setParameter("host", session.getRemoteAddress().getHostString());
            loginExt.setParameter("port", "" + session.getRemoteAddress().getPort());
            loginExt.setParameter("sid", session.toString());

            Map map = authExt(loginExt);

            String result = (String) map.get("result");
            //调用登录API验证合法性
            if (result == null || !result.equals("0")) {
                List list = new ArrayList();
                list.add(new Parameter("result", "" + result));
                list.add(new Parameter("reason", ""));
                DNMessage ack = new DNMessage("login_ext", "response", loginExt.getTxid(), list);
                session.sendMessage(new TextMessage(new String(parser.wrap(ack))));
                list.clear();
                session.close();
                throw new PacketException("Failed to Login!");
            } else {
                DNMessage ack = new DNMessage("login_ext", "response", loginExt.getTxid(), map);
                session.sendMessage(new TextMessage(new String(parser.wrap(ack))));

                String gwid = (String) loginExt.getParameter("gwId").getValue();

                try {
                    WebSocketSession oldSession = this.cinfo.getWssn_map().remove(gwid);//this.cinfo.getWssn(wsdnsn.getGwId());

                    if (oldSession != null) {
//                        wsdnsn = this.cinfo.getWsdnsn(gwid);
                        if (oldSession.isOpen()) {
                            List list1 = new ArrayList();
                            list1.add(new Parameter("result", "23010"));
                            list1.add(new Parameter("reason", "A new session is established"));
                            DNMessage logout = new DNMessage("logout", "request", "MSG_FROM_SMARTVMS-1", list1);
                            oldSession.sendMessage(new TextMessage(new String(parser.wrap(logout))));
                            oldSession.close();
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                if (wsdnsn != null) {
                    wsdnsn.init(loginExt, session);
                } else {
                    wsdnsn = new WSDNSession(loginExt, session);
                }
                wsdnsn.setAction(1);
                LoginExtRsp rsp = (LoginExtRsp) map.get("parameter");
                if (rsp != null) {
                    wsdnsn.setAssets((rsp.getRegistered()).toString());
                }

                map.clear();
                //放入map中
                this.cinfo.putWsdnsn(session.toString(), wsdnsn);
                this.cinfo.putWssn(wsdnsn.getGwId(), session);

//                this.downloadCfgNoticeV2(wsdnsn);
            }

        } else {
            throw new PacketException("The Packet is not a login packet!");
        }
    }

    /**
     * 处理Inbox的心跳请求
     *
     * @param heartBeat
     */
    private void onHeartbeat(DNMessage heartbeat, WebSocketSession session, WSDNSession wsdnsn) throws IOException, PacketException {

        List list = new ArrayList();
        //list.add(new Parameter("result", "0"));
        //list.add(new Parameter("reason", "" + wsdnsn.getGwId() + "@" + wsdnsn.getLast_msg()));
        DNMessage ack = new DNMessage("heartbeat", "response", heartbeat.getTxid(), list);
        String pkt = new String(parser.wrap(ack));
        session.sendMessage(new TextMessage(pkt));
//        logger.info("Send Heartbeat ack to inbox:" + pkt);
        list.clear();
        wsdnsn.setSession(session);
        wsdnsn.setLast_msg(System.currentTimeMillis());
        wsdnsn.setAction(2);
        //准备改为从消息队列发心跳
        //this.updateStatus(2, wsdnsn,session.toString());
        
        //心跳补求丢失的连接
        try {
            if (this.cinfo.getWsdnsn_map().size() != this.cinfo.getWssn_map().size()) {
                if (this.cinfo.getWssn(wsdnsn.getGwId()) == null) {
                    logger.info("Hearbeat check device connection FAIL recover conn assetid is ["+wsdnsn.getAssets()+"] gwId is ["+wsdnsn.getGwId()+"]");
                    this.cinfo.putWssn(wsdnsn.getGwId(), session);
                }
            }

            heartbeat.setParameter("gwId", wsdnsn.getGwId());
            heartbeat.setParameter("deviceIds", wsdnsn.getAssets());
            heartbeat.setParameter("oid", wsdnsn.getOid());

            this.statusProducer.sendMessage(new String(parser.wrap(heartbeat)));
        } catch (PacketException ex) {
            Logger.getLogger(WSDNAccessPoint.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * 处理Inbox返回的ACK
     *
     * @param ack
     */
    private void onAck(DNMessage ack, WebSocketSession session, WSDNSession wsdnsn) {

        if (ack.getName().equalsIgnoreCase("deliver goods")) {
            try {
                this.producer.sendMessage(new String(parser.wrap(ack)));
            } catch (PacketException ex) {
                Logger.getLogger(WSDNAccessPoint.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        wsdnsn.setSession(session);
        wsdnsn.setLast_msg(System.currentTimeMillis());
        wsdnsn.setAction(2);
        //this.updateStatus(2, wsdnsn);
    }

    /**
     * 处理Inbox的logout请求
     *
     * @param logout
     */
    private void onLogout(DNMessage logout, WebSocketSession session, WSDNSession wsdnsn) throws IOException, PacketException {

        if (logout.getType() != 0) {
            //logout回应
            wsdnsn.setAction(3);
        } else {
            //logout 请求
            List list = new ArrayList();
            int result = 100;
            try {
                result = Integer.parseInt((String) logout.getParameter("action").getValue());
            } catch (Exception e) {
            }
            wsdnsn.setAction(result);

            list.add(new Parameter("result", "0"));
            list.add(new Parameter("reason", "" + wsdnsn.getGwId() + "@" + wsdnsn.getLast_msg()));
            DNMessage ack = new DNMessage("logout", "response", logout.getTxid(), list);

            session.sendMessage(new TextMessage(new String(parser.wrap(ack))));
            list.clear();
        }
//        wsdnsn.setSession(session);
//        wsdnsn.setLast_msg(System.currentTimeMillis());
//        //从map中去掉该session
//        this.cinfo.getWsdnsn_map().remove(session.toString());
//        this.cinfo.getWssn_map().remove(wsdnsn.getId());
//        wsdnsn.setIsLogin(false);
//        wsdnsn.setSession(null);
    }

    /**
     * 处理Inbox的logout请求
     *
     * @param logout
     */
    private void onUnkownMsg(DNMessage msg, WebSocketSession session, WSDNSession wsdnsn) throws IOException, PacketException {
        List list = new ArrayList();
        list.add(new Parameter("result", "23009"));
        list.add(new Parameter("reason", "" + wsdnsn.getGwId() + "@" + wsdnsn.getLast_msg()));
        DNMessage ack = new DNMessage(msg.getName(), "response", msg.getTxid(), list);
        session.sendMessage(new TextMessage(new String(parser.wrap(ack))));
        list.clear();
        wsdnsn.setSession(session);
        wsdnsn.setLast_msg(System.currentTimeMillis());
    }
}
