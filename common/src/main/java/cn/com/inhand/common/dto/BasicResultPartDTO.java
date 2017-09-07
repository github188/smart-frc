package cn.com.inhand.common.dto;


public class BasicResultPartDTO {
    private long total;
    private int cursor;
    private int limit;
    private Object result;
    private long temp;

    public BasicResultPartDTO(long total, int cursor, int limit, Object result,long temp) {
        this.total = total;
        this.cursor = cursor;
        this.limit = limit;
        this.result = result;
        this.temp = temp;
    }

    public long getTemp() {
        return temp;
    }

    public void setTemp(long temp) {
        this.temp = temp;
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
