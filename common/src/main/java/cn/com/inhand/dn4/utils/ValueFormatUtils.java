package cn.com.inhand.dn4.utils;

public class ValueFormatUtils {
    public static String coordFormat(Float f) {
        return coordFormat((double) f);
    }

    public static String coordFormat(Double d) {
        if (d != null) {
            d = Math.abs(d);
            StringBuffer sb = new StringBuffer();
            int degrees = d.intValue();
            if (degrees > 0) {
                sb.append(degrees).append("°");
            }
            double temp = (d - degrees) * 60;
            int minutes = new Double(temp).intValue();
            if (minutes > 0) {
                sb.append(minutes).append("'");
            }
            temp = (temp - minutes) * 60;
            int secondes = new Float(temp).intValue();
            if (secondes > 0) {
                sb.append(secondes).append("\"");
            }
            return sb.toString();
        }
        return null;
    }

    public static String getLatitude(Double d) {
        String result = "";
        if (d != null) {
            result = coordFormat(d);
            if (d >= 0) {
                result += "N";
            } else {
                result += "S";
            }
        }
        return result;
    }

    public static String getLongitude(Double d) {
        String result = "";
        if (d != null) {
            result = coordFormat(d);
            if (d >= 0) {
                result += "E";
            } else {
                result += "W";
            }

        }
        return result;
    }
}
