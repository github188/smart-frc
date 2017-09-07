define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        groupUrl: "api/group",
        type: "group",
        initialize: function() {
            this.map = $H(this.map);
        },
        getGroupById:function(id,callback, context){
        	var self = this;
            cloud.Ajax.request({
                url: self.groupUrl+"/"+id,
                type: "GET",
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllGroups: function(name,callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.groupUrl+"/all",
                type: "GET",
                parameters: {
                    "name": name
                },
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        addGroup:function(name,callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: self.groupUrl,
                type: "POST",
                data:{
                	"name": name
				},
                success: function(data) {
                    callback.call(context || self, data);
                },
                error:function(data){
                	callback.call(context || self, data);
                }
            });
        },
        updateGroup:function(id,name,callback,context){
        	var self = this;
            cloud.Ajax.request({
                url: self.groupUrl+"/"+id,
                type: "PUT",
                data: {
                    "name": name
                },
                success: function(data) {
                    callback.call(context || self, data);
                },error:function(data){
                	callback.call(context || self, data);
                }
            });
        },
        deleteGroup: function(id, callback, context) {
        	var self = this;
    		cloud.Ajax.request({
    			url:self.groupUrl+"/"+id,
    			type:"delete",
    			success:function(data){
					callback.call(context ||this, data);
    			}
    		});
        }
    });

    return new Service();
});