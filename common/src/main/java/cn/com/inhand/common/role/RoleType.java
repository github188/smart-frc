package cn.com.inhand.common.role;

public enum RoleType {
	ADMINISTRATORS(1,"Administrators"),
	ORGANIZATION_ADMINISTRATOR(51, "Organization-Administrator"),
	USER_DEFINED(52, "user-defined");
	private int type;
	private String name;
	private RoleType(int type, String name){
		this.type = type;
		this.name = name;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
