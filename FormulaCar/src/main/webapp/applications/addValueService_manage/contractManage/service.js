define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getDeviceByAssetId:function(id,callback,context){
        	cloud.Ajax.request({
                url : "api/automat",
                parameters:{
                	assetId:id
                },
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                },
                error : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
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
        getAreaByUserId: function(userId, callback, context){
       	  cloud.Ajax.request({
       	      url:"api/smartUser/"+userId,
   	    	  type : "GET",
   	    	  success : function(data) {
   	    		  
   	    			callback.call(context || this, data); 

   	    	  }
           });
         },
         getAreaDataByUserId: function(userId, callback, context) {
         	cloud.Ajax.request({
   	    	      url:"api/smartUser/"+userId,
   		    	  type : "GET",
   		    	  success : function(data) {
   		    		//console.log(data);
   		    		  var roleType = permission.getInfo().roleType;
   		    		  if(data && data.result && data.result.area && data.result.area.length>0 && roleType != 51 || roleType == 51){
   		    			  
   		    			  var searchData = {};
   		    			  if(roleType != 51){
   		    				searchData = {
   	  		    					"areaId":data.result.area
   	  		    			  };
   		    			  }
   		    			  
 	  		              searchData.limit = -1;
 	  		              searchData.cursor = 0;
 	  		              cloud.Ajax.request({
 	  		                  url: "api/areaMan/list",
 	  		                  type: "GET",
 	  		                  parameters: searchData,
 	  		                  success: function(data) {
 	  		                      callback.call(context || self, data);
 	  		                  }
 	  		              });
   		    		  }else{
   		    			  callback.call(context || this, data); 
   		    		  }
   		    	  }
           });
         },
        deleteContract: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/contract/" + id,
                type: "DELETE",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getContractList: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/contract/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addContract:function(data,callback,context){
        	cloud.Ajax.request({
				url:"api/contract/add",
				type : "post",
				data:data,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
			});
        },
        updateContract: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/contract/" + id,
                type: "PUT",
                data: contentData,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getContractById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/contract/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        }
       
    });

    return new Service();
    
});