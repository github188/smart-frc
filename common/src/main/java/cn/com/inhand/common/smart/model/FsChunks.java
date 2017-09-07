/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author lenovo
 */
public class FsChunks {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId files_id;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getFiles_id() {
        return files_id;
    }

    public void setFiles_id(ObjectId files_id) {
        this.files_id = files_id;
    }
    
}
