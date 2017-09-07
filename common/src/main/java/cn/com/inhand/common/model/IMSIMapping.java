package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class IMSIMapping {

    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String phone;
    private String imsi;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImsi() {
        return imsi;
    }

    public void setImsi(String imsi) {
        this.imsi = imsi;
    }

    public IMSIMapping() {
    }

    public IMSIMapping(String imsi, String phone) {
        this.phone = phone;
        this.imsi = imsi;
    }
}
