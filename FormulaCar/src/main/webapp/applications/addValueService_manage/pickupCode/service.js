define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        
        deleteCode: function(ids, callback, context) {
            cloud.Ajax.request({
                url: "api/pickupcode",
                type: "DELETE",
                parameters: {
                	batchNumbers:ids
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllCode: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/pickupcode/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addCode:function(data,callback,context){
        	cloud.Ajax.request({
				url:"api/pickupcode/add",
				type : "post",
				data:data,
				success: function(data) {
	                callback.call(context || self, data);
	            },
	            error: function(data) {
	                callback.call(context || self, data);
	            }
			});
        },
        updateCode: function(contentData, id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/pickupcode/" + id,
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
        upDateCodeStatusById: function(data,id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/pickupcode/" + id,
                type: "PUT",
                data: data,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getGoodsTypeInfo: function(callback, context) {
            cloud.Ajax.request({
                url: "api/goods/type",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getGoodsInfo: function(searchData,start, limit, callback, context) {
        	searchData.cursor = start;
        	searchData.limit = limit;
            cloud.Ajax.request({
                url: "api/goods/list",
                type: "get",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getCodeByBatchNumber: function(searchData, callback, context) {
        	var self = this;
            cloud.Ajax.request({
                url: "api/pickupcode/",
                type: "GET",
                parameters:searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getCodeById: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/pickupcode/" + id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        }
       
    });

    return new Service();
    
});