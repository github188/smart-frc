define(function(require) {
    require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var Service = Class.create({
        initialize: function(){
        },
        affirmBeforeBill:function(name,numbers,payTime,type,callback,context){
          	 var self = this;
             cloud.Ajax.request({
                 url: "api/delay/renewtime",
                 type: "PUT",
                 parameters: {
                	 name:name,
                	 number:numbers,
                	 payTime:payTime,
                	 type:type
                 },
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
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
        getAllOid:function(searchData,limit,cursor,callback,context){
         	 var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.verbose = 100;
            cloud.Ajax.request({
                url: "mapi/organization/list",
                type: "get",
                parameters: searchData,
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
        getBeforeBill:function(name,nums,type,callback,context){
	       	 var self = this;
	         cloud.Ajax.request({
	             url: "api/bill/calculate",
	             type: "GET",
	             parameters: {
	            	 org:name,
	            	 nums:nums,
	            	 type:type
	             },
	             success: function(data) {
	                 callback.call(context || self, data);
	             }
	         });
        },
        deleteBeforeBillById:function(id,callback,context){
          	 var self = this;
             cloud.Ajax.request({
                 url: "api/bill/"+id,
                 type: "DELETE",
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
        getBeforeBillInfoById:function(id,callback,context){
       	    var self = this;
            cloud.Ajax.request({
                url: "api/bill/"+id+"/bill",
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
        updateBeforeBillById:function(id,finalData,callback,context){
       	 var self = this;
         cloud.Ajax.request({
             url: "api/bill/"+id,
             type: "PUT",
             data:finalData,
             success: function(data) {
                 callback.call(context || self, data);
             }
         });
       },
       addBeforeBillById:function(finalData,callback,context){
         	 var self = this;
           cloud.Ajax.request({
               url: "api/bill/add",
               type: "POST",
               data:finalData,
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
         },
         deleteBillByIds: function(ids, callback, context) {
             var self = this;
             cloud.Ajax.request({
                 url: "api/bill/delBatch",
                 type: "post",
                 parameters: {
                     "ids": ids
                 },
                 success: function(data) {
                     callback.call(context || this, data);
                 }
             });
         },
    });

    return new Service();
    
});