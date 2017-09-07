define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize: function(){
        },
        getUserMessage:function(callback,context){
        	cloud.Ajax.request({
				url:"api2/users/this",
				type : "GET",
				parameters:{
					verbose:100
				},
				success:function(data){
					callback.call(context || this,data);
				}
			});
        }
        
    });

    return new Service();
    
});