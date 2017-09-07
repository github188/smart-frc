package cn.com.inhand.common.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;

import java.io.IOException;

/**
 * Created by Jerolin on 7/1/2014.
 */
public class ObjectIdDeserializer extends JsonDeserializer<ObjectId> {
	@Override
	public ObjectId deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		String string = jp.getValueAsString();
		if (StringUtils.isBlank(string)) {
			return null;
		} else {
			return new ObjectId(string);
		}
	}
}
