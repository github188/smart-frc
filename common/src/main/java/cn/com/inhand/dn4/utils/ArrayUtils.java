package cn.com.inhand.dn4.utils;

public class ArrayUtils {
    public static long[] arrayCopy(long[] src, int offset, int len)
            throws ArrayIndexOutOfBoundsException {
        if ((len <= 0) || (len > src.length - offset + 1) || (src == null)
                || (src.length <= 0)) {
            throw new ArrayIndexOutOfBoundsException(
                    "the array is out of length!");
        }
        long[] dest = new long[len];
        for (int ii = 0; ii < len; ii++) {
            dest[ii] = src[(offset + ii)];
        }
        return dest;
    }

    public static String[] arrayCopy(String[] src, int offset, int len)
            throws ArrayIndexOutOfBoundsException {
        if ((len <= 0) || (len > src.length - offset + 1) || (src == null)
                || (src.length <= 0)) {
            throw new ArrayIndexOutOfBoundsException(
                    "the array is out of length!");
        }
        String[] dest = new String[len];
        for (int ii = 0; ii < len; ii++) {
            dest[ii] = src[(offset + ii)];
        }
        return dest;
    }

    public static short[] arrayCopy(short[] src, int offset, int len)
            throws ArrayIndexOutOfBoundsException {
        if ((len <= 0) || (len > src.length - offset + 1) || (src == null)
                || (src.length <= 0)) {
            throw new ArrayIndexOutOfBoundsException(
                    "the array is out of length!");
        }
        short[] dest = new short[len];
        for (int ii = 0; ii < len; ii++) {
            dest[ii] = src[(offset + ii)];
        }
        return dest;
    }

    public static short[][] arrayCopy(short[][] src, int offset, int len)
            throws ArrayIndexOutOfBoundsException {
        if ((len <= 0) || (len > src.length - offset + 1) || (src == null)
                || (src.length <= 0)) {
            throw new ArrayIndexOutOfBoundsException(
                    "the array is out of length!");
        }
        short[][] dest = new short[len][2];
        for (int ii = 0; ii < len; ii++) {
            dest[ii][0] = src[(offset + ii)][0];
            dest[ii][1] = src[(offset + ii)][1];
        }
        return dest;
    }

    public static byte[] arrayCopy(byte[] src, int offset, int len)
            throws ArrayIndexOutOfBoundsException {
        if ((len <= 0) || (len > src.length - offset + 1) || (src == null)
                || (src.length <= 0)) {
            throw new ArrayIndexOutOfBoundsException("the array[" + src.length
                    + "]is out of length[" + offset + ":" + len + "]!");
        }
        byte[] dest = new byte[len];
        for (int ii = 0; ii < len; ii++) {
            dest[ii] = src[(offset + ii)];
        }
        return dest;
    }
}
