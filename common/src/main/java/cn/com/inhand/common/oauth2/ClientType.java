package cn.com.inhand.common.oauth2;

public enum ClientType {
	ANALYZER("analyzer"),
	VIEW("view"),
	DATA("data"),
	DESKTOP("desktop"),
	MOBILE("mobile");
	private String name;
	private ClientType(String name){
		this.name = name;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
