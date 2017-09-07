package cn.com.inhand.statistic.model;

import org.bson.types.ObjectId;

import java.util.List;

public class DeviceIdsListRequestBody {

    private List<ObjectId> resourceIds;

    public synchronized List<ObjectId> getResourceIds() {
        return resourceIds;
    }

    public synchronized void setResourceIds(List<ObjectId> resourceIds) {
        this.resourceIds = resourceIds;
    }

}
