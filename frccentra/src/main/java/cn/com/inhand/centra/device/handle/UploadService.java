/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.imageio.stream.FileImageInputStream;

/**
 *
 * @author lenovo
 */
public class UploadService {

    public static byte[] readFile(String path) throws Exception {
        byte[] data = null;
        FileImageInputStream input = null;
        try {
            input = new FileImageInputStream(new File(path));
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buf = new byte[1024];
            int numBytesRead = 0;
            while ((numBytesRead = input.read(buf)) != -1) {
                output.write(buf, 0, numBytesRead);
            }
            data = output.toByteArray();
            output.close();
            input.close();
        } catch (FileNotFoundException ex1) {
            ex1.printStackTrace();
        } catch (IOException ex1) {
            ex1.printStackTrace();
        }
        return data;
    }

    public static String upload(byte[] payload, String uploadUrl) throws IOException {
        URL url = new URL(uploadUrl);
        System.out.print("Debug at UploadService.java 48 Line upload Url " + url);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setDoInput(true);
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/octet-stream");
        connection.setRequestProperty("Content-Length", String.valueOf(payload.length));
        connection.connect();

        OutputStream os = connection.getOutputStream();
        DataOutputStream dos = new DataOutputStream(os);
        dos.write(payload);
        dos.flush();
        dos.close();


        InputStream is = connection.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, "utf-8"));//设置编码,否则中文乱码
        StringBuffer data = new StringBuffer();
        String lines;
        while ((lines = reader.readLine()) != null) {
            data.append(lines);
        }
        System.out.println("Debug at UploadService.java 71 Line upload Url " + data.toString());
        reader.close();
        is.close();

        return data.toString();
    }
}
