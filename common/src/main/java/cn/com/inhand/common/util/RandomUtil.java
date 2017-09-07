/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.util;

import java.util.Random;

/**
 *
 * @author lenovo
 */
public class RandomUtil {
    public static String getRandomCode(Integer size) {
        Integer result = 0;
        int[] array = new int[]{0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
        Random rand = new Random();//将数据的次序打乱
        for (int i = 10; i > 1; i--) {
            int index = rand.nextInt(i);
            int tmp = array[index];
            array[index] = array[i - 1];
            array[i - 1] = tmp;
        }
        for (int i = 0; i < size; i++) {
            if (array[0] == 0) {
                array[0] = 1;
            }
            result = result * 10 + array[i];
        }
        return result.toString();
    }
}
