/**
 * Created by kkzhou on 14-10-21.
 */
/**
 * Created by zhouyunkui on 14-6-11.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Table=require("cloud/components/table");
    var service=require("../service");
    var Paging = require("cloud/components/paging");
    var layout = require("cloud/lib/plugin/jquery.layout");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    var unitConversion = function(opt,type){
        if(type === "display"){
            if ( typeof opt === "number"){
                if(opt<1000){
                    return opt.toFixed(0)+"B";
                }else if(opt<1000000){
                    return (opt/1024).toFixed(3)+"KB";
                }else{
                    return (opt/1024/1024).toFixed(3)+"MB";
                }
            }else{
                return opt;
            }
        }else{
            return opt;
        }
    };
    var dateFormat=function(date,format){
        // temporary convert date. exclude it after api fixed the issue.
        date = new Date(date.getTime());
        var o = {
            "M+" : date.getMonth() + 1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth() + 3) / 3),
            "S" : date.getMilliseconds()
        };
        if (/(y+)/.test(format)){
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for ( var k in o){
            if (new RegExp("(" + k + ")").test(format)){
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    var timeConvert=function(time){
        var str="";
        var totalTime=parseInt(time/1000);
        if(totalTime==0){
            return 0;
        }else{
            var seconds=totalTime%60;
            totalTime=parseInt(totalTime/60);
            if(totalTime==0){
                return str=seconds+locale.get("_seconds")+str;
            }else{
                if(seconds==0){
                }
                else{
                    str=seconds+locale.get("_seconds")+str;
                }
                var minutes=totalTime%60;
                totalTime=parseInt(totalTime/60);
                if(totalTime==0){
                    return str=minutes+locale.get("minutes")+str;
                }else{
                    if(minutes==0){
                    }else{
                        str=minutes+locale.get("minutes")+str;
                    }
                    var hours=totalTime%24;
                    totalTime=parseInt(totalTime/24);
                    if(totalTime==0){
                        return str=hours+locale.get("_hours")+str;
                    }else{
                        if(hours==0){
                            return str=totalTime+"d"+str;
                        }else{
                            return str=totalTime+locale.get("_days")+hours+locale.get("_hours")+str;
                        }
                    }
                }
            }
        }

        var minutes=totalTime%60;
        totalTime=parseInt(totalTime/60);
        var hours=totalTime%24;
        totalTime=parseInt(totalTime/24);

    };
    var mergeData=function(data){
        var newuser=[];
        var unfollow=[];
        var total=[];
        data.each(function(one){
            switch (one.type){
                case 101:
                    newuser.push(one.values);
                    break;
                case 102:
                    unfollow.push(one.values);
                    break;
                case 103:
                    total.push(one.values);
                    break;
                default :
                    break;
            }
        });
        var zeroNewuser,zeroUnfollow,zeroTotal;
        var flag="";
        if(newuser.length==0){
            flag+=1;
        }
        if(unfollow.length==0){
            flag+=2;
        }
        if(total.length==0){
            flag+=3;
        }
        switch (flag){
            case "1":
                newuser[0]=[];
                unfollow[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    newuser[0].push(tempArr);
                });
                break;
            case "2":
                unfollow[0]=[];
                newuser[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    unfollow[0].push(tempArr);
                })
                break;
            case "3":
                total[0]=[];
                newuser[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    total[0].push(tempArr);
                })
                break;
            case "12":
                newuser[0]=[];
                unfollow[0]=[];
                total[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    unfollow[0].push(tempArr);
                    newuser[0].push(tempArr);
                })
                break;
            case "13":
                newuser[0]=[];
                total[0]=[];
                unfollow[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    total[0].push(tempArr);
                    newuser[0].push(tempArr);
                })
                break;
            case "23":
                total[0]=[];
                unfollow[0]=[];
                newuser[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    unfollow[0].push(tempArr);
                    total[0].push(tempArr);
                })
                break;
            case "123":
                newuser[0]=[];
                unfollow[0]=[];
                total[0]=[];
                break;
            default :
                break;
        }
        if(unfollow.length==0){
            unfollow[0]=[];
            if(newuser.length!=0){
                newuser[0].each(function(one){
                    var tempArr=[];
                    tempArr.push(one[0]);
                    tempArr.push("-");
                    unfollow[0].push(tempArr);
                })
            }
        }
        if(newuser.length==0){
            newuser[0]=[];
            if(unfollow.length!=0){

            }else{
                unfollow[0]=[];
            }
        }
        if(total.length==0){

        }
        var preHalfArr=[];
        newuser[0].each(function(one){
            unfollow[0].each(function(two){
                if(two[0]==one[0]){
                    var temp=[];
                    temp[0]=two[0];
                    temp[1]=one[1];
                    temp[2]=two[1];
                    preHalfArr.push(temp);
                }
            });
        });
        preHalfArr.each(function(one){
            newuser[0].each(function(two){
                if(one[0]==two[0]){
                    newuser[0]=newuser[0].without(two);
                }
            });
            unfollow[0].each(function(two){
                if(one[0]==two[0]){
                    unfollow[0]=unfollow[0].without(two);
                }
            });
        });
        newuser[0].each(function(one){
            one[2]="-";
        });
        unfollow[0].each(function(one){
            one[2]=one[1];
            one[1]="-";
        });
        var tempArr=newuser[0].concat(unfollow[0]);
        preHalfArr=preHalfArr.concat(tempArr);
        var subffixArr=[];
        preHalfArr.each(function(one){
            total[0].each(function(two){
                if(one[0]==two[0]){
                    one[3]=two[1];
                    subffixArr.push(one);
                }
            })
        });
        subffixArr.each(function(one){
            preHalfArr.each(function(two){
                if(one[0]==two[0]){
                    preHalfArr=preHalfArr.without(two);
                }
            });
            total[0].each(function(two){
                if(one[0]==two[0]){
                    total[0]=total[0].without(two);
                }
            })
        });
        preHalfArr.each(function(one){
            one[3]="-";
        });
        total[0].each(function(one){
            one[3]=one[1];
            one[1]="-";
            one[2]="-";
        });
        var finalArr=subffixArr.concat(preHalfArr.concat(total[0]));
        return finalArr;
    };
    var columns=[ {
        "title": "时间",
        "lang":"{text:time}",
        "dataIndex": "time",
        "cls": null,
        "width": "20%",
        render: function (value, type) {
            if(type === "display"){
                return dateFormat(new Date(value),"yyyy-MM-dd");
            }else{
                return value;
            }
        }
    },
        {
            "title":"新增关注人数",
            "lang":"{text:new_number}",
            "dataIndex":"new",
            "width":"20%"
        }, {
            "title": "取消关注人数",
            "lang":"{text:unfollow}",
            "dataIndex": "unfollow",
            "cls": null,
            "width": "20%"
        },
        {
            "title": "净增关注人数",
            "lang":"{text:net_increase}",
            "dataIndex": "net",
            "cls": null,
            "width": "20%"
        },
        {
            "title":"累计关注人数",
            "lang":"{text:cumulative_number}",
            "dataIndex":"all",
            "cls":null,
            "width":"20%"
        }
        ];
    var UserAnalysis=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.data=options.data;
            this.pageDisplay = 30;
            this.cursor=0;
            this.render();
            locale.render();
        },
        render:function(){
            var self=this;
            self._renderTableLayout();
        },
        _renderTableLayout:function(){
            var self=this;
            self.layoutTable=$("#user_table").layout({
                defaults : {
                    paneClass: "pane",
                    "togglerLength_open": 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 0,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north:{
                    paneSelector:"#content-toolbar",
                    size:58
                },
                center : {
                    paneSelector : "#content-table"
                },
                south : {
                    paneSelector : "#content-paging",
                    initClosed : false,
                    size : 58
                }
            });
            self._renderTable();
        },
        _renderTable:function(){
            var self=this;
            self.table=new Table({
                selector: $("#content-table"),
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox:"none"
            });
            this._renderToolbar();
//            this._renderPagingBar();
            this.setTableData();
        },
        _renderToolbar:function(){
            var self=this;
            $("#content-toolbar").find("#site_title strong").text(self.data.name).attr("title",self.data.name).end()
                .find("#start_time").val(dateFormat(new Date(self.data.start_time),"yyyy-MM-dd")).datetimepicker({
                format:'Y-m-d',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
            }).end()
                .find("#end_time").val(dateFormat(new Date(self.data.end_time),"yyyy-MM-dd")).datetimepicker({
                    format:'Y-m-d',
                    step:1,
                    lang:locale.current() === 1 ? "en" : "ch"
                }).end()
                .find("a.btn-primary").bind("click",function(e){
                    //TODO
                    var start_time=$("#start_time").val();
                    start_time=(new Date(start_time).getTime());
                    var end_time=$("#end_time").val();
                    end_time=(new Date(end_time).getTime());
                    if(start_time>end_time){
                        dialog.render({lang:"start_date_cannot_be_greater_than_end_date"})
                    }else{
                        self.data.start_time=start_time;
                        self.data.end_time=end_time;
                        service.getHotSpotWechatUser(self.data,function(data){
                            var arr=mergeData(data.result);
                            var tempArr=[];
                            arr.each(function(one){
                                var tempObj={};
                                tempObj.time=one[0];
                                tempObj.new=one[1];
                                tempObj.unfollow=one[2];
                                var num=one[1]-one[2];
                                if(isNaN(num)){
                                    tempObj.net="-";
                                }else{
                                    if(num<0){
                                        tempObj.net=0;
                                    }else{
                                        tempObj.net=num;
                                    }
                                }
                                tempObj.all=one[3];
                                tempArr.push(tempObj);
                            });
                            self.currentUserData={};
                            var data={};
                            data.total=tempArr.length;
                            data.cursor=self.cursor;
                            data.limit=self.pageDisplay;
                            var start=self.cursor*self.pageDisplay;
                            var end=start+self.pageDisplay;
                            data.result=tempArr.slice(start,end);
                            self.currentUserData.total=tempArr.length;
                            self.currentUserData.result=tempArr;
                            self._renderPagin(data);
                        },self);
                    }
                }).end()
                .show();
           ;

        },
        _renderPagin:function(data){
            var self = this;
            this.paging = null;
            $("#user_table").find("#content-paging").empty();
            this.paging = new Paging({
                selector:"#content-paging",
                data:data,
                current:1,
                total:data.total,
                limit:this.pageDisplay,
                requestData:function(options,success){
                    var start=self.cursor*self.pageDisplay;
                    var end=start+self.pageDisplay;
                    var returnData={};
                    returnData.result=self.currentUserData.result.slice(start,end);
                    returnData.total=self.currentUserData.result.length;
                    returnData.cursor=self.cursor;
                    returnData.limit=self.pageDisplay;
                    success(returnData);
                },
                turn:function(returnData,nowpage){
                    var obj = returnData.result;
                    obj.total = returnData.total;
                    self.cursor=parseInt(nowpage-1);
                    self.table.clearTableData();
                    self.table.render(obj);
                },
                events : {
                    "displayChanged" : function(display){
                        self.pageDisplay = parseInt(display);
                    }
                }
            });
        },
        setTableData:function(){
            var self=this;
            service.getHotSpotWechatUser(self.data,function(data){
                var arr=mergeData(data.result);
                var tempArr=[];
                arr.each(function(one){
                    var tempObj={};
                    tempObj.time=one[0];
                    tempObj.new=one[1];
                    tempObj.unfollow=one[2];
                    var num=one[1]-one[2];
                    if(isNaN(num)){
                        tempObj.net="-";
                    }else{
                        if(num<0){
                            tempObj.net=0;
                        }else{
                            tempObj.net=num;
                        }
                    }
                    tempObj.all=one[3];
                    tempArr.push(tempObj);
                });
                self.currentUserData={};
                var data={};
                data.total=tempArr.length;
                data.cursor=self.cursor;
                data.limit=self.pageDisplay;
                var start=self.cursor*self.pageDisplay;
                var end=start+self.pageDisplay;
                data.result=tempArr.slice(start,end);
                self.currentUserData.total=tempArr.length;
                self.currentUserData.result=tempArr;
                self._renderPagin(data);
            }, self);
        },
        destroy:function(){
            var self=this;
//            $("#user_table").find("*").unbind();
            $("#user_table").find("#content-table").empty().end()
                .find("#content-paging").empty();
        }
    });
    return UserAnalysis;
})