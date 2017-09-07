/**
 * Created by inhand on 14-6-17.
 */
define(function(require){
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize : function(){

        },

        getOnlineTerminal : function(date,callback,context){
            var self = this;

            if (this.lastGetonlineTerminalRequest) {
                this.lastGetonlineTerminalRequest.done(function(data){
                    self.lastGetonlineTerminalRequest = null;
                    callback.call(context || this, data.result);
                }).fail(function(){
                        self.lastGetonlineTerminalRequest = null;
                        callback.call(context || this,{});
                    });
                return;
            }

            this.lastGetonlineTerminalRequest = cloud.Ajax.request({
                url:"api/stat/wifi_terminal/online",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){

                    self.lastGetonlineTerminalRequest = null;

                    callback.call(context || this, data.result);
                },
                error:function(){
                    self.lastGetonlineTerminalRequest = null;
                    callback.call(context || this,{});
                }
            })
        },

        getTotalTerminal : function(date,callback,context){

            if (this.lastGetTotalTerminalRequest) {
//                this.lastGetTotalTerminalRequest.abort();
            }

            this.lastGetTotalTerminalRequest = cloud.Ajax.request({
                url:"api/stat/wifi_terminal/total",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    this.lastGetTotalTerminalRequest = null;

                    callback.call(context || this, data.result);
                }
            });
        },

        getNewTerminal : function(date,callback,context){
            if(this.lastGetNewTerminalRequest){
                this.lastGetNewTerminalRequest.abort()
            }

            this.lastGetNewTerminalRequest = cloud.Ajax.request({
                url:"api/stat/wifi_terminal/new",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    this.lastGetNewTerminalRequest = null;

                    callback.call(context || this, data.result);
                }
            });

        },

        getActiveTerminal : function(date,callback,context){
            if(this.lastGetActiveTerminalRequest){
                this.lastGetActiveTerminalRequest.abort()
            }

            this.lastGetActiveTerminalRequest = cloud.Ajax.request({
                url:"api/stat/wifi_terminal/active/weekly",
                parameters:{
                    start_time:date.startTime,
                    end_time:date.endTime
                },
                type : "get",
                success:function(data){
                    this.lastGetActiveTerminalRequest = null;

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
            this.lastGetonlineTerminalRequest && this.lastGetonlineTerminalRequest.abort();
            this.lastGetNewTerminalRequest && this.lastGetNewTerminalRequest.abort();
            this.lastGetTotalTerminalRequest && this.lastGetTotalTerminalRequest.abort();
            this.lastGetActiveTerminalRequest && this.lastGetActiveTerminalRequest.abort();
            this.lastGetUserStayRequest && this.lastGetUserStayRequest.abort();
        }






    })

    return  new Service();
})