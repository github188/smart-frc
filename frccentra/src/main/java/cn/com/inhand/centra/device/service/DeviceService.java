/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.handle.MongoServerThreadHandler;
import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.Device;
import com.mongodb.WriteResult;
import java.util.List;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 *
 * @author fenghl
 */
@Service
public class DeviceService extends MongoService implements DeviceDAO{
    
    private static final Logger logger = LoggerFactory.getLogger(DeviceService.class);
    
    @Autowired
    private MongoServerThreadHandler threadHandler;
        
    
    //泥巴车接口
    public List<Device> findDeviceListBySn(ObjectId oid, String sn) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("sn").is(sn));
        return mongoTemplate.find(query, Device.class, Collections.SMART_FM_DEVICE);
    }

    public void createDevice(ObjectId oid, Device device) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        device.setCreateTime(DateUtils.getUTC());
        mongoTemplate.save(device, Collections.SMART_FM_DEVICE);
    }

    public Device getDeviceById(ObjectId oId, ObjectId id) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        query.fields();
        return mongoTemplate.findOne(query, Device.class, Collections.SMART_FM_DEVICE);
    }

    public void updateDevice(ObjectId oId, Device device, String business) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        //Query query = BasicQuery.query(Criteria.where("_id").is(automat.getId()));
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(device.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(device, "_id");
        mongoTemplate.updateFirst(query, update, Collections.SMART_FM_DEVICE);
    }
    
    
    
    public void updateAutomat(ObjectId oId, Automat automat,String business) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        //Query query = BasicQuery.query(Criteria.where("_id").is(automat.getId()));
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(automat.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(automat, "_id");
        if(automat.getContainers() == null && business.equals("Vending Shelves model")){
            update.unset("containers");
            update.unset("containersNew");
        }
        //logger.info("------------"+automat.getContainers()+"----"+business);
        mongoTemplate.updateFirst(query, update, Collections.SMART_AUTOMAT);
//        logger.debug("Automat update "+business+" result N is "+result.getN());
//        if(result.getN() == 0){
//            threadHandler.executorAutomatMongoServerThread(mongoTemplate, oId, automat);
//        }
    }

    public void updateSmartInboxById(ObjectId oid, SmartInbox inbox) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(inbox.getId()));
        mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(inbox, "_id"), Collections.SMART_INBOX);
    }

    public void createAutomat(ObjectId oid, Automat automat) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        automat.setCreateTime(DateUtils.getUTC());
        mongoTemplate.save(automat, Collections.SMART_AUTOMAT);
    }

    public void createOvdpDevice(OvdpDevice ovdpDevice) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByDBName(DBNames.PP);
        ovdpDevice.setCreateTime(DateUtils.getUTC());
        mongoTemplate.save(ovdpDevice,Collections.SMART_SMART_DEVICE);
    }

    public void updateOvdpDevice(OvdpDevice ovdpDevice) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByDBName(DBNames.PP);
        Query query = new Query();
        query.addCriteria(Criteria.where("assertId").is(ovdpDevice.getAssertId()));
        query.addCriteria(Criteria.where("oId").is(ovdpDevice.getoId()));
        mongoTemplate.updateFirst(query, new Update().set("gwId", ovdpDevice.getGwId()), Collections.SMART_SMART_DEVICE);
    }

    public Automat getAutomatById(ObjectId oId, ObjectId id) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        query.fields();
        Automat automat = mongoTemplate.findOne(query, Automat.class, Collections.SMART_AUTOMAT);
        return automat;
    }

    public Automat getAutomatByAssetId(ObjectId oId, String assetId) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        Query query = new Query();
        query.addCriteria(Criteria.where("assetId").is(assetId));
        query.fields();
        Automat automat = mongoTemplate.findOne(query, Automat.class,Collections.SMART_AUTOMAT);
        return automat;
    }
    
    public List<Automat> getAutomatBySn(ObjectId oid, String sn) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("serialNumber").is(sn));
        query.addCriteria(Criteria.where("disabled").ne(1));
        query.addCriteria(Criteria.where("deleteState").ne("1"));
        query.fields();
        List <Automat> automats = mongoTemplate.find(query, Automat.class, Collections.SMART_AUTOMAT);
        return automats;
    }
    
    public void createSmartInbox(ObjectId oid, SmartInbox inbox) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        inbox.setCreateTime(DateUtils.getUTC());
        template.insert(inbox, Collections.SMART_INBOX);
    }

    public void updateSmartInbox(ObjectId oid, SmartInbox inbox) {
        Assert.notNull(inbox.getoId());
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(inbox.getId()));
        mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(inbox, "_id"), Collections.SMART_INBOX);
    }
    
    public SmartInbox getSmartInboxById(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        query.fields();
        return template.findOne(query, SmartInbox.class, Collections.SMART_INBOX);
    }

    public SmartInbox getSmartInboxBySn(ObjectId oid, String sn) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("sn").is(sn));
        return template.findOne(query, SmartInbox.class, Collections.SMART_INBOX);
    }

    public void updateAutomatStatus(ObjectId oid, ObjectId deviceId, Integer online) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(deviceId));
        WriteResult result = template.updateFirst(query, new Update().set("online", online), Collections.SMART_AUTOMAT);
        logger.debug("Automat update status result is "+result.getN());
    }

    public Automat getAutomatByGwId(ObjectId oid, ObjectId gwId) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("gwId").is(gwId));
        query.addCriteria(Criteria.where("online").is(Constant.DEVICE_ONLINE_STATUS_LOGIN));
        query.fields();
        return template.findOne(query, Automat.class, Collections.SMART_AUTOMAT);
    }

    public Automat getAutomatByDeviceId(ObjectId oId, ObjectId id) {
         MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        query.fields();
        Automat automat = mongoTemplate.findOne(query, Automat.class, Collections.SMART_AUTOMAT);
        return automat;
    }
    
    
}
