package cn.com.inhand.statistic.service;

import cn.com.inhand.common.model.Machine;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.MachineDAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class MachineService extends MongoService implements MachineDAO {

    private String collectionName = Collections.MACHINE;

    @Override
    public Machine getMachineById(ObjectId oId, ObjectId id) {
        Assert.notNull(id);
        MongoTemplate template = factory.getMongoTemplateByOId(oId);
        return template.findById(id, Machine.class, collectionName);
    }
}