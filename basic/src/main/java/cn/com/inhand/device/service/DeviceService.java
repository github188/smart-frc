/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.device.service;

import cn.com.inhand.common.dto.DeviceBean;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.device.dao.DeviceDao;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.Arrays;
import java.util.List;
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
public class DeviceService extends MongoService implements DeviceDao{

    public void createDevice(ObjectId oid, Device device) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(device, Collections.SMART_FM_DEVICE);
    }

    public void updateDevice(ObjectId oid, Device device) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(device.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(device, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_DEVICE);
    }

    public List<Device> findSiteByParam(ObjectId oid, DeviceBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if (queryBean.getDealerIds()!= null && queryBean.getDealerIds().size() > 0) {
            query.addCriteria(Criteria.where("dealerId").in(Arrays.asList(queryBean.getDealerIds())));
        }
        if (queryBean.getAreaIds()!= null && queryBean.getAreaIds().size() > 0) {
            query.addCriteria(Criteria.where("areaId").in(Arrays.asList(queryBean.getAreaIds())));
        }
        if(queryBean.getOnline() != null){
            query.addCriteria(Criteria.where("online").is(queryBean.getOnline()));
        }
        if(queryBean.getDeviceType() != null){
            query.addCriteria(Criteria.where("deviceType").is(queryBean.getDeviceType()));
        }
        if(queryBean.getSiteName() != null && !queryBean.getSiteName().endsWith("")){
            query.addCriteria(Criteria.where("siteName").regex(queryBean.getSiteName()));
        }
        if(queryBean.getName() != null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        return mongoTemplate.find(query, Device.class, Collections.SMART_FM_DEVICE);
    }

    public void deleteDevice(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_SITE);
    }

    public Long getCount(ObjectId oid, DeviceBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (queryBean.getDealerIds()!= null && queryBean.getDealerIds().size() > 0) {
            query.addCriteria(Criteria.where("dealerId").in(Arrays.asList(queryBean.getDealerIds())));
        }
        if (queryBean.getAreaIds()!= null && queryBean.getAreaIds().size() > 0) {
            query.addCriteria(Criteria.where("areaId").in(Arrays.asList(queryBean.getAreaIds())));
        }
        if(queryBean.getOnline() != null){
            query.addCriteria(Criteria.where("online").is(queryBean.getOnline()));
        }
        if(queryBean.getDeviceType() != null){
            query.addCriteria(Criteria.where("deviceType").is(queryBean.getDeviceType()));
        }
        if(queryBean.getSiteName() != null && !queryBean.getSiteName().endsWith("")){
            query.addCriteria(Criteria.where("siteName").regex(queryBean.getSiteName()));
        }
        if(queryBean.getName() != null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        return template.count(query, Collections.SMART_FM_DEVICE);
    }

    public Device findDeviceById(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Device.class, Collections.SMART_FM_DEVICE);
    }
    
}
