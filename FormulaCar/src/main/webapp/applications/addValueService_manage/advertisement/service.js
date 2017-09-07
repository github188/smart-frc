define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getAllAdTask:function(searchData,limit,cursor,callback,context){
       	 var self = this;
         searchData.limit = limit;
         searchData.cursor = cursor;
         cloud.Ajax.request({
             url: "api/task/list",
             type: "GET",
             parameters: searchData,
             success: function(data) {
                 callback.call(context || self, data);
             }
         });
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
       getAutomatByUserId: function(userId, callback, context) {
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
					    	  success : function(linedata) {
					    		  if(linedata && linedata.result && linedata.result.length > 0){
					    			  var lineIds=[];
					                  if(linedata.result && linedata.result.length>0){
					 	    			  for(var i=0;i<linedata.result.length;i++){
					 	    				  lineIds.push(linedata.result[i]._id);
					 	    			  }
					                  }
					    			  searchData = {
					    					  "lineId": lineIds,
					    					  "cursor":0,
  	       					    		      "limit":-1
					    			  }
					    			  cloud.Ajax.request({
					    	                url: "api/automat/list_new",
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
		    		  }else{
		    			  callback.call(context || this, data); 
		    		  }
		    	  }
         });
       },
        deleteAd: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/remote/" + id +"/ad",
                type: "DELETE",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllAd: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/remote/list/ad",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addAd:function(data,callback,context){
        	cloud.Ajax.request({
				url:"api/remote/ad",
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
        updateAd: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/remote/" + id +"/ad",
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
        getAdById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/remote/" + id +"/ad",
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAutomatById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automat/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
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
        getUserMessage:function(callback,context){
        	cloud.Ajax.request({
				url:"api2/users/this",
				type : "GET",
				parameters:{
					verbose:100
				},
				success:function(data){
					callback.call(context || this,data);
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
    });

    return new Service();
    
});