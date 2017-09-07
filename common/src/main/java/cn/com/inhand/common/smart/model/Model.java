package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 机型
 *
 * @author shixj
 *
 */
public class Model {

    @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    private String name;
    private String vender;
     private String number;
    private int machineType;
    private Long createTime;
    private Long updateTime;
    private List<?> shelves;
    private ModelConfig keyConfig;
    private List<?> itemNumberConfig;
    public Model() {
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }

    public int getMachineType() {
        return machineType;
    }

    public void setMachineType(int machineType) {
        this.machineType = machineType;
    }
   
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

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public List<?> getShelves() {
        return shelves;
    }

    public void setShelves(List<?> shelves) {
        this.shelves = shelves;
    }

    public ModelConfig getKeyConfig() {
        return keyConfig;
    }

    public void setKeyConfig(ModelConfig keyConfig) {
        this.keyConfig = keyConfig;
    }

    /**
     * @return the itemNumberConfig
     */
    public List<?> getItemNumberConfig() {
        return itemNumberConfig;
    }

    /**
     * @param itemNumberConfig the itemNumberConfig to set
     */
    public void setItemNumberConfig(List<?> itemNumberConfig) {
        this.itemNumberConfig = itemNumberConfig;
    }


       
}
