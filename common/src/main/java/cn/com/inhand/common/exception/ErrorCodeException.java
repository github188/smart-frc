package cn.com.inhand.common.exception;

import cn.com.inhand.common.dto.Error;

public class ErrorCodeException extends RuntimeException {
    private static final long serialVersionUID = -3759054468835576764L;

    private Error error;

    public ErrorCodeException(ErrorCode code, Object... params) {
        this.error = new Error(code, params);
    }

    public ErrorCodeException(Error error) {
        super();
        this.error = error;
    }

    public Error getError() {
        return error;
    }

    public void setError(Error error) {
        this.error = error;
    }

}
