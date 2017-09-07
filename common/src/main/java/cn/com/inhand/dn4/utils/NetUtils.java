package cn.com.inhand.dn4.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * 封装的http请求
 *
 * @author franklin.li
 */
public class NetUtils {

    public static final String POST = "post";
    public static final String GET = "get";
    public static final String PUT = "put";
    public static final String DELETE = "delete";

    /**
     * @param url
     * @param headers    http头信息
     * @param bodyStream 数据流
     * @return
     */
    public static InputStream postStream(String url, Map<String, String> headers, InputStream bodyStream) {
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            //headers
            con.setRequestProperty("Content-Type", "application/octet-stream ;charset=UTF-8");
            con.setRequestMethod("POST");
            if (headers != null) {
                Set<String> set = headers.keySet();
                Iterator<String> iter = set.iterator();
                while (iter.hasNext()) {
                    String key = iter.next();
                    con.setRequestProperty(key, headers.get(key));
                }
            }
            //body
            con.setDoOutput(true);
            con.setDoInput(true);
            if (bodyStream != null) {
                OutputStream os = con.getOutputStream();
                byte[] b = new byte[2048];
                int size;
                while ((size = bodyStream.read(b)) > 0) {
                    os.write(b, 0, size);
                }

                os.flush();
                os.close();
            }

            if (con.getResponseCode() == 200) {
                return con.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @param url
     * @param headers http头
     * @param b       二进制流
     * @return
     */
    public static InputStream postStream(String url, Map<String, String> headers, byte[] b) {
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            //headers
            con.setRequestProperty("Content-Type", "application/octet-stream ;charset=UTF-8");
            con.setRequestMethod("POST");
            if (headers != null) {
                Set<String> set = headers.keySet();
                Iterator<String> iter = set.iterator();
                while (iter.hasNext()) {
                    String key = iter.next();
                    con.setRequestProperty(key, headers.get(key));
                }
            }
            //body
            con.setDoOutput(true);
            con.setDoInput(true);
            if (b != null) {
                OutputStream os = con.getOutputStream();
                os.write(b);
                os.flush();
                os.close();
            }

            if (con.getResponseCode() == 200) {
                return con.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @param url
     * @param headers http头
     * @param json    body体 json格式
     * @return
     * @throws IOException
     */
    public static InputStream postMethod(String url, Map<String, String> headers, String json) throws IOException {
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            //headers
            con.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            con.setRequestMethod("POST");
            if (headers != null) {
                Set<String> set = headers.keySet();
                Iterator<String> iter = set.iterator();
                while (iter.hasNext()) {
                    String key = iter.next();
                    con.setRequestProperty(key, headers.get(key));
                }
            }
            //body
            con.setDoOutput(true);
            con.setDoInput(true);
            if (json != null) {
                OutputStream os = con.getOutputStream();
                os.write(json.getBytes("utf-8"));
                os.flush();
                os.close();
            }

            if (con.getResponseCode() == 200) {
                return con.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @param url
     * @param headers http头
     * @return
     * @throws IOException
     */
    public static InputStream getMethod(String url, Map<String, String> headers) throws IOException {
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            //headers
            con.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            con.setRequestMethod("GET");
            if (headers != null) {
                Set<String> set = headers.keySet();
                Iterator<String> iter = set.iterator();
                while (iter.hasNext()) {
                    String key = iter.next();
                    con.setRequestProperty(key, headers.get(key));
                }
            }

            if (con.getResponseCode() == 200) {
                return con.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @param url
     * @param headers http头
     * @return
     */
    public static InputStream deleteMethod(String url, Map<String, String> headers) {
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            //headers
            con.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            con.setRequestMethod("DELETE");
            con.setDoOutput(true);
            if (headers != null) {
                Set<String> set = headers.keySet();
                Iterator<String> iter = set.iterator();
                while (iter.hasNext()) {
                    String key = iter.next();
                    con.setRequestProperty(key, headers.get(key));
                }
            }

            if (con.getResponseCode() == 200) {
                return con.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @param url
     * @param headers http头
     * @param json    put方法的body体
     * @return
     */
    public static InputStream putMethod(String url, Map<String, String> headers, String json) {
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            //headers
            con.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            if (headers != null) {
                Set<String> set = headers.keySet();
                Iterator<String> iter = set.iterator();
                while (iter.hasNext()) {
                    String key = iter.next();
                    con.setRequestProperty(key, headers.get(key));
                }
            }
            //body
            con.setRequestMethod("PUT");
            con.setDoInput(true);
            con.setDoOutput(true);
            if (json != null) {
                OutputStream os = con.getOutputStream();
                os.write(json.getBytes("utf-8"));
                os.flush();
                os.close();
            } else {
                OutputStream os = con.getOutputStream();
                os.flush();
                os.close();
            }

            if (con.getResponseCode() == 200) {
                return con.getInputStream();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
