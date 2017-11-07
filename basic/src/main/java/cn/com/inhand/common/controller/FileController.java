/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author liqiang
 */
@Controller
@RequestMapping("fapi/file")
public class FileController {
    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody
    Object uploadFile(
            HttpServletRequest req,
            HttpServletResponse resp) throws IOException, FileUploadException {
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        Map mes = new HashMap();
        String name = "";
        String endName = "";
        String newFileName = "";
        try {
            List fileItems = upload.parseRequest(req);
            Iterator iter = fileItems.iterator();
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                // 忽略其他不是文件域的所有表单信息
                if (!item.isFormField()) {
                    name = item.getName();
                    endName = name.substring(name.lastIndexOf(".") + 1);
                    newFileName = "CF" + System.currentTimeMillis() + this.getRandomCode() + "." + endName;
                    try {
                        item.write(new File("/usr/share/nginx/html/carfile" + "/" + newFileName));

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

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("result", "success");
        result.put("fileName", newFileName);
        return result;
    }
    
    public Integer getRandomCode() {
        int result = 0;
        int[] array = new int[]{0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
        Random rand = new Random();//将数据的次序打乱
        for (int i = 5; i > 1; i--) {
            int index = rand.nextInt(i);
            int tmp = array[index];
            array[index] = array[i - 1];
            array[i - 1] = tmp;
        }
        for (int i = 0; i < 6; i++) {
            if (array[0] == 0) {
                array[0] = 1;
            }
            result = result * 10 + array[i];
        }
        return result;
    }
}
