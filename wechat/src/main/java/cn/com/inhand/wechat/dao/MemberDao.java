/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.dao;

import cn.com.inhand.smart.formulacar.model.Member;
import org.bson.types.ObjectId;


/**
 *
 * @author lenovo
 */
public interface MemberDao {
    
    public Member findMemberByOpenId(ObjectId oid,String openId);
    
    public void createNewMember(ObjectId oid,Member member);
    
    public Member findMemberByPhone(ObjectId oid,String phone);
    
    public void updateMember(ObjectId oid,Member member);
    
}
