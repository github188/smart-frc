package cn.com.inhand.centra.device.dao;

import org.bson.types.ObjectId;

public interface TokenDAO {
	
	public String getTokenKey(ObjectId id,String appKey);

}
