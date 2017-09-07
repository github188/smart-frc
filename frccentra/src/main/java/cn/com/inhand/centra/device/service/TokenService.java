package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.TokenDAO;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class TokenService implements TokenDAO{

	@Autowired
	RestTemplate template;

	@Value("#{config.httpServerUri}")
	String httpServerUrl;
	
	@Override
	public String getTokenKey(ObjectId clientId, String appKey) {
		StringBuffer tokenUrl = new StringBuffer();
		tokenUrl.append(httpServerUrl).append("oauth2/access_token");
		tokenUrl.append("?grant_type=").append("client_credentials");
		tokenUrl.append("&client_id=").append(clientId);
		tokenUrl.append("&client_secret=").append(appKey);
		@SuppressWarnings("unchecked")
		Map<String, Object> requestMap = template.postForObject(tokenUrl.toString(), null, Map.class);
		if (requestMap.get("access_token") != null) {
			return requestMap.get("access_token").toString();
		} else {
			throw new Error(requestMap.toString());
		}
	}

}
