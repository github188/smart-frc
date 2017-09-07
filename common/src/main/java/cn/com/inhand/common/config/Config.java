package cn.com.inhand.common.config;

import cn.com.inhand.common.jackson.ObjectMapperFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Config {

    private PublicConfigBean publicConfig;
    private Map<String, Object> projectConfig = new HashMap<String, Object>();
    private Object projectConfigBean;
    private MongoTemplate mongoTemplate;
    private String httpServerUri;
    private String projectName;
    private Map<String,String> mqAppConfig = new HashMap<String,String>();

    public MongoTemplate getMongoTemplate() {
        return mongoTemplate;
    }

    public void setMongoTemplate(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Config(MongoTemplate mongoTemplate, String collectionName) throws JsonParseException, JsonMappingException,
            JsonProcessingException, IOException {
        this(mongoTemplate, collectionName, null);
    }

    public Config(MongoTemplate mongoTemplate, String collectionName, String projectName) throws JsonParseException,
            JsonMappingException, JsonProcessingException, IOException {
        super();
        this.mongoTemplate = mongoTemplate;
        // load public config
        Query query = Query.query(Criteria.where("name").is("public"));
        CommonConfigBean publicConfig = mongoTemplate.findOne(query, CommonConfigBean.class, collectionName);
        ObjectMapper mapper = new ObjectMapperFactory().getMapper();
        this.publicConfig = mapper.convertValue(publicConfig.getConfig(), PublicConfigBean.class);

        // load project config
        if (projectName != null) {
            this.setProjectName(projectName);
            query = Query.query(Criteria.where("name").is(projectName));
            CommonConfigBean find = mongoTemplate.findOne(query, CommonConfigBean.class, collectionName);
            if (find != null) {
                projectConfig = find.getConfig();
            }
        }
    }

    public PublicConfigBean getPublic() {
        return publicConfig;
    }

    @SuppressWarnings("unchecked")
    public <T> T getProject(Class<T> toValueType) {
        if (projectConfigBean.getClass() == toValueType && projectConfigBean != null) {
            return (T) projectConfigBean;
        } else {
            return new ObjectMapper().convertValue(projectConfig, toValueType);
        }
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Map<String, Object> getProject() {
        return projectConfig;
    }

    public PublicConfigBean getPublicConfig() {
        return publicConfig;
    }

    public void setPublicConfig(PublicConfigBean publicConfig) {
        this.publicConfig = publicConfig;
    }

    /**
     * @return example "http://127.0.0.1:8080/"
     */
    public String getHttpServerUri() {
        if (this.httpServerUri == null) {
            this.httpServerUri = "http://" + publicConfig.getApiServerIP() + ":" + publicConfig.getApiServerPort() + "/";
        }
        return this.httpServerUri;
    }
}
