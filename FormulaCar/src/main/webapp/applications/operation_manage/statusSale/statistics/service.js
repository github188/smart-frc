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
      getCount: function(searchData,callback, context) {
          var self = this;
          cloud.Ajax.request({
              url: "api/automat/count",
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
       getDayAllStatisticByArea:function(startTime,endTime,areaIds,callback,context){
          cloud.Ajax.request({
                url : "api/areaStatistic/everyday",
                type : "get",
                parameters : {
                  startTime : startTime,
                  endTime : endTime,
                  areaId:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
       getCustomAllStatisticByArea:function(startTime,endTime,areaIds,callback,context){
          cloud.Ajax.request({
                url : "api/areaStatistic/customday",
                type : "get",
                parameters : {
                  startTime : startTime,
                  endTime : endTime,
                  areaId:areaIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getDayAllStatisticByLine:function(startTime,endTime,lineIds,callback,context){
          cloud.Ajax.request({
                url : "api/lineStatistic/everyday",
                type : "get",
                parameters : {
                  startTime : startTime,
                  endTime : endTime,
                  lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getCustomAllStatisticByLine:function(startTime,endTime,lineIds,callback,context){
          cloud.Ajax.request({
                url : "api/lineStatistic/customday",
                type : "get",
                parameters : {
                  startTime : startTime,
                  endTime : endTime,
                  lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getDayAllStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/everyday",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	assetId:assetId,
                	lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getMonthAllStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/everymonth",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	assetId:assetId,
                	lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getCustomAllStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/customday",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	assetId:assetId,
                	lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getYearAllStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/everyyear",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	assetId:assetId,
                	lineId:lineIds
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
        createStatisticExcel: function(uid,userName,start,end,time,assetId,lineIds,language,reportname,callback, context) {
   			var parameters = {};
   			if(uid != null && uid != ""){
   				parameters.uid = uid;
   			}
   			if(userName != null && userName != ""){
   				parameters.userName = userName;
   			}
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
   			if(language != null && language != ""){
   				parameters.language = language;
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