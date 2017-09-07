define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../template/tableTemplate");
    var html = require("text!./tradeMenu.html");
    var tradeMg = require("./tradeDetail/list/list");
    var goodsStatistics = require("./statistics/goodsStatistics/goodsstatistics");
    var faultStatistics = require("./statistics/faultStatistics/statistics");
    var tradeStatistics = require("./statistics/tradeStatistics/tradeStatistics");
    var timeStatistics = require("./statistics/timeStatistics/statistics");
    var deviceStatistics = require("./statistics/deviceStatistics/statistics");
    var lineStatistics = require("./statistics/lineStatistics/statistics");
    var time_status_dayMg = require("../operation_manage/status/statistics/statistics");
    var statusMg = require("../template/menu");
    var onlineStat = require("../reports/online/report/content");
    var onlineChart = require("../reports/online/chart/content");
    var signalCurve = require("./statistics/signalStatistics/content");
    var loadSubNav = require("../loadSubNav");
    var settleMg = require("../operation_manage/settle/list");
    var nosettleMg = require("../operation_manage/settle/nolist");
    var trafficStatistics = require("./statistics/trafficStatistics/list")
    var trafficCure = require("./statistics/trafficStatistics/trafficChart/content")
    var tradeMenu = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = options.service;
            this.element.html(html);
            this.elements = {
                conent_el: "content-trade-menu"
            };
            this._render();

        },
        _render: function() {
            this.renderContent();

        },
        renderContent: function() {

//            var dl1 = {};
//            dl1.dt = "trade_about_statistics";
//            // dl1.dd=[["automat_trade_statistics",true],["automat_goods_statistics",true],["automat_fault_statistics",true],["automat_time_statistics",true],["automat_trade_statistics_all",true]];
//            // dl1.dd=[["automat_trade_statistics",true],["automat_fault_statistics",true],["automat_time_statistics",true]];
//            dl1.dd = [["automat_trade_count", true], ["statistics_selling_times",true],["statistics_selling_goods_top10",true],["statistics_selling_points_top10",true]];//["automat_trade_statistics", true] ,, ["automat_time_statistics", true]
//            
//            var dl2={};
//            dl2.dt = "device_about_statistics";
//            dl2.dd = [["online_statistics", true],["signal_statistics", true]];
//            
//            var dls = [];
//            dls.push(dl1);
//            dls.push(dl2);
        
        	var dls =loadSub('trade');
            var _self = this;
            this.left = new Table({
                selector: "#content-trade-menu",
                dl: dls,
                events: {
                    click: function(id) {
                        if (id == "automat_fault_statistics") {//故障统计
                            var proMan_Array = ["fault_statistics"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                        if (id == "fault_statistics") {
                                            if (this.fault_statistics) {
                                                this.fault_statistics.destroy();
                                            }
                                            this.fault_statistics = new faultStatistics({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#fault_statistics").click();
                        } else if (id == "automat_time_statistics") {//耗时统计
                            var proMan_Array = ["time_statistics"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                        if (id == "time_statistics") {
                                            if (this.time_statistics) {
                                                this.time_statistics.destroy();
                                            }
                                            this.time_statistics = new timeStatistics({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#time_statistics").click();
                        } else if (id == "automat_trade_count") {  //交易汇总
                            var status_Array = ["automat_day"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": status_Array,
                                "events": {
                                    click: function(id) {
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                        if (id == "automat_day") {//当天
                                            if (this.historyPage) {
                                                this.historyPage.destroy();
                                            }
                                            if (this.dayPage) {
                                                this.dayPage.destroy();
                                            }
                                            this.dayPage = new time_status_dayMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#automat_day").click();
                        } else if (id == "statistics_selling_times") {  //畅销时间示意图
                            var status_Array = ["selling_times"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": status_Array,
                                "events": {
                                    click: function(id) {
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                        if (id == "selling_times") {//当天
                                            if (this.trade_statistics) {
                                                this.trade_statistics.destroy();
                                            }
                                            this.trade_statistics = new tradeStatistics({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#selling_times").click();
                        } else if (id == "statistics_selling_goods_top10") {  //畅销商品top10
                            var status_Array = ["selling_goods_top10"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": status_Array,
                                "events": {
                                    click: function(id) {
                                    	 $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                        if (id == "selling_goods_top10") {// 
                                            if (this.goods_statistics) {
                                                this.goods_statistics.destroy();
                                            }
                                            this.goods_statistics = new goodsStatistics({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#selling_goods_top10").click();
                        } else if (id == "statistics_selling_points_top10") {  //畅销点位top10
                            var status_Array = ["selling_points_top10"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": status_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        
                                        $("#user-content").scrollTop(0);
                                        if (id == "selling_points_top10") {//
                                            if (this.device_statistics) {
                                                this.device_statistics.destroy();
                                            }
                                            this.device_statistics = new deviceStatistics({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#selling_points_top10").click();
                        }else if (id == "statistics_selling_lines_top10") {  //畅销线路
                            var lines_pay_Array = ["selling_lines_top10"];
                            
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": lines_pay_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        
                                        $("#user-content").scrollTop(0);
                                        if (id == "selling_lines_top10") {//
                                            if (this.line_statistics) {
                                                this.line_statistics.destroy();
                                            }
                                            this.line_statistics = new lineStatistics({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#selling_lines_top10").click();
                        } else if (id == "online_statistics") {//在线统计
                            var online_manager_array = ["online_statistics_reports", "online_statistics_curve"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": online_manager_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "online_statistics_reports") {//配置项
                                            if (this.onlineStatMgPage) {
                                                this.onlineStatMgPage.destroy();
                                            }
                                            this.onlineStatMgPage = new onlineStat({
                                                "container": ".main_bd"
                                            });
                                        }
                                        else if (id == "online_statistics_curve") {//配置项
                                            if (this.onlineChartMgPage) {
                                                this.onlineChartMgPage.destroy();
                                            }
                                            this.onlineChartMgPage = new onlineChart({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#online_statistics_reports").click();
                        }else if(id == "signal_statistics"){
                        	 var online_manager_array = ["signal_statistics_curve"];
                             if (this.proMg) {
                                 this.proMg.destroy();
                             }
                             this.proMg = new statusMg({
                                 "container": "#col_slide_main",
                                 "lis": online_manager_array,
                                 "events": {
                                     click: function(id) {
                                         $(".main_bd").empty();
                                         $("#user-content").scrollTop(0);
                                         if (id == "signal_statistics_curve") {
                                             if (this.signalStatMgPage) {
                                                 this.signalStatMgPage.destroy();
                                             }
                                             this.signalStatMgPage = new signalCurve({
                                                 "container": ".main_bd"
                                             });
                                         }
                                     }
                                 }
                             });
                             $("#signal_statistics_curve").click();
                        }else if (id == "settle_management") {//结算
                            var proMan_Array = ["settle_list"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "settle_list") {//列表
                                            if (this.settle_list) {
                                                this.settle_list.destroy();
                                            }
                                            this.settle_list = new settleMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#settle_list").click();

                        }else if (id == "not_settle_management") {//未结算
                        	
                            var proMan_Array = ["not_settle_list"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": proMan_Array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "not_settle_list") {//列表
                                            if (this.nosettle_list) {
                                                this.nosettle_list.destroy();
                                            }
                                            this.nosettle_list = new nosettleMg({
                                                "container": ".main_bd"
                                            });
                                        }
                                    }
                                }
                            });
                            $("#not_settle_list").click();

                        }else if(id == "traffic_statistics"){
                        	var traffic_array = ["traffic_statistics_list","traffic_statistics_cure"];
                            if (this.proMg) {
                                this.proMg.destroy();
                            }
                            this.proMg = new statusMg({
                                "container": "#col_slide_main",
                                "lis": traffic_array,
                                "events": {
                                    click: function(id) {
                                        $(".main_bd").empty();
                                        $("#user-content").scrollTop(0);
                                        if (id == "traffic_statistics_list") {
                                            if (this.trafficStatMgPage) {
                                                this.trafficStatMgPage.destroy();
                                            }
                                            this.trafficStatMgPage = new trafficStatistics({
                                                "container": ".main_bd"
                                            });
                                        }else if (id=="traffic_statistics_cure") {
                                        	  if (this.trafficCureMgPage) {
                                                  this.trafficCureMgPage.destroy();
                                              }
                                              this.trafficCureMgPage = new trafficCure({
                                                  "container": ".main_bd"
                                              });
										}
                                    }
                                }
                            });
                            $("#traffic_statistics_list").click();
                       }
 
 
                    }
                }
            });
        }

    });
    return tradeMenu;
});