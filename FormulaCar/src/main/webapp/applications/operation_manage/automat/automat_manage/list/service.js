define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        automatUrl: "api/automat",
        type: "automat",
        initialize: function() {
            this.map = $H(this.map);
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
        getAreaInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/smartArea",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
   		},
        getAutomatById:function(id,callback, context){
        	var self = this;
            cloud.Ajax.request({
                url: self.automatUrl+"/"+id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllSite:function(siteId,callback,context){
        	var self = this;
        	cloud.Ajax.request({
                url: "api/automatsite/exceptlist",
                type: "GET",
                parameters: {
                    "limit":-1,
                    "siteId":siteId
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getModelInfo: function(start,limit,callback, context) {
   			cloud.Ajax.request({
                url : "api/model/list",
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
   		getAllGoodsModelInfo:function(modelId,callback, context){
   			cloud.Ajax.request({
                url : "api/goodsmodel/list",
                type : "get",
                parameters : {
                    limit:"-1",
                    modelId:modelId
                },
                success : function(data) {
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
        getAllAutomatsByPage: function(searchData,limit,cursor,callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: self.automatUrl+"/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addAutomat:function(area,name,modelId,modelName,siteId,siteName,assertId,goodsConfigs,callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: self.automatUrl,
                type: "POST",
                data:{
                	"area":area,
                	"name": name,
                	"modelId":modelId,
                	"siteId":siteId,
                	"siteName":siteName,
                	"modelName":modelName,
                	"assetId":assertId,
                	"goodsConfigs":goodsConfigs
				},
				/*parameters:{
                	"goodsConfigChange":goodsConfigChange
				},*/
                success: function(data) {
                    callback.call(context || self, data);
                },
                error:function(data){
                	callback.call(context || self, data);
                }
            });
        },
        updateAutomat:function(id,area,name,modelId,modelName,siteId,siteName,assetId,goodsConfigs,goodsConfigChange,callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: self.automatUrl+"/"+id,
                type: "PUT",
                data:{
                	"area":area,
                	"name": name,
                	"modelId":modelId,
                	"siteId":siteId,
                	"siteName":siteName,
                	"modelName":modelName,
                	"assetId":assetId,
                	"goodsConfigs":goodsConfigs
				},
				parameters:{
                	"goodsConfigChange":goodsConfigChange
				},
                success: function(data) {
                    callback.call(context || self, data);
                },error:function(data){
                	callback.call(context || self, data);
                }
            });
        },
        deleteAutomat: function(id, callback, context) {
        	var self = this;
    		cloud.Ajax.request({
    			url:self.automatUrl+"/"+id,
    			type:"delete",
    			success:function(data){
					callback.call(context ||this, data);
    			}
    		});
        },
        deleteAutomatsByIds:function(ids,callback,context){
        	var self = this;
    		cloud.Ajax.request({
    			url:self.automatUrl+"/delBatch",
    			type:"post",
    			parameters: {
                    "ids": ids,
                },
    			success:function(data){
					callback.call(context ||this, data);
    			}
    		});
        },
        addGoodsModel:function(name,modelId,modelName,goodsConfigs,callback,context){
        	var self = this;
    		cloud.Ajax.request({
    			url:"api/goodsmodel",
    			type:"post",
    			data:{
                	"name": name,
                	"modelId":modelId,
                	"modelName":modelName,
                	"goodsConfigs":goodsConfigs
				},
    			success:function(data){
    				callback.call(context ||this, data);
    			},error:function(data){
    				callback.call(context ||this, data);
    			}
    		});
        },
        updateGoodsModel:function(id,name,modelId,modelName,goodsConfigs,callback,context){
        	var self = this;
        	cloud.Ajax.request({
        		url:"api/goodsmodel/"+id,
        		type:"put",
        		data:{
        			"name": name,
        			"modelId":modelId,
        			"modelName":modelName,
        			"goodsConfigs":goodsConfigs
        		},
        		success:function(data){
        			callback.call(context ||this, data);
        		}
        	});
        },
        getGoodsModelById:function(id,callback,context){
        	var self = this;
    		cloud.Ajax.request({
    			url:"api/goodsmodel/"+id,
    			type:"get",
    			success:function(data){
					callback.call(context ||this, data);
    			}
    		});
        },
        getGoodslist:function(name,start,limit,callback,context){
        	var self = this;
    		cloud.Ajax.request({
    			url:"api/goods/list",
    			type:"get",
    			parameters: {
                    "name": name,
                    "limit":1000,
                    "cursor":0
                },
    			success:function(data){
					callback.call(context ||this, data);
    			}
    		});
        }
    });

    return new Service();
});