define(function(require) {
    require("cloud/base/cloud");

    var Service = Class.create({
        initialize: function(){
        },
        getSalesByName:function(name,callback,context){
     	   var self = this;
           cloud.Ajax.request({
               url: "gapi/sales/name",
               type: "GET",
               parameters : {
            	     name:name
             },
               success: function(data) {
                   callback.call(context || self, data);
               }
           });
       },
      
        
    });

    return new Service();
    
});