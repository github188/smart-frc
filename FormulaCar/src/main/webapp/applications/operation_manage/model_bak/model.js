define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./model.html");
    var Content = require("./content/content");
    var Edit = require("./edit");
    var Window = require('cloud/components/window');
    var Service = require("../service.js");
    var columns = [{
            "title": locale.get({lang: "create_time"}),
            "dataIndex": "createTime",
            "cls": null,
            "width": "15%",
            render: function(data, type, row) {
                return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
            }
        }, {
            "title": locale.get({lang: "automat_model_no"}),
            "dataIndex": "number",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang: "automat_model_name"}),
            "dataIndex": "name",
            "cls": null,
            "width": "20%"
        }, {
            "title": locale.get({lang: "automat_manufacturer"}),
            "dataIndex": "manufacturer",
            "cls": null,
            "width": "30%"
        }, {
            "title": locale.get({lang: "desc"}),
            "dataIndex": "description",
            "cls": null,
            "width": "25%"
        }];
    var modelList = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.elements = {
                content: {
                    id: "content-table"
                }
            };
            this.winHeight = 324;
            this.winWidth = 400;
            this._render();
        },
        _render: function() {
            this._renderContent();
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderContent: function() {
            var self = this;
            this.content = new Content({
                selector: "#" + this.elements.content.id,
                columns: columns, 
                events: {
                    "click": function() {

                    },
                    "add": function() {
                        self.showEditView("add");
                        cloud.util.unmask("#automat_manager_model");
                    },
                    "query": function() {
                        cloud.util.mask("#content-table-content");
                        var self = this;
                        var pageDisplay = $(".paging-limit-select").val();
                        var condition = $("#automat_model_search_options option:selected").val();
                        var value = $("#search-input").val();
                        var rs = "";
                        if (value) {
                            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
                            for (var i = 0; i < value.length; i++) {
                                rs = rs + value.substr(i, 1).replace(pattern, '');
                            }
                        }
                        Service.getModelInfo(condition, rs, 0, pageDisplay, function(data) {
                            self.searchParams.searchCondition = condition;
                            self.searchParams.searchValue = rs;
                            var total = data.total;
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.table.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#content-table-content");
                        });
                    },
                    "modify": function(_id) {
                        Service.getModelById(_id, function(data) {
                            self.showEditView("update", _id);
                            $("#automat_model_name").val(data.result.name);
                            $("#automat_model_number").val(data.result.number);
                            $("#automat_model_manufacturer").val(data.result.manufacturer);
                            $("#automat_cargo_road_amount").val(data.result.roadNumber);
                            $("#automat_model_description").val(data.result.description);
                            $("#roadStartingNumber").val(data.result.roadStartingNumber);
                            $("#buttonNumber").val(data.result.buttonNumber);
                            cloud.util.unmask("#automat_manager_model");
                        }, self);

                    }
                }
            });
        },
        showEditView: function(type, _id) {
            var self = this;
            if (this.editWindow) {
                this.editWindow = null;
            }
            this.editWindow = new Window({
                container: "body",
                title: locale.get("add_or_modify_model"),
                top: "center",
                left: "center",
                height: 420,
                width: 600,
                mask: true,
                blurClose: false,
                events: {
                    "onClose": function() {
                        self.editWindow.destroy();
                        self.editWindow = null;
                    },
                    scope: this
                }
            })
            this.editWindow.show();
            this.setEditContent(type, _id);
        },
        setEditContent: function(type, _id) {
            var self = this;
            this.editContentContainer = $("<div id='add_or_edit_model' style='border-top: 1px solid #f2f2f2;'></div>");

            this.editWindow.setContents(this.editContentContainer);
            this.editContent = new Edit({
                container: "#add_or_edit_model",
                height: 320,
                width: 600,
                events: {
                    "click": function() {
                        if (type == "add") {
                            var name = $("#automat_model_name").val();
                            var number = $("#automat_model_number").val();
                            var manufacturer = $("#automat_model_manufacturer").val();
                            var roadNumber = $("#automat_cargo_road_amount").val();
                            var description = $("#automat_model_description").val();
                            var roadStartingNumber = $("#roadStartingNumber").val();
                            var buttonNumber = $("#buttonNumber").val();
                            if (name == null || name.replace(/(^\s*)|(\s*$)/g,"")=="") {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_model_name"});
                                return;
                            }
                            if (number == null || number.replace(/(^\s*)|(\s*$)/g,"")=="") {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_model_number"});
                                return;
                            }
                            var a = /^(\d*|\-?[1-9]{1}\d*)$/;
                            if (!roadNumber.match(a) || roadNumber == "0" || roadNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || roadNumber < 0) {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_road_number_integer"});
                                return;
                            }
                            if (!roadStartingNumber.match(a) || roadStartingNumber == null || roadStartingNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || roadStartingNumber < 0) {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_roadStartingNumber"});
                                return;
                            }
                            if (!buttonNumber.match(a) || buttonNumber == 0 || buttonNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || buttonNumber < 0) {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_buttonNumber"});
                                return;
                            }
                            Service.addModel(name, number, manufacturer, roadNumber, description, roadStartingNumber, buttonNumber, function(data) {
                                if (data.error != null) {
                                    if (data.error_code == "70011") {//机型名称不能重复
                                        cloud.util.unmask("#automat_model_info");
                                        dialog.render({lang: "model_name_exists"});
                                        return;
                                    }
                                    if (data.error_code == "70012") {//机型编号不能重复
                                        cloud.util.unmask("#automat_model_info");
                                        dialog.render({lang: "model_number_exists"});
                                        return;
                                    }
                                } else {
                                    self.editWindow.destroy();
                                    self.content.loadTableData();
                                    cloud.util.unmask("#automat_model_info");
                                    dialog.render({lang: "save_success"});
                                    return;
                                }
                            }, self);
                        } else if (type == "update") {
                            var name = $("#automat_model_name").val();
                            var number = $("#automat_model_number").val();
                            var manufacturer = $("#automat_model_manufacturer").val();
                            var roadNumber = $("#automat_cargo_road_amount").val();
                            var description = $("#automat_model_description").val();
                            var roadStartingNumber = $("#roadStartingNumber").val();
                            var buttonNumber = $("#buttonNumber").val();
                            if (name == null || name.replace(/(^\s*)|(\s*$)/g,"")=="") {
                                cloud.util.unmask(".ui-window-body");
                                dialog.render({lang: "automat_enter_model_name"});
                                return;
                            }
                            if (number == null || number.replace(/(^\s*)|(\s*$)/g,"")=="") {
                                cloud.util.unmask(".ui-window-body");
                                dialog.render({lang: "automat_enter_model_number"});
                                return;
                            }
                            var a = /^(\d*|\-?[1-9]{1}\d*)$/;
                            if (!roadNumber.match(a) || roadNumber == "0" || roadNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || roadNumber < 0) {
                                cloud.util.unmask(".ui-window-body");
                                dialog.render({lang: "automat_enter_road_number_integer"});
                                return;
                            }
                            if (!roadStartingNumber.match(a) || roadStartingNumber == null || roadStartingNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || roadStartingNumber < 0) {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_roadStartingNumber"});
                                return;
                            }
                            if (!buttonNumber.match(a) || buttonNumber == 0 || buttonNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || buttonNumber < 0) {
                                cloud.util.unmask("#automat_model_info");
                                dialog.render({lang: "automat_enter_buttonNumber"});
                                return;
                            }
                            Service.updateModel(_id, name, number, manufacturer, roadNumber, description, roadStartingNumber, buttonNumber, function(data) {
                                if (data.error != null) {
                                    if (data.error_code == "70017") {//机型名称不能重复
                                        cloud.util.unmask(".ui-window-body");
                                        dialog.render({lang: "model_name_exists"});
                                        return;
                                    }
                                    if (data.error_code == "70018") {//机型编号不能重复
                                        cloud.util.unmask(".ui-window-body");
                                        dialog.render({lang: "model_number_exists"});
                                        return;
                                    }
                                } else {
                                    self.editWindow.destroy();
                                    self.content.loadTableData();
                                    cloud.util.unmask(".ui-window-body");
                                    dialog.render({lang: "automat_goods_model_update_success"});
                                    return;
                                }
                            }, self);
                        }

                    },
                    "close": function() {
                        self.editWindow.destroy();
                    },
                    scope: this
                }
            });

        },
        destroy: function() {
            if (this.editWindow) {
                this.editWindow.destroy();
                this.editWindow = null;
            }
            if (this.content) {
                this.content.destroy();
            }
        }
    });

    return modelList;
});