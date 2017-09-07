/**
 * Created by inhand on 14-6-18.
 */
define(function(require){
//    var Table = require("cloud/components/table");
      var tabmodule = require("./tabModule");
    var Html = require("text!./table.html");
    var leftTab = require("./leftTab");
    var rightTab = require("./rightTab");
    var Service = require("./service");

    var DATA = [{
        main:{
            name:"mainPage",
            id:"MAIN728374294",
            data:[{
                date:"今日",
                pv:"mian",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        },
        subs:[{
            name:"subPage1",
            id:"SUB728374294",
            data:[{
                date:"今日",
                pv:"sub1",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        },{
            name:"subPage2",
            id:"SUB7283123134",
            data:[{
                date:"今日",
                pv:"sub2",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]

        },{
            name:"subPage3",
            id:"SUB7283743244",
            data:[{
                date:"今日",
                pv:"sub3",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        },{
            name:"subPage4",
            id:"SUB712312294",
            data:[{
                date:"今日",
                pv:"sub4",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        }]
    },{
        main:{
            name:"mainPage",
            id:"MAIN728374294",
            data:[{
                date:"今日",
                pv:"mian",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        },
        subs:[{
            name:"subPage1",
            id:"SUB728374294",
            data:[{
                date:"今日",
                pv:"sub1",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        },{
            name:"subPage2",
            id:"SUB7283123134",
            data:[{
                date:"今日",
                pv:"sub2",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]

        },{
            name:"subPage3",
            id:"SUB7283743244",
            data:[{
                date:"今日",
                pv:"sub3",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        },{
            name:"subPage4",
            id:"SUB712312294",
            data:[{
                date:"今日",
                pv:"sub4",
                useruv:21,
                terminaluv:11
            },{
                date:"昨日",
                pv:32,
                useruv:21,
                terminaluv:11
            },{
                date:"总计",
                pv:32,
                useruv:21,
                terminaluv:11
            }]
        }]
    }]

    var PVUV = Class.create(cloud.Component,{
        initialize : function($super,options){

            this.moduleName = "pvuvTable"

            $super(options);

            this.service = Service;

            this._renderLayout();

            this.elements = {
                nav:this.element.find(".leftNav"),
                rightContent:this.element.find(".rightContent"),
                leftModule:{
                    $el:this.element.find("#animate-left"),
                    toolbar:this.element.find("#animate-left-toolbar"),
                    content:this.element.find("#animate-left-content")
                },
                rightModule:{
                    $el:this.element.find("#animate-right"),
                    toolbar:this.element.find("#animate-right-toolbar"),
                    content:this.element.find("#animate-right-content")
                }
            };

            this._render();

        },

        _renderLayout:function(){

            this.element.html(Html);

            this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    "togglerLength_open": 50,
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
                    paneSelector: ".leftNav",
                    size: 200,
                    initClosed: true
                },
                center: {
                    paneSelector: ".rightContent"
                }
            });

            this.layout.hide("west");



        },

        /**
         *
         * @param data  {
         *                  main:{
         *                      name:"string",
         *                      id:"string",
         *                      data:[{
                                    date:"今日",
                                    pv:32,
                                    useruv:21,
                                    terminaluv:11
                                },{
                                    date:"昨日",
                                    pv:32,
                                    useruv:21,
                                    terminaluv:11
                                },{
                                    date:"总计",
                                    pv:32,
                                    useruv:21,
                                    terminaluv:11
                                }]
         *                  },
         *                  subs:[{
         *                      //like main
         *                  },{
         *                      //like main
         *                  }...]
         *
         *              }
         *
         * @private
         */
        _render:function(){
            this._renderLeft();
            this._renderRight();
//            this._renderRight()

//            this._renderToolbar();
//
//            this._renderTable(DATA);
//            this._renderTable(DATA);


        },
        showRight:function(){
            var width = this.elements.rightContent.width();
            this.elements.rightContent.animate({
                scrollLeft: width
            },800);
        },

        hideRight:function(){
            var width = this.elements.rightContent.width();
            this.elements.rightContent.animate({
                scrollLeft: -width
            },800);
        },

        _renderLeft:function(){
            var self = this;

            this.service.getTypes(function(datas){
                //console.log(datas,"types");

                self.leftTab = new leftTab({
                    selector:self.elements.leftModule.$el,
                    elements:self.elements.leftModule,
                    datas:datas,
                    events:{
                        more:function(data){
                            self.rightTab.renderTable(data);

                            self.showRight()

                        }
                    }
                });
            })

        },
        _renderRight:function(){
            var self = this;
            this.rightTab = new rightTab({
                selector:self.elements.rightModule.$el,
                elements:self.elements.rightModule,
                events:{
                    back:function(){
                        self.hideRight()

                    }
                }
            });

        },


        destory: function($super){
            $super();
        }

    })


    return PVUV

})