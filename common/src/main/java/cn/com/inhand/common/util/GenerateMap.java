/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.omg.CORBA.portable.ResponseHandler;

/**
 *
 * @author lenovo
 */
public class GenerateMap {

    public static Map xmlToMap(String xml) {
        InputStream in = null;
        try {
            in = new ByteArrayInputStream(xml.getBytes("UTF-8"));
            SAXBuilder builder = new SAXBuilder();
            Document document = builder.build(in);
            Element root = document.getRootElement();
            List<Element> list = root.getChildren();
            return iterateElement(list);
        }  catch (Exception ex) {
            //Logger.getLogger(ResponseHandler.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        } finally {
            try {
                in.close();
            } catch (IOException ex) {
                //Logger.getLogger(ResponseHandler.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public static Map iterateElement(List<Element> list) {
        Map map = new HashMap();
        for (Element e : list) {
            if (e.getParentElement().getName().equals("request") && e.getName().equals("param")) {
                if (e.getChildren().size() > 0) {
                    map.put(e.getName(), iterateElement(e.getChildren()));
                } else {
                    map.put(((Attribute) e.getAttributes().get(0)).getValue(), e.getValue());
                }
            } else {
                if (e.getChildren().size() > 0) {
                    map.put(e.getName(), iterateElement(e.getChildren()));
                } else {
                    map.put(e.getName(), e.getValue());
                }
            }
        }
        return map;
    }
    
    public static void main(String arg []){
        String xml = "<?xml version=\"1.0\" encoding=\"GBK\"?><alipay><is_success>T</is_success><request><param name=\"sign\">6660cc4f1ffc42b458076e022bd16fef</param><param name=\"_input_charset\">UTF-8</param><param name=\"sign_type\">MD5</param><param name=\"service\">alipay.acquire.query</param><param name=\"partner\">2088421210268000</param><param name=\"out_trade_no\">1002000311-1487404386-934871</param></request><response><alipay><buyer_logon_id>186****9439</buyer_logon_id><buyer_user_id>2088612446033067</buyer_user_id><extend_info_list><ExtendInfo><key>TERMINAL_ID</key><value>1002000311</value></ExtendInfo></extend_info_list><out_trade_no>1002000311-1487404386-934871</out_trade_no><partner>2088421210268000</partner><result_code>SUCCESS</result_code><total_fee>4.50</total_fee><trade_no>2017021821001004060222997015</trade_no><trade_status>WAIT_BUYER_PAY</trade_status></alipay></response><sign>39f716fc5094797e155d9ed34c43d61a</sign><sign_type>MD5</sign_type></alipay>";
        Map map = xmlToMap(xml);
        System.out.println(map.toString());
    }
}
