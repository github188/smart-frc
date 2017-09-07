/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.updownload.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.updownload.dao.DeviceKeyDAO;
import cn.com.inhand.updownload.dao.FileDAO;
import com.mongodb.gridfs.GridFSDBFile;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("api/document")
public class DocumentController {
    
    private final static Logger logger = LoggerFactory.getLogger(DocumentController.class);
    @Autowired
    private DeviceKeyDAO deviceKeyService;
    @Autowired
    FileDAO upDownLoadService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    void getfile(
            HttpServletResponse response,
            HttpServletRequest request,
            @RequestParam("access_token") String accessToken,
            @PathVariable ObjectId id,
            @RequestHeader(value = "Range", required = false) String Range) throws FileNotFoundException, IOException {
        logger.debug("download document controller Range is " + Range);
        logger.debug("download document controller access_token is " + accessToken);
        DeviceKey deviceKey = deviceKeyService.findDeviceKeyByKey(accessToken);
        if (deviceKey == null) {
            logger.debug("download document controller deviceKey is null");
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT,accessToken);
        }
        
        ObjectId xOId = deviceKey.getOid();
        // 获取文件流
        String filename = null;
        long p = 0;
        long fileLength;
        GridFSDBFile gridFSDBFile = upDownLoadService.getFileInfoById(xOId, id);
        if (gridFSDBFile != null && gridFSDBFile.getInputStream() != null) {
            InputStream ins = gridFSDBFile.getInputStream();
            filename = gridFSDBFile.getFilename();
            fileLength = gridFSDBFile.getLength();
            BufferedInputStream bis = new BufferedInputStream(ins);

            response.reset();
            response.setHeader("Accept-Ranges", "bytes");
            if (Range != null) {
                response.setStatus(javax.servlet.http.HttpServletResponse.SC_PARTIAL_CONTENT);
                p = Long.parseLong(Range.replaceAll("bytes=", "").replaceAll("-", ""));
            }

            response.setHeader("Content-Length", new Long(fileLength - p).toString());

            if (p != 0) {
                // 断点开始
                // 响应的格式是:
                // Content-Range: bytes [文件块的开始字节]-[文件的总大小 - 1]/[文件的总大小]
                String contentRange = new StringBuffer("bytes ")
                        .append(new Long(p).toString())
                        .append("-")
                        .append(new Long(fileLength - 1).toString())
                        .append("/")
                        .append(new Long(fileLength).toString())
                        .toString();
                response.setHeader("Content-Range", contentRange);
                // pointer move to seek
                bis.skip(p);
            }
            response.addHeader("Content-Disposition", "attachment;filename=" + filename);

            byte[] buf = new byte[1024];
            int size = 0;
            while ((size = bis.read(buf)) != -1) {
                response.getOutputStream().write(buf, 0, size);
                response.getOutputStream().flush();
            }
            bis.close();
        }
    }
    
    @RequestMapping(value = "/file", method = RequestMethod.POST)
    public
    @ResponseBody
    Object uploadFile(
    		@RequestParam("access_token") String accessToken, 
    		@RequestParam("filename") String filename, 
    		@RequestBody byte[] in) {
        logger.debug("create file, filename {}", filename);
        OnlyResultDTO result = new OnlyResultDTO();
        // 检查Token
        DeviceKey deviceKey = deviceKeyService.findDeviceKeyByKey(accessToken);
        if (deviceKey == null) {
            logger.debug("upload document controller deviceKey is null");
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT,accessToken);
        }
        ObjectId oId = deviceKey.getOid();
        Map<String, Object> lhm;
        lhm = upDownLoadService.addFile(oId, filename, new ByteArrayInputStream(in));
        result.setResult(lhm);
        logger.debug("upload file result {}", result.getResult());
        return result;
    }
    
}
