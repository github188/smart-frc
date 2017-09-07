package cn.com.inhand.dn4.log;

import cn.com.inhand.dn4.utils.IOUtils;
import cn.com.inhand.dn4.utils.JsonUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 提取代码中的日志->翻译->存储
 *
 * @author franklin.li
 */
public class LogExtractor {
    private ArrayList<String> filePath;
    private ArrayList<String> contents;
    private String splitStr = "[\"|,]";

    public LogExtractor() {
        super();
        filePath = new ArrayList<String>();
        contents = new ArrayList<String>();
    }

    public void addPath(String path) {
        filePath.add(path);
    }

    public void removePath(String path) {
        int index = filePath.indexOf(path);
        System.out.println(index);
        if (index >= 0) {
            filePath.remove(index);
        }
    }

    /**
     * 查找有日志发布的java与erlang源文件
     *
     * @param file
     */
    public void fileSearch(File file, String endsWith) {
        InputStream is = null;
        String content = null;
        if (file.exists()) {
            if (file.isDirectory()) {
                File[] files = file.listFiles();
                for (File f : files) {
                    fileSearch(f, endsWith);
                }
            } else {
                if (file.getName().endsWith(endsWith)) {
                    try {
                        System.out.println(file.getPath());
                        is = new FileInputStream(file);
                        content = IOUtils.stream2String(is);
                        contents.add(content);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    /**
     * @param content
     * @param regex   java匹配括号之间的 ：".*?\"\\((.*?)\\)\".*?"  erlang ： ""
     */
    public void fileMatch(String content, String regex, Map<Integer, String> map, String splitStr) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            splitLog(map, matcher.group(1), splitStr);
        }
    }

    public void splitLog(Map<Integer, String> map, String content, String splitStr) {
        String[] array = content.split(splitStr);
        if (array.length >= 2) {
            map.put(Integer.parseInt(array[0]), array[2]);
        }
    }

    /**
     * 执行提取日志操作
     *
     * @param path 工程位置
     * @return
     * @throws Exception
     */
    public Map<Integer, String> execExtractor(String path) throws Exception {
        Map<Integer, String> map = new HashMap<Integer, String>();
        LogExtractor le = new LogExtractor();
        File file = new File(path);
        le.fileSearch(file, "Controller.java");
        for (String content : le.contents) {
            //匹配java的日志
            le.fileMatch(content, "publishLogInfo\\((\\d{7},.*?\".*)\",", map, splitStr);
        }
        le.contents.clear();
        le.fileSearch(file, ".erl");
        for (String content : le.contents) {
            //匹配erlang的日志
            le.fileMatch(content, "\\?PUBLISH_LOG\\((\\d{7}, ?\".*)\",", map, splitStr);
        }
        return map;
    }

    public static void main(String[] args) throws Exception {
//		InputStream is = new FileInputStream("D:\\123456.txt");
//		Pattern pattern = Pattern.compile("publishLogInfo\\((\\d{7},.*?\".*)\",");
//		Matcher matcher = pattern.matcher(IOUtils.stream2String(is));
//		while (matcher.find()) {
//			String c = matcher.group(1);
//			String[] array = c.split("[\"|,]");
//			
//			for(String s:array){
//				System.out.println(s);
//			}
//		}
        LogExtractor le = new LogExtractor();
        Map<Integer, String> map = le.execExtractor("C:\\Users\\franklin.li\\Desktop\\Dn4");
        System.out.println("count:" + map.size() + "\n" + JsonUtils.writeObjectJson(map));
    }
}
