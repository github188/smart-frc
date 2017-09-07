package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.Machine;
import org.bson.types.ObjectId;

public interface MachineDAO {
	
    public Machine getMachineById(ObjectId oId, ObjectId id);

}
