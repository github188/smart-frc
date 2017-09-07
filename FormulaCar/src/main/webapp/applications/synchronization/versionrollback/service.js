define(function(require) {
    require("cloud/base/cloud");
    // 资源类型，见API
    var resourceType = 77;
    var Service = Class.create({
//        netTags : [ tagOnline, tagOffline ],//在关状态标签
//        inherentTags : [ allSite, noneTagSite, tagOnline, tagOffline ],//内置标签
        loadTagUrl : "api/publish_point",//获取发布点标签的URL
        type : "publishpoint",
        resourceType : 77,
        initialize : function() {
            this.map = $H(this.map);
        },
        getNetTags : function(callback, context) {
            var self = this;
            var tags = [ self.netTags ].flatten();
            callback.call(context || self, tags);
        },

        getTags : function(callback, context) {
            var self = this;
            cloud.Ajax.request({
                url : self.loadTagUrl,
                type : "GET",
                parameters : {
                    verbose : 100,
                    status:1,
                    limit:0
                },
                success : function(data) {
                    //将请求到的tags和预定义的固有tags混合组装到同一个数组
                    var tags = [ /*self.inherentTags,*/ data.result ].flatten();
                    callback.call(context || self, tags);
                }
            });
        },

        getResourceType : function() {
            return this.resourceType;
        },

        getResourcesIds : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/publish_point",
                type : "get",
                success : function(data) {
                    callback.call(context || this, data.result.pluck("_id"));
                }
            });
        },
        /**
         * 用于content-table请求数据
         */
        getTableResources : function(start, limit, callback, context) {
            if (this.lastGetResroucesRequest) {
                this.lastGetResroucesRequest.abort();
            }
            var self = this;
            this.getResourcesIds(start, limit, function(data) {
                self.lastGetResroucesRequest = null;
                callback.call(context || this, data);
            }, this);
        }
    });

    return new Service();
});