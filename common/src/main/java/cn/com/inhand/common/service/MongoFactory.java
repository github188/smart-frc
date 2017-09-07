package cn.com.inhand.common.service;

import cn.com.inhand.common.config.PublicConfigBean;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.authentication.UserCredentials;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

import java.io.Serializable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class MongoFactory implements Serializable {
	private static final Logger LOG = LoggerFactory.getLogger(MongoFactory.class);
	private Mongo mongo;
	private ConcurrentMap<String, MongoTemplate> templates = new ConcurrentHashMap<String, MongoTemplate>();
	private ConcurrentMap<String, GridFsTemplate> gridFsTemplates = new ConcurrentHashMap<String, GridFsTemplate>();
	private String adminDbName = "admin";
	private String username;
	private String password;

	public MongoFactory(Mongo mongo, PublicConfigBean publicConfig) {
		this.mongo = mongo;
		this.username = publicConfig.getMongodbUsername();
		this.password = publicConfig.getMongodbPassword();
	}

	public MongoFactory(Mongo mongo, String username, String password) {
		this.mongo = mongo;
		this.username = username;
		this.password = password;
	}

	public DBCollection getCollectionByOId(ObjectId oId, String collection) {
		return this.getDBByOId(oId).getCollection(collection);
	}

	public DBCollection getCollectionByDbName(String dbName, String collection) {
		return this.getDBByName(dbName).getCollection(collection);
	}

	public DB getDBByOId(ObjectId oId) {
		return getDBByName(getDbNameByOId(oId));
	}

	public DB getDBByName(String dbName) {
		DB db = this.mongo.getDB(dbName);
		db.authenticate(username, password.toCharArray());
		return db;
	}

	public String getDbNameByOId(ObjectId id) {
		String systemOIdString = "0000000000000000000ABCDE";
		if (id.toString().equalsIgnoreCase(systemOIdString)) {
			return "ABCDE_db";
		} else {
			return id.toString().toUpperCase() + "_db";
		}
	}

	public Mongo getMongo() {
		return this.mongo;
	}

	public MongoTemplate getMongoTemplateByDBName(String dbName) {
		MongoTemplate template = templates.get(dbName);
		if (template != null) {
			return template;
		} else {
			UserCredentials credentials = new UserCredentials(username, password);
			SimpleMongoDbFactory dbFactory = new SimpleMongoDbFactory(mongo, adminDbName, credentials);
			DbRefResolver dbRefResolver = new DefaultDbRefResolver(dbFactory);
			MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, new MongoMappingContext());
			converter.setTypeMapper(new DefaultMongoTypeMapper(null));

			dbFactory = new SimpleMongoDbFactory(mongo, dbName);

			template = new MongoTemplate(dbFactory, converter);
			MongoTemplate temp = templates.putIfAbsent(dbName, template);
			if (temp == null) {
				return template;
			} else {
				return temp;
			}
		}
	}

	public GridFsTemplate getGridFsTemplateByDBName(String dbName) {
		GridFsTemplate template = gridFsTemplates.get(dbName);
		if (template != null) {
			return template;
		} else {
			UserCredentials credentials = new UserCredentials(username, password);
			SimpleMongoDbFactory dbFactory = new SimpleMongoDbFactory(mongo, adminDbName, credentials);
			DbRefResolver dbRefResolver = new DefaultDbRefResolver(dbFactory);
			MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, new MongoMappingContext());
			converter.setTypeMapper(new DefaultMongoTypeMapper(null));

			dbFactory = new SimpleMongoDbFactory(mongo, dbName);

			template = new GridFsTemplate(dbFactory, converter);
			GridFsTemplate temp = gridFsTemplates.putIfAbsent(dbName, template);
			if (temp == null) {
				return template;
			} else {
				return temp;
			}
		}
	}

	public MongoTemplate getMongoTemplateByOId(ObjectId oId) {
		return getMongoTemplateByDBName(getDbNameByOId(oId));
	}

	public GridFsTemplate getGridTemplateByOId(ObjectId oId) {
		return getGridFsTemplateByDBName(getDbNameByOId(oId));
	}

}
