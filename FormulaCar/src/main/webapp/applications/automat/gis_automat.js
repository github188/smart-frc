/**
 * Created by zhangyl on 14-6-4.
 */
define(function(require) {
    // var maps = require("cloud/components/map");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var TagOverview = require("../components/tag-overview");
    var service = require("./service");
    var Table = require("./content/table");
    var html = require("text!./gis.html");
    require("./gis.css");
    require("cloud/lib/plugin/jquery.qtip");
    var locale = require("cloud/base/locale"); 
    var GisMap = require("../site/mysite/gis-map");
    var columns = [
        {
            "title": "状态",
            "dataIndex": "online",
            "lang":"{text:state}",
            "cls": null,
            "width": "20%",
            render:function(data, type, row){
                var display = "";
                if ("display" == type) {
                    switch (data) {
                        case 1:
                        	var offlineStr = locale.get({lang:"offline"});
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : offlineStr
                                });
                            break;
                        case 0:
                        	var onlineStr = locale.get({lang:"online"});
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : onlineStr
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
            "title": "点位名称",
            "dataIndex": "name",
            "width": "83%",
            "lang":"{text:automat_site_name}"
        }];
    var AutomatGis = Class.create(cloud.Component, {
        initialize : function($super, options) {
            var self = this;
            this.service = service;
            this.moduleName = "automat-gis";
            $super(options);
            this.element.html(html);
            this.initLayout();
            this.initMap();
            this.initTable();
            locale.render({
                element : this.element
            });
        },

        initMap : function(){
            this.gisMap = new GisMap({
                selector : this.element.find(".automat-gis-map"),
                events : {
                    /*"afterCreated" : function(id, data){
                        this.automatList.addResource(id);
                        this.reloadTags(true);
                    },
                    "afterUpdated" : function(id, data){
                        this.automatList.updateRowByData(data);
                        this.reloadTags(true);
                    },
                    "afterDeleted" : function(res){
                        this.reloadTags();
                    },
                    scope : this*/
                }
            })
        },

        initLayout: function(){
            var self = this;
            this.layout = $(".automat-gis").layout({
                defaults: {
                    //paneClass: "pane",
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
                    paneSelector: ".automat-gis-list",
                    size: 350
                },
                center: {
                    paneSelector: ".automat-gis-map",
                    onresize_end : function(){
                        self.gisMap.resize();
                    }
                }

            });
            $(".automat-gis-list").css({"background-color":"white"});
        },
        initTable : function() {
            var self = this;
			this.content = new Table({
				selector: $(".automat-gis-list"),
				columns:columns,
				service:service,
				gismap:self.gisMap,
				events:{
					"click":function(data){
					},
					"onLoad":function(data){
						//self.gisMap.deleteMarkers();
                  	    //self.gisMap.addMarkers(data);
					},
					"openPop":function(data){
						self.gisMap.jumpToSite(data._id);
					}
				}
			});
//            this.timer = setInterval(function(){
//            	 self.refreshAutomatList(($(".paging-page-current").val()-1)*$(".paging-limit-select").val(),$(".paging-limit-select").val());
//            },60*1000);
        },
        refreshAutomatList:function(start,limit){
            var self = this;
            var name = $(".gis-toolbar-search input").val();
            this.service.getSiteByPageAndParams(name,limit,start,function(data){
            	var tabDate = self.content.table.getAllData();
                data.result.each(function(oneData){
                    tabDate.find(function(oneTab){
                        if(oneTab._id == oneData._id){
                            var res = self.compare(oneTab,oneData);
                            if(!res){
                                var row = self.automatList.content.getRowById(oneData._id);
                                self.automatList.content.update(oneData,row);

                            }
                            return true;
                        }
                    })
                })
            }, self); 
        },
        destroy : function($super) {
            this.timer && clearInterval(this.timer);
            $super();
        }
    });

    return AutomatGis;
});