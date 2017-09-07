package cn.com.inhand.common.smart.model;

public class GoodsConfig {

    private String location_id;
    private String button_id;
    private String goods_id;
    private String goods_name;
    private String goods_type;    //商品类型的id
    private String goods_typeName; //商品类型的名称
    private String price;
    private String img_cdn;//存存储地址
    private String img;
    private String payment_url;
    private String alipay_url;
    private String imagemd5;
    private String status;     //状态
    private Integer capacity;  //容量
    private Integer valve;   //阀值

    public String getImg_cdn() {
        return img_cdn;
    }

    public void setImg_cdn(String img_cdn) {
        this.img_cdn = img_cdn;
    }
    
    
    public String getButton_id() {
        return button_id;
    }

    public void setButton_id(String button_id) {
        this.button_id = button_id;
    }
 
    
    public String getImagemd5() {
        return imagemd5;
    }

    public void setImagemd5(String imagemd5) {
        this.imagemd5 = imagemd5;
    }

    public String getLocation_id() {
        return location_id;
    }

    public void setLocation_id(String location_id) {
        this.location_id = location_id;
    }

    public String getGoods_id() {
        return goods_id;
    }

    public void setGoods_id(String goods_id) {
        this.goods_id = goods_id;
    }

    public String getGoods_name() {
        return goods_name;
    }

    public void setGoods_name(String goods_name) {
        this.goods_name = goods_name;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getPayment_url() {
        return payment_url;
    }

    public void setPayment_url(String payment_url) {
        this.payment_url = payment_url;
    }

    public String getAlipay_url() {
        return alipay_url;
    }

    public void setAlipay_url(String alipay_url) {
        this.alipay_url = alipay_url;
    }

    public String getGoods_typeName() {
        return goods_typeName;
    }

    public void setGoods_typeName(String goods_typeName) {
        this.goods_typeName = goods_typeName;
    }

    public String getGoods_type() {
        return goods_type;
    }

    public void setGoods_type(String goods_type) {
        this.goods_type = goods_type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
    
}
