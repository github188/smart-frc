/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class FirmwareUpgrade {
    private String firmwareFileId;
    private String firemwareName;
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
    

    public String getFirmwareFileId() {
        return firmwareFileId;
    }

    public void setFirmwareFileId(String firmwareFileId) {
        this.firmwareFileId = firmwareFileId;
    }

    public String getFiremwareName() {
        return firemwareName;
    }

    public void setFiremwareName(String firemwareName) {
        this.firemwareName = firemwareName;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }
    
}
