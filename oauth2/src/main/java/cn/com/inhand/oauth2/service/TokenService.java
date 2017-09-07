package cn.com.inhand.oauth2.service;

import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.oauth2.dao.TokenDAO;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class TokenService extends MongoService implements TokenDAO {

	@Autowired
	RestTemplate template;

	@Value("#{config.httpServerUri}")
	String httpServerUrl;

	private final String TOKEN_API_NAME = "oauth2/access_token";
	private String collectionName = Collections.TOKEN;

	@Override
	public List<Token> getTokensByClientId(ObjectId oid, ObjectId clientId) {
		Query query = Query.query(Criteria.where("oid").is(oid).andOperator(Criteria.where("clientId").is(clientId)));
		query.limit(5);
		query.fields().exclude("username").exclude("clientId").exclude("name").exclude("createTime").exclude("ip").exclude("privileges");
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.find(query, Token.class, collectionName);
	}

	@Override
	public int getTokenNumByClientId(ObjectId oid, ObjectId clientId) {
		Query query = Query.query(Criteria.where("oid").is(oid).andOperator(Criteria.where("clientId").is(clientId)));
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return (int) template.count(query, collectionName);
	}

	@Override
	public void deleteTokenById(ObjectId id) {
		Query query = Query.query(Criteria.where("_id").is(id));
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		template.remove(query, collectionName);
	}

	@Override
	public Token getTokenByToken(ObjectId oid, String token) {
		Query query = Query.query(Criteria.where("oid").is(oid).andOperator(Criteria.where("token").is(token)));
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.findOne(query, Token.class, collectionName);
	}

	@Override
	public String getTokenCode(ObjectId clientId, String appkey) {
		StringBuffer tokenUrl = new StringBuffer();
		tokenUrl.append(httpServerUrl).append(TOKEN_API_NAME);
		tokenUrl.append("?grant_type=").append("client_credentials");
		tokenUrl.append("&client_id=").append(clientId);
		tokenUrl.append("&client_secret=").append(appkey);
		@SuppressWarnings("unchecked")
		Map<String, Object> requestMap = template.postForObject(tokenUrl.toString(), null, Map.class);
		if (requestMap.get("access_token") != null) {
			return requestMap.get("access_token").toString();
		} else {
			throw new Error(requestMap.toString());
		}
	}

}
