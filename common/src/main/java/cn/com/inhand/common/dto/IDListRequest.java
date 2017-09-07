package cn.com.inhand.common.dto;

import org.bson.types.ObjectId;

import java.util.List;

public class IDListRequest {
    private List<ObjectId> ids;

    /**
     * @return the ids
     */
    public List<ObjectId> getIds() {
        return ids;
    }

    /**
     * @param ids the ids to set
     */
    public void setIds(List<ObjectId> ids) {
        this.ids = ids;
    }

}
