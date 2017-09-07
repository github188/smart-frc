define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getAllcodeThird: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/order/thirdcode",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getCodeThirdById:function(id,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/order/thirdcode/"+id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        updatecodeThird: function(data,code,assetId, callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: "api/order/cancelcode?code="+code+"&assetId="+assetId,
                type: "POST",
                data: data,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        
    });

    return new Service();
    
});