define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	getOptList:function(searchValue, callback, context){
    		if(!searchValue.days){
    			searchValue.days = 21;
    			$("#days").val("21");
    		}
    		cloud.Ajax.request({
                url: "api/optimization/machine/list",
                type: "get",
                parameters: searchValue,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
    	},
    	getOptimizationByMachine: function(searchValue, callback, context){
    		if(!searchValue.days){
    			searchValue.days = 21;
    			$("#days").val("21");
    		}
    		cloud.Ajax.request({
                url: "api/optimization",
                type: "get",
                parameters: searchValue,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
    	},
    	getMerchandisingList: function(searchValue, callback, context){
    		if(!searchValue.days){
    			searchValue.days = 21;
    			$("#days").val("21");
    		}
    		cloud.Ajax.request({
                url: "api/optimization/merchandising/list",
                type: "get",
                parameters: searchValue,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
    	},
        getAreaByUserId: function(userId, callback, context) {
        	cloud.Ajax.request({
       	      url:"api/smartUser/"+userId,
   	    	  type : "GET",
   	    	  success : function(data) {
   	    			callback.call(context || this, data); 
   	    	  }
           });
        },
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
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
        }
    
    });
    return new Service();
});