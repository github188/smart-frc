package cn.com.inhand.common.model;

import cn.com.inhand.common.task.TaskData;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;

public class Task {
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oId;
    private ObjectId uId;
    private ObjectId objectId;
    private String objectName;
    private String username;
    private Integer userType;
    private String name;
    private Integer type;
    private Integer priority;
    private Integer state;
    private Float progress;
    private ObjectId siteId;
    private String siteName;
    private Long created;
    private Long startTime;
    private Long updateTime;
    private String desc;
    private String error;
    private TaskData data;

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
     * @return the oId
     */
    public ObjectId getoId() {
        return oId;
    }

    /**
     * @param oId the oId to set
     */
    public void setoId(ObjectId oId) {
        this.oId = oId;
    }

    /**
     * @return the uId
     */
    public ObjectId getuId() {
        return uId;
    }

    /**
     * @param uId the uId to set
     */
    public void setuId(ObjectId uId) {
        this.uId = uId;
    }

    /**
     * @return the objectId
     */
    public ObjectId getObjectId() {
        return objectId;
    }

    /**
     * @param objectId the objectId to set
     */
    public void setObjectId(ObjectId objectId) {
        this.objectId = objectId;
    }

    /**
     * @return the objectName
     */
    public String getObjectName() {
        return objectName;
    }

    /**
     * @param objectName the objectName to set
     */
    public void setObjectName(String objectName) {
        this.objectName = objectName;
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
     * @return the userType
     */
    public Integer getUserType() {
        return userType;
    }

    /**
     * @param userType the userType to set
     */
    public void setUserType(Integer userType) {
        this.userType = userType;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the type
     */
    public Integer getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(Integer type) {
        this.type = type;
    }

    /**
     * @return the priority
     */
    public Integer getPriority() {
        return priority;
    }

    /**
     * @param priority the priority to set
     */
    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    /**
     * @return the state
     */
    public Integer getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(Integer state) {
        this.state = state;
    }

    /**
     * @return the progress
     */
    public Float getProgress() {
        return progress;
    }

    /**
     * @param progress the progress to set
     */
    public void setProgress(Float progress) {
        this.progress = progress;
    }

    /**
     * @return the siteId
     */
    public ObjectId getSiteId() {
        return siteId;
    }

    /**
     * @param siteId the siteId to set
     */
    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

    /**
     * @return the siteName
     */
    public String getSiteName() {
        return siteName;
    }

    /**
     * @param siteName the siteName to set
     */
    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    /**
     * @return the created
     */
    public Long getCreated() {
        return created;
    }

    /**
     * @param created the created to set
     */
    public void setCreated(Long created) {
        this.created = created;
    }

    /**
     * @return the startTime
     */
    public Long getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the updateTime
     */
    public Long getUpdateTime() {
        return updateTime;
    }

    /**
     * @param updateTime the updateTime to set
     */
    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * @return the desc
     */
    public String getDesc() {
        return desc;
    }

    /**
     * @param desc the desc to set
     */
    public void setDesc(String desc) {
        this.desc = desc;
    }

    /**
     * @return the error
     */
    public String getError() {
        return error;
    }

    /**
     * @param error the error to set
     */
    public void setError(String error) {
        this.error = error;
    }

    /**
     * @return the data
     */
    public TaskData getData() {
        return data;
    }

    /**
     * @param data the data to set
     */
    public void setData(TaskData data) {
        this.data = data;
    }

    /*
     * (non-Javadoc)
     *
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Task [");
        if (id != null) {
            builder.append("id=");
            builder.append(id);
            builder.append(", ");
        }
        if (oId != null) {
            builder.append("oId=");
            builder.append(oId);
            builder.append(", ");
        }
        if (uId != null) {
            builder.append("uId=");
            builder.append(uId);
            builder.append(", ");
        }
        if (objectId != null) {
            builder.append("objectId=");
            builder.append(objectId);
            builder.append(", ");
        }
        if (objectName != null) {
            builder.append("objectName=");
            builder.append(objectName);
            builder.append(", ");
        }
        if (username != null) {
            builder.append("username=");
            builder.append(username);
            builder.append(", ");
        }
        if (userType != null) {
            builder.append("userType=");
            builder.append(userType);
            builder.append(", ");
        }
        if (name != null) {
            builder.append("name=");
            builder.append(name);
            builder.append(", ");
        }
        if (type != null) {
            builder.append("type=");
            builder.append(type);
            builder.append(", ");
        }
        if (priority != null) {
            builder.append("priority=");
            builder.append(priority);
            builder.append(", ");
        }
        if (state != null) {
            builder.append("state=");
            builder.append(state);
            builder.append(", ");
        }
        if (progress != null) {
            builder.append("progress=");
            builder.append(progress);
            builder.append(", ");
        }
        if (siteId != null) {
            builder.append("siteId=");
            builder.append(siteId);
            builder.append(", ");
        }
        if (siteName != null) {
            builder.append("siteName=");
            builder.append(siteName);
            builder.append(", ");
        }
        if (created != null) {
            builder.append("created=");
            builder.append(created);
            builder.append(", ");
        }
        if (startTime != null) {
            builder.append("startTime=");
            builder.append(startTime);
            builder.append(", ");
        }
        if (updateTime != null) {
            builder.append("updateTime=");
            builder.append(updateTime);
            builder.append(", ");
        }
        if (desc != null) {
            builder.append("desc=");
            builder.append(desc);
            builder.append(", ");
        }
        if (error != null) {
            builder.append("error=");
            builder.append(error);
            builder.append(", ");
        }
        if (data != null) {
            builder.append("data=");
            builder.append(data);
        }
        builder.append("]");
        return builder.toString();
    }

}
