/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.implement;

import cn.com.inhand.common.smart.model.GoodsType;
import cn.com.inhand.initialize.dao.GoodsTypeDAO;
import cn.com.inhand.initialize.dto.GoodsTypeBean;
import cn.com.inhand.initialize.inteface.initializeInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Document;

/**
 *
 * @author shixj
 */
@Component
public class initGoodType implements initializeInterface {

    private static Logger logger = LoggerFactory.getLogger(initGoodType.class);
    @Autowired
    private GoodsTypeDAO typeService;
    @Autowired
    ObjectMapper mapper;

    public void statistic(Map<String, Object> paramMap) {
        ObjectId oid = (ObjectId) paramMap.get("oid");
        Element element = null;
        
        InputStream stream = this.getClass().getClassLoader().getResourceAsStream("goodsType.xml");
        
//        File f = new File("/usr/local/apache-tomcat-7.0.57/webapps/goodsType.xml");
        
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
                if ("goodsTypes".equals(node1.getNodeName())) {
                    // 获得<goodsTypes>下的节点
                    NodeList nodeDetail = node1.getChildNodes();
                    // 遍历<Accounts>下的节点
                    for (int j = 0; j < nodeDetail.getLength(); j++) {
                        // 获得<Accounts>元素每一个节点
                        Node detail = nodeDetail.item(j);
                        if ("type".equals(detail.getNodeName())) {
                            logger.debug("type is" + detail.getTextContent());
                            GoodsTypeBean typeBean = new GoodsTypeBean();
                            typeBean.setName(detail.getTextContent());
                            GoodsType goods = mapper.convertValue(typeBean, GoodsType.class);
                            goods.setOid(oid);
                            typeService.addGoodsType(oid, goods);
                        }

                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
