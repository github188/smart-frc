package cn.com.inhand.common.task;

import cn.com.inhand.common.model.Task;
import org.bson.types.ObjectId;

import java.util.Map;

public interface TaskClient {
    public Map<?, ?> createTask(String accessToken, Task task);

    public Map<?, ?> createSystemTask(String serverToken, Task task);

    public Map<?, ?> getTask(String accessToken, int verbose, int limit, int cursor, String states, String types, ObjectId objectId);

	void asyncCreateTask(Task task);

	public void asyncCreateTask(final String accessToken, final Task task);
}
