/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.SiteDAO;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Site;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.common.util.UpdateUtils;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 *
 * @author fenghl
 */
@Service
public class SiteService extends MongoService implements SiteDAO{

    public void updateSite(ObjectId oId, Site site) {
        Assert.notNull(site.getOid());
        long timestamp = DateUtils.getUTC();
        site.setUpdateTime(timestamp);
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        Query query = BasicQuery.query(Criteria.where("_id").is(site.getId()));
        mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(site, "_id"),  Collections.SMART_SITE);
    }

    public Site getSiteById(ObjectId oId, String siteId) {
        Assert.notNull(oId);
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
          Query query = BasicQuery.query(Criteria.where("_id").is(siteId));
         return  mongoTemplate.findOne(query, Site.class,  Collections.SMART_SITE);
    }
    
}
