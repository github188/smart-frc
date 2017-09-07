package cn.com.inhand.common.model.wifi;

public class SyncModule {
	private String moduleName;
	private String comment;
	private String path;
	private String useChroot;
	private Integer maxConnections; 
	private String lockFile;
	private String readOnly;
	private String list;
	private String uid;
	private String gid;
	private String authUsers;
	private String authPassword;
	private String secretsFile;
	private String strictModes;
	private String ignoreErrors;
	private String ignoreNonreadable;
	private String transferLogging;
	private String refuseOptions;
	private String exclude;
	private String excludeFrom;
	private String include;
	private String includeFrom;
	private String hostsAllow;
	private String hostsDeny;
	private String logFormat;
	private String timeout;
	private String dontCompress;
	
	
	
	
	/**
	 * @return the authPassword
	 */
	public String getAuthPassword() {
		return authPassword;
	}
	/**
	 * @param authPassword the authPassword to set
	 */
	public void setAuthPassword(String authPassword) {
		this.authPassword = authPassword;
	}
	/**
	 * @return the moduleName
	 */
	public String getModuleName() {
		return moduleName;
	}
	/**
	 * @param moduleName the moduleName to set
	 */
	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}
	/**
	 * @return the comment
	 */
	public String getComment() {
		return comment;
	}
	/**
	 * @param comment the comment to set
	 */
	public void setComment(String comment) {
		this.comment = comment;
	}
	/**
	 * @return the path
	 */
	public String getPath() {
		return path;
	}
	/**
	 * @param path the path to set
	 */
	public void setPath(String path) {
		this.path = path;
	}
	/**
	 * @return the useChroot
	 */
	public String getUseChroot() {
		return useChroot;
	}
	/**
	 * @param useChroot the useChroot to set
	 */
	public void setUseChroot(String useChroot) {
		this.useChroot = useChroot;
	}
	/**
	 * @return the maxConnections
	 */
	public Integer getMaxConnections() {
		return maxConnections;
	}
	/**
	 * @param maxConnections the maxConnections to set
	 */
	public void setMaxConnections(Integer maxConnections) {
		this.maxConnections = maxConnections;
	}
	/**
	 * @return the lockFile
	 */
	public String getLockFile() {
		return lockFile;
	}
	/**
	 * @param lockFile the lockFile to set
	 */
	public void setLockFile(String lockFile) {
		this.lockFile = lockFile;
	}
	/**
	 * @return the readOnly
	 */
	public String getReadOnly() {
		return readOnly;
	}
	/**
	 * @param readOnly the readOnly to set
	 */
	public void setReadOnly(String readOnly) {
		this.readOnly = readOnly;
	}
	/**
	 * @return the list
	 */
	public String getList() {
		return list;
	}
	/**
	 * @param list the list to set
	 */
	public void setList(String list) {
		this.list = list;
	}
	/**
	 * @return the uid
	 */
	public String getUid() {
		return uid;
	}
	/**
	 * @param uid the uid to set
	 */
	public void setUid(String uid) {
		this.uid = uid;
	}
	/**
	 * @return the gid
	 */
	public String getGid() {
		return gid;
	}
	/**
	 * @param gid the gid to set
	 */
	public void setGid(String gid) {
		this.gid = gid;
	}
	/**
	 * @return the authUsers
	 */
	public String getAuthUsers() {
		return authUsers;
	}
	/**
	 * @param authUsers the authUsers to set
	 */
	public void setAuthUsers(String authUsers) {
		this.authUsers = authUsers;
	}
	/**
	 * @return the secretsFile
	 */
	public String getSecretsFile() {
		return secretsFile;
	}
	/**
	 * @param secretsFile the secretsFile to set
	 */
	public void setSecretsFile(String secretsFile) {
		this.secretsFile = secretsFile;
	}
	/**
	 * @return the strictModes
	 */
	public String getStrictModes() {
		return strictModes;
	}
	/**
	 * @param strictModes the strictModes to set
	 */
	public void setStrictModes(String strictModes) {
		this.strictModes = strictModes;
	}
	/**
	 * @return the ignoreErrors
	 */
	public String getIgnoreErrors() {
		return ignoreErrors;
	}
	/**
	 * @param ignoreErrors the ignoreErrors to set
	 */
	public void setIgnoreErrors(String ignoreErrors) {
		this.ignoreErrors = ignoreErrors;
	}
	/**
	 * @return the ignoreNonreadable
	 */
	public String getIgnoreNonreadable() {
		return ignoreNonreadable;
	}
	/**
	 * @param ignoreNonreadable the ignoreNonreadable to set
	 */
	public void setIgnoreNonreadable(String ignoreNonreadable) {
		this.ignoreNonreadable = ignoreNonreadable;
	}
	/**
	 * @return the transferLogging
	 */
	public String getTransferLogging() {
		return transferLogging;
	}
	/**
	 * @param transferLogging the transferLogging to set
	 */
	public void setTransferLogging(String transferLogging) {
		this.transferLogging = transferLogging;
	}
	/**
	 * @return the refuseOptions
	 */
	public String getRefuseOptions() {
		return refuseOptions;
	}
	/**
	 * @param refuseOptions the refuseOptions to set
	 */
	public void setRefuseOptions(String refuseOptions) {
		this.refuseOptions = refuseOptions;
	}
	/**
	 * @return the exclude
	 */
	public String getExclude() {
		return exclude;
	}
	/**
	 * @param exclude the exclude to set
	 */
	public void setExclude(String exclude) {
		this.exclude = exclude;
	}
	/**
	 * @return the excludeFrom
	 */
	public String getExcludeFrom() {
		return excludeFrom;
	}
	/**
	 * @param excludeFrom the excludeFrom to set
	 */
	public void setExcludeFrom(String excludeFrom) {
		this.excludeFrom = excludeFrom;
	}
	/**
	 * @return the include
	 */
	public String getInclude() {
		return include;
	}
	/**
	 * @param include the include to set
	 */
	public void setInclude(String include) {
		this.include = include;
	}
	/**
	 * @return the includeFrom
	 */
	public String getIncludeFrom() {
		return includeFrom;
	}
	/**
	 * @param includeFrom the includeFrom to set
	 */
	public void setIncludeFrom(String includeFrom) {
		this.includeFrom = includeFrom;
	}
	/**
	 * @return the hostsAllow
	 */
	public String getHostsAllow() {
		return hostsAllow;
	}
	/**
	 * @param hostsAllow the hostsAllow to set
	 */
	public void setHostsAllow(String hostsAllow) {
		this.hostsAllow = hostsAllow;
	}
	/**
	 * @return the hostsDeny
	 */
	public String getHostsDeny() {
		return hostsDeny;
	}
	/**
	 * @param hostsDeny the hostsDeny to set
	 */
	public void setHostsDeny(String hostsDeny) {
		this.hostsDeny = hostsDeny;
	}
	/**
	 * @return the logFormat
	 */
	public String getLogFormat() {
		return logFormat;
	}
	/**
	 * @param logFormat the logFormat to set
	 */
	public void setLogFormat(String logFormat) {
		this.logFormat = logFormat;
	}
	/**
	 * @return the timeout
	 */
	public String getTimeout() {
		return timeout;
	}
	/**
	 * @param timeout the timeout to set
	 */
	public void setTimeout(String timeout) {
		this.timeout = timeout;
	}
	/**
	 * @return the dontCompress
	 */
	public String getDontCompress() {
		return dontCompress;
	}
	/**
	 * @param dontCompress the dontCompress to set
	 */
	public void setDontCompress(String dontCompress) {
		this.dontCompress = dontCompress;
	}
	
	
	
}
