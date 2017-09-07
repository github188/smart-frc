package cn.com.inhand.oauth2.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.oauth2.dao.ApiKeysDAO;
import cn.com.inhand.oauth2.dto.ApiKey;

@Service
public class ApiKeysService extends MongoService implements ApiKeysDAO{
	
	private String collectionName = Collections.API_KEYS;

	@Override
	public List<ApiKey> getList(ObjectId oId) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		return template.find(new Query(), ApiKey.class, collectionName);
	}

	@Override
	public ApiKey getApiKey(ObjectId oId, ObjectId id) {
		Query query = Query.query(Criteria.where("_id").is(id));
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		return template.findOne(query, ApiKey.class, collectionName);
	}

	@Override
	public ApiKey getApiKey(ObjectId oId, String keycode) {
		Query query = Query.query(Criteria.where("keyCode").is(keycode));
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		return template.findOne(query, ApiKey.class, collectionName);
	}

	@Override
	public int getCount(ObjectId oId) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		return (int) template.count(new Query(), collectionName);
	}

	@Override
	public void updateApiKey(ObjectId oId, ApiKey apiKey) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = BasicQuery.query(Criteria.where("_id").is(apiKey.get_id()));
		template.updateFirst(query, UpdateUtils.convertBeanToUpdate(apiKey, "_id"), collectionName);
	}

	@Override
	public void addApiKey(ObjectId oId, ApiKey apiKey) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		template.save(apiKey, collectionName);
	}

	@Override
	public ApiKey getApiKey(ObjectId oId, Integer sn) {
		Query query = Query.query(Criteria.where("sn").is(sn));
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		return template.findOne(query, ApiKey.class, collectionName);
	}
	
}
