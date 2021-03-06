/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.special.dto;

import cn.com.inhand.smart.formulacar.model.SpecialConfig;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author liqiang
 */
public class SpecialBean {
    private ObjectId oid;	         //机构ID
    private String name;    //活动名称
    private Integer type;   //活动类型   1 打折  2 立减
    private List<Integer> types;
    private List<String> siteNum;   //设置参与的店面编号
    private List<SpecialConfig> specialConfig;  //打折配置
    private Long startTime;
    private Long endTime;
    private Long createTime;

    public List<Integer> getTypes() {
        return types;
    }

    public void setTypes(List<Integer> types) {
        this.types = types;
    }

    
    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public List<String> getSiteNum() {
        return siteNum;
    }

    public void setSiteNum(List<String> siteNum) {
        this.siteNum = siteNum;
    }

    public List<SpecialConfig> getSpecialConfig() {
        return specialConfig;
    }

    public void setSpecialConfig(List<SpecialConfig> specialConfig) {
        this.specialConfig = specialConfig;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
    
    
    
}
