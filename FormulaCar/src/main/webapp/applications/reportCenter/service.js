define(function(require) {
    require("cloud/base/cloud");
    var Common = require("../../common/js/common");
    var Service = Class.create({
        initialize: function(){
        },
        createReportCenterOfProductTime: function(now,time,number,name,language, reportName,oid,callback, context) {
        	var parameters = {};
   			if(now != null && now != ""){
   				parameters.time = now;
   			}
   			if(name != null && name != ""){
   				parameters.name = name;
   			}
   			if(time != null && time != ""){
   				parameters.qtime = time;
   			}
   			if(number != null && number != ""){
   				parameters.number = number;
   			}
   			if(language != null && language != ""){
   				parameters.language = language;
   			}
   			
   			if(reportName != null && reportName != ""){
   				parameters.reportName = reportName;
   			}
   			if(oid != null && oid != ""){
   				parameters.oid = oid;
   			}
   			
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/productTime",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
        },
        createReportCenterOfDeviceTime: function(now,time,number,name,language, reportName,oid,callback, context) {
        	var parameters = {};
   			if(now != null && now != ""){
   				parameters.time = now;
   			}
   			if(name != null && name != ""){
   				parameters.name = name;
   			}
   			if(time != null && time != ""){
   				parameters.qtime = time;
   			}
   			if(number != null && number != ""){
   				parameters.number = number;
   			}
   			if(language != null && language != ""){
   				parameters.language = language;
   			}
   			
   			if(reportName != null && reportName != ""){
   				parameters.reportName = reportName;
   			}
   			if(oid != null && oid != ""){
   				parameters.oid = oid;
   			}
   			
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/deviceTime",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
        },
        createReportCenterOfSiteTurnOver: function(now,startTime,endTime,assetIds,payStyle,language, reportName,oid,callback, context) {
        	var parameters = {};
   			if(now != null && now != ""){
   				parameters.time = now;
   			}
   			if(assetIds != null && assetIds != ""){
   				parameters.assetIds = assetIds;
   			}
   			if(payStyle != null && payStyle != ""){
   				parameters.payStyle = payStyle;
   			}
   			if(startTime != null && startTime != ""){
   				parameters.startTime = startTime;
   			}
   			if(endTime != null && endTime != ""){
   				parameters.endTime = endTime;
   			}
   			if(language != null && language != ""){
   				parameters.language = language;
   			}
   			
   			if(reportName != null && reportName != ""){
   				parameters.reportName = reportName;
   			}
   			if(oid != null && oid != ""){
   				parameters.oid = oid;
   			}
   			
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/siteTurnOver",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
        },
        createReportCenterOfLineTurnOver: function(now,startTime,endTime,name,language, reportName,oid,callback, context) {
        	var parameters = {};
   			if(now != null && now != ""){
   				parameters.time = now;
   			}
   			if(name != null && name != ""){
   				parameters.name = name;
   			}
   			if(startTime != null && startTime != ""){
   				parameters.startTime = startTime;
   			}
   			if(endTime != null && endTime != ""){
   				parameters.endTime = endTime;
   			}
   			if(language != null && language != ""){
   				parameters.language = language;
   			}
   			
   			if(reportName != null && reportName != ""){
   				parameters.reportName = reportName;
   			}
   			if(oid != null && oid != ""){
   				parameters.oid = oid;
   			}
   			
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/lineTurnOver",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
        },
        findReportCenterOfProductTime:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/findproductTime",
                type : "get",
                parameters : {
                	path : "/home/productTime/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
        findReportCenterOfDeviceTime:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/finddeviceTime",
                type : "get",
                parameters : {
                	path : "/home/deviceTime/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
        findReportCenterOfLineTurnOver:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/findLineTurnOver",
                type : "get",
                parameters : {
                	path : "/home/lineTurnOver/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
		findReportCenterOfSiteTurnOver:function(time,report_name,callback,context){
				cloud.Ajax.request({
	                url : "api/vmreports/findSiteTurnOver",
	                type : "get",
	                parameters : {
	                	path : "/home/siteTurnOver/"+time+"/"+report_name
	                },
	                success : function(data) {
	                    callback.call(context || this, data);
	                }
	            });
	   },
        getDeviceList: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.vflag = 1;
            searchData.verbose = 5;
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getReportForDeviceTime:function(searchData,limit,cursor,callback,context){
	       	  var self = this;
	          searchData.limit = limit;
	          searchData.cursor = cursor;
	          cloud.Ajax.request({
	              url: "api/reportCenter/deviceTime",
	              type: "GET",
	              parameters: searchData,
	              success: function(data) {
	                  callback.call(context || self, data);
	              }
	          });
        },
        getReportForProductTime:function(searchData,limit,cursor,callback,context){
	       	  var self = this;
	          searchData.limit = limit;
	          searchData.cursor = cursor;
	          cloud.Ajax.request({
	              url: "api/reportCenter/productTime",
	              type: "GET",
	              parameters: searchData,
	              success: function(data) {
	                  callback.call(context || self, data);
	              }
	          });
        },
        getReportForSiteTurnover:function(searchData,limit,cursor,callback,context){
	       	  var self = this;
	          searchData.limit = limit;
	          searchData.cursor = cursor;
	          cloud.Ajax.request({
	              url: "api/reportCenter/siteTurnover",
	              type: "GET",
	              parameters: searchData,
	              success: function(data) {
	                  callback.call(context || self, data);
	              }
	          });
        },
        getReportForLineTurnover:function(searchData,limit,cursor,callback,context){
	       	  var self = this;
	          searchData.limit = limit;
	          searchData.cursor = cursor;
	          cloud.Ajax.request({
	              url: "api/reportCenter/lineTurnover",
	              type: "GET",
	              parameters: searchData,
	              success: function(data) {
	                  callback.call(context || self, data);
	              }
	          });
      }
    });

    return new Service();
    
});