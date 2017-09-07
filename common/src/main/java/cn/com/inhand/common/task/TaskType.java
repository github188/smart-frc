package cn.com.inhand.common.task;

public class TaskType {
    public static final int RUNNING_CONFIG = 1;
    public static final int COMMAND = 2;
    public static final int OVDP_CONFIG = 3;
    public static final int GET_RUNNING_CONFIG = 4;
    public static final int UPGRADE = 6;
    public static final int CLEAN_ACCESS_TOKEN = 15;
    public static final int CALCULATE_BILL = 16;
    public static final int CALCULATE_ACCESS = 17;
    public static final int CALCULATE_TRAFFIC = 18;
    public static final int CLEAN_CHANNEL = 19;
    public static final int IDLE_TASK_NOTICE = 20;
    // 1：运行配置下发（0x00010000）；
    // 2：交互命令（0x00000002）；
    // 3：OVDP 配置（0x00030000）；
    // 4：运行配置获取；
    // 6：升级文件（0x00060000）；
    // 8：要求获取格式化的参数，用于立即获取地震系统要求巡检的数据和 Modbus 命令
    // （0x00080000）；
    // 9：要求设备立即做功能测试，用于地震设备生成测试文件（0x00090000）；
    // 10：地震设备做功能测试时得到的 EVT 文件（0x000A0000）；
    // 11：InRouter 证书配置文件（0x000B0000）；
    // 12：VPN 临时通道配置（0x000C0000）；
    // 13：VPN 连接指令（0x000D0000）；
    // 14：zip 压缩格式的配置文件(EntityConfig) （0x000E0000）；
    // 15：定期清理 access_token；
    // 16：费用定期统计；
    // 17：访问定期统计；
    // 18：流量定期统计；
    // 19：通道状态定期更新；
    // 20：闲置任务定期通知；
}
