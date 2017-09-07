package cn.com.inhand.dn4.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * 日期格式化类
 *
 * @author franklin.li
 */
public class DateUtils {

    /**
     * 获取utc零时区的时间戳（10位 second）
     *
     * @return
     */
    public static long getUTC() {
        Calendar calendar = Calendar.getInstance();
        TimeZone tz = TimeZone.getTimeZone("GMT");
        calendar.setTimeZone(tz);
        return calendar.getTimeInMillis() / 1000;
    }

    public static String getDate() {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        TimeZone zone = TimeZone.getDefault();
        df.setTimeZone(zone);
        String date = df.format(new Date());
        return date;
    }

    /**
     * @param time 标准utc时间（10位）s
     * @param ID   "GMT+8"
     * @return
     */
    public static String dateFormat(long time, String ID) {
        if (time / 1000000000000l == 0) {
            time *= 1000;
        }
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        TimeZone zone = TimeZone.getTimeZone(ID);
        format.setTimeZone(zone);
        return format.format(time);
    }

    /**
     * 本地默认时区下的时间格式化
     *
     * @param time time 标准utc时间（10位）s
     * @return
     */
    public static String dateFormat(long time) {
        if (time / 1000000000000l == 0) {
            time *= 1000;
        }
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        TimeZone zone = TimeZone.getDefault();
        format.setTimeZone(zone);
        return format.format(time);
    }

    /**
     * @param time   time 标准utc时间（10位）s
     * @param ID     the ID for a TimeZone, either an abbreviation such as "PST", a
     *               full name such as "America/Los_Angeles", or a custom ID such
     *               as "GMT-8:00". Note that the support of abbreviations is for
     *               JDK 1.1.x compatibility only and full names should be used.
     * @param format like:"yyyy-MM-dd HH:mm:ss"
     * @return
     */
    public static String dateFormat(long time, String ID, String format) {
        if (time / 1000000000000l == 0) {
            time *= 1000;
        }
        DateFormat df = new SimpleDateFormat(format);
        TimeZone zone = TimeZone.getTimeZone(ID);
        df.setTimeZone(zone);
        return df.format(time);
    }

    public static int getDateByUTC(long utc) {
        Calendar calendar = Calendar.getInstance();
        TimeZone tz = TimeZone.getTimeZone("GMT");
        calendar.setTimeZone(tz);
        return calendar.get(Calendar.DAY_OF_MONTH);
    }
}
