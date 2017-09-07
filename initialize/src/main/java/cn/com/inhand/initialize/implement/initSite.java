/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.implement;

import cn.com.inhand.common.smart.model.Location;
import cn.com.inhand.common.smart.model.Site;
import cn.com.inhand.initialize.dao.LineDAO;
import cn.com.inhand.initialize.dao.SiteDAO;
import cn.com.inhand.initialize.inteface.initializeInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author liqiang
 */
@Component
public class initSite implements initializeInterface {

    private static Logger logger = LoggerFactory.getLogger(initSite.class);
    @Autowired
    private SiteDAO siteService;
    @Autowired
    ObjectMapper mapper;

    public void statistic(Map<String, Object> paramMap) {
        
    }
    
    public void initDefaultSite(ObjectId oid,String lineid,String lineName,Long createTime){
        logger.debug("Organization initialize site message ....");
        Site site = new Site();
        site.setOid(oid);
        site.setLineId(lineid);
        site.setLineName(lineName);
        site.setSiteId("00000000");
        site.setName("默认");
        site.setAddress("北京市");
        Location location = new Location();
        location.setLatitude(Float.valueOf("39.929986"));
        location.setLongitude(Float.valueOf("116.395645"));
        location.setRegion("");
        site.setLocation(location);
        site.setCreateTime(createTime);
        
        siteService.addSite(oid, site);
        
    }
    
}
