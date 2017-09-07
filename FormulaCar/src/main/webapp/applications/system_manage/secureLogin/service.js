define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getWechatUser:function(callback,context){
         	var self = this;
            cloud.Ajax.request({
                url: "/vapi/oper/list",
                type: "get",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
       },
       deleteWechatUser:function(openId,callback,context){
        	var self = this;
           cloud.Ajax.request({
               url: "/vapi/oper",
               type: "DELETE",
               parameters :{
               	openId:openId
				},
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
      }
    });

    return new Service();
    
});