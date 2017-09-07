/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class GoodsReplenishForecast {
    
    
    private String goodsId;
    private String goodsName;
    private Integer salesNum;  //销量
    private Integer initForecast;   //初始预测
    private Integer sugNum;           //建议数量
    private Double tempRate;      //预测占比
    private Long lastTime;    //上次补货时间
    private Long forecastTime; //预测时间
    
    private Integer maxSales;
    private Integer planNum;

    public Integer getPlanNum() {
        return planNum;
    }

    public void setPlanNum(Integer planNum) {
        this.planNum = planNum;
    }

    
    public Integer getMaxSales() {
        return maxSales;
    }

    public void setMaxSales(Integer maxSales) {
        this.maxSales = maxSales;
    }
    
    

    public Long getLastTime() {
        return lastTime;
    }

    public void setLastTime(Long lastTime) {
        this.lastTime = lastTime;
    }

    public Long getForecastTime() {
        return forecastTime;
    }

    public void setForecastTime(Long forecastTime) {
        this.forecastTime = forecastTime;
    }

    
    
    public Double getTempRate() {
        return tempRate;
    }

    public void setTempRate(Double tempRate) {
        this.tempRate = tempRate;
    }

    
    
    
    public Integer getSugNum() {
        return sugNum;
    }

    public void setSugNum(Integer sugNum) {
        this.sugNum = sugNum;
    }
    

    
    public Integer getInitForecast() {
        return initForecast;
    }

    public void setInitForecast(Integer initForecast) {
        this.initForecast = initForecast;
    }
    

    
    public String getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(String goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Integer getSalesNum() {
        return salesNum;
    }

    public void setSalesNum(Integer salesNum) {
        this.salesNum = salesNum;
    }
    
    
    
}
