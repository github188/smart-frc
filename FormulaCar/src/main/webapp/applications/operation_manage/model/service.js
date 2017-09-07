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
        }
    });

    return new Service();

});