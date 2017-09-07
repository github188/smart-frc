/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.OrganizationsDAO;
import cn.com.inhand.common.model.Organization;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.OvdpDevice;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class OrganizationsService extends MongoService implements OrganizationsDAO{

    @Override
    public Organization getOrganizationByName(String name) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        return template.findOne(Query.query(Criteria.where("name").is(name)), Organization.class, Collections.ORGANIZATIONS);
        
    }

    @Override
    public Organization getOrganizationById(ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        return template.findOne(Query.query(Criteria.where("_id").is(id)), Organization.class, Collections.ORGANIZATIONS);
    }
    
}
