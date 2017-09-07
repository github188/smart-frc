define(function(require) {
	require("cloud/base/cloud");
	var Table = require("../../template/tableforuser");
	//var Info = require("./info");
	var Button = require("cloud/components/button");
	var _Window = require("cloud/components/window");
	var service = require("./service");
    var validator=require("cloud/components/validator");
    var groupDropList=require("./groupDropList");
    var loginhistory=require("./loginhistory");
    require("cloud/lib/plugin/jquery.multiselect");
    require("./createGroup.css");
    require("./usermanagement.css");
//	var TagManager = require("../../components/tag-manager");
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
	var columns = [{
		"title": "账号",
		"lang":"text:account",
		"dataIndex": "name",
		"cls": null,
		"width": "20%",
//        render:function(value,type){
//            if(type=="display"){
//                var position=value.indexOf("(");
//                if(position!=-1){
//                    value=value.slice(0,position);
//                }
//                return value
//            }else{
//                return value;
//            }
//        }
	},{
		"title": "账号类型",
		"dataIndex": "type",
		"lang":"text:account_type",
		"cls": null,
		"width": "15%",
        render:function(value,type){
            if(type=="display"){
                var typeStr="";
                switch(value){
                    case 1:
                        typeStr=locale.get("phone_account_user");
                        break;
                    case 2:
                        typeStr=locale.get("sns_account_user");
                    default :
                        break;
                };
                return typeStr;
            }
        }
	},{
        "title": "用户来源",
        "dataIndex": "asType",
        "lang":"text:user_origin",
        "cls": null,
        "width": "10%",
        render:function(value,type,obj){
            if(type=="display"){
                var str= "";
                if(obj.type == 1){//phone
                    str = locale.get("phone_number");
                }else if(obj.type == 2){//sns
                    switch (value){
                        case 1:
                            str = locale.get("tencent");
                            break;
                        case 2:
                            str = locale.get("baidu");
                            break;
                        case 3:
                            str = locale.get("sina");
                            break;
                        case 4:
                            str = locale.get("netease");
                            break;
                        case 5:
                            str = locale.get("weichat_code");
                            break;
                        case 6:
                            str = locale.get("no_auth");
                            break;
                        case 7:
                            str = locale.get("weichat_fans");
                            break;
                    }
                }
                return str;
            }
        }
    },
        {
		title: "注册时间",
		"lang":"{text:registration_time}",
		"dataIndex": "createTime",
		width: "20%",
		render: function (value, type) {
			if(type === "display"){
                return  dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
			}else{
				return value;
			}
		}
	},{
		"title": "最后一次登录时间",
		"lang":"{text:connection_time}",
		"dataIndex":"lastLogin",
		"cls": null,
		"width": "20%",
        render: function (value, type) {
            if(type === "display"){
                if(value){
                    return  dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
                }
            }else{
                return value;
            }
        }
	},{
        "title":"登录总次数",
        "lang":"{text:flow_used}",
        "dataIndex":"totalLogin",
        "cls":null,
        "width":"15%"
    }
//        {
//        "title":"MAC地址",
//        "lang":"{text:mac_address}",
//        "dataIndex":"mac",
//        "width":"25%"
//    }
    ];
	var UserTable = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			var self = this;
//			this.beforVerifyUsers();
			 permission.judge(["_user","read"],function(){
				 if((permission.getInfo())["roleType"] <= 51){
                     self.createTemplate();
//					 self.addToolbarItems();
					 self.window = null;
					 self.permission();
                     self.getToolbar();
                     self._renderSearch(self.toolbar);
                     $("#tag-overview-itembox").find(".cloud-item").live("click",function(){
                         $("#toolbar-search-box").show();
                     });
					 locale.render({element:self.element});
				 }
			 });
		},
        createTemplate:function(){
            var self=this;
            self.tableTemplate = new Table({
                filters : {
                    "delete" : function(res){
//                        return self.verifyUsers(res);
                    }
                },
                events:{
                    "afterSelect":function(resources){
                        if(resources.length>0){
                            self.tableTemplate.modules.content.createGroupButton.show();
                            self.tableTemplate.modules.content.moveToGroupButton.show();
                        }
                        else{
                            self.tableTemplate.modules.content.createGroupButton.hide();
                            self.tableTemplate.modules.content.moveToGroupButton.hide();
                            if(self.dropList){
                                self.dropList.destroy();
                                self.dropList=null;
                            }
                        }
                        var targets = resources.findAll(function(oneres){
                            return oneres.blackOrWhite==0;
                        });
                        if(targets.length>0){
                            self.tableTemplate.modules.content.deleteFromBlackListButton.hide();
                        }else if(targets.length==0&&resources.length!=0){
                            self.tableTemplate.modules.content.deleteFromBlackListButton.show();
                        }else{
                            self.tableTemplate.modules.content.deleteFromBlackListButton.hide();
                        }
                    },
                    //create group event
                    "createGroup":function(){
                        var resources=self.tableTemplate.modules.content.getSelectedResources();
                        self.window = new _Window({
                            container: "body",
                            title: locale.get({lang:"create_group"}) + "(" + locale.get("account_number") + ":"+resources.length+")",
                            top: "center",
                            left: "center",
                            height: 400,
                            width: 700,
                            mask: true,
                            drag:true,
                            content: "<div id='winContent'></div>",
                            events: {
                                "onClose": function() {
                                    self.window.destroy();
                                    cloud.util.unmask(self.element);
                                },
                                scope: this
                            }
                        });
                        self.window.show();
                        self.editForm = $("<form>").addClass(this.moduleName + "-edit-form ui-helper-hidden tag-overview-form").css({
                            "margin":"20px auto",
//                                     "border":"1px solid rgb(222,222,222)",
                            "width":"400px",
                            "border-radius":"2px",
                            "padding-left":"10px"
                        });
                        var htmlStr="<ul class='edit_form_ul'>" +
                            "<li class='form-line-same-one'><lable lang='text:group' for='group_name_input'>组名</lable><input id='group_name_input' type='text' class='validate[required,custom[giveName]]'/></li>"+
                            "<li class='form-line-same-one li-span-different'><lable lang='text:network_priority'>网络优先级</lable>" +
                            "<input type='radio' name='network_priority_input' value='3'/><span lang='text:lowlevel'>低</span>" +
                            "<input type='radio' name='network_priority_input' value='2' checked='checked'/><span lang='text:middlelevel'>中</span>" +
                            "<input type='radio' name='network_priority_input' value='1'/><span lang='text:highlevel'>高</span>" +
                            "</li>"+
                            "<li class='form-line-same-one' style='width:383px'><lable lang='text:flow_limit' for='flow_limit_input'>流量限制</lable><span lang='text:flow_unit' style='float:right;margin-right:-3px;line-height: 25px'>(MB/M)</span><input type='text' id='flow_limit_input' style='margin-right: 4px' class='validate[custom[number]]'/></li>"+
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
                            }).end().appendTo(self.editForm);
                        }else if(locale.current()==1){
                            $(htmlStr).find("p.paragraph_1").css({
                                "margin-left":"160px"
                            }).end().find("p.paragraph_2").css({
                                    "margin-left":"146px"
                                }).end().appendTo(self.editForm);
                        }
//                        $(htmlStr).appendTo(self.editForm);
                        new Button({
                            // text: "提交",
                            container: self.editForm.find(".saveBtn_container"),
                            text:locale.get("submit"),
                            imgCls: "cloud-icon-yes",
                            lang:"{title:submit}",
                            events: {
                                click: self.submit,
                                scope: self
                            }
                        });
                        new Button({
                            // text: "取消",
                            container: self.editForm.find(".cancellBtn_container"),
                            text:locale.get("cancelText"),
                            imgCls: "cloud-icon-no",
                            lang:"{title:cancelText}",
                            events: {
//                    click: this.onCreate,
                                click:function(){
                                    self.window.destroy();
                                },
                                scope: self
                            }
                        });
                        self.editForm.appendTo($("#winContent").css('height','280px')).show();
                        self.initValidator();
                        locale.render({element:self.editForm});
                    },
                    "moveToGroup":function(event){
                        var resources=self.tableTemplate.modules.content.getSelectedResources();
                        var top,left;
                        left=event.clientX+"px";
                        top=event.clientY+"px";
                        if(self.dropList){
                            self.dropList.destroy();
                            self.dropList=null;
                        };
                        if(resources&&resources.length!=0){
                           self.dropList=new groupDropList({
                            "selector":$("body"),
                                "clickedItem":self.tableTemplate.modules.tag.itembox.getClickedItem(),
                                events:{
                                "afterclick":function(data){
                                    //这里将会进行“移动到”的数据更新
//                                    console.log(data);
                                    var resources=self.tableTemplate.modules.content.getSelectedResources();
                                    if(data.id&&data.id!=2){
                                        for(var i=0;i<resources.length;i++){
                                            var dataTemp={};
                                            dataTemp.groupId=data.id;
                                            cloud.Ajax.request({
                                                url:"api/wifi_user/"+resources[i]._id,
                                                type:"PUT",
                                                data:dataTemp,
                                                success:function(data){
                                                    self.tableTemplate.modules.content.refreshPage(self.tableTemplate.modules.content.nowPage,self.tableTemplate.modules.content.total);
                                                    self.tableTemplate.modules.content.createGroupButton.hide();
                                                    self.tableTemplate.modules.content.moveToGroupButton.hide();
//                                                    self.tableTemplate.reloadTags(true);
                                                    self.tableTemplate.modules.content.deleteFromBlackListButton.hide();
                                                },
                                                error:function(err){
                                                    dialog.render({lang:err.error_code});
                                                }
                                            });
                                        }
                                }else if(data.id==2){
                                        for(var i=0;i<resources.length;i++){
                                            var dataTemp={};
                                            dataTemp.uid=resources[i]._id;
                                            dataTemp.name=resources[i].username;
                                            dataTemp.type=data.id;
                                            dataTemp.blackOrWhite=1;
                                            cloud.Ajax.request({
                                                url:"api/black_white",
                                                type:"POST",
                                                data:dataTemp,
                                                success:function(data){
                                                    self.tableTemplate.modules.content.refreshPage(self.tableTemplate.modules.content.nowPage,self.tableTemplate.modules.content.total);
                                                    self.tableTemplate.modules.content.createGroupButton.hide();
                                                    self.tableTemplate.modules.content.moveToGroupButton.hide();
//                                                    self.tableTemplate.reloadTags(true);
                                                    self.tableTemplate.modules.content.deleteFromBlackListButton.hide();

                                                },
                                                error:function(err){
                                                    dialog.render({lang:err.error_code});
                                                }
                                            })
                                        }

                                    }
                                }
                            }
                        });
                            self.dropList.dropListPannel.css({
                                "top":top,
                                "left":left
                            });
                        }
                    },
                    deleteBlack:function(){
                        var resources=self.tableTemplate.modules.content.getSelectedResources();
                        if(resources&&resources.length!=0){
                            var dataTemp={};
                            dataTemp.blackOrWhite="0";
                            cloud.Ajax.request({
                                url:"api/black_white",
                                type:"GET",
                                dataType:"JSON",
                                parameters:{
                                    type:2,
                                    blackOrWhite:1,
                                    verbose:100,
                                    start:0,
                                    limit:0
                                },
                                success:function(data){
                                    var ids=[];
                                    data.result.each(function(black){
                                        resources.each(function(user){
                                            if(black.userId==user._id){
                                                ids.push(black._id);
                                            }
                                        })
                                    });
                                    for(var i=0;i<ids.length;i++){
                                        cloud.Ajax.request({
                                            url:"api/black_white/"+ids[i],
                                            type:"DELETE",
                                            success:function(data){
                                                self.tableTemplate.modules.content.refreshPage(self.tableTemplate.modules.content.nowPage,self.tableTemplate.modules.content.total);
                                                self.tableTemplate.modules.content.createGroupButton.hide();
                                                self.tableTemplate.modules.content.moveToGroupButton.hide();
                                                self.tableTemplate.modules.content.deleteFromBlackListButton.hide();
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    },
                    "afterRowClick":function(id,data){
                        this.LoginHistoryWindow=new loginhistory({
                            data:data,
                            selector:"body"
                        })
                    }
                },
                contentColumns: columns,
                selector: self.element,
                service: service
            });
        },
        initValidator:function(){
            var self=this;
            validator.render(self.editForm,{
                promptPosition:"topRight"
            });
        },
        getToolbar:function(){
          this.toolbar=this.tableTemplate.getToolbar();
        },
		permission:function(){
			var self = this;
			if(!(permission.app("_user"))["write"]){
				self.tableTemplate.modules.content.addBtn.hide();
				self.tableTemplate.modules.content.deleteBtn.hide();
			}
		},

        /*
         *before createGroup to submit,get form data to Object
         */
        mergeFormData:function(){
            var priority=$("#winContent .edit_form_ul :checked").val();
            var flow_limit=$("#winContent #flow_limit_input").val()*1024;
            var time_limit=$("#winContent #online_time_limit_input").val();
            var speed_limit_upstream=$("#winContent #upstream_limit_input").val();
            var speed_limit_downstream=$("#winContent #downstream_limit_input").val();
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
        submit when submitButton clicked
         */
		submit:function(){
            var self=this;
            var resources=self.tableTemplate.modules.content.getSelectedResources();
            if(validator.result(self.editForm)){
                var data=self.mergeFormData();
                var name=$("#winContent #group_name_input").val();
                cloud.Ajax.request({
                    url:"api/wifi_user_group",
                    type:"POST",
                    parameters:{
                      name:name
                    },
                    data:data,
                    success:function(data){
                        self.tableTemplate.reloadTags(true);
                        self.window.destroy();
                        var length=resources.length;
                        for(var i=0;i<length;i++){
                            var dataTemp={};
                            dataTemp.groupId=data.result._id;
                            cloud.Ajax.request({
                                url:"api/wifi_user/"+resources[i]._id,
                                type:"PUT",
                                data:dataTemp,
                                success:function(data){
                                    self.tableTemplate.modules.content.refreshPage(self.tableTemplate.modules.content.nowPage,self.tableTemplate.modules.content.total);
                                    self.tableTemplate.modules.content.createGroupButton.hide();
                                    self.tableTemplate.modules.content.moveToGroupButton.hide();
                                    self.tableTemplate.reloadTags(true);
                                }
                            });
                        }
                    },
                    error:function(error){

                    }
                })
            }
        },
        //创建搜索框方法
        _renderSearch:function(toolbar){
            var self=this;
            var elements={
                box:"toolbar-search-box",
//                hint:"toolbar-search-hint",
                input:"toolbar-search-input",
                button:"toolbar-search-button"
            };
            //画出搜索框
            var toolbarElement="#"+toolbar.id;
            var toolbarLeftElement="."+$(toolbar["leftDiv"][0]).attr("class");
            var toolbarRightElement="."+$(toolbar["rightDiv"][0]).attr("class");
            var searchBox=$("<form>").attr("id",elements.box).attr("class",elements.box);
//            var $hint=$("<input>").attr("type","text").attr("id",elements.hint).attr("class",elements.hint).attr("lang","value:enter_the_mobile_number");
            var $input=$("<input>").attr("type","text").attr("id",elements.input).attr({"class":elements.input,"placeholder":locale.get("enter_the_mobile_number")});
            var $button=$("<input>").attr("type","button").attr("id",elements.button).attr("class",elements.button);
            //添加复选栏     zyl
            var $sortText = $("<span class='toolbar-sort-text' lang='text:user_origin+:'></span>")
            var $select = $("<select class='toolbar-sort-multiselect' multiple='multiple'>" +
                "<option value='0' lang='text:phone_number' selected='selected'></option>" +
                "<option value='1' lang='text:tencent' selected='selected'></option>" +
                "<option value='2' lang='text:baidu' selected='selected'></option>" +
                "<option value='3' lang='text:sina' selected='selected'></option>" +
                "<option value='4' lang='text:netease' selected='selected'></option>" +
                "<option value='5' lang='text:weichat_code' selected='selected'></option>" +
                "<option value='6' lang='text:no_auth' selected='selected'></option>" +
                "<option value='7' lang='text:weichat_fans' selected='selected'></option>" +
                "</select>");

            $(toolbarElement).find(toolbarLeftElement).after($select).after($sortText);
            locale.render($(toolbarElement));

            $select.multiselect({
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

            this.selection = $select;


            var input_value="";
            searchBox.append($input).append($button);
            $(toolbarElement).find(toolbarLeftElement).after(searchBox);
            var updateCount=function(returnData){
                var contentTable=self.tableTemplate.modules.content;
                var display=contentTable.display;
                var currentCount;
                if(returnData.total<=display){
                    currentCount=returnData.total;
                }
                else{
                    currentCount=display;
                }
                contentTable.selectedCount=0;
                contentTable.total=returnData.total;
                contentTable.totalCount=currentCount;
                contentTable.updateCountInfo();
            };
            var refreshPage=function(data){
                var contentTable=self.tableTemplate.modules.content;
                contentTable.page.reset(data);
                self.tableTemplate.modules.content.renderRowBackgroundColor();
//					contentTable._renderPaging(Math.ceil(total/display),1,display);
                service.getResourcesIds=function(start, limit, callback, context) {
                    cloud.Ajax.request({
                        url : "api/wifi_user",
                        type : "get",
                        parameters:{
                            groupId:self.current_item.options._id,
                            name:inputValue,
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
            //为搜索框定义事件
//            $("#"+elements.hint).click(function(){
//                $(this).hide();
//                $("#"+elements.input).show().focus();
//            });
            var searchFunction=function(){
                self.tableTemplate.service.getResourcesIds=service.getResourcesIds;
                var display=self.tableTemplate.modules.content.display;
                cloud.util.mask(self.element);
//                $("#"+elements.hint).hide();
//                $("#"+elements.input).show().focus();
                var pattern=/^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/i;
                var inputValue=$("#" + elements.input).val().replace(/\s/g,"");
                var asTypes = self.selection.multiselect("getChecked").map(function(){
                    return this.value;
                }).get();
                var type;
                if(asTypes[0]==0 && asTypes.length > 1){//type = 1,2
                    asTypes = asTypes.without(0).toString();
                    type = "1,2";
                }else if(asTypes[0]==0 && asTypes.length == 1){//type = 1
                    asTypes = "";
                    type = "1";
                }else if(asTypes[0]!=0){//type = 2
                    asTypes = asTypes.toString();
                    type = "2"
                }else if(asTypes.length == 0){
                    asTypes = "";
                    type = ""
                }


                if(inputValue===""){
                    self.current_item=self.tableTemplate.modules.tag.itembox.getClickedItem();
                    self._getData({
                        groupId:self.current_item.options._id,
                        name:inputValue,
                        verbose:100,
                        limit:display,
                        type :type,
                        as_type:asTypes
                    },function(returnData){
                        self.tableTemplate.modules.content.content.clearTableData();
                        self.tableTemplate.modules.content.content.render(returnData.result);
                        updateCount(returnData);
                        refreshPage(returnData);
                        cloud.util.unmask(self.element);
                    });
                }
                else{
                    inputValue=inputValue.match(pattern);
                    if(inputValue===null){
                        self.current_item=self.tableTemplate.modules.tag.itembox.getClickedItem();
                        self._getData({
                            groupId:self.current_item.options._id,
                            name:"",
                            verbose:100,
                            limit:display,
                            type :type,
                            as_type:asTypes
                        },function(returnData){
                            self.tableTemplate.modules.content.content.clearTableData();
                            self.tableTemplate.modules.content.content.add(returnData.result);
                            updateCount(returnData);
                            refreshPage(returnData);
                            cloud.util.unmask(self.element);
                        });
                    }
                    else{
                        inputValue=inputValue.toString();
                        self.current_item=self.tableTemplate.modules.tag.itembox.getClickedItem();
                        self._getData({
                            groupId:self.current_item.options._id,
                            name:inputValue,
                            verbose:100,
                            limit:display,
                            type :type,
                            as_type:asTypes
                        },function(returnData){
                            self.tableTemplate.modules.content.content.clearTableData();
                            self.tableTemplate.modules.content.content.add(returnData.result);
                            updateCount(returnData);
                            refreshPage(returnData);
                            cloud.util.unmask(self.element);
                        });
                    }
                }
            };
            $("#"+elements.button).click(function(){
//                self.tableTemplate.modules.content.content.clearTableData();
//                console.log(self.tableTemplate.modules.content.content.getRows());
//                console.log(self.tableTemplate.modules.content.content.getData());
                searchFunction();
            });
            $("#"+elements.input).keypress(function(event){
                if(event.keyCode==13){
                    searchFunction();
                    return false;
                }
            });
        },

        _getData:function(opt,callback,context){
            if(!opt.as_type){
                delete opt.as_type;
            }
            if(!opt.type){
                delete opt.type;
            }

            cloud.Ajax.request({
                url:"api/wifi_user",
                parameters:opt,
                success:function(returnData){

                    callback.call(context || this, returnData);
                }
            })
        },
		destroy: function() {
//			this.tableTemplate.destroy();
//			this.tableTemplate.element.empty();
//			this.tableTemplate = null;
			$(this.element).empty();
		}
		
	});
	return UserTable;

});