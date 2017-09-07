/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.wechat.dao.MemberDao;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

/**
 *
 * @author lenovo
 */
public class MemberService extends MongoService implements MemberDao{

    public Member findMemberByOpenId(ObjectId oid,String openId) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("openId").is(openId));
        return template.findOne(query, Member.class, Collections.SMART_FM_MEMBER);
    }

    public void createNewMember(ObjectId oid,Member member) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(member, Collections.SMART_FM_MEMBER);
    }

    public Member findMemberByPhone(ObjectId oid, String phone) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("phone").is(phone));
        return template.findOne(query, Member.class, Collections.SMART_FM_MEMBER);
    }

    public void updateMember(ObjectId oid, Member member) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(member.getId()));
        template.updateFirst(query, UpdateUtils.convertBeanToUpdate(member, "_id"), Collections.SMART_FM_MEMBER);
    }
    
    
}
