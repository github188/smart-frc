define(function(require) {
    require("cloud/base/cloud");
    var Service = Class.create({
        automatUrl: "api/automat",
        siteUrl:"api/automatsite",
        type: "automat",
        resourceType : 15,
        initialize: function() {
            this.map = $H(this.map);
        },
        
        
        getSiteByPageAndParams: function(name,limit,cursor,callback, context) {
        	var paramters = null;
        	if(name==null||name == ""){
        		parameters = {
                    "cursor":cursor,
                    "limit":limit
                };
        	}else{
        		parameters = {
                    "name": name,
                    "cursor":cursor,
                    "limit":limit
                };
        	}
            var self = this;
            cloud.Ajax.request({
                url: self.siteUrl+"/list/automat",
                type: "GET",
                parameters: parameters,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        
        getResourceType : function() {
            return this.resourceType;
        },
        getTags : function(callback, context) {
            var self = this;
            cloud.Ajax.request({
                url : self.loadTagUrl,
                type : "GET",
                parameters : {
                    verbose : 100
                },
                success : function(data) {
                    //将请求到的tags和预定义的固有tags混合组装到同一个数组
                    var tags = [ self.inherentTags, data.result ].flatten();
                    callback.call(context || self, tags);
                }
            });
        }
    });

    return new Service();
});