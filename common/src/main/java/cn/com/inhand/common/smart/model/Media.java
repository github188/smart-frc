/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class Media {
    
    private String adIndex;   //广告位下标 0 1_0 2_0
    private String mediaId;
    private String mediaName;
    private String mediaType;
    private String fileName;
    private String length;
    private String fileSource;
    private String md5;
    private String imageCdnpath;//云存储地址

    public String getImageCdnpath() {
        return imageCdnpath;
    }

    public void setImageCdnpath(String imageCdnpath) {
        this.imageCdnpath = imageCdnpath;
    }
    
    public String getAdIndex() {
        return adIndex;
    }

    public void setAdIndex(String adIndex) {
        this.adIndex = adIndex;
    }

    
    
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMediaId() {
        return mediaId;
    }

    public void setMediaId(String mediaId) {
        this.mediaId = mediaId;
    }

    public String getMediaName() {
        return mediaName;
    }

    public void setMediaName(String mediaName) {
        this.mediaName = mediaName;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length;
    }

    public String getFileSource() {
        return fileSource;
    }

    public void setFileSource(String fileSource) {
        this.fileSource = fileSource;
    }
    
}
