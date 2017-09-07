package cn.com.inhand.common.dto;

import org.bson.types.ObjectId;

import java.util.List;

public class SourceIdListRequest {
    private List<ObjectId> sourceIds;

    /**
     * @return the sourceIds
     */
    public List<ObjectId> getSourceIds() {
        return sourceIds;
    }

    /**
     * @param sourceIds the sourceIds to set
     */
    public void setSourceIds(List<ObjectId> sourceIds) {
        this.sourceIds = sourceIds;
    }
}
