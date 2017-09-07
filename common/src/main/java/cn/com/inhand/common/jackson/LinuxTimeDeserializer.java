package cn.com.inhand.common.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.util.Date;

/**
 * Created by Jerolin on 6/12/2014.
 */
public class LinuxTimeDeserializer extends JsonDeserializer<Date> {
	@Override
	public Date deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		long n = jp.getValueAsLong(-1);
		if (n == -1) {
			return null;
		}
		return new Date(n * 1000);
	}
}
