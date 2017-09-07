/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class MasterModelConfig {
    
    private String modelId;		//主柜型号id
    private String modelName;    //主柜型号名称
       
    private Integer masterTypeNew; //主柜的售货机类型
    
    private String vender;       //厂家
    private String venderNum;    //厂家编号
    
    private String modelPicId;
    private String modelPicName;

    public String getVenderNum() {
        return venderNum;
    }

    public void setVenderNum(String venderNum) {
        this.venderNum = venderNum;
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


    public Integer getMasterTypeNew() {
        return masterTypeNew;
    }

    public void setMasterTypeNew(Integer masterTypeNew) {
        this.masterTypeNew = masterTypeNew;
    }

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }
    
    
    
}
