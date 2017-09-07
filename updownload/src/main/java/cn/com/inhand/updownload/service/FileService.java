package cn.com.inhand.updownload.service;

import cn.com.inhand.common.model.OvdpDevice;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.updownload.dao.FileDAO;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoException;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FileService extends MongoService implements FileDAO {

    /**
     * 定义文件系统日志
     */
    @SuppressWarnings("unused")
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);
    private String systemOIdString = "0000000000000000000ABCDE";

    /**
     * 根据ID获取文件流
     *
     * @param oId
     * @return
     */
    @Override
    public GridFSDBFile getFileInfoById(ObjectId oId, ObjectId ID) {
        GridFSDBFile gridFSDBFile = null;
        try {
            MongoTemplate template = factory.getMongoTemplateByOId(oId);
            GridFS gridFS = new GridFS(template.getDb());
            gridFSDBFile = gridFS.findOne(new BasicDBObject("_id", ID));
        } catch (MongoException e) {
            e.printStackTrace();
        }
        return gridFSDBFile;
    }

    /**
     * 根据ID获取系统文件流
     *
     * @return
     */
    @Override
    public GridFSDBFile getSystemFile(String queryStr) {
        GridFSDBFile gridFSDBFile = null;
        if (queryStr != null) {
            try {
                MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
                GridFS gridFS = new GridFS(template.getDb());
                // 若符合ObjectId的格式
                if (ObjectId.isValid(queryStr)) {
                    gridFSDBFile = gridFS.findOne(new BasicDBObject("_id", new ObjectId(queryStr)));
                } else {
                    // 可能查询条件为文件名称
                    List<GridFSDBFile> fileList = gridFS.find(queryStr);
                    if (fileList.size() > 0) {
                        gridFSDBFile = fileList.get(fileList.size() - 1);
                    }
                }
            } catch (MongoException e) {
                e.printStackTrace();
            }
        }
        return gridFSDBFile;
    }

    /**
     * 根据文件名称得到ID
     *
     * @param oId
     * @param name
     * @return
     * @throws Exception
     */
    @Override
    public ObjectId getIdByFileName(ObjectId oId, String name) {
        GridFSDBFile gridFSDBFile = null;
        MongoTemplate template = factory.getMongoTemplateByOId(oId);
        GridFS gridFS = new GridFS(template.getDb());
        if (name != null) {
            gridFSDBFile = gridFS.findOne(new BasicDBObject("filename", name));
            return new ObjectId(String.valueOf(gridFSDBFile.getId()));
        } else {
            return null;
        }
    }

    /**
     * 根据ID得到文件名称
     *
     * @param oId
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String getFileNameById(ObjectId oId, String id) {
        GridFSDBFile gridFSDBFile = null;
        MongoTemplate template = factory.getMongoTemplateByOId(oId);
        GridFS gridFS = new GridFS(template.getDb());
        if (id != null && ObjectId.isValid(id)) {
            gridFSDBFile = gridFS.findOne(new BasicDBObject("_id", new ObjectId(id)));
            return gridFSDBFile.getFilename();
        } else {
            return null;
        }
    }

    /**
     * 根据MD5码得到文件
     *
     * @param oId
     * @return
     * @throws Exception
     */
    @Override
    public GridFSDBFile getFileNameByMD5(ObjectId oId, String MD5) {
        GridFSDBFile gridFSDBFile = null;
        MongoTemplate template = factory.getMongoTemplateByOId(oId);
        GridFS gridFS = new GridFS(template.getDb());
        if (MD5 != null && MD5.length() > 0) {
            gridFSDBFile = gridFS.findOne(new BasicDBObject("md5", MD5));
        }
        return gridFSDBFile;
    }

    /**
     * 根据字节流添加文件
     *
     * @param oId
     * @param fileName
     * @param stream
     * @return
     */
    @Override
    public ObjectId addFile(ObjectId oId, String fileName, byte[] stream) {
        try {
            MongoTemplate template = factory.getMongoTemplateByOId(oId);
            GridFS gridFS = new GridFS(template.getDb());
            GridFSInputFile inputFile = gridFS.createFile(stream);
            inputFile.setFilename(fileName);
            inputFile.save();
            return new ObjectId(String.valueOf(inputFile.getId()));
        } catch (MongoException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据输入流添加文件
     *
     * @param oId
     * @param fileName
     * @param in
     * @return
     */
    @Override
    public Map<String, Object> addFile(ObjectId oId, String fileName, InputStream in) {
        MongoTemplate template = factory.getMongoTemplateByOId(oId);
        GridFS gridFS = new GridFS(template.getDb());
        Map<String, Object> map = new HashMap<String, Object>();
        if (oId.toString().equalsIgnoreCase(systemOIdString)) {
            GridFSDBFile gridFSDBFile = gridFS.findOne(fileName);
            if (gridFSDBFile != null) {
                map.put("_id", String.valueOf(gridFSDBFile.getId()));
                map.put("name", gridFSDBFile.getFilename());
                return map;
            }
        }
        GridFSInputFile inputFile = gridFS.createFile(in, fileName);
        inputFile.save();
        map.put("_id", inputFile.getId());
        map.put("md5", inputFile.getMD5());
        map.put("length", inputFile.getLength());
        map.put("fileName", inputFile.getFilename());
        return map;
    }

    /**
     * 根据ID删除文件
     *
     * @param oId
     * @return
     */
    @Override
    public ObjectId deleteFile(ObjectId oId, ObjectId ID) {
        // 系统用户只能操作系统文件，机构用户只能操作机构里的通用文件和系统文件的获取操作
        ObjectId fileId = null;
        try {
            MongoTemplate template = factory.getMongoTemplateByOId(oId);
            GridFS gridFS = new GridFS(template.getDb());
            fileId = ID;
            gridFS.remove(fileId);
        } catch (MongoException e) {
            e.printStackTrace();
        }
        return fileId;
    }

    /**
     * 根据ID删除系统文件
     *
     * @return
     */
    @Override
    public ObjectId deleteSystemFile(ObjectId ID) {
        // 系统用户只能操作系统文件，机构用户只能操作机构里的通用文件和系统文件的获取操作
        ObjectId fileId = null;
        try {
            MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
            GridFS gridFS = new GridFS(template.getDb());
            fileId = ID;
            gridFS.remove(fileId);
        } catch (MongoException e) {
            e.printStackTrace();
        }
        return fileId;
    }

    @Override
    public ObjectId getOidBySN(String serial_number) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        OvdpDevice ovdpDevice = template.findOne(Query.query(Criteria.where("sn").is(serial_number)), OvdpDevice.class, Collections.OVDP_DEVICE);
        if (ovdpDevice != null) {
            return ovdpDevice.getOid();
        }
        return null;
    }

	@Override
	public Map<String, Object> addWechatFile(ObjectId oId, String fileName, InputStream in) {
		
		 MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.WECHAT_PIC);
	        GridFS gridFS = new GridFS(template.getDb());
	        Map<String, Object> map = new HashMap<String, Object>();
	        if (oId.toString().equalsIgnoreCase(systemOIdString)) {
	            GridFSDBFile gridFSDBFile = gridFS.findOne(fileName);
	            if (gridFSDBFile != null) {
	                map.put("_id", String.valueOf(gridFSDBFile.getId()));
	                map.put("name", gridFSDBFile.getFilename());
	                return map;
	            }
	        }
	        GridFSInputFile inputFile = gridFS.createFile(in, fileName);
	        inputFile.setMetaData(new BasicDBObject("oId", oId.toString()));
	        inputFile.save();
	        map.put("_id", inputFile.getId());
	        map.put("md5", inputFile.getMD5());
	        return map;
	}

	@Override
	public GridFSDBFile getWechatFileInfo(ObjectId ID) {
		GridFSDBFile gridFSDBFile = null;
        try {
            MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.WECHAT_PIC);
            GridFS gridFS = new GridFS(template.getDb());
            gridFSDBFile = gridFS.findOne(new BasicDBObject("_id", ID));
        } catch (MongoException e) {
            e.printStackTrace();
        }
        return gridFSDBFile;
	}
}
