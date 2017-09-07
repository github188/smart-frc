/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.implement;

import cn.com.inhand.common.smart.model.Model;
import cn.com.inhand.common.smart.model.ModelConfig;
import cn.com.inhand.common.smart.model.Shelf;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.initialize.dao.ModelDAO;
import cn.com.inhand.initialize.dto.ModelBean;
import cn.com.inhand.initialize.inteface.initializeInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author shixj
 */
@Component
public class initModel implements initializeInterface {

    @Autowired
    private ModelDAO modelService;
    @Autowired
    ObjectMapper mapper;

    public void statistic(Map<String, Object> paramMap) {
//        ObjectId oid = (ObjectId) paramMap.get("oid");
//        Element element = null;
//        
//        InputStream stream = this.getClass().getClassLoader().getResourceAsStream("model.xml");
////        File f = new File("/usr/local/apache-tomcat-7.0.57/webapps/model.xml");
//        DocumentBuilder db = null;
//        DocumentBuilderFactory dbf = null;
//        try {
//            // 返回documentBuilderFactory对象
//            dbf = DocumentBuilderFactory.newInstance();
//            // 返回db对象用documentBuilderFatory对象获得返回documentBuildr对象
//            db = dbf.newDocumentBuilder();
//            // 得到一个DOM并返回给document对象
//            Document dt = db.parse(stream);
//            // 得到一个elment根元素
//            element = dt.getDocumentElement();
//            // 获得根节点
//
//            // 获得根元素下的子节点
//            NodeList childNodes = element.getChildNodes();
//            // 遍历这些子节点
//            for (int i = 0; i < childNodes.getLength(); i++) {
//                // 获得每个对应位置i的结点
//                Node node1 = childNodes.item(i);
//                if ("models".equals(node1.getNodeName())) {
//                    // 获得<goodsTypes>下的节点
//                    NodeList nodeDetail = node1.getChildNodes();
//                    // 遍历<Accounts>下的节点
//                    for (int j = 0; j < nodeDetail.getLength(); j++) {
//                        // 获得<Accounts>元素每一个节点
//                        Node detail = nodeDetail.item(j);
//                        if ("model".equals(detail.getNodeName())) {
//                            NodeList nodeDetails = detail.getChildNodes();                           
//                            String name = "";
//                            String vender = "";
//                            Integer machineType = 0;
//                            ArrayList<Shelf> shelves = new ArrayList<Shelf>();
//                            ArrayList<ModelConfig> config = new ArrayList<ModelConfig>();
//                
//                            for (int k = 0; k < nodeDetails.getLength(); k++) {
//                                Node details = nodeDetails.item(k);
//                                if ("name".equals(details.getNodeName())) {
//                                    name = details.getTextContent();
//                                }
//                                if ("vender".equals(details.getNodeName())) {
//                                    vender = details.getTextContent();
//                                }
//                                if ("machineType".equals(details.getNodeName())) {
//                                    machineType = Integer.parseInt(details.getTextContent());
//                                }
//                                if ("shelves".equals(details.getNodeName())) {
//                                    NodeList shelfnodes = details.getChildNodes();
//                                    
//                                    for(int s = 0;s<shelfnodes.getLength();s++){
//                                        Node shelfdetails = shelfnodes.item(s);
//                                        Shelf shelf = new Shelf();
//                                        if("shelvesId".equals(shelfdetails.getNodeName())){
//                                            shelf.setShelvesId(shelfdetails.getTextContent());
//                                            shelves.add(shelf);
//                                        }
//                                    }                                   
//                                }
//                                if("config".equals(details.getNodeName())){
//                                    NodeList confignodes = details.getChildNodes(); 
//                                    for(int a = 0;a<confignodes.getLength();a++){
//                                         Node configdetails = confignodes.item(a);
//                                         if("channel".equals(configdetails.getNodeName())){
//                                             NodeList channelnodes = configdetails.getChildNodes();
//                                             ModelConfig channel = new ModelConfig();
//                                             for(int n=0;n<channelnodes.getLength();n++){
//                                                 Node channeldetails = channelnodes.item(n);                                               
//                                                 if("row".equals(channeldetails.getNodeName())){
//                                                     channel.setRow(channeldetails.getTextContent());
//                                                 }
//                                                 if("number".equals(channeldetails.getNodeName())){
//                                                     channel.setNumber(channeldetails.getTextContent());
//                                                 }
//                                                 
//                                             }
//                                            config.add(channel);                                          
//                                         }
//                                    }                                  
//                                }
//                            }
//                            long timestamp = DateUtils.getUTC();
//                            ModelBean bean = new ModelBean();
//                            bean.setName(name);
//                            bean.setVender(vender);
//                            bean.setMachineType(machineType);
//                            bean.setShelves(shelves);
//                            bean.setConfig(config);
//                            bean.setCreateTime(timestamp);
//                            bean.setUpdateTime(timestamp);
//
//                            Model model = mapper.convertValue(bean, Model.class);
//                            model.setOid(oid);
//                            modelService.addModel(oid, model);
//                        }
//                    }
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
    }
}
