package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.Organization;

import java.util.List;

/**
 * Created by Jerolin on 6/12/2014.
 */
public interface OrganizationDAO {
	public List<Organization> getAllOrganization(boolean includeSystem);
}
