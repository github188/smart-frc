package cn.com.inhand.common.smart.model;
/**
 * 支付宝
 * @author shixj
 *
 */
public class AliPay {
	private String pid;
	private String key;
        private String shipmentNotice;
        private String version;
        private String appId;
        private String alipublicKey;
        private String localpublicKey;
        private String localprivateKey;
        private String counterfee;//手续费
                      
    public String getCounterfee() {
        return counterfee;
    }

    public void setCounterfee(String counterfee) {
        this.counterfee = counterfee;
    }
        
        
	public AliPay(){
		
	}

        public String getLocalprivateKey() {
            return localprivateKey;
        }

        public void setLocalprivateKey(String localprivateKey) {
            this.localprivateKey = localprivateKey;
        }

        

        
        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getAppId() {
            return appId;
        }

        public void setAppId(String appId) {
            this.appId = appId;
        }

        public String getAlipublicKey() {
            return alipublicKey;
        }

        public void setAlipublicKey(String alipublicKey) {
            this.alipublicKey = alipublicKey;
        }

        public String getLocalpublicKey() {
            return localpublicKey;
        }

        public void setLocalpublicKey(String localpublicKey) {
            this.localpublicKey = localpublicKey;
        }
        
        
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}

        public String getShipmentNotice() {
            return shipmentNotice;
        }

        public void setShipmentNotice(String shipmentNotice) {
            this.shipmentNotice = shipmentNotice;
        }
	
}
