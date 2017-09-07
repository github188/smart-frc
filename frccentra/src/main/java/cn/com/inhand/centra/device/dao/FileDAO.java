/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import java.io.InputStream;
import java.util.Map;
import org.bson.types.ObjectId;

/**
 *
 * @author xupeijiao
 */
public interface FileDAO {
    public Map<String, Object> addFile(ObjectId oid,String fileName, InputStream in);
}
