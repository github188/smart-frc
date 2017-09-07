package cn.com.inhand.centra.device.dao;

import org.bson.types.ObjectId;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.smart.model.ClientSecret;
import cn.com.inhand.common.smart.model.SmartWechatUser;
import cn.com.inhand.common.smart.model.User;
import java.util.List;

public interface ClientDAO {

    public Client getClientByOid(ObjectId oid, String className);
    public void createClients(Client client);
    
    public void createClientSecret(ClientSecret clientSecret);
    
    public ClientSecret getClientSecret(ObjectId oid);
    
    public void updateClientSecret(ClientSecret clientSecret);
    
    public void createSmartWechatUser(SmartWechatUser user);
    
    public SmartWechatUser getSmartWechatUser(ObjectId oid,ObjectId uid,String openId);
    
    public List<SmartWechatUser> getSmartWechatUserList(ObjectId oid,ObjectId uid);
    
    public void deleteSmartWechatUser(SmartWechatUser swu);
    
    public SmartWechatUser getSmartWechatUserByOpenId(String openId);
    
    public User getUserByUid(ObjectId oid,ObjectId uid);
    
}
