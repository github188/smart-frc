package cn.com.inhand.common.dto;

import org.bson.types.ObjectId;

import java.util.List;

public class TokenValidateResult {

    private String username;
    private String ip;
    private ObjectId uid;
    private ObjectId oid;
    private List<String> result;
    private Integer roleType;
    private List<ObjectId> groupIds;
    private ObjectId clientId;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public ObjectId getUid() {
        return uid;
    }

    public void setUid(ObjectId uid) {
        this.uid = uid;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public List<String> getResult() {
        return result;
    }

    public void setResult(List<String> result) {
        this.result = result;
    }

	public Integer getRoleType() {
		return roleType;
	}

	public void setRoleType(Integer roleType) {
		this.roleType = roleType;
	}

	public List<ObjectId> getGroupIds() {
		return groupIds;
	}

	public void setGroupIds(List<ObjectId> groupIds) {
		this.groupIds = groupIds;
	}

	public ObjectId getClientId() {
		return clientId;
	}

	public void setClientId(ObjectId clientId) {
		this.clientId = clientId;
	}

}
