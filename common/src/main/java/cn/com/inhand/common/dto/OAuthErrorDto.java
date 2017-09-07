package cn.com.inhand.common.dto;

public class OAuthErrorDto {
    private String error;
    private int error_code;
    private String request;
    private String error_description;

    public String getError_description() {
        return error_description;
    }

    public void setError_description(String errorDescription) {
        error_description = errorDescription;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public int getError_code() {
        return error_code;
    }

    public void setError_code(int errorCode) {
        error_code = errorCode;
    }

    public String getRequest() {
        return request;
    }

    public void setRequest(String request) {
        this.request = request;
    }
}
