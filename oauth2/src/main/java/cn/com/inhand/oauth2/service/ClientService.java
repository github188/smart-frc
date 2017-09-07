package cn.com.inhand.oauth2.service;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.oauth2.dao.ClientDAO;
import cn.com.inhand.oauth2.dto.ClientQueryBean;
import cn.com.inhand.oauth2.util.QueryGenrator;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.List;

@Component
public class ClientService extends MongoService implements ClientDAO {
	@Autowired
	private QueryGenrator queryGenrator;
	private String collectionName = Collections.CLIENTS;

	public boolean isClientNameExists(String name) {
		return exist(DBNames.SYSTEM, Query.query(Criteria.where("name").is(name)), collectionName);
	}

	public Client getClient(ObjectId clientId) {
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findById(clientId, Client.class, collectionName);
	}

	public Client getPublicClient(ObjectId clientId, ObjectId oId) {
		Query query = Query.query(Criteria.where("_id").is(clientId));
		query.addCriteria(Criteria.where("oid").is(oId).and("reliable").is("public"));
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(query, Client.class, collectionName);
	}

	public Client getPublicClient(ObjectId clientId) {
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("_id").is(clientId).and("reliable").is("public")), Client.class, collectionName);
	}

	public Client getClient(ObjectId clientId, String clientSecret) {
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(Query.query(Criteria.where("_id").is(clientId).and("appkey").is(clientSecret)), Client.class, Collections.CLIENTS);
	}

	public Client getClientByClass(ObjectId oid, String clazz) {
		Query query = new Query();
		query.addCriteria(Criteria.where("oid").is(oid).andOperator(Criteria.where("type").is(clazz)));
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.findOne(query, Client.class, collectionName);
	}

	public List<Client> getClients(ClientQueryBean cqb, int verbose, int skip, int limit) {
		Query query = new Query();
		queryGenrator.getQuery(query, cqb);
		queryGenrator.withSortDESC(query, "createTime");
		query.limit(limit);
		query.skip(skip);
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.find(query, Client.class, collectionName);
	}

	public long getCount(ClientQueryBean cqb) {
		Query query = new Query();
		queryGenrator.getQuery(query, cqb);
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.count(query, collectionName);
	}

	public void createClient(Client client) {
		client.setCreateTime(DateUtils.getUTC());
		factory.getMongoTemplateByDBName(DBNames.SYSTEM).save(client, collectionName);
	}

	public void deleteClientById(ObjectId id) {
		Assert.notNull(id);
		factory.getMongoTemplateByDBName(DBNames.SYSTEM).remove(Query.query(Criteria.where("_id").is(id)), collectionName);
	}

	public void updateClient(Client client) {
		client.setUpdateTime(DateUtils.getUTC());
		Query query = BasicQuery.query(Criteria.where("_id").is(client.getId()));
		factory.getMongoTemplateByDBName(DBNames.SYSTEM).updateFirst(query, UpdateUtils.convertBeanToUpdate(client, "_id"), collectionName);
	}
}
