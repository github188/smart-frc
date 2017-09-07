
package cn.com.inhand.common.util;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bson.types.ObjectId;

import cn.com.inhand.common.role.RoleType;
/**
 * dn4 权限/集合处理类
 * @author franklin.li
 *
 */
public class PrivilegesUtils {
	
	/**
	 * 交集
	 * @param a
	 * @param b
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Set union(Set a, Set b){
		Set result = new HashSet();
		result.clear();
		result.addAll(a);
		result.retainAll(b);
		return result;
	}
	
	/**
	 * 权限表的交集，[]表示所有权限
	 * @param a
	 * @param b
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Set union2(Set a, Set b){
		if(a.size() == 0){
			return b;
		}else if(b.size() == 0){
			return a;
		}else{
			Set result = new HashSet();
			result.clear();
			result.addAll(a);
			result.retainAll(b);
			return result;
		}
	}
	
	/**
	 * 并集
	 * @param a
	 * @param b
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Set intersection(Set a, Set b){
		Set result = new HashSet();
		result.clear();
		result.addAll(a);
		result.addAll(b);
		return result;
	}
	
	/**
	 * 差集
	 * @param a
	 * @param b
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Set subtract(Set a, Set b){
		Set result = new HashSet();
		result.clear();
		result.addAll(a);
		result.removeAll(b);
		return result;
	}
	
	/**
	 * 获取设备与平台http接口的权限
	 * @return
	 */
	public static Map<String, Object> getDataGatheringPrivilege(){
		Map<String, Object> privileges = new HashMap<String, Object>();
		List<Integer> defaultList = new ArrayList<Integer>();
		defaultList.add(11);
		defaultList.add(12);
		defaultList.add(19);
		defaultList.add(20);
		defaultList.add(29);
                defaultList.add(1112);
                defaultList.add(3086);
                defaultList.add(83);
                defaultList.add(84);
		for(int i=3001;i<=3150;i++){
			defaultList.add(i);
		}
		privileges.put("default", "none");
		privileges.put("accept", defaultList);
		privileges.put("deny", new ArrayList<Integer>());
		return privileges;
	}
	
	/**
	 * 获取超级权限
	 * @return
	 */
	public static Map<String, Object> getSupperPrivilege(){
		Map<String, Object> privileges = new HashMap<String, Object>();
		Integer[] supper = {};
		privileges.put("accept", supper);
		privileges.put("deny", supper);
		privileges.put("default", "all");
		return privileges;
	}
	
	/**
	 * 获取权限类型交集
	 * @param userDefault
	 * @param clientDefault
	 * @return
	 */
	public static String chargeDefaultPrivilege(String userDefault, String clientDefault){
		Map<String, Integer> defaultMap = new HashMap<String, Integer>();
		defaultMap.put("all", 3);
		defaultMap.put("readOnly", 2);
		defaultMap.put("none", 1);
		if(defaultMap.containsKey(clientDefault) && defaultMap.containsKey(userDefault)){
			if(defaultMap.get(userDefault) <= defaultMap.get(clientDefault)){
				return userDefault;
			}else{
				return clientDefault;
			}
		}else{
			return "none";
		}
	}
	
	/**
	 * 获取权限交集
	 * @param user
	 * @param client
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Map<String, Object> intersectionPrivilege(Map<String, Object> user, Map<String, Object> client){
		Map<String, Object> privileges = new HashMap<String, Object>();
		privileges.put("accept", union2(user.get("accept") == null ? new HashSet() : new HashSet((List)user.get("accept")), 
				client.get("accept") == null ? new HashSet():new HashSet((List)client.get("accept"))));
		privileges.put("deny", intersection(user.get("deny") == null ? new HashSet() : new HashSet((List)user.get("deny")),
				client.get("deny") == null ? new HashSet() : new HashSet((List)client.get("deny"))));
		privileges.put("default", chargeDefaultPrivilege(user.get("default").toString(), client.get("default").toString()));
		return privileges;
	}
	
	/**
	 * 获取允许访问的权限分组
	 * @param acls
	 * @param groupIds
	 * @return
	 */
	public static List<ObjectId> getPermitGroupIds(List<ObjectId> acls, List<ObjectId> groupIds){
		if(acls == null || acls.size() == 0){
			return null;
		}else if(acls != null && (groupIds == null|| groupIds.size() == 0)){
			return acls;
		}else{
			groupIds.retainAll(acls);
			if(groupIds.size() == 0){
				return null;
			}else{
				return groupIds;
			}
		}
	}
	
	/**
	 * if group id contain in acls return false, else return true
	 * @param acls
	 * @param groupIds  this element is query from db
	 * @return
	 */
	public static boolean isPermitionDeny(int roloType, List<ObjectId> acls, ObjectId groupId){
		if(roloType <= RoleType.ORGANIZATION_ADMINISTRATOR.getType()){
			return false;
		}else{
			if(acls == null || acls.size() == 0 || groupId == null){
				return false;
			}else{
				return !acls.contains(groupId);
			}
		}
	}
	
}
