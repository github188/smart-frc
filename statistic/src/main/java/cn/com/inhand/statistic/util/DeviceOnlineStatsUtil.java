package cn.com.inhand.statistic.util;

import cn.com.inhand.statistic.dto.DeviceOnlineState;
import cn.com.inhand.statistic.dto.DeviceStatusDTO;

import java.util.ArrayList;
import java.util.List;

public class DeviceOnlineStatsUtil {

    public static final Long DAY = Long.valueOf("86400");// 24 * 60 * 60;

    /**
     * 第一次运算，只将OnlineInterval和OfflineInterval计算出来
     *
     * @param list
     * @param startTime
     * @param endTime
     * @return
     */
    public static List<DeviceOnlineState> getInitData(List<DeviceOnlineState> list, Long startTime, Long endTime, long nowTime) {
        List<DeviceOnlineState> dataList = new ArrayList<DeviceOnlineState>();
        if (list != null) {
            // 定义集合大小
            int count = list.size();
            long lastDevicelogoutTime = 0;
            for (int i = 0; i < count; i++) {
                DeviceOnlineState deviceState = list.get(i);
                if (deviceState != null) {
                    // 如果设备一直在线（没有退出时间）
                    if (deviceState.getLogout() == null || deviceState.getLogout() == 0) {
                        // 如果该记录不是查询结果中的最后一条，但退出时间又为空（说明是强制停止了服务，然后又启动了），那么就将后面一条的登录时间复制给它,否则，将查当前时间复制给它
                        if (i > 0 && i < count - 1) {
                            deviceState.setLogout(list.get(i + 1).getLogin());
                        } else {
                            deviceState.setLogout(nowTime);
                        }
                        deviceState.setOnlineInterval(deviceState.getLogout() - deviceState.getLogin());
                        if (deviceState.getOfflineInterval() == null && lastDevicelogoutTime != 0) {
                            deviceState.setOfflineInterval(deviceState.getLogin() - lastDevicelogoutTime);
                        }
                    }
                    // 判断左端点值
                    if (deviceState.getLogin() <= startTime) {
                        if (deviceState.getLogout() >= startTime) {
                            deviceState.setOnlineInterval(deviceState.getLogout() - startTime);
                            deviceState.setLogin((long) startTime);
                            deviceState.setOfflineInterval((long) 0);
                        }
                    } else {
                        if (i == 0) {
                            deviceState.setOfflineInterval(deviceState.getLogin() - startTime);
                        }
                    }
                    // 判断右端点值
                    if (deviceState.getLogout() >= endTime) {
                        deviceState.setOnlineInterval(deviceState.getOnlineInterval() - (deviceState.getLogout() - endTime));
                        deviceState.setLogout((long) endTime);
                    }
                    lastDevicelogoutTime = deviceState.getLogout();

                    //校验一下 设备一直在线的情况
                    if (deviceState.getLogout() < startTime) {
                        continue;
                    }
                    dataList.add(deviceState);
                }
            }
        }
        return dataList;
    }

    /**
     * 得到计算后的值，并返回
     *
     * @param list
     * @param deviceId
     * @param startTime
     * @param endTime
     * @return
     */
    public static DeviceStatusDTO getCalculateData(List<DeviceOnlineState> list, String deviceId, long endTime, long nowTime) {
        DeviceStatusDTO deviceStatusDto = new DeviceStatusDTO();
        long maxOnline = 0;
        long maxOffline = 0;
        long totalOnline = 0;
        long totalOffline = 0;
        int onlineCount = 0;
        int offlineCount = 0;
        double onlineRate = 0;
        if (list != null && list.size() > 0) {
            // 登陆次数
            onlineCount = list.size();
            for (int i = 0; i < list.size(); i++) {
                DeviceOnlineState deviceState = list.get(i);
                if (deviceState != null) {
                    // 异常掉线
                    if (deviceState.getException() == 1) {
                        offlineCount++;
                    }
                    // 最大在线时长
                    if (maxOnline < deviceState.getOnlineInterval()) {
                        maxOnline = deviceState.getOnlineInterval();
                    }
                    // 最大掉线时长
                    if (maxOffline < deviceState.getOfflineInterval()) {
                        maxOffline = deviceState.getOfflineInterval();
                    }
                    // 总在线时长
                    totalOnline += deviceState.getOnlineInterval();
                    // 总掉线时长
                    totalOffline += deviceState.getOfflineInterval();
                    
                    long timeTemp = endTime < nowTime ? endTime : nowTime;
                    // 计算最后一节掉线数据
                    if(i == list.size() - 1 && deviceState.getLogout() < timeTemp){
                        // 最大掉线时长
                    	long OfflineTemp = timeTemp - deviceState.getLogout();
                        if (maxOffline < OfflineTemp) {
                            maxOffline = OfflineTemp;
                        }
                        totalOffline += OfflineTemp;
                    }
                }
            }
            if (totalOnline != 0) {
                onlineRate = totalOnline / ((double) totalOffline + (double) totalOnline);
            }
        }
        deviceStatusDto.setDeviceId(deviceId);
        deviceStatusDto.setMaxOnline(maxOnline);
        deviceStatusDto.setMaxOffline(maxOffline);
        deviceStatusDto.setTotalOnline(totalOnline);
        deviceStatusDto.setTotalOffline(totalOffline);
        deviceStatusDto.setLogin(onlineCount);
        deviceStatusDto.setException(offlineCount);
        deviceStatusDto.setOnlineRate(onlineRate);
        return deviceStatusDto;
    }

    /**
     * 计算在线曲线的数据
     *
     * @param onlineStateList
     * @param timestamps
     * @return
     */
    public static List<Long[]> caculateOnlineData(List<DeviceOnlineState> onlineStateList, long startTime, long endTime, long nowTime) {
        List<Long[]> dataArray = new ArrayList<Long[]>();
        if (onlineStateList != null && onlineStateList.size() > 0) {
            for (int i = 0; i < onlineStateList.size(); i++) {
                DeviceOnlineState online = onlineStateList.get(i);
                if (online != null) {

                    // 由于之前已经判定过端点值了
                    // 起点
                    if (i == 0 && online.getLogin() > startTime) {
                        dataArray.add(new Long[]{startTime, (long) 0});
                    }
                    dataArray.add(new Long[]{online.getLogin(), (long) 1});

                    // 终点
                    if (online.getLogout().longValue() == (endTime > nowTime ? nowTime : endTime)) {
                        dataArray.add(new Long[]{endTime, (long) 1});
                    } else {
                        dataArray.add(new Long[]{online.getLogout(), (long) 0});
                        if (online.getLogout() < endTime && i == onlineStateList.size() - 1) {
                            dataArray.add(new Long[]{endTime, (long) 0});
                        }
                    }
                }
            }
        } else {
            dataArray.add(new Long[]{startTime, (long) 0});
            dataArray.add(new Long[]{endTime, (long) 0});
        }
        return dataArray;
    }

}
