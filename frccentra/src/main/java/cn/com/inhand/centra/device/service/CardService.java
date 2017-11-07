/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.CardsDao;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.smart.formulacar.model.Cards;
import java.util.List;
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
public class CardService extends MongoService implements CardsDao{

    public Cards findCardByRfid(ObjectId oid, String rfid) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("rfid").is(rfid));
        return template.findOne(query, Cards.class, Collections.SMART_FM_CARDS);
    }

    public void createCard(ObjectId oid, Cards card) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(card, Collections.SMART_FM_CARDS);
    }
    
    public List<Cards> getCarListByMember(ObjectId oid, ObjectId memberId) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("memberId").is(memberId));
        return mongoTemplate.find(query, Cards.class, Collections.SMART_FM_CARDS);
    }
}
