/**
 * Created by zhang on 14-7-21.
 */
define(function(require){
//    var Content = require("../../component/content-table");
    var Table = require("cloud/components/table");
    var Service = require("./service");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.multiselect");
    var Paging = require("cloud/components/paging");

    var COLUMNS = [{
        "title": "SIM卡号",
        "dataIndex": "simId",
        "width": "20%",
        "lang":"{text:sim_number}"
    },{
        "title": "热点名",
        "dataIndex": "deviceName",
        "width": "20%",
        "lang":"{text:site_name}"
    },{
        "title": "流量",
        "dataIndex": "useFlow",
        "width": "20%",
        "lang":"{text:flow}",
        render:function(value,type,obj){
            var val = value*1024*1024 //MB -> B
            var used = cloud.util.unitConversion(val)
            var max = cloud.util.unitConversion(obj.packFlow*1024*1024);
            return used+" / "+max;
        }

    },{
        "title": "资费(基本+超额)",
        "dataIndex": "overMoney",
        "width": "20%",
        "lang":"{text:charges}",
        render:function(value,type,obj){
            var cost = (value + obj.basicMoney).toFixed(2);
            return cost+" ("+obj.basicMoney.toFixed(2)+"+"+ value.toFixed(2) +")";
        }
    },{
        "title": "使用套餐",
        "dataIndex": "packName",
        "width": "20%",
        "lang":"{text:pack_name}"
    }];


    var sim = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.service = Service;

            this._render();

        },

        _render:function(){
            var self = this;
            this._renderHtml();
            this._renderLayout();
            this.service.getPackages(function(data){
                self._renderToolbar(data);
                self._renderTable();
                locale.render({element:self.element});
            });

        },

        _renderHtml:function(){
            var html = "<div class='cost-sim-toolbar'></div>" +
                "<div class='cost-sim-content'></div>" +
                "<div class='cost-sim-paging'></div>";

            this.element.html(html);

        },

        _renderLayout:function(){
            this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 0,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    togglerTip_open:locale.get({lang:"close"}),
                    togglerTip_closed:locale.get({lang:"open"}),
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: ".cost-sim-toolbar",
                    size: 32
                },
                center: {
                    paneSelector: ".cost-sim-content"
                },
                south: {
                    paneSelector: ".cost-sim-paging",
                    size : 38
                }

            });

        },

        _renderTable:function(){
            var self = this;
            this.table = new Table({
                selector: this.element.find(".cost-sim-content"),
                datas:[],
                checkbox: "multi",
                columns:COLUMNS,
                events:{
                    onRowCheck:function(){
                        self._updateCount();
                    }

                }
            });

            var params = this.getSearchParams();

            this.queryData();

        },

        _renderPaging:function(data){
            var self = this;
            if(this.page){
                this.page = null;
                $(".cost-sim-paging").empty();
            }
            this.page = new Paging({
                selector : $(".cost-sim-paging"),
                data : data,
                total : data.total,
                current : 1,
                limit : data.limit,
                requestData:function(options,success){
                    var param = self.getSearchParams();
                    param.cursor = options.cursor;
                    param.limit = options.limit;
                    self.service.getSIM(param,function(returnData){
                        success(returnData);
                    },self);
                },
                turn : function(returnData){
                    var obj = returnData.result;
                    obj.total = returnData.total;
                    self.table.render(obj);
                    self._updateCount();
                }

            });

        },

        getSearchParams:function(){
            var data = {};
            data.packageIds = this.packageSelect.multiselect("getChecked").map(function(){
                return this.value;
            }).get();
            data.over = this.onlycheck.is(":checked") ? 2 : 1 ;

            data.time = this.timeInput.val().replace(/-/,"");

            data.simId = this.SearchInput.val();

            return data;
        },

        queryData:function(){
            var self = this;
            var params = this.getSearchParams();
            cloud.util.mask(this.element);
            this.service.getSIM(params,function(data){
                self.setTotalPrice(data.totalprice);
                self._renderPaging(data);
                cloud.util.unmask(self.element);
//                self.table.render(data.result)
            },function(error){
                if(error.error_code == 70001){
                    dialog.render({
                        lang:"please_set_default",
                        buttons:[{lang:"yes",click:function(){
                            dialog.close();
                            self.fire("setDefault");
                        }},{lang:"no",click:function(){
                            dialog.close();
                        }}]
                    })
                }
            });
        },

        setTotalPrice:function(price){
            var $price = this.element.find("#cost-sim-toolbar-total");
            $price.text(price.toFixed(2)+"￥");
        },


        changePack:function(simIds,packageId){
            var self = this;
            if(simIds.length > 0){
                var data = {
                    simId:simIds,
                    packageId:packageId
                };
                this.service.changePackage(data,function(data){
                    self.queryData();
                });
            }else{
                dialog.render({lang:"please_select_at_least_one_config_item"});
            }

        },

        _bindSelectEvent:function(){
            var self = this;
            this.selectAll.bind("click",function(){
                var ischecked = $(this).is(":checked");
                if(ischecked){
                    self.table.selectRows();
                    self._updateCount();
                }else{
                    self.table.unSelectRows();
                    self._updateCount();
                }
            });
        },

        _updateCount:function(){
            var ischecked = this.selectAll.is(":checked");
            var selected = this.table.getSelectedRows().length;
            var total = this.table.getData().length;
            this.selectText.text(selected+"/"+total);
            if(selected > 0){
                !ischecked && this.selectAll.attr("checked",true);
            }else{
                ischecked && this.selectAll.attr("checked",false);
            }

        },

        _renderToolbar:function(data){
            var self = this;
            var $toolbar = this.element.find(".cost-sim-toolbar");

            var toolbarContainer = $("<div class='cost-sim-toolbar-container'></div>").appendTo($toolbar);

            //select all
            this.selectAll = $("<input type='checkbox' id='cost-sim-toolbar-selectall'>").appendTo(toolbarContainer);

            this.selectText = $("<span class='cost-sim-toolbar-selectall-text'>0/0</span>").appendTo(toolbarContainer);

            this._bindSelectEvent();

            //total
            var $totalLab = $("<span class='cost-sim-toolbar-total' lang='text:total_price+:'>总费用:</span><span id='cost-sim-toolbar-total'>0￥</span>").appendTo(toolbarContainer);

            //month
            var month = $("<span class='cost-sim-toolbar-time' lang='text:_month+:'>月份:</span>").appendTo(toolbarContainer);

            var timeInput = $("<input id='cost-sim-toolbar-time'>").appendTo(toolbarContainer);

            timeInput.val(cloud.util.dateFormat(new Date(),"yyyy-MM",false)).datetimepicker({
                timepicker:false,
                format:'Y-m',
                onShow:function(){
                    $(".xdsoft_calendar").hide();
                },
                onChangeMonth:function(a,b){
                    var date = new Date(new Date(a).getTime()/1000);
                    b.val(cloud.util.dateFormat(date,"yyyy-MM"));
                },
                onClose:function(a,b){
                    var date = new Date(new Date(a).getTime()/1000);
                    b.val(cloud.util.dateFormat(date,"yyyy-MM"));
                },
                lang:locale.current() === 1 ? "en" : "ch"
            });

            this.timeInput = timeInput ;

            //package
            var packageText = $("<span class='cost-sim-toolbar-package' lang='text:pack_name'>套餐:</span>").appendTo(toolbarContainer);

            var packageSelect = $("<select id='cost-sim-toolbar-package' multiple='multiple'></select>").appendTo(toolbarContainer);

            data.result.each(function(one){
                var opt = $("<option value="+one.packageId+" selected='selected' >"+one.name+"</option>");
                packageSelect.append(opt);
            });

            packageSelect.multiselect({
                checkAllText:locale.get({lang:"check_all"}),
                uncheckAllText:locale.get({lang:"uncheck_all"}),
                noneSelectedText:locale.get({lang:"please_select"}),
                selectedText: "# " + locale.get({lang:"is_selected"}),
                minWidth:135,
                height:100,
                open:function(){
                    $(".ui-multiselect-menu").width(155);
                }
            });

            this.packageSelect = packageSelect;

            //search input
            var name = $("<span class='cost-sim-toolbar-name' lang='text:query+:'>查询:</span>").appendTo(toolbarContainer);

            this.SearchInput = $("<input id='cost-sim-toolbar-name' placeholder='"+locale.get("sim_number")+"'>").appendTo(toolbarContainer);

            var btndiv = $("<div class='cost-sim-toolbar-searchbtn'></div>").appendTo(toolbarContainer)
            var searchBtn = new Button({
                container:btndiv,
                text:locale.get("query"),
                events:{
                    click:function(){
                        self.queryData();
                    }
                }
            });

            //only overflow
            this.onlycheck = $("<input type='checkbox' id='cost-sim-toolbar-onlyover'>").appendTo(toolbarContainer);

            var onlytext = $("<span class='cost-sim-toolbar-onlyover' lang='text:excess_only'>只看超额SIM卡</span>").appendTo(toolbarContainer);

            //change packages
            var changediv = $("<div class='cost-sim-toolbar-changebtn'></div>").appendTo(toolbarContainer);
            var changeBtn = new Button({
                container:changediv,
                text:locale.get("pack_changes"),//"套餐变更",
                events:{
                }
            });


            var optarr = [];
            data.result.each(function(one){
                var opt = "<option value="+one.packageId+">"+one.name+"</option>"
                optarr.push(opt);
            });
            var tipContent = $("<div>" +
                "<select id='cost-sim-toolbar-change'>"+optarr+"</select>"+
                "</div>");

            var changesub = new Button({
                container:tipContent,
                imgCls:"cloud-icon-yes",
                lang:"{title:submit}",
                events:{
                    click:function(){
                        var resources = $A();
                        self.table && self.table.getSelectedRows().each(function(row){
                            resources.push(self.table.getData(row));
                        });
                        var simIds = resources.pluck("simId");
                        var packageId = $("#cost-sim-toolbar-change").val();

                        self.changePack(simIds,packageId);
                        self.changeTip.hide();
                    }
                }
            });

            var changeTip = changeBtn.element.qtip({
                content: tipContent,
                position: {
                    my: "top right",
                    at: "bottom center"
                },
                show: {
                    event: "click"
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow qtip-light"
                },
                suppress:false
            });

            this.changeTip = changeTip.qtip("api");



        },

        destroy:function($super){
            this.table && this.table.destroy();
            if (this.layout && (!this.layout.destroyed)) {
                this.layout.destroy();
            }

            this.element.empty();
        }
    });

    return sim;
});