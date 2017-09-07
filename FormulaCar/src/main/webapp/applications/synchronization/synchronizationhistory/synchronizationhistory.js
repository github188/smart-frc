/**
 * Created by zhouyunkui on 14-6-13.
 */
define(function(require) {
    require("cloud/base/cloud");
    var Table = require("../../template/tableforsynchro");
    //var Info = require("./info");
    var Button = require("cloud/components/button");
//    var _Window = require("cloud/components/window");
    var service = require("./service");
    var validator=require("cloud/components/validator");
    var DeviceSynchroHistory=require("./devicehistorytable");
    require("cloud/lib/plugin/jquery.multiselect");
    var shortcutversion=function(opt,type){
        if(type=="display"){
            var pos=opt.lastIndexOf("_");
            if(pos>0){
                var shortCut=opt.slice(0,pos);
            }
            return shortCut;
        }else{
            return opt
        }
    };
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
    var unitConversion = function(opt,type){
        if(type === "display"){
            if ( typeof opt === "number"){
                if(opt<1000){
                    return opt.toFixed(0)+"B";
                }else if(opt<1000000){
                    return (opt/1024).toFixed(3)+"KB";
                }else{
                    return (opt/1024/1024).toFixed(3)+"MB";
                }
            }else{
                return opt;
            }
        }else{
            return opt;
        }
    };
    var columns = [{
        "title":"设备名",
        "dataIndex":"deviceName",
        "lang":"text:device_name",
        "width":"15%"
    },{
        "title": "组名",
        "dataIndex": "groupName",
        "lang":"text:group",
        "cls": null,
        "width": "10%"
    },{
        "title":"执行人",
        "dataIndex":"operationUserName",
        "lang":"text:synchro_excutor",
        "cls":null,
        "width":"15%"
    },{
        "title":"完成状态",
        "lang":"{text:final_status}",
        "dataIndex":"state",
        "width":"7%",
        render:function(value,type){
            if(type=="display"){
                switch (value){
                    case 2:
                        return locale.get("synchro_success");
                    break;
                    case 1:
                        return locale.get("synchronizing");
                    break;
                    case 0:
                        return locale.get("synchro_failed");
                    break;
                    default :
                        break;
                }
            }else{
                return value;
            }
        }
    },{
        "title": "当前版本",
        "lang":"text:current_version",
        "dataIndex": "currentVersion",
        "cls": "",
        "width": "15%",
        render:shortcutversion
    },{
        title: "同步版本",
        "lang":"text:synchro_version",
        "dataIndex": "syncVersion",
        width: "15%",
        render:shortcutversion
    }, {
        title: "版本大小",
        "lang":"{text:version_size}",
        "dataIndex": "fileSize",
        width: "8%",
        render: unitConversion
    },{
        "title": "开始时间",
        "lang":"{text:start_time}",
        "dataIndex":"syncStartTime",
        "cls": null,
        "width": "15%",
        render:function(value,type){
            if(type='display'){
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm:ss");
            }else{
                return value;
            }
        }
    }];
    var UserTable = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            var self = this;
//            this.beforVerifyUsers();
//            permission.judge(["_user","read"],function(){
//                if((permission.getInfo())["roleType"] <= 51){
                    self.createTemplate();
//					 self.addToolbarItems();
                    self.window = null;
                    self.permission();
                    self.getToolbar();
                    self._renderNoticeBar();
//                    setTimeout(function(){self.editBtn.hide()},200);
                    locale.render();
//                }
//            });
//            locale.render();
        },
        _renderNoticeBar:function(){
            var self=this;
            var spanEle=$("<span lang='text:state+:'></span>").css({
                "margin-top":"5px"
            });
            self.stateEle=$("<select id='synchro_state' multiple='multiple'>" +
                "<option value='1' lang='text:synchronizing'>"+locale.get("synchronizing")+"</option>" +
//                "<option value='0' lang='text:synchro_failed'>"+locale.get("synchro_failed")+"</option>"+
                "<option value='2' lang='text:synchro_success'>"+locale.get("synchro_success")+"</option>"+
                "</select>").css({
                    "margin-top":"-8px",
                    "margin-left":"10px"
                });
            self.inputEle=$("<input type='text' />").css({
                "margin-top":"3px",
                "margin-left":"10px",
                "margin-right":"10px",
                "width":"200px"
            }).attr({
                    "placeholder":locale.get("device_name")
                });
            var queryBtn=new Button({
                text:locale.get("query"),
                events:{
                    //TODO
                    //click:self.handleClick
                    click:function(){
                        cloud.util.mask("body");
                        self.temParam=self.getSelectParams();
                        self.tempData={};
                        self.current_item=self.tableTemplate.modules.tag.itembox.getClickedItem();
                        self.tempData.publishPointId=self.current_item.options._id;
                        //在此存在state为数组的问题
                        if(self.temParam.state.length==1){
                            self.tempData.state=self.temParam.state[0];
                        }
                        if(!self.temParam.deviceName.empty()){
                            self.tempData.deviceName=self.temParam.deviceName;
                        }
                        self.tempData.cursor=0;//self.tableTemplate.modules.content.nowPage-1;
                        self.tempData.limit=self.tableTemplate.modules.content.display;
                        cloud.Ajax.request({
                            url:"api/content_sync/log",
                            type:"GET",
                            parameters:self.tempData,
                            success:function(data){
                                cloud.util.unmask("body");
                                self.tableTemplate.modules.content.content.render(data.result);
//                                self.tableTemplate.modules.content.refreshPage(1,data.total);
                                self.tableTemplate.modules.content._renderpage(data,1);
                                service.getResourcesIds=function(cursor,limit,callback,context){
                                    self.tempData.cursor=cursor;
                                    self.tempData.limit=limit;
                                      cloud.Ajax.request({
                                          url:"api/content_sync/log",
                                          type:"GET",
                                          parameters:self.tempData,
                                          success:function(data){
                                              callback.call(context||this,data);
                                          }
                                      })
                                };
                                service.getTableResources=function(cursor,limit,callback,context){
                                    cloud.util.mask("body");
                                    if (this.lastGetResroucesRequest) {
                                        this.lastGetResroucesRequest.abort();
                                    }
                                    var self = this;
                                    service.getResourcesIds(cursor,limit, function(data) {
                                        self.lastGetResroucesRequest = null;
                                        callback.call(context || this, data);
                                        cloud.util.unmask("body");
                                    }, this);
                                };
                            }
                        })
                    }
                }
            });
            var exportBtn=new Button({
                text:locale.get("export"),
                events:{
//                    TODO
//                    click:self.export
                }
            });
            var defautMutiselectCfg = {
                checkAllText:locale.get({lang:"check_all"}),
                uncheckAllText:locale.get({lang:"uncheck_all"}),
                noneSelectedText:locale.get({lang:"please_select"}),
                selectedText: "# " + locale.get({lang:"is_selected"}),
                minWidth:160,
//                checkAll : self.renderByParams.bind(self),
//                uncheckAll : self.renderByParams.bind(self),
//                click : self.renderByParams.bind(self),
                open:function(){
                    $(".ui-multiselect-menu").width(180);
                }
            };
            self.toolbar.appendLeftItems([spanEle,self.stateEle,self.inputEle,queryBtn/*,exportBtn*/]);
            $(".cloud-toolbar-item").css({
                "height":"20px",
                "line-height":"20px"
            });
            $("#content-table-toolbar").css({
                "height":"35px"
            });
            $("#content-table-toolbar").find("a").css({
                "margin-top":"-4px",
                "margin-left":"15px"
            })
            self.stateEle.multiselect(cloud.util.defaults({
                height:70
            },defautMutiselectCfg))
        },
        getSelectParams:function(){
            var stateSelect = this.stateEle;
            var state = stateSelect.multiselect("getChecked").map(function(){
                return parseFloat(this.value);
            }).get();

            var device_name = this.inputEle.val();
            return {
                "state" : state,
                "deviceName" : device_name
            };

        },
        createTemplate:function(){
            var self=this;
            self.tableTemplate = new Table({
                filters : {
                    "delete" : function(res){
                        return self.verifyUsers(res);
                    }
                },
                events:{
                    "afterSelect":function(resources){
                    },
                    "afterRowClick":function(id,data){
                        self.current_item=self.tableTemplate.modules.tag.itembox.getClickedItem();
                        data.publishPointId=self.current_item.options._id;
                        self.synchrohistory=new DeviceSynchroHistory({
                            data:data,
                            service:service
                        });
                    },
                    "syncPlan":function(){

                    }
                },
                contentColumns: columns,
                selector: self.element,
                service: service
            });
            $("#content-table-content").css({
                "top":"35px"
            });
            self.tableTemplate.modules.tag.addBtn.hide();
            self.tableTemplate.modules.tag.deleteBtn.hide();
//            self.talleTemplate.modules.tag.hide();
            self.editBtn=self.tableTemplate.modules.tag.editBtn;
            self.selectAllButton=self.tableTemplate.modules.tag.selectAllButton;
            //隐藏编辑按钮
            setTimeout(function(){
                cloud.util.mask("#tag-overview");
                self.editBtn.hide();
                self.selectAllButton.hide();
                var domElements=self.tableTemplate.modules.tag.itembox.items.values().pluck("widgets").pluck("select");
//                console.log(domElements);
                domElements.each(function(one){
                    $(one).remove();
                });
                setTimeout(function(){
                    cloud.util.unmask("#tag-overview");
                },1000);
            },1000);
//            self.tableTemplate.modules.content.syncPlanBtn.show();
        },
        initValidator:function(){
            var self=this;
            validator.render(self.editForm,{
                promptPosition:"topRight"
            });
        },
        getToolbar:function(){
            this.toolbar=this.tableTemplate.modules.content.getToolbar();
        },
        beforVerifyUsers:function(){
            var self=this;
            Model.organ({
                method:"query_current",
                param:{
                    verbose:100
                },
                success:function(organData){
                    self.email=organData.result.email;
                }
            });
        },
        verifyUsers:function(res,email){
            var self=this;
            if(res.size()>0){
                //验证自身帐号
                var loginedUser = cloud.platform.loginedUser;
                if(loginedUser){
                    var login = res.find(function(oneres){
                        return oneres._id === loginedUser._id;
                    });
                    if(login){
                        dialog.render({lang:"cannt_del_self_account"});
                        res = res.without(login);
                    }
                };
                return res;
            }else{
                return [];
            }


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
            var group=$("#winContent #group_name_input").val();
            var priority=$("#winContent .edit_form_ul :checked").val();
            var flow_limit=$("#winContent #flow_limit_input").val();
            var time_limit=$("#winContent #online_time_limit_input").val();
            var speed_limit_upstream=$("#winContent #upstream_limit_input").val();
            var speed_limit_downstream=$("#winContent #downstream_limit_input").val();
            var data={
                name:group,
                priority:priority,
                flow_limit:flow_limit,
                time_limit:time_limit,
                upstream:speed_limit_upstream,
                downstream:speed_limit_downstream
            };
            return data;
        },
        /*
         submit when submitButton clicked
         */
        submit:function(){
            var self=this;
            if(validator.result(self.editForm)){
                var data=self.mergeFormData();
                cloud.Ajax.request({
                    url:"",
                    type:"",
                    data:data
                })
            }
        },
        destroy: function() {
            $(this.element).empty();
        }

    });
    return UserTable;

});