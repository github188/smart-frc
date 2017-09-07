package cn.com.inhand.common.smart.model;
/**
 * 百度钱包
 * @author shixj
 *
 */
public class Baidu {
	private String clientId;
	private String clientSecret;
	private String pay_url;
	private String pay_refund;
	private String pay_refund_by_order;
        private String shipmentNotice;
	public Baidu() {
	}
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public String getClientSecret() {
		return clientSecret;
	}
	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}
	public String getPay_url() {
		return pay_url;
	}
	public void setPay_url(String pay_url) {
		this.pay_url = pay_url;
	}
	public String getPay_refund() {
		return pay_refund;
	}
	public void setPay_refund(String pay_refund) {
		this.pay_refund = pay_refund;
	}
	public String getPay_refund_by_order() {
		return pay_refund_by_order;
	}
	public void setPay_refund_by_order(String pay_refund_by_order) {
		this.pay_refund_by_order = pay_refund_by_order;
	}

        public String getShipmentNotice() {
            return shipmentNotice;
        }

        public void setShipmentNotice(String shipmentNotice) {
            this.shipmentNotice = shipmentNotice;
        }
	
}
