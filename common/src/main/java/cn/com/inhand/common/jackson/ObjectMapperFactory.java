package cn.com.inhand.common.jackson;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.bson.types.ObjectId;

public class ObjectMapperFactory {
	private ObjectMapper mapper;

	public ObjectMapperFactory() {
		this.mapper = new ObjectMapper();
		this.mapper.writerWithDefaultPrettyPrinter();
		SimpleModule module = new SimpleModule("ObjectIdModule");
		module.addSerializer(ObjectId.class, new ObjectIdSerializer());
		this.mapper.registerModule(module);

//		this.mapper.enable(SerializationFeature.INDENT_OUTPUT);
		this.mapper.setSerializationInclusion(Include.NON_NULL);
		this.mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
	}

	public ObjectMapper getMapper() {
		return mapper;
	}

	public void setMapper(ObjectMapper mapper) {
		this.mapper = mapper;
	}

}
