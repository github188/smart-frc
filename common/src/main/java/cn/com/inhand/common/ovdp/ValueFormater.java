package cn.com.inhand.common.ovdp;

public class ValueFormater {
    public static String ioTypeFormater(int ioType) {
        switch (ioType) {
            case 1:
            case 3:
                return "com";
            case 2:
                return "eth";
            default:
                return "gio";
        }
    }

    public static String floatVar2String(Float i) {
        if (i == null || i == 0f) {
            return " ";
        } else {
            return String.valueOf(i);
        }
    }
}
