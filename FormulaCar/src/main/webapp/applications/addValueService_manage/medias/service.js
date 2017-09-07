/**
 * service 关联后台数据库操作
 */
define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getAllMedia: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/medias/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getMediasById:function(id,callback,context){
        	cloud.Ajax.request({
				url:"api/medias/"+id,
				type : "GET",
				success:function(data){
					callback.call(context || this,data);
				}
			});
        },
        addMedias: function(mediasdata, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/medias/add",
                type: "POST",
                data: mediasdata,
                success: function(data) {
                    callback.call(context || self, data);
                },
                error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updateMedias: function(id,mediasdata,  callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/medias/" + id ,
                type: "PUT",
                data: mediasdata,
                success: function(data) {
                    callback.call(context || self, data);
                }, error: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        deleteMedias: function(id, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "/api/medias/"+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        }
    });

    return new Service();
});