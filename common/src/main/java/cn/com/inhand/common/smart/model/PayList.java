/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;


import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
/**
 *
 * @author cttc
 */
public class PayList {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private List payStyle;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public List getPayStyle() {
        return payStyle;
    }

    public void setPayStyle(List payStyle) {
        this.payStyle = payStyle;
    }
    
    
}
