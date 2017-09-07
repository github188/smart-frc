package cn.com.inhand.dn4.utils;

public class Code2InfoUtils {
    public static String getOnline(int online, int language) {
        if (language == 2) {//汉语
            switch (online) {
                case 1:
                    return "在线";
                case 0:
                    return "离线";
                default:
                    break;
            }

        } else if (language == 1) {//英语
            switch (online) {
                case 1:
                    return "online";
                case 0:
                    return "offline";
                default:
                    break;
            }
        }
        return null;
    }

    public static String getBusinessState(int businessState, int language) {
        if (language == 2) {//汉语
            switch (businessState) {
                case 0:
                    return "建设";
                case 1:
                    return "投运";
                case 2:
                    return "故障";
                case 3:
                    return "检修";
                default:
                    break;
            }

        } else if (language == 1) {//英语
            switch (businessState) {
                case 0:
                    return "construction";
                case 1:
                    return "commissioning";
                case 2:
                    return "fault";
                case 3:
                    return "maintain";
                default:
                    break;
            }
        }
        return null;
    }
}
