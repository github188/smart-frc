package cn.com.inhand.common.dto;


public class BasicResultDTO {
    private long total;
    private int cursor;
    private int limit;
    private Object result;

    public BasicResultDTO(long total, int cursor, int limit, Object result) {
        this.total = total;
        this.cursor = cursor;
        this.limit = limit;
        this.result = result;
    }

    public int getCursor() {
        return cursor;
    }

    public int getLimit() {
        return limit;
    }

    public void setCursor(int cursor) {
        this.cursor = cursor;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    /**
     * @return the result
     */
    public Object getResult() {
        return result;
    }

    /**
     * @param result the result to set
     */
    public void setResult(Object result) {
        this.result = result;
    }

    /**
     * @return the total
     */
    public long getTotal() {
        return total;
    }

    /**
     * @param total the total to set
     */
    public void setTotal(long total) {
        this.total = total;
    }


}
