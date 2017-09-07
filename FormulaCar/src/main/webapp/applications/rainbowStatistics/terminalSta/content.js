/**
 * Created by inhand on 14-6-10.
 */
define(function(require){
    var Masonry = require("../../../lib/masonry.pkgd.js");
    var terminalCount = require("./terminalCount");
    var regist = require("./regist");
    var active = require("./active");
    var online = require("./online");
    var stay = require("./stay");
    require("./content.css");

    var Content = Class.create(cloud.Component, {
        initialize : function($super,options){
            this.moduleName = "terStaContent";
            $super(options);

            this._render();

        },

        _render : function(){
            this.element.addClass("terStaContent")
            this.container = $("<div class='Sta-container'></div>").appendTo(this.element);
            this._renderDialog();
        },

        _renderDialog:function(){

            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                textKey: "downloadPNG",
                                onclick: function () {
                                    this.exportChart();
                                }
                            }, {
                                textKey: "downloadJPEG",
                                onclick: function () {
                                    this.exportChart({
                                        type: 'image/jpeg'
                                    });
                                }
                            }]
                        }
                    }
                },
                xAxis:{
                    allowDecimals:false
                },
                yAxis:{
                    allowDecimals:false
                },
                plotOptions:{
                    series:{
                        dataGrouping:{
                            dateTimeLabelFormats:{
                                minute: locale.get("chart_minute"),
                                hour:locale.get("chart_hour"),
                                day: locale.get("chart_day"),
                                week: locale.get("chart_week"),
                                month: locale.get("chart_month"),
                                year:locale.get("chart_year")
                            }
                        }
                    }
                },
                lang:{
                    resetZoom:locale.get("reset"),
                    downloadJPEG: locale.get("downloadjpeg"),
                    downloadPNG: locale.get("downloadpng"),
                    rangeSelectorFrom: locale.get("start_time"),
                    rangeSelectorTo: locale.get("end_time"),
                    rangeSelectorZoom: "",
                    shortMonths : [
                        locale.get({lang:"jan"}) || "jan",
                        locale.get({lang:"feb"}) || "feb",
                        locale.get({lang:"mar"}) || "mar",
                        locale.get({lang:"apr"}) || "apr",
                        locale.get({lang:"may"}) || "may",
                        locale.get({lang:"jun"}) || "jun",
                        locale.get({lang:"jul"}) || "jul",
                        locale.get({lang:"aug"}) || "aug",
                        locale.get({lang:"sep"}) || "sep",
                        locale.get({lang:"oct"}) || "oct",
                        locale.get({lang:"nov"}) || "nov",
                        locale.get({lang:"dec"}) || "dec"
//                        "01", "02","03", "04","05", "06","07", "08","09", "10","11", "12"
                    ],
                    months :  [
                         locale.get({lang:"jan"}) || "jan",
                         locale.get({lang:"feb"}) || "feb",
                         locale.get({lang:"mar"}) || "mar",
                         locale.get({lang:"apr"}) || "apr",
                         locale.get({lang:"may"}) || "may",
                         locale.get({lang:"jun"}) || "jun",
                         locale.get({lang:"jul"}) || "jul",
                         locale.get({lang:"aug"}) || "aug",
                         locale.get({lang:"sep"}) || "sep",
                         locale.get({lang:"oct"}) || "oct",
                         locale.get({lang:"nov"}) || "nov",
                         locale.get({lang:"dec"}) || "dec"
//                        "1", "2","3", "4","5", "6","7", "8","9", "10","11", "12"
                    ],
                    weekdays:[
                        locale.get("sunday")||"Sunday",
                        locale.get("monday")||"Monday",
                        locale.get("tuesday")||"Tuesday",
                        locale.get("wenseday")||"Wenseday",
                        locale.get("thursday")||"Thursday",
                        locale.get("friday")||"Friday",
                        locale.get("saturday")||"Saturday"
                    ]
                }
            });

            var self = this;

            this.onlineCount = new online({
                selector : this.container
            })

             this.userCount = new terminalCount({
                selector : this.container
            })

            this.registCount = new regist({
                selector : this.container
            })

            this.activeUser = new active({
                selector : this.container
            });

            this.stayCount = new stay({
                selector : this.container
            });






            require(['jquery-bridget/jquery.bridget'],function(){
                $.bridget('masonry',Masonry)
                self.container.masonry({
//                    isFitWidth:true,
                    itemSelector:".weight",
                    columnWidth:1
//                    gutter:12
                });
            })
        },

        destroy : function($super){
            this.userCount.destroy();
            this.registCount.destroy();
            this.activeUser.destroy();
            this.stayCount.destroy();

            $super()
        }

    });

    return Content;
});