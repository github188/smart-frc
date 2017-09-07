package cn.com.inhand.formula;

import bsh.EvalError;
import bsh.Interpreter;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Map;

public class CalculateFormulaControl {
    public static String operateExpression(String expression,
                                           Hashtable parameters, Hashtable values) throws EvalError {
        Interpreter i = new Interpreter();
        i.eval("import parse.*;");
        Enumeration enums = parameters.keys();
        while (enums.hasMoreElements()) {
            String varName = (String) enums.nextElement();
            String varType = (String) parameters.get(varName);
            String declare = varType + " " + varName;
            i.eval(declare);
            String varValue = (String) values.get(varName);
            String assignValue = varName + "=" + varValue;
            i.eval(assignValue);
        }
        i.eval(expression);
	    return i.get("result").toString();
    }

	public static String calc(String expression, Map<Integer, String> parameters, Map<Integer, String> values,
	                          int precision) throws EvalError {
        Interpreter i = new Interpreter();
        i.eval("import parse.*;");
        i.eval("import cn.com.inhand.utilities.Utility;");
        i.eval("import cn.com.inhand.formula.CalcAPI;");

		i.eval(CalcAPI.funcLib);
		for (Integer key : parameters.keySet()) {
			String varName = "V" + String.valueOf(key);
			String varType = parameters.get(key);
			String declare = varType + " " + varName;
			i.eval(declare);
			String varValue = values.get(key);
			String assignValue = varName + "=";
			if (varType.equals("String"))
				assignValue = assignValue + "\"" + varValue + "\"";
			else if (varType.equals("byte[]"))
				assignValue = assignValue + "Utility.hexStrToBytes(\""
						+ varValue + "\")";
			else if (varType.equalsIgnoreCase("float"))
				assignValue = assignValue + varValue + "f";
			else {
				assignValue = assignValue + varValue;
			}
			i.eval(assignValue);
		}
		i.eval(expression);
		return i.get("result").toString();
	}

    public static String calc(String expression, Map parameters, Map values)
            throws EvalError {
        return calc(expression, parameters, values, 2);
    }
}