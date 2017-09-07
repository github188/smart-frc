package cn.com.inhand.oauth2.util;

import java.util.List;
import java.util.regex.Pattern;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import cn.com.inhand.common.role.RoleType;
import cn.com.inhand.oauth2.dto.ClientQueryBean;

@Component
public class QueryGenrator {
	public Query getQuery(Query query, ClientQueryBean cqb){
		addResourceIds(query, cqb.getResourceIds());
		addName(query, cqb.getName());
		addType(query, cqb.getType());
		addSubclass(query, cqb.getSubclass());
		addPermit(query, cqb.getRoleType(), cqb.getOid());
		return query;
	}
	public void addPermit(Query query, Integer roleType, ObjectId oId){
		if(roleType >= RoleType.ORGANIZATION_ADMINISTRATOR.getType()){
			Criteria c = new Criteria();
			c.orOperator(Criteria.where("reliable").is("public"),Criteria.where("oid").is(oId));
			query.addCriteria(c);
		}
	}
    public void addResourceIds(Query query, List<ObjectId> resourceIds) {
        if (resourceIds != null) {
            query.addCriteria(Criteria.where("_id").in(resourceIds));
        }
    }
	public void addName(Query query, String name) {
        if (name != null) {
            query.addCriteria(Criteria.where("name").regex(Pattern.compile(name)));
        }
    }
	public void addType(Query query, String type){
		if(type != null){
			query.addCriteria(Criteria.where("type").regex(Pattern.compile(type)));
		}
	}
	public void addSubclass(Query query, Integer[] subclasses){
		if(subclasses != null){
			query.addCriteria(Criteria.where("subclass").in(subclasses));
		}
	}
    public String regexFilter(String regex) {
        if (regex.equals("*")) {
            return "\\" + regex;
        } else {
            return regex;
        }
    }
    public void withSortDESC(Query query, String field) {
        query.with(new Sort(Sort.Direction.DESC, field));
    }

    public void withSortASC(Query query, String field) {
        query.with(new Sort(Sort.Direction.ASC, field));
    }
}
