/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Site;
import cn.com.inhand.initialize.dao.SiteDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author liqiang
 */
@Service
public class SiteService extends MongoService implements SiteDAO{
private static final String collection = Collections.SMART_SITE;
    public void addSite(ObjectId oid, Site site) {
        
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(site, collection);
    }
    
}
