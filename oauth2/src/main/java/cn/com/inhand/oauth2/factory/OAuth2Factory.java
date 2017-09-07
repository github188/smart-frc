package cn.com.inhand.oauth2.factory;

import java.util.HashMap;
import java.util.Map;

import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.com.inhand.common.dto.Error;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.model.Oauth2Code;
import cn.com.inhand.common.model.RefreshToken;
import cn.com.inhand.common.model.Role;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.model.User;
import cn.com.inhand.common.oauth2.ReliableType;
import cn.com.inhand.common.util.PrivilegesUtils;
import cn.com.inhand.oauth2.dto.AuthorizationBean;
import cn.com.inhand.oauth2.service.AuthenticateService;
import cn.com.inhand.oauth2.service.OAuth2Service;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 *
 * @author franklin.li
 *
 */
@Component
public class OAuth2Factory {

    @Autowired
    private OAuth2Service oauth2DAO;
    @Autowired
    private AuthenticateService authenticateDAO;
    @Autowired
    private ObjectMapper mapper;

    public Token generateToken(AuthorizationBean authBean) throws Exception {
        Token token = null;
        //通过判断许可类型，来处理不同的认证请求方式
        switch (GrantType.valueOf(authBean.getGrantType().toUpperCase())) {
            //授权码认证方式，得到access_token
            case AUTHORIZATION_CODE:
                token = authorizationCode(authBean.getClient(), authBean.getAuthzCode());
                break;
            //资源拥有者凭证方式，得到access_token
            case PASSWORD:
                token = authorizationPwd(authBean.getClient(),
                        authBean.getPwdType(),
                        authBean.getPicId(),
                        authBean.getVarificationCode(),
                        authBean.getUsername(),
                        authBean.getPassword(),
                        authBean.getIp(),
                        authBean.getLanguage());
                break;
            //通过刷新令牌，重新获取access_token
            case REFRESH_TOKEN:
                authBean.setRefreshToken(authorizationRefreshToken(authBean.getClient(), authBean.getRefresh_token()));
                token = reAuthorizationToken(authBean.getRefreshToken(), authBean.getClient());
                break;
            //通过客户端私有凭证，获取access_token
            case CLIENT_CREDENTIALS:
                token = authorizationClient(authBean.getClient());
                token.setUsername(authBean.getClient().getName());
                break;
            default:
                Error error = new Error("oauth2/access_token", ErrorCode.UNSUPPORTED_GRANT_TYPE);
                throw new ErrorCodeException(error);
        }
        return token;
    }

    private Token authorizationClient(Client client) {
        Token token = null;
        if (client == null || (client != null && client.getReliable() != null && client.getReliable().equals(ReliableType.PUBLIC.getName()))) {
            throw new ErrorCodeException(ErrorCode.ACCESS_DENIED);
        } else {
            token = new Token();
            token.setClientId(client.getId());

            Map<String, Object> test = client.getPrivileges();
            Object s[] = test.keySet().toArray();
            for (int i = 0; i < test.size(); i++) {
                System.out.println(test.get(s[i]) + "   key:" + s[i]);
            }

            token.setPrivileges(client.getPrivileges());
            token.setExpiresIn(client.getAgeing());
            token.setOid(client.getOid());
            token.setUsername(client.getName());
            token.setName(client.getName());
        }
        return token;
    }

    private Token reAuthorizationToken(RefreshToken refreshToken, Client client) {
        Token token = null;
        if (refreshToken != null && client != null) {
            if (client.getReliable().equals(ReliableType.PRIVATE.getName())) {
                token = authorizationClient(client);
            } else {
                token = getPwdToken(client, refreshToken.getUsername(), null);
            }
        }
        return token;
    }

    private RefreshToken authorizationRefreshToken(Client client, String refresh_token) {
        RefreshToken refreshToken = oauth2DAO.getRefreshToken(refresh_token, client.getId());
        if (refreshToken == null || client == null) {
            throw new ErrorCodeException(ErrorCode.REFRESH_TOKEN_ERROR, refresh_token);
        }
        return refreshToken;
    }

    private Token getPwdToken(Client client, String username, Map<String, Object> validateResult) {
        Token token = null;
        if (client != null) {
            ObjectId clientId = client.getId();
            User user = oauth2DAO.getUserByUsername(username);
            Role role = oauth2DAO.getRoleByUsername(username);
            if (user == null) {
                throw new ErrorCodeException(ErrorCode.USER_DOES_NOT_EXIST);
            } else if (role == null) {
                throw new ErrorCodeException(ErrorCode.ROLE_DOES_NOT_EXIST);
            } else {
                if (validateResult == null || validateResult.containsKey("result")) {
                    Map<String, Object> privileges = null;
                    if (role.getType() == 1) {
                        privileges = PrivilegesUtils.getSupperPrivilege();
                    } else {
                        privileges = PrivilegesUtils.intersectionPrivilege(role.getPrivileges(), client.getPrivileges());
                    }
                    token = new Token();
                    token.setRoleType(role.getType());
                    token.setPrivileges(privileges);
                    token.setClientId(clientId);
                    token.setOid(user.getOid());
                    token.setUid(user.getId());
                    token.setUsername(username);
                    token.setName(user.getName());
                    token.setExpiresIn(client.getAgeing());
                } else {
                    throw new ErrorCodeException(mapper.convertValue(validateResult, Error.class));
                }
            }
        } else {
            throw new ErrorCodeException(ErrorCode.ACCESS_DENIED);
        }
        return token;
    }

    private Token authorizationPwd(Client client, int passwordType, String picId, String varificationCode, String username, String password, String ip, int language) {
        Token token = null;
        if (passwordType == 3) {
            Map<String, String> mapPram = new HashMap<String, String>();
            mapPram.put("pictureId", picId);
            mapPram.put("code", varificationCode);
            Map<String, Object> result = authenticateDAO.authVerificationCode(mapPram);
            if (result.containsKey("error") || result.containsKey("error_code") || !result.containsKey("result")) {
                throw new ErrorCodeException(ErrorCode.VARIFICATION_CODE_ERROR);
            }
        }
        ObjectId clientId = client.getId();
        Map<String, Object> validateResult = authenticateDAO.validateCreditials(clientId.toString(), username, password, ip, language, picId, passwordType);
        token = getPwdToken(client, username, validateResult);
        return token;
    }

    private Token authorizationCode(Client client, String authzCode) {
        Token token = null;
        if (authzCode == null) {
            new Error(ErrorCode.PARAMETER_VALUE_INVALID, "code");
        } else if (client != null) {
            Map<String, Object> privileges = null;
            Oauth2Code code = oauth2DAO.getCode(authzCode);
            privileges = PrivilegesUtils.intersectionPrivilege(code.getPrivileges(), client.getPrivileges());
            token = new Token();
            token.setUsername(client.getName());
            token.setPrivileges(privileges);
            token.setClientId(client.getId());
            token.setOid(code.getOid());
            token.setExpiresIn(client.getAgeing());
        } else {
            new Error(ErrorCode.PARAMETER_VALUE_INVALID, "client_id or client_secret");
        }
        return token;
    }
}
