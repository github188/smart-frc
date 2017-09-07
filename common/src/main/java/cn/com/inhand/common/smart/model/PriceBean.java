package cn.com.inhand.common.smart.model;
import org.bson.types.ObjectId;
/**
 * 
 * @author shixj
 *
 */
public class PriceBean {
	private String preferential_price;  //优惠价
	private String micropay_price;      //微信支付价格
	private String alipay_price;        //支付宝支付价格
	private String baiduPay_price;      //百付宝支付价格
	private ObjectId goodsIds;//商品ID
	private String name;//商品名称
	
	public PriceBean(){
		
	}
	public String getPreferential_price() {
		return preferential_price;
	}
	public void setPreferential_price(String preferential_price) {
		this.preferential_price = preferential_price;
	}
	public String getMicropay_price() {
		return micropay_price;
	}
	public void setMicropay_price(String micropay_price) {
		this.micropay_price = micropay_price;
	}
	public String getAlipay_price() {
		return alipay_price;
	}
	public void setAlipay_price(String alipay_price) {
		this.alipay_price = alipay_price;
	}
	public String getBaiduPay_price() {
		return baiduPay_price;
	}
	public void setBaiduPay_price(String baiduPay_price) {
		this.baiduPay_price = baiduPay_price;
	}
	public ObjectId getGoodsIds() {
		return goodsIds;
	}
	public void setGoodsIds(ObjectId goodsIds) {
		this.goodsIds = goodsIds;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
