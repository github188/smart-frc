/**
 * Created by inhand on 14-6-23.
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    var tabmodule = require("./tabModule");
    var Button = require("cloud/components/button");
    var Window = require('cloud/components/window');
    var Service = require("./service");
    require("cloud/lib/plugin/highstock.src");

    var rightTab = Class.create(cloud.Component ,{
        initialize:function($super,options){

            this.moduleName = "rightTab"
            $super(options);

            this.service = Service;

            this.elements = this.options.elements;

            this._renderLayout();

//            this._renderTable();

            this._renderToolbar();
        },

        _renderLayout:function(){
            this.element.layout({
                defaults: {
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
                north: {
                    paneSelector: "#animate-right-toolbar",
                    size: 30
                },
                center: {
                    paneSelector: "#animate-right-content"
                }
            })
        },

        renderTable:function(data){
            this.elements.content.empty();//destroy content el

            //save data in this.typeData
            if(!data){
                if(this.typeData){
                    data = this.typeData;
                }else{
                    return
                }
            }else{
                this.typeData = data;
            }
            //render tpye tab
            var self = this;
            var mainModule = new tabmodule({
                selector: self.elements.content,
                data: data,
                type: "main",
                zip:false,
                edit:false,
                morebtn:false,
                events:{
                    showChart:function(){
                        //console.log(data,"main")
                        self.renderAndOpenWin(data);
                    },
                    submit:function(name){
                        self.updateTypeName(data,name,this);
                    }
                }
            });

            //render resource tab
            var pattern=/^[a-zA-Z0-9_\-\.\u4e00-\u9fa5]+$/i;
            var $subSelector = mainModule.getContainer();
            var subArr = []
            var order = this.$orderType.val()
            var name = this.$searchInput.val().replace(/\s/g,"").match(pattern)

            this.service.getResourcesByType({id:data.id, order:order, name:name}, function(datas){

                datas.each(function(sub){

                    if(sub.id != 0){
                        var submodule = new tabmodule({
                            selector: $subSelector,
                            data: sub,
                            morebtn:false,
                            events:{
                                showChart:function(){
                                    //console.log(sub,"sub");
                                    self.renderAndOpenWin(sub);
                                },
                                submit:function(name){
                                    self.updateResName(sub,name,this);
                                }
                            }
                        });

                        subArr.push(submodule);
                    }
                });
            });

//            data.subs.each(function(sub){
//
//                var submodule = new tabmodule({
//                    selector: $subSelector,
//                    data: sub,
//                    events:{
//                        more:function(){
//                            console.log(sub,"sub");
//                            self.renderAndOpenWin(sub);
//                        }
//                    }
//                });
//
//                subArr.push(submodule);
//            })

        },

        updateResName:function(data,name, tab){
            this.service.updateResName({
                tid: data.tid,
                rid: data.id,
                name: name
            },function(res){
                tab.setTitle(res.result)
                data.name = res.result;
            })

        },

        updateTypeName:function(data,name,tab){
            this.service.updateTypeName({
                tid: data.id,
                name: name
            },function(res){
                tab.setTitle(res.result);
                data.name = res.result;
            })

        },



        renderAndOpenWin:function(data){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : data.name,
                    top: "center",
                    left: "center",
                    height: 560,
                    width: 1160,
                    mask: true,
                    events : {
                        "onClose": function() {
                            this.window = null;
                        },

                        scope : this
                    }
                })
            }

            this.window.show();

            this.renderWinContent(data);
        },

        renderWinContent:function(data){
            var winTabContainer = $("<div class='win-tab-ctn'></div>")
            var winCharContainer = $("<div class='win-char-ctn'></div>")

            this.window && this.window.setContents(winTabContainer.after(winCharContainer));

            new tabmodule({
                selector: winTabContainer,
                data: data,
                morebtn:false,
                edit:false,
                chart:false,
                events:{

                }
            });

            winCharContainer.highcharts("StockChart",{
                chart:{
                    zoomType:'y'

                },
                credits:{
                    enabled:false
                },
                title:{
                    text:""
                },
                legend: {
                    enabled: true
                },
                plotOptions:{
                    line:{
                        marker:{
                            enabled: false
                        },
                        lineWidth : 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        dataGrouping:{
//                           enabled:false,
                            approximation:"high",
                            groupPixelWidth:15,
                            forced:true,
                            units:[
                                ['minute',[10]],
                                ["hour",[1]],
                                ["day",[1]]

                            ]
                        }
                    }

                },
                xAxis:{
                    type : "datetime",
                    allowDecimals:false

                },
                yAxis:{
                    allowDecimals:false
                },
                tooltip: {
                    shared: true,
                    xDateFormat: '%Y-%m-%d'
                }
            });

            this.chart = winCharContainer.highcharts()

            this.getChartData(data);

        },

        getChartData:function(data){
            var self = this;
            //console.log(data);
            this.service.getResStat(data,function(res){
                //console.log(res);
                var pvData = [];
                var uvData = [];
                res.result.each(function(one){
                    pvData.push([one.date,one.pv])
                    uvData.push([one.date,one.uv])
                });


                var pvSeries = self.chart.get("pvSeries")
                if(pvSeries){//update
                    pvSeries.setData(pvData);
                }else{//add
                    self.chart.addSeries({
                        id:"pvSeries",
                        name: 'PV',
                        color: '#89A54E',
                        type: 'line',
                        data: pvData,
//                        tooltip: {
//                            valueSuffix: '人'
//                        }
                    });
                }
                
                var uvSeries = self.chart.get("uvSeries")
                if(uvSeries){//update
                    uvSeries.setData(uvData);
                }else{//add
                    self.chart.addSeries({
                        id:"uvSeries",
                        name: 'UV',
                        color: 'rgb(135, 139, 239)',
                        type: 'line',
                        data: uvData,
//                        tooltip: {
//                            valueSuffix: '人'
//                        }
                    });
                }
                
            });

        },

        _renderToolbar:function(){
            var self = this;
            var leftbar = self.elements.toolbar.find(".toolbar-left")
            var rightbar = self.elements.toolbar.find(".toolbar-right")
            //back btn
            new Button({
                container : leftbar,
                imgCls : "cloud-icon-arrowleft",
                cls:"toolbar-back-btn",
                events : {
                    "click" :function(){
                        self.fire("back");
                    }
                }

            });
            //search
            var $searchContainer = $("<div class='righttab-search-container'></div>").appendTo(rightbar);
            $("<label>"+locale.get("query+:")+"</label>").appendTo($searchContainer);
            this.$searchInput = $("<input type='text' id='righttab-search-input' >").appendTo($searchContainer)
                .bind("keypress",function(e){
                    //console.log(e);
                    if(e.keyCode == 13){
                        self.renderTable();
                    }
                });

            var submitBtn = new Button({
                container :$searchContainer,
//                cls:"righttab-search-searchbtn",
                text: locale.get("query"),//"查询",
                events:{
                    "click":function(){
                        //console.log("search...")
                        self.renderTable();
                    }
                }
            }).element.addClass("righttab-search-searchbtn");

            //sort
            $("<label>"+locale.get('sort_by+:')+"</label>").appendTo(rightbar);
            this.$orderType = $("<select id='righttabl-order-type'></select>").appendTo(rightbar);
            var options = "<option value='1'>"+locale.get("pv_desc")+"</option>" +
                "<option value='2'>"+locale.get("pv_asc")+"</option>"+
                "<option value='3'>"+locale.get("uv_desc")+"</option>"+
                "<option value='4'>"+locale.get("uv_asc")+"</option>"
            this.$orderType.html(options).bind("change",function(){
                self.renderTable();
            });

        },



        destory:function($super){
            $super()
        }
    });

    return rightTab;
})