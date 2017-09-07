package cn.com.inhand.common.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.Map;
import java.util.Set;

public abstract class MongoService {

    @Autowired
    @Qualifier("mongo")
    protected Mongo mongo;

    @Autowired
    protected ObjectMapper mapper;

    @Autowired
    protected MongoFactory factory;

    private String defaultSortField = "createTime";
    private Direction defaultSortDirection = Direction.DESC;

    public DBObject getSortObject() {
        return new BasicDBObject(this.defaultSortField, this.defaultSortDirection);
    }

    public DBObject getSortObject(String field, Direction direction) {
        return new BasicDBObject(field, direction);
    }

    public Mongo getMongo() {
        return mongo;
    }

    public void setMongo(Mongo mongo) {
        this.mongo = mongo;
    }

    public String getDefaultSortField() {
        return defaultSortField;
    }

    public void setDefaultSortField(String defaultSortField) {
        this.defaultSortField = defaultSortField;
    }

    public Direction getDefaultSortDirection() {
        return defaultSortDirection;
    }

    public void setDefaultSortDirection(Direction defaultSortDirection) {
        this.defaultSortDirection = defaultSortDirection;
    }

    @SuppressWarnings("unchecked")
    public DBObject getVerbose(String verboseJson, int verbose) {
        DBObject obj = new BasicDBObject();
        if (verbose < 1) {
            verbose = 1;
        }
        Map<String, Integer> maps = null;
        try {
            maps = this.mapper.readValue(verboseJson, Map.class);
            Set<String> key = maps.keySet();
	        for (String temp : key) {
		        if (maps.get(temp) <= verbose) {
			        obj.put(temp, maps.get(temp));
		        }
	        }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return obj;
    }

    public boolean exist(ObjectId oId, String key, Object value, String collection) {
        Query query = Query.query(Criteria.where(key).is(value));
        return exist(oId, query, collection);
    }

    public boolean exist(ObjectId oId, Query query, String collection) {
        return this.factory.getMongoTemplateByOId(oId).count(query, collection) > 0;
    }

    public boolean exist(ObjectId oId, DBObject query, String collection) {
        return this.factory.getCollectionByOId(oId, collection).count(query) > 0;
    }

    public boolean exist(String dbName, DBObject query, String collection) {
        return this.factory.getCollectionByDbName(dbName, collection).count(query) > 0;
    }

    public boolean exist(String dbName, Query query, String collection) {
        return this.factory.getMongoTemplateByDBName(dbName).count(query, collection) > 0;
    }
}
