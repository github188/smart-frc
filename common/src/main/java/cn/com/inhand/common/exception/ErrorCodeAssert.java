package cn.com.inhand.common.exception;

import cn.com.inhand.common.dto.Error;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public abstract class ErrorCodeAssert {
    public static void resourceIdExist(MongoTemplate template, String collection, ObjectId id) {
        if (template.count(Query.query(Criteria.where("_id").is(id)), collection) == 0) {
            throw new ErrorCodeException(new Error(ErrorCode.RESOURCE_DOES_NOT_EXIST, id.toString()));
        }
    }

    public static void resourceExist(MongoTemplate template, String collection, String key, Object value) {
        if (template.count(Query.query(Criteria.where(key).is(value)), collection) == 0) {
            throw new ErrorCodeException(new Error(ErrorCode.RESOURCE_DOES_NOT_EXIST, value.toString()));
        }
    }

    public static void notNull(Object object, Object params) {
        if (object == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, params);
        }
    }
}
