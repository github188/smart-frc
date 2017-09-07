/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class TemperDetail {
    
    
    private String engyOnT;  // 节能开时间
    private String engyOffT;  // 节能关时间
    private String lampOnT;  // 日光灯开时间
    private String lampOffT;  // 日光灯关时间
    private Integer cryTemUL;  // 制冷温度上限
    private Integer cryTemDL;  // 制冷温度下限
    private Integer heatTemUL;  // 制热温度上限
    private Integer heatTemDL;  // 制热温度下限
    private Integer leftRmTem;  // 左室温度
    private Integer rightRmTem;  // 右室温度
    private Integer leftRmRef;  //左室制冷
    private Integer rightRmRef;  //右室制冷
    private Integer leftRmHeat;  //左室制热
    private Integer rightRmHeat;  //右室制热
    private Integer lampNorOp;  //日光灯常开
    private Integer lampAut;  //日光灯自动
     private String commonField;

    public String getCommonField() {
        return commonField;
    }

    public void setCommonField(String commonField) {
        this.commonField = commonField;
    }

    public Integer getCryTemUL() {
        return cryTemUL;
    }

    public void setCryTemUL(Integer cryTemUL) {
        this.cryTemUL = cryTemUL;
    }

    public Integer getCryTemDL() {
        return cryTemDL;
    }

    public void setCryTemDL(Integer cryTemDL) {
        this.cryTemDL = cryTemDL;
    }

    public Integer getHeatTemUL() {
        return heatTemUL;
    }

    public void setHeatTemUL(Integer heatTemUL) {
        this.heatTemUL = heatTemUL;
    }

    public Integer getHeatTemDL() {
        return heatTemDL;
    }

    public void setHeatTemDL(Integer heatTemDL) {
        this.heatTemDL = heatTemDL;
    }

    public Integer getLeftRmTem() {
        return leftRmTem;
    }

    public void setLeftRmTem(Integer leftRmTem) {
        this.leftRmTem = leftRmTem;
    }

    public Integer getRightRmTem() {
        return rightRmTem;
    }

    public void setRightRmTem(Integer rightRmTem) {
        this.rightRmTem = rightRmTem;
    }

    public Integer getLeftRmRef() {
        return leftRmRef;
    }

    public void setLeftRmRef(Integer leftRmRef) {
        this.leftRmRef = leftRmRef;
    }

    public Integer getRightRmRef() {
        return rightRmRef;
    }

    public void setRightRmRef(Integer rightRmRef) {
        this.rightRmRef = rightRmRef;
    }

    public Integer getLeftRmHeat() {
        return leftRmHeat;
    }

    public void setLeftRmHeat(Integer leftRmHeat) {
        this.leftRmHeat = leftRmHeat;
    }

    public Integer getRightRmHeat() {
        return rightRmHeat;
    }

    public void setRightRmHeat(Integer rightRmHeat) {
        this.rightRmHeat = rightRmHeat;
    }

    public Integer getLampNorOp() {
        return lampNorOp;
    }

    public void setLampNorOp(Integer lampNorOp) {
        this.lampNorOp = lampNorOp;
    }

    public Integer getLampAut() {
        return lampAut;
    }

    public void setLampAut(Integer lampAut) {
        this.lampAut = lampAut;
    }

    
    public String getEngyOnT() {
        return engyOnT;
    }

    public void setEngyOnT(String engyOnT) {
        this.engyOnT = engyOnT;
    }

    public String getEngyOffT() {
        return engyOffT;
    }

    public void setEngyOffT(String engyOffT) {
        this.engyOffT = engyOffT;
    }

    public String getLampOnT() {
        return lampOnT;
    }

    public void setLampOnT(String lampOnT) {
        this.lampOnT = lampOnT;
    }

    public String getLampOffT() {
        return lampOffT;
    }

    public void setLampOffT(String lampOffT) {
        this.lampOffT = lampOffT;
    }
    
    
    
}
