/**
 * Created by zhouyunkui on 14-6-10.
 */
define(function(require) {
    require("cloud/base/cloud");
    require("./tag-overview.css");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var ItemBox = require("cloud/components/itembox");
    var service = require("cloud/service/service");
    var validator=require("cloud/components/validator");
    require("cloud/lib/plugin/jquery.qtip");
    require("cloud/lib/plugin/jquery.layout");
    //Create class TagOverview
    var TagOverview = Class.create(cloud.Component, {
        moduleName: "tag-overview",
        initialize: function($super, options) {
            $super(options);
            this.itembox = null;
            this.toolbar = null;
            this.cursor = 0;
            this.step = 10;
            this.draw();
            this.loadTags();
        },

        /*
         * draw tagOverview
         */
        draw: function() {
            this.element.addClass("tag-overview");
            this.$toolbar = $("<div>").attr("id", this.id + "-toolbar").css("overflow","hidden").appendTo(this.element);
            this.$itembox = $("<div>").attr("id", this.id + "-itembox").appendTo(this.element);

            this.element.layout({
                defaults: {
                    paneClass: "pane",
                    "togglerLength_open": 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 1,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: "#" + this.$toolbar.attr("id"),
                    size: 29
                },
                center: {
                    paneSelector: "#" + this.$itembox.attr("id"),
                    paneClass: this.id
                }
            });
            this.renderToolbar();
            this.renderEditForm();
            this.renderCreateForm();
            this.renderItemBox();
        },
        initValidator:function(){
            var self=this;
            validator.render(self.editForm,{
                promptPosition:"topRight"
            })
        },
        /*
         * Render toolbar
         */
        renderToolbar: function() {
            var self = this;
            var checkbox = new Button({
                checkbox: true,
                id: this.moduleName + "-select-all",
                autoGenTitle : false,
                events: {
                    click: function() {
                        if (this.selectAllButton.isSelected() === true) {
                            this.itembox.selectAllItems();
                        } else {
                            this.itembox.unselectAllItems();
                        }
                    },
                    scope: self
                },
                text: "0/0",
                disabled: false
            });

            this.selectAllButton = checkbox;
            var addBtn = new Button({
                imgCls: "cloud-icon-add-tag",
                id: this.moduleName + "-add-button",
//                title:"增加"
                lang:"{title:add_tag}"
            });
            var deleteBtn = new Button({
                imgCls: "cloud-icon-remove-tag",
                id: this.moduleName + "-delete-button",
//                title:"删除",
                lang:"{title:delete_group}",
                events: {
                    click: self.onDelete,
                    scope: self
                }
            });

            var editBtn = new Button({
                imgCls: "cloud-icon-edit",
                id: this.moduleName + "-edit-button",
//                title:"编辑"
                lang:"{title:edit_group}"
            });

            this.toolbar = new Toolbar({
                selector: this.$toolbar,
                leftItems: [checkbox],
                rightItems: [/*addBtn,*/deleteBtn, editBtn]
            });

            this.toolbar.element.addClass(this.moduleName + "-toolbar");
        },

        /*
         * Render itembox
         */
        renderItemBox: function() {
            this.itembox = new ItemBox({
                selector: this.$itembox,
                events: {
                    countchange: this.updateCountInfo,
                    click: this.onClick,
                    togglefavor: this.onToggleFavor,
                    toggleshare: this.onToggleShare,
                    scope: this
                }
            });
            this.itembox.element.addClass(this.moduleName + "-itembox");
        },

        /*
         * Create Form
         */
        renderCreateForm: function() {
            var self=this;
            this.createForm =  $("<form>").addClass(this.moduleName + "-edit-form ui-helper-hidden tag-overview-form").css({
                "margin":"0px auto",
//                "border":"1px solid rgb(222,222,222)",
                "width":"400px",
                "border-radius":"2px",
                "height":"320px"
            });
            var htmlStr="<ul class='edit_form_ul'>" +
                "<li class='form-line-same-one'><lable lang='text:group' for='group_name_input'>组名</lable><input id='group_name_input' type='text' class='validate[required,custom[giveName]]'/></li>"+
                "<li class='form-line-same-one li-span-different'><lable lang='text:network_priority'>网络优先级</lable>" +
                "<input type='radio' name='network_priority_input' value='3'/><span lang='text:lowlevel' style='margin-right: 5px'>低</span>" +
                "<input type='radio' name='network_priority_input' value='2' checked='checked'/><span lang='text:middlelevel' style='margin-right: 5px'>中</span>" +
                "<input type='radio' name='network_priority_input' value='1'/><span lang='text:highlevel' style='margin-right: 5px'>高</span>" +
                "</li>"+
                "<li class='form-line-same-one' style='width:383px'><lable lang='text:flow_limit' for='flow_limit_input'>流量限制</lable><span lang='text:flow_unit' style='float:right;line-height: 25px'>(MB/M)</span><input type='text' id='flow_limit_input' class='validate[custom[number]]'/></li>"+
                "<li class='form-line-same-one' style='width:383px'><lable lang='text:online_time_limit' for='online_time_limit_input'>上网时长限制</lable><span lang='text:time_unit' style='float: right;margin-right: 8px;line-height: 25px'>(H/M)</span><input type='text' id='online_time_limit_input' class='validate[custom[number]]'/></li>"+
                "<li class='need_more_height' style='width:383px'><lable lang='text:speed_limit'>网速限制</lable>" +
                "<p class='paragraph_1' style='line-height: 50px'><label lang='text:upstream_speed' for='upstream_limit_input' style='margin-right: 5px'>上行</label><input type='text' id='upstream_limit_input' class='validate[custom[number]]'/><span lang='text:speed_unit'>(KB/S)</span></p>" +
                "<p class='paragraph_2'><label lang='text:downstream_speed' for='downstream_limit_input' style='margin-right: 5px'>下行</label><input type='text' id='downstream_limit_input' class='validate[custom[number]]'/><span lang='text:speed_unit'>(KB/S)</span></p>" +
                "</li>"+
                "<li style='margin-top: 50px'><span class='cancellBtn_container'></span><span class='saveBtn_container'></span></li>"+
                "</ul>";
            if(locale.current()==2){
                $(htmlStr).find("p").css({
                    "margin-left":"173px"
                }).end().appendTo(this.createForm);
            }else if(locale.current()==1){
                $(htmlStr).find("p.paragraph_1").css({
                    "margin-left":"162px"
                }).end().find("p.paragraph_2").css({
                        "margin-left":"147px"
                    }).end().appendTo(this.createForm);
            }

            new Button({
                // text: "提交",
                container: this.createForm.find(".saveBtn_container"),
                text:locale.get("submit"),
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                events: {
                    click: this.onCreate,
                    scope: this
                }
            });
            new Button({
                // text: "取消",
                container: this.createForm.find(".cancellBtn_container"),
                text:locale.get("cancelText"),
                imgCls: "cloud-icon-no",
                lang:"{title:cancelText}",
                events: {
                    click:function(){
                        $("#" + self.moduleName + "-add-button").trigger("click");
                        $("body").find("#mask-div-for-tagoverview").remove();
                    },
                    scope: this
                }
            });
            this.createForm.appendTo(this.element);
            $("#" + this.moduleName + "-add-button").qtip({
                content: {
                    text: this.createForm
                },
                position: {
                    my: "top left",
                    at: "bottom middle"
                },
                show: {
                    event: "click unfocus"
                },
                hide: {
                    event: "click"
                },
                style: {
                    classes: "qtip-shadow qtip-light"
                },
                events: {
                    visible: function(){
//                        $("#new-tag-name").focus();
                    },
                    show:function(){
                        $("body").append($("<div id='mask-div-for-tagoverview'></div>").css({
                            "width":"100%",
                            "height":"100%",
                            "background-color":"rgba(0,0,0,0.5)",
                            "position":"absolute"
                        }));
                    }
                },
                suppress:false
            });
        },

        /*
         * Render edit form
         */
        renderEditForm: function() {
            var self=this;
            this.editForm = $("<form>").addClass(this.moduleName + "-edit-form ui-helper-hidden tag-overview-form").css({
                "margin":"0px auto",
//                "border":"1px solid rgb(222,222,222)",
                "width":"400px",
                "border-radius":"2px",
                "height":"320px"
            });
            var htmlStr="<ul class='edit_form_ul'>" +
                "<li class='form-line-same-one'><lable lang='text:group' for='group_name_input'>组名</lable><input id='group_name_input' type='text' class='validate[required,custom[giveName]]'/></li>"+
                "<li class='form-line-same-one li-span-different'><lable lang='text:network_priority'>网络优先级</lable>" +
                "<input type='radio' name='network_priority_input' value='3'/><span lang='text:lowlevel' style='margin-right: 5px'>低</span>" +
                "<input type='radio' name='network_priority_input' value='2' checked='checked'/><span lang='text:middlelevel' style='margin-right: 5px'>中</span>" +
                "<input type='radio' name='network_priority_input' value='1'/><span lang='text:highlevel' style='margin-right: 5px'>高</span>" +
                "</li>"+
                "<li class='form-line-same-one' style='width:383px'><lable lang='text:flow_limit' for='flow_limit_input'>流量限制</lable>&nbsp;<span lang='text:flow_unit' style='margin-right:-3px;float:right;line-height: 25px'>(KB/M)</span><input type='text' style='margin-right: 4px' id='flow_limit_input' class='validate[custom[number]]'/></li>"+
                "<li class='form-line-same-one' style='width:383px'><lable lang='text:online_time_limit' for='online_time_limit_input'>上网时长限制</lable><span lang='text:time_unit' style='float: right;margin-right: 5px;line-height: 25px'>(H/M)</span><input type='text' style='margin-right: 4px' id='online_time_limit_input' class='validate[custom[number]]'/></li>"+
            "<li class='need_more_height' style='width:383px'><lable lang='text:speed_limit'>网速限制</lable>" +
                "<p class='paragraph_1' style='line-height: 50px'><label lang='text:upstream_speed' for='upstream_limit_input' style='margin-right: 5px'>上行</label><input type='text' id='upstream_limit_input' class='validate[custom[number]]'/>&nbsp;<span lang='text:speed_unit'>(KB/S)</span></p>" +
                "<p class='paragraph_2'><label lang='text:downstream_speed' for='downstream_limit_input' style='margin-right: 5px'>下行</label><input type='text' id='downstream_limit_input' class='validate[custom[number]]'/>&nbsp;<span lang='text:speed_unit'>(KB/S)</span></p>" +
                "</li>"+
                "<li style='margin-top: 50px'><span class='cancellBtn_container'></span><span class='saveBtn_container'></span></li>"+
                "</ul>";
            if(locale.current()==2){
                $(htmlStr).find("p").css({
                    "margin-left":"180px"
                }).end().appendTo(this.editForm);
            }else if(locale.current()==1){
                $(htmlStr).find("p.paragraph_1").css({
                    "margin-left":"160px"
                }).end().find("p.paragraph_2").css({
                        "margin-left":"146px"
                    }).end().appendTo(this.editForm);
            }
            new Button({
                // text: "提交",
                container: this.editForm.find(".saveBtn_container"),
                text:locale.get("submit"),
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                events: {
                    click: this.onUpdate,
                    scope: this
                }
            });
            new Button({
                // text: "取消",
                container: this.editForm.find(".cancellBtn_container"),
                text:locale.get("cancelText"),
                imgCls: "cloud-icon-no",
                lang:"{title:cancelText}",
                events: {
                    click:function(){
                        $("#" + self.moduleName + "-edit-button").trigger("click");
                        $("body").find("#mask-div-for-tagoverview").remove();
                    },
                    scope: this
                }
            });
            this.editForm.appendTo(this.element);
            locale.render({element:this.editForm});
            self.initValidator();
            $("#" + this.moduleName + "-edit-button").qtip({
                content: {
                    text: this.editForm
                },
                position: {
                    my: "top left",
                    at: "bottom right"
                },
                show: {
                    event: "click"
                },
                hide: {
                    event: "click"
                },
                style: {
                    classes: "qtip-shadow qtip-light"
                },
                events: {
                    visible: function(){
//                        $("#edit-tag-name").focus();
                    },
                    show: function(event) {
                        //Only modify the first selected tag.
                        if (this.itembox.selectedItemsCount === 0) {
                            dialog.render({lang:"tag_choose_tag"});
                            event.preventDefault();
                            return false;
                        } else {
                            $("body").append($("<div id='mask-div-for-tagoverview'></div>").css({
                                "width":"100%",
                                "height":"100%",
                                "background-color":"rgba(0,0,0,0.5)",
                                "position":"absolute"
                            }));
                            var selectedTag = this.itembox.getSelectedItems().first().options.data;
                            this.editForm.data("tag", selectedTag);
                            cloud.Ajax.request({
                                url: "api/wifi_user_group/" + selectedTag._id + "?verbose=100",
                                type: "GET",
                                success: function(data) {
                                    var name=data.result.name;
                                    var data=data.result.rule;
                                    data.name=name;
                                    //测试数据
                                    this.setEditFormData(data);
                                }.bind(this)
                            });
                        }

                    }.bind(this)
                },
                suppress:false
            });
        },
        /*
        *将获得数据填充到qtip弹出框
        *@param {Object}
         */
        setEditFormData:function(data){
            this.editForm.find("#group_name_input").val(data.name);
            this.editForm.find("input[value="+data.priority+"]").attr("checked",true);
            self.uniqFlowLimit=data.flowLimit;
            this.editForm.find("#flow_limit_input").val(Math.round(data.flowLimit/1024*1000)/1000);
            this.editForm.find("#online_time_limit_input").val(data.timeLimit);
            this.editForm.find("#upstream_limit_input").val(data.bandwidthTX);
            this.editForm.find("#downstream_limit_input").val(data.bandwidthRX);
        },
        /*
         * Get data and process
         * @param {Array} data
         * @return {Object}
         */
        processData: function(data) {
            var self = this;
            var resourceType = this.options.service.getResourceType();
            return cloud.util.makeArray(data).collect(function(tag) {
                var config = {
                    selectable: true
                };
                Object.extend(config, tag);
                config.id = this.moduleName + "-tag-" + (tag.id || tag._id);
                config.favor = tag.isMyFavorite === 1;
                config.data = tag;
//                if (tag.status != "inherent"){
//                    config.description = locale.get({lang:"total+:"}) + (tag.total || 0);
//                }else{
//                    config.description = "";
//                }
                config.type = "marker";
                tag.loadResourcesData = tag.loadResourcesData || function(start, limit, callback, context) {
                    cloud.Ajax.request({
                        url: "api/wifi_user",
                        type: "get",
                        parameters: {
//                            "resource_type": resourceType,
                            groupId:tag._id,
                            cursor: start,
                            limit: limit
                        },
                        error: function(error){
                            if(error.error_code === 20006){
                                self.loadTags(false);
                            }
                        },
                        success: function(data) {

                            data.result = data.result.pluck("_id");

                            callback.call(context || this, data);
                        }
                    });
                };
                return config;
            }, this);
        },

        /*
         * Check current tag
         * @param {String} name
         * @return {Boolean}
         */
        checkKeywords:function(name){
            //用户
            var all_user = locale.get("all_user");
            var none_tag_user = locale.get("untagged_user");
            var admin = locale.get("organization_manager");
            var device_manager = locale.get("device_manager");
            //角色
            var all_role = locale.get("all_role");
            var none_tag_role = locale.get("untagged_role");
            //网关
            var all_gateway = locale.get("all_gateway")
            var online_gateway=locale.get("online_gateway");
            var offline_gateway=locale.get("offline_gateway");
            //设备
            var all_device = locale.get("all_devices");
            var none_tag_device = locale.get("untagged_device");
            var online_device = locale.get("online_device");
            var offfline_device = locale.get("offline_device");
            //控制器
            var all_controller=locale.get("all_controller");
            //现场
            var all_site = locale.get("all_site");
            var none_tag_site = locale.get("untagged_site");
            var online_site = locale.get("online_site");
            var offline_site = locale.get("offline_site");

            //机型
            var all_tags = locale.get("all_models");
            var gateway_models = locale.get("gateway_models");
            var not_gateway_models = locale.get("not_gateway_models");
            var untagged_models = locale.get("untagged_models");

            var modelNotOk = (name===all_tags) || (name===gateway_models) || (name===not_gateway_models) || (name===untagged_models);


            if(name===online_gateway||name===offline_gateway||name===all_controller||name===all_user||name===all_gateway||name===none_tag_user || name===admin || name===device_manager ||name===all_role || name===none_tag_role || name===all_device || name===none_tag_device ||name===online_device||name===offfline_device||name===all_site || name===none_tag_site || name ===online_site || name === offline_site || modelNotOk){
                return false;
            }
            return true;
        },

        /*
         * Created event
         */
        onCreate: function() {
            var self=this;
            if(validator.result(self.createForm)){
                var name = self.createForm.find("#group_name_input").val();
                var is = this.checkKeywords(name);
//                var tag = this.createForm.data("tag");
//                var id = tag._id;
//                var shared = tag.shared;
                var checkStr = /[^\u4e00-\u9fa5\da-zA-Z0-9\-\_]+/;
                if(checkStr.test(name)){
                    dialog.render({lang:"tag_cant_be_input"});
                }else if(is==false){
                    dialog.render({lang:"tag_no_input_keywords"});
                }else{
                    if (!name.empty()) {
                        if(name.length <30){
                            var data=self.mergeFormData(self.createForm);
                            cloud.Ajax.request({
                                url: "",
                                type: "PUT",
                                parameters:"",
                                data: "",
                                success: function(data) {
                                    this.itembox.appendItems(this.processData(data.result));
                                    this.itembox.items.values().pluck("widgets").pluck("favor").invoke("hide");
                                    this.itembox.items.values().pluck("widgets").pluck("share").invoke("hide");
                                    $("#" + this.moduleName + "-add-button").data("qtip").hide();
                                    $("#" + self.moduleName + "-add-button").trigger("click");
                                    $("body").find("#mask-div-for-tagoverview").remove();
//                                    $("#edit-tag-name").val(null);
//                                    this.fire("update",data.result);
                                }.bind(this)
                            });
                        }else{
                            dialog.render({lang:"tag_length_only_in"});
                            self.createForm.find("#new-tag-name").val(null);
                        }
                    } else {
                        dialog.render({lang:"tag_cannot_be_empty"});
                    }
                }
                return false;
            }
        },

        /*
         * Delete event
         */
        onDelete: function() {
            var self = this;
            var tags = this.itembox.getSelectedItems();
            if (tags.size() > 0) {
                dialog.render({
                    lang:"affirm_delete",
                    buttons: [
                        {
                            lang:"affirm",
                            click:function(){
                                tags.each((function(tag) {
                                    cloud.Ajax.request({
                                        url: "api/wifi_user_group/" + tag.options._id,
                                        type: "delete",
                                        success: (function() {
                                            //TODO: delete tag from call api.
                                            self.itembox.deleteItems(tag);
//      	                                          self.itembox.switchToSelectStatus();
//      	                                          self.itembox.items.values().first().element.click();
//      	                                          self.itembox.selectMode = false;
                                            self.refresh();
                                        }).bind(this)
                                    });
                                }).bind(this));
                                dialog.close();
                            }
                        },
                        {
                            lang:"cancel",
                            click:function(){
                                dialog.close();
                            }
                        }
                    ]
                });
            } else {
                dialog.render({lang:"tag_choose_tag"});
            }
        },
        /*
        *before update event and create event,get form data to Object
         */
        mergeFormData:function(form){
            var self=this;
//            var group=$("#group_name_input").val();
            var priority=form.find(".edit_form_ul :checked").val();
            var flow_limit=form.find("#flow_limit_input").val();
            if(self.uniqFlowLimit&&self.uniqFlowLimit==flow_limit){
                flow_limit=self.uniqFlowLimit;
            }else{
                flow_limit=flow_limit*1024;
            }
            var time_limit=form.find("#online_time_limit_input").val();
            var speed_limit_upstream=form.find("#upstream_limit_input").val();
            var speed_limit_downstream=form.find("#downstream_limit_input").val();
            var data={
                priority:priority,
                flowLimit:flow_limit,
                timeLimit:time_limit,
                bandwidthTX:speed_limit_upstream,
                bandwidthRX:speed_limit_downstream
            };
            return data;
        },
        /*
         * Update event
         */
        onUpdate: function() {
            var self=this;
            if(validator.result(self.editForm)){
                var name = self.editForm.find("#group_name_input").val();
                var is = this.checkKeywords(name);
                var tag = this.editForm.data("tag");
                var id = tag._id;
                var shared = tag.shared;
                var checkStr = /[^\u4e00-\u9fa5\da-zA-Z0-9\-\_]+/;
                if(checkStr.test(name)){
                    dialog.render({lang:"tag_cant_be_input"});
                }else if(is==false){
                    dialog.render({lang:"tag_no_input_keywords"});
                }else{
                    if (!name.empty()) {
                        if(name.length <30){
                            var data=self.mergeFormData(self.editForm);
                            cloud.Ajax.request({
                                url: "api/wifi_user_group/" + id,
                                type: "PUT",
                                parameters:{
                                  name:name
                                },
                                data: data,
                                success: function(data) {
                                    this.updateTagData(data.result);
                                    $("#" + this.moduleName + "-edit-button").data("qtip").hide();
                                    $("#" + self.moduleName + "-edit-button").trigger("click");
                                    $("body").find("#mask-div-for-tagoverview").remove();
//                                    $("#edit-tag-name").val(null);
                                    this.fire("update",data.result);
                                }.bind(this)
                            });
                        }else{
                            dialog.render({lang:"tag_length_only_in"});
                            $("#new-tag-name").val(null);
                        }
                    } else {
                        dialog.render({lang:"tag_cannot_be_empty"});
                    }
                }
                return false;
            }
        },

        /*
         * Click event
         * @param {String} data
         */
        onClick: function(data) {
//        	console.log(data, "tag-click")
//        	if((this.options.service.resourceType === 5||this.options.service.resourceType === 14) && (data.id === "tag-overview-tag-4" || data.id === "tag-overview-tag-3")){
//				this.loadNetTags();
//			}
            this.clickedTag = data;
            this.fire("click", data.options.data,data.options);
        },

        /*
         * Toggle favor event
         */
        onToggleFavor: function(item) {
            var options = item.options;
            var id = options.data._id;
            function handler() {
                item.setFavor(!item.options.favor);
            }

            if (options.favor) {
                service.removeFavorites(id, handler, this);
            } else {
                service.addFavorites(id, handler, this);

            }
        },

        /*
         * Toggle share event
         */
        onToggleShare: function(item) {
            var options = item.options,
                data = options.data;
            var newData = {
                _id: data._id,
//                name: options.name,
                shared: !options.shared
            };
            service.updateTag(newData, function(result) {
                item.setShared(result.result.shared);
            }, this);
        },

        /*
         * Update count info
         */
        updateCountInfo: function() {
            this.selectAllButton.setText(this.itembox.selectedItemsCount + "/" + this.itembox.size);
            this.selectAllButton.setSelect(this.itembox.selectedItemsCount === this.itembox.size && this.itembox.size !== 0);
            $("#" + this.moduleName + "-select-all label").text(this.itembox.selectedItemsCount + "/" + this.itembox.size);
            if(this.itembox.selectedItemsCount > 1){
                $("#tag-overview-edit-button").hide();
            }else{
                $("#tag-overview-edit-button").show();
            }
        },

        /*
         * Update tag data
         * @param {Object}
         * @return {String}
         */
        updateTagData: function(data) {
            this.itembox.items.find(function(item) {
                return item.value.id.endsWith(data.id || data._id);
            }).value.update(data);
        },

        /*
         * load online & offline tag
         */
        loadNetTags:function(){
            this.options.service.getNetTags(function(tags){
                tags = this.processData(tags);
                this.itembox.updateItems(tags);
                var clickedItem = this.itembox.getClickedItem();
                var clickedItemId = clickedItem.options._id;
                if (clickedItemId){
                    this.itembox.getItemsByProp("_id", clickedItemId).pluck("element").invoke("addClass", "cloud-item-clicked");
                }
            },this);
        },

        /*
         * Load tags
         * @param {String,undefined} reloadParam
         */
        loadTags: function(reloadParam) {
//        	console.log("load tag start")
            this.options.service.getTags(function(tags){
                tags = this.processData(tags);
                // this.itembox.appendItems(tags);
                this.itembox.render(tags, 1);
                this.itembox.items.values().pluck("widgets").pluck("favor").invoke("hide");
                this.itembox.items.values().pluck("widgets").pluck("share").invoke("hide");
                if (!reloadParam){
                    this.itembox.items.values().first().element.click();
                }else{
                    var clickedItem = this.itembox.getClickedItem();
                    var clickedItemId = clickedItem.options._id;
                    if (clickedItemId){
                        var elements = this.itembox.getItemsByProp("_id", clickedItemId).pluck("element").invoke("addClass", "cloud-item-clicked");
                        if (reloadParam == "clicked")
                            elements.each(function(one){
                                one.click();
                            })
                    }
                }
                // this.fire("click", this.itembox.items.values().first().options.data);
            }, this);
        },

        /*
         * Refresh tag box
         */
        refresh: function() {
            var self = this;
            self.loadTags();
        },

        /*
         * clear tag
         */
        clear: function() {}

    });

    return TagOverview;
});