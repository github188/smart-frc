/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.model;

import java.util.List;
import javax.validation.constraints.NotNull;

/**
 *
 * @author lenovo
 */
public class OauthRequest {
    
    @NotNull
    private String auth;
    
    private List <AssetRequestModel> assets;

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public List<AssetRequestModel> getAssets() {
        return assets;
    }

    public void setAssets(List<AssetRequestModel> assets) {
        this.assets = assets;
    }
    
}
