package cn.com.inhand.common.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.DBObject;
import org.springframework.data.mongodb.core.query.Field;
import org.springframework.util.Assert;

import java.io.IOException;
import java.util.Map;
import java.util.Map.Entry;

public class VerboseUtil {
    public static ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    public static DBObject getFieldDBObject(String verbose, int level) {
        Assert.state(level < 0 || level > 100);
        Map<String, Integer> map;
        try {
            map = mapper.readValue(verbose, Map.class);
            Field field = new Field();
            if (level > 50) {
                for (Entry<String, Integer> entry : map.entrySet()) {
                    if (level < entry.getValue()) {
                        field.exclude(entry.getKey());
                    }
                }
            } else {
                for (Entry<String, Integer> entry : map.entrySet()) {
                    if (level > entry.getValue()) {
                        field.include(entry.getKey());
                    }
                }
            }
            return field.getFieldsObject();
        } catch (JsonParseException e) {
        } catch (JsonMappingException e) {
        } catch (IOException e) {
        }
        return null;
    }

}
