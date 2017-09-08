define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
        },

        getVenderList: function(limit,start,name,callback, context) {
            cloud.Ajax.request({
                url: "api/modelVender/list",
                type: "get",
                parameters: {
                    cursor: start,
                    limit: limit,
                    name:name
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllModel: function(limit, cursor,moduleNum, callback, context) {
            var self = this;
            	
            var parameters = {
                 cursor: cursor,
                 limit: limit,
                 moduleNum: moduleNum
            };	
           
            cloud.Ajax.request({
                url: "api/model/list",
                type: "GET",
                parameters:parameters,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
    });

    return new Service();

});