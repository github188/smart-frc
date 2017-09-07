package cn.com.inhand.dn4.utils;

import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.bson.types.ObjectId;

import java.util.*;

public class MongoUtils {
    public static Map dbObject2Map(DBObject obj) throws Exception {
        Map m = new HashMap();
        if (obj != null) {
            Iterator i = obj.keySet().iterator();
            while (i.hasNext()) {
                Object s = i.next();
                Object v = obj.get(String.valueOf(s));
                if (v instanceof ObjectId) {
                    m.put(s, v.toString());
                } else {
                    m.put(s, v);
                }
            }
        }
        return m;
    }

    public static List<Map> dbCursor2List(DBCursor cur) throws Exception {
        List<Map> list = new ArrayList<Map>();
        if (cur != null) {
            while (cur.hasNext()) {
                DBObject obj = cur.next();
                Map m = new HashMap();
                Iterator i = obj.keySet().iterator();
                while (i.hasNext()) {
                    Object s = i.next();
                    Object v = obj.get(String.valueOf(s));
                    if (v instanceof ObjectId) {
                        m.put(s, v.toString());
                    } else {
                        m.put(s, v);
                    }
                }
                list.add(m);
            }
        }
        return list;
    }
}
