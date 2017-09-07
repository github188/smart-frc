define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        addReplenishPlan: function(finalData,callback,context){
        	cloud.Ajax.request({
				url:"api/replenishplan",
				type : "post",
				data:finalData,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
			});
        	
        },
        addReplenishPlanV2: function(finalData,callback,context){
        	cloud.Ajax.request({
				url:"api/replenishplanv2",
				type : "post",
				data:finalData,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
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
        updateReplenishPlan: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/replenishplan/" + id,
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
        updateReplenishPlanV2: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/replenishplanv2/" + id,
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
        getReplenishPlanById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/replenishplan/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getReplenishPlanV2ById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/replenishplanv2/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getReplenishPlanGoodsById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/replenishplan/" + id+"/goods",
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getReplenishPlanV2GoodsById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/replenishplanv2/" + id+"/goods",
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        deleteReplenishPlan: function(ids, callback, context) {
            cloud.Ajax.request({
                url: "api/replenishplan/delBatch",
                type: "post",
                parameters:{
                	ids:ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteReplenishPlanV2: function(ids, callback, context) {
            cloud.Ajax.request({
                url: "api/replenishplan/delBatch",
                type: "post",
                parameters:{
                	ids:ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllReplenishPlan: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/replenishplan/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllReplenishPlanV2: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/replenishplanv2/list",
                type: "GET",
                parameters: searchData,
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
        getAllDeviceReplenishmentV2:function(searchData,limit,cursor,callback,context){
        	 var self = this;
             searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/replenishv2/recordlist",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        getAllDeviceReplenishmentV3:function(searchData,limit,cursor,callback,context){
       	 var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/replenishv3/recordlist",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
        getUserInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api2/users",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit,
                    verbose: 100
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
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
        getWarehouseList: function(name,cursor,limit,callback, context) {
            cloud.Ajax.request({
                url: "api/warehouse/list",
                type: "get",
                parameters: {
                    cursor:cursor,
                    limit: limit,
                    name:name
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        }
    });

    return new Service();
    
});