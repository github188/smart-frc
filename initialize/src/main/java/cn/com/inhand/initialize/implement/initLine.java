/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.implement;

import cn.com.inhand.common.smart.model.Line;
import cn.com.inhand.initialize.dao.LineDAO;
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
public class initLine implements initializeInterface {

    private static Logger logger = LoggerFactory.getLogger(initLine.class);
    @Autowired
    private LineDAO lineService;
    @Autowired
    ObjectMapper mapper;

    public void statistic(Map<String, Object> paramMap) {
        
    }
    
    public Line initDefaultLine(ObjectId oid,String areaid,String areaName,Long createTime){
        logger.debug("Organization initialize line message ....");
        Line line = new Line();
        line.setOid(oid);
        line.setAreaId(areaid);
        line.setAreaName(areaName);
        line.setName("默认");
        line.setCreateTime(createTime);
        lineService.addLine(oid, line);
        return line;
    }
    
}
