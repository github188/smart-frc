package cn.com.inhand.common.converter;

import org.springframework.core.convert.converter.Converter;

import java.util.Date;

/**
 * Created by Jerolin on 6/27/2014.
 */
public class StringToDateConverter implements Converter<String, Date> {
	@Override
	public Date convert(String source) {
		return new Date(Long.valueOf(source));
	}
}
