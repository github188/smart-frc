define(function(require) {
	require("cloud/base/cloud");
	var Service = Class.create({
		initialize : function() {
		},
		getAlarmInfoBySiteId:function(siteId,start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/smart_alarm/"+siteId+"/siteId",
                type : "get",
                parameters : {
                    cursor : start,
                    limit:limit
                },
                success : function(data) {
                    callback.call(context || this, data);
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
        getSalesDataList:function(oid,assetId,starttime,endtime,limit,cursor,callback,context){
        	
        	cloud.Ajax.request({
                url : "vapi/device/getSales",
                type : "get",
                parameters : {
                	oid:oid,
                	assetId:assetId,
                	starttime:starttime,
                	endtime:endtime,
                	limit:limit,
                	cursor:cursor
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
   		getAlarmList: function(siteId,start,limit,type,startTime,endTime, search,searchValue,callback, context) {
   	    	if(type == 0){
   	    		if(search == 0){
   	    			var parameters={
   	    					 cursor : start,
     	   	                 limit:limit,
     	   	                 startTime:startTime,
     	   	                 endTime:endTime,
     	   	                 siteName:searchValue,
     	   	                 siteId:siteId
   	    			};
   	    		}else if(search == 1){
   	    			var parameters={
  	    					 cursor : start,
    	   	                 limit:limit,
    	   	                 startTime:startTime,
    	   	                 endTime:endTime,
    	   	                 deviceName:searchValue,
    	   	                 siteId:siteId
  	    			};
   	    		}
   	    	}else{
   	    		if(search == 0){
   	    			var parameters={
   	    					 cursor : start,
     	   	                 limit:limit,
     	   	                 type:type,
     	   	                 startTime:startTime,
     	   	                 endTime:endTime,
     	   	                 siteName:searchValue,
     	   	                 siteId:siteId
   	    			};
   	    		}else if(search == 1){
   	    			var parameters={
  	    					 cursor : start,
    	   	                 limit:limit,
    	   	                 type:type,
    	   	                 startTime:startTime,
    	   	                 endTime:endTime,
    	   	                 deviceName:searchValue,
    	   	                 siteId:siteId
  	    			};
   	    		}
   	       }
   	    	cloud.Ajax.request({
   	    		url : "api/smart_alarm/list",
	   	        type : "get",
	   	        parameters : parameters,
	   	        success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
		getTradeInfoBySiteId:function(siteId,startTime,endTime,callback, context) {
   			cloud.Ajax.request({
                url : "api/smartStatistic/bySiteIdAndTime",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                    siteId:siteId
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
		getSiteInfo : function(siteId, callback, context) {
			cloud.Ajax.request({
				url : "api/automatsite/" + siteId,
				type : "get",
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getDeviceInfo : function(siteId, callback, context) {
			cloud.Ajax.request({
				url : "api/automat",
				type : "get",
				parameters : {
					siteId : siteId
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getDayAllStatisticBySiteId:function(siteId,startTime,endTime,callback, context){
			cloud.Ajax.request({
				url : "api/smartStatistic/everyday",
				type : "get",
				parameters : {
					siteId : siteId,
					startTime : startTime,
                	endTime : endTime
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getMonthAllStatisticBySiteId: function(siteId,offset,startTime,endTime,callback, context) {
			cloud.Ajax.request({
				url : "api/smartStatistic/everymonth2",
				type : "get",
				parameters : {
					siteId : siteId,
					startTime : startTime,
                	endTime : endTime,
                	type:2,
                	offset:offset
                
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getYearAllStatisticBySiteId : function(siteId,offset,startTime,endTime,callback, context) {
			cloud.Ajax.request({
				url : "api/smartStatistic/everymonth2",
				type : "get",
				parameters : {
					siteId : siteId,
					startTime : startTime,
                	endTime : endTime,
                	type:3,
                	offset:offset
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getDayAllStatisticBySite : function(siteId,callback, context) {
			cloud.Ajax.request({
				url : "api/smartStatistic/dayAll",
				type : "get",
				parameters : {
					siteId : siteId
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getMonthAllStatisticBySite : function(siteId,callback, context) {
			cloud.Ajax.request({
				url : "api/smartStatistic/monthAll",
				type : "get",
				parameters : {
					siteId : siteId
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		},
		getYearAllStatisticBySite : function(siteId,callback, context) {
			cloud.Ajax.request({
				url : "api/smartStatistic/smartYear",
				type : "get",
				parameters : {
					siteId : siteId
				},
				success : function(data) {
					callback.call(context || this, data);
				}
			});
		}
	});

	return new Service();

});