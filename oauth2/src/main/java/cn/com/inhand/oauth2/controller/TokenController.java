package cn.com.inhand.oauth2.controller;

import cn.com.inhand.common.dto.Error;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.model.RefreshToken;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.util.HttpRequestUtils;
import cn.com.inhand.oauth2.dto.AuthorizationBean;
import cn.com.inhand.oauth2.factory.OAuth2Factory;
import cn.com.inhand.oauth2.service.OAuth2Service;
import cn.com.inhand.oauth2.service.OAuthTokenhandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.StringUtils;
import org.apache.oltu.oauth2.as.request.OAuthTokenRequest;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * @author franklin.li
 */
@Controller
public class TokenController extends HandleExceptionController {

    @Autowired
    private OAuth2Factory oauth2Factory;
    @Autowired
    private OAuth2Service oauth2DAO;
    @Autowired
    private OAuthTokenhandler oAuthTokenhandler;
    @Autowired
    private ObjectMapper mapper;
    private static final Logger logger = LoggerFactory.getLogger(TokenController.class);

    @RequestMapping(value = "/get_token_info", method = RequestMethod.GET)
    public @ResponseBody
    Object getTokenInfo(@RequestParam("access_token") String accessToken) {
        Token token = oauth2DAO.getTokenInfo(accessToken);
        if (token == null) {
            throw new ErrorCodeException(ErrorCode.EXPIRED_TOKEN, accessToken);
        }
        return token;
    }

    @RequestMapping(value = "/access_token", method = RequestMethod.POST)
    public @ResponseBody
    Object getToken(HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(required = false, defaultValue = "2") int language,
            @RequestParam(value = "password_type", required = false, defaultValue = "3") int passwordType,
            @RequestParam(value = "picId", required = false) String picId,
            @RequestParam(value = "varificationCode", required = false) String varificationCode)
            throws OAuthSystemException, OAuthProblemException, Exception {
        OAuthTokenRequest oAuth2Request = new OAuthTokenRequest(request);

        AuthorizationBean authBean = new AuthorizationBean();
        authBean.setGrantType(oAuth2Request.getGrantType());
        authBean.setAuthzCode(oAuth2Request.getCode());

        authBean.setRefresh_token(oAuth2Request.getRefreshToken());
        authBean.setUsername(oAuth2Request.getUsername());
        authBean.setPassword(oAuth2Request.getPassword());
        authBean.setPwdType(passwordType);
        authBean.setPicId(picId);
        authBean.setVarificationCode(varificationCode);
        authBean.setIp(HttpRequestUtils.getIpAddr(request));
        authBean.setLanguage(language);
        authBean.setClient(oauth2DAO.getClient(new ObjectId(StringUtils.leftPad(oAuth2Request.getClientId(), 24, '0')), oAuth2Request.getClientSecret()));
        Token accessToken = oauth2Factory.generateToken(authBean);
        if (accessToken != null) {
            accessToken = oAuthTokenhandler.handleToken(accessToken, authBean.getIp());
            RefreshToken refreshToken = null;
            if (authBean.getRefresh_token() == null) {
                refreshToken = oAuthTokenhandler.handleRefreshToken(authBean.getClient().getId(), accessToken.getUsername());
            } else {//refresh_token
                refreshToken = authBean.getRefreshToken();
            }
            OAuthResponse r = OAuthASResponse
                    .tokenResponse(HttpServletResponse.SC_OK)
                    .setAccessToken(accessToken.getToken())
                    .setExpiresIn(String.valueOf(accessToken.getExpiresIn()))
                    .setRefreshToken(refreshToken.getRefreshToken()).buildJSONMessage();
            response.setStatus(r.getResponseStatus());
            return mapper.readValue(r.getBody(), Map.class);
        } else {
            return new Error("oauth2/access_token", ErrorCode.ACCESS_DENIED);
        }
    }
}
