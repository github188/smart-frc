package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 商品
 *
 * @author shixj
 *
 */
public class Goods {

    @Id
    @JsonProperty("_id")
    private ObjectId id;	            //唯一标识
    private ObjectId oid;	            //机构ID
    private ObjectId type;              //分类ID
    private String typeName;            //分类名称
    private String number;              //商品编号
    private String name;                //商品名称
    private String fullName;            //商品全称
    private int packingForm;            //包装形式：0瓶装，1罐装，2袋装
    private String manufacturer;        //生成厂家
    private int amount;                 //数量
    private String price;               //零售价
    private Long createTime;            //添加时间
    private Long updateTime;            //修改时间
    private String imagepath;           //商品图片路径 本地地址
    private String imageCdnPath;        //云存储地址
    private int ispromotion;            //是否促销 0:是 1：否
    private String payUrl;              //支付路径
    private String alipayUrl;           //支付宝支付路径
    private String nutritional;         //营养成分
    private String desc;          //备注
    private String netContent;   //净含量
    private String imagemd5;
    private String everyRong;//每箱容量
    private int chooseCount;//选中次数
    
    private Object descript1;
    private Object descript2;
    private Object descript3;
    
    private int state;//状态  0上架   1下架
    
    
    public Goods() {
    }

    public String getImageCdnPath() {
        return imageCdnPath;
    }

    public void setImageCdnPath(String imageCdnPath) {
        this.imageCdnPath = imageCdnPath;
    }
    

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    
    public Object getDescript1() {
        return descript1;
    }

    public void setDescript1(Object descript1) {
        this.descript1 = descript1;
    }

    public Object getDescript2() {
        return descript2;
    }

    public void setDescript2(Object descript2) {
        this.descript2 = descript2;
    }

    public Object getDescript3() {
        return descript3;
    }

    public void setDescript3(Object descript3) {
        this.descript3 = descript3;
    }

    

    
    
    
    
    public int getChooseCount() {
        return chooseCount;
    }

    public void setChooseCount(int chooseCount) {
        this.chooseCount = chooseCount;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    
    public String getEveryRong() {
        return everyRong;
    }

    public void setEveryRong(String everyRong) {
        this.everyRong = everyRong;
    }

    public String getImagemd5() {
        return imagemd5;
    }

    public void setImagemd5(String imagemd5) {
        this.imagemd5 = imagemd5;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getNetContent() {
        return netContent;
    }

    public void setNetContent(String netContent) {
        this.netContent = netContent;
    }


    public String getNutritional() {
        return nutritional;
    }

    public void setNutritional(String nutritional) {
        this.nutritional = nutritional;
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

    public ObjectId getType() {
        return type;
    }

    public void setType(ObjectId type) {
        this.type = type;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
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

    public int getPackingForm() {
        return packingForm;
    }

    public void setPackingForm(int packingForm) {
        this.packingForm = packingForm;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
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

    public String getImagepath() {
        return imagepath;
    }

    public void setImagepath(String imagepath) {
        this.imagepath = imagepath;
    }

    public int getIspromotion() {
        return ispromotion;
    }

    public void setIspromotion(int ispromotion) {
        this.ispromotion = ispromotion;
    }

    public String getPayUrl() {
        return payUrl;
    }

    public void setPayUrl(String payUrl) {
        this.payUrl = payUrl;
    }

    public String getAlipayUrl() {
        return alipayUrl;
    }

    public void setAlipayUrl(String alipayUrl) {
        this.alipayUrl = alipayUrl;
    }
}
