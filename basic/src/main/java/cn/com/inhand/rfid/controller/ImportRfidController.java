/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.rfid.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.smart.model.TgCode;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.rfid.dao.RfidDao;
import cn.com.inhand.rfid.dto.RfidBean;
import cn.com.inhand.smart.formulacar.model.Rfid;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

/**
 *
 * @author shixj
 */
@Controller
@RequestMapping("api/vmimports")
public class ImportRfidController {
    private final static Logger logger = LoggerFactory.getLogger(ImportRfidController.class);
    @Autowired
    ObjectMapper mapper;
    @Autowired
    private RfidDao rfidDao;
    
    @RequestMapping(value = "/rfid", method = RequestMethod.POST)
    public @ResponseBody
    Object TgcodeImport(
            HttpServletRequest req,
            HttpServletResponse resp,
            @RequestParam("access_token") String accessToken,
            @RequestParam("languge") String languge,
            @RequestParam(value = "oid", required = false) ObjectId oId) throws IOException {
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        Map mes = new HashMap();
        String name = "";
        String endName = "";
        try {
            List fileItems = upload.parseRequest(req);
            Iterator iter = fileItems.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                // 忽略其他不是文件域的所有表单信息
                if (!item.isFormField()) {
                    name = item.getName();
                    endName = name.substring(name.lastIndexOf(".") + 1);
                    try {
                        item.write(new File("/usr/local" + "/" + name));

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    mes.put(item.getFieldName(), item.getString()); // 将前台界面是非文件域的信息存入Map中
                }
            }
        } catch (FileUploadException e1) {
            e1.printStackTrace();
        }
        String paths = "/usr/local/" + name;
        File file = new File(paths);
        if (file.exists() && (endName.equals("xls") || endName.equals("XLS"))) {
            try {
                Workbook book = Workbook.getWorkbook(file); // 创建 一个工作区域  只支持xls格式的，不支持xlsx格式的
                int shetNum = book.getNumberOfSheets();
                Sheet sheet = book.getSheet(0);
                
                for (int ii = 1; ii < sheet.getRows(); ii++) {
                    RfidBean bean =new RfidBean();
                    Cell cell = sheet.getCell(0, ii);
                    String rfid = "";
                    if (cell != null) {                           
                        rfid = cell.getContents();
                        bean.setRfid(rfid);
                    }
                    
                    String count = "";
                    Cell cell1 = sheet.getCell(1, ii);
                    if (cell1 != null) {
                        count = cell1.getContents();    
                        bean.setCount(Integer.parseInt(count));
                    }
                    long timestamp = DateUtils.getUTC();
                    bean.setCreateTime(timestamp);
                    bean.setUpdateTime(timestamp);
                    Rfid code = mapper.convertValue(bean, Rfid.class);
                    code.setOid(oId);
                    Rfid code_ = rfidDao.findRfidInfoByRfid(oId,rfid);
                    if(code_ == null){
                       rfidDao.createRfid(oId, code);
                    }
                }
                
                OnlyResultDTO result = new OnlyResultDTO();
                result.setResult("success");
                return result;
             
            } catch (BiffException e) {
                e.printStackTrace();
                OnlyResultDTO result = new OnlyResultDTO();
                result.setResult("error");
                return result;
            }
        }else {
            OnlyResultDTO result = new OnlyResultDTO();
            result.setResult("error");
            return result;
        }
        
    }
}
