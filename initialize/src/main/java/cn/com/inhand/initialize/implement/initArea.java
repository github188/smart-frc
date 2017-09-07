/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.implement;

import cn.com.inhand.common.smart.model.Area;
import cn.com.inhand.initialize.dao.AreaDAO;
import cn.com.inhand.initialize.dto.AreaBean;
import cn.com.inhand.initialize.dto.AreaObj;
import cn.com.inhand.initialize.inteface.initializeInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class initArea implements initializeInterface {

    private static Logger logger = LoggerFactory.getLogger(initArea.class);
    @Autowired
    private AreaDAO areaService;
    @Autowired
    ObjectMapper mapper;

    public void statistic(Map<String, Object> paramMap) {
        ObjectId oid = (ObjectId) paramMap.get("oid");
        Element element = null;

//          ApplicationContext context=new FileSystemXmlApplicationContext("classpath:area.xml");
        
        InputStream stream = this.getClass().getClassLoader().getResourceAsStream("area.xml");
        
//        File f = new File("/usr/local/apache-tomcat-7.0.57/webapps/area.xml");

//          this.getClass().getClassLoader().getResourceAsStream(null)

        DocumentBuilder db = null;
        DocumentBuilderFactory dbf = null;

        try {
            // 返回documentBuilderFactory对象
            dbf = DocumentBuilderFactory.newInstance();
            // 返回db对象用documentBuilderFatory对象获得返回documentBuildr对象
            db = dbf.newDocumentBuilder();
            // 得到一个DOM并返回给document对象
            Document dt = db.parse(stream);
            // 得到一个elment根元素
            element = dt.getDocumentElement();
            // 获得根节点

            // 获得根元素下的子节点
            NodeList childNodes = element.getChildNodes();
            // 遍历这些子节点
            for (int i = 0; i < childNodes.getLength(); i++) {
                // 获得每个对应位置i的结点
                Node node1 = childNodes.item(i);
                if ("areas".equals(node1.getNodeName())) {
                    // 获得<goodsTypes>下的节点
                    NodeList nodeDetail = node1.getChildNodes();
                    // 遍历<Accounts>下的节点
                    for (int j = 0; j < nodeDetail.getLength(); j++) {
                        // 获得<Accounts>元素每一个节点
                        Node detail = nodeDetail.item(j);
                        if ("area".equals(detail.getNodeName())) {
                            NodeList nodeDetails = detail.getChildNodes();
                            String continentName = "";
                            String continent = "";            //洲
                            String country = "";              //国家
                            String countryName = "";
                            String city = "";                 //城市
                            String code = "";

                            List<Object> list = new ArrayList<Object>();
                            for (int k = 0; k < nodeDetails.getLength(); k++) {
                                Node details = nodeDetails.item(k);

                                if ("continent".equals(details.getNodeName())) {
                                    continent = details.getTextContent();
                                } else if ("continentName".equals(details.getNodeName())) {
                                    continentName = details.getTextContent();
                                } else if ("country".equals(details.getNodeName())) {
                                    country = details.getTextContent();
                                } else if ("countryName".equals(details.getNodeName())) {
                                    countryName = details.getTextContent();
                                } else if ("city".equals(details.getNodeName())) {
                                    city = details.getTextContent();
                                } else if ("code".equals(details.getNodeName())) {
                                    code = details.getTextContent();
                                } else if ("zones".equals(details.getNodeName())) {
                                    NodeList zoneNodes = details.getChildNodes();
                                    for (int m = 0; m < zoneNodes.getLength(); m++) {
                                        Node zonedetails = zoneNodes.item(m);
                                        if ("zone".equals(zonedetails.getNodeName())) {
                                            NodeList zone = zonedetails.getChildNodes();
                                            String zoneName = "";
                                            String zoneCode = "";
                                            for (int n = 0; n < zone.getLength(); n++) {
                                                Node zonedet = zone.item(n);
                                                if ("name".equals(zonedet.getNodeName())) {
                                                    zoneName = zonedet.getTextContent();
                                                }
                                                if ("code".equals(zonedet.getNodeName())) {
                                                    zoneCode = zonedet.getTextContent();
                                                }

                                            }
                                            AreaObj obj = new AreaObj();
                                            obj.setName(zoneName);
                                            obj.setCode(zoneCode);
                                            list.add(obj);
                                        }
                                    }
                                }
                            }
                            AreaBean bean = new AreaBean();
                            bean.setContinent(continent);
                            bean.setContinentName(continentName);
                            bean.setCountry(country);
                            bean.setCountryName(countryName);
                            bean.setCity(city);
                            bean.setCode(code);
                            bean.setZone(list);

                            Area area = mapper.convertValue(bean, Area.class);
                            area.setOid(oid);
                            areaService.addArea(oid, area);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    
    public Area initDefaultArea(ObjectId oid){
        logger.debug("Organization initialize area message ....");
        Area area = new Area();
        area.setName("默认");
        area.setOid(oid);
        area.setCreateTime(System.currentTimeMillis()/1000);
        areaService.addArea(oid, area);
        return area;
    }
}
