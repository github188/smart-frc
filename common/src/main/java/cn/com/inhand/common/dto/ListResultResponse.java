package cn.com.inhand.common.dto;

import java.util.ArrayList;
import java.util.List;

public class ListResultResponse {
    private List<Object> result;

    public ListResultResponse() {
        this.result = new ArrayList<Object>();
    }

    public ListResultResponse(List<Object> result) {
        this.result = result;
    }

    /**
     * @return the result
     */
    public List<Object> getResult() {
        return result;
    }

    /**
     * @param result the result to set
     */
    public void setResult(List<Object> result) {
        this.result = result;
    }

    public void addToResult(Object object) {
        this.result.add(object);
    }
}
