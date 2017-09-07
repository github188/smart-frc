package cn.com.inhand.oauth2.dao;

import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

public interface RemoteDAO {
	
	 public Map<String, Object> getRemoteResult(Map<String, Object> configMap);
	 
	 public String remoteUrlGenerator(Map<String, Object> configMap);
	 
	 public Map<String, Object> postRemoteResult(List<ObjectId> resourceIds, Map<String, Object> bodyMap, Map<String, Object> configMap);
	
}
