package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class VPNAccount {

    @Id
    @JsonProperty("_id")
    private ObjectId id;

    private String username;

    private String password;

    private ObjectId channelId;

    private ObjectId oid;
    
    private String serverName;
    
    public String getServerName() {
		return serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	/**
     * @return the id
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the channelId
     */
    public ObjectId getChannelId() {
        return channelId;
    }

    /**
     * @param channelId the channelId to set
     */
    public void setChannelId(ObjectId channelId) {
        this.channelId = channelId;
    }

    /**
     * @return the oid
     */
    public ObjectId getOid() {
        return oid;
    }

    /**
     * @param oid the oid to set
     */
    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

}
