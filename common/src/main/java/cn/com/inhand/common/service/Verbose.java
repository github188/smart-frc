package cn.com.inhand.common.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Field;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.util.Assert;

import java.io.IOException;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class Verbose {

    private Map<String, Integer> map;
    private ConcurrentMap<Integer, DBObject> fields;

    public Verbose(Map<String, Integer> map) {
        this.map = map;
        this.fields = new ConcurrentHashMap<Integer, DBObject>();
    }

    @SuppressWarnings("unchecked")
    public Verbose(String verboseDefinition) {
        try {
            map = new ObjectMapper().readValue(verboseDefinition, Map.class);
            this.fields = new ConcurrentHashMap<Integer, DBObject>();
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Map<String, Integer> getMap() {
        return map;
    }

    public void setMap(Map<String, Integer> map) {
        this.map = map;
    }

    /*public void updateQueryField(Query query, int level) {
     Field field = new Field();
     if (level > 25) {
     for (Entry<String, Integer> entry : map.entrySet()) {
     if (level <= entry.getValue()) {
     field.exclude(entry.getKey());
     }
     }
     } else {
     for (Entry<String, Integer> entry : map.entrySet()) {
     if (level >= entry.getValue()) {
     field.include(entry.getKey());
     }
     }
     }
     }*/
    public DBObject getQueryFieldObject(int level) {
        Assert.state(level >= 0);
        DBObject fieldObject = this.fields.get(level);
        if (fieldObject == null) {
            Field field;
            field = new Field();
            if (level > 50) {
                for (Entry<String, Integer> entry : map.entrySet()) {
                    if (level <= entry.getValue()) {
                        field.exclude(entry.getKey());
                    }
                }
            } else {
                for (Entry<String, Integer> entry : map.entrySet()) {
                    if (level >= entry.getValue()) {
                        field.include(entry.getKey());
                    }
                }
            }
            fieldObject = this.fields.putIfAbsent(level, field.getFieldsObject());
            if (fieldObject == null) {
                fieldObject = field.getFieldsObject();
            }
        }
        return fieldObject;
    }

    public Query getQuery(int level) {
        return new BasicQuery(new BasicDBObject(), getQueryFieldObject(level));
    }
}
