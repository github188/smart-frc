/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author liqiang
 */
public class ParameterConfig {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    
    //补货配置
    private ReplenishConfig replenishConfig;  //
    
    //外部接口配置
    private OutInterfaceConfig interfaceConfig;

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

    public ReplenishConfig getReplenishConfig() {
        return replenishConfig;
    }

    public void setReplenishConfig(ReplenishConfig replenishConfig) {
        this.replenishConfig = replenishConfig;
    }

    public OutInterfaceConfig getInterfaceConfig() {
        return interfaceConfig;
    }

    public void setInterfaceConfig(OutInterfaceConfig interfaceConfig) {
        this.interfaceConfig = interfaceConfig;
    }
    
    
}
