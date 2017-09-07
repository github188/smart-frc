package cn.com.inhand.common.dto;

import org.bson.types.ObjectId;

import java.util.ArrayList;


public class ResourceIdListRequestBody {
    private ArrayList<ObjectId> resourceIds;

    public ArrayList<ObjectId> getResourceIds() {
        return resourceIds;
    }

    public void setResourceIds(ArrayList<ObjectId> resourceIds) {
        this.resourceIds = resourceIds;
    }

    @Override
    public String toString() {
        StringBuffer buffer = new StringBuffer();
        for(ObjectId resourceId : resourceIds){
            buffer.append(resourceId).append(",");
        }
        return "ResourceIdListRequestBody{" + "resourceIds=" + buffer.toString() + '}';
    }

}
