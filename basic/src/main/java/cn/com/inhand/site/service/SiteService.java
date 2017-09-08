/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.site.service;

import cn.com.inhand.common.dto.SiteBean;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.site.dao.SiteDao;
import cn.com.inhand.smart.formulacar.model.Site;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class SiteService extends MongoService implements SiteDao{

    public void createSite(ObjectId oid, Site site) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(site, Collections.SMART_FM_SITE);
    }

    public void updateSite(ObjectId oid, Site site) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(site.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(site, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_SITE);
    }

    public List<Site> findSiteByParam(ObjectId oid, Map<String, Object> params, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        return mongoTemplate.find(query, Site.class, Collections.SMART_FM_SITE);
    }

    public void deleteSite(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_SITE);
    }

    public List<Site> findSiteByParam(ObjectId oid, SiteBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(queryBean.getName()!=null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        return mongoTemplate.find(query, Site.class, Collections.SMART_FM_SITE);
    }

    public Site findSiteById(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Site.class, Collections.SMART_FM_SITE);
    }

    public Long getCount(ObjectId oid, SiteBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if(queryBean.getName()!=null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        return template.count(query, Collections.SMART_FM_SITE);
    }

    public boolean isSiteNameExists(ObjectId xOId, String name) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        return mongoTemplate.exists(query, Collections.SMART_FM_SITE);
    }
}
