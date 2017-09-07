define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
        },
        getSiteTypeList: function(limit,cursor,searchData,callback, context) {
        	var self = this;
        	searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/siteType/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateSiteType:function(id, typeData, callback, context){
        	cloud.Ajax.request({
                url: "api/siteType/"+id,
                type: "PUT",
                data: typeData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        addSiteType: function(typeData, callback, context){
        	cloud.Ajax.request({
                url: "api/siteType/add",
                type: "POST",
                data: typeData,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        getSiteTypeById:function(id, callback, context){
        	cloud.Ajax.request({
                url: "api/siteType/"+id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        deleteSiteTypeById:function(id, callback, context){
        	cloud.Ajax.request({
                url: "api/siteType/"+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        }
    });

    return new Service();

});