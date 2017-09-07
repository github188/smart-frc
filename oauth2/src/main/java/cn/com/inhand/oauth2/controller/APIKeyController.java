package cn.com.inhand.oauth2.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.oauth2.ReliableType;
import cn.com.inhand.oauth2.dao.ApiKeysDAO;
import cn.com.inhand.oauth2.dao.TokenDAO;
import cn.com.inhand.oauth2.dto.ApiKey;
import cn.com.inhand.oauth2.factory.ClientFactory;
import cn.com.inhand.oauth2.service.ClientService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/api_key")
public class APIKeyController extends HandleExceptionController {

    @Autowired
    ClientService clientService;
    @Autowired
    TokenDAO tokenService;
    @Autowired
    ApiKeysDAO apiKeysService;
    @Autowired
    ClientFactory clientFactory;
    private final String KEY_TYPE = "data";

    @RequestMapping(value = "", method = RequestMethod.GET)
    public @ResponseBody
    Object getAPIKeyList(
            @RequestParam("access_token") String accessToken,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        OnlyResultDTO result = new OnlyResultDTO();
        List<ApiKey> apiKeyList = apiKeysService.getList(oId);
        result.setResult(OrderList(apiKeyList));
        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody
    Object addAPIKey(
            @RequestParam("access_token") String accessToken,
            @RequestParam(value = "sn", required = false) Integer sn,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        OnlyResultDTO result = new OnlyResultDTO();
        if (roleType >= 52) {
            throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
        }

        if (sn != null) {
            if (sn > 5) {
                throw new ErrorCodeException(ErrorCode.API_KEY_NUMBER_LIMIT);
            } else if (sn <= 0) {
                throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "sn");
            }
            ApiKey apiKey = apiKeysService.getApiKey(oId, sn);
            if (apiKey != null) {
                result.setResult(apiKey);
                return result;
            }
        }

        int keyCount = 0;
        Client client = clientService.getClientByClass(oId, KEY_TYPE);
        if (client != null) {
            if (!client.getReliable().equals(ReliableType.PRIVATE.getName())) {
                throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
            }
            keyCount = apiKeysService.getCount(oId);
            if (keyCount >= 5) {
                throw new ErrorCodeException(ErrorCode.API_KEY_NUMBER_LIMIT);
            }
        } else {
            client = clientFactory.getDataGatheringClient(oId);
            clientService.createClient(client);
        }

        ApiKey apiKey = new ApiKey();
        if (sn != null) {
            apiKey.setSn(sn);
        } else {
            apiKey.setSn(keyCount + 1);
        }
        apiKey.setClientId(client.getId());
        apiKey.setKeyCode(tokenService.getTokenCode(client.getId(), client.getAppkey()));
        apiKeysService.addApiKey(oId, apiKey);
        result.setResult(apiKey);
        return result;
    }

    @RequestMapping(value = "/{key}", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateAPIKey(
            @PathVariable String key,
            @RequestParam("access_token") String accessToken,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        OnlyResultDTO result = new OnlyResultDTO();

        if (roleType >= 52) {
            throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
        }

        Client client = clientService.getClientByClass(oId, KEY_TYPE);
        if (client == null) {
            throw new ErrorCodeException(ErrorCode.INVALID_CLIENT);
        }

        Token token = tokenService.getTokenByToken(oId, key);
        if (token == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, key);
        }
        tokenService.deleteTokenById(token.getId());

        ApiKey apiKey = apiKeysService.getApiKey(oId, key);
        if (apiKey == null) {
            throw new ErrorCodeException(ErrorCode.SYSTEM_ERROR);
        }
        apiKey.setKeyCode(tokenService.getTokenCode(client.getId(), client.getAppkey()));
        apiKeysService.updateApiKey(oId, apiKey);
        result.setResult(apiKey);
        return result;
    }

    /**
     * 排序
     *
     * @param apiKeyList
     * @return
     */
    private static ApiKey[] OrderList(List<ApiKey> apiKeyList) {
        ApiKey[] apiKeys = new ApiKey[5];
        if (apiKeyList != null && apiKeyList.size() > 0) {
            for (ApiKey key : apiKeyList) {
                apiKeys[key.getSn() - 1] = key;
            }
        }
        return apiKeys;
    }
}
