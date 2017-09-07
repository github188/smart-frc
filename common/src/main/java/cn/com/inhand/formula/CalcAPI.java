package cn.com.inhand.formula;

import cn.com.inhand.dn4.utils.ArrayUtils;

import java.math.BigDecimal;

public class CalcAPI {
    public static String VERSION = "Expression API v1.0.7353";
    public static String funcLib = "String index(String a,int offset,int length){return a.substring(2*offset,2*(offset+length));}\r\nint b2i(int var,int lb,int hb){return CalcAPI.b2i(var,lb,hb);}\r\nfloat bytes_ABCD2f(int var,int precision){return CalcAPI.bytes_ABCD2f(var,precision);}\r\nfloat bytes_CDAB2f(int var,int precision){return CalcAPI.bytes_CDAB2f(var,precision);}\r\nfloat bytes_BADC2f(int var,int precision){return CalcAPI.bytes_BADC2f(var,precision);}\r\nfloat bytes_DCBA2f(int var,int precision){return CalcAPI.bytes_DCBA2f(var,precision);}\r\nint bytes_CDAB2i(int var){return CalcAPI.bytes_CDAB2i(var);}\r\nint bytes_BADC2i(int var){return CalcAPI.bytes_BADC2i(var);}\r\nint bytes_DCBA2i(int var){return CalcAPI.bytes_DCBA2i(var);}\r\nInteger getByte(byte[] src,int offset){return CalcAPI.getByte(src,offset);}\r\nInteger getWord4AB(byte[] src,int offset){return CalcAPI.getWord4AB(src,offset);}\r\nInteger getWord4BA(byte[] src,int offset){return CalcAPI.getWord4BA(src,offset);}\r\nInteger getDWord4BADC(byte[] src,int offset){return CalcAPI.getDWord4BADC(src,offset);}\r\nInteger getDWord4ABCD(byte[] src,int offset){return CalcAPI.getDWord4ABCD(src,offset);}\r\nInteger getDWordD4DCBA(byte[] src,int offset){return CalcAPI.getDWord4DCBA(src,offset);}\r\nInteger getDWord4CDAB(byte[] src,int offset){return CalcAPI.getFloatd4CDAB(src,offset);}\r\nFloat getFloat4BADC(byte[] src,int offset,precision){return CalcAPI.getFloat4BADC(src,offset,precision);}\r\nFloat getFloat4ABCD(byte[] src,int offset,precision){return CalcAPI.getFloat4ABCD(src,offset,precision);}\r\nFloat getFloat4DCBA(byte[] src,int offset,precision){return CalcAPI.getFloat4DCBA(src,offset,precision);}\r\nFloat getFloat4CDAB(byte[] src,int offset,precision){return CalcAPI.getFloat4CDAB(src,offset,precision);}\r\n";

    public static String getFuncDesc(String funcName) {
        String name = funcName.toLowerCase();

        if (name.startsWith("index"))
            return "func_desc_index";
        if (name.startsWith("bytes_ABCD2f"))
            return "func_desc_bytes_ABCD2f";
        if (name.startsWith("bytes_CDAB2f"))
            return "func_desc_bytes_CDAB2f";
        if (name.startsWith("bytes_BADC2f"))
            return "func_desc_bytes_BADC2f";
        if (name.startsWith("bytes_DCBA2f"))
            return "func_desc_bytes_DCBA2f";
        if (name.startsWith("bytes_CDAB2i"))
            return "func_desc_bytes_CDAB2i";
        if (name.startsWith("bytes_BADC2i"))
            return "func_desc_bytes_BADC2i";
        if (name.startsWith("bytes_DCBA2i"))
            return "func_desc_bytes_DCBA2i";
        if (name.startsWith("b2i"))
            return "func_desc_b2i";
        if (name.startsWith("getByte"))
            return "func_desc_getByte";
        if (name.startsWith("getWord4AB"))
            return "func_desc_getWord4AB";
        if (name.startsWith("getWord4BA"))
            return "func_desc_getWord4BA";
        if (name.startsWith("getDWord4ABCD"))
            return "func_desc_getDWord4ABCD";
        if (name.startsWith("getDWord4BADC"))
            return "func_desc_getDWord4BADC";
        if (name.startsWith("getDWord4CDAB"))
            return "func_desc_getDWord4CDAB";
        if (name.startsWith("getDWord4CDBA")) {
            return "func_desc_getDWord4CDBA";
        }

        return "unkown";
    }

    public static Integer getByte(byte[] src, int offset) {
        try {
            if ((src != null) && (src.length > offset - 1))
                return (int) src[offset];
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Integer getWord4AB(byte[] src, int offset) {
        return getWord(src, offset, 1);
    }

    public static Integer getWord4BA(byte[] src, int offset) {
        return getWord(src, offset, 26);
    }

    public static Integer getWord(byte[] src, int offset, int varType) {
        Integer result = null;
        byte[] temp = ArrayUtils.arrayCopy(src, offset, 2);
        try {
            if ((src != null) && (src.length > offset - 1)) {
                if (varType == 26)
                    result = temp[0] << 8 | temp[1];
                else {
                    result = temp[0] << 1 | temp[0];
                }
                return (int) src[offset];
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public static Integer getDWord4ABCD(byte[] src, int offset) {
        return getDWord(src, offset, 2);
    }

    public static Integer getDWord4CDAB(byte[] src, int offset) {
        return getDWord(src, offset, 21);
    }

    public static Integer getDWord4DCBA(byte[] src, int offset) {
        return getDWord(src, offset, 22);
    }

    public static Integer getDWord4BADC(byte[] src, int offset) {
        return getDWord(src, offset, 19);
    }

    public static Float getFloat4BADC(byte[] src, int offset, int precision) {
        Integer temp = getDWord(src, offset, 19);
        if (temp != null) {
            return roundFloat(Float.intBitsToFloat(temp), precision);
        }
        return null;
    }

    public static Float getFloat4ABCD(byte[] src, int offset, int precision) {
        Integer temp = getDWord(src, offset, 2);
        if (temp != null) {
            return roundFloat(Float.intBitsToFloat(temp), precision);
        }
        return null;
    }

    public static Float getFloat4CDAB(byte[] src, int offset, int precision) {
        Integer temp = getDWord(src, offset, 21);
        if (temp != null) {
            return roundFloat(Float.intBitsToFloat(temp), precision);
        }
        return null;
    }

    public static Float getFloat4DCBA(byte[] src, int offset, int precision) {
        Integer temp = getDWord(src, offset, 22);
        if (temp != null) {
            return roundFloat(Float.intBitsToFloat(temp), precision);
        }
        return null;
    }

    public static Integer getDWord(byte[] src, int offset, int varType) {
        Integer result = null;
        byte[] temp = ArrayUtils.arrayCopy(src, offset, 4);
        try {
            if ((src != null) && (src.length > offset - 1)) {
                if (varType == 22) {
                    result = 0;
                    result = result | temp[0] & 0xFF;
                    result = result | (temp[1] & 0xFF) << 8;
                    result = result | (temp[2] & 0xFF) << 16;
                    result = result | ((temp[3] & 0xFF) << 24);
                } else {
                    if (varType == 19) {
                        result = 0;
                        result = result | (temp[0] & 0xFF) << 16;
                        result = result | (temp[1] & 0xFF) << 24;
                        result = result | temp[2] & 0xFF;
                        result = result | (temp[3] & 0xFF) << 8;
                    } else if (varType == 21) {
                        result = 0;
                        result = result | (temp[0] & 0xFF) << 8;
                        result = result | temp[1] & 0xFF;
                        result = result | (temp[2] & 0xFF) << 24;
                        result = result | (temp[3] & 0xFF) << 16;
                    } else {
                        result = 0;
                        result = result | (temp[0] & 0xFF) << 24;
                        result = result | (temp[1] & 0xFF) << 16;
                        result = result | (temp[2] & 0xFF) << 8;
                        result = result | temp[3] & 0xFF;
                    }
                }
                return result;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public static int b2i(int var, int lb, int hb) {
        int result = 0;
        int temp = var;
        int min = lb < hb ? lb : hb;
        int max = lb < hb ? hb : lb;
        temp >>= min;
        for (int ii = min; ii <= max; ii++) {
            result |= temp & 1 << ii - min;
        }

        return result;
    }

    public static float bytes_ABCD2f(int var, int precision) {
        float result = Float.intBitsToFloat(var);

        return roundFloat(result, precision);
    }

    public static int bytes_CDAB2i(int var) {

        return ((var & 0xFFFF0000) >> 16) | ((var & 0xFFFF) << 16);
    }

    public static float bytes_CDAB2f(int var, int precision) {
        float result = Float.intBitsToFloat(bytes_CDAB2i(var));

        return roundFloat(result, precision);
    }

    public static int bytes_BADC2i(int var) {

        return (var & 0xFF000000) >> 8 |
                (var & 0xFF0000) << 8 |
                (var & 0xFF00) >> 8 |
                (var & 0xFF) << 8;
    }

    public static float bytes_BADC2f(int var, int precision) {
        float result = Float.intBitsToFloat(bytes_BADC2i(var));

        return roundFloat(result, precision);
    }

    public static int bytes_DCBA2i(int var) {

        return
                ((var & 0xFF000000) >> 24) |
                        ((var & 0xFF0000) >> 8) |
                        ((var & 0xFF00) << 8) |
                        ((var & 0xFF) << 24);
    }

    public static float bytes_DCBA2f(int var, int precision) {
        float result = Float.intBitsToFloat(bytes_DCBA2i(var));

        return roundFloat(result, precision);
    }

    public static double roundDouble(double value, int scale) {
        BigDecimal bd = new BigDecimal(value);
        bd = bd.setScale(scale, 4);
        double d = bd.doubleValue();
        bd = null;
        return d;
    }

    public static float roundFloat(float value, int scale) {
        BigDecimal bd = new BigDecimal(value);
        bd = bd.setScale(scale, 4);
        float d = bd.floatValue();
        bd = null;
        return d;
    }
}