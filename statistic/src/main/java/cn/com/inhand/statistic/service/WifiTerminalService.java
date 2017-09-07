package cn.com.inhand.statistic.service;

import cn.com.inhand.common.model.Organization;
import cn.com.inhand.statistic.dao.OrganizationDAO;
import cn.com.inhand.statistic.dao.WifiTerminalDAO;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 *
 * Created by Jerolin on 6/15/2014.
 */
@Service
public class WifiTerminalService {

	private Map<ObjectId, Set<String>> macs;
	@Autowired
	WifiTerminalDAO terminalDAO;
	@Autowired OrganizationDAO organizationDAO;

	@PostConstruct
	public void init() {
		List<Organization> organizations = organizationDAO.getAllOrganization(false);
		macs = new HashMap<ObjectId, Set<String>>();
		for (Organization organization : organizations) {
			loadOrgnizationMacs(organization.getId());
		}
	}

	private void loadOrgnizationMacs(ObjectId oId) {
		macs.put(oId, terminalDAO.getTerminalMacs(oId));
	}

	public void addNewMac(ObjectId oId, String mac) {
		macs.get(oId).add(mac);
	}

	public boolean isNewMac(ObjectId oId, String mac) {
		Set<String> macSet = macs.get(oId);
		if (macSet == null) {
			loadOrgnizationMacs(oId);
			addNewMac(oId, mac);
			return true;
		} else {
			return !macs.get(oId).contains(mac);
		}
	}
}
