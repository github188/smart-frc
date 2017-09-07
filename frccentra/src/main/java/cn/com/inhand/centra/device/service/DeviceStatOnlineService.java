/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.DeviceStatOnlineDAO;
import cn.com.inhand.centra.device.dto.DeviceOnlineRecord;
import static cn.com.inhand.common.service.Collections.DEVICE_ONLINE_STAT;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.DateUtils;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import org.springframework.data.mongodb.core.query.Query;
import static org.springframework.data.mongodb.core.query.Query.query;
import org.springframework.data.mongodb.core.query.Update;
import static org.springframework.data.mongodb.core.query.Update.update;
import org.springframework.stereotype.Service;

/**
 *
 * @author cttc
 */
@Service
public class DeviceStatOnlineService extends MongoService implements DeviceStatOnlineDAO {

    public void addDeviceStatOnline(ObjectId oid, ObjectId deviceId,String ip,String port,int action,String sid) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = query(where("deviceId").is(deviceId)).with(new Sort(new Sort.Order(Sort.Direction.DESC, "login")));
//        query.addCriteria(Criteria.where("sid").is(sid));
        Update update;

        DeviceOnlineRecord pre = template.findOne(query, DeviceOnlineRecord.class, DEVICE_ONLINE_STAT);
        long time = DateUtils.getUTC();
        DeviceOnlineRecord record = new DeviceOnlineRecord();
        record.setDeviceId(deviceId);
        record.setLogin(time);
        record.setOfflineInterval(0l);
        record.setCurrent(1);
        record.setLoginType(action);
        record.setIp(ip);
        record.setPort(port);
        record.setSid(sid);
        
        if (pre == null) {
            template.insert(record, DEVICE_ONLINE_STAT);
        } else {
            if (pre.getLogout() == null) {
                pre.setLogout(time);
                pre.setOnlineInterval(time - pre.getLogin());
                pre.setException(1);
                update = update("current", pre.getCurrent())
                        .set("logout", pre.getLogout())
                        .set("onlineInterval", pre.getOnlineInterval())
                        .set("exception", pre.getException());
                template.updateFirst(query(where("_id").is(pre.getId())), update, DEVICE_ONLINE_STAT);
            }
            record.setOfflineInterval(time - pre.getLogout());
            template.insert(record, DEVICE_ONLINE_STAT);
        }
    }

    public void addDeviceStatOffline(ObjectId oid, ObjectId deviceId, int exception,String sid) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = query(where("deviceId").is(deviceId).and("logout").is(null))
                .with(new Sort(new Sort.Order(Sort.Direction.DESC, "login")));
        query.addCriteria(Criteria.where("sid").is(sid));
        
        Update update;
        DeviceOnlineRecord pre = template.findOne(query, DeviceOnlineRecord.class, DEVICE_ONLINE_STAT);
        long time = DateUtils.getUTC();
        if (pre != null) {
            pre.setLogout(time);
            pre.setOnlineInterval(time - pre.getLogin());
            pre.setException(exception);
            update = update("current", 0)
                    .set("logout", time)
                    .set("onlineInterval", time - pre.getLogin())
                    .set("exception", exception);
            template.updateFirst(query(where("_id").is(pre.getId())), update, DEVICE_ONLINE_STAT);
        }
    }
}
