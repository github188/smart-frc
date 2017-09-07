/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

/**
 *
 * @author lenovo
 */
public class AssetPlugins {
    
    private String model;
    private Integer protcol;
    private Integer type;
    private String port;

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getProtcol() {
        return protcol;
    }

    public void setProtcol(Integer protcol) {
        this.protcol = protcol;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }
    
}
