package cn.com.inhand.oauth2.service;

import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuer;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import cn.com.inhand.common.model.RefreshToken;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.oauth2.amqp.AmqpMessageSender;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class OAuthTokenhandler {

    @Value("#{config.project.expiresIn}")
    private long expiresIn;
    @Value("#{config.project.refreshExpiresIn}")
    private long refreshExpiresIn;
    @Autowired
    private OAuth2Service oauth2DAO;
    @Autowired
    private AmqpMessageSender messageSender;
    @Autowired
    private ObjectMapper mapper;
    private OAuthIssuer oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());

    public Token handleToken(Token token, String ip) throws OAuthSystemException {
        OAuthIssuer oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());
        String accessToken = oauthIssuerImpl.accessToken();
        token.setToken(accessToken);
        token.setIp(ip);
        if (token.getExpiresIn() == null || token.getExpiresIn() <= 0) {
            token.setExpiresIn(expiresIn);
        }
        oauth2DAO.createToken(token);
        messageSender.publishAccessToken(token);
        return token;
    }

    public RefreshToken handleRefreshToken(ObjectId clientId, String username) throws OAuthSystemException {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setRefreshToken(oauthIssuerImpl.refreshToken());
        refreshToken.setClientId(clientId);

        refreshToken.setUsername(username);
        refreshToken.setExpiresIn(refreshExpiresIn);
        oauth2DAO.createRefreshToken(refreshToken);
        return refreshToken;
    }
}
