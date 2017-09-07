define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getUnPayBill:function(searchData,limit,cursor,callback,context){
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
        getOidById:function(id,callback,context){
			cloud.Ajax.request({
                url : "api2/organizations/"+id,
                type : "get",
                parameters:{
                	verbose:100
                },
                success : function(data) {
                   callback.call(context || this, data);
                }
           });
		},
		getOrganizationById:function(id,callback,context){
			cloud.Ajax.request({
               url : "api/organization/"+id,
               type : "get",
               parameters:{
               	verbose:100
               },
               success : function(data) {
                  callback.call(context || this, data);
               }
          });
		},
    });

    return new Service();
    
});