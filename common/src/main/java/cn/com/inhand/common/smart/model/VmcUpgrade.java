/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class VmcUpgrade {
    private String vmcFileId;
    private String vmcName;
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

    
    public String getVmcFileId() {
        return vmcFileId;
    }

    public void setVmcFileId(String vmcFileId) {
        this.vmcFileId = vmcFileId;
    }

    public String getVmcName() {
        return vmcName;
    }

    public void setVmcName(String vmcName) {
        this.vmcName = vmcName;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    
}
