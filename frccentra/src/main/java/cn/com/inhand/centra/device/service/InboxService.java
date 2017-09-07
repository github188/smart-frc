/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.InboxDAO;
import cn.com.inhand.centra.device.handle.MongoServerThreadHandler;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.InboxHistoryData;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.common.util.UpdateUtils;
import com.mongodb.WriteResult;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class InboxService extends MongoService implements InboxDAO {

    private static final Logger logger = LoggerFactory.getLogger(InboxService.class);
    @Autowired
    private MongoServerThreadHandler threadHandler;

    public SmartInbox getInboxBySn(ObjectId oid, String sn) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(sn));
        query.fields();
        return template.findOne(query, SmartInbox.class, Collections.SMART_INBOX);
    }

    public void updateInbox(SmartInbox inbox) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(inbox.getoId());
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(inbox.getId()));
        mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(inbox, "_id"), Collections.SMART_INBOX);
//        if(result.getN() == 0){
//            threadHandler.executorInboxMongoServerThread(mongoTemplate, inbox.getoId(), inbox);
//        }
    }

    public void saveInboxHistoryData(InboxHistoryData historyData) {
        MongoTemplate template = factory.getMongoTemplateByOId(historyData.getOid());
        template.save(historyData, Collections.SMART_INBOX_HISTORY_DATA);
    }

    public SmartInbox getInboxByAssetId(ObjectId oid, String assetId) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("assetId").is(assetId));
        query.fields();
        return template.findOne(query, SmartInbox.class, Collections.SMART_INBOX);
    }
}
