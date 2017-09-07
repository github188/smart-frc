/**
 * Created by zhang on 14-8-27.
 */
define(function(require){
    require("cloud/base/cloud");
    var resourceType = 14;
    var AllSite = "0000000000000"

    // 标签-所有现场
    var allSite = {
        _id : 1,
        name : locale.get({
            lang : "all_site"
        }),
        description : "",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    allSite.total = data.total;
                    callback.call(context || this, data);
                    // callback.call(context || this, data.result.pluck("_id"));
                }
            });
        },
        loadAllSiteData : function(siteName,start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1,
                    name:siteName
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    allSite.total = data.total;
                    callback.call(context || this, data);
                    // callback.call(context || this, data.result.pluck("_id"));
                }
            });
        }
    };

    // 标签-无标签现场
    var noneTagSite = {
        _id : 2,
        name : locale.get({
            lang : "untagged_site"
        }),
        description : "",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/tags/none/resources",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    type : resourceType
                },
                success : function(data) {
                    noneTagSite.total = data.total;
                    // console.log("data",data);
                    // callback.call(context || this, data.result);
                    callback.call(context || this, data);
                }
            });
        }
    };

    //标签-在线现场
    var tagOnline = {
        _id : 3,
        name : locale.get("online_site"),
        description : "online",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1,
                    online : 1
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    tagOnline.total = data.total;
                    callback.call(context || this, data);
                }
            });
        }
    };

    //标签-离线现场
    var tagOffline = {
        _id : 4,
        name : locale.get("offline_site"),
        description : "offline",
        status : "inherent",
        selectable : false,
        favor : false,
        /**
         * Load id array.
         *
         * @param {Object}
         *        callback
         */
        loadResourcesData : function(start, limit, callback, context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters : {
                    limit : limit,
                    cursor : start,
                    verbose : 1,
                    online : 0
                },
                success : function(data) {
                    data.result = data.result.pluck("_id");
                    tagOffline.total = data.total;
                    callback.call(context || this, data);
                }
            });
        }
    };
    
    var Service = Class.create({
        loadTagUrl : "api/site_tags",
        netTags : [ tagOnline, tagOffline ],//在关状态标签
        inherentTags : [ allSite, noneTagSite, tagOnline, tagOffline ],//内置标签

        getResourceType : function() {
            return resourceType;
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

                    var tags = [ self.inherentTags, data.result ].flatten();
                    callback.call(context || self, tags);
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

            this.getResourcesIds(start, limit, function(ids) {
                var total = ids.total;
                var cursor = ids.cursor;
                if (ids.result) {
                    ids = ids.result;
                }
                this.lastGetResroucesRequest = cloud.Ajax.request({
                    url : "api/sites/list",
                    type : "post",
                    parameters : {
                        verbose : 100,
                        limit : limit
                    },
                    data : {
                        resourceIds : ids
                    },
                    success : function(data) {
                        if(start==0){
                            data.result.unshift({
                                _id : AllSite,
                                name : locale.get("all_site")
                            })
                        }
                        data.total = total;
                        data.cursor = cursor;
                        self.lastGetResroucesRequest = null;
                        callback.call(context || this, data);
                    }
                });
            }, this);
        },


        getSitelistByName:function(name,start, limit, callback,context) {
            cloud.Ajax.request({
                url : "api/sites",
                type : "get",
                parameters:{
                    name:name,
                    cursor:start,
                    limit:limit,
                    verbose:100
                },
                success : function(data) {
                    if(name == null && start == 0){
                        data.result.unshift({
                            _id : AllSite,
                            name : locale.get("all_site")
                        })
                    }
                    callback.call(context || this, data);
                }
            });
        },
        //site list end

        //charts start
        getOnlineUser: function(date,callback,context){
            var self = this;
            if(this.lastGetonlineUserRequest){
                this.lastGetonlineUserRequest.abort();
            }

            var params = {
                types:40,
                start_time:date.startTime,
                end_time:date.endTime
            };
            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetonlineUserRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetonlineUserRequest = null;

                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetonlineUserRequest = null;
                    callback.call(context|| this,{});
                }
            });

        },
        getOnlineTerminal: function(date,callback,context){
            var self = this;
            if(this.lastGetonlineTerminalRequest){
                this.lastGetonlineTerminalRequest.abort();
            }

            var params = {
                types:41,
                start_time:date.startTime,
                end_time:date.endTime
            };
            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetonlineTerminalRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetonlineTerminalRequest = null;
                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetonlineTerminalRequest = null;
                    callback.call(context|| this,{});
                }
            });

        },
        getTotalUser : function(date,callback,context){
            var self = this;
            if (this.lastGetTotalUserRequest) {
                this.lastGetTotalUserRequest.abort();
            }

            var params = {
                types:50,
                start_time:date.startTime,
                end_time:date.endTime
            };
            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetTotalUserRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetTotalUserRequest = null;
                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetTotalUserRequest = null;
                    callback.call(context|| this,{});
                }
            });
        },
        getTotalTerminal : function(date,callback,context){
            var self = this;
            if (this.lastGetTotalTerminalRequest) {
                this.lastGetTotalTerminalRequest.abort();
            }

            var params = {
                types:51,
                start_time:date.startTime,
                end_time:date.endTime
            };
            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetTotalTerminalRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetTotalTerminalRequest = null;
                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetTotalTerminalRequest = null;
                    callback.call(context|| this,{});
                }
            });
        },

        getUserStat : function(data,callback,context){
            var self = this;
            if(this.lastGetUserStayRequest){
//                this.lastGetUserStayRequest.abort()
            }

            var params = {
                types:data.types,
                start_time:data.startTime,
                end_time:data.endTime
            };
            if(data.siteId != AllSite){
                params.object_id = data.siteId
            }
            this.lastGetUserStayRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetUserStayRequest = null;

                    callback.call(context || this, data.result);
                },
                error:function(){
                    self.lastGetUserStayRequest = null;
                    callback.call(context || this, {});
                }
            });
        },
        getRegistUser : function(date,callback,context){
            var self = this;
            if(this.lastGetNewUserRequest){
                this.lastGetNewUserRequest.abort()
            }
            var params = {
                start_time:date.startTime,
                end_time:date.endTime,
                types:70
            };

            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetNewUserRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetNewUserRequest = null;

                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetNewUserRequest = null;

                    callback.call(context || this, {});
                }
            });

        },

        getNewTerminal:function(date,callback,context){
            var self = this;
            if(this.lastGetNewTerminalRequest){
                this.lastGetNewTerminalRequest.abort()
            }
            var params = {
                start_time:date.startTime,
                end_time:date.endTime,
                types:71
            };

            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetNewTerminalRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetNewTerminalRequest = null;

                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetNewTerminalRequest = null;

                    callback.call(context || this, {});
                }
            });
        },

        getActiveUser:function(date,callback,context){
            var self = this;
            if(this.lastGetActiveUserRequest){
                this.lastGetActiveUserRequest.abort()
            }
            var params = {
                start_time:date.startTime,
                end_time:date.endTime,
                types:80
            };

            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetActiveUserRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetActiveUserRequest = null;

                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetActiveUserRequest = null;

                    callback.call(context || this, {});
                }
            });
        },

        getActiveTerminal:function(date,callback,context){
            var self = this;
            if(this.lastGetActiveTerminalRequest){
                this.lastGetActiveTerminalRequest.abort()
            }
            var params = {
                start_time:date.startTime,
                end_time:date.endTime,
                types:81
            };

            if(date.siteId != AllSite){
                params.object_id = date.siteId
            }

            this.lastGetActiveTerminalRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:params,
                type : "get",
                success:function(data){
                    self.lastGetActiveTerminalRequest = null;

                    if(data.result[0]){
                        var res = data.result[0].values;
                    }else{
                        var res = {};
                    }

                    callback.call(context || this, res);
                },
                error:function(){
                    self.lastGetActiveTerminalRequest = null;

                    callback.call(context || this, {});
                }
            });
        }





    });
    
    return  new Service()
});