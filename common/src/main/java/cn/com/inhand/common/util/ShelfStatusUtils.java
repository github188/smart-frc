/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.util;

import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.ContainerDto;
import cn.com.inhand.common.smart.model.GoodsConfig;
import cn.com.inhand.common.smart.model.ShelfInfo;
import cn.com.inhand.common.smart.model.ShelvesState;
import java.util.List;
import java.util.Map;

/**
 *
 * @author liqiang
 */
public class ShelfStatusUtils {
    
    
    public static Map<String, ShelfInfo> getAutomatShelfInfo(Map<String,ShelfInfo> shelfMap,Automat automat) {
        
        String assetId = automat.getAssetId();
        //主柜
        if(automat.getGoodsConfigs()!=null){
            List<GoodsConfig> goodsConfigs = automat.getGoodsConfigs();
            int glen = goodsConfigs.size();
            for(int i = 0;i < glen;i ++){
                GoodsConfig goodsConfig = goodsConfigs.get(i);
                if(!shelfMap.containsKey(assetId+"_"+goodsConfig.getLocation_id()) && goodsConfig.getGoods_id()!=null){
                    ShelfInfo info = new ShelfInfo();
                    info.setCapacity(goodsConfig.getCapacity());
                    info.setGoodsName(goodsConfig.getGoods_name());
                    info.setGoodsId(goodsConfig.getGoods_id());
                    info.setStatus(0);
                    info.setValve(goodsConfig.getValve());
                    info.setPrice(Integer.parseInt(goodsConfig.getPrice()));
                    shelfMap.put(assetId+"_"+goodsConfig.getLocation_id(), info);
                }
            }
        }
        //辅柜
        if(automat.getContainers()!=null && automat.getContainers().size()>0){
            List<ContainerDto> containers = automat.getContainers();
            for(int j = 0,dlen = containers.size();j < dlen;j ++){
                ContainerDto container = containers.get(j);
                String cid = container.getCid();
                List<GoodsConfig> shelves = container.getShelves();
                for(int k = 0,clen = shelves.size();k < clen;k ++){
                    GoodsConfig goodsConfig = shelves.get(k);
                    if(!shelfMap.containsKey(cid+"_"+goodsConfig.getLocation_id()) && goodsConfig.getGoods_id()!=null){
                        ShelfInfo info = new ShelfInfo();
                        info.setCapacity(goodsConfig.getCapacity());
                        info.setGoodsName(goodsConfig.getGoods_name());
                        info.setGoodsId(goodsConfig.getGoods_id());
                        info.setStatus(0);
                        info.setValve(goodsConfig.getValve());
                        info.setPrice(Integer.parseInt(goodsConfig.getPrice()));
                        shelfMap.put(cid+"_"+goodsConfig.getLocation_id(), info);
                    }
                }
            }
        }
        
        //货道售空状态
        if(automat.getVendingState() != null && automat.getVendingState().getShelvesState() != null){//获取货道状态，是否售空
            List<ShelvesState> shelvesState = automat.getVendingState().getShelvesState();
            for(ShelvesState shelfState:shelvesState){
                if(shelfMap.containsKey(shelfState.getCid()+"_"+shelfState.getShelvesId())){
                    ShelfInfo info = shelfMap.get(shelfState.getCid()+"_"+shelfState.getShelvesId());
                    info.setStatus(shelfState.getState());
                    
                }
            }
        }
        
        return shelfMap;
        
    }
    
}
