package cn.com.inhand.oauth2.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AuthenticateService {

    @Autowired
    private RestTemplate template;
    @Autowired
    private ObjectMapper mapper;
    @Value("#{config.httpServerUri}")
    String httpServerUri;
    @Value("#{config.project.authenticateUrl}")
    private String authenticateUrl;
    @Value("#{config.project.validateUrl}")
    private String validateUrl;
    @Value("#{config.httpServerUri}")
    String baseUri;

    @SuppressWarnings({"unused", "rawtypes", "unchecked"})
    public HashMap<String, Object> validateCreditials(String clientId, String username,
            String password, String ip, int language,
            String picId, int passwordType) {
        boolean allow = false;
        Map<String, Object> body = new HashMap<String, Object>();
        body.put("clientId", clientId);
        body.put("username", username);
        body.put("password", password);
        body.put("ip", ip);
        if (passwordType == 3) {
            body.put("picId", picId);
        }
        body.put("passwordType", passwordType);
        //body.put("varificationCode", varificationCode);
        Map validateResult = template.postForObject(authenticateUrl
                + "?language=" + language, body, Map.class);
        return new HashMap<String, Object>(validateResult);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> authVerificationCode(Map<String, String> mapPram) {
        String url = baseUri + "api/captchas";
        return template.postForObject(url, mapPram, Map.class);
    }
}
