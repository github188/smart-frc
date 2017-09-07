/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class AppUpgrade {
    private String appFileId;
    private String appName;
    private String md5;
    private String fileName;
    private String length;
    private String imageCdnpath;

    public String getImageCdnpath() {
        return imageCdnpath;
    }

    public void setImageCdnpath(String imageCdnpath) {
        this.imageCdnpath = imageCdnpath;
    }
    
    
    

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length;
    }

    
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    

    public String getAppFileId() {
        return appFileId;
    }

    public void setAppFileId(String appFileId) {
        this.appFileId = appFileId;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }
    
}
