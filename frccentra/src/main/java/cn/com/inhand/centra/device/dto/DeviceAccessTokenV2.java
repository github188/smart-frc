/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import java.util.List;

/**
 *
 * @author cttc
 */
public class DeviceAccessTokenV2 {
    
    private String gwId;
    private String oid;
    private String token;
    private String server;
    private String sign;
    private List <AssetIdsList> assets;

    public String getGwId() {
        return gwId;
    }

    public void setGwId(String gwId) {
        this.gwId = gwId;
    }

    public String getOid() {
        return oid;
    }

    public void setOid(String oid) {
        this.oid = oid;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    public List<AssetIdsList> getAssets() {
        return assets;
    }

    public void setAssets(List<AssetIdsList> assets) {
        this.assets = assets;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }
    
}
