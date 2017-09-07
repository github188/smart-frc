package cn.com.inhand.centra.device.filter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 压缩工具
 * @author puys
 *
 */
public class GzipUtil {
	
	public static final Logger logger = LoggerFactory.getLogger(GzipUtil.class);
	public static String METHOD_POST = "POST";  
    public static final String ACCEPT_ENCODING = "Accept-Encoding";   
    public static final String CONTENT_ENCOING = "Content-Encoding";  
    public static final String CONTENT_LENGTH = "Content-Length";  
    public static final String ENCODING_GZIP = "gzip";  
    public static final String MIME_APPLICATION_X_GZIP = "application/x-gzip";  
    public static final String ENCODING = "UTF-8";  
  
    /** 
     * 对参数进行gzip压缩操作, 返回字节数组 
     * @param data 待压缩的字节数组 
     * @return  压缩后的gzip字节数组 
     * @throws IOException  
     */  
    public static byte[] gzip(byte[] data) throws IOException{  
          
        ByteArrayOutputStream baos = new ByteArrayOutputStream();  
          
        GZIPOutputStream gos = new GZIPOutputStream(baos);  
          
        gos.write(data);  
          
        gos.finish();  
        gos.flush();  
          
        byte[] result = baos.toByteArray();  
          
        baos.flush();  
          
        try{  
            gos.close();  
        }catch(IOException e){  
            logger.warn("Close GZIPOutputStream fail:", e);  
        }  
          
        return result;  
    }  
  
    /** 
     * 对参数进行gzip压缩操作, 结果输出到参数的输出流中 
     * @param data 待压缩的字节数组 
     * @param os    压缩后的输出流 
     * @throws IOException  
     */  
    public static void gzip(byte[] data, OutputStream os) throws IOException{  
          
        GZIPOutputStream gos = new GZIPOutputStream(os);  
          
        gos.write(data);  
          
        gos.finish();  
        gos.flush();  
          
        try{  
            gos.close();  
        }catch(IOException e){  
            logger.warn("Close GZIPOutputStream fail:", e);  
        }  
          
    }  
      
    /** 
     * 对输入流进行gzip压缩  
     * @param ins   待压缩的输入流 
     * @param os    压缩后的输出流 
     * @throws IOException 
     */  
    public static void gzip(InputStream ins, OutputStream os) throws IOException{  
          
        GZIPOutputStream gos = new GZIPOutputStream(os);  
          
        int b;  
        while((b = ins.read()) != -1){  
            gos.write(b);  
        }  
          
        gos.finish();  
        gos.flush();  
          
    }  
      
    /** 
     * 解压缩 
     * @param ins 输入流 
     * @return  解压完的数据字节数组 
     * @throws IOException  
     */  
    public static byte[] unGzip(InputStream ins) throws IOException{  
          
        if(logger.isInfoEnabled()){  
            logger.info("Start to ungzip parameters.....");  
        }  
          
        GZIPInputStream gis = new GZIPInputStream(ins);  
        ByteArrayOutputStream baos = new ByteArrayOutputStream();  
          
        int b;  
        while((b = gis.read()) != -1){  
            baos.write(b);  
        }  
          
        byte[] result = baos.toByteArray();  
          
        if(logger.isInfoEnabled()){  
            logger.info("Ungzip parameters bytes OK, result bytes size is: " + result.length);  
        }  
          
        try{  
            gis.close();  
        }catch(IOException e){  
            logger.warn("Close GZIPInputStream fail:", e);  
        }  
          
        return result;  
    }  
      
    /** 
     * 对输入流的数据解压缩 
     * @param ins   待解压的输入流 
     * @param os    解压后的输出流 
     * @throws IOException 
     */  
    public static void unGzip(InputStream ins, OutputStream os) throws IOException{  
          
        GZIPInputStream gis = new GZIPInputStream(ins);  
          
        int b;  
        while((b = gis.read()) != -1){  
            os.write(b);  
        }  
          
        try{  
            gis.close();  
        }catch(IOException e){  
            logger.warn("Close GZIPInputStream fail:", e);  
        }  
    }  
      
    /**
     * 判断浏览器是否支持GZIP
     * @param request
     * @return 
     */
    public static boolean isGZipEncoding(HttpServletRequest request){
      boolean flag=false;
      String encoding=request.getHeader("Accept-Encoding");
      if(encoding != null && encoding.indexOf("gzip") != -1){
        flag=true;
      }
      return flag;
    }
}
