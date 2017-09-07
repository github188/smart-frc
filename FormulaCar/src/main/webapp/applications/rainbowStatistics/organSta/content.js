/**
 * Created by inhand on 14-6-10.
 */
define(function(require){
    var Masonry = require("../../../lib/masonry.pkgd.js");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var userCount = require("./userCount");
    var terminalCount = require("./terminalCount");
    var userActive = require("./userActive");
    var terminalActive = require("./terminalActive");
    var deviceCount = require("./deviceCount");
    var Service = require("./service");
    require("cloud/lib/plugin/highstock.src");
    require("cloud/lib/plugin/exporting.src")
    require("./content.css")

    var Content = Class.create(cloud.Component, {
        initialize : function($super,options){
            this.moduleName = "userStaContent";
//            require("cloud/lib/plugin/exporting.src")
            $super(options);

            this.service = Service;

            this._render();


        },

        _renderLayout:function(){
            this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 1,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),
                    resizable: false,
                    slidable: false
                },
                west: {
                    paneSelector: ".Sta-leftside",
                    size: 187
                },
                center: {
                    paneSelector: ".Sta-rightside"
                }
            });
        },

        _render : function(){
            this.element.addClass("userStaContent");
            this.leftSide = $("<div class='Sta-leftside'></div>").appendTo(this.element);
            this.rightSide = $("<div class='Sta-rightside'></div>").appendTo(this.element)
//            this.container = $("<div class='Sta-container'></div>").appendTo(this.rightSide);
            this._renderLayout();
            this._renderList();
            this._renderDialog("0000000000000000000ABCDE");
        },

        _renderList:function(){
            var self = this;
            var listBar = $("<div class='Sta-leftside-bar'></div>").appendTo(this.leftSide);
            var listContent = $("<div class='Sta-leftside-content'></div>").appendTo(this.leftSide);
            this._renderListBar(listBar);

            this.content = new Table({
                selector:listContent,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                columns:[{
                    "title" : "机构名称",
                    "lang" : "{text:organization_name}",
                    "dataIndex" : "name",
                    "cls" : null,
                    "width" : "100%"
                }],
                events:{
                    "onRowClick":function(data){
                        self._renderDialog(data._id);

                    }
                }
            });

            this.service.getOrgList(function(data){
                self.organList = data;
                data.reverse();
                self.content.render(data);
            })




        },

        _renderListBar:function($container){
            var self = this;
            this.searchInput = $("<input type='text' id='Sta-search-input'>").appendTo($container)
                .bind("keydown",function(e){
                if(e.keyCode == 13){
                    self._queryFun();
                }
            });
            this.searchBtn = new Button({
                container: $container,
                text:locale.get({lang:"query"}),
//                lang:"{title:search,text:search}",
                events:{
                    click:function(){
                        self._queryFun();
                    }
                }

            });
            this.searchBtn.element.addClass("Sta-search-btn")
        },

        _queryFun:function(){
            var inputVal = this.searchInput.val();
            var resArr = [];
            this.organList.each(function(one){
                if(one.name.indexOf(inputVal) > -1){
                    resArr.push(one);
                }
            });

            this.content.render(resArr);
        },

        _renderDialog:function(oid){
            this.clearContainer()
            this.container = $("<div class='Sta-container'></div>").appendTo(this.rightSide);

            /*Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                textKey: 'downloadPNG',
                                onclick: function () {
                                    this.exportChart();
                                }
                            }, {
                                textKey: 'downloadJPEG',
                                onclick: function () {
                                    this.exportChart({
                                        type: 'image/jpeg'
                                    });
                                }
                            }]
                        }
                    }
                }
            });*/
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
            
            var allOid = "ABCDE"

            if(oid == "0000000000000000000ABCDE"){
                oid = allOid;
            }
            this.deviceCount = new deviceCount({
                container: this.container,
                oid: oid || allOid
            });

            var self = this;

//            this.onlineCount = new online({
//                selector : this.container
//            })

            this.userCount = new userCount({
                container : this.container,
                oid: oid || allOid
            });

//
            this.activeUser = new userActive({
                container : this.container,
                oid:oid || allOid
            });

            this.terminalCount = new terminalCount({
                container : this.container,
                oid: oid || allOid
            });



            this.activeTerminal = new terminalActive({
                container : this.container,
                oid:oid || allOid
            });






            require(['jquery-bridget/jquery.bridget'],function(){
                $.bridget('masonry',Masonry)
                self.container.masonry({
                    isFitWidth:true,
                    columnWidth:90,
//                    gutter:10
                });
            })
        },

        clearContainer:function(){
            this.userCount && this.userCount.destroy();
            this.activeUser && this.activeUser.destroy();
            this.deviceCount && this.deviceCount.destroy();
            this.terminalCount && this.terminalCount.destroy();
            this.activeTerminal && this.activeTerminal.destroy();

            this.container && this.container.remove();
        },

        destroy : function($super){
            this.userCount && this.userCount.destroy();
            this.activeUser && this.activeUser.destroy();
            this.deviceCount && this.deviceCount.destroy();
            this.terminalCount && this.terminalCount.destroy();
            this.activeTerminal && this.activeTerminal.destroy();

            $super()
        }

    });

    return Content;
});