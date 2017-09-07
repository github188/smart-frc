/**
 * Created by zhang on 14-7-21.
 */
define(function(require){
    var ItemBox = require("cloud/components/itembox");
    var Button = require("cloud/components/button");
    var Info = require("./info");
    var Service = require("./service");

    var Package = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.service = Service;
            this._render()
        },

        _render:function(){
            this._renderHtml()
            this._renderLayout();
            this._renderItembox();
            this._renderToolbar();
            this._renderInfo();
        },

        _renderHtml:function(){
            var html = "<div class='cost-package-center'>" +
                "<div class='cost-package-toolbar'></div>" +
                "<div class='cost-package-content'></div>" +
                "</div>" +
                "<div class='cost-package-info'></div>";
            this.element.html(html);
        },

        _renderLayout:function(){
            this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 1,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),
                    resizable: false,
                    slidable: false
                },
                center: {
                    paneSelector: ".cost-package-center"
                },
                east: {
                    paneSelector: ".cost-package-info",
                    initClosed: true,
                    size: 308
                }
            });

            this.layout.hide("east");

            this.layoutBar = this.element.find(".cost-package-center").layout({
                defaults: {
                    paneClass: "pane",
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 1,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: ".cost-package-toolbar",
                    size: 32
                },
                center: {
                    paneSelector: ".cost-package-content"
                }
            })
        },
        /**
         * 转换MB GB
         * @param num
         * @returns {{flow: *, unit: string, type: number}}
         */
        unitProc:function(num){
            var unit = "M";
            var type = 1;
            var flow;
            if(num > 1024){
                type = 2;
                flow = num / 1024;
                unit = "G"
            }else{
                flow = num;
            }
            return {
                flow:flow,
                unit:unit,
                type:type
            }
        },

        _renderItembox:function(){
            var self = this;
            this.itembox = new ItemBox({
                selector : $(".cost-package-content"),
                events : {
                    click:function(data){
                        self.info.editable(false);
                        self.info.setInfo(data.options);
                        self.layout.open("east");
                    }
                }
            });

            this.renderData();
            /*this.service.getPackages(function(data){
                console.log(data);
                data.result.each(function(one){
                    var obj = self.unitProc(one.flow);
                    one.description = one.basicprice + "￥=" + obj.flow +obj.unit+"</br>" +
                        "超额流量"+one.overprice+"￥/"+obj.unit;
                    one.favor = one.isdefault == 1 ? true : false ;
                });
                self.itembox.render(data.result);
            });*/
            /*this.itembox.render([
                {
                    name:"电信30套餐",
                    id:1,
                    base:30,
                    flow:300,
                    cost:2,
                    favor:true,
                    description:"30￥=300G</br>超额流量2￥/G"
                },
                {
                    name:"联通30套餐",
                    id:2,
                    base:30,
                    flow:300,
                    cost:2,
                    favor:true,
                    description:"30￥=300G</br>超额流量2￥/G"
                },
                {
                    name:"移动50套餐",
                    id:3,
                    base:50,
                    flow:500,
                    cost:1,
                    description:"50￥=500G</br>超额流量1￥/G"
                }
            ]);*/
        },

        renderData:function(){
            var self = this;
            cloud.util.mask(this.element)
            this.service.getPackages(function(data){
//                console.log(data);

                data.result.each(function(one){
                    var obj = self.unitProc(one.flow);
                    one.description = one.basicprice + "￥=" + obj.flow +obj.unit+"</br>" +
                        locale.get("excess_flow")+one.overprice+"￥/M";
                    one.online = one.isdefault == 1 ? true : false ;
                });
                self.itembox.render(data.result);
                self.element.find(".cloud-item-favor").css("display","none");
                cloud.util.unmask(self.element);
            });
        },

        _renderToolbar:function(){
            var self = this;
            var toolbarContainer = this.element.find(".cost-package-toolbar");
            var $leftBtns = $("<div class='cost-package-toolbar-left'></div>").appendTo(toolbarContainer);
            var addBtn = new Button({
                container:$leftBtns,
                imgCls: "cloud-icon-add",
                lang:"{title:add}",
                events:{
                    click:function(){
                        self.info.clear();
                        self.info.editable(true);
                        self.layout.open("east");
                    }
                }
            });
//            var deleteBtn = new Button({
//                container:$leftBtns,
//                imgCls: "cloud-icon-reduce",
//                lang:"{title:delete}",
//                events: {
//                    click:function(){
//                        var packages = self.itembox.getSelectedItems();
//                        console.log(packages);
//
//                    }
//
//                }
//            })
        },

        _renderInfo:function(){
            var self = this;
            var $infoContainer = this.element.find(".cost-package-info");
            this.info = new Info({
                selector:$infoContainer,
                events:{
                    "cancelCreate":function(){
                        self.layout.hide("east");
                    },
                    "onAdd":function(){
                        self.renderData();
                        self.layout.hide("east");
                    },
                    "onUpdate":function(){
                        self.renderData();
                        self.layout.hide("east");
                        self.info.editable(false);
                    }
                }
            })
        },

        destroy:function($super){
            if (this.layout && (!this.layout.destroyed)) {
                this.layout.destroy();
            }
            if (this.layoutBar && (!this.layoutBar.destroyed)) {
                this.layoutBar.destroy();
            }

            this.itembox && this.itembox.destroy();
            this.info && this.info.destroy();
            this.element.empty();

//            $super();
        }

    });

    return Package
});