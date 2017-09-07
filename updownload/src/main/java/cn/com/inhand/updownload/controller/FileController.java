package cn.com.inhand.updownload.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.dto.TokenValidateResult;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.oauth2.TokenClient;
import cn.com.inhand.common.resource.ResourceMessageSender;
import cn.com.inhand.dn4.utils.NetUtils;
import cn.com.inhand.updownload.dao.FileDAO;
import com.mongodb.gridfs.GridFSDBFile;
import java.io.BufferedOutputStream;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

@Controller
@RequestMapping("api")
public class FileController extends HandleExceptionController {

    public static final Logger logger = LoggerFactory.getLogger(FileController.class);
    public static final String APINAME = "api/file";
    public static final int COMMON_FILE_PERMISSIONID = 83;
    public static final int RESOURCE_TYPE = 0;
    private static final int SYSTEM_FILE_PERMISSIONID = 85;
    @Autowired
    TokenClient tokenClient;
    @Autowired
    FileDAO upDownLoadService;
    @Autowired
    ResourceMessageSender resourceMessageSender;

    /**
     * 根据ID获取文件
     *
     * @param accessToken
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/file/{ID}", method = RequestMethod.GET)
    public
    @ResponseBody
    void getFileInfoById(
    		HttpServletRequest request, 
    		HttpServletResponse response, 
    		@PathVariable ObjectId ID, 
    		@RequestParam("access_token") String accessToken,
    		@RequestParam(value = "oid_user", required = false) ObjectId oId
    		) throws Exception {
        logger.debug("Access_token is " + accessToken + " get file by id is :" + ID);
        // 检查Token
        TokenValidateResult tokenResult = null;
        tokenResult = tokenClient.validateAccessToken(accessToken, APINAME, NetUtils.GET, COMMON_FILE_PERMISSIONID, RESOURCE_TYPE, oId);
        oId = tokenResult.getOid();
        String filename = null;
        // 获取文件流
        GridFSDBFile gridFSDBFile = upDownLoadService.getFileInfoById(oId, ID);
        if (gridFSDBFile != null && gridFSDBFile.getInputStream() != null) {
            InputStream in = gridFSDBFile.getInputStream();
            filename = gridFSDBFile.getFilename();
            byte[] b = new byte[2048];
            // 获取文件属性
            if (filename != null) {
                response.setHeader("Content-Disposition", "attachment;charset=UTF-8;filename=" + filename);
            }
            try {
                OutputStream os;
                os = response.getOutputStream();
                int size;
                while ((size = in.read(b)) > 0) {
                    os.write(b, 0, size);
                }
                os.flush();
                os.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, ID);
        }
    }

    /**
     * 上传文件
     *
     * @param accessToken
     * @param filename
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/file", method = RequestMethod.POST)
    public
    @ResponseBody
    Object uploadFile(
    		@RequestParam("access_token") String accessToken, 
    		@RequestParam(value = "oid_user", required = false) ObjectId oId,
    		@RequestParam("filename") String filename, 
    		@RequestBody byte[] in) {
        logger.debug("create file, filename {}", filename);
        OnlyResultDTO result = new OnlyResultDTO();
        // 检查Token
        TokenValidateResult tokenResult = tokenClient.validateAccessToken(accessToken, APINAME, NetUtils.POST, COMMON_FILE_PERMISSIONID, RESOURCE_TYPE, oId);
        oId = tokenResult.getOid();
        Map<String, Object> lhm;
        lhm = upDownLoadService.addFile(oId, filename, new ByteArrayInputStream(in));
        result.setResult(lhm);
        logger.debug("upload file result {}", result.getResult());
        
        String filePath = "/usr/share/nginx/html/file/"+lhm.get("_id");
        byte2File(in,filePath,filename);
        
        return result;
    }
     public static void byte2File(byte[] buf, String filePath, String fileName)  
    {  
        BufferedOutputStream bos = null;  
        FileOutputStream fos = null;  
        File file = null;  
        try  
        {  
            File dir = new File(filePath); 
            if(!dir.exists()){
                dir.mkdirs();
            }
           
            file = new File(filePath + "/" + fileName);  
            fos = new FileOutputStream(file);  
            bos = new BufferedOutputStream(fos);  
            bos.write(buf);  
        }  
        catch (Exception e)  
        {  
            e.printStackTrace();  
        }  
        finally  
        {  
            if (bos != null)  
            {  
                try  
                {  
                    bos.close();  
                }  
                catch (IOException e)  
                {  
                    e.printStackTrace();  
                }  
            }  
            if (fos != null)  
            {  
                try  
                {  
                    fos.close();  
                }  
                catch (IOException e)  
                {  
                    e.printStackTrace();  
                }  
            }  
        }  
    }  

    /**
     * 获取系统文件
     *
     * @param accessToken
     * @param filename
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/systemfile", method = RequestMethod.GET)
    public
    @ResponseBody
    void getSystemFile(
    		HttpServletRequest request, 
    		HttpServletResponse response, 
    		@RequestParam("access_token") String accessToken, 
    		@RequestParam(value = "oid_user", required = false) ObjectId oId,
    		@RequestParam(required = false, value = "filename") String filename, 
    		@RequestParam(required = false, value = "id") String id) throws Exception {
        logger.debug("Access_token is " + accessToken + " get file by filename is :" + filename + " and id is : " + id);
        // 检查Token
        tokenClient.validateAccessToken(accessToken, APINAME, NetUtils.GET, SYSTEM_FILE_PERMISSIONID, RESOURCE_TYPE, oId);
        // //如果系统文件的获取是满足多有权限，这块暂时没用
        // String stringOId = tokenClient.validateAccessToken(accessToken);
        // ObjectId oId = null;
        // if(ObjectId.isValid(stringOId)){
        // oId = new ObjectId(stringOId);
        // }

        // 获取文件流
        String resourseString = "";
        GridFSDBFile gridFSDBFile = null;
        if (filename != null && filename.length() > 0) {
            gridFSDBFile = upDownLoadService.getSystemFile(filename);
            resourseString = filename;
        } else if (id != null && id.length() > 0) {
            gridFSDBFile = upDownLoadService.getSystemFile(id);
            resourseString = id;
        } else {
            throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "filename");
        }
        if (gridFSDBFile != null && gridFSDBFile.getInputStream() != null) {
            try {
                InputStream in = gridFSDBFile.getInputStream();
                byte[] b = new byte[2048];
                filename = gridFSDBFile.getFilename();
                if (filename != null) {
                    response.setHeader("Content-Disposition", "attachment;charset=UTF-8;filename=" + filename);
                }
                OutputStream os = response.getOutputStream();
                int size;
                while ((size = in.read(b)) > 0) {
                    os.write(b, 0, size);
                }
                os.flush();
                os.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, resourseString);
        }
    }

    /**
     * 根据ID删除文件
     *
     * @param accessToken
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/file/{ID}", method = RequestMethod.DELETE)
    public
    @ResponseBody
    Object deleteFileById(
    		@PathVariable ObjectId ID, 
    		@RequestParam("access_token") String accessToken,
    		@RequestParam(value = "oid_user", required = false) ObjectId oId) throws Exception {
        logger.debug("Access_token is " + accessToken + " get file by ID is :" + ID);
        // 检查Token
        OnlyResultDTO result = new OnlyResultDTO();
        TokenValidateResult tokenResult = tokenClient.validateAccessToken(accessToken, APINAME, NetUtils.DELETE, COMMON_FILE_PERMISSIONID, RESOURCE_TYPE, oId);
        oId = tokenResult.getOid();

        ObjectId fileId = null;
        if (oId.toString().equalsIgnoreCase("0000000000000000000abcde")) {
            fileId = upDownLoadService.deleteSystemFile(ID);
        } else {
            fileId = upDownLoadService.deleteFile(oId, ID);
        }
        LinkedHashMap<String, String> lhm = new LinkedHashMap<String, String>();
        lhm.put("id", fileId.toString());
        return result;
    }

    /**
     * 根据SN和文件MD5码获取升级文件
     *
     * @param response
     * @param sn
     * @param fileMD5
     * @throws Exception
     */
    @RequestMapping(value = "file/upgrade/{sn}", method = RequestMethod.GET, consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public
    @ResponseBody
    ByteArrayResource getUpgradeFile(
    		HttpServletResponse response, 
    		@PathVariable String sn, 
    		@RequestParam("filename") String fileMD5) {
        ObjectId oId = upDownLoadService.getOidBySN(sn);
        if (oId != null) {
            GridFSDBFile gridFSDBFile = upDownLoadService.getFileNameByMD5(oId, fileMD5);
            if (gridFSDBFile != null && gridFSDBFile.getInputStream() != null) {
                InputStream in = gridFSDBFile.getInputStream();
                String filename = gridFSDBFile.getFilename();
                response.setHeader("Content-Disposition", "attachment;charset=UTF-8;filename=" + filename);
                try {
                    return new ByteArrayResource(IOUtils.toByteArray(in));
                } catch (IOException e) {
                    throw new ErrorCodeException(ErrorCode.SYSTEM_ERROR);
                }
            } else {
                throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, fileMD5);
            }
        } else {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, sn);
        }
    }
    
    /**
     * 微信上传文件
     *
     * @param accessToken
     * @param filename
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/wechat/file", method = RequestMethod.POST)
    public
    @ResponseBody
    Object uploadWechatFile(
    		@RequestParam("access_token") String accessToken, 
    		@RequestParam(value = "oid_user", required = false) ObjectId oId,
    		@RequestParam("filename") String filename, 
    		@RequestBody byte[] in) {
        logger.debug("create wechat file, filename {}", filename);
        OnlyResultDTO result = new OnlyResultDTO();
        // 检查Token
        TokenValidateResult tokenResult = tokenClient.validateAccessToken(accessToken, APINAME, NetUtils.POST, COMMON_FILE_PERMISSIONID, RESOURCE_TYPE, oId);
        oId = tokenResult.getOid();
        Map<String, Object> lhm;
        lhm = upDownLoadService.addWechatFile(oId, filename, new ByteArrayInputStream(in));
        result.setResult(lhm);
        logger.debug("upload wechat file result {}", result.getResult());
        return result;
    }
    
    /**
     * 根据ID获取微信文件
     *
     * @param accessToken
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/wechat/file/{ID}", method = RequestMethod.GET)
    public
    @ResponseBody
    void getWechatFileInfoById(
    		HttpServletRequest request, 
    		HttpServletResponse response, 
    		@PathVariable ObjectId ID,
    		@RequestParam(value = "oid_user", required = false) ObjectId oId
    		) throws Exception {
        logger.debug(" get file by id is :" + ID);
        // 检查Token
      //  TokenValidateResult tokenResult = null;
        //tokenResult = tokenClient.validateAccessToken(accessToken, APINAME, NetUtils.GET, COMMON_FILE_PERMISSIONID, RESOURCE_TYPE, oId);
        //oId = tokenResult.getOid();
        
        String filename = null;
        // 获取文件流
        GridFSDBFile gridFSDBFile = upDownLoadService.getWechatFileInfo(ID);
        if (gridFSDBFile != null && gridFSDBFile.getInputStream() != null) {
            InputStream in = gridFSDBFile.getInputStream();
            filename = gridFSDBFile.getFilename();
            byte[] b = new byte[2048];
            // 获取文件属性
            if (filename != null) {
                response.setHeader("Content-Disposition", "attachment;charset=UTF-8;filename=" + filename);
            }
            try {
                OutputStream os;
                os = response.getOutputStream();
                int size;
                while ((size = in.read(b)) > 0) {
                    os.write(b, 0, size);
                }
                os.flush();
                os.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, ID);
        }
    }
}
