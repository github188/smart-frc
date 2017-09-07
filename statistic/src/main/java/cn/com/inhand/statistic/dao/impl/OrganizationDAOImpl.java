package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.model.Organization;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.OrganizationDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 * Created by Jerolin on 6/12/2014.
 */
@Service
public class OrganizationDAOImpl extends MongoService implements OrganizationDAO {
	@Override
	public List<Organization> getAllOrganization(boolean includeSystem) {
		Query query = null;
		if (!includeSystem) {
			query = Query.query(Criteria.where("_id").ne(new ObjectId("0000000000000000000abcde")));
		}
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.find(query, Organization.class, Collections.ORGANIZATIONS);
	}
}
