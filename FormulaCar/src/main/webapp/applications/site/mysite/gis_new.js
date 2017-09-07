/**
 * Created by zhangyl on 14-6-4.
 */
define(function(require) {
    // var maps = require("cloud/components/map");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var TagOverview = require("../../components/tag-overview");
    var ContentTable = require("../../components/content-table");
    var service = require("./service");
    var html = require("text!./gis.html");
    // var InfoModule = require("./info");
    require("./gis.css");
    require("cloud/lib/plugin/jquery.qtip");
    var locale = require("cloud/base/locale");


//    require("cloud/lib/plugin/leaflet-src");
    var GisMap = require("./gis-map");
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
            "title": "现场名称",
            "dataIndex": "name",
            "width": "83%",
            "lang":"{text:site_name}"
        }];
    var SitesGis = Class.create(cloud.Component, {
        initialize : function($super, options) {
            var self = this;
            this.service = service;
            this.moduleName = "site-gis";
            $super(options);
            this.element.html(html);
            // this.element.addClass(this.moduleName);
            this.initLayout();

            this.initMap();
            this.initList();
            this._initToolbar();

            locale.render({
                element : this.element
            });
        },

        initMap : function(){
            this.gisMap = new GisMap({
                selector : this.element.find(".site-gis-map"),
                events : {
                    "afterCreated" : function(id, data){
                        this.siteList.addResource(id);
                        this.reloadTags(true);
                    },
                    "afterUpdated" : function(id, data){
                        this.siteList.updateRowByData(data);
                        this.reloadTags(true);
                    },
                    "afterDeleted" : function(res){
                        this.reloadTags();
                    },
                    scope : this
                }
            })
        },

        initLayout: function(){
            var self = this;
            this.layout = $(".site-gis").layout({
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
                    paneSelector: ".site-gis-list",
                    size: 350
                },
                center: {
                    paneSelector: ".site-gis-map",
                    onresize_end : function(){
                        self.gisMap.resize();
                    }
                }

            });
        },

        initList : function() {
            var self = this;
            this.siteList = new ContentTable({
                selector: this.element.find(".site-gis-list"),
                toolbarFeatrues : false,
                rowSelectModel : "none",
                service: this.service,
                contentColumns: columns,
                events : {
                    "afterSelect" : function(reses, row, isSelected){
//                        console.log(arguments, "afterSelect")
                    },
                    "checkAll" : function(res){
//                        console.log(res, "checkAll")
                    },
                    "onTurnPage" : function(page, data){
                        this.gisMap.deleteMarkers();
//                         self.gisMap.addMarkers(data.result ? data.result : data);
                    },
                    "afterRendered" : function(data){
                        this.gisMap.deleteMarkers();
                        this.gisMap.addMarkers(data);
//                        this.gisMap.openPopup();
                    },
                    "click" : function(id){
                        this.gisMap.jumpToSite(id);
                    },
                    "afterUpdate": function(data,row){
                        this.gisMap.updateMarkers(data);
                    },
                    scope : this
                }
            });

            //debug
//            window.siteList = this.siteList;

            this.timer = setInterval(function(){
                self.refreshSiteList()
            },60*1000);

        },

        refreshSiteList:function(){
            var self = this;
            var limit = this.siteList.display;
            var start = (this.siteList.nowPage-1)*limit;
            var name = this.value;
            this.service.getSitelistByName(name,start,limit,function(data){
//                self.siteList.content.render(data.result);
//                var resarr = [];
                var tabDate = self.siteList.content.getAllData();
                data.result.each(function(oneData){
                    tabDate.find(function(oneTab){
                        if(oneTab._id == oneData._id){
                            var res = self.compare(oneTab,oneData);
                            if(!res){
//                                resarr.push(oneData);
                                var row = self.siteList.content.getRowById(oneData._id);
                                self.siteList.content.update(oneData,row);

                            }
                            return true;
                        }
                    })
                })
            });

        },

        compare:function(obj,mir){
            var flag = true;
            if(obj.online != mir.online){
                flag = false
            }
            if(obj.name != mir.name){
                flag = false
            }
            if(obj.location.latitude != mir.location.latitude && obj.location.longitude != mir.location.longitude ){
                flag = false
            }
            return flag

        },

        _initToolbar : function(){
            /* toolbar start */
            var toolbar = this.siteList.getToolbar();
            var tagBtn = new Button({
                imgCls: "cloud-icon-label",
                lang:"{title:tag}",
                id: this.moduleName + "-tag-button"
            });

            var tagLabel = $("<span>").addClass("gis-sitelist-tb-item").text(locale.get("tag+:"));
            this.tagName = $("<span>").addClass("gis-sitelist-tb-item").text("");

            toolbar.appendLeftItems([tagBtn, tagLabel, this.tagName]);

            var tagContent = $("<div id='gis-tag-overview' style='height:0px;'>").appendTo(this.element);

            this.createTagOverview(tagBtn, tagContent);

            this._initSearchBar(toolbar);
        },

        _initSearchBar : function(toolbar){
            var self = this;
            var rightContainer = $("<div class='gis-toolbar-search'></div>");

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
//            toolbar.appendRightItems([searchContent, searchBtn]);
        },

        togglerSearchBar:function(show){
            if(show){
                this.SearchBar.show();
            }else{
                this.SearchBar.hide();
            }
        },


        createTagOverview: function(btn, tagContent) {
            var self = this;
            this.tagOverview = new TagOverview({
                events: {
                    "click": function(tag,tagobj){
                        var self = this;
                        self.togglerSearchBar(tag._id == 1);
                        this.mask();
                        this.tagName.text(tagobj.name);
                        this.tagId = tagobj._id;
                        this.gisMap.deleteMarkers();
                        //get the resources ids in the tag, then use content module to render these resources.
                        this.service.getResourcesIds = tag.loadResourcesData;
                        this.siteList.render(this.service,tag,function(){
                            self.unmask();
//                            var data = self.siteList.getContentData();
//                            self.gisMap.addMarkers(data);
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

        destroy : function($super) {
            this.timer && clearInterval(this.timer);
            $super();
        }
    });

    return SitesGis;
});