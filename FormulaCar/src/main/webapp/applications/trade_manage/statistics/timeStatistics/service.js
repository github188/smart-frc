define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	 initialize: function(){
         },
    	 getTimeStatistic:function(callback,context){
         	cloud.Ajax.request({
                 url : "api/timeStatistic/day",
                 type : "get",
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
     	},
     	getPayStyleStatistic:function(callback,context){
         	cloud.Ajax.request({
                url : "api/timeStatistic/payStyle",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
    	}
    });
    return new Service();
});