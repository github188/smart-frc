define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
        },

        getVenderList: function(limit,start,name,callback, context) {
            cloud.Ajax.request({
                url: "api/modelVender/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    name:name
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllModel: function(limit, cursor,moduleNum, callback, context) {
            var self = this;
            	
            var parameters = {
                 cursor: cursor,
                 limit: limit,
                 name: moduleNum
            };	
           
            cloud.Ajax.request({
                url: "api/basic/module/list",
                type: "GET",
                parameters:parameters,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getModelById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api/basic/"+id+"/module",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		},
		updateModel:function(_id,data,callback,context){
			var self = this;
			cloud.Ajax.request({
				url : "api/basic/"+_id+"/module",
                type : "put",
                data:data,
                success : function(data) {
                    callback.call(context || this, data);
                },error:function(data){
                	callback.call(context || self, data);
                }
            });
		},
		addModel:function(data,callback,context){
			var self = this;
			cloud.Ajax.request({
                url : "api/basic/module",
                type : "post",
                data:data,
                success : function(data) {
                    callback.call(context || this, data);
                },
                error:function(data){
              	  callback.call(context || this, data);
              }
            });
		},
		deleteModel :function(ids,callback,context){
     	    cloud.Ajax.request({
     	    	  url : "api/basic/module/moduleDelBatch",
		    	  type : "post",
		    	  parameters:{
		    		  ids:ids
		    	  },
		    	  success : function(data) {
           	            callback.call(context || this,data);
                   },
     	          error:function(data){
           	            callback.call(context || this, data);
                   }
          });
   		},
    });

    return new Service();

});