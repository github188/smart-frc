/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.service;

import cn.com.inhand.common.constant.Constant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.ShardedJedis;
import redis.clients.jedis.ShardedJedisPool;

/**
 *
 * @author lenovo
 */
public class RedisFactory {

    private Jedis jedis;//非切片额客户端连接
    private JedisPool jedisPool;//非切片连接池
    private ShardedJedisPool shardedJedisPool;

    public RedisFactory(ShardedJedisPool shardedJedisPool,JedisPool jedisPool) {
        this.shardedJedisPool = shardedJedisPool;
        this.jedisPool = jedisPool;
    }

    public ShardedJedis getRedisClient() {
        try {
            ShardedJedis shardJedis = shardedJedisPool.getResource();
            return shardJedis;
        } catch (Exception e) {
        }
        return null;
    }

    public Jedis getClient() {
        jedis = jedisPool.getResource();
        return jedis;
    }
    
    public void returnResourceJedis(){
        jedisPool.returnResource(jedis);
    }

    public void returnResource(ShardedJedis shardedJedis) {
        shardedJedisPool.returnResource(shardedJedis);
    }

    public void returnResource(ShardedJedis shardedJedis, boolean broken) {
        if (broken) {
            shardedJedisPool.returnBrokenResource(shardedJedis);
        } else {
            shardedJedisPool.returnResource(shardedJedis);
        }
    }

    /**
     * 设置单个值 重新设置key的值视为覆盖旧值
     *
     * @param key
     * @param value
     * @return
     */
    public String set(String key, String value) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.set(key, value);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将值 value 关联到 key ，并将 key 的生存时间设为 seconds (以秒为单位)
     *
     * @param key
     * @param seconds
     * @param value
     * @return
     */
    public String setex(String key, int seconds, String value) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.setex(key, seconds, value);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将 key 的值设为 value ，当且仅当 key 不存在。若给定的 key 已经存在，则 SETNX 不做任何动作
     *
     * @param key
     * @param value
     * @return
     */
    public Long setnx(String key, String value) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.setnx(key, value);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将给定 key 的值设为 value ，并返回 key 的旧值(old value)。当 key 存在但不是字符串类型时，返回一个错误
     *
     * @param key
     * @param value
     * @return
     */
    public String getSet(String key, String value) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.getSet(key, value);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。 当 key 不存在时，返回 -2 。 当 key
     * 存在但没有设置剩余生存时间时，返回 -1 。 否则，以秒为单位，返回 key 的剩余生存时间
     *
     * @param key
     * @return
     */
    public Long ttl(String key) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.ttl(key);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 获取单个值
     *
     * @param key
     * @return
     */
    public String get(String key) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.get(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 刪除key
     *
     * @param key
     * @return
     */
    public Long del(String key) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.del(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将哈希表 key 中的域 field 的值设为 value 。
     *
     * @param key
     * @param field
     * @param value
     * @return
     */
    public Long hset(String key, String field, String value) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hset(key, field, value);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回哈希表 key 中给定域 field 的值
     *
     * @param key
     * @param field
     * @return
     */
    public String hget(String key, String field) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hget(key, field);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 删除哈希表 key 中的指定域，不存在的域将被忽略
     *
     * @param key
     * @param field
     * @return
     */
    public Long hdel(String key, String field) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hdel(key, field);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回哈希表 key 中域的数量
     *
     * @param key
     * @return
     */
    public Long hlen(String key) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hlen(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回哈希表 key 中的所有域
     *
     * @param key
     * @return
     */
    public Set<String> hkeys(String key) {
        Set<String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hkeys(key);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    public List<String> getAllJedis() {

        List<String> result = new ArrayList<String>();
        Jedis jredis = this.getClient();

        try {

            Set s = jredis.keys("*:" + Constant.REDIS_TRADE_INFO_KEY);
            Iterator it = s.iterator();
            while (it.hasNext()) {
                String key = (String) it.next();
                String value = jredis.get(key);
                result.add(value);
                // System.out.println(key + value);
            }

        } catch (Exception e) {
        }
        return result;

    }

    /**
     * 返回哈希表 key 中所有域的值
     *
     * @param key
     * @return
     */
    public List<String> hvals(String key) {
        List<String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hvals(key);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回哈希表 key 中，所有的域和值
     *
     * @param key
     * @return
     */
    public Map<String, String> hgetAll(String key) {
        Map<String, String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hgetAll(key);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回哈希表 key 中，一个或多个给定域的值
     *
     * @param key
     * @param fields
     * @return
     */
    public List<String> hmget(String key, String... fields) {
        List<String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hmget(key, fields);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 同时将多个 field-value (域-值)对设置到哈希表 key 中
     *
     * @param key
     * @param hash
     * @return
     */
    public String hmset(String key, Map<String, String> hash) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hmset(key, hash);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将哈希表 key 中的域 field 的值设置为 value ，当且仅当域 field 不存在。若域 field 已经存在，该操作无效
     *
     * @param key
     * @param field
     * @param value
     * @return
     */
    public Long hsetnx(String key, String field, String value) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hsetnx(key, field, value);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 查看哈希表 key 中，给定域 field 是否存在
     *
     * @param key
     * @param field
     * @return
     */
    public Boolean hexists(String key, String field) {
        Boolean result = false;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.hexists(key, field);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 判断key是否存在
     *
     * @param key
     * @return
     */
    public Boolean exists(String key) {
        Boolean result = false;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.exists(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回key对应的value的值的类型
     *
     * @param key
     * @return
     */
    public String type(String key) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.type(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将一个或多个值 value 插入到列表 key 的表头
     *
     * @param key
     * @param string
     * @return
     */
    public Long lpush(String key, String string) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.lpush(key, string);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将一个或多个值 value 插入到列表 key 的表尾(最右边)
     *
     * @param key
     * @param string
     * @return
     */
    public Long rpush(String key, String string) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.rpush(key, string);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回列表 key 的长度。
     *
     * @param key
     * @return
     */
    public Long llen(String key) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.llen(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定
     *
     * @param key
     * @param start
     * @param end
     * @return
     */
    public List<String> lrange(String key, long start, long end) {
        List<String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.lrange(key, start, end);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除
     *
     * @param key
     * @param start
     * @param end
     * @return
     */
    public String ltrim(String key, long start, long end) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.ltrim(key, start, end);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回列表 key 中，下标为 index 的元素 下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0
     * 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2
     * 表示列表的倒数第二个元素，以此类推。
     *
     * @param key
     * @param index
     * @return
     */
    public String lindex(String key, long index) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.lindex(key, index);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将列表 key 下标为 index 的元素的值设置为 value
     *
     * @param key
     * @param index
     * @param value
     * @return
     */
    public String lset(String key, long index, String value) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.lset(key, index, value);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 根据参数 count 的值，移除列表中与参数 value 相等的元素。
     *
     * count 的值可以是以下几种： count > 0 : 从表头开始向表尾搜索，移除与 value 相等的元素，数量为 count 。 count
     * < 0 : 从表尾开始向表头搜索，移除与 value 相等的元素，数量为 count 的绝对值。 count = 0 : 移除表中所有与
     * value 相等的值 @param key @param count @param value @return
     */
    public Long lrem(String key, long count, String value) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.lrem(key, count, value);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 移除并返回列表 key 的头元素
     *
     * @param key
     * @return
     */
    public String lpop(String key) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.lpop(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 移除并返回列表 key 的尾元素
     *
     * @param key
     * @return
     */
    public String rpop(String key) {
        String result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.rpop(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 将一个或多个 member 元素加入到集合 key 当中，已经存在于集合的 member 元素将被忽略
     *
     * @param key
     * @param member
     * @return
     */
    public Long sadd(String key, String member) {
        Long result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.sadd(key, member);

        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回集合 key 中的所有成员
     *
     * @param key
     * @return
     */
    public Set<String> smembers(String key) {
        Set<String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.smembers(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }

    /**
     * 返回或保存给定列表、集合、有序集合 key 中经过排序的元素
     *
     * @param key
     * @return
     */
    public List<String> sort(String key) {
        List<String> result = null;
        ShardedJedis shardedJedis = this.getRedisClient();
        if (shardedJedis == null) {
            return result;
        }
        boolean broken = false;
        try {
            result = shardedJedis.sort(key);
        } catch (Exception e) {
            broken = true;
        } finally {
            this.returnResource(shardedJedis, broken);
        }
        return result;
    }
    
    /**
     * 获取所有KEY的信息
     * @param keys
     * @return 
     */
    public Iterator getKeys(String keys){
        Set s = this.getClient().keys(keys);
        Iterator iterator = s.iterator();
        return iterator;
    }
}
