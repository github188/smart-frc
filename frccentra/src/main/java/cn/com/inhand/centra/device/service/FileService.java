/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.FileDAO;
import cn.com.inhand.common.service.MongoService;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author xupeijiao
 */
@Service
public class FileService extends MongoService implements FileDAO {

    public Map<String, Object> addFile(ObjectId oid, String fileName, InputStream in) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        GridFS gridFS = new GridFS(template.getDb());
        Map<String, Object> map = new HashMap<String, Object>();
        GridFSInputFile inputFile = gridFS.createFile(in, fileName);
        inputFile.save();
        map.put("_id", inputFile.getId());
        map.put("md5", inputFile.getMD5());
        map.put("length", inputFile.getLength());
        map.put("fileName", inputFile.getFilename());
        return map;

    }
}
