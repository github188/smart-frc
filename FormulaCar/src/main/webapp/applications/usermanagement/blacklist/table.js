/**
 * Created by zhouyunkui on 14-6-25.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var html=require("text!./table.html");
    var Table = require("cloud/components/table");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
//	var Paginate = require("cloud/components/paginate");
    var Paging = require("cloud/components/paging");
    var validator = require("cloud/components/validator");
//    require("./qtip.css");
    require("cloud/lib/plugin/jquery.qtip");
    var dateFormat=function(date,format){
        // temporary convert date. exclude it after api fixed the issue.
        date = new Date(date.getTime());
        var o = {
            "M+" : date.getMonth() + 1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth() + 3) / 3),
            "S" : date.getMilliseconds()
        };
        if (/(y+)/.test(format)){
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for ( var k in o){
            if (new RegExp("(" + k + ")").test(format)){
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    var TableBlack=Class.create(cloud.Component,{
        initialize:function($super,options){
            this.moduleName = "content";
            $super(options);
            this.service = options.service;
            this.businessType = options.businessType;
            this.elements = {
                bar:{
                    id:"content-bar",
                    "class":null
                },
                table: {
                    id: "content-table",
                    "class": null
                },
                paging: {
                    id: "content-paging",
                    "class": null
                }
            };
            this.display = 30;
            this.pageDisplay = 30;
            this._render();
        },
        _render:function(){
            this.destroy();
            this._renderHtml();
            this._renderLayout();
            this._renderTable();
            this._renderToolbar();
            this._renderCreateForm();
//            this._bindEvents();
//            this._renderNoticeBar();
        },
        _renderHtml: function(){
            this.element.html(html);
        },
        _renderCreateForm:function(){
            var self=this;
            if(self.createForm){
                self.createForm.remove();
                self.createForm=null;
            }
            var lang=self.businessType+"list+:";
            var tempArr=self.businessType.split("_");
            var placeHolder=locale.get(tempArr[0]);
            var classNameObj={
                "visitor":"mobile",
                "mac":"macMacth",
                "website":"website"
            };
            self.createForm = $("<form id='my_list_form'>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form").css({
                "padding-top":"10px"
            });
            var divEle=$("<div style='height:50px;'></div>");
            $("<label style='line-height:70px;font-weight: bold'>").attr({"for":"new-tag-name"}).text(locale.get({lang:lang})).appendTo(divEle);
            $("<input type='text'>").attr({"id":"new-tag-name","placeholder":placeHolder}).css({
                "width":"300px"
            }).addClass("validate[required,custom["+classNameObj[tempArr[0]]+"]]").appendTo(divEle);
            divEle.appendTo(self.createForm);
            $("<p id='submit_button_container'>").css({
                "float":"right"
            }).appendTo(self.createForm);
            validator.render(self.createForm,{
                promptPosition:"topLeft"
            });
            $("#"+this.moduleName + "-add-button").qtip({
                content: {
                    text: self.createForm
                },
                position: {
                    my: "top right",
                    at: "bottom middle"
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
                events: {
                    visible: function(){
                        $("#new-tag-name").focus();
                    },
                    hide:function(){
                        $("#new-tag-name").val("");
                        validator.hide();
                    }
                }
            });
        },
        onCreate:function(){
            var self=this;
//            if(flag){
                var inputVal=$("#my_list_form").find("input").val();
                var data={};
                switch (self.businessType){
                    case 'visitor_black':
                        data.name=inputVal;
                        data.type=2;
                        data.blackOrWhite=1;
                        break;
                    case 'visitor_white':
                        data.name=inputVal;
                        data.type=2;
                        data.blackOrWhite=0;
                        break;
                    case 'mac_black':
                        data.name=inputVal;
                        data.type=3;
                        data.blackOrWhite=1;
                        break;
                    case 'mac_white':
                        data.name=inputVal;
                        data.type=3;
                        data.blackOrWhite=0;
                        break;
                    case 'website_black':
                        data.name=inputVal;
                        data.type=1;
                        data.blackOrWhite=1;
                        break;
                    case 'website_white':
                        data.name=inputVal;
                        data.type=1;
                        data.blackOrWhite=0;
                        break;
                    default :
                        break;
                };
                self.options.service.addResource(data,function(returnData){
                    $("#"+this.moduleName + "-add-button").qtip().hide()
                    self.total=returnData.total;
//                    updatePage(returnData,self.nowPage);
                    self.refreshPage(self.nowPage);
                    self.unmask();
                }, self);
//            }
        },
        _renderToolbar:function(){
            var self=this;
            self.selectAllButton = new Button({
                checkbox: true,
                id: this.moduleName + "-select-all",
                autoGenTitle:false,
                events: {
                    click: function() {
                        if (self.selectAllButton.isSelected() === true) {
                            self.selectAllResources();
                        } else {
                            self.unselectAllResources();
                        }
                    },
                    scope:self
                },
                text: "0/0",
                disabled: false
            });
            var addBtn = new Button({
            imgCls: "cloud-icon-add",
                id: this.moduleName + "-add-button",
                title:locale.get("add_menu"),
                lang:"{title:add_menu}",
                events: {
//                    click: this._renderCreateForm,
                    scope:this
                }
            });
        this.addBtn = addBtn;
        var deleteBtn = new Button({
            imgCls: "cloud-icon-reduce",
            id: this.moduleName + "-delete-button",
//            title:"删除",
            lang:"{title:delete1}",
            events: {
                click: this.deleteSelectedResource,
                scope: this
            }
        });
        this.deleteBtn = deleteBtn;
        this.toolbar=new Toolbar({
            selector:"#"+this.elements.bar.id
        });
        this.toolbar.appendLeftItems([this.selectAllButton],0);
        this.toolbar.appendRightItems([this.addBtn,this.deleteBtn],0);
        },
        deleteSelectedResource: function() {
            var self = this;
            var resources = this.getSelectedResources();
            if(resources.length === 0){
                dialog.render({
                    lang:"please_select_at_least_one_config_item"
                });
                return;
            }
            var content;
            dialog.render({
                lang:"affirm_delete",
                content : content,
                buttons:[{lang:"yes",click:function(){
                    dialog.close();
                    self.deleteResource(resources);
                }},{lang:"no",click:function(){
                    dialog.close();
                }}]
            });
        },
        selectAllResources:function() {
            this.content.selectRows();
            this.updateCountInfo();
            var selectedRes = this.getSelectedResources();
            this.fire("afterSelect", selectedRes, null);
        },
        unselectAllResources:function(){
            this.content.unSelectRows();
            this.updateCountInfo();
            var selectedRes = this.getSelectedResources();
            this.fire("afterSelect", selectedRes, null);
        },
        deleteResource : function(resources){
            if(resources.length){
                if (resources.length > 0){
                    this.doDeleteResources(resources);
                }else{
                    this.unselectAllResources();
                }
            }
            else{
                this.doDeleteResources(resources);
            }
        },
        doDeleteResources: function(resources) {
            var self=this;
            this.mask();
            resources = cloud.util.makeArray(resources);
            var isDelAllDev;
            this.options.service.deleteResources(resources.pluck("_id"),function(ids) {
                var callback = function(){
                    //this.content.deleteById(resources.pluck("_id"));
                    var idsToDel = ids ? ids : resources.pluck("_id");
                    self.total-=idsToDel.size();
                    self.unmask();
                    self.refreshPage(self.nowPage,self.total);
                    self.updateCountInfo();
                }.bind(this);
                setTimeout(callback, 500)  // time delay for 0.5 s
            }, this);
        },
        refreshPage:function(page,total){
            var self = this;
            this.mask();
            //after add or delete,count pagination,
            var count = Math.ceil(total/(this.display));
            //if pagination less than nowpage
            if(count < page) page = count;
            if(page === 0 )page=1;
            function updatePage(data,page){
                self.total = data.total;
                self.selectedCount = 0;
                self.content.render(data.result);
                self.updateCountInfo();
                self._renderPagin(data, page);
            }
            switch (self.businessType){
                case 'visitor_black':
                    self.options.service.getVisitor_black_list((page-1)*(self.display),self.display,function(returnData){
//                        success(returnData);
                        self.total=returnData.total;
                        self.totalCount=returnData.result.length;
                        updatePage(returnData,page);
                        self.unmask();
                    }, self);
                    break;
                case 'visitor_white':
                    self.options.service.getVisitor_white_list((page-1)*(self.display),self.display,function(returnData){
//                        success(returnData);
                        self.total=returnData.total;
                        self.totalCount=returnData.result.length;
                        updatePage(returnData,page);
                        self.unmask();
                    }, self);
                    break;
                case 'mac_black':
                    self.options.service.getMac_black_list((page-1)*(self.display),self.display,function(returnData){
//                        success(returnData);
                        self.total=returnData.total;
                        self.totalCount=returnData.result.length;
                        updatePage(returnData,page);
                        self.unmask();
                    },self);
                    break;
                case 'mac_white':
                    self.options.service.getMac_white_list((page-1)*(self.display),self.display,function(returnData){
//                        success(returnData);
                        self.total=returnData.total;
                        self.totalCount=returnData.result.length;
                        updatePage(returnData,page);
                        self.unmask();
                    },self);
                    break;
                case 'website_black':
                    self.options.service.getWebsite_black_list((page-1)*(self.display),self.display,function(returnData){
//                        success(returnData);
                        self.total=returnData.total;
                        self.totalCount=returnData.result.length;
                        updatePage(returnData,page);
                        self.unmask();
                    }, self);
                    break;
                case 'website_white':
                    self.options.service.getWebsite_white_list((page-1)*(self.display),self.display,function(returnData){
//                        success(returnData);
                        self.total=returnData.total;
                        self.totalCount=returnData.result.length;
                        updatePage(returnData,page);
                        self.unmask();
                    }, self);
                    break;
                default :
                    break;
            }
        },
        updateCountInfo: function() {
            this.selectedCount = this.getSelectedResources().size();
            this.selectAllButton.setText(this.selectedCount + "/" + this.pageDisplay);
            this.selectAllButton.setSelect(this.selectedCount === this.totalCount && this.totalCount !== 0);
        },
        getSelectedResources: function() {
            var self = this;
            var selectedRes = $A();
            self.content && self.content.getSelectedRows().each(function(row){
                selectedRes.push(self.content.getData(row));
            });
            return selectedRes;
        },

        _renderLayout: function(){
            this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 0,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: "#" +
                        this.elements.bar.id,
                    size: "33"
                },
                center: {
                    paneSelector: "#" +
                        this.elements.table.id
                },
                south:{
                    paneSelector: "#" + this.elements.paging.id,
                    size: 38
                }
            });
            var height = this.element.find("#" + this.elements.table.id).height();
//            this.display = Math.ceil((height-60)/34);
            //							}
        },
        // get columns by businesstype
        _getColumns: function(businessType){
            var columns;
            switch (businessType) {
                case 'visitor_black':
                case 'visitor_white':
                    columns = [{
                        "title": "用户名",
                        "lang": "text:user_name",
                        "dataIndex": "name",
                        "cls": null,
                        "width": "33%"
                    },{
                        "title": "添加时间",
                        "lang": "text:add_time",
                        "dataIndex": "createTime",
                        "cls": null,
                        "width": "34%",
                        render:function (value, type) {
                            if(type === "display"){
                                return  dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
                            }else{
                                return value;
                            }
                        }
                    }, {
                        "title": "操作人",
                        "lang": "text:excute_man",
                        "dataIndex": "operationName",
                        "cls": null,
                        "width": "33%"
                    }];
                    break;
                case 'mac_black':
                case 'mac_white':
                    columns = [{
                        "title": "MAC地址",
                        "lang": "text:mac_addr",
                        "dataIndex": "name",
                        "cls": null,
                        "width": "33%"
                    },{
                        "title": "添加时间",
                        "lang": "text:add_time",
                        "dataIndex": "createTime",
                        "cls": null,
                        "width": "34%",
                        render:function (value, type) {
                            if(type === "display"){
                                return  dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
                            }else{
                                return value;
                            }
                        }
                    },{
                        "title":"操作人",
                        "lang":"{text:excute_man}",
                        "dataIndex":"operationName",
                        "width":"33%"
                    }];
                    break;
                case 'website_black':
                case 'website_white':
                    columns = [{
                        "title": "网址",
                        "lang":"text:website",
                        "dataIndex": "name",
                        "width": "40%"
                    },{
                        "title": "添加时间",
                        "lang": "text:add_time",
                        "dataIndex": "createTime",
                        "cls": null,
                        "width": "31%",
                        render:function (value, type) {
                            if(type === "display"){
                                return  dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
                            }else{
                                return value;
                            }
                        }
                    },{
                        "title":"操作人",
                        "lang":"{text:excute_man}",
                        "dataIndex":"operationName",
                        "width":"29%"
                    }];
                    break;
                default:
                    break;
            }
            return columns;
        },
        _renderTable: function(){
            var col = this._getColumns(this.businessType);
            this.content = new Table({
                // businessType:this.businessType,
                selector: this.element.find("#" + this.elements.table.id),
                columns: col,
                sorting : [[9, "desc"]],
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox:"true",
                events: {
//                    onRowRendered: function(tr, data, index){
//                        var self = this;
//                        if (data.checkbox) {
//                            return;
//                        }
//                    },
                    onRowClick: function(data) {
                        this.fire("click", data._id, data);
                    },
                    onRowCheck : function(isSelected, RowEl, rowData){
                        this.updateCountInfo();
                        var selectedRes = this.getSelectedResources();
                        this.fire("afterSelect", selectedRes, rowData, isSelected);//add isSelected by qinjunwen
                    },
                    onCheckAll : function(selectedRows){
                        var selectedRes = this.getSelectedResources();
                        this.fire("checkAll", selectedRes);
                    },
                    scope: this
                }
            });

            this.setDataTable();
        },

        destroy: function(){
            if (this.layout) {
                if (this.layout.destroy) {
                    this.layout.destroy();
                }
                else {
                    this.layout = null;
                }
            }
            if (this.content) {
                if (this.content.clearTableData) {
                    this.content.clearTableData();
                }
                if (this.content.destroy) {
                    this.content.destroy();
                }
                else {
                    this.content = null;
                }
            }

            if (this.noticeBar) {
                this.noticeBar.destroy();
            }
            if (this.paging) {
                this.paging.destroy();
            }
        },

        reload: function(businessType){
            this.destroy();
            this.content = null;

        },
        _renderPagin:function(data,start){
            var self = this;
            $("#" + this.elements.paging.id).empty();
            this.paging = null;
            this.paging = new Paging({
                selector:"#" + this.elements.paging.id,
                data:data,
                current:start,
                total:data.total,
                limit:this.pageDisplay,
                requestData:function(options,success){
                    switch (self.businessType) {
                        case 'visitor_black':
                            self.options.service.getVisitor_black_list(options.cursor, options.limit,function(data){
                                success(data);
                                self.total=data.total;
                                self.totalCount=data.result.length;
                                self.updateCountInfo();
                            }, self);
                            break;
                        case 'visitor_white':
                            self.options.service.getVisitor_white_list(options.cursor, options.limit,function(data){
                                success(data);
                                self.total=data.total;
                                self.totalCount=data.result.length;
                                self.updateCountInfo();
                            }, self);
                            break;
                        case 'mac_black':
                            self.options.service.getMac_black_list(options.cursor, options.limit,function(data){
                                success(data);
                                self.total=data.total;
                                self.totalCount=data.result.length;
                                self.updateCountInfo();
                            },self);
                            break;
                        case 'mac_white':
                            self.options.service.getMac_white_list(options.cursor, options.limit,function(data){
                                success(data);
                                self.total=data.total;
                                self.totalCount=data.result.length;
                                self.updateCountInfo();
                            },self);
                            break;
                        case 'website_black':
                            self.options.service.getWebsite_black_list(options.cursor, options.limit,function(data){
                                success(data);
                                self.total=data.total;
                                self.totalCount=data.result.length;
                                self.updateCountInfo();
                            }, self);
                            break;
                        case 'website_white':
                            self.options.service.getWebsite_white_list(options.cursor, options.limit,function(data){
                                success(data);
                                self.total=data.total;
                                self.totalCount=data.result.length;
                                self.updateCountInfo();
                            }, self);
                            break;
                        default :
                            break;
                    }
                },
                turn:function(returnData,nowPage){
                    var obj = returnData.result;
                    self.totalCount=returnData.result.length;
                    self.updateCountInfo();
                    self.nowPage=parseInt(nowPage);
                    obj.total = returnData.total;
                    self.content.render(obj);
                },
                events : {
                    "displayChanged" : function(display){
//        			        console.log("displayChanged:", display)
                        self.pageDisplay = parseInt(display);
                    }
                }
            });
            self.nowPage=1;
        },
        setDataTable: function(){
            switch (this.businessType) {
                case 'visitor_black':
                    this.options.service.getVisitor_black_list(0,this.pageDisplay,function(data){
                        this._renderPagin(data,1);
                        this.total=data.total;
                        this.totalCount=data.result.length;
                        this.updateCountInfo();
                    }, this);
                    break;
                case 'visitor_white':
                    this.options.service.getVisitor_white_list(0,this.pageDisplay,function(data){
                        this._renderPagin(data,1);
                        this.total=data.total;
                        this.totalCount=data.result.length;
                        this.updateCountInfo();
                    }, this);
                    break;
                case 'mac_black':
                    this.options.service.getMac_black_list(0,this.pageDisplay,function(data){
                        this._renderPagin(data,1);
                        this.total=data.total;
                        this.totalCount=data.result.length;
                        this.updateCountInfo();
                    },this);
                    break;
                case 'mac_white':
                    this.options.service.getMac_white_list(0,this.pageDisplay,function(data){
                        this._renderPagin(data,1);
                        this.total=data.total;
                        this.totalCount=data.result.length;
                        this.updateCountInfo();
                    },this);
                    break;
                case 'website_black':
                    this.options.service.getWebsite_black_list(0,this.pageDisplay,function(data){
                        this._renderPagin(data,1);
                        this.total=data.total;
                        this.totalCount=data.result.length;
                        this.updateCountInfo();
                    }, this);
                    break;
                case 'website_white':
                    this.options.service.getWebsite_white_list(0,this.pageDisplay,function(data){
                        this._renderPagin(data,1);
                        this.total=data.total;
                        this.totalCount=data.result.length;
                        this.updateCountInfo();
                    }, this);
                    break;
                default :
                    break;
            }
        }
    });
    return TableBlack;
});