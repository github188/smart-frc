define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getDayAllStatistic:function(callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/dayAll",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getMonthAllStatistic:function(callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/monthAll",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getYearAllStatistic:function(callback,context){
        	cloud.Ajax.request({
                url : "api/smartStatistic/smartYear",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
        }
    });

    return new Service();
    
});