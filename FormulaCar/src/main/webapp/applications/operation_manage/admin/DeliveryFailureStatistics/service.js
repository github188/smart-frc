define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	 initialize: function(){
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
         getAssetIdInfoByline:function(callback,context){
         	cloud.Ajax.request({
                 url : "api/automat/getAssetId",
                 type : "get",
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
         },
         getOrganOnlineStatistic:function(orgIds,callback,context){
           	cloud.Ajax.request({
                   url : "api/organStatistic/online",
                   type : "get",
                   parameters : {
                	   orgIds:orgIds
                   },
                   success : function(data) {
                       callback.call(context || this, data);
                   }
               });
       	},
         getOrganDayStatistic:function(startTime,endTime,orgIds,callback,context){
          	cloud.Ajax.request({
                  url : "api/deliveryFailureStatistic/dayAll",
                  type : "get",
                  parameters : {
                  	startTime : startTime,
                  	endTime:endTime,
                  	orgIds:orgIds
                  },
                  success : function(data) {
                      callback.call(context || this, data);
                  }
              });
      	},
      	getOrganMonthStatistic:function(startTime,endTime,orgIds,callback,context){
          	cloud.Ajax.request({
                  url : "api/deliveryFailureStatistic/monthAll",
                  type : "get",
                  parameters : {
                  	startTime : startTime,
                  	endTime:endTime,
                  	orgIds:orgIds
                  },
                  success : function(data) {
                      callback.call(context || this, data);
                  }
              });
      	},
      	getOrganYearStatistic:function(startTime,endTime,orgIds,callback,context){
          	cloud.Ajax.request({
                  url : "api/deliveryFailureStatistic/yearAll",
                  type : "get",
                  parameters : {
                  	startTime : startTime,
                  	endTime:endTime,
                  	orgIds:orgIds
                  },
                  success : function(data) {
                      callback.call(context || this, data);
                  }
              });
      	},
         getDeviceDayStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
         	cloud.Ajax.request({
                 url : "api/deviceStatistic/dayAll",
                 type : "get",
                 parameters : {
                 	startTime : startTime,
                 	endTime:endTime,
                 	assetId:assetId,
                 	lineId:lineIds
                 },
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
     	},
     	getDeviceMonthStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
         	cloud.Ajax.request({
                 url : "api/deviceStatistic/monthAll",
                 type : "get",
                 parameters : {
                 	startTime : startTime,
                 	endTime:endTime,
                 	assetId:assetId,
                 	lineId:lineIds
                 },
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
     	},
     	getDeviceYearStatistic:function(startTime,endTime,assetId,lineIds,callback,context){
         	cloud.Ajax.request({
                 url : "api/deviceStatistic/yearAll",
                 type : "get",
                 parameters : {
                 	startTime : startTime,
                 	endTime:endTime,
                 	assetId:assetId,
                 	lineId:lineIds
                 },
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
     	}
     
    });
    return new Service();
});