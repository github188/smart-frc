/**
 * Created by zhouyunkui on 14-6-15.
 */
define(function(require) {
    require("cloud/base/cloud");
    var resourceType =66;
    var Service = Class.create({
        inherentTags: [/*allUser, phoneAccountUser,snsAccountUser,blacklist*/],
        loadTagUrl: "api/publish_point",
        type: "point",
        resourceType: resourceType,
        initialize: function() {
            this.map = $H(this.map);
        },

        getTags: function(callback, context) {
            var self = this;
            cloud.Ajax.request({
                url: self.loadTagUrl,
                type: "GET",
                parameters: {
                    limit:0,
                    verbose: 100,
                    status:1
                },
                success: function(data) {
                    var tags = [/*self.inherentTags,*/ data.result].flatten();
                    tags=tags.each(function(one){
                        one.history="log";
                    });
                    callback.call(context || self, tags);
                }
            });
        },

        getResourceType: function() {
            return this.resourceType;
        },
        getResourcesIds: function(start, limit, callback, context){
            cloud.Ajax.request({
                url: "api/content_sync/log",
                type: "get",
                success: function(data) {
                    callback.call(context || this, data.result.pluck("_id"));
                }
            });
        },
        //get content resources by resource ids array.
        getTableResources: function(start, limit, callback,context) {
            if (this.lastGetResroucesRequest) {
                this.lastGetResroucesRequest.abort();
            }
            var self = this;
            self.getResourcesIds(start,limit,function(data) {
                var total = data.total;
                var cursor = data.cursor;
                data.total = total;
                data.cursor = cursor;
                self.lastGetResroucesRequest = null;
                callback.call(context || this, data);
            }, this);
        }
    });

    return new Service();
});