/**
 * Created by inhand on 14-6-24.
 */

define(function(require){
    require("cloud/base/cloud");
    var Service = Class.create({
        initialize : function(){

        },

        getResourcesByType:function(obj, callback , context){
            var self = this;
            if(this.lastGetResByTidRequest){
                this.lastGetResByTidRequest.abort()
            }
            var param = {
                tid: obj.id
            };
            if(obj.order){
                var sort,direction;
                switch (obj.order){
                    case "1":
                        sort = "total.pv";
                        direction = 0;
                        break;
                    case "2":
                        sort = "total.pv";
                        direction = 1;
                        break;
                    case "3":
                        sort = "total.uv";
                        direction = 0;
                        break;
                    case "4":
                        sort = "total.uv";
                        direction = 1;
                        break;
                }

                param.sort = sort;
                param.direction = direction;
            }
            if(obj.name){
                param.name = obj.name;
            }
            if(obj.siteId){
                param.site_id = obj.siteId
            }

            this.lastGetResByTidRequest = cloud.Ajax.request({
                url:"api/pvuv/resources",
                parameters:param,
                type : "get",
                success:function(data){
                    this.lastGetResByTidRequest = null;

                    var result = data.result;
                    var datas = [];
                    result.each(function(one){
                        if(!one.rName){
                            one.rName = one.rId;
                        }
                        datas.push(self.procData(one));
                    });

                    callback.call(context || this, datas);
                }
            });

        },

        getTypes:function(siteId,callback, context){
            var self = this;
            if(this.lastGetTypesRequest){
                this.lastGetTypesRequest.abort()
            }
            if(siteId){
                var param = {
                    site_id:siteId
                }
            }


            this.lastGetTypesRequest = cloud.Ajax.request({
                url:"api/pvuv/types",
                type : "get",
                parameters:param,
                success:function(data){
                    this.lastGetTypesRequest = null;

                    var result = data.result;
                    var datas = []
                    result.each(function(one){
                        if(!one.tName){
                            one.tName = one.tId;
                        }
                        datas.push(self.procData(one))
                    });

                    callback.call(context || this, datas);
                }
            });
        },

        getResStat:function(obj,callback,context){
            var self = this;
            if(this.lastGetResStatRequest){
                this.lastGetResStatRequest.abort()
            }
            var endTime = new Date().getTime();
            var startTime = endTime - 3*30*86400*1000

            if(!obj.tid){
                var param = {
                    tid:obj.id,
                    rid:0,
                    start_time:startTime,
                    end_time:endTime
                }
            }else{
                var param = {
                    tid:obj.tid,
                    rid:obj.id,
                    start_time:startTime,
                    end_time:endTime
                }

            }
            if(obj.siteId){
                param.site_id = obj.siteId;
            }

            this.lastGetResStatRequest = cloud.Ajax.request({
                url:"api/pvuv/resource/stat",
                type : "get",
                parameters:param,
                success:function(data){
                    this.lastGetResStatRequest = null;

                    callback.call(context || this, data);
                }
            });


        },

        updateResName:function(obj,callback,context){
            if(this.lastUpdateResRequest){
                this.lastUpdateResRequest.abort()
            }

            var param = {
                tid:obj.tid,
                rid:obj.rid
            };
            if(obj.siteId){
                param.site_id = obj.siteId;
            };

            this.lastUpdateResRequest = cloud.Ajax.request({
                url:"api/pvuv/resource",
                type : "POST",
                parameters:param,
                data:{
                    name:obj.name
                },
                success:function(data){
                    this.lastUpdateResRequest = null;

                    callback.call(context || this, data);
                }
            });
        },
        updateTypeName:function(obj,callback,context){
            if(this.lastUpdateTypeRequest){
                this.lastUpdateTypeRequest.abort()
            }
            
            var param = {
                tid:obj.tid
            };
            if(obj.siteId){
                param.site_id = obj.siteId;
            };


            this.lastUpdateTypeRequest = cloud.Ajax.request({
                url:"api/pvuv/type",
                type : "POST",
                parameters:param,
                data:{
                    name:obj.name
                },
                success:function(data){
                    this.lastUpdateTypeRequest = null;


                    callback.call(context || this, data);
                }
            });
        },

        /**
         *
         * @param data {
         *              tId:str
         *              rId:str
         *              tName:str
         *              rName:str
         *              updateTime: timestamp
         *              current:{
         *                  date: timestamp
         *                  pv:int
         *                  uv:int
         *               },
         *              last:{
         *              //like current
         *              },
         *              total:{
         *                  pv:int
         *                  uv:int
         *               }
         *           }
         */
        procData:function(data){
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var tdStamp = today.getTime();
            var ytdStamp = tdStamp - 86400000;
            var empty = "-"

            var res = {};
            if(data.rId && data.rName){
                res.name = data.rName;
                res.id = data.rId;
                res.tname = data.tName;
                res.tid = data.tId;
            }else{
                res.name = data.tName;
                res.id = data.tId;
            }
            //今天
            var current = {
                date:locale.get("today")
            }
            if(data.current && data.current.date >= tdStamp){
               current.pv = data.current.pv;
               current.terminaluv = data.current.uv;
               current.useruv = empty;
            }else{
                current.pv = empty;
                current.terminaluv = empty;
                current.useruv = empty;
            }
            //昨天
            var last = {
                date:locale.get("yesterday")
            }
            if(data.last && data.last.date >= ytdStamp && data.last.date < tdStamp ){
                last.pv = data.last.pv;
                last.terminaluv = data.last.uv;
                last.useruv = empty;
            }else{
                last.pv = empty;
                last.terminaluv = empty;
                last.useruv = empty;
            }
            //总计
            var total = {
                date:locale.get("total")
            }
            if(data.total){
                total.pv = data.total.pv;
                total.terminaluv = data.total.uv;
                total.useruv =empty;
            }else{
                total.pv = empty;
                total.terminaluv = empty;
                total.useruv =empty;
            }

            res.data = [current,last,total]

            return res;
        },





        abort:function(){
            this.lastGetTypesRequest.abort();
            this.lastGetResByTidRequest.abort();
            this.lastUpdateResRequest.abort();
            this.lastUpdateTypeRequest.abort();
            this.lastGetResStatRequest.abort();
        }






    })

    return  new Service();
})