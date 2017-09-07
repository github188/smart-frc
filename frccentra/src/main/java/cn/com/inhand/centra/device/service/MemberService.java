/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.MemberDao;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.Member;
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
public class MemberService extends MongoService implements MemberDao{

    public Member findMemberByPhone(ObjectId oid, String phone) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("phone").is(phone));
        return template.findOne(query, Member.class, Collections.SMART_FM_MEMBER);
    }

    public void createMember(ObjectId oid, Member member) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(member, Collections.SMART_FM_MEMBER);
    }

    public Member findMemberByMemberId(ObjectId oid, ObjectId memeberId) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(memeberId));
        return template.findOne(query, Member.class, Collections.SMART_FM_MEMBER);
    }

    public void updateMember(ObjectId oid, Member member) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(member.getId()));
        template.updateFirst(query, UpdateUtils.convertBeanToUpdate(member, "_id"), Collections.SMART_FM_MEMBER);
    }
    
}
