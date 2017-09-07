package cn.com.inhand.common.oauth2;

public enum ReliableType {
	PUBLIC("public"),
	PRIVATE("private");
	private String name;
	private ReliableType(String name){
		this.name = name;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
