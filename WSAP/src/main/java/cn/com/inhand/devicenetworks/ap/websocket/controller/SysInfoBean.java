/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.websocket.controller;

import cn.com.inhand.devicenetworks.ap.websocket.Config;
import cn.com.inhand.devicenetworks.ap.websocket.VersionInfo;
import cn.com.inhand.devicenetworks.ap.websocket.WSDNSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.web.socket.WebSocketSession;

/**
 *
 * @author inhand
 */
public class SysInfoBean {
    private String version=VersionInfo.version;
    private String last_commit= VersionInfo.last_commit;
    private String start_ts;
    private int total=0;
    private int conns=0;
    private List<AssetBean> assets = new ArrayList<AssetBean>();

    public SysInfoBean() {
        this.start_ts = (new Date(Config.start_ts)).toString();    
    }
    
    public void init(){
        assets.clear();
        Iterator<WSDNSession> it = Config.info.getWsdnsn_map().values().iterator();
        while(it.hasNext()){
            AssetBean asset = new AssetBean();
            WSDNSession session = it.next();
            asset.setId(session.getGwId());
            asset.setLogin_ts((new Date(session.getConnection_time())).toString());
            asset.setAssets(session.getAssets());
            asset.setLast_msg((new Date(session.getLast_msg())).toString());
            assets.add(asset);
        }
        conns=assets.size();
        this.total = Config.info.getWssn_map().size();
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getConns() {
        return conns;
    }

    public void setConns(int conns) {
        this.conns = conns;
    }
    
    
    
    @Override
    public void finalize(){
        try {
            this.assets.clear();
            super.finalize();
        } catch (Throwable ex) {
            Logger.getLogger(SysInfoBean.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getLast_commit() {
        return last_commit;
    }

    public void setLast_commit(String last_commit) {
        this.last_commit = last_commit;
    }

    

    public String getStart_ts() {
        return start_ts;
    }

    public void setStart_ts(String start_ts) {
        this.start_ts = start_ts;
    }

    public List<AssetBean> getAssets() {
        return assets;
    }

    public void setAssets(List<AssetBean> assets) {
        this.assets = assets;
    }
    
    
    
}
