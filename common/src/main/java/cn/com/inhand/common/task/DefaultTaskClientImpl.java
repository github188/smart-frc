package cn.com.inhand.common.task;

import cn.com.inhand.common.config.Config;
import cn.com.inhand.common.model.Task;
import cn.com.inhand.common.oauth2.TokenClient;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class DefaultTaskClientImpl implements TaskClient {

	private static final String URI = "api2/tasks";
	private static Logger logger = LoggerFactory.getLogger(DefaultTaskClientImpl.class);
	TokenClient tokenClient;
	private RestTemplate template = new RestTemplate();
	private Config config;
	private ExecutorService executors = Executors.newSingleThreadExecutor();

	public DefaultTaskClientImpl(Config config, HttpMessageConverter<?> messageConverter) {
		List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>();
		messageConverters.add(messageConverter);
		this.template.setMessageConverters(messageConverters);
		this.config = config;
		this.tokenClient = new TokenClient(config);
	}

	@Override
	public void asyncCreateTask(final Task task) {
		asyncCreateTask(this.tokenClient.getServerToken(), task);
	}

	@Override
	public void asyncCreateTask(final String accessToken, final Task task) {
		this.executors.execute(new Runnable() {
			public void run() {
				Map<?, ?> result = createSystemTask(accessToken, task);
				logger.debug("create task result {}", result);
				if (result.containsKey("error")) {
					if (Integer.valueOf(result.get("error_code").toString()) == 21327) {
						logger.debug("Expired token and tray refresh token later!!!");
						// 使该线程延迟2秒
						new Timer().schedule(new TimerTask() {
							@Override
							public void run() {
								// 递归调用本方法
								asyncCreateTask(tokenClient.refreshServerToken(), task);
							}
						}, 2000);
					} else {
						try {
							throw new Exception(result.toString());
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		});
	}

	@Override
	public Map<?, ?> createTask(String accessToken, Task task) {
		Assert.notNull(accessToken);
		Assert.notNull(task);
		if (accessToken == null) {
			accessToken = tokenClient.getServerToken();
		}
		return template.postForObject(config.getHttpServerUri() + URI + "?access_token=" + accessToken, task, Map.class);
	}

	@Override
	public Map<?, ?> createSystemTask(String serverToken, Task task) {
		Assert.notNull(serverToken);
		Assert.notNull(task);
		ObjectId objectId = task.getoId();
		return template.postForObject(config.getHttpServerUri() + URI + "?server_token=" + serverToken + "&oid=" + objectId.toString(), task, Map.class);
	}

	@Override
	public Map<?, ?> getTask(String accessToken, int verbose, int limit, int cursor, String states, String types, ObjectId objectId) {
		Assert.notNull(accessToken);
		Assert.notNull(states);
		Assert.notNull(types);
		Assert.notNull(objectId);
		return template.getForObject(
				config.getHttpServerUri() + URI + "?access_token=" + accessToken + "&verbose=" + verbose + "&limit=" + limit + "&states=" + states + "&types=" + types + "&object_id=" + objectId.toString(), Map.class);
	}
}
