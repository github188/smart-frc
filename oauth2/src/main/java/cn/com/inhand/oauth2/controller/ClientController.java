package cn.com.inhand.oauth2.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.dto.ResourceIdListRequestBody;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.log.BusinessLogger;
import cn.com.inhand.common.log.LogCode;
import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.role.RoleType;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.oauth2.dto.ClientCreateBean;
import cn.com.inhand.oauth2.dto.ClientQueryBean;
import cn.com.inhand.oauth2.dto.ClientUpdateBean;
import cn.com.inhand.oauth2.service.ClientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("api")
public class ClientController extends HandleExceptionController {

    @Autowired
    ClientService cs;
    @Autowired
    ObjectMapper mapper;
    @Autowired
    BusinessLogger businessLogger;

    @RequestMapping(value = "/apps", method = RequestMethod.GET)
    public @ResponseBody
    Object getApps(
            @RequestParam(required = false, defaultValue = "1") int verbose,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer[] subclass,
            @RequestParam(value = "type", required = false) String type,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        ClientQueryBean cqb = new ClientQueryBean();
        cqb.setRoleType(roleType);
        cqb.setOid(oId);
        cqb.setType(type);
        cqb.setName(name);
        cqb.setSubclass(subclass);
        List<Client> clients = cs.getClients(cqb, verbose, cursor, limit);
        long total = cs.getCount(cqb);
        return new BasicResultDTO(total, cursor, limit, clients);
    }

    @RequestMapping(value = "/apps/list", method = RequestMethod.POST)
    public @ResponseBody
    Object getAppList(
            @RequestParam(required = false, defaultValue = "1") int verbose,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer[] subclass,
            @RequestParam(value = "type", required = false) String type,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId,
            @Valid @RequestBody ResourceIdListRequestBody requestBody) {
        ClientQueryBean cqb = new ClientQueryBean();
        cqb.setRoleType(roleType);
        cqb.setOid(oId);
        cqb.setType(type);
        cqb.setName(name);
        cqb.setSubclass(subclass);
        cqb.setResourceIds(requestBody.getResourceIds());
        List<Client> clients = cs.getClients(cqb, verbose, cursor, limit);
        long total = cs.getCount(cqb);
        return new BasicResultDTO(total, cursor, limit, clients);
    }

    @RequestMapping(value = "/apps", method = RequestMethod.POST)
    public @ResponseBody
    Object createApp(
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId,
            @Valid @RequestBody ClientCreateBean clientCreateBean) {
        if (cs.isClientNameExists(clientCreateBean.getName())) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_NAME_ALREADY_EXISTS, clientCreateBean.getName());
        }
        Client client = mapper.convertValue(clientCreateBean, Client.class);
        if (roleType >= RoleType.ORGANIZATION_ADMINISTRATOR.getType()) {
            client.setOid(oId);
            client.setState(0);
        } else if (roleType >= RoleType.ORGANIZATION_ADMINISTRATOR.getType() && client.getType() != null && client.equals("private")) {
            throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "type");
        } else {
            client.setState(1);
        }

        cs.createClient(client);
        businessLogger.info(oId, LogCode.CREATE_APP_OK, xUId, xUsername, xIp, client.getName());
        cs.createClient(client);
        return new OnlyResultDTO(client);
    }

    @RequestMapping(value = "/apps/{id}", method = RequestMethod.DELETE)
    public @ResponseBody
    Object removeApp(
            @PathVariable ObjectId id,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        Client client = cs.getClient(id);
        if (client == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, id);
        } else if (roleType >= RoleType.ORGANIZATION_ADMINISTRATOR.getType()) {
            if (!oId.equals(client.getOid()) || client.getType().equals("private")) {//非超级管理员 只能修改自己机构的客户端
                throw new ErrorCodeException(ErrorCode.ACCESS_DENIED);
            }
        }
        cs.deleteClientById(id);
        businessLogger.info(oId, LogCode.DELETE_APP_OK, xUId, xUsername, xIp, client.getName());
        OnlyResultDTO result = new OnlyResultDTO();
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("id", id);
        result.setResult(resultMap);
        return result;
    }

    @RequestMapping(value = "/apps/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateApp(
            @PathVariable ObjectId id,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId,
            @Valid @RequestBody ClientUpdateBean clientUpdateBean) {
        Client oldClient = cs.getClient(id);
        Client client = mapper.convertValue(clientUpdateBean, Client.class);
        if (oldClient != null) {
            if (roleType < RoleType.ORGANIZATION_ADMINISTRATOR.getType()) {
                if (client.getState() != null && client.getState() == 1) {
                    client.setApprovedTime(DateUtils.getUTC());
                }
            } else {
                if (!oId.equals(oldClient.getOid()) || client.getType() != null || client.getState() != null) {//非超级管理员 只能修改自己机构的客户端
                    throw new ErrorCodeException(ErrorCode.ACCESS_DENIED);
                }
            }
        } else {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, id);
        }

        if (client.getName() != null && !client.getName().equals(oldClient.getName()) && cs.isClientNameExists(clientUpdateBean.getName())) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_NAME_ALREADY_EXISTS, clientUpdateBean.getName());
        }
        client.setId(id);
        cs.updateClient(client);
        businessLogger.info(oId, LogCode.UPDATE_APP_OK, xUId, xUsername, xIp, client.getName() == null ? oldClient.getName() : client.getName());
        return new OnlyResultDTO(client);
    }

    @RequestMapping(value = "/apps/{id}", method = RequestMethod.GET)
    public @ResponseBody
    Object getApp(
            @PathVariable ObjectId id,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        Client client = null;
        if (roleType >= RoleType.ORGANIZATION_ADMINISTRATOR.getType()) {
            client = cs.getPublicClient(id);
        } else {
            client = cs.getClient(id);
        }

        if (client == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, id);
        }
        return new OnlyResultDTO(client);
    }
}
