define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	automatUrl: "api/automat",
        type: "automat",
        initialize: function() {
            this.map = $H(this.map);
        },
        getGoodsTypeInfo: function(url,callback, context) {
            cloud.Ajax.request({
                url: url+"/goods/type",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addTemplateInfo:function(data,callback,context){
   			cloud.Ajax.request({
                url : "api/automat/channelModel",
                data : data,
                type : "post",
                success : function(data) {
                	  callback.call(context || this,data);
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
       getAreaByUserId: function(userId, callback, context){
     	  cloud.Ajax.request({
     	      url:"api/smartUser/"+userId,
 	    	  type : "GET",
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
  		    		//console.log(data);
  		    		  var roleType = permission.getInfo().roleType;
  		    		  if(data && data.result && data.result.area && data.result.area.length>0 && roleType != 51 || roleType == 51){
  		    			  
  		    			  var searchData = {};
  		    			  if(roleType != 51){
  		    				searchData = {
  	  		    					"areaId":data.result.area
  	  		    			  };
  		    			  }
  		    			  
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
        getUserMessage: function(callback, context) {
            cloud.Ajax.request({
                url: "api2/users/this",
                type: "GET",
                parameters: {
                    verbose: 100
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addLine: function(contentData, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatline",
                type: "POST",
                data: contentData,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getSiteByNameFormDeviceList: function(name, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automat/getBySiteName",
                type: "GET",
                parameters: {
                    "siteName": name,
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getSiteByName: function(name, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite/name",
                type: "GET",
                parameters: {
                    "name": name,
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllSitesByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/automatsite/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
         
        getAllEnableSitesByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/automatsite/enable/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addSite: function(contentData, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite",
                type: "POST",
                data: contentData,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updateSite: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite/" + id,
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
        getAllPlaceGoogle: function(inpuValue, callback, context) {
            cloud.Ajax.request({
                url: "api/map/google/place/queryautocomplete",
                type: "GET",
                parameters: {
                    inputValue: inpuValue
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getlatlonByAddress: function(name, callback, context) {
            cloud.Ajax.request({
                url: "api/map/google/geocode",
                type: "GET",
                parameters: {
                    address: name
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllPlace: function(inpuValue, callback, context) {
            cloud.Ajax.request({
                url: "api/map/baidu/getAllplace",
                type: "GET",
                parameters: {
                    inputValue: inpuValue
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getUserMessage:function(callback, context) {
            cloud.Ajax.request({
                url: "api2/users/this",
                type: "GET",
                parameters: {
                    verbose: 100
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAreaInfo: function(start, limit, callback, context) {
            cloud.Ajax.request({
                url: "api/smartArea",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
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
        
        getSiteById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllSite: function(siteId, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatsite/exceptlist",
                type: "GET",
                parameters: {
                    "limit": -1,
                    "siteId": siteId
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getModelInfo: function(start, limit, callback, context) {
            cloud.Ajax.request({
                url: "api/model/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllGoodsModelInfo: function(modelId, callback, context) {
            cloud.Ajax.request({
                url: "api/goodsmodel/list",
                type: "get",
                parameters: {
                    limit: "-1",
                    modelId: modelId
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        /* searchData 格式 {
         "createStart":createStart,
         "createEnd":createEnd,
         "online":online,
         "activateStart":activateStart,
         "activateEnd":activateEnd,
         "siteName":siteName,
         "name":name,
         "groupName":groupName
         
         };
         */
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.vflag = 1;
            searchData.verbose = 5;
            searchData.deleteState = 0;
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllAutomatIds: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.vflag = 0;
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updateAutomatGoodsConfig: function(saveGoodsConfig, callback, context) {
            //console.log(saveGoodsConfig);
        },
        addAutomat: function(area, name, modelId, modelName, siteId, siteName, assertId, goodsConfigs, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.automatUrl,
                type: "POST",
                data: {
                    "area": area,
                    "name": name,
                    "modelId": modelId,
                    "siteId": siteId,
                    "siteName": siteName,
                    "modelName": modelName,
                    "assetId": assertId,
                    "goodsConfigs": goodsConfigs
                },
                /*parameters:{
                 "goodsConfigChange":goodsConfigChange
                 },*/
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addAutomatDevice:function(datas,callback,context){
            var self = this;
            cloud.Ajax.request({
                url: self.automatUrl,
                type: "POST",
                data: datas, 
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updateAutomat: function(id,  subdata, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/automatv2/" + id,
                type: "PUT",
                data: subdata,
                success: function(data) {
                    callback.call(context || self, data);
                }, error: function(data) { 
                    callback.call(context || self, data);
                }
            });
        },
        deleteAutomat: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.automatUrl + "/" + id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteAutomatsByIds: function(ids, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.automatUrl + "/delBatch",
                type: "post",
                parameters: {
                    "ids": ids,
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        authAutomatsByIds: function(ids, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.automatUrl + "/updateBatch",
                type: "post",
                parameters: {
                    "ids": ids,
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addGoodsModel: function(name, modelId, modelName, goodsConfigs, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/goodsmodel",
                type: "post",
                data: {
                    "name": name,
                    "modelId": modelId,
                    "modelName": modelName,
                    "goodsConfigs": goodsConfigs
                },
                success: function(data) {
                    callback.call(context || this, data);
                }, error: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateGoodsModel: function(id, name, modelId, modelName, goodsConfigs, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/goodsmodel/" + id,
                type: "put",
                data: {
                    "name": name,
                    "modelId": modelId,
                    "modelName": modelName,
                    "goodsConfigs": goodsConfigs
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsModelById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/goodsmodel/" + id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodslist: function(name,state,typename, start, limit, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/goods/list",
                type: "get",
                parameters: {
                	"sort":1,
                    "name": name,
                    "limit": limit,
                    "cursor": start,
                    "typename":typename,
                    "state":state
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateGoods: function(id, goodsData, callback, context) {
            cloud.Ajax.request({
                url:"api/goods/" + id,
                type: "PUT",
                data: goodsData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getModelById: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/model/" + id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getPayStylelist: function(accept ,areaId, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/style/list",
                type: "get",
                parameters: {
                    "accept": accept,
                    "areaId":areaId
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        createGoodConfigExcel:function(exportData,callback, context){
        	  var self = this;
              cloud.Ajax.request({
                  url: "api/vmreports/goodsConfig",
                  type: "post",
                  data: exportData,
                  success: function(data) {
                      callback.call(context || this, data);
                  }
              });
        },
		findGoodsExcel:function(time,report_name,callback,context){
			cloud.Ajax.request({
                url : "api/vmreports/findTradeExcel",
                type : "get",
                parameters : {
                	path : "/home/goodConfig/"+time+"/"+report_name
                },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
		 },
		 
		 cloningGoodsToAutomat:function(subdata,callback,context){
			 cloud.Ajax.request({
	                url : "api/automat/cloning",
	                type : "post",
	                data:subdata,
	                success : function(data) {
	                    callback.call(context || this, data);
	                }
	            });
		 },
		 getCloningList:function(subdata,callback,context){
			 cloud.Ajax.request({
	                url : "api/automat/clonelist",
	                type : "post",
	                data:subdata,
	                success : function(data) {
	                    callback.call(context || this, data);
	                }
	            });
		 }
    });

    return new Service();
});