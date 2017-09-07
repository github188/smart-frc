package cn.com.inhand.oauth2.dao;

import cn.com.inhand.common.model.Token;
import org.bson.types.ObjectId;

import java.util.List;

public interface TokenDAO {
	
	public List<Token> getTokensByClientId(ObjectId oid, ObjectId clientId);
	
	public int getTokenNumByClientId(ObjectId oid, ObjectId clientId);
	
	public void deleteTokenById(ObjectId id);
	
	public Token getTokenByToken(ObjectId oid, String token);

	public String getTokenCode(ObjectId clientId, String appkey);
}
