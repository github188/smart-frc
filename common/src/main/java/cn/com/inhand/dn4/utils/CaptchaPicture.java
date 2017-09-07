package cn.com.inhand.dn4.utils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.OutputStream;
import java.util.Random;


public class CaptchaPicture {
    //    private int width = 80;//图片宽
//    private int height = 26;//图片高
    private int lineSize = 40;//干扰线数量

    private String randString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";//随机产生的字符串

    private Font getFont() {
        return new Font("Fixedsys", Font.CENTER_BASELINE, 18);
    }

    private Color getRandColor(Random random, int fc, int bc) {
        if (fc > 255)
            fc = 255;
        if (bc > 255)
            bc = 255;
        int r = fc + random.nextInt(bc - fc - 16);
        int g = fc + random.nextInt(bc - fc - 14);
        int b = fc + random.nextInt(bc - fc - 18);
        return new Color(r, g, b);
    }

    /**
     * 绘制字符串
     *
     * @param random
     * @param g
     * @param randomString
     * @param i
     * @return
     */
    private void drowString(Random random, Graphics g, String randomString, int i) {
        g.setFont(getFont());
        g.setColor(new Color(random.nextInt(101), random.nextInt(111), random.nextInt(121)));
//        String rand = String.valueOf(getRandomString(random.nextInt(randString.length())));
//        randomString +=rand;
        g.translate(random.nextInt(3), random.nextInt(3));
        g.drawString(randomString, 13 * i, 16);
    }

    /**
     * 绘制干扰线
     *
     * @param random
     * @param g
     */
    private void drowLine(Random random, Graphics g, int width, int height) {
        int x = random.nextInt(width);
        int y = random.nextInt(height);
        int xl = random.nextInt(13);
        int yl = random.nextInt(15);
        g.drawLine(x, y, x + xl, y + yl);
    }

    /**
     * 获取随机的字符
     */
    private String getRandomString(int num) {
        return String.valueOf(randString.charAt(num));
    }

    /**
     * 随机生成图片
     *
     * @param os
     * @param randomStr 随即字符
     * @param fontSize  字体大小 18
     * @param width     图片宽度 90
     * @param height    图片高度 30
     */
    public void getCaptcha(OutputStream os, String randomStr, int fontSize, int width, int height) {
        Random rand = new Random();
        //BufferedImage类是具有缓冲区的Image类,Image类是用于描述图像信息的类
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_BGR);
        Graphics g = image.getGraphics();//产生Image对象的Graphics对象,改对象可以在图像上进行各种绘制操作
        g.fillRect(0, 0, width, height);
        g.setFont(new Font("Times New Roman", Font.ROMAN_BASELINE, fontSize));
        g.setColor(getRandColor(rand, 110, 133));
        //绘制干扰线
        for (int i = 0; i <= lineSize; i++) {
            drowLine(rand, g, width, height);
        }
        //绘制随机字符

        for (int i = 0; i < randomStr.length(); i++) {
            drowString(rand, g, String.valueOf(randomStr.charAt(i)), i);
        }
        g.dispose();
        try {
            ImageIO.write(image, "JPEG", os);//将内存中的图片输出到输出流
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
