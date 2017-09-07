package cn.com.inhand.oauth2.service;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.model.Oauth2Code;
import cn.com.inhand.common.model.RefreshToken;
import cn.com.inhand.common.model.Role;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.model.User;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.oauth2.dto.UserDbs;

@Component
public class OAuth2Service extends MongoService{
	public User getUserByUsername(String username){
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		UserDbs userDbs = template.findOne(Query.query(Criteria.where("username").is(username)), UserDbs.class, Collections.USER_DBS);
		if(userDbs == null){
			return null;
		}else{
			return factory.getMongoTemplateByDBName(userDbs.getDbName()).findOne(Query.query(Criteria.where("email").is(username)), User.class, Collections.USERS);			
		}
	}
	
	public Role getRoleByUsername(String username){
		User user = getUserByUsername(username);
		if(user != null){
			MongoTemplate template = factory.getMongoTemplateByOId(user.getOid());
			return template.findById(user.getRoleId(), Role.class, Collections.ROLE);
		}else{
			return null;
		}
	}
	
	public Client getClient(ObjectId clientId){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findById(clientId, Client.class, Collections.CLIENTS);
	}
	
	public Client getClient(ObjectId clientId, String clientSecret){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("_id").is(clientId).and("appkey").is(clientSecret)), Client.class, Collections.CLIENTS);
	}
	
	public Client getPrivateClient(ObjectId clientId, String clientSecret){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("_id").is(clientId).and("type").is("private").and("appkey").is(clientSecret)), Client.class, Collections.CLIENTS);
	}
	
	public Oauth2Code getCode(String code){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("code").is(code)), Oauth2Code.class, Collections.OAUTH2_CODE);
	}
	
	public Token getToken(String username, ObjectId clientId){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("username").is(username).and("clientId").is(clientId)), Token.class, Collections.TOKEN);
	}
	
	public Token getToken(String token){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("token").is(token)), Token.class, Collections.TOKEN);
	}
	
	public Token getTokenInfo(String token){
		Query query = Query.query(Criteria.where("token").is(token));
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(query, Token.class, Collections.TOKEN);
	}
	
	public void createToken(Token token){
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM); 
		token.setCreateTime(DateUtils.getUTC());
		template.save(token, Collections.TOKEN);
	}
	
	public void createRefreshToken(RefreshToken token){
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM); 
		token.setCreateTime(DateUtils.getUTC());
		template.save(token, Collections.REFRESH_TOKEN);
	}
	
	public RefreshToken getRefreshToken(String refreshToken){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("refreshToken").is(refreshToken)), RefreshToken.class, Collections.REFRESH_TOKEN);
	}
	
	public RefreshToken getRefreshToken(String refreshToken, ObjectId clientId){
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("refreshToken").is(refreshToken).and("clientId").is(clientId)), RefreshToken.class, Collections.REFRESH_TOKEN);
	}
	public Token getToken(String token, ObjectId clientId, String clientSecret){
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM); 
		Query query = Query.query(Criteria.where("token").is(token).and("clientId").is(clientId));
		if(clientSecret != null){
			query.addCriteria(Criteria.where("appkey").is(clientSecret));
		}
		return template.findOne(query, Token.class, Collections.TOKEN);
	}
}
