define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        siteUrl: "api/automatsite",
        type: "site",
        initialize: function() {
            this.map = $H(this.map);
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
        getDayAllStatistic:function(startTime,endTime,assetId,callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/everyday",
                type : "get",
                parameters : {
                	startTime : startTime,
                	endTime : endTime,
                	assetId:assetId
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getTradeList: function(start,limit,assetId,startTime,endTime,payStatus,callback, context) {
   			var parameters = {};
   			if(assetId != null && assetId != ""){
   				parameters.assetId = assetId;
   			}  			
   			
   			if(startTime != null && startTime != "" && endTime != null && endTime != ""){
   				parameters.startTime = startTime;
   				parameters.endTime = endTime;
   			}

   			if(payStatus != null && payStatus != "-1"){
   				parameters.payStatus = payStatus;
   			}

   			var aucmas = 0;
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){//澳柯玛longyuniot.com
        		aucmas = 1;
        	}
   			
   	    	cloud.Ajax.request({
   	    		url : "api/order/list",
	   	        type : "post",
	   	        parameters : {
                   cursor : start,
                   limit:limit,
                   aucmas:aucmas
                },
	   	        data : parameters,
	   	        success : function(data) {
	   	              callback.call(context || this, data);
	   	        }
	   	    });
		},
        getAllSitesByPage: function(searchData, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl + "/list/automat",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAutomatByAssetId: function(assetId, callback, context) {
            var self = this;

            cloud.Ajax.request({
                url: "api/automat/getByAssetId",
                type: "GET",
                parameters: {
                	"assetId":assetId,
                	"verbose":100
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAutomatLocation: function(assetIds, callback, context) {
            var self = this;

            cloud.Ajax.request({
                url: "api/automat/location",
                type: "GET",
                parameters: {
                	"assetIds":assetIds
                },
                success: function(data) {
                    callback.call(context || self, data);
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
        getLineListData: function(searchData, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatline/list/daily",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getSiteByName: function(name,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite/name",
                type: "GET",
                parameters: {
                    name: name
                },
                success: function(data) {
                    callback.call(context || self, data);
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
		}
    });

    return new Service();
});