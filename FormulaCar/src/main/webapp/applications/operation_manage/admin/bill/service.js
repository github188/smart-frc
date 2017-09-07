define(function(require) {
    require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var Service = Class.create({
        initialize: function(){
        },
        affirmBill:function(name,numbers,payTime,callback,context){
          	 var self = this;
             cloud.Ajax.request({
                 url: "api/delay/time",
                 type: "PUT",
                 parameters: {
                	 name:name,
                	 number:numbers,
                	 payTime:payTime
                 },
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        getAllsales:function(searchData,limit,cursor,callback,context){
       	 var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "gapi/sales/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
       getAllBill:function(searchData,limit,cursor,callback,context){
         	 var self = this;
         	 searchData.limit = limit;
             searchData.cursor = cursor;
             cloud.Ajax.request({
                 url: "api/bill/list",
                 type: "GET",
                 parameters: searchData,
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
        getBillInfoById:function(id,limit,cursor,callback,context){
        	 var self = this;
             cloud.Ajax.request({
                 url: "api/bill/"+id,
                 type: "GET",
                 parameters: {
                	 limit:limit,
                	 cursor:cursor
                 },
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
        },
    });

    return new Service();
    
});