define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	loadChartByResIds : function(resourceIds, startTime, endTime, callback, context){
            resourceIds = cloud.util.makeArray(resourceIds);
            var param = {};
            if (startTime){
                param.startTime = startTime
            }
            if (endTime){
                param.endTime = endTime
            }
            if (resourceIds.length > 0){
                cloud.Ajax.request({
                    url: "api/signal_tendency",
                    type: "post",
                    parameters : param,
                    data: {
                        resourceIds: resourceIds
                    },
                    success: function(data) {
                        if (data.result){
                            var result = $A(data.result);
                            result.each(function(one){
                            	one.data.collect(function(data){

                            		data[0]=data[0]*1000;
                            		data[1]=parseInt(data[1]);
                            		
                            	});
                            	one.resourceId = one.sn;
                            });
                        }   
                        
                        callback && (callback.call(context || this, data.result));
                    }
                });
            }
        },
        getDeviceTraffic : function(resourceIds, startTime, endTime, callback, context){
            resourceIds = cloud.util.makeArray(resourceIds);
            var param = {};
            if (startTime){
                param.startTime = startTime
            }
            if (endTime){
                param.endTime = endTime
            }
            if (resourceIds.length > 0){
                cloud.Ajax.request({
                    url: "api/trafficStatistic/list",
                    type: "post",
                    parameters : param,
                    data: {
                        resourceIds: resourceIds
                    },
                    success: function(data) {
             /*           if (data.result){
                            var result = $A(data.result);
                            result.each(function(one){
                            	one.data.collect(function(data){
                            		data[1]=parseInt(data[1]/1024);
                            		
                            	});
                             	one.updata.collect(function(updata){

                            		updata[1]=parseInt(updata[1]/1024);
                            		
                            	});
                            	one.resourceId = one.sn;
                            });
                        }   
                        */
                        callback && (callback.call(context || this, data.result));
                    }
                });
            }
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
					    					  "lineId": lineIds 
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
    	getAllInbox: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/inbox/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
    	getHistoryStatistic:function(startTime,endTime,callback,context){
        	cloud.Ajax.request({
                url : "api/tradeStatistic/history",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime:endTime
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },

      getTrafficStatistic:function(searchData,limit,cursor,callback,context){
  	  	var self = this;
 	 	searchData.limit = limit;
    	searchData.cursor = cursor;
    	cloud.Ajax.request({
    		url: "api/trafficStatistic/day",
    		type: "GET",
    		parameters: searchData,
    		success: function(data) {
    			callback.call(context || self, data);
        	}
    	});
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
        getStatisticDay:function(startTime,endTime,assetId,lineId,callback,context){
        	cloud.Ajax.request({
                url : "api/statistic/day",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime:endTime,
                	assetId:assetId,
                	lineId:lineId
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getStatisticMonth:function(startTime,endTime,assetId,lineId,callback,context){
        	cloud.Ajax.request({
                url : "api/statistic/month",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime:endTime,
                	assetId:assetId,
                	lineId:lineId
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getStatisticYear:function(startTime,endTime,assetId,lineId,callback,context){
        	cloud.Ajax.request({
                url : "api/statistic/year",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime:endTime,
                	assetId:assetId,
                	lineId:lineId
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsStatistic:function(type,top,time,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/statistic/goods/data?top="+top+"&type="+type,
                type : "get",
                parameters : {
                	time : time,
                	lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsTypeStatistic:function(type,top,time,lineIds,callback,context){
        	cloud.Ajax.request({
        		url : "api/statistic/type/data?top="+top+"&type="+type,
        		type : "get",
        		 parameters : {
                 	time : time,
                 	lineId:lineIds
                 },
        		success : function(data) {
        			callback.call(context || this, data);
        		}
        	});
        },
        getGoodsTypeStatisticByPage:function(type,time,limit,cursor,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/statistic/type/page?limit="+limit+"&cursor="+cursor+"&type="+type,
                type : "get",
                parameters : {
                	time : time,
                	lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsStatisticByPage:function(type,time,limit,cursor,lineIds,callback,context){
        	cloud.Ajax.request({
                url : "api/statistic/goods/page?limit="+limit+"&cursor="+cursor+"&type="+type,
                type : "get",
                parameters : {
                	time : time,
                	lineId:lineIds
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        }
    });
    return Service;
});