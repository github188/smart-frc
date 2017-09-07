define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
        },

        getWarehouseList: function(name,id,cursor,limit,callback, context) {
            cloud.Ajax.request({
                url: "api/warehouse/list",
                type: "get",
                parameters: {
                    cursor:cursor,
                    limit: limit,
                    name:name,
                    id:id
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        
        updateWarehouse:function(id,data,callback,context){
            cloud.Ajax.request({
                url: "api/warehouse/"+id,
                type: "put",
                data:data,
                success: function(data) {
                    callback.call(context || this, data);
                },
            	error:function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        
        addWarehouse:function(data,callback,context){
            cloud.Ajax.request({
                url: "api/warehouse/add",
                type: "post",
                data:data,
                success: function(data) {
                    callback.call(context || this, data);
                },
            	error:function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteWarehouseById:function(id, callback, context){
        	cloud.Ajax.request({
                url:  "api/warehouse/"+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        }
    });
    
    return new Service();
});