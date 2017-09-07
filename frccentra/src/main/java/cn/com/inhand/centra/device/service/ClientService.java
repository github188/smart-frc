package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.ClientDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.ClientSecret;
import cn.com.inhand.common.smart.model.SmartWechatUser;
import cn.com.inhand.common.smart.model.User;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.dn4.utils.DateUtils;
import java.util.List;
import org.springframework.data.mongodb.core.query.Update;

@Service
public class ClientService extends MongoService implements ClientDAO {

    @Override
    public Client getClientByOid(ObjectId oid, String className) {
        Query query = new Query();
        query.addCriteria(Criteria.where("oid").is(oid).andOperator(Criteria.where("type").is(className)));
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        return template.findOne(query, Client.class, Collections.CLIENTS);
    }

    @Override
    public void createClients(Client client) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        client.setCreateTime(DateUtils.getUTC());
        template.save(client, Collections.CLIENTS);
    }
    @Override
    public void createClientSecret(ClientSecret clientSecret) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        clientSecret.setCreateTime(DateUtils.getUTC());
        template.save(clientSecret, Collections.SMART_CLIENT_SECRET);
    }

    public ClientSecret getClientSecret(ObjectId oid) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("oid").is(oid));
        return template.findOne(query, ClientSecret.class, Collections.SMART_CLIENT_SECRET);
    }

    public void updateClientSecret(ClientSecret clientSecret) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(clientSecret.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(clientSecret, "_id");
        template.updateFirst(query, update, Collections.SMART_CLIENT_SECRET);
    }

    public void createSmartWechatUser(SmartWechatUser user) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        template.save(user, Collections.SMART_WECHAT_USER);
    }

    public SmartWechatUser getSmartWechatUser(ObjectId oid, ObjectId uid,String openId) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("uid").is(uid));
        query.addCriteria(Criteria.where("oid").is(oid));
        query.addCriteria(Criteria.where("openId").is(openId));
        return template.findOne(query, SmartWechatUser.class, Collections.SMART_WECHAT_USER);
    }

    public void deleteSmartWechatUser(SmartWechatUser swu) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        template.remove(swu, Collections.SMART_WECHAT_USER);
    }

    public SmartWechatUser getSmartWechatUserByOpenId(String openId) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("openId").is(openId));
        return template.findOne(query, SmartWechatUser.class, Collections.SMART_WECHAT_USER);
    }

    public User getUserByUid(ObjectId oid, ObjectId uid) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(uid));
        return template.findOne(query, User.class, Collections.USERS);
    }

    public List<SmartWechatUser> getSmartWechatUserList(ObjectId oid, ObjectId uid) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("uid").is(uid));
        query.addCriteria(Criteria.where("oid").is(oid));
        return template.find(query, SmartWechatUser.class, Collections.SMART_WECHAT_USER);
    }
    
}
