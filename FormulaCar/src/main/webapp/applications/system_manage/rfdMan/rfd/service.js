define(function(require) {
    require("cloud/base/cloud");

    var Service = Class.create({
        initialize: function(){
        },
        deleteRfidByIds:function(ids,callback,context){
     	   var self = this;
           cloud.Ajax.request({
               url: "api/basic/rfid/rfidDelBatch",
               type: "POST",
               parameters : {
            	   ids:ids
               },
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
       },
        getRfidById:function(id,callback,context){
          	 var self = this;
             cloud.Ajax.request({
                 url: "api/basic/"+id+"/rfid",
                 type: "GET",
                 success: function(data) {
                     callback.call(context || self, data);
                 }
             });
           },
        addRfid:function(data,callback,context){
     	   var self = this;
           cloud.Ajax.request({
               url: "api/basic/rfid",
               type: "POST",
               data : data,
               success: function(data) {
                   callback.call(context || self, data);
               },
               error:function(data){
	                  callback.call(context || this, data);
	              }
           });
       },
       updateRfid:function(id,data,callback,context){
     	   var self = this;
           cloud.Ajax.request({
               url: "api/basic/"+id+"/rfid",
               type: "PUT",
               data : data,
               success: function(data) {
                   callback.call(context || self, data);
               },
               error:function(data){
	                  callback.call(context || this, data);
	              }
           });
       },
       getrfdInfo:function(searchData,limit,cursor,callback,context){
       	 var self = this;
         searchData.limit = limit;
         searchData.cursor = cursor;
         cloud.Ajax.request({
             url: "api/basic/rfid/list",
             type: "GET",
             parameters: searchData,
             success: function(data) {
                 callback.call(context || self, data);
             }
         });
       },
        
    });

    return new Service();
    
});