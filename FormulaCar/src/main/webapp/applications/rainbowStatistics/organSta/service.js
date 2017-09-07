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
                });
                return;
            }

            this.lastGetonlineUserRequest = cloud.Ajax.request({
                url:"api/operation/wifi_stat_users",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime,
                    oid:date.oid,
                    type:"online",
                    format:3
                },
                type : "get",
                success:function(data){


                    self.lastGetonlineUserRequest = null;

                    callback.call(context || this, data.result);
                }
            })
        },

        getTotalUser : function(date,callback,context){
            var self = this;
            if (this.lastGetTotalUserRequest) {
                this.lastGetTotalUserRequest.done(function(data){
                    self.lastGetTotalUserRequest = null;
                    callback.call(context || this, data.result);
                });
            }

            this.lastGetTotalUserRequest = cloud.Ajax.request({
                url:"api/operation/wifi_stat_users",
                parameters:{
                    oid:date.oid,
                    type:"all",
                    format:3,
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetTotalUserRequest = null;

                    callback.call(context || this, data.result);
                }
            });
        },

        getUserCount:function(oid,callback,context){
            var self = this;
            if(this.lastGetUserCountRequest){
                this.lastGetUserCountRequest.abort()
            }

            this.lastGetUserCountRequest = cloud.Ajax.request({
                url:" api/operation/wifi_users",
                parameters:{
                    start_time:0,
                    end_time:new Date().getTime(),
                    oid:oid
                },
                type : "get",
                success:function(data){
                    self.lastGetUserCountRequest = null;

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
                url:"api/operation/wifi_stat_users",
                parameters:{
                    oid:date.oid,
                    type:"weekly",
                    format:3,
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

        //terminal start

        getOnlineTerminal : function(date,callback,context){
            var self = this;

            if (this.lastGetonlineTerminalRequest) {
                this.lastGetonlineTerminalRequest.done(function(data){
                    self.lastGetonlineTerminalRequest = null;
                    callback.call(context || this, data.result);
                });
                return;
            }

            this.lastGetonlineTerminalRequest = cloud.Ajax.request({
                url:"api/operation/wifi_stat_terminal",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime,
                    oid:date.oid,
                    type:"online",
                    format:3
                },
                type : "get",
                success:function(data){


                    self.lastGetonlineTerminalRequest = null;

                    callback.call(context || this, data.result);
                }
            })
        },

        getTotalTerminal : function(date,callback,context){
            var self = this;
            if (this.lastGetTotalTerminalRequest) {
                this.lastGetTotalTerminalRequest.done(function(data){
                    self.lastGetTotalTerminalRequest = null;
                    callback.call(context || this, data.result);
                });
            }

            this.lastGetTotalTerminalRequest = cloud.Ajax.request({
                url:"api/operation/wifi_stat_terminal",
                parameters:{
                    oid:date.oid,
                    type:"all",
                    format:3,
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetTotalTerminalRequest = null;

                    callback.call(context || this, data.result);
                }
            });
        },

        getTerminalCount:function(oid,callback,context){
            var self = this;
            if(this.lastGetTerminalCountRequest){
                this.lastGetTerminalCountRequest.abort()
            }

            this.lastGetTerminalCountRequest = cloud.Ajax.request({
                url:" api/operation/wifi_organ_terminal",
                parameters:{
                    start_time:0,
                    end_time:new Date().getTime(),
                    oid:oid
                },
                type : "get",
                success:function(data){
                    self.lastGetTerminalCountRequest = null;

                    callback.call(context || this, data.result);
                }
            });

        },

        getActiveTerminal : function(date,callback,context){
            var self = this;
            if(this.lastGetActiveTerminalRequest){
                this.lastGetActiveTerminalRequest.abort()
            }

            this.lastGetActiveTerminalRequest = cloud.Ajax.request({
                url:"api/operation/wifi_stat_terminal",
                parameters:{
                    oid:date.oid,
                    type:"weekly",
                    format:3,
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    self.lastGetActiveTerminalRequest = null;

                    callback.call(context || this, data.result);
                }
            });
        },
        //terminal end

        //device start
        getOnlineDevice:function(date,callback,context){
            var self = this;

            if (this.lastGetonlineDeviceRequest) {
                this.lastGetonlineDeviceRequest.done(function(data){
                    self.lastGetonlineDeviceRequest = null;
                    callback.call(context || this, data.result);
                });
                return;
            }

            this.lastGetonlineDeviceRequest = cloud.Ajax.request({
                url:"api/operation/wifi_device_organ",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime,
                    type:"online",
                    oid:date.oid
                },
                type : "get",
                success:function(data){


                    self.lastGetonlineDeviceRequest = null;

                    callback.call(context || this, data.result);
                }
            })
        },

        getTotalDevice:function(date,callback,context){
            var self = this;

            if (this.lastGettotalDeviceRequest) {
                this.lastGettotalDeviceRequest.done(function(data){
                    self.lastGettotalDeviceRequest = null;
                    callback.call(context || this, data.result);
                });
                return;
            }

            this.lastGettotalDeviceRequest = cloud.Ajax.request({
                url:"api/operation/wifi_device_organ",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime,
                    type:"all",
                    oid:date.oid
                },
                type : "get",
                success:function(data){


                    self.lastGettotalDeviceRequest = null;

                    callback.call(context || this, data.result);
                }
            })
        },


        //device end




        getOrgList:function(callback,context){
            var self = this;
            if(this.lastGetOrgListRequest){
                this.lastGetOrgListRequest.abort()
            }
            this.lastGetOrgListRequest = cloud.Ajax.request({
                url:"api2/organizations",
                parameters:{
                },
                type : "get",
                success:function(data){
                    self.lastGetOrgListRequest = null;

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