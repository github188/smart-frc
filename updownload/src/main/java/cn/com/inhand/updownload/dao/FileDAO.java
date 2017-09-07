package cn.com.inhand.updownload.dao;

import com.mongodb.gridfs.GridFSDBFile;
import org.bson.types.ObjectId;

import java.io.InputStream;
import java.util.Map;

public interface FileDAO {

    public GridFSDBFile getFileInfoById(ObjectId oId, ObjectId ID);

    public GridFSDBFile getSystemFile(String queryStr);

    public ObjectId getIdByFileName(ObjectId oId, String name);

    public String getFileNameById(ObjectId oId, String id);

    public GridFSDBFile getFileNameByMD5(ObjectId oId, String MD5);

    public ObjectId addFile(ObjectId oId, String fileName, byte[] stream);

    public Map<String, Object> addFile(ObjectId oId, String fileName, InputStream in);

    public ObjectId deleteFile(ObjectId oId, ObjectId ID);

    public ObjectId deleteSystemFile(ObjectId ID);

    public ObjectId getOidBySN(String serial_number);
    
    public Map<String, Object> addWechatFile(ObjectId oId, String fileName, InputStream in);
    
    public GridFSDBFile getWechatFileInfo(ObjectId ID);

}
