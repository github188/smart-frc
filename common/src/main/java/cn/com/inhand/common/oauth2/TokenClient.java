package cn.com.inhand.common.oauth2;

import cn.com.inhand.common.config.Config;
import cn.com.inhand.common.dto.Error;
import cn.com.inhand.common.dto.OAuthErrorDto;
import cn.com.inhand.common.dto.TokenValidateResult;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.oltu.oauth2.client.OAuthClient;
import org.apache.oltu.oauth2.client.URLConnectionClient;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.client.response.OAuthAccessTokenResponse;
import org.apache.oltu.oauth2.client.response.OAuthJSONAccessTokenResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class TokenClient {

	public static final Logger logger = LoggerFactory.getLogger(TokenClient.class);
	// 静态变量
	private static final String ACCESS_TOKEN_URL = "oauth2/access_token";
	private ObjectId systemOId = new ObjectId("0000000000000000000ABCDE");
	ObjectMapper mapper = new ObjectMapper();
	private String clientId;
	private String clientSecret;
	private String validateUrl;
	private String autheInfoUrl;
	private String httpServerUri;
	private Config config;
	private String serverToken;
	private Long expiresIn;
	private Long creatTime;
	private String refreshToken;

	public TokenClient(Config config) {
		initConfig(config);
		initToken();
	}

	public void initConfig(Config config) {
		this.config = config;
		Map<String, Object> project = config.getProject();
		clientId = project.get("clientId").toString();
		clientSecret = project.get("clientSecret").toString();
		if (project.get("validateUrl") != null) {
			validateUrl = project.get("validateUrl").toString();
		}
		if (project.get("autheInfoUrl") != null) {
			autheInfoUrl = project.get("autheInfoUrl").toString();
		}
		httpServerUri = config.getHttpServerUri();
	}

	/**
	 * 初始化Token/重新获取Token
	 *
	 * @return
	 */
	public void initToken() {
		try {
			OAuthAccessTokenResponse oauthResponse = getServerTokenResponse(httpServerUri + ACCESS_TOKEN_URL, clientId, clientSecret, "");
			serverToken = oauthResponse.getAccessToken();
			refreshToken = oauthResponse.getRefreshToken();
			expiresIn = oauthResponse.getExpiresIn();
			creatTime = DateUtils.getUTC();
		} catch (Exception e) {
			// 如果获取Token报错了，说明某个服务比Oauth2先启动，则10秒后再获取
			logger.error("InitToken error, and try again in 10 seconds later!");
			new Timer().schedule(new TimerTask() {
				@Override
				public void run() {
					initToken();
				}
			}, 1000 * 10);
		}
	}

	public OAuthAccessTokenResponse getServerTokenResponse(String url, String clientId, String clientSecret, String redirectURI) throws OAuthSystemException, OAuthProblemException {
		OAuthClientRequest request = OAuthClientRequest.tokenLocation(url)
				.setGrantType(GrantType.CLIENT_CREDENTIALS)
				.setClientId(clientId)
				.setClientSecret(clientSecret)
				.setRedirectURI(redirectURI)
				.buildBodyMessage();
		OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());
		Class<? extends OAuthAccessTokenResponse> cl = OAuthJSONAccessTokenResponse.class;
		OAuthAccessTokenResponse oauthResponse = oAuthClient.accessToken(request, cl);
		return oauthResponse;
	}

	/**
	 * 刷新Token
	 *
	 * @return
	 */
	public String refreshServerToken() {
		String newServerToken = null;
		try {
			OAuthClientRequest request = OAuthClientRequest.tokenLocation(httpServerUri + ACCESS_TOKEN_URL)
					.setGrantType(GrantType.REFRESH_TOKEN)
					.setClientId(clientId)
					.setRefreshToken(refreshToken)
					.setClientSecret(clientSecret)
					.setRedirectURI("")
					.buildBodyMessage();
			OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());
			Class<? extends OAuthAccessTokenResponse> cl = OAuthJSONAccessTokenResponse.class;
			OAuthAccessTokenResponse oauthResponse = oAuthClient.accessToken(request, cl);
			serverToken = oauthResponse.getAccessToken();
			creatTime = DateUtils.getUTC();
			expiresIn = oauthResponse.getExpiresIn();
			newServerToken = serverToken;
		} catch (Exception e) {
			logger.info("Refresh Token expired!");
			initToken();
//            throw new ErrorCodeException(ErrorCode.REFRESH_TOKEN_ERROR, refreshToken);
		}
		return newServerToken;
	}

	/**
	 * if server token expires, refresh it
	 */
	public void validateAndRefreshServerToken() {
		if ((DateUtils.getUTC() - 60 - creatTime) < expiresIn) {
			logger.info("serverToken expires in {}", serverToken);
			refreshServerToken();
		}
	}

	public TokenValidateResult validateAccessToken(String checkedToken, String apiname, String method, int permissionId, int resourceType, ObjectId oId) {
		try {
			RestTemplate template = new RestTemplate();

			String url = validateUrl + "?access_token={checkedToken}&api_name={apiname}&method={method}" +
					"&permission_id={permissionId}" +
					"&resource_type={resourceType}&server_token={serverToken}";
			String result = template.postForObject(url,
					null,
					String.class,
					checkedToken,
					apiname,
					method,
					permissionId,
					resourceType,
					serverToken);
			if (!result.contains("error_code")) {
				TokenValidateResult resultDto = mapper.readValue(result, TokenValidateResult.class);
				if (resultDto.getOid() == null) {
					resultDto.setOid(oId);
					if (oId == null) {
						resultDto.setOid(systemOId);
					}
				}
				return resultDto;
			} else {
				OAuthErrorDto oAuthErrorDto = mapper.readValue(result, OAuthErrorDto.class);
				if (ErrorCode.SERVER_TOKEN_ERROR
						.getErrorCode() == oAuthErrorDto.getError_code() || ErrorCode.SERVER_TOKEN_EXPIRED
						.getErrorCode() == oAuthErrorDto
						.getError_code()) {
					// 刷新serviceToken
					refreshServerToken();
					// 手动调用validateAccessToken
					return validateAccessToken(checkedToken, apiname, method, permissionId, resourceType, oId);
				} else if (ErrorCode.REFRESH_TOKEN_ERROR
						.getErrorCode() == oAuthErrorDto.getError_code() || ErrorCode.REFRESH_TOKEN_EXPIRED
						.getErrorCode() == oAuthErrorDto
						.getError_code()) {
					// 重新获取serverToken以及 refreshToken
					initToken();
					// 手动调用validateAccessToken
					return validateAccessToken(checkedToken, apiname, method, permissionId, resourceType, oId);
				} else {
					throw new ErrorCodeException(mapper.readValue(result, Error.class));
				}
			}
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取serverToken
	 *
	 * @return
	 */
	public String getServerToken() {
		if (serverToken == null || serverToken.equals("")) {
			initToken();
		}
		return serverToken;
	}

	/**
	 * 获取refreshToken
	 *
	 * @return
	 */
	public String getRefreshToken() {
		if (refreshToken == null || refreshToken.equals("")) {
			initToken();
		}
		return refreshToken;
	}

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getAutheInfoUrl() {
		return autheInfoUrl;
	}

	public void setAutheInfoUrl(String autheInfoUrl) {
		this.autheInfoUrl = autheInfoUrl;
	}

	public String getClientSecret() {
		return clientSecret;
	}

	public String getValidateUrl() {
		return validateUrl;
	}

	public Config getConfig() {
		return config;
	}

	public void setConfig(Config config) {
		this.config = config;
	}


}
