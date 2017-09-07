package cn.com.inhand.common.exception;

import cn.com.inhand.common.dto.Error;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class DefaultExceptionHandler implements HandlerExceptionResolver {

    private static final Logger logger = LoggerFactory.getLogger(DefaultExceptionHandler.class);
    private ObjectMapper mapper;

    public ObjectMapper getMapper() {
        return mapper;
    }

    public void setMapper(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public DefaultExceptionHandler() {
        super();
        this.mapper = new ObjectMapper();
    }

    public DefaultExceptionHandler(ObjectMapper mapper) {
        super();
        this.mapper = mapper;
    }

    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
                                         Exception ex) {
        ex.printStackTrace();
        Error error = null;
        if (ex instanceof ErrorCodeException) {
            ErrorCodeException exception = (ErrorCodeException) ex;
            if (exception.getError() != null) {
                error = exception.getError();
            }
        }

        if (error == null) {
            error = new Error(request.getRequestURI(), ErrorCode.SYSTEM_ERROR);
        } else if (StringUtils.isEmpty(error.getRequest())) {
            error.setRequest(request.getRequestURI());
        }

        try {
            response.getWriter().write(mapper.writeValueAsString(error));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ModelAndView();
    }

}
