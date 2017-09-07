define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
    	 initialize: function(){
         },
    	 getFaulStatistic:function(startTime,endTime,callback,context){
         	cloud.Ajax.request({
                 url : "api/faultStatistic/month",
                 type : "get",
                 parameters : {
                  	startTime : startTime,
                  	endTime:endTime
                  },
                 success : function(data) {
                     callback.call(context || this, data);
                 }
             });
     	},
     	getYearFaulStatistic:function(startTime,endTime,callback,context){
         	cloud.Ajax.request({
                url : "api/faultStatistic/year",
                type : "get",
                parameters : {
                 	startTime : startTime,
                 	endTime:endTime
                 },
                success : function(data) {
                    callback.call(context || this, data);
                }
            });
    	},
    });
    return new Service();
});