/**
 * Created by inhand on 14-6-17.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize : function(){
//            window.getWeekendArr = this.getWeekendArr

        },

        getOnlineUser : function(date,callback,context){
            var self = this;

            if (this.lastGetonlineUserRequest) {
                this.lastGetonlineUserRequest.done(function(data){
                    self.lastGetonlineUserRequest = null;
                    callback.call(context || this, data.result);
                }).fail(function(){
                        self.lastGetonlineUserRequest = null;
                        callback.call(context|| this,{});
                    });
                return;
            }

            this.lastGetonlineUserRequest = cloud.Ajax.request({
                url:"api/stat/wifi_user/online",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetonlineUserRequest = null;

                    callback.call(context || this, data.result);
                },
                error:function(){
                    self.lastGetonlineUserRequest = null;
                    callback.call(context|| this,{});
                }
            })
        },

        getTotalUser : function(date,callback,context){
            var self = this;
            if (this.lastGetTotalUserRequest) {
                this.lastGetTotalUserRequest.done(function(data){
                    self.lastGetTotalUserRequest = null;
                    callback.call(context || this, data.result);
                }).fail(function(){
                        self.lastGetTotalUserRequest = null;
                        callback.call(context|| this,{});
                    });
            }

            this.lastGetTotalUserRequest = cloud.Ajax.request({
                url:"api/stat/wifi_user/total",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetTotalUserRequest = null;

                    callback.call(context || this, data.result);
                },
                error:function(){
                    self.lastGetTotalUserRequest = null;
                    callback.call(context|| this,{});
                }
            });
        },

        getNewUser : function(date,callback,context){
            var self = this;
            if(this.lastGetNewUserRequest){
                this.lastGetNewUserRequest.abort()
            }

            this.lastGetNewUserRequest = cloud.Ajax.request({
                url:"api/stat/wifi_user/new",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetNewUserRequest = null;

                    callback.call(context || this, data.result);
                }
            });

        },

        getActiveUser : function(date,callback,context){
            var self = this;
            if(this.lastGetActiveUserRequest){
                this.lastGetActiveUserRequest.abort()
            }

            this.lastGetActiveUserRequest = cloud.Ajax.request({
                url:"api/stat/wifi_user/active/weekly",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetActiveUserRequest = null;

                    callback.call(context || this, data.result);
                }
            });
        },
        
        getUserStat : function(data,callback,context){
            var self = this;
            if(this.lastGetUserStayRequest){
//                this.lastGetUserStayRequest.abort()
            }

            this.lastGetUserStayRequest = cloud.Ajax.request({
                url:"api/wifi/stat",
                parameters:{
                    start_time:data.startTime,
                    end_time:data.endTime,
                    types:data.types
                },
                type : "get",
                success:function(data){
                    self.lastGetUserStayRequest = null;

                    callback.call(context || this, data.result);
                }
            });
        },

        getWeekendArr:function(startTime,endTime){
//            var startTime = 1388131453705;
//            var endTime = 1403683453705;
            var startDate = new Date(startTime);

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            var a = 6 - startDate.getDay();

            var weekendstart = startDate.getTime() + a*86400000
            var weekendarr = []
            for(;weekendstart < endTime;){
                weekendarr.push(weekendstart);
                weekendstart += 7*86400000;
            }

            return weekendarr

        },

        abort:function(){
            this.lastGetonlineUserRequest && this.lastGetonlineUserRequest.abort();
            this.lastGetNewUserRequest && this.lastGetNewUserRequest.abort();
            this.lastGetTotalUserRequest && this.lastGetTotalUserRequest.abort();
            this.lastGetActiveUserRequest && this.lastGetActiveUserRequest.abort();
        }






    })

    return  new Service();
})