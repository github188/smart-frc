package cn.com.inhand.dn4.utils;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayOutputStream;

public class JsonUtils {
    /**
     * 对象转换为json串
     *
     * @param obj
     * @return
     */
    public static String writeObjectJson(Object obj) {
        String message;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            objectMapper.writeValue(baos, obj);
            message = baos.toString();
            return message;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
