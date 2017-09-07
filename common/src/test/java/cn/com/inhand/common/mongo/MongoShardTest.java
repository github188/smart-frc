package cn.com.inhand.common.mongo;

import cn.com.inhand.common.jackson.ObjectMapperFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.*;
import org.junit.Test;

import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Jerolin on 6/3/2014.
 */
public class MongoShardTest {

	@Test
	public void insertTest() throws UnknownHostException {
//		Mongo mongo = new Mongo("10.5.16.227");
//		DBCollection collection = mongo.getDB("inhand3").getCollection("test");
//		collection.insert(BasicDBObjectBuilder.start("hello", "world" + RandomUtils.nextInt()).get());
//
//		DBCursor cursor = collection.find();
//		for (DBObject dbObject : cursor) {
//			System.out.println(dbObject);
//		}
	}


	/*@Test
	public void dateTest() throws JsonProcessingException {
		ObjectMapperFactory factory = new ObjectMapperFactory();
		SimpleDateFormat dateFormat = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss 'GMT'ZZ");
		String s = factory.getMapper().writeValueAsString(new Date());
		factory.getMapper().setDateFormat(dateFormat);
		System.out.println(s);
		System.out.println(new Date());
	}*/
}
