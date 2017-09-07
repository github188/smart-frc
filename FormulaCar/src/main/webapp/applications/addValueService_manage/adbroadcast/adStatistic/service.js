/**
 * service 关联后台数据库操作
 */
define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getAssetStatisticDataByType: function(searchData, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/smartStatistic/ad",
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
        getAllLines:function(searchData,limit,cursor,callback,context){
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
        getAutomatsByAssetId: function(assetId,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automat/getByAssetId",
                type: "GET",
                parameters: {
                	assetId:assetId,
                	searchFlag:1
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getLinesByUserId:  function(userId, callback, context) {
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
      getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
          var self = this;
          searchData.limit = limit;
          searchData.cursor = cursor;
          searchData.vflag = 1;
          searchData.verbose = 5;
          cloud.Ajax.request({
              url: "api/automat/list_new",
              type: "GET",
              parameters: searchData,
              success: function(data) {
                  callback.call(context || self, data);
              }
          });
      }
    });

    return new Service();
});