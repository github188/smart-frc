package cn.com.inhand.common.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

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
     * @param "GMT+8"
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
     * @param time 标准utc时间（10位）s
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

    public static Date firstDateOfWeek(Date date) {
        Date date1 = org.apache.commons.lang3.time.DateUtils.truncate(date, Calendar.DATE);
        Calendar calendar = org.apache.commons.lang3.time.DateUtils.toCalendar(date1);
        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
        return org.apache.commons.lang3.time.DateUtils.addDays(date1, 1 - dayOfWeek);
    }

    public static Long getTimeStampByDate(Date date) {
        SimpleDateFormat sim = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        long ts = Timestamp.valueOf(sim.format(date)).getTime();
        return ts;
    }

    public static Long getTimesMorning() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return (cal.getTimeInMillis() / 1000);
    }

    public static Long getTimeByHourByTime(Long time) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = format.parse(format1.format(time * 1000) + " " + format.parse(format.format(time * 1000)).getHours() + ":00:00");
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return date.getTime() / 1000;
    }

    /**
     * 获取当前天的凌晨的秒数
     *
     * @param time
     * @return
     * @throws ParseException
     */
    public static Long getTimesMorningByTime(Long time) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date date = format.parse(format.format(time * 1000));
        return date.getTime() / 1000;
    }

    /**
     * 获取当前天的凌晨的秒数
     *
     * @param time
     * @param timeZoneID
     * @return
     * @throws ParseException
     */
    public static Long getTimesMorningByTime(Long time, String timeZoneID) throws ParseException {
        if (timeZoneID == null || timeZoneID.trim().equals("")) {
            timeZoneID = TimeZone.getDefault().getID();
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        format.setTimeZone(TimeZone.getTimeZone(timeZoneID));
        Date date = format.parse(format.format(time * 1000));
        return date.getTime() / 1000;
    }

    /**
     * 获取当前天的结束时间
     *
     * @param time
     * @return
     * @throws ParseException
     */
    public static long getTimesDateTime() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis() / 1000 + 24 * 60 * 60 - 1;
    }

    /**
     * 当月第一天
     *
     * @return
     */
    public static long getMonthFirstDay() {
        Calendar cale = Calendar.getInstance();
        // 获取当前月的第一天
        cale = Calendar.getInstance();
        cale.add(Calendar.MONTH, 0);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }
       /**
     * 当月第一天
     *
     * @return
     */
    public static long getMonthFirstDay(String timeZoneId) {
        if(timeZoneId==null||timeZoneId.equals("")){
            timeZoneId = TimeZone.getDefault().getID();
        }
        Calendar cale = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        // 获取当前月的第一天
       // cale = Calendar.getInstance();
        cale.add(Calendar.MONTH, 0);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    /**
     * 当月最后一天
     *
     * @return
     */
    public static long getMonthLastDay() {
        Calendar cale = Calendar.getInstance();
        // 获取前月的最后一天
        cale = Calendar.getInstance();
        cale.add(Calendar.MONTH, 1);
        cale.set(Calendar.DAY_OF_MONTH, 0);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;

    }
    /**
     * 当月最后一天
     *
     * @return
     */
    public static long getMonthLastDay(String timeZoneId) {
        if(timeZoneId==null||timeZoneId.equals("")){
            timeZoneId = TimeZone.getDefault().getID();
        }
        Calendar cale = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        // 获取前月的最后一天
      //  cale = Calendar.getInstance();
        cale.add(Calendar.MONTH, 1);
        cale.set(Calendar.DAY_OF_MONTH, 0);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;

    }
    /**
     * 当前年的第一天
     *
     * @return
     */
    public static long getYearFirstDay() {
        Calendar cale = Calendar.getInstance();
        cale = Calendar.getInstance();
        cale.set(Calendar.MONTH, 0);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    public static long getYearFirstDay(String timeZoneID) {
        if (timeZoneID == null || timeZoneID.trim().equals("")) {
            timeZoneID = TimeZone.getDefault().getID();
        }
        Calendar cale = Calendar.getInstance(TimeZone.getTimeZone(timeZoneID));
        //  cale = Calendar.getInstance();
        cale.set(Calendar.MONTH, 0);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    /**
     * 当前年的最后一天
     *
     * @return
     */
    public static long getYearLastDay() {
        Calendar cale = Calendar.getInstance();
        cale = Calendar.getInstance();
        cale.set(Calendar.MONTH, 11);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    /**
     * 获取指定时间所在月的第一天的零点时间
     *
     * @param time
     * @return
     */
    public static long getOneMonthFirstDate(long time) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        int month = 0;
        try {
            month = format.parse(format.format(time * 1000)).getMonth();
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }

        Calendar cale = Calendar.getInstance();
        cale = Calendar.getInstance();
        cale.set(Calendar.MONTH, month);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    public static long getOneMonthFirstDate(long time, String timeZoneID) {
        if (timeZoneID == null || timeZoneID.trim().equals("")) {
            timeZoneID = TimeZone.getDefault().getID();
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        format.setTimeZone(TimeZone.getTimeZone(timeZoneID));
        int month = 0;
        try {
            month = format.parse(format.format(time * 1000)).getMonth();
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }

        Calendar cale = Calendar.getInstance(TimeZone.getTimeZone(timeZoneID));
        //cale = Calendar.getInstance();
        cale.set(Calendar.MONTH, month);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    /**
     * 获取当前年某一个月的第一天
     *
     * @param month
     * @return
     */
    public static long getOneMonthStartOfYear(int month) {

        Calendar cale = Calendar.getInstance();
        cale.set(Calendar.MONTH, month - 1);
        cale.set(Calendar.DAY_OF_MONTH, 1);
        cale.set(Calendar.HOUR_OF_DAY, 0);
        cale.set(Calendar.MINUTE, 0);
        cale.set(Calendar.SECOND, 0);
        return cale.getTimeInMillis() / 1000;
    }

    /**
     * 获取某年某一个月的第一天
     *
     * @param month
     * @return
     */
    public static long getOneMonthStartDayOfYear(int month, long time) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String sd = format.format(new Date(Long.parseLong(String.valueOf(time * 1000))));
            Date date = format.parse(sd);
            Calendar cale = Calendar.getInstance();
            cale.setTime(date);
            int year = cale.get(Calendar.YEAR);
            cale.set(Calendar.YEAR, year);
            cale.set(Calendar.MONTH, month - 1);
            cale.set(Calendar.DAY_OF_MONTH, 1);
            cale.set(Calendar.HOUR_OF_DAY, 0);
            cale.set(Calendar.MINUTE, 0);
            cale.set(Calendar.SECOND, 0);
            return cale.getTimeInMillis() / 1000;
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return 0;
    }

    /**
     * 获取某年某一个月的第一天 带时区，时间偏移量
     *
     * @param month
     * @return
     */
    public static long getTimeZoneOneMonthStartDayOfYear(int month, long time, String timeZoneId) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            format.setTimeZone(TimeZone.getTimeZone(timeZoneId));
            String sd = format.format(new Date(Long.parseLong(String.valueOf(time * 1000))));
            Date date = format.parse(sd);
            // TimeZone.setDefault(geTimeZone(offset));
            Calendar cale = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
            cale.setTime(date);
            int year = cale.get(Calendar.YEAR);
            cale.set(Calendar.YEAR, year);
            cale.set(Calendar.MONTH, month - 1);
            cale.set(Calendar.DAY_OF_MONTH, 1);
            cale.set(Calendar.HOUR_OF_DAY, 0);
            cale.set(Calendar.MINUTE, 0);
            cale.set(Calendar.SECOND, 0);
            return cale.getTimeInMillis() / 1000;
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return 0;
    }

    /**
     * 根据偏移量获取时区
     *
     * @param offset
     * @return
     */
    private static TimeZone geTimeZone(int offset) {
        String[] ids = TimeZone.getAvailableIDs(offset);
        return TimeZone.getTimeZone(ids[0]);
    }
    //获取前一天的秒数

    public static Long getYesterday(Long seconds) {
        Date date = new Date(seconds * 1000);
        //获取昨天
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, -1);
        Long ss = cal.getTime().getTime() / 1000;//获取前一天的秒数

        return ss;
    }
    //获取前一天的秒数

    public static Long getYesterday(Long seconds, String timeZoneId) {
        if (timeZoneId == null || timeZoneId.equals("")) {
            timeZoneId = TimeZone.getDefault().getID();
        }
        Date date = new Date(seconds * 1000);
        //获取昨天
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        cal.setTime(date);
        cal.add(Calendar.DATE, -1);
        Long ss = cal.getTime().getTime() / 1000;//获取前一天的秒数

        return ss;
    }

    public static Long getLastMonth(Long seconds) {
        Date date = new Date(seconds * 1000);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, -1);
        cal.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天 
        Long ss = cal.getTime().getTime() / 1000;//获取上一个月的秒数

        return ss;
    }

    public static Long getMonday(Long seconds) {
        Date date = new Date(seconds * 1000);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.setFirstDayOfWeek(Calendar.MONDAY);//将每周第一天设为星期一，默认是星期天
        cal.add(Calendar.DATE, -1 * 7);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        Long ss = cal.getTime().getTime() / 1000;//获取周一的秒数
        return ss;
    }

    public static Long getSunday(Long seconds) {
        Date date = new Date(seconds * 1000);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.setFirstDayOfWeek(Calendar.MONDAY);//将每周第一天设为星期一，默认是星期天
        cal.add(Calendar.DATE, -1 * 7);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        Long ss = cal.getTime().getTime() / 1000;//获取周日的秒数
        return ss;
    }

    /**
     * 根据年 月 获取对应的月份 天数 
     *
     */
    public static int getDaysByYearMonth(Long seconds) {
        Date date = new Date(seconds * 1000);
        int month = getMonth(date);
        int year = getYear(date);
        Calendar a = Calendar.getInstance();
        a.set(Calendar.YEAR, year);
        a.set(Calendar.MONTH, month - 1);
        a.set(Calendar.DATE, 1);
        a.roll(Calendar.DATE, -1);
        int maxDate = a.get(Calendar.DATE);
        return maxDate;
    }

    public static int getYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.YEAR);
    }

    public static int getMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MONTH) + 1;
    }

    public static int getDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DAY_OF_MONTH);
    }

    public static String getDateByTime(Long time) throws ParseException {
        Date date = new Date(time * 1000);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        return format.format(date);
    }

    /**
     * 某年某月最后一天
     *
     * @param month
     * @param time
     * @return
     */
    public static long getOneMonthEndDayOfYear(int month, long time) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String sd = format.format(new Date(Long.parseLong(String.valueOf(time * 1000))));
            Date date = format.parse(sd);
            Calendar cale = Calendar.getInstance();
            cale.setTime(date);
            int year = cale.get(Calendar.YEAR);
            cale.set(Calendar.YEAR, year);
            cale.set(Calendar.MONTH, month - 1);
            cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
            cale.set(Calendar.HOUR_OF_DAY, 0);
            cale.set(Calendar.MINUTE, 0);
            cale.set(Calendar.SECOND, 0);
            return cale.getTimeInMillis() / 1000;
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return 0;
    }

    /**
     * 几个月后的时间
     *
     * @param month
     * @param time
     * @return
     */
    public static long getTimeAfterMonths(int month, long time) {
        Date date = new Date(time * 1000);
        Calendar cale = Calendar.getInstance();
        cale.setTime(date);
        int year = cale.get(Calendar.YEAR);
        cale.set(Calendar.YEAR, year);
        cale.set(Calendar.MONTH, cale.get(Calendar.MONTH) + month);
        cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
        cale.set(Calendar.HOUR_OF_DAY, 23);
        cale.set(Calendar.MINUTE, 59);
        cale.set(Calendar.SECOND, 59);
        return cale.getTimeInMillis() / 1000;
    }
        /**
     * 几个月后的时间
     * @param month
     * @param time
     * @return 
     */
    public static long getTimeAfterMonths(int month,long time,String timeZoneId){
            if(timeZoneId==null||timeZoneId.equals("")){
                 timeZoneId = TimeZone.getDefault().getID();
            }
            Date date =new Date(time*1000);
            Calendar cale = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
            cale.setTime(date);
            int year = cale.get(Calendar.YEAR);
            cale.set(Calendar.YEAR, year);
            cale.set(Calendar.MONTH, cale.get(Calendar.MONTH)+month);
             cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
             cale.set(Calendar.HOUR_OF_DAY, 23);
             cale.set(Calendar.MINUTE, 59);
             cale.set(Calendar.SECOND, 59);
           return cale.getTimeInMillis() / 1000;
    }
    //上个月第一天
    public static Long getLastMonthFirstDay(Long seconds) {
        Date date = new Date(seconds * 1000);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, -1);
        cal.set(Calendar.DAY_OF_MONTH, 1);//设置为1号,当前日期既为本月第一天 
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Long ss = cal.getTime().getTime() / 1000;//获取上一个月的秒数

        return ss;
    }
    //上个月第一天
public static Long getLastMonthFirstDay(Long seconds,String timeZoneId){
  if(timeZoneId==null||timeZoneId.equals("")){
         timeZoneId = TimeZone.getDefault().getID();
    }
Date date = new Date(seconds*1000);
Calendar   cal   =   Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
cal.setTime(date);
cal.add(Calendar.MONTH,   -1);
cal.set(Calendar.DAY_OF_MONTH,1);//设置为1号,当前日期既为本月第一天 
cal.set(Calendar.HOUR_OF_DAY, 0);
cal.set(Calendar.MINUTE, 0);
cal.set(Calendar.SECOND, 0);
Long ss = cal.getTime().getTime()/1000;//获取上一个月的秒数

return ss;
}
    //上个月最后一天

    public static long getLastMonthLastDay(Long seconds) {
        Date date = new Date(seconds * 1000);
        Calendar cale = Calendar.getInstance();
        cale.setTime(date);
        cale.add(Calendar.MONTH, -1);
        cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
        cale.set(Calendar.HOUR_OF_DAY, 23);
        cale.set(Calendar.MINUTE, 59);
        cale.set(Calendar.SECOND, 59);
        return cale.getTimeInMillis() / 1000;

    }
       //上个月最后一天
    public static long getLastMonthLastDay(Long seconds,String timeZoneId) {
        if(timeZoneId==null||timeZoneId.equals("")){
                 timeZoneId = TimeZone.getDefault().getID();
            }
        Date date = new Date(seconds*1000);
        Calendar   cale   =   Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        cale.setTime(date);
        cale.add(Calendar.MONTH,   -1);
        cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
        cale.set(Calendar.HOUR_OF_DAY, 23);
        cale.set(Calendar.MINUTE, 59);
        cale.set(Calendar.SECOND, 59);
        return cale.getTimeInMillis() / 1000;

    }
    public static long getNextMonthLastDay(Long seconds) {
        Date date = new Date(seconds * 1000);
        Calendar cale = Calendar.getInstance();
        cale.setTime(date);
        cale.add(Calendar.MONTH, 1);
        cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
        cale.set(Calendar.HOUR_OF_DAY, 23);
        cale.set(Calendar.MINUTE, 59);
        cale.set(Calendar.SECOND, 59);
        return cale.getTimeInMillis() / 1000;
    }
    public static long getNextMonthLastDay(Long seconds,String timeZoneId){
        if(timeZoneId==null||timeZoneId.equals("")){
            timeZoneId = TimeZone.getDefault().getID();
        }
          Date date = new Date(seconds*1000);
        Calendar   cale  =   Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        cale.setTime(date);
        cale.add(Calendar.MONTH,  1); 
        cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
        cale.set(Calendar.HOUR_OF_DAY, 23);
        cale.set(Calendar.MINUTE, 59);
        cale.set(Calendar.SECOND, 59);
        return cale.getTimeInMillis() / 1000;
    }
    /**
     * 时间相差月数
     *
     * @param time1小
     * @param time2大
     * @return
     */
    public static int getMonthDiff(long time1, long time2) {
        int result = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String date1 = sdf.format(new Date(Long.parseLong(String.valueOf(time1 * 1000))));
            String date2 = sdf.format(new Date(Long.parseLong(String.valueOf(time2 * 1000))));
            Calendar c1 = Calendar.getInstance();
            Calendar c2 = Calendar.getInstance();
            c1.setTime(sdf.parse(date1));
            c2.setTime(sdf.parse(date2));
            int year1 = c1.get(Calendar.YEAR);
            int month1 = c1.get(Calendar.MONTH);
            int year2 = c2.get(Calendar.YEAR);
            int month2 = c2.get(Calendar.MONTH);
            if (year1 == year2) {
                result = month2 - month1 + 1;
            } else {
                result = 12 * (year2 - year1) + month2 - month1 + 1;
            }
            // result = c2.get(Calendar.MONTH) - c1.get(Calendar.MONTH);
        } catch (ParseException ex) {
            Logger.getLogger(DateUtils.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;

    }

    public static Long getTomorrow(Long seconds) {
        Date date = new Date(seconds * 1000);
        //获取昨天
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, 1);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Long ss = cal.getTime().getTime() / 1000;//

        return ss;
    }
      public static Long getTomorrow(Long seconds,String timeZoneId){
         if(timeZoneId==null||timeZoneId.equals("")){
             timeZoneId = TimeZone.getDefault().getID();
         }
        Date date = new Date(seconds*1000);
        //获取昨天
        Calendar   cal   =   Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        cal.setTime(date);
        cal.add(Calendar.DATE,   1);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Long ss = cal.getTime().getTime()/1000;//

        return ss;
   }
    /**
     * 获取某天的小时数
     *
     * @param time
     * @param offset 时差
     * @return
     */
    public static int getDayTime(long time, String timeZoneId) {
        // TimeZone.setDefault(geTimeZone(offset));
        if (timeZoneId == null || timeZoneId.trim().equals("")) {
            timeZoneId = TimeZone.getDefault().getID();
        }
        Calendar start = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        start.setTime(new Date(time * 1000));
        start.add(Calendar.DATE, 1);
        int day = (int) ((start.getTimeInMillis() - time * 1000L) / (3600 * 1000L));
        return day;
    }

    public static Long getTimeZoneMonday(Long seconds, String timeZoneId) {
        if (timeZoneId == null || timeZoneId.trim().equals("")) {
            timeZoneId = TimeZone.getDefault().getID();
        }
        Date date = new Date(seconds * 1000);
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        cal.setTime(date);
        cal.setFirstDayOfWeek(Calendar.MONDAY);//将每周第一天设为星期一，默认是星期天
        cal.add(Calendar.DATE, -1 * 7);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        Long ss = cal.getTime().getTime() / 1000;//获取周一的秒数
        return ss;
    }

    public static Long getTimeZoneSunday(Long seconds, String timeZoneId) {
        if (timeZoneId == null || timeZoneId.trim().equals("")) {
            timeZoneId = TimeZone.getDefault().getID();
        }
        Date date = new Date(seconds * 1000);
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        cal.setTime(date);
        cal.setFirstDayOfWeek(Calendar.MONDAY);//将每周第一天设为星期一，默认是星期天
        cal.add(Calendar.DATE, -1 * 7);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        Long ss = cal.getTime().getTime() / 1000;//获取周日的秒数
        return ss;
    }

    /**
     * 根据年 月 获取对应的月份 天数 
     *
     */
    public static int getTimeZoneDaysByYearMonth(Long seconds, String timeZoneId) {
        if (timeZoneId == null || timeZoneId.trim().equals("")) {
            timeZoneId = TimeZone.getDefault().getID();
        }
        Date date = new Date(seconds * 1000);
        // int month = getTimeZoneMonth(date ,offset);
        //  int year  = getTimeZoneYear(date,offset);
        Calendar a = Calendar.getInstance(TimeZone.getTimeZone(timeZoneId));
        a.setTime(date);
        // a.set(Calendar.YEAR, year);  
        //   a.set(Calendar.MONTH, month - 1);  
        a.set(Calendar.DATE, 1);
        a.roll(Calendar.DATE, -1);
        int maxDate = a.get(Calendar.DATE);
        return maxDate;
    }

    public static void main(String[] arg) {
        TimeZone.setDefault(TimeZone.getTimeZone("GMT"));
        Calendar calendar = Calendar.getInstance();
        TimeZone tz = TimeZone.getTimeZone("GMT");
        calendar.setTimeZone(tz);
        System.out.println(calendar.getTime());
        System.out.println(calendar.getTimeInMillis());
    }
}
