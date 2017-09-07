package cn.com.inhand.centra.device.model;

import java.util.List;
/**
 * 发送用户邮件和打分
 * 
 * @author puys
 *
 */
public class GuesterMailModel {

	/** 邮件地址 */
	//@Pattern(regexp = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$", message = "邮件地址不正确")
	private String address;
	
	/** 订单编号 */
	//@NotEmpty(message = "订单号不能为空")
	private List<String> orderNos;
	
	/** 交易id */
	//@NotEmpty(message = "交易编号不能为空")
	private String tradeId;
	
	/** 打分 */
	private String score;

	/**
	 * 获取邮件地址
	 * 
	 * @return address 邮件地址
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * 设置邮件地址
	 * 
	 * @param address
	 *            邮件地址
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	

	/**
	 * 获取订单编号
	 * @return orderNos 订单编号
	 */
	public List<String> getOrderNos() {
		return orderNos;
	}

	/**
	 * 设置订单编号
	 * @param orderNos 订单编号
	 */
	public void setOrderNos(List<String> orderNos) {
		this.orderNos = orderNos;
	}

	/**
	 * 获取交易id
	 * 
	 * @return tradeId 交易id
	 */
	public String getTradeId() {
		return tradeId;
	}

	/**
	 * 设置交易id
	 * 
	 * @param tradeId
	 *            交易id
	 */
	public void setTradeId(String tradeId) {
		this.tradeId = tradeId;
	}

	/**
	 * 获取打分
	 * 
	 * @return score 打分
	 */
	public String getScore() {
		return score;
	}

	/**
	 * 设置打分
	 * 
	 * @param score 打分
	 */
	public void setScore(String score) {
		this.score = score;
	}

	/*public static void main(String[] args) {
		
		String reg = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
		java.util.regex.Pattern regex = java.util.regex.Pattern.compile(reg);
		Matcher matcher = regex.matcher("puys@sina.com"); 
		System.out.println(matcher.matches());  
	}*/
}
