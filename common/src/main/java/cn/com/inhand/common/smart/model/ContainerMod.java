/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class ContainerMod {
    
    private String modelId;     //货柜机型
    private String modelName;   //机型名称
    private String cid;         //货柜编号
    private Integer type;      //货柜类型
    private String modelPicId;   //机型图片ID
    private String modelPicName; //机型图片名称
    private String vender;       //厂家

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }
    

    public String getModelPicId() {
        return modelPicId;
    }

    public void setModelPicId(String modelPicId) {
        this.modelPicId = modelPicId;
    }

    public String getModelPicName() {
        return modelPicName;
    }

    public void setModelPicName(String modelPicName) {
        this.modelPicName = modelPicName;
    }

    
    
    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
    
    
    
}
