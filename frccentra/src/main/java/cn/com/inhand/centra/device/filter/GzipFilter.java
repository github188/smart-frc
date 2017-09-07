package cn.com.inhand.centra.device.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 拦截压缩处理
 * @author puys
 *
 */
public class GzipFilter implements Filter {

	public static final Logger LOGGER = LoggerFactory.getLogger(GzipFilter.class);
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
	        throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		//LOGGER.info(req.getRequestURL().toString());
		HttpServletResponse resp = (HttpServletResponse) response;
		GzipRequestWrapper requestWrapper = new GzipRequestWrapper(req);
		//需要返回压缩
		if(GzipUtil.isGZipEncoding(req)){
			GzipResponseWrapper responseWrapper = new GzipResponseWrapper(resp);
			chain.doFilter(requestWrapper, responseWrapper);
			byte[] gzipData = GzipUtil.gzip(responseWrapper.getResponseData());
			resp.addHeader("Content-Encoding", "gzip");
			resp.setContentLength(gzipData.length);
            ServletOutputStream output = response.getOutputStream();
            output.write(gzipData);
            output.flush();
		}else {
			chain.doFilter(requestWrapper, response);
		}
	}

	@Override
	public void destroy() {
		
	}

}
