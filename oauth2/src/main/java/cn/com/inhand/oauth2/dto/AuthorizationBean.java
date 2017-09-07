package cn.com.inhand.oauth2.dto;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.model.RefreshToken;
import cn.com.inhand.common.model.Token;

public class AuthorizationBean {
	private Token accessToken;
	private RefreshToken refreshToken;
	private String access_token;
	private String refresh_token;
	private String authzCode;
	private Client client;
	private Integer pwdType;
	private String picId;
	private String varificationCode;
	private String username;
	private String password;
	private String ip;
	private Integer language;
	private String grantType;
	
	
	public AuthorizationBean(){};

	/**
	 * AUTHORIZATION_CODE
	 * @param authzCode
	 * @param client
	 */
	public AuthorizationBean(String authzCode, Client client) {
		super();
		this.authzCode = authzCode;
		this.client = client;
	}

	/**
	 * PASSWORD
	 * @param client
	 * @param pwdType
	 * @param picId
	 * @param varificationCode
	 * @param username
	 * @param password
	 * @param ip
	 * @param language
	 */
	public AuthorizationBean(Client client, Integer pwdType, String picId,
			String varificationCode, String username, String password,
			String ip, Integer language, String validateResult) {
		super();
		this.client = client;
		this.pwdType = pwdType;
		this.picId = picId;
		this.varificationCode = varificationCode;
		this.username = username;
		this.password = password;
		this.ip = ip;
		this.language = language;
	}

	/**
	 * REFRESH_TOKEN
	 * @param refreshToken
	 * @param client
	 */
	public AuthorizationBean(RefreshToken refreshToken, Client client) {
		super();
		this.refreshToken = refreshToken;
		this.client = client;
	}

	/**
	 * CLIENT_CREDENTIALS
	 * @param client
	 */
	public AuthorizationBean(Client client) {
		super();
		this.client = client;
	}

	public RefreshToken getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(RefreshToken refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getAuthzCode() {
		return authzCode;
	}

	public void setAuthzCode(String authzCode) {
		this.authzCode = authzCode;
	}

	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	public Integer getPwdType() {
		return pwdType;
	}

	public void setPwdType(Integer pwdType) {
		this.pwdType = pwdType;
	}

	public String getPicId() {
		return picId;
	}

	public void setPicId(String picId) {
		this.picId = picId;
	}

	public String getVarificationCode() {
		return varificationCode;
	}

	public void setVarificationCode(String varificationCode) {
		this.varificationCode = varificationCode;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public Integer getLanguage() {
		return language;
	}

	public void setLanguage(Integer language) {
		this.language = language;
	}

	public Token getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(Token accessToken) {
		this.accessToken = accessToken;
	}

	public String getGrantType() {
		return grantType;
	}

	public void setGrantType(String grantType) {
		this.grantType = grantType;
	}

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	public String getRefresh_token() {
		return refresh_token;
	}

	public void setRefresh_token(String refresh_token) {
		this.refresh_token = refresh_token;
	}

	@Override
	public String toString() {
		return "AuthorizationBean ["
				+ (accessToken != null ? "accessToken=" + accessToken + ", "
						: "")
				+ (refreshToken != null ? "refreshToken=" + refreshToken + ", "
						: "")
				+ (access_token != null ? "access_token=" + access_token + ", "
						: "")
				+ (refresh_token != null ? "refresh_token=" + refresh_token
						+ ", " : "")
				+ (authzCode != null ? "authzCode=" + authzCode + ", " : "")
				+ (client != null ? "client=" + client + ", " : "")
				+ (pwdType != null ? "pwdType=" + pwdType + ", " : "")
				+ (picId != null ? "picId=" + picId + ", " : "")
				+ (varificationCode != null ? "varificationCode="
						+ varificationCode + ", " : "")
				+ (username != null ? "username=" + username + ", " : "")
				+ (password != null ? "password=" + password + ", " : "")
				+ (ip != null ? "ip=" + ip + ", " : "")
				+ (language != null ? "language=" + language + ", " : "")
				+ (grantType != null ? "grantType=" + grantType : "") + "]";
	}

}
