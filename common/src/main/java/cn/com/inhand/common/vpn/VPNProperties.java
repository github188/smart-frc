package cn.com.inhand.common.vpn;

import java.util.Map;

import org.apache.commons.collections.MapUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.com.inhand.common.config.Config;
import cn.com.inhand.common.util.GenerateMD5;

public class VPNProperties {

	private static final Logger logger = LoggerFactory.getLogger(VPNProperties.class);

    private Config config;
    public String openVpnCa;
    public String apiServerIP;
    public String clientId;
    public String clientSecret;
    public String clientName;
    

    public VPNProperties(Config config) {
        this.config = config;
        this.initVpnProperties();
    }

    /*
     * @ initialize the vpn properties
     */
    private void initVpnProperties() {
        Map<String, Object> project = this.config.getProject();
        if (project.get("openVpnCa") != null) {
            this.setOpenVpnCa(project.get("openVpnCa").toString());
        }else{
        	logger.error("openVpnCa is null: {}",this.getOpenVpnCa());
        }
        if(project.get("clientId") != null) {
        	this.setClientId(MapUtils.getString(project, "clientId"));
        }else{
        	logger.error("clientId is null: {}",this.getClientId());
        }
        if(project.get("clientSecret") != null) {
        	this.setClientSecret(MapUtils.getString(project, "clientSecret"));
        }else{
        	logger.error("clientSecret is null: {}",this.getClientSecret());
        }
        if(project.get("apiServerIP") != null) {
        	this.setApiServerIP(MapUtils.getString(project, "apiServerIP"));
        }else{
        	logger.error("apiServerIP is null: {}",this.getApiServerIP());
        }
        if(config.getProjectName() != null){
        	this.setClientName(config.getProjectName());
        }
    }
    
	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public String getApiServerIP() {
		return apiServerIP;
	}

	public void setApiServerIP(String apiServerIP) {
		this.apiServerIP = apiServerIP;
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

	/**
     * @return the openVpnCa
     */
    public String getOpenVpnCa() {
        return openVpnCa;
    }


    /**
     * @param openVpnCa the openVpnCa to set
     */
    public void setOpenVpnCa(String openVpnCa) {
        this.openVpnCa = openVpnCa;
    }


    public static String getVPNPasswd(String str) {
        return GenerateMD5.createPassword(str);
    }

    public String getDefaultOpenVpnCa() {
        String ca = "-----BEGIN CERTIFICATE-----\n" +
                "MIIDyzCCAzSgAwIBAgIJAI4vujFIYL/2MA0GCSqGSIb3DQEBBQUAMIGgMQswCQYD\n" +
                "VQQGEwJDTjEQMA4GA1UECBMHU2lDaHVhbjEQMA4GA1UEBxMHQ2hlbmdkdTEYMBYG\n" +
                "A1UEChMPSW5IYW5kIE5ldHdvcmtzMREwDwYDVQQLEwhwbGF0Zm9ybTEOMAwGA1UE\n" +
                "AxMFcXVlcnkxFDASBgNVBCkTC0RldmljZVRvdWNoMRowGAYJKoZIhvcNAQkBFgtp\n" +
                "ZmptQHFxLmNvbTAeFw0xMzEwMTYwNTM3NTRaFw0yMzEwMTQwNTM3NTRaMIGgMQsw\n" +
                "CQYDVQQGEwJDTjEQMA4GA1UECBMHU2lDaHVhbjEQMA4GA1UEBxMHQ2hlbmdkdTEY\n" +
                "MBYGA1UEChMPSW5IYW5kIE5ldHdvcmtzMREwDwYDVQQLEwhwbGF0Zm9ybTEOMAwG\n" +
                "A1UEAxMFcXVlcnkxFDASBgNVBCkTC0RldmljZVRvdWNoMRowGAYJKoZIhvcNAQkB\n" +
                "FgtpZmptQHFxLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAvSeR5DfY\n" +
                "nXBL7e9sg1Nx2edmm5Wk55Ro/3Jnm3uvliErpyeum+puCQLfFgTqeXOZ2Cp9URYh\n" +
                "Xh3pxqv/tPqi7ObJFFOVGDF8/cJp6BdEBHAucgc7JW+m7ZMAh+u983qaU68guquj\n" +
                "L6mSPqDZWJqAb2fKWubJ49V9HUDRHlIjI6UCAwEAAaOCAQkwggEFMB0GA1UdDgQW\n" +
                "BBQJDLfgOFUjg58wtnxUruGat8ar9DCB1QYDVR0jBIHNMIHKgBQJDLfgOFUjg58w\n" +
                "tnxUruGat8ar9KGBpqSBozCBoDELMAkGA1UEBhMCQ04xEDAOBgNVBAgTB1NpQ2h1\n" +
                "YW4xEDAOBgNVBAcTB0NoZW5nZHUxGDAWBgNVBAoTD0luSGFuZCBOZXR3b3JrczER\n" +
                "MA8GA1UECxMIcGxhdGZvcm0xDjAMBgNVBAMTBXF1ZXJ5MRQwEgYDVQQpEwtEZXZp\n" +
                "Y2VUb3VjaDEaMBgGCSqGSIb3DQEJARYLaWZqbUBxcS5jb22CCQCOL7oxSGC/9jAM\n" +
                "BgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBABS0D+JHKADX+T4sLOG70tvy\n" +
                "t3EbLwDlqcZ6ukzKxFd1FP1Rzutdt8K7uAHGr9Fbv5aWCVdzYoPDvt8MKAtasQkV\n" +
                "rL/+dHTmePtC/qzyiXiVO54gRmame91VRbNDiasQiYT2fxht9ga7cB7aLqF2g57L\n" +
                "hDL9K1jwY59lebesexvr\n" +
                "-----END CERTIFICATE-----";
        return ca;
    }


}
