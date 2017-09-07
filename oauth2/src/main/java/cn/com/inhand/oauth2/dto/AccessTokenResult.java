package cn.com.inhand.oauth2.dto;

/**
 * Created with IntelliJ IDEA.
 * User: Jerolin
 * Date: 13-10-12
 * Time: 下午5:44
 * To change this template use File | Settings | File Templates.
 */
public class AccessTokenResult {
    private String clientId;
    private String accessToken;
    private String refreshToken;
    private String expiresIn;
    private String refreshTokenExpiresIn;
    private String ip;
    
	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(String expiresIn) {
		this.expiresIn = expiresIn;
	}

	public String getRefreshTokenExpiresIn() {
		return refreshTokenExpiresIn;
	}

	public void setRefreshTokenExpiresIn(String refreshTokenExpiresIn) {
		this.refreshTokenExpiresIn = refreshTokenExpiresIn;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public AccessTokenResult(String clientId, String accessToken,
			String refreshToken, String expiresIn,
			String refreshTokenExpiresIn, String ip) {
		super();
		this.clientId = clientId;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.expiresIn = expiresIn;
		this.refreshTokenExpiresIn = refreshTokenExpiresIn;
		this.ip = ip;
	}
    
}
