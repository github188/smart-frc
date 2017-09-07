/**
 * Created by zhouyunkui on 14-6-15.
 */
/**
 * Copyright (c) 2007-2014, InHand Networks All Rights Reserved.
 * @author jerolin
 */
define(function(require) {
    require("cloud/base/cloud");
    require("./tag-overview.css");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    var ItemBox = require("cloud/components/itembox");
    var service = require("cloud/service/service");
    require("cloud/lib/plugin/jquery.qtip");
    require("cloud/lib/plugin/jquery.layout");
//    require("cloud/resources/css/jquery-ui.css");
//    require("cloud/lib/plugin/jquery-ui");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
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
            this.renderForm();
            this.renderCreateForm();
            this.renderEditForm();
            this.renderItemBox();
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
            this.addBtn=addBtn;
            var deleteBtn = new Button({
                imgCls: "cloud-icon-remove-tag",
                id: this.moduleName + "-delete-button",
//                title:"删除",
                lang:"{title:delete_tag}",
                events: {
                    click: self.onDelete,
                    scope: self
                }
            });
            this.deleteBtn=deleteBtn;
            var editBtn = new Button({
                imgCls: "cloud-icon-edit",
                id: this.moduleName + "-edit-button",
//                title:"编辑"
                lang:"{title:edit_tag}"
            });
            this.editBtn=editBtn;
            this.toolbar = new Toolbar({
                selector: this.$toolbar,
                leftItems: [checkbox],
                rightItems: [self.addBtn, self.deleteBtn, self.editBtn]
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
        renderForm:function(){
            var self=this;
            this.originForm = $("<form>").addClass("ui-helper-hidden tag-overview-form");
//            $("<label>").attr("for", "new-tag-name").text(locale.get({lang:"tag_name+:"})).appendTo(this.editForm);
//            $("<input type='text'>").attr("id", "edit-tag-name").appendTo(this.editForm);
            var ulElement=$("<ul></ul>").css({
                "width":"500px",
                "height":"300px"
            });
            var liElement1=$("<li><label lang='text:publshing_point'></label><input id='publshing_point_input' class='line-info-input validate[required,custom[username]]' type='text' /></li>").css({
                "width":"500px",
                "margin-top":"30px"
            });
            var liElement2=$("<li><label lang='text:priority'></label>" +
                "<div style='position: relative;left: 165px;top: -19px'>" +
                "<span lang='text:highlevel'>高</span><input value='1' type='radio' name='priority' />&nbsp;&nbsp;<span lang='text:middlelevel'>中</span><input checked='checked' value='2' type='radio' name='priority' />&nbsp;&nbsp;<span lang='text:lowlevel'>低</span><input value='3' type='radio' name='priority' />" +
                "</div>" +
                "</li>").css({
                    "width":"500px",
                    "margin-top":"15px"
                });
            var liElement3=$("<li><label lang='text:syn_cycle'></label><select id='cycle_choose'>" +
                "<option lang='text:fifteen_minutes' value='900000'>15分钟</option>"+
                "<option lang='text:thirty_minutes' value='1800000'>30分钟</option>"+
                "<option lang='text:one_hour' value='3600000'>1小时</option>"+
                "<option lang='text:two_hour' value='7200000'>2小时</option>"+
                "<option lang='text:four_hour' value='14400000'>4小时</option>"+
                "<option lang='text:eight_hour' value='28800000'>8小时</option>"+
                "<option lang='text:twelve_hour' value='43200000'>12小时</option>"+
                "<option lang='text:one_day' value='86400000'>1天</option>"+
                "<option lang='text:two_day' value='172800000'>2天</option>"+
                "<option lang='text:seven_day' value='604800000'>7天</option>"+
                "</select></li>").css({
                    "width":"500px",
                    "margin-top":"15px"
                });
            var liElement6=$("<li><span id='point_submit_button'></span><span id='point_cancell_button'></span></li>").css({
                "text-align":"center"
            }).css({
                    "margin-top":"30px"
                });
            var liElement4=$("<li><label lang='text:syn_quantum'>同步时间段</label>" +
                "<ul class='date_list' id='date_list_pick'>" +
                "<li class='date_line every_day_different'  style='float: left'><span class='date_detail which-date-clicked' value='7' lang='text:everyday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='1' lang='text:monday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='2' lang='text:tuesday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='3' lang='text:wenseday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='4' lang='text:thursday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='5' lang='text:friday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='6' lang='text:saturday'></span></li>" +
                "<li class='date_line week_cycle_day' style='float: left'><span class='date_detail' value='0' lang='text:sunday'></span></li> " +
                "</ul>"+
                "<div class='datetimepicker_row'>" +
                "<select id='start_time' class='validate[required]'>" +
                "<option value='0'>00:00</option>" +
                "<option value='1'>01:00</option>" +
                "<option value='2'>02:00</option>" +
                "<option value='3'>03:00</option>" +
                "<option value='4'>04:00</option>" +
                "<option value='5'>05:00</option>" +
                "<option value='6'>06:00</option>" +
                "<option value='7'>07:00</option>" +
                "<option value='8'>08:00</option>" +
                "<option value='9'>09:00</option>" +
                "<option value='10'>10:00</option>" +
                "<option value='11'>11:00</option>" +
                "<option value='12'>12:00</option>" +
                "<option value='13'>13:00</option>" +
                "<option value='14'>14:00</option>" +
                "<option value='15'>15:00</option>" +
                "<option value='16'>16:00</option>" +
                "<option value='17'>17:00</option>" +
                "<option value='18'>18:00</option>" +
                "<option value='19'>19:00</option>" +
                "<option value='20'>20:00</option>" +
                "<option value='21'>21:00</option>" +
                "<option value='22'>22:00</option>" +
                "<option value='23'>23:00</option>" +
                "</select>"+
                "&nbsp;<span lang='text:to'>到</span>&nbsp;" +
                "<select id='end_time' class='validate[required]'>" +
                "<option value='0'>00:00</option>"+
                "<option value='1'>01:00</option>" +
                "<option value='2'>02:00</option>" +
                "<option value='3'>03:00</option>" +
                "<option value='4'>04:00</option>" +
                "<option value='5'>05:00</option>" +
                "<option value='6'>06:00</option>" +
                "<option value='7'>07:00</option>" +
                "<option value='8'>08:00</option>" +
                "<option value='9'>09:00</option>" +
                "<option value='10'>10:00</option>" +
                "<option value='11'>11:00</option>" +
                "<option value='12'>12:00</option>" +
                "<option value='13'>13:00</option>" +
                "<option value='14'>14:00</option>" +
                "<option value='15'>15:00</option>" +
                "<option value='16'>16:00</option>" +
                "<option value='17'>17:00</option>" +
                "<option value='18'>18:00</option>" +
                "<option value='19'>19:00</option>" +
                "<option value='20'>20:00</option>" +
                "<option value='21'>21:00</option>" +
                "<option value='22'>22:00</option>" +
                "<option value='23'>23:00</option>" +
//                "<option value='24'>24:00</option>" +
                "</select>" +
                "</div>"+
                "</li>"
            ).css({
                    "width":"500px",
                    "margin-top":"15px"
                });
            var liElement5=$("<li><label for='local_directory' lang='text:absolute_path+:'></label><select id='local_directory'>" +
                "<option value='html'>html</option>" +
                "<option value='conf'>conf</option>" +
                "<option value='scripts'>scripts</option>" +
                "</select></li>").css({
                "width":"500px",
                "margin-top":"15px"
            });
            this.originForm.append(ulElement.append(liElement1).append(liElement5).append(liElement2).append(liElement3).append(liElement4).append(liElement6));
            this.originForm.find("input.line-info-input").css({
//                "margin-left":"60px"
            });
            this.originForm.find("select#cycle_choose").css({
//                "margin-left":"48px"
            });
            this.originForm.find("select#date_choose").css({
                "margin-left":"36px"
            });
            this.originForm.find("div.datetimepicker_row").css({
                "margin-left":"150px",
                "clear":"both"
//                "margin-top":"15px"
            });
            this.originForm.find("ul.date_list").css({
                "position":'relative',
                'top':"-20px",
                "left":"153px",
                "height":"25px"
            });
            this.originForm.find("li.date_line").css({
                "float":"left"
            });
            this.originForm.find("span.date_detail").css({
                "display":"inline-block",
                "width":"40px",
                "height":"25px",
                "line-height":"25px",
                "text-align":"center",
                "border":"1px solid rgb(222,222,222)",
                "border-radius":"4px",
                "cursor":"pointer"
            });
            this.originForm.find("label").css({
                "display":"inline-block",
                "width":"150px"
            })
        },
        /*
         * Create Form
         */
        renderCreateForm: function() {
            var self=this;
            self.createForm=self.originForm.clone();
            function checkEveryday(){
//                console.log(self.createForm.find(".every_day_different span").attr("class"));
                return self.createForm.find(".every_day_different span").hasClass("which-date-clicked")
            };
            function checkWeekday(){
                var $weekday=self.createForm.find(".week_cycle_day span");
                for(var i=0;i<$weekday.size();i++){
                    var judge=$($weekday[i]).hasClass("which-date-clicked");
                    if(!judge){
                        return false;
                    }
                }
                return true;
            }
            this.createForm.find(".date_line").click(function(){
                var flag=$(this).hasClass('every_day_different');
                if(checkEveryday()){
                    if(flag){
                        $(this).find('span').toggleClass('which-date-clicked');
                    }else{
                        self.createForm.find(".every_day_different span").removeClass("which-date-clicked");
                        $(this).find('span').toggleClass('which-date-clicked');
                    }
                }else{
                    if(flag){
                        self.createForm.find(".date_line span").removeClass("which-date-clicked");
                    }
                    $(this).find('span').toggleClass('which-date-clicked');
                    setTimeout(function(){
                        if(checkWeekday()){
                            self.createForm.find(".date_line span").removeClass("which-date-clicked");
                            self.createForm.find(".every_day_different span").addClass("which-date-clicked");
                        }
                    },"500");
                }
            });
//            this.createForm.find("select#start_time").change(function(){
//                var start=$(this).val();
//                var selectEndTime=self.createForm.find("select#end_time");
//                var end=selectEndTime.val();
//                selectEndTime.empty();
//                if(parseInt(end)<=parseInt(start)){
//                    for(var i=parseInt(start)+1;i<=24;i++){
//                        var str="";
//                        if(i<=9){
//                            str="0"+i+":00";
//                        }else{
//                            str=i+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":i
//                        }).text(str).appendTo(selectEndTime);
//                    }
//                }else{
//                    for(var i=1;i<=24;i++){
//                        var str="";
//                        if(i<=9){
//                            str="0"+i+":00";
//                        }else{
//                            str=i+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":i
//                        }).text(str).appendTo(selectEndTime);
//                    }
//                    selectEndTime.val(end)
//                }
//            });
//            this.createForm.find("select#end_time").change(function(){
//                var end=$(this).val();
//                var selectStartTime=self.createForm.find("select#start_time");
//                var start=selectStartTime.val();
//                selectStartTime.empty();
//                if(parseInt(end)<=parseInt(start)){
//                    for(var j=parseInt(end)-1;j>=0;j--){
//                        var str="";
//                        if(j<=9){
//                            str="0"+j+":00"
//                        }else{
//                            str=j+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":j
//                        }).text(str).prependTo(selectStartTime);
//                    }
//                }else{
//                    for(var j=23;j>=0;j--){
//                        var str="";
//                        if(j<=9){
//                            str="0"+j+":00"
//                        }else{
//                            str=j+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":j
//                        }).text(str).prependTo(selectStartTime);
//                    }
//                    selectStartTime.val(start);
//                }
//            });
            new Button({
//                title: "提交",
                container:this.createForm.find("#point_submit_button"),
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                text:locale.get("submit"),
                events: {
                    click: this.onCreate,
                    scope: this
                }
            });
            new Button({
                container:this.createForm.find("#point_cancell_button"),
                "imgCls":"cloud-icon-no",
                text:locale.get("cancelText"),
                lang:"{text:cancelText}",
                events:{
                    click:function(){
                        $("#" + this.moduleName + "-add-button").trigger("click");
                        $("body").find("#mask-div-for-tagoverview").remove();
                    },
                    scope:this
                }
            });
            this.createForm.appendTo(this.element);
            validator.render(this.createForm,{
                promptPosition:"topRight"
            });
            locale.render({element:this.createForm});
            $("#" + this.moduleName + "-add-button").qtip({
                content: {
                    text: this.createForm
                },
                position: {
                    my: "top left",
                    at: "bottom middle"
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
                        $("#new-tag-name").focus();
                    },
                    show:function(){
                        $("body").append($("<div id='mask-div-for-tagoverview'></div>").css({
                            "width":"100%",
                            "height":"100%",
                            "background-color":"rgba(0,0,0,0.5)",
                            "position":"absolute"
                        }));
                        self.defaultFomrData(self.createForm);
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
            self.editForm=self.originForm.clone();
            self.editForm.find("#publshing_point_input").attr({
                "readonly":"readonly"
            });
            function checkEveryday(){
                //console.log(self.editForm.find(".every_day_different span").attr("class"));
                return self.editForm.find(".every_day_different span").hasClass("which-date-clicked")
            };
            function checkWeekday(){
                var $weekday=self.editForm.find(".week_cycle_day span");
                for(var i=0;i<$weekday.size();i++){
                    var judge=$($weekday[i]).hasClass("which-date-clicked");
                    if(!judge){
                        return false;
                    }
                }
                return true;
            }
            this.editForm.find(".date_line").click(function(){
                var flag=$(this).hasClass('every_day_different');
                if(checkEveryday()){
                    if(flag){
                        $(this).find('span').toggleClass('which-date-clicked');
                    }else{
                        self.editForm.find(".every_day_different span").removeClass("which-date-clicked");
                        $(this).find('span').toggleClass('which-date-clicked');
                    }
                }else{
                    if(flag){
                        self.editForm.find(".date_line span").removeClass("which-date-clicked");
                    }
                    $(this).find('span').toggleClass('which-date-clicked');
                    setTimeout(function(){
                        if(checkWeekday()){
                            self.editForm.find(".date_line span").removeClass("which-date-clicked");
                            self.editForm.find(".every_day_different span").addClass("which-date-clicked");
                        }
                    },"500");
                }
            });
//            this.editForm.find("select#start_time").change(function(){
//                var start=$(this).val();
//                var selectEndTime=self.editForm.find("select#end_time");
//                var end=selectEndTime.val();
//                selectEndTime.empty();
//                if(parseInt(end)<=parseInt(start)){
//                    for(var i=parseInt(start)+1;i<=24;i++){
//                        var str="";
//                        if(i<=9){
//                            str="0"+i+":00";
//                        }else{
//                            str=i+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":i
//                        }).text(str).appendTo(selectEndTime);
//                    }
//                }else{
//                    for(var i=1;i<=24;i++){
//                        var str="";
//                        if(i<=9){
//                            str="0"+i+":00";
//                        }else{
//                            str=i+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":i
//                        }).text(str).appendTo(selectEndTime);
//                    }
//                    selectEndTime.val(end)
//                }
//            });
//            this.editForm.find("select#end_time").change(function(){
//                var end=$(this).val();
//                var selectStartTime=self.editForm.find("select#start_time");
//                var start=selectStartTime.val();
//                selectStartTime.empty();
//                if(parseInt(end)<=parseInt(start)){
//                    for(var j=parseInt(end)-1;j>=0;j--){
//                        var str="";
//                        if(j<=9){
//                            str="0"+j+":00"
//                        }else{
//                            str=j+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":j
//                        }).text(str).prependTo(selectStartTime);
//                    }
//                }else{
//                    for(var j=23;j>=0;j--){
//                        var str="";
//                        if(j<=9){
//                            str="0"+j+":00"
//                        }else{
//                            str=j+":00"
//                        }
//                        $("<option></option>").attr({
//                            "value":j
//                        }).text(str).prependTo(selectStartTime);
//                    }
//                    selectStartTime.val(start);
//                }
//            });
            new Button({
//                title: "提交",
                container:this.editForm.find("#point_submit_button"),
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                text:locale.get("submit"),
                events: {
                    click: function(){
                        this.onUpdate()
                        $("#" + this.moduleName + "-edit-button").trigger("click");
                        $("body").find("#mask-div-for-tagoverview").remove();
                    },
                    scope: this
                }
            });
            new Button({
                container:this.editForm.find("#point_cancell_button"),
                "imgCls":"cloud-icon-no",
                text:locale.get("cancelText"),
                lang:"{text:cancelText}",
                events:{
                    click:function(){
                        $("#" + this.moduleName + "-edit-button").trigger("click");
                        $("body").find("#mask-div-for-tagoverview").remove();
//                        self.defaultFomrData(self.editForm);
                    },
                    scope:this
                }
            });
            this.editForm.appendTo(this.element);
            locale.render({element:this.editForm});
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
                        $("#edit-tag-name").focus();
                    },
                    show: function(event) {
                        //Only modify the first selected tag.
                        if (this.itembox.selectedItemsCount === 0) {
                            dialog.render({lang:"point_choose_tag"});
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
                            this.editForm.find("#publshing_point_input").val(selectedTag.name);
                            cloud.util.mask(".qtip-content");
                            cloud.Ajax.request({
                                url: "api/publish_point/" + selectedTag._id + "?verbose=100",
                                type: "GET",
                                success: function(data) {
                                    self.defaultFomrData(self.editForm,data.result);
                                    cloud.util.unmask(".qtip-content");
                                }.bind(this)
                            });
                        }

                    }.bind(this)
                },
                suppress:false
            });
        },
        mergeFormData:function(formElement){
            var name=formElement.find("#publshing_point_input").val();
            var priority=formElement.find("input[name='priority']:checked").val();
            var synchro_cycle=formElement.find("#cycle_choose").val();
            var synchro_period=[];
            var dataItem=formElement.find("#date_list_pick .which-date-clicked");
            for(var i=0;i<dataItem.size();i++){
                 synchro_period.push($(dataItem[i]).attr("value"))
            }
            if(synchro_period==7){
                synchro_period=[0,1,2,3,4,5,6];
            }
            synchro_period=synchro_period.join(",");
            var start_time=formElement.find("#start_time").val();
            var end_time=formElement.find("#end_time").val();
            if(start_time==end_time){
                var sync_time_interval="on weekday "+synchro_period;
            }else{
                var sync_time_interval="between hour "+start_time+" and "+end_time+" on weekday "+synchro_period;
            }
            var device_path=formElement.find("#local_directory").val();
            var data={
                name:name,
                priority:priority,
                syncCycleTime:synchro_cycle,
                syncTimeInterval:sync_time_interval,
                devicePath:device_path
            };
            return data;
        },
        defaultFomrData:function(formElement,data){
            if(data){
                formElement.find("#publshing_point_input").val(data.name);
                $("input[name='priority'][value="+data.priority+"]").attr("checked",true);
                formElement.find("#cycle_choose").val(data.syncCycleTime);
                var spanEle=formElement.find("#date_list_pick .date_detail").removeClass("which-date-clicked");
                var tempArray=data.syncTimeInterval.split(" ");
                if(tempArray[7]){
                    if(tempArray[7].indexOf(",")!=-1){
                        var weekdayArray=tempArray[7].split(",");
                    }else{
                        var weekdayArray=tempArray[7];
                    }
                }
                else if(tempArray[2]){
                    if(tempArray[2].indexOf(",")!=-1){
                        var weekdayArray=tempArray[2].split(",");
                    }else{
                        var weekdayArray=tempArray[2];
                    }
                }
                if(weekdayArray.length!=7){
                    for(var i=0;i<spanEle.length;i++){
                        var tempVal=$(spanEle[i]).attr("value");
                        if(weekdayArray.indexOf(tempVal)!=-1){
                            $(spanEle[i]).addClass("which-date-clicked");
                        }
                    }
                }else{
                    formElement.find(".every_day_different span").addClass("which-date-clicked");
                }
                formElement.find("#start_time").val(tempArray[2]);
                formElement.find("#end_time").val(tempArray[4]);
                formElement.find("#local_directory").val(data.devicePath);
            }else{
                formElement.find("#publshing_point_input").val(null);
                $("input[name='priority'][value='1']").attr("checked",true);
                formElement.find("#cycle_choose").val("15m");
                formElement.find("#date_list_pick .date_detail").removeClass("which-date-clicked");
                formElement.find("#date_list_pick .every_day_different span").addClass("which-date-clicked");
                var startOption="<option value='0'>00:00</option>" +
                    "<option value='1'>01:00</option>" +
                    "<option value='2'>02:00</option>" +
                    "<option value='3'>03:00</option>" +
                    "<option value='4'>04:00</option>" +
                    "<option value='5'>05:00</option>" +
                    "<option value='6'>06:00</option>" +
                    "<option value='7'>07:00</option>" +
                    "<option value='8'>08:00</option>" +
                    "<option value='9'>09:00</option>" +
                    "<option value='10'>10:00</option>" +
                    "<option value='11'>11:00</option>" +
                    "<option value='12'>12:00</option>" +
                    "<option value='13'>13:00</option>" +
                    "<option value='14'>14:00</option>" +
                    "<option value='15'>15:00</option>" +
                    "<option value='16'>16:00</option>" +
                    "<option value='17'>17:00</option>" +
                    "<option value='18'>18:00</option>" +
                    "<option value='19'>19:00</option>" +
                    "<option value='20'>20:00</option>" +
                    "<option value='21'>21:00</option>" +
                    "<option value='22'>22:00</option>" +
                    "<option value='23'>23:00</option>";
                var endOption="<option value='0'>00:00</option>" +
                    "<option value='1'>01:00</option>" +
                    "<option value='2'>02:00</option>" +
                    "<option value='3'>03:00</option>" +
                    "<option value='4'>04:00</option>" +
                    "<option value='5'>05:00</option>" +
                    "<option value='6'>06:00</option>" +
                    "<option value='7'>07:00</option>" +
                    "<option value='8'>08:00</option>" +
                    "<option value='9'>09:00</option>" +
                    "<option value='10'>10:00</option>" +
                    "<option value='11'>11:00</option>" +
                    "<option value='12'>12:00</option>" +
                    "<option value='13'>13:00</option>" +
                    "<option value='14'>14:00</option>" +
                    "<option value='15'>15:00</option>" +
                    "<option value='16'>16:00</option>" +
                    "<option value='17'>17:00</option>" +
                    "<option value='18'>18:00</option>" +
                    "<option value='19'>19:00</option>" +
                    "<option value='20'>20:00</option>" +
                    "<option value='21'>21:00</option>" +
                    "<option value='22'>22:00</option>" +
                    "<option value='23'>23:00</option>" +
//                    "<option value='24'>24:00</option>";
                formElement.find("#start_time").empty().append($(startOption));
                formElement.find("#end_time").empty().append($(endOption)).val("23");
            }
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
                var url="";
                if(tag.history=="log"){
                    url="api/content_sync/log";
                }else{
                    url="api/content_sync/publish";
                }
                tag.loadResourcesData = tag.loadResourcesData || function(start, limit, callback, context) {
                    cloud.Ajax.request({
                        url: url,
                        type: "get",
                        parameters: {
//                            "resource_type": resourceType,
                            cursor: start,
                            limit: limit,
                            publishPointId:tag._id
                        },
                        error: function(error){
                            if(error.error_code === 20006){
                                self.loadTags(false);
                            }
                        },
                        success: function(data) {

//                            data.result = data.result.pluck("id");

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
//            var name = $("#new-tag-name").val();
//            var is = this.checkKeywords(name);
//            var checkStr = /[^\u4e00-\u9fa5\da-zA-Z0-9\-\_]+/;
//            if(checkStr.test(name)){
//                dialog.render({lang:"tag_cant_be_input"});
//            }else if(is==false){
//                dialog.render({lang:"tag_no_input_keywords"});
//            }else{
//            }
//            return false;
            var name=self.createForm.find("#publshing_point_input").val();
            if (validator.result(self.createForm)) {
                if(name.length <= 30){
                    cloud.util.mask(".qtip-content");
                    var data=self.mergeFormData(self.createForm);
                    cloud.Ajax.request({
                        url: "api/publish_point",
                        type: "post",
                        data: data,
                        success: function(data) {
                            this.itembox.appendItems(this.processData(data.result));
                            this.itembox.items.values().pluck("widgets").pluck("favor").invoke("hide");
                            this.itembox.items.values().pluck("widgets").pluck("share").invoke("hide");
                            $("#" + this.moduleName + "-add-button").data("qtip").hide();
                            $("body").find("#mask-div-for-tagoverview").remove();
                            self.getPortalCOnfig();
                        }.bind(this)
                    });
                }else{
                    dialog.render({lang:"tag_length_only_in", buttons:[{lang:"yes",click:function(){$("#new-tag-name").val(null);dialog.close();}}]});
                }
            } else {
//                dialog.render({lang:"tag_cannot_be_empty"});
            }
        },
        //获取portal配置
        getPortalCOnfig:function(){
            var self=this;
            cloud.Ajax.request({
                url:"api/content_sync/public_config",
                type:"GET",
                success:function(data){
                    try{
                        self.formData=JSON.parse(data.result.frontEndConfig);
                    }catch (e){

                    }
                    if(!self.formData){
                        self.formData={
                            ssid:"",
                            homepage:"",
                            ip:true,
                            relogin:false,
                            relogin_period:"",
                            mode:{
                                one_click:false,
                                sms:false,
                                weixin:{
                                    weixin:true,
                                    randomNumber:""
                                },
                                weibo:false,
                                qq:false
                            }
                        }
                    }
                    self.getAllPublishPoint();
                },
                error:function(){
                    self.disableInput();
                    self.getUrlButton.hide();
                    cloud.util.unmask("#ui-window-content");
                }
            });
        },
        //获取所有发布点信息
        getAllPublishPoint:function(){
            var self=this;
            cloud.Ajax.request({
                url:"api/publish_point",
                type:"GET",
                parameters:{
                    verbose:100,
                    limit:0,
                    status:1
                },
                success:function(data){
                    self.allPublishPoint=data.result;
                    self.mergePortalConfig();
                },
                error:function(err){

                }
            });
        },
        //更新portal配置
        mergePortalConfig:function(){
            var self=this;
            self.templateStrUpdateSsid="no dot11 ssid #{oldSsid}\r\n";
            self.templateStrWithoutPortal="dot11 ssid #{ssid}\r\n"+
                "!\r\n"+
                "interface dot11radio 1\r\n"+
                "ssid #{ssid}\r\n"+
                "!\r\n"+
                "!\r\n"+
                "portal homepage #{homepage}\r\n"+
                "!\r\n";
            self.templateStrWithHostIp="!\r\n"+
                "ip host #{homepage} 192.168.3.1\r\n"+
                "!\r\n";
            self.templateStrNoHostIp="!\r\n"+
                "no ip host #{homepage}"+
                "!\r\n";
            self.templateStrWithPeriod="portal relogin-period #{relogin_period}\r\n"+
                "!\r\n";
            self.templateStrNoPeriod="no portal relogin-period\r\n"+
                "!\r\n";
            self.templateAuthenticationModeYes="portal authentication mode #{mode}\r\n";
            self.templateAuthenticationModeNo="no portal authentication mode #{mode}\r\n";
            self.templateStrPortal="remote-sync #{name} flag rainbow\r\n"+
                "local directory #{devicePath}\r\n"+
                "priority #{priority}\r\n"+
                "!\r\n"+
                "chronos #{name}.rsync every-minutes #{syncCycleTime} #{syncTimeInterval} \r\n"+
                "!\r\n";
            self.templateStrEnd="write\r\n#end";
            var result_1="";
            var template_1=new Template(self.templateStrWithoutPortal);
            result_1=result_1+template_1.evaluate(self.formData);
            if(self.formData.ip){
                var template_2=new Template(self.templateStrWithHostIp);
                var result_2=template_2.evaluate(self.formData);
                result_1=result_1+result_2;
            }else{
                var template_2=new Template(self.templateStrNoHostIp);
                var result_2=template_2.evaluate(self.formData);
                result_1=result_1+result_2;
            }
            if(self.formData.relogin){
                var template_3=new Template(self.templateStrWithPeriod);
                var result_3=template_3.evaluate(self.formData);
                result_1=result_1+result_3;
            }else{
                var result_3=self.templateStrNoPeriod;
                result_1=result_1+result_3;
            }
            var result_4="no remote-sync\r\nno chronos\r\n";
            self.allPublishPoint.each(function(one){
                if(one.priority==1){
                    one.priority="high";
                }else if(one.priority==2){
                    one.priority="medium";
                }else if(one.priority==3){
                    one.priority="low";
                }
                one.syncCycleTime=one.syncCycleTime/(1000*60);
                var template_4=new Template(self.templateStrPortal);
                var result=template_4.evaluate(one);
                result_4=result_4+result;
            });
            result_1=result_1+result_4;
            if(self.formData.mode.one_click){
                var templateMode=new Template(self.templateAuthenticationModeYes);

            }else{
                var templateMode=new Template(self.templateAuthenticationModeNo);
            }
            var tempObj={};
            tempObj.mode="one-click";
            var result_5=templateMode.evaluate(tempObj);
            if(self.formData.mode.sms){
                templateMode=new Template(self.templateAuthenticationModeYes);
            }else{
                templateMode=new Template(self.templateAuthenticationModeNo);
            }
            tempObj.mode="sms";
            result_5=result_5+templateMode.evaluate(tempObj);
            if(self.formData.mode.weixin.weixin){
                templateMode=new Template(self.templateAuthenticationModeYes);
            }else{
                templateMode=new Template(self.templateAuthenticationModeNo);
            }
            tempObj.mode="weixin";
            result_5=result_5+templateMode.evaluate(tempObj);
            if(self.formData.mode.weibo){
                templateMode=new Template(self.templateAuthenticationModeYes);
            }else{
                templateMode=new Template(self.templateAuthenticationModeNo);
            }
            tempObj.mode="weibo";
            result_5=result_5+templateMode.evaluate(tempObj);
            if(self.formData.mode.qq){
                templateMode=new Template(self.templateAuthenticationModeYes);
            }else{
                templateMode=new Template(self.templateAuthenticationModeNo);
            }
            tempObj.mode="qq";
            result_5=result_5+templateMode.evaluate(tempObj);
            result_5=result_5+"!\r\n";
            self.formData.config=result_1+result_5+self.templateStrEnd;
            self.updateConfig();
        },
        //更新portal配置
        updateConfig:function(){
            var self=this;
            cloud.Ajax.request({
                url:"api/content_sync/public_config",
                type:"POST",
                data:{
                    config:self.formData.config,
                    frontEndConfig:JSON.stringify(self.formData)
                },
                success:function(data){
                    self.formData=self.data;
                    cloud.util.unmask(".qtip-content");
//                    cloud.util.unmask("#portal_config_wrapper");
                },
                error:function(err){
                    cloud.util.unmask(".qtip-content");
                }
            })
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
                                    cloud.util.mask("body");
                                    cloud.Ajax.request({
                                        url: "api/publish_point/" + tag.options._id,
                                        type: "delete",
                                        success: (function() {
                                            self.getPortalCOnfig();
                                            //TODO: delete tag from call api.
                                            self.itembox.deleteItems(tag);
//      	                                          self.itembox.switchToSelectStatus();
//      	                                          self.itembox.items.values().first().element.click();
//      	                                          self.itembox.selectMode = false;
                                            self.refresh();
                                            cloud.util.unmask("body");
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
                dialog.render({lang:"point_choose_tag"});
            }
        },

        /*
         * Update event
         */
        onUpdate: function() {
            var self=this;
            var name=self.editForm.find("#publshing_point_input").val();
            var selectedTag = self.itembox.getSelectedItems().first().options.data;
            var data=self.mergeFormData(self.editForm);
            cloud.util.mask(".qtip-content");
            cloud.Ajax.request({
                url:"api/publish_point/"+selectedTag._id,
                type:"PUT",
                data:data,
                success:function(returnData){
//                    self.defaultFomrData(self.editForm,returnData.result);
                    self.getPortalCOnfig();
                }
            })
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
                    cloud.util.unmask("body");
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