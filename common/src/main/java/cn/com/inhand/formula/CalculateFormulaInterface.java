package cn.com.inhand.formula;

import bsh.EvalError;

import java.util.Hashtable;

public class CalculateFormulaInterface {
    public int calculateFormulaInt(String expression, int value)
            throws EvalError {
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "int");
        valueTable.put("var", Integer.toString(value));
        value = Integer.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).intValue();
        valueTable.clear();
        valueTable = null;
        return value;
    }

    public float calculateFormula(String expression, int value)
            throws EvalError {
        float result = 0.0F;
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "float");
        valueTable.put("var", Integer.toString(value));
        result = Float.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).floatValue();
        valueTable.clear();
        valueTable = null;
        return result;
    }

    public long calculateFormulaLong(String expression, long value)
            throws EvalError {
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "long");
        valueTable.put("var", Long.toString(value) + "L");
        value = Long.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).longValue();
        valueTable.clear();
        valueTable = null;
        return value;
    }

    public double calculateFormula(String expression, long value)
            throws EvalError {
        double result = 0.0D;
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "double");
        valueTable.put("var", Long.toString(value) + "L");
        result = Double.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).doubleValue();
        valueTable.clear();
        valueTable = null;
        return result;
    }

    public boolean calculateFormula(String expression, boolean value)
            throws EvalError {
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "boolean");
        valueTable.put("var", Boolean.toString(value));
        value = Boolean.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).booleanValue();
        valueTable.clear();
        valueTable = null;
        return value;
    }

    public double calculateFormula(String expression, double value)
            throws EvalError {
        double result = 0.0D;
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "double");
        valueTable.put("var", Double.toString(value));
        result = Double.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).doubleValue();
        valueTable.clear();
        valueTable = null;
        return result;
    }

    public float calculateFormula(String expression, float value)
            throws EvalError {
        Hashtable valueTable = new Hashtable();
        Hashtable parameterTable = new Hashtable();
        parameterTable.put("var", "float");
        valueTable.put("var", Float.toString(value) + "f");
        value = Float.valueOf(CalculateFormulaControl.calc(expression, parameterTable, valueTable)).floatValue();
        valueTable.clear();
        valueTable = null;
        return value;
    }

    public boolean checkFormula(String expression, int type) {
        if (type == 1) {
            int intValue = 12;
            try {
                calculateFormula(expression, intValue);
            } catch (EvalError e) {
                return false;
            }
            return true;
        }
        if (type == 2) {
            long longValue = 100L;
            try {
                calculateFormula(expression, longValue);
            } catch (EvalError e) {
                return false;
            }
            return true;
        }
        if (type == 0) {
            boolean booleanValue = true;
            try {
                calculateFormula(expression, booleanValue);
            } catch (EvalError e) {
                return false;
            }
            return true;
        }
        if (type == 3) {
            float floatValue = 18.589001F;
            try {
                calculateFormula(expression, floatValue);
            } catch (EvalError e) {
                return false;
            }
            return true;
        }

        return false;
    }
}