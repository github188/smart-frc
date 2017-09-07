/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author liqiang
 */
public class CommonCidRecord {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oid;
    
    private ObjectId recordId;
    private String assetId;
    
    private String cid;
    private Integer machineType;
    private List<ShelfPaySales> shelves;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public ObjectId getRecordId() {
        return recordId;
    }

    public void setRecordId(ObjectId recordId) {
        this.recordId = recordId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Integer getMachineType() {
        return machineType;
    }

    public void setMachineType(Integer machineType) {
        this.machineType = machineType;
    }

    public List<ShelfPaySales> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelfPaySales> shelves) {
        this.shelves = shelves;
    }
    
    
}
