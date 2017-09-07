/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.dto;

import javax.validation.constraints.NotNull;
import org.bson.types.ObjectId;

/**
 *
 * @author shixj
 */
public class GoodsTypeBean {
     @NotNull
     private ObjectId oid;	         //机构ID
     private String name;
     public GoodsTypeBean() {

     }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
     
}
