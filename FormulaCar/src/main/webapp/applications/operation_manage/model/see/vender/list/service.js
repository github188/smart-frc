define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
        },
        addvender: function(url,data, callback, context){
        	cloud.Ajax.request({
                url: url+"/modelVender/add",
                type: "POST",
                data: data,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        updatevender:function(url,id, data, callback, context){
        	cloud.Ajax.request({
                url: url+"/modelVender/"+id,
                type: "PUT",
                data: data,
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },
        getVenderById:function(url,id, callback, context){
        	cloud.Ajax.request({
                url: url+"/modelVender/"+id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },

        getVenderList: function(url,limit,start,name,callback, context) {
            cloud.Ajax.request({
                url: url+"/modelVender/list",
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
        deleteVenderById:function(url,id, callback, context){
        	cloud.Ajax.request({
                url:  url+"/modelVender/"+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                },
                error: function(data) {
                	callback.call(context || this, data);
                }
            });
        	
        }
    });

    return new Service();

});