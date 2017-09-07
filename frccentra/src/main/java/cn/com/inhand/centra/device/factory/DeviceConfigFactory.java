/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.factory;

import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.dto.AssetIdsList;
import cn.com.inhand.centra.device.model.AssetRequestModel;
import cn.com.inhand.centra.device.model.Container;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.AutomatConfig;
import cn.com.inhand.common.smart.model.ContainerDto;
import cn.com.inhand.common.smart.model.GoodsConfig;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class DeviceConfigFactory {

    private static final Logger logger = LoggerFactory.getLogger(DeviceConfigFactory.class);
    @Autowired
    DeviceDAO deviceDAO;

    public Automat initDeviceShelvesConfig(Automat automat, AssetRequestModel model) {
        logger.debug("Device Config Factory init Device shelves config  assetId  is " + automat.getAssetId());
        List<Container> containers = null;//model.getContainers();
        
        AutomatConfig config = automat.getConfig() != null ? automat.getConfig() : new AutomatConfig();
        config.setVender(model.getVender());
        config.setPort(model.getPort());
        config.setProtocol(model.getProtocol());
        
        Map<String, Map<String, GoodsConfig>> containerGoodsMap = new HashMap<String, Map<String, GoodsConfig>>();
        if (automat.getContainers() != null) {
            List<ContainerDto> conList = automat.getContainers();
            for (ContainerDto dto : conList) {
                List<GoodsConfig> cgoodsConfig = dto.getShelves();
                Map<String, GoodsConfig> map = new HashMap<String, GoodsConfig>();
                for (GoodsConfig cgoods : cgoodsConfig) {
                    if (cgoods != null) {
                        map.put(cgoods.getLocation_id(), cgoods);
                    }
                }
                containerGoodsMap.put(dto.getCid(), map);
            }
        }

        List<ContainerDto> containersDto = new ArrayList<ContainerDto>();
//        List<ContainerDto> containersDtoNew = new ArrayList<ContainerDto>();

        for (Container container : containers) {

            if (container.getCid() != null && !container.getCid().equals("")) {
                if (container.getCid().equals(model.getAssetId())) {
                    List<GoodsConfig> configs = this.getGoodsConfigsList(automat.getGoodsConfigs(), container);
//                    List<GoodsConfig> newConfig = this.getGoodsConfigsList(automat.getGoodsConfigsNew(), container);
                    automat.setMasterType(container.getType());
                    automat.setGoodsConfigs(configs);
//                    automat.setGoodsConfigsNew(newConfig);
                    //货道排列
                    List shelves = container.getShelves();
                    List<Integer> masterArr = new ArrayList<Integer>();
                    for (int s = 0; s < shelves.size(); s++) {
                        List channel = (List) shelves.get(s);
                        Integer channelCount = channel.size();
                        masterArr.add(s, channelCount);
                    }
                    automat.setMasterArr(masterArr);
                } else {
                    logger.info("==Device ContainerDto update for device CONTAINER type " + container.getType() + " , cid =  " + container.getCid());
                    ContainerDto con = this.getContainerDtoList(automat.getContainers(), container);
//                    ContainerDto conNew = this.getContainerDtoList(automat.getContainersNew(), container);
                    //货道排列
                    List shelves = container.getShelves();
                    List<Integer> masterArr = new ArrayList<Integer>();
                    for (int s = 0; s < shelves.size(); s++) {
                        List channel = (List) shelves.get(s);
                        Integer channelCount = channel.size();
                        masterArr.add(s, channelCount);
                    }
                    con.setShelvesArr(masterArr);
                    containersDto.add(con);
//                    containersDtoNew.add(conNew);
                }
            }
        }

        if (containersDto.size() > 0 ) {
            automat.setContainers(containersDto);
        }else{
            automat.setContainers(null);
            automat.setContainersNew(null);
        }
//        if (containersDtoNew.size() > 0) {
//            automat.setContainersNew(containersDtoNew);
//        }
        automat.setConfig(config);

        deviceDAO.updateAutomat(automat.getOid(), automat, "Vending Shelves model");
        return automat;
    }

    public ContainerDto getContainerDtoList(List<ContainerDto> conList, Container container) {
        Map<String, Map<String, GoodsConfig>> containerGoodsMap = new HashMap<String, Map<String, GoodsConfig>>();
        if (conList != null) {
            for (ContainerDto dto : conList) {
                List<GoodsConfig> cgoodsConfig = dto.getShelves();
                Map<String, GoodsConfig> map = new HashMap<String, GoodsConfig>();
                for (GoodsConfig cgoods : cgoodsConfig) {
                    if (cgoods != null) {
                        map.put(cgoods.getLocation_id(), cgoods);
                    }
                }
                containerGoodsMap.put(dto.getCid(), map);
            }
        }

        ContainerDto con = new ContainerDto();
        con.setType(container.getType());
        con.setCid(container.getCid());
        List<GoodsConfig> goodsConfig = new ArrayList<GoodsConfig>();
        List shelves = container.getShelves();
        for (int s = 0; s < shelves.size(); s++) {
            List channel = (List) shelves.get(s);
            for (int ch = 0; ch < channel.size(); ch++) {
                List list = (List) channel.get(ch);
                GoodsConfig goodsConfig1 = this.getGoodsConfig(list);
                if (containerGoodsMap.get(con.getCid()) != null && containerGoodsMap.get(con.getCid()).get(goodsConfig1.getLocation_id()) != null) {
                    goodsConfig1 = this.initGoodsConfig(goodsConfig1, containerGoodsMap.get(con.getCid()).get(goodsConfig1.getLocation_id()));
                }
                goodsConfig.add(goodsConfig1);
            }
        }
        con.setShelves(goodsConfig);

        return con;
    }

    public List<GoodsConfig> getGoodsConfigsList(List<GoodsConfig> goodsConfigList, Container container) {
        Map<String, GoodsConfig> goodsConfigMap = new HashMap<String, GoodsConfig>();
        if (goodsConfigList != null) {
            for (GoodsConfig config : goodsConfigList) {
                if (config != null) {
                    goodsConfigMap.put(config.getLocation_id(), config);
                }
            }
        }
        List<GoodsConfig> configs = new ArrayList<GoodsConfig>();
        logger.debug("==Device Shelves update for device MASTER , message =  " + container.getShelves().toString());
        List shelves = container.getShelves();
        for (int s = 0; s < shelves.size(); s++) {
            List channel = (List) shelves.get(s);
            for (int c = 0; c < channel.size(); c++) {
                List shelve = (List) channel.get(c);
                GoodsConfig goods = this.getGoodsConfig(shelve);
                if (goodsConfigMap.get(goods.getLocation_id()) != null) {
                    goods = this.initGoodsConfig(goods, goodsConfigMap.get(goods.getLocation_id()));
                }
                configs.add(goods);
            }
        }
        return configs;
    }

    public GoodsConfig initGoodsConfig(GoodsConfig goods, GoodsConfig goodsV1) {
        goods.setAlipay_url(goodsV1.getAlipay_url());
        goods.setCapacity(goodsV1.getCapacity());
        goods.setGoods_id(goodsV1.getGoods_id());
        goods.setGoods_name(goodsV1.getGoods_name());
        goods.setImagemd5(goodsV1.getImagemd5());
        goods.setImg(goodsV1.getImg());
        goods.setStatus(goodsV1.getStatus());
        goods.setPrice(goodsV1.getPrice());
        goods.setPayment_url(goodsV1.getPayment_url());
        goods.setValve(goodsV1.getValve());
        return goods;
    }

    public AssetIdsList getAssetIdsList(Device device) {
        AssetIdsList asset = new AssetIdsList();
        asset.setAssetId(device.getAssetId());
        asset.setId(device.getId().toString());
        return asset;
    }

    public GoodsConfig getGoodsConfig(List shelve) {
        GoodsConfig goodsConfig = new GoodsConfig();
        String shelve_1 = (String) shelve.get(0);
        String shelve_2 = (String) shelve.get(1);
        goodsConfig.setLocation_id(shelve_1);
        goodsConfig.setStatus(shelve_2);
        return goodsConfig;


    }
}
