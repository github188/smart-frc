/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.factory;

import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.dao.DeviceKeyDAO;
import cn.com.inhand.centra.device.model.AssetRequestModel;
import cn.com.inhand.centra.device.model.Container;
import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.model.Organization;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.AutomatConfig;
import cn.com.inhand.common.smart.model.ContainerDto;
import cn.com.inhand.common.smart.model.GoodsConfig;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.OvdpInbox;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class OauthConfigFactory {

    private static final Logger logger = LoggerFactory.getLogger(OauthConfigFactory.class);
    @Autowired
    DeviceDAO deviceDAO;
    @Autowired
    DeviceKeyDAO deviceKeyDAO;

    public Device createNewDevice(String assetId, Organization organization,String sn) {

        Device device = new Device();
        device.setAssetId(assetId);
        device.setName(assetId);
        device.setOid(organization.getId());
        device.setOnline(Constant.DEVICE_ONLINE_STATUS_LOGOUT);
        device.setDeviceType(Constant.SMART_DEVICE_TYPE_NOCONFIRM);
        device.setSn(sn);
        deviceDAO.createDevice(organization.getId(), device);

        //新增汇总表
        OvdpDevice ovdpDevice = new OvdpDevice();
        ovdpDevice.setAssertId(assetId);
        ovdpDevice.setoId(organization.getId());
        ovdpDevice.setDeviceId(device.getId());
        ovdpDevice.setOnline(1);
        deviceDAO.createOvdpDevice(ovdpDevice);
        return device;
    }

    public void initMasterGoodsConfig(List<Container> containers, Automat automat, AssetRequestModel model) {
        for (int i = 0; i < containers.size(); i++) {
            Container container = containers.get(i);
            if (container.getCid() != null && !container.getCid().equals("") && container.getCid().equals(model.getAssetId())) {
                logger.debug(" create new automcat Shelves MASTER is " + container.getShelves().toString());
                List shelves = container.getShelves();
                List<GoodsConfig> configs = new ArrayList<GoodsConfig>();
                List<Integer> masterArr = new ArrayList<Integer>();
                for (int s = 0; s < shelves.size(); s++) {
                    List channel = (List) shelves.get(s);
                    Integer channelCount = channel.size();
                    masterArr.add(s,channelCount);
                    for (int c = 0; c < channel.size(); c++) {
                        List shelve = (List) channel.get(c);
                        GoodsConfig goodsConfig = this.getGoodsConfig(shelve);
                        configs.add(goodsConfig);
                    }
                }
                automat.setMasterType(container.getType());
                automat.setGoodsConfigs(configs);
                automat.setMasterArr(masterArr);
                break;
            }
        }
    }

    public void initContainerGoodsConfig(List<Container> containers, Automat automat, AssetRequestModel model) {
        List<ContainerDto> containersDto = new ArrayList<ContainerDto>();
        for (int i = 0; i < containers.size(); i++) {
            Container container = containers.get(i);
            if (container.getCid() != null && !container.getCid().equals("") && !container.getCid().equals(model.getAssetId())) {
                ContainerDto con = new ContainerDto();
                con.setType(container.getType());
                con.setCid(container.getCid());
                List<GoodsConfig> goodsConfig = new ArrayList<GoodsConfig>();
                List shelves = container.getShelves();
                List<Integer> shelvesArr = new ArrayList<Integer>();
                for (int s = 0; s < shelves.size(); s++) {
                    List channel = (List) shelves.get(s);
                    Integer channelCount = channel.size();
                    shelvesArr.add(s,channelCount);
                    for (int ch = 0; ch < channel.size(); ch++) {
                        List list = (List) channel.get(ch);
                        GoodsConfig goodsConfig1 = this.getGoodsConfig(list);
                        goodsConfig.add(goodsConfig1);
                    }
                }
                con.setShelves(goodsConfig);
                con.setShelvesArr(shelvesArr);
                containersDto.add(con);
            }
        }
        if (containersDto.size() > 0) {
            automat.setContainers(containersDto);
        }
    }

    public GoodsConfig getGoodsConfig(List shelve) {
        GoodsConfig goodsConfig = new GoodsConfig();
        String shelve_1 = (String) shelve.get(0);
        String shelve_2 = (String) shelve.get(1);
//        String[] shelve_2s = shelve_2.split(",");
        goodsConfig.setLocation_id(shelve_1);
        goodsConfig.setStatus(shelve_2);
//        goodsConfig.setCapacity(Integer.parseInt(shelve_2s[1]));
//        goodsConfig.setValve(Integer.parseInt(shelve_2s[2]));
        return goodsConfig;


    }
    
    public SmartInbox initSmartInbox(String sn,Organization organization){
        SmartInbox smartInbox = new SmartInbox();
        smartInbox.setName(sn);
        smartInbox.setSn(sn);
        smartInbox.setoId(organization.getId());
        smartInbox.setOnline(1);
        deviceDAO.createSmartInbox(organization.getId(), smartInbox);
        return smartInbox;
    }
    
    public void initOvdpInbox(String sn, ObjectId gwId,Organization organization){
        OvdpInbox inbox = new OvdpInbox();
        inbox.setName(sn);
        inbox.setSn(sn);
        inbox.setGwId(gwId);
        inbox.setoId(organization.getId());
        inbox.setCreateTime(DateUtils.getUTC());
        inbox.setUpdateTime(DateUtils.getUTC());
        deviceKeyDAO.addOvdpInbox(inbox);
    }
    
    public OvdpInbox createNewInbox(String sn, Organization organization,SmartInbox sinbox) {
        OvdpInbox inbox = new OvdpInbox();
        inbox.setName(sn);
        inbox.setSn(sn);
        inbox.setGwId(sinbox.getId());
        inbox.setoId(organization.getId());
        inbox.setCreateTime(DateUtils.getUTC());
        inbox.setUpdateTime(DateUtils.getUTC());
        deviceKeyDAO.addOvdpInbox(inbox);
        return inbox;
    }
}
