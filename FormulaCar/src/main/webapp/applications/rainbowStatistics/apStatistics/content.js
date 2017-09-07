/**
 * Created by zhang on 14-8-25.
 */
define(function(require){
    var Masonry = require("../../../lib/masonry.pkgd.js");
    var Button = require("cloud/components/button");
    var ContentTable = require("../../components/content-table");
    var TagOverview = require("../../components/tag-overview");

    var onlineUser = require("./onlineUser");
    var onlineTerminal = require("./onlineTerminal");
    var totalUser = require("./totalUser");
    var activeUser = require("./activeUser");
    var activeTerminal = require("./activeTerminal");
    var totalTerminal = require("./totalTerminal");
    var userStay =require("./userStay");
    var terminalStay =require("./terminalStay");
    var userInterval =require("./userInterval");
    var registUser = require("./registUser");
    var newTerminal = require("./newTerminal");
    var Service = require("./service");
    require("cloud/lib/plugin/jquery.qtip");

    require("./content.css");

    var AllSite = "0000000000000";

    var Map = $H({
        userStay:[1,2,3],
        userInterval:[11,12,13,14],
        terminalStay:[31,32,33],
        onlineUser:40,
        onlineTerminal:41,
        totalUser:50,
        totalTerminal:51,
        newUser:70,
        newTerminal:71,
        weeklyActiveUser:80,
        weeklyActiveTerminal:81
    });

    var columns = [
        {
            "title": "状态",
            "dataIndex": "online",
            "lang":"{text:state}",
            "cls": null,
            "width": "17%",
            render:function(data, type, row){
                var display = "";
                if ("display" == type) {
                    switch (data) {
                        case 1:
                            var onlineStr = locale.get({lang:"online"});
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : onlineStr
                                });
                            break;
                        case 0:
                            var offlineStr = locale.get({lang:"offline"});
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : offlineStr
                                });
                            break;

                        default:
                            break;
                    }
                    return display;
                } else {
                    return data;
                }
            }
        } , {
            "title": "热点名称",
            "dataIndex": "name",
            "width": "83%",
            "lang":"{text:site_name}"
        }];

    var Content = Class.create(cloud.Component,{
        initialize:function($super,options){
            this.moduleName = "ApSta";
            $super(options);

            this.service = Service;
            this._render();

            locale.render({
                element : this.element
            });

        },

        _render:function(){
            var self = this;
            this.element.addClass("ApStaContent");
            this.left = $("<div class='Apstaleft'></div>").appendTo(this.element);
            this.leftSide = $("<div class='ApSta-left'></div>").appendTo(this.left).height(this.element.height());
            this.container = $("<div class='ApSta-container'></div>").appendTo(this.element);
            this.leftbar = $("<div class='ApSta-bar'><img src='rainbowStatistics/PVUV_Statistics/img/br_next.png'></div>").appendTo(this.left);

            this.leftSide.hover(function(){
                self._animate(true);
            },function(){
                self._animate(false);
            });

            this.leftbar.hover(function(){
                self._animate(true);
            });

            this._renderList();
            this._renderToolbar();
        },
        _animate:function(flag){
            var self = this;
            if(flag == "left" || flag == false){
                setTimeout(function(){
                    self.leftSide.stop().animate({
                        left:"-300px"
                    },300,"swing");
                    self.leftbar.stop().animate({
                        left:"0px",
                        opacity:"1"
                    },300,"swing");
                },200);
            }

            if(flag == "right" || flag == true){
                self.leftSide.stop().animate({
                    left : "0px"
                },300,"swing");
                self.leftbar.stop().animate({
                    left:"300px",
                    opacity:"0"
                },300,"swing");
            }
        },

        _renderList:function(){
            var self = this;
            this.siteList = new ContentTable({
                selector: this.leftSide,
                toolbarFeatrues : false,
                rowSelectModel : "none",
                service: this.service,
                contentColumns: columns,
                events : {
                    click:function(id,data){
                        self._renderDialog(id,data.name);
                        self._animate(false);
                    }

                }
            });

            this._renderDialog(AllSite,locale.get("all_site"));
            setTimeout(function(){
                self.leftSide.stop().animate({
                    left:'-300px'
                },500,"swing");
                self.leftbar.stop().animate({
                    left:"0px",
                    opacity:"1"
                },500,"swing");
            },1500);
        },
        _renderToolbar:function(){
            /* toolbar start */
            var self = this;
            var toolbar = this.siteList.getToolbar();
            var tagBtn = new Button({
                imgCls: "cloud-icon-label",
                lang:"{title:tag}",
                id: this.moduleName + "-tag-button"
            });

            var tagLabel = $("<span>").addClass("ApSta-sitelist-tb-item").text(locale.get("tag+:"));
            this.tagName = $("<span>").addClass("ApSta-sitelist-tb-item").text("");

            toolbar.appendLeftItems([tagBtn, tagLabel, this.tagName]);

            var tagContent = $("<div id='ApSta-tag-overview'>")//.appendTo(this.element);

            tagContent.hover(function(){
                self._animate(true);
            });

            this.createTagOverview(tagBtn, tagContent);

            this._renderSearchBar(toolbar);
        },

        _renderSearchBar:function(toolbar){
            var self = this;
            var rightContainer = $("<div class='ApSta-toolbar-search'></div>");

            var pattern=/^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/i;

            var display = this.siteList.display;

            var refreshPage=function(data,value){
                self.value = value;
                var contentTable=self.siteList;
                contentTable.page.reset(data);
                contentTable.nowPage = 1;
//					contentTable._renderPaging(Math.ceil(total/display),1,display);
                self.service.getResourcesIds=function(start, limit, callback, context) {
                    cloud.Ajax.request({
                        url : "api/sites",
                        type : "get",
                        parameters:{
                            name:value,
                            cursor:start,
                            limit:limit,
                            verbose:1
                        },
                        success : function(data) {
                            data.result = data.result.pluck("_id");
                            callback.call(context || this, data);
                        }
                    });
                };
            };

            var searchContent = $("<input type='text'>").width(120).appendTo(rightContainer)
                .bind("keyup",function(e){
                    if(e.keyCode == 13){
                        var value = $(this).val().replace(/\s/g,"").match(pattern);
                        self.service.getSitelistByName(value,0,display,function(data){
                            self.siteList.content.render(data.result);
                            refreshPage(data,value);
                        });
                    }
                });

            var searchBtn = new Button({
                container:rightContainer,
//                imgCls: "cloud-icon-label",
//                lang:"{title:tag}",
                text : locale.get("query"),
                events:{
                    click:function(){
                        var value = searchContent.val().replace(/\s/g,"").match(pattern);
                        self.service.getSitelistByName(value,0,display,function(data){
                            self.siteList.content.render(data.result);
                            refreshPage(data,value);
                        });
                    }
                }
            });
            searchBtn.element.css("margin","0 0 5px 5px");

            toolbar.leftDiv.after(rightContainer);
            toolbar.rightDiv.remove();

            this.SearchBar = rightContainer;
        },
        togglerSearchBar:function(show){
            if(show){
                this.SearchBar.show();
            }else{
                this.SearchBar.hide();
            }
        },


        createTagOverview: function(btn, tagContent) {
            this.tagOverview = new TagOverview({
                events: {
                    "click": function(tag,tagobj){
                        var self = this;
                        self.togglerSearchBar(tag._id == 1);
                        this.mask();
                        this.tagName.text(tagobj.name);
                        this.tagId = tagobj._id;
                        //get the resources ids in the tag, then use content module to render these resources.
                        this.service.getResourcesIds = tag.loadResourcesData;
                        this.siteList.render(this.service,tag,function(){
                            self.unmask();
//                            var data = self.siteList.getContentData();
                        });
                    },
                    "update":function(tag){
                        if(tag._id == this.tagId){
                            this.tagName.text(tag.name);
                        }
                    },
                    scope: this
                },
                service: this.service,
                selector: tagContent
            });

            //bind a qtip window on the tag bubbon, to show tag overview component.
            btn.element.qtip({
                content: {
                    text: tagContent
                },
                position: {
                    my: "top left",
                    at: "bottom middle"
                },
                show: {
                    event: "click"
                },
                events: {
                    render: function() {
                        //before render, set the tag overview component's position to the visiable window.
                        tagContent.css({
                            marginLeft: 0
                        });
                    }
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow cloud-qtip qtip-rounded",
                    def: false
                }
            });
        },

        reloadTags : function(notRefreshContent){
            this.tagOverview.loadTags(notRefreshContent);
        },

        _renderDialog:function(siteId,siteName){
            this.clearContainer();
            this.siteName = $("<div class='Sta-name'>"+siteName+"</div>").appendTo(this.container);
            this.dashcontainer = $("<div class='Stat-container unselectable'></div>").appendTo(this.container);
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                navigator:{
                    enabled:false
                },
                rangeSelector:{
                    enabled:false
                },
                scrollbar:{
                    enabled:false
                },
                credits:{
                    enabled:false
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
                    startOfWeek:0,
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

            //line one
            this.totalUser = new totalUser({
                container : self.dashcontainer,
                siteId : siteId
            });

            this.activeUser = new activeUser({
                container : self.dashcontainer,
                siteId : siteId
            });


            this.userStay = new userStay({
                container : self.dashcontainer,
                siteId : siteId
            });

            this.userInterval = new userInterval({
                container : self.dashcontainer,
                siteId : siteId
            });



            //line 2
            this.onlineUser = new onlineUser({
                container : self.dashcontainer,
                siteId : siteId
            });

            this.registUser = new registUser({
                container : self.dashcontainer,
                siteId : siteId
            });

            //line 3
            this.totalTerminal = new totalTerminal({
                container : self.dashcontainer,
                siteId : siteId
            });

            this.activeTerminal = new activeTerminal({
                container : self.dashcontainer,
                siteId : siteId
            });

            this.terminalStay = new terminalStay({
                container : self.dashcontainer,
                siteId : siteId
            });
            //line 4
            this.onlineTerminal = new onlineTerminal({
                container : self.dashcontainer,
                siteId : siteId
            });

            this.newTerminal = new newTerminal({
                container : self.dashcontainer,
                siteId : siteId
            });








            /*require(['jquery-bridget/jquery.bridget'],function(){
                $.bridget('masonry',Masonry)
                self.dashcontainer.masonry({
//                    isFitWidth:true,
                    itemSelector:".weight",
                    columnWidth:1
//                    gutter:12
                });
            })*/

        },


        clearContainer:function(){
            this.totalUser && this.totalUser.destroy();
            this.totalTerminal && this.totalTerminal.destroy();
            this.userStay && this.userStay.destroy();
            this.userInterval && this.userInterval.destroy();
            this.onlineUser && this.onlineUser.destroy();
            this.registUser && this.registUser.destroy();
            this.onlineTerminal && this.onlineTerminal.destroy();
            this.newTerminal && this.newTerminal.destroy();

            this.container && this.container.empty();
        },

        destroy:function($super){
            this.totalUser && this.totalUser.destroy();
            this.totalTerminal && this.totalTerminal.destroy();
            this.userStay && this.userStay.destroy();
            this.userInterval && this.userInterval.destroy();
            this.onlineUser && this.onlineUser.destroy();
            this.registUser && this.registUser.destroy();
            this.onlineTerminal && this.onlineTerminal.destroy();
            this.newTerminal && this.newTerminal.destroy();

            $super()
        }
    });

    return Content;
});