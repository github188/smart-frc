package cn.com.inhand.wechat.util;

import java.util.Map;

import net.sf.json.JSONObject;

public class JsonObject {
	
	public static Object unserializedJson(String json,Class beanClass){
		JSONObject object = JSONObject.fromObject(json);
		return JSONObject.toBean(object, beanClass);
	}
	
	public static Object unserialized(String json, Class beanClass, Map map)
			throws Exception {
		JSONObject jsonObject = JSONObject.fromObject(json);
		return JSONObject.toBean(jsonObject, beanClass, map);
	}
	
	public static String serialized(Object obj) {
		JSONObject jsonObject = JSONObject.fromObject(obj);
		String json = jsonObject.toString();
		jsonObject.clear();
		return json;
	}

}
