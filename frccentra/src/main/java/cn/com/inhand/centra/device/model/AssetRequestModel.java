/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.model;

import java.util.List;

/**
 *
 * @author lenovo
 */
public class AssetRequestModel {
    private String assetId;
    private String vender;
    private String protocol;
    private String port;
    private List coin_capacity;
//    private List <Container> containers;

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public List getCoin_capacity() {
        return coin_capacity;
    }

    public void setCoin_capacity(List coin_capacity) {
        this.coin_capacity = coin_capacity;
    }
}
