define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        createkey:function(callback,context){
         	var self = this;
            cloud.Ajax.request({
                url: "vapi/client/secret/create",
                type: "get",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
       getkey:function(callback,context){
        	var self = this;
           cloud.Ajax.request({
               url: "vapi/client/secret",
               type: "get",
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
      },
      updatekey:function(callback,context){
       	var self = this;
        cloud.Ajax.request({
            url: "vapi/client/secret",
            type: "put",
            success: function(data) {
                callback.call(context || self, data);
            }
        });
   },
        
    });

    return new Service();
    
});