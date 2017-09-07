define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function() {
        },
       
        addGoodsType: function(typeData, callback, context){
        	cloud.Ajax.request({
                url: "api/goodstype/add",
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
        updateGoodsType:function(id, typeData, callback, context){
        	cloud.Ajax.request({
                url: "api/goodstype/"+id,
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
        getGoodsTypeById:function(id, callback, context){
        	cloud.Ajax.request({
                url: "api/goodstype/"+id,
                type: "get",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        },

        getGoodsTypeList: function(limit,start,name,callback, context) {
            cloud.Ajax.request({
                url: "api/goodstype/list",
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
        deleteGoodsTypeById:function(id, callback, context){
        	cloud.Ajax.request({
                url: "api/goodstype/"+id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        	
        }
        
    });

    return new Service();

});