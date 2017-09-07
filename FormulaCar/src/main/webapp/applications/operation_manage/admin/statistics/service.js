define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getAssetIdInfoByline:function(callback,context){
        	cloud.Ajax.request({
                url : "api/automat/getAssetId",
                type : "get",
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
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getPayList:function(callback,context){
        	cloud.Ajax.request({
                url : "api/stylelist/list",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updatePayList:function(id,data,callback,context){
        	cloud.Ajax.request({
                url : "api/stylelist/"+id,
                type : "put",
				data:data,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
            });
        },
        addPayList:function(data,callback,context){
        	cloud.Ajax.request({
                url : "api/stylelist/add",
                type : "put",
				data:data,
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
      getLinesByUserId: function(userId, callback, context) {
      	cloud.Ajax.request({
	    	      url:"api/smartUser/"+userId,
		    	  type : "GET",
		    	  success : function(data) {
		    		  if(data && data.result && data.result.area && data.result.area.length>0){
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
      getAreaByUserId: function(userId, callback, context){
    	  cloud.Ajax.request({
    	      url:"api/smartUser/"+userId,
	    	  type : "GET",
	    	  success : function(data) {
	    		  
	    			callback.call(context || this, data); 

	    	  }
        });
      },
      getLinesByAreaId: function(areaId,callback, context){
    	  cloud.Ajax.request({
	    	      url:"api/automatline/list",
	    	  type : "GET",
	    	  parameters : {
	    		  areaId: areaId,
	    		  cursor:0,
	    		  limit:-1
              },
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
  		    		  if(data && data.result.area && data.result.area.length>0){
  		    			  searchData = {
  		    					"areaId":data.result.area
  		    			  };
  		    			  
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
        getAdminOnlineAllStatistic:function(orgIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/device_online",
                type : "get",
                parameters : {
                	orgId:orgIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllOrgan:function(callback,context){
         	var self = this;
            cloud.Ajax.request({
                url: "mapi/organization/list",
                type: "get",
                parameters: {
                	limit:-1,
                	cursor:0,
                	verbose:100
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
        getAdminDayAllStatistic:function(startTime,endTime,orgIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/admin_day",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	orgId:orgIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAdminMonthAllStatistic:function(startTime,endTime,orgIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/admin_month",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	orgId:orgIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAdminCustomAllStatistic:function(startTime,endTime,orgIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/admin_customday",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	orgId:orgIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAdminYearAllStatistic:function(startTime,endTime,orgIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/admin_year",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	orgId:orgIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getTradeList:function(start,limit,startTime,endTime,assetId,lineIds,callback,context){
     	   var parameters = {};
     	   if(startTime != null && endTime != null){
     		   parameters.startTime = startTime;
     		   parameters.endTime = endTime;
     	   }
     	   if(lineIds && lineIds.length>0){
     		  parameters.lineId = lineIds;
     	   }
     	   if(assetId != null && assetId.length>0){
     		   var se = [];
     		   if(assetId.indexOf(",")>-1){
     			   se = assetId.split(",");
     		   }else{
     			   se.push(assetId);
     		   }
     		   parameters.assetIds = se;
     	   }
     	   parameters.payStatus = "1";
     	   
     	   cloud.Ajax.request({
   	    		url : "api/order/list",
 	   	        type : "post",
 	   	        parameters : {
 	   	        	cursor : start,
 	   	        	limit:limit
 	   	        },
 	   	        data : parameters,
 	   	        success : function(data) {
 	   	        	callback.call(context || this, data);
 	   	        }
 	   	    });
        },
        findTradeExcel:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/findTradeExcel",
                type : "get",
                parameters : {
                	path : "/home/statistic/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
        createStatisticExcel: function(start,end,time,assetId,lineIds,reportname,callback, context) {
   			var parameters = {};
   			
   			if(time != null && time != ""){
   				parameters.time = time;
   			}
   			if(assetId != null && assetId.length >0){
   				parameters.assetIds = assetId;
   			}
   			if(lineIds != null && lineIds.length >0){
   				parameters.lineId = lineIds;
   			}
   			
   			if(start != null && start != "" && end != null && end != ""){
   				parameters.startTime = start;
   				parameters.endTime = end;
   			}
   			
   			
   	    	cloud.Ajax.request({
   	    	   url : "api/vmreports/trade/summary",
	   	       type : "get",
	   	       parameters : parameters,
	   	       success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
        getTimeList:function(start,limit,startTime,endTime,assetId,lineIds,callback,context){
     	   var parameters = {};
     	   if(startTime != null && endTime != null){
     		   parameters.startTime = startTime;
     		   parameters.endTime = endTime;
     	   }
     	   if(lineIds && lineIds.length>0){
     		  parameters.lineId = lineIds;
     	   }
     	   if(assetId != null && assetId != ""){
     		   var assetIdArray = [];
     		   if(assetId.indexOf(",") != -1){
     			   assetIdArray = assetId.split(",");
     		   }else{
     			   assetIdArray.push(assetId);
     		   }
     		   parameters.assetIds = assetIdArray;
     	   }
     	   parameters.payStatus = "1";
     	   
     	   cloud.Ajax.request({
   	    		url : "api/order/list",
 	   	        type : "post",
 	   	        parameters : {
 	   	        	cursor : start,
 	   	        	limit:limit
 	   	        },
 	   	        data : parameters,
 	   	        success : function(data) {
 	   	        	callback.call(context || this, data);
 	   	        }
 	   	    });
        }
    });

    return new Service();
    
});