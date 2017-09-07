package cn.com.inhand.oauth2.dao;

import java.util.List;

import org.bson.types.ObjectId;

import cn.com.inhand.oauth2.dto.ApiKey;

public interface ApiKeysDAO {
	
	public List<ApiKey> getList(ObjectId oId);
	
	public ApiKey getApiKey(ObjectId oId, ObjectId id);
	
	public ApiKey getApiKey(ObjectId oId, String keycode);
	
	public ApiKey getApiKey(ObjectId oId, Integer sn);
	
	public int getCount(ObjectId oId);
	
	public void addApiKey(ObjectId oId, ApiKey apiKey);
	
	public void updateApiKey(ObjectId oId, ApiKey apiKey);
	
}
