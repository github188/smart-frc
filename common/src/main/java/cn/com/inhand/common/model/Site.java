package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.Map;

/**
 * 现场实体
 */
public class Site {

	/**
	 * 现场标识
	 */
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String name;
	private Integer businessState;
	private Integer online;
	private String address;
	private Location location;
	private Contact contact;
	private ObjectId icon;
	private ObjectId groupId;
	private Map<String, Object> descriptions;
	private List<ObjectId> pics;
	private List<ObjectId> views;
	private Long createTime;
	private Long updateTime;
	private ObjectId owner;
	private String tag;
	private Integer autoNavi;
	private Object metadata;

	public Object getMetadata() {
		return metadata;
	}

	public void setMetadata(Object metadata) {
		this.metadata = metadata;
	}

	public ObjectId getGroupId() {
		return groupId;
	}

	public void setGroupId(ObjectId groupId) {
		this.groupId = groupId;
	}

	/**
	 * @return the address
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * @param address the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	/**
	 * @return the businessState
	 */
	public Integer getBusinessState() {
		return businessState;
	}

	/**
	 * @param businessState the businessState to set
	 */
	public void setBusinessState(Integer businessState) {
		this.businessState = businessState;
	}

	/**
	 * @return the contact
	 */
	public Contact getContact() {
		return contact;
	}

	/**
	 * @param contact the contact to set
	 */
	public void setContact(Contact contact) {
		this.contact = contact;
	}

	/**
	 * @return the createTime
	 */
	public Long getCreateTime() {
		return createTime;
	}

	/**
	 * @param createTime the createTime to set
	 */
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	/**
	 * @return the descriptions
	 */
	public Map<String, Object> getDescriptions() {
		return descriptions;
	}

	/**
	 * @param descriptions the descriptions to set
	 */
	public void setDescriptions(Map<String, Object> descriptions) {
		this.descriptions = descriptions;
	}

	/**
	 * @return the icon
	 */
	public ObjectId getIcon() {
		return icon;
	}

	/**
	 * @param icon the icon to set
	 */
	public void setIcon(ObjectId icon) {
		this.icon = icon;
	}

	/**
	 * @return the id
	 */
	public ObjectId getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(ObjectId id) {
		this.id = id;
	}

	/**
	 * @return the location
	 */
	public Location getLocation() {
		return location;
	}

	/**
	 * @param location the location to set
	 */
	public void setLocation(Location location) {
		this.location = location;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the oid
	 */
	public ObjectId getOid() {
		return oid;
	}

	/**
	 * @param oid the oid to set
	 */
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}

	/**
	 * @return the online
	 */
	public Integer getOnline() {
		return online;
	}

	/**
	 * @param online the online to set
	 */
	public void setOnline(Integer online) {
		this.online = online;
	}

	/**
	 * @return the owner
	 */
	public ObjectId getOwner() {
		return owner;
	}

	/**
	 * @param owner the owner to set
	 */
	public void setOwner(ObjectId owner) {
		this.owner = owner;
	}

	/**
	 * @return the pics
	 */
	public List<ObjectId> getPics() {
		return pics;
	}

	/**
	 * @param pics the pics to set
	 */
	public void setPics(List<ObjectId> pics) {
		this.pics = pics;
	}

	/**
	 * @return the tag
	 */
	public String getTag() {
		return tag;
	}

	/**
	 * @param tag the tag to set
	 */
	public void setTag(String tag) {
		this.tag = tag;
	}

	/**
	 * @return the updateTime
	 */
	public Long getUpdateTime() {
		return updateTime;
	}

	/**
	 * @param updateTime the updateTime to set
	 */
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	/**
	 * @return the views
	 */
	public List<ObjectId> getViews() {
		return views;
	}

	/**
	 * @param views the views to set
	 */
	public void setViews(List<ObjectId> views) {
		this.views = views;
	}

	public Integer getAutoNavi() {
		return autoNavi;
	}

	public void setAutoNavi(Integer autoNavi) {
		this.autoNavi = autoNavi;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Site [");
		if (id != null) {
			builder.append("id=");
			builder.append(id);
			builder.append(", ");
		}
		if (oid != null) {
			builder.append("oid=");
			builder.append(oid);
			builder.append(", ");
		}
		if (name != null) {
			builder.append("name=");
			builder.append(name);
			builder.append(", ");
		}
		if (businessState != null) {
			builder.append("businessState=");
			builder.append(businessState);
			builder.append(", ");
		}
		if (online != null) {
			builder.append("online=");
			builder.append(online);
			builder.append(", ");
		}
		if (address != null) {
			builder.append("address=");
			builder.append(address);
			builder.append(", ");
		}
		if (location != null) {
			builder.append("location=");
			builder.append(location);
			builder.append(", ");
		}
		if (contact != null) {
			builder.append("contact=");
			builder.append(contact);
			builder.append(", ");
		}
		if (icon != null) {
			builder.append("icon=");
			builder.append(icon);
			builder.append(", ");
		}
		if (descriptions != null) {
			builder.append("descriptions=");
			builder.append(descriptions);
			builder.append(", ");
		}
		if (pics != null) {
			builder.append("pics=");
			builder.append(pics);
			builder.append(", ");
		}
		if (views != null) {
			builder.append("views=");
			builder.append(views);
			builder.append(", ");
		}
		if (createTime != null) {
			builder.append("createTime=");
			builder.append(createTime);
			builder.append(", ");
		}
		if (updateTime != null) {
			builder.append("updateTime=");
			builder.append(updateTime);
			builder.append(", ");
		}
		if (owner != null) {
			builder.append("owner=");
			builder.append(owner);
			builder.append(", ");
		}
		if (tag != null) {
			builder.append("tag=");
			builder.append(tag);
		}
		if (autoNavi != null) {
			builder.append("autoNavi=");
			builder.append(autoNavi);
		}
		builder.append("]");
		return builder.toString();
	}
}
