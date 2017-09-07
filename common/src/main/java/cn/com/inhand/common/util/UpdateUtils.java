package cn.com.inhand.common.util;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Update;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class UpdateUtils {
    public static UpdateUtils instance = new UpdateUtils();

    private UpdateUtils() {
        mapper = new ObjectMapper();
        mapper.writerWithDefaultPrettyPrinter();
        SimpleModule module = new SimpleModule("ObjectIdModule");
        module.addSerializer(Date.class, new JsonSerializer<Date>() {
            @Override
            public void serialize(Date value, JsonGenerator jgen, SerializerProvider provider)
                    throws IOException, JsonProcessingException {
                jgen.writeObject(value);
            }
        });
        module.addSerializer(ObjectId.class, new JsonSerializer<ObjectId>() {
            @Override
            public void serialize(ObjectId value, JsonGenerator jgen, SerializerProvider provider)
                    throws IOException, JsonProcessingException {
                jgen.writeObject(value);
            }
        });
        mapper.registerModule(module);

        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.setSerializationInclusion(Include.NON_NULL);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    public ObjectMapper mapper;

    public static UpdateUtils getInstance() {
        return instance;
    }

    @SuppressWarnings({"unchecked"})
    public void convertDBObjectToUpdate(Update update, String prefix, Map<String, Object> object,
                                        String... exclude) {
        List<String> excludeList = Arrays.asList(exclude);
        Object value;
        for (String key : object.keySet()) {
            value = object.get(key);
            String fullKey = (prefix == null ? key : prefix + "." + key);
            if (excludeList.contains(fullKey)) {
                continue;
            }
            if (value instanceof Map) {
                convertDBObjectToUpdate(update, fullKey, (Map<String, Object>) value, exclude);
            } else {
                update.set(fullKey, object.get(key));
            }
        }
    }

    public Update convertDBObjectToUpdate(String prefix, Map<String, Object> object, String... exclude) {
        Update update = new Update();
        convertDBObjectToUpdate(update, prefix, object, exclude);
        // System.out.println(update.getUpdateObject());
        return update;
    }

    @SuppressWarnings("unchecked")
    public static Update convertBeanToUpdate(Object bean, String... exclude) {
        Map<String, Object> object = getInstance().mapper.convertValue(bean, Map.class);
        return getInstance().convertDBObjectToUpdate(null, object, exclude);
    }
}
