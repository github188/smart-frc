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
 * @author xupeijiao
 */
public class FlowAlarmConfig {
    
      @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private String flowPackage;  //M
    
    private FlowLevel  flowlevels;

    /**
     * @return the FlowPackage
     */
    public String getFlowPackage() {
        return flowPackage;
    }

    /**
     * @param FlowPackage the FlowPackage to set
     */
    public void setFlowPackage(String flowPackage) {
        this.flowPackage = flowPackage;
    }


    /**
     * @return the id
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

  

    /**
     * @return the flowlevels
     */
    public FlowLevel getFlowlevels() {
        return flowlevels;
    }

    /**
     * @param flowlevels the flowlevels to set
     */
    public void setFlowlevels(FlowLevel flowlevels) {
        this.flowlevels = flowlevels;
    }


}
    
