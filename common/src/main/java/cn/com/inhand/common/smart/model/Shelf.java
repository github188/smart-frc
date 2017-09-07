/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class Shelf {
    
    private String shelvesId;
    private String price;
    private String goodsId;
    private String goodsName;
    private String imagepath;
    private String imagemd5;
    private Integer capacity;  //容量
    private Integer valve;   //阀值
    private String imageCdnPath;

    public String getImageCdnPath() {
        return imageCdnPath;
    }

    public void setImageCdnPath(String imageCdnPath) {
        this.imageCdnPath = imageCdnPath;
    }
    
    

    public String getImagemd5() {
        return imagemd5;
    }

    public void setImagemd5(String imagemd5) {
        this.imagemd5 = imagemd5;
    }

    
    
    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getValve() {
        return valve;
    }

    public void setValve(Integer valve) {
        this.valve = valve;
    }

    public String getImagepath() {
        return imagepath;
    }

    public void setImagepath(String imagepath) {
        this.imagepath = imagepath;
    }

    
    public String getShelvesId() {
        return shelvesId;
    }

    public void setShelvesId(String shelvesId) {
        this.shelvesId = shelvesId;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
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
    
    
    
}
