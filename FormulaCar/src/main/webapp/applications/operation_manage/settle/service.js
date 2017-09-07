define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({

        initialize: function() {

        },
        getAllLine:function(searchData,limit,cursor,callback,context){
         	 var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/automatline/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
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
       getAllUsers:function(callback,context){
       	  var self = this;
          cloud.Ajax.request({
              url: "api/smartUser/list",
              type: "GET",
              success: function(data) {
                  callback.call(context || self, data);
              }
          });
       },
       getAreaList:function(areaId,callback,context){
    	   var self = this;
           cloud.Ajax.request({
               url: "api/areaMan/list",
               type: "GET",
               parameters : {
		    		  cursor:0,
		    		  limit:100,
		    		  areaId:areaId
               },
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
    	   
       },
       getLinesByUserId: function(userId, callback, context) {
        	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		  if(data && data.result && data.result.area){
		    			  cloud.Ajax.request({
			   	    	      url:"api/automatline/list",
					    	  type : "GET",
					    	  parameters : {
					    		  areaId: data.result.area,
					    		  cursor:0,
					    		  limit:-1
			                  },
					    	  success : function(data) {
					    		  callback.call(context || this, data);
					    	  }
		    			  });
		    		  }else{
		    			  callback.call(context || this, data); 
		    		  }
		    	  }
          });
        },
        getLineInfoByUserId: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/automatline/" + id + "/line",
                type: "GET",
                parameters: {
                    limit: -1,
                    cursor: 0
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addSettle: function(areaIds,startTime ,endTime,callback, context){
        	var self = this;
            cloud.Ajax.request({
                url: "api/settle/add",
                type: "post",
                parameters: {
                    "startTime": startTime,
                    "endTime":endTime,
                    "areaIds":areaIds
                },
                success: function(data) {
                    callback.call(context || this, data);
                },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
            });
        	
        },
        getSettlelist: function(areaIds,lineIds,startTime ,endTime,limit,cursor,type,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/settle/list",
                type: "post",
                parameters: {
                    "startTime": startTime,
                    "endTime":endTime,
                    "limit":limit,
                    "cursor":cursor,
                    "type":type,
                    "lineIds":lineIds,
                    "areaIds":areaIds
                },
                success: function(data) {
                    callback.call(context || this, data);
                },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
            });
        }
    });

    return new Service();
});

