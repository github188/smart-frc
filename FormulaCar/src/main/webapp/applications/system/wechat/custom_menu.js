/**
 * Created by kkzhou on 14-9-11.
 */
define(function(require){
    require("cloud/base/cloud");
    var customMenuHtml=require("text!./partials/custom_menu.html");
    var Window=require("cloud/components/window");
    var service=require("./service");
    var MaterialView=require("./material/lib/materialView");
    require("cloud/lib/plugin/jquery.qtip");
//    var validator=require("cloud/components/validator");
    var CustomMenu=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.menuItemKeyArray=[];
            for(var i=0;i<15;i++){
                var str="click_menu_material_";
                str+=i;
                this.menuItemKeyArray.push(str)
            }
            this.menuItemArray=[];
            this.firstLevelMenuItem="<dl class='inner-menu'>"+
                "<dt class='inner-menu-item'>"+
                "<a class='inner-menu-link'>"+
                "<strong></strong>"+
                "</a>"+
                "<span class='inner-menu-opr'>"+
                "<a class='icon14 add-gray jsAddBtn'></a>"+
                "<a class='icon14 edit-gray jsEditBtn'></a>"+
                "<a class='icon14 delete-gray jsDelBtn'></a>"+
                "</span>"+
                "</dt>"+
                "</dl>";
            this.secondLevelMenuItem="<dd class='inner-menu-item'>" +
                "<i class='icon-dot'>●</i>"+
                "<a class='inner-menu-link menu-leaf'>"+
                "<strong></strong>"+
                "</a>"+
                "<span class='inner-menu-opr'>"+
                "<a class='icon14 edit-gray jsEditBtn'></a>"+
                "<a class='icon14 delete-gray jsDelBtn'></a>"+
                "</span>"+
                "</dd>";
            this.createSubMenuWhenHasAction="<div>" +
                "<div id='delete_menu_item' class='dialog-body'>" +
                "<div class='page-msg simple default large'>" +
                "<div class='inner group'>" +
                "<span class='message-icon-wrp'>" +
                "<i class='icon-msg warn'></i>" +
                "</span>" +
                "<div class='msg-content'>" +
                "<h4 lang='{text:confirm_secondary}'></h4>" +
                "<p lang='{text:confirm_secondary_tip}'></p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='dialog-ft'>" +
                "<a class='btn btn-primary' lang='{text:confirm_text}'></a>" +
                "<a class='btn btn-default' lang='{text:cancell_text}'></a>" +
                "</div>" +
                "</div>";
            this.createSubMen="<div>" +
                "<div id='create_menu_item' class='dialog-body'>" +
                "<div class='simple-dialog-content'>" +
                "<form novalidate='novalidate' class='form' id='form_create_menu_item'>" +
                "<div class='frm-control-group'>" +
                "<label class='frm-label' lang='{text:name_length_limit}'></label>" +
                "<span class='frm-input-box'>" +
                "<input class='frm-input validate[required]' type='text' />" +
                "</span>" +
                "<p id='menu_name_error_tip'></p>" +
                "</div>" +
                "</form>" +
                "</div>" +
                "</div>" +
                "<div class='dialog-ft'>" +
                "<a class='btn btn-primary' lang='{text:confirm_text}'></a>" +
                "<a class='btn btn-default' lang='{text:cancell_text}'></a>" +
                "</div>" +
                "</div>";
            this.editMenu="<div>" +
                "<div id='edit_menu_item' class='dialog-body'>"+
                "<div class='simple-dialog-content'>" +
                "<form novalidate='novalidate' class='form'>" +
                "<div class='frm-control-group'>" +
                "<label class='frm-label' lang='{text:name_length_limit}'></label>" +
                "<span class='frm-input-box'>" +
                "<input class='frm-input' />" +
                "</span>" +
                "<p id='menu_name_error_tip'></p>" +
                "</div>" +
                "</form>" +
                "</div>" +
                "</div>" +
                "<div class='dialog-ft'>" +
                "<a class='btn btn-primary' lang='{text:confirm_text}'></a>" +
                "<a class='btn btn-default' lang='{text:cancell_text}'></a>" +
                "</div>" +
                "</div>" ;
            this.deleteMenu="<div>" +
                "<div id='delete_menu_item' class='dialog-body'>" +
                "<div class='page-msg simple default large'>" +
                "<div class='inner group'>" +
                "<span class='message-icon-wrp'>" +
                "<i class='icon-msg warn'></i>" +
                "</span>" +
                "<div class='msg-content'>" +
                "<h4 lang='{text:delete_confirm}'></h4>" +
                "<p lang='{text:delete_confirm_tip}'></p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='dialog-ft'>" +
                "<a class='btn btn-primary' lang='{text:confirm_text}'></a>" +
                "<a class='btn btn-default' lang='{text:cancell_text}'></a>" +
                "</div>" +
                "</div>";
            this.picAndTextWindow="<div class='picandtext dialog_bd'>" +
                "<div class='dialog_media_container'>" +
                "<div class='sub_title_bar in_dialog'>" +
                "<div class='info'>" +
                "<div class='appmsg_create'>" +
                "<a class='single_a'>" +
                "<i class='icon_appmsg_small'>" +
                "</i>" +
                "<strong lang='text:new_text_pic_message'>新建图文消息</strong>" +
                "</a>" +
                "<a class='multi_a'>" +
                "<i class='icon_appmsg_small multi'>" +
                "</i>" +
                "<strong lang='text:new_multi_message'>新建多图文消息</strong>" +
                "</a>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='js_appmsg_list appmsg_list media_dialog'>" +
                "<div class='appmsg_col' id='left_col_multimedia'>" +
                "<div class='inner'>" +
                "</div>" +
                "</div>" +
                "<div class='appmsg_col'  id='right_col_multimedia' style='float: right'>" +
                "<div class='inner'>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='dialog_ft'>" +
                "<span class='btn btn-primary btn_input js_btn_p'>" +
                "<button type='button' class='js_btn'>确定</button>" +
                "</span>" +
                "<span class='btn btn-default btn_input js_btn_p'>" +
                "<button type='button' class='js_btn'>取消</button>" +
                "</span>" +
                "</div>";
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(customMenuHtml);
            self.actionSettingArea();
            self.ajaxJson();
            self.menuContainer=self.element.find("#inner_menu_box");
            self.renderQtip();
            locale.render();
        },
        renderQtip:function(){
            var self=this;
            var arr=[];
            var obj1={};
            obj1.elementMark="#multi_media .tab_text";
            obj1.tipContent="<p style='text-align: center'>"+locale.get("text_msg")+"</p>";
            arr.push(obj1);
            var obj2={};
            obj2.elementMark="#multi_media .tab_appmsg";
            obj2.tipContent="<p style='text-align: center'>"+locale.get("pic_msg")+"</p>";
            arr.push(obj2);
            self.initQtip(arr);
        },
        initQtip:function(objArr){
            var self=this;
            objArr.each(function(one){
                $(one.elementMark).qtip({
                    content: one.tipContent,
                    position: {
                        my: "top center",
                        at: "bottom center"
                    },
                    style: {
                        classes: "qtip-shadow qtip-dark qtip-opacity"
                    },
                    suppress:false
                });
            })
        },
        ajaxJson:function(){
            var self=this;
            service.getMenu(function(data){
                if(typeof data.result=="string"){
                    data.result=JSON.parse(data.result);
                }
                if(data.result.errcode){
                    dialog.render({
                        "text":locale.get(data.result.errcode)
                    })
                }else{
                    this.data=data.result.menu;
                    this.createDom();
                }
            },self);
        },
        createDom:function(){
            var self=this;
            if(self.data){
                self.data.button.each(function(one){
                    var dom=$(self.firstLevelMenuItem);
                    dom.name=one.name;
                    if(one.type){
                        dom.type=one.type;
                    }
                    if(one.sub_button&&one.sub_button.length>0){
                        dom.subMenu=[];
                        one.sub_button.each(function(one){
                            var subDom=$(self.secondLevelMenuItem);
                            subDom.name=one.name;
                            subDom.type=one.type;
                            if(one.type=="click"){
                                subDom.key=one.key;
                            }else if(one.type=="view"){
                                subDom.url=one.url;
                            }
                            dom.subMenu.push(subDom);
                        })
                    }else{
                        if(one.type=="click"){
                            dom.key=one.key;
                        }else if(one.type="view"){
                            dom.url=one.url;
                        }
                    }
                    self.menuItemArray.push(dom);
                });
            }
            self.renderMenuItem();
            self.bindEvents();
            self.bindReleaseEvent();
        },
        bindReleaseEvent:function(){
            var self=this;
            $("a.btn-primary.release").bind("click",function(e){
                var data=self.getCurrentMenuData();
                if(data.needToSetAction){
                    delete data.needToSetAction;
                    dialog.render({
                        "text":locale.get("menu_not_set")
                    });
                }
//                else if(self.menuItemArray.length==0){
//                    dialog.render({
//                        "text":locale.get("empty_not_release")
//                    })
//                }
                else{
                    service.updateMenu(data,function(data){
                    },self);
                }
            });
        },
        //传入素材信息，返回适宜显示的数据
        //ele可为jqeury的任意选择器或者一个dom对象
        mediaDataFactory:function(data,ele,triggersource){
            //TODO
            var self=this;
            if(data){
                switch (ele){
                    case self.multiMedia.textContent:
                        self.multiMedia.find(".tab_navs li").removeClass("selected").end()
                            .find(".tab_navs li.tab_text").addClass("selected");
                        var str="";
                        if(data[0].mediaType=="text"){
                            str=data[0].content;
                        }
                        ele.show().find(".edit_area").text(str).trigger("keyup");
                        self.multiMedia.modelContent.hide();
                        break;
                    case self.multiMedia.modelContent:
                        self.multiMedia.textContent.hide();
                        ele.show();
                        self.multiMedia.find(".tab_navs li").removeClass("selected").end()
                            .find(".tab_navs li.tab_appmsg").addClass("selected");
                        if(data&&data.length!=0&&data[0].mediaType!="text"){
                            var injectData;
                            if(data.length==1){
                                injectData=data[0];
                            }else{
                                injectData=data;
                            }
                            self.multiMedia.modelContent.materialView=new MaterialView({
                                selector:self.multiMedia.modelContent,
                                viewtype:"edit",
                                data:injectData
                            });
                            self.multiMedia.modelContent.find(".appmsg_opr>ul").hide();
                        }else{
                            self.multiMedia.modelContent.find(".appmsg_col .menu_area.icon36_common").die().live("click",function(e){
                                self.multiMedia.find(".tab_navs li.tab_appmsg").trigger("click");
                            });
                            self.multiMedia.modelContent.html("<div class='appmsg_col'>" +
                                "<span class='create_access'>" +
                                "<i class='icon36_common add_gray menu_area'></i>" +
                                "</span>" +
                                "</div>");
                        }
                        if(triggersource=="appmsg_click"){
                            self.multiMedia.textContent.hide();
                            self.renderMultiMessageWindow();
                        }
                        break;
                    default :
                        self.multiMedia.hide();
                        self.mediaSended.show();
                        if(data[0].mediaType=="text"){
                            ele.text(data[0].content);
                        }else if(data[0].mediaType=="news"){
                            //TODO
                            //这里需要使用玉蕾的模板
                            var injectData;
                            if(data.length==1){
                                injectData=data[0];
                            }else{
                                injectData=data;
                            }
                                self.mediaSended.materialView=new MaterialView({
                                    selector:ele,
                                    viewtype:"edit",
                                    data:injectData
                                });
                            self.mediaSended.find(".appmsg_opr>ul").hide();
                        }
                        break;
                }

            }else{
                switch (ele){
                    case self.multiMedia.textContent:
                        ele.show().find(".edit_area").text("").trigger("keyup");
                        self.multiMedia.modelContent.hide();
                        break;
                    case self.multiMedia.modelContent:
                            //TODO
                            //这里需要用到玉蕾的模板
                        self.multiMedia.modelContent.find(".appmsg_col .menu_area.icon36_common").die().live("click",function(e){
                            self.multiMedia.find(".tab_navs li.tab_appmsg").trigger("click");
                        });
                        self.multiMedia.modelContent.html("<div class='appmsg_col'>" +
                            "<span class='create_access'>" +
                            "<i class='icon36_common add_gray menu_area'></i>" +
                            "</span>" +
                            "</div>");
                        ele.show();
                        self.multiMedia.textContent.hide();
                        self.renderMultiMessageWindow();
                        break;
                    default:
                        break;
                }
            }
        },
        renderMultiMessageWindow:function(){
            var self=this;
            var $content=$(self.picAndTextWindow).find(".btn-primary").bind("click",function(e){

                var selectedOne=self.multiPicAndMesArr.find(function(one){
                    if(one.$appmsg&&one.$appmsg.hasClass("selected")){
                        return one;
                    }
                });
                if(selectedOne){
                    if(!(selectedOne.data instanceof Array)){
                        var arr=[];
                        arr.push(selectedOne.data);
                        selectedOne.data=arr;
                    }
                    self.mediaDataFactory(selectedOne.data,self.multiMedia.modelContent);
                    self.multiMedia.dom.tempMessage=selectedOne.data;
                    self.multiMedia.dom.tempMetadataIds=[];
                    selectedOne.data.each(function(one){
                        self.multiMedia.dom.tempMetadataIds.push(one._id);
                    });
                    self.window.destroy();
                }
            }).end()
                .find(".btn-default").bind("click",function(e){
                    self.window.destroy();
                }).end()
                .find(".appmsg_create a").bind("click",function(e){
                    $(".col-slide-menu #material_mg").trigger("click");
                    self.window.destroy();
                }).end();
            var options={
                "title":locale.get("select_material"),
                "content":$content,
                "height":597,
                "width":960,
                "specific":"appmsg"
            };
            self.renderWindow(options);
        },
        whitchActionSetting:function(dom){
            //以key和url来判断菜单属于哪一类
            var self=this;
            if(self.currentActionSettins){
                self.currentActionSettins.hide();
            }
            if(dom.key){
                //TODO
                //这里需要判断消息类型是什么，如果是文字直接填充，如果是图文信息则需要用模板填充。（message字段）
                //由这里点击的时候去请求对应的素材并处理
                service.getSingleMaterial({type:dom.type.toUpperCase(),value:dom.key},function(data){
                    //TODO
                    //在这里需要定义一个渲染方法
//                    var endData=self.mediaDataFactory(data);
                    if(data.result&&data.result.length!=0){
                        dom.message=data.result;
                        self.mediaSended.show();
                        self.mediaDataFactory(data.result,self.mediaSended.find("div.msg-wrp"));
                        self.currentActionSettins=self.mediaSended;
                        self.mediaSended.dom=dom;
                    }
                    else{
                        //TODO
                        self.actionInit.show();
                        self.currentActionSettins=self.actionInit;
                        delete dom.type;
                        delete dom.key;
                        self.actionInit.dom=dom;
                    }
                },self);
            }else if(dom.url){
                self.currentActionSettins=self.urlSended.show().find("div.msg-wrp").html(dom.url).end();
                self.urlSended.dom=dom;
            }else if(dom.subMenu&&dom.subMenu.length>0){
                self.currentActionSettins=self.bothDefault.show();
            }else if(dom.name){
                self.currentActionSettins=self.actionInit.show();
                self.actionInit.dom=dom;
            }
            locale.render({
                element:self.currentActionSettins
            });
        },
        //比较数据
        compareMulti:function(datanew,dataold){
            var self=this;
            if(datanew.mediaType=="text"){
                if(!dataold||datanew.content!=dataold.content){
                    return false;
                }else{
                    return true;
                }
            }
        },
        //设置动作区域的四个模块
        actionSettingArea:function(){
            var self=this;
            self.emptyTip=$("div#empty_default");
            self.urlSended=$("div#url_sended").find("a.btn-editing").bind("click",function(e){
                self.urlUrl.dom=self.urlSended.dom;
                self.urlSended.find("div.msg-wrp").html("").end().hide();
                self.urlUrl.show().find("input.frm-input").val(self.urlUrl.dom.url);
                self.currentActionSettins=self.urlUrl;
            }).end();
            self.bothDefault=$("div#both_default");
            //TODO
            self.multiMedia=$("div#multi_media").find("a.btn-primary").bind("click",function(e){
                //TODO
                //这里的key需要从素材数据结构中获取
                //如果是纯文字，则需要创建一个素材
                //这里需要判断素材内容是否合法
                //这里做一个假数据
                //这个是素材(文字或图文)的数据结构，需要更新
//                self.multiMedia.dom.message={text:"你吃我，我吃你"};
                e.preventDefault();
                var decideWhatMessage=self.multiMedia.find("li.selected");

                if(decideWhatMessage.hasClass("tab_text")){
                    var wordLimitFlagTop=self.lengthLimit.hasClass("color_red");
                    var wordLimitFlagSub=self.multiMedia.textContent.find(".edit_area").text().trim();
                    if(wordLimitFlagTop||!wordLimitFlagSub){
                        dialog.render({
                            "text":locale.get("characters_limit")
                        });
                    }else{
                        //TODO
                        //发送信息栏，点击确定以后更新key(这里可能会依赖请求)
                        //这里message字段要与渲染时的字段结构保持一致
                        var message=self.multiMedia.textContent.find(".edit_area").text();
                        var newData={};
                        newData.mediaType="text";
                        newData.content=message;
                        var arr=[];
                        arr.push(newData);
//                        arr=JSON.parse(arr);
                        var oldData=undefined;
                        arr=JSON.stringify(arr);
                        if(self.multiMedia.dom.message){
                            oldData=self.multiMedia.dom.message[0];
                        }
                        var flag=self.compareMulti(newData,oldData);
                        if(!flag){
                            service.createTextMaterial(arr,function(data){
                                var key;
                                if(self.multiMedia.dom.key){
                                    key=self.multiMedia.dom.key;
                                }else{
                                    key=self.getAKey();
                                }
                                var arr=[];
                                var paramData={};
                                paramData.name=key;
                                paramData.type="CLICK";
                                paramData.value=key;
                                paramData.isService=false;
//                                paramData.metadataIds=[];
//                                paramData.metadataIds.push(data.result[0]._id);
                                paramData.metadataIds=[];
                                paramData.metadataIds.push(data.result[0]._id);
                                arr.push(paramData);
                                arr=JSON.stringify(arr);
                                service.tieMenuToMaterial(arr,function(ok){
                                    self.multiMedia.dom.message=data.result;
                                    self.multiMedia.dom.key=key;
                                    self.multiMedia.dom.type="click";
                                    self.multiMedia.hide();
                                    self.mediaSended.dom=self.multiMedia.dom;
                                    //这里如果是图文则需要用到玉蕾那边的模板，如果是文字则直接填入
                                    self.mediaDataFactory(self.multiMedia.dom.message,self.mediaSended.show().find("div.msg-wrp"));
//                                self.mediaSended.show().find("div.msg-wrp").html(self.mediaSended.dom.message.text);
                                    self.currentActionSettins=self.mediaSended;
                                },self);
                            },self);
                        }else{
                            self.multiMedia.hide();
                            self.mediaSended.dom=self.multiMedia.dom;
                            //这里如果是图文则需要用到玉蕾那边的模板，如果是文字则直接填入
                            self.mediaDataFactory(self.mediaSended.dom.message,self.mediaSended.find("div.msg-wrp"));
//                            self.mediaSended.show().find("div.msg-wrp").html(self.mediaSended.dom.message.text);
                            self.currentActionSettins=self.mediaSended;
                        }

                    }
                }else if(decideWhatMessage.hasClass("tab_appmsg")){
                    //TODO
                    //var data;
                    //这里需要获取到图文消息那个对象，玉蕾的模板，用其数据来判断内容是否发生了改变
                    //需要定义一个比较方法compareMulti()
                    //var flag=compareMulti(oldData,nowData);
//                    if(!flag){
//                        self.multiMedia.dom.message=nowData;
//                        self.multiMedia.dom.key="123456";//nowData.result.key
//                        self.multiMedia.dom.type="click";
//                    }
                    //这里需要一个方法mediaDataFactory()
                    if(self.multiMedia.dom.tempMetadataIds){
                        var paramData={};
                        var key;
                        if(self.multiMedia.dom.key){
                            key=self.multiMedia.dom.key;
                        }else{
                            key=self.getAKey();
                        }
                        paramData.name=key;
                        paramData.type="CLICK";
                        paramData.value=key;
                        paramData.isService=false;
//                    paramData.metadataIds=self.multiMedia.dom.metadataIds;
                        paramData.metadataIds=self.multiMedia.dom.tempMetadataIds;
                        var arr=[];
                        arr.push(paramData);
                        arr=JSON.stringify(arr);
                        service.tieMenuToMaterial(arr,function(data){
                            self.multiMedia.dom.message=self.multiMedia.dom.tempMessage;
                            delete self.multiMedia.dom.tempMessage;
                            self.multiMedia.dom.type="click";
                            self.multiMedia.dom.key=key;
                            self.multiMedia.hide();
                            self.mediaDataFactory(self.multiMedia.dom.message,self.mediaSended.find(".msg-wrp"));
                            self.mediaSended.dom=self.multiMedia.dom;
                            self.currentActionSettins=self.mediaSended;
                        },self);
                    }else{
                        dialog.render({
                            text:locale.get("please_select_material")
                        })
                    }
                }
            }).end()
                .find("a.btn-default").bind("click",function(e){
                    e.preventDefault();
                    self.multiMedia.hide();
                    self.multiMedia.textContent.hide();
                    self.multiMedia.modelContent.hide();
                    var message=self.multiMedia.dom.message;
                    if(message){
                        //TODO
                        self.mediaSended.show();
                        self.mediaDataFactory(self.multiMedia.dom.message,self.mediaSended.find("div.msg-wrp"));
                        self.mediaSended.dom=self.multiMedia.dom;
                        self.currentActionSettins=self.mediaSended;
                    }else{
                        self.multiMedia.textContent.find(".edit_area").html("");
                        self.multiMedia.modelContent.find(".js_appmsgArea").html("");
                        self.actionInit.show();
                        self.actionInit.dom=self.multiMedia.dom;
                        self.currentActionSettins=self.actionInit;
                    }
                }).end();
            self.multiMedia.textContent=self.multiMedia.find(".tab_content.text_content");
            self.lengthLimit=self.multiMedia.textContent.find("em");
            //监听文字改变事件事件
            self.multiMedia.textContent.find(".edit_area").bind(
                {
                    "keyup":function(e){
                        var str=$(this).text();
                        var length=str.trim().length;
                        var leftLength=600-length;
                        var str="";
                        if(leftLength<0){
                            leftLength=-leftLength;
                            self.lengthLimit.addClass("color_red");
                            str=locale.get("exceed_letter_limit");
                        }else{
                            self.lengthLimit.removeClass("color_red");
                            str=locale.get("less_letter_limit");
                        }
                        $("#letter_limit_pre").text(str);
                        self.lengthLimit.html(leftLength);
                    }
//                    "paste cut":function(e){
//                        var thatSelf=this;
//                        setTimeout(function(){
//                            var str=$(thatSelf).text();
////                            console.log(str);
//                            var length=str.length;
//                            var leftLength=600-length;
//                            self.lengthLimit.html(leftLength);
//                        },500)
//                    }
            });
            self.multiMedia.modelContent=self.multiMedia.find(".tab_content.model_content");
            self.mediaSended=$("div#media_sended").find("a.btn-default").bind("click",function(e){
                //TODO
                self.multiMedia.dom=self.mediaSended.dom;
                self.mediaSended.hide();
                //这里需要判断消息是文本还是图文
                var message=self.multiMedia.dom.message;
                var ele;
                //如果是文字信息
                if(message[0].mediaType=="text"){
                    ele=self.multiMedia.textContent;
//                    self.multiMedia.show().find(".tab_content .edit_area").html(message.text);
                }
                //如果是图文信息，则需要用到模板
                else{
                    ele=self.multiMedia.modelContent;
                    //TODO
                }
                self.mediaDataFactory(message,ele);
                self.multiMedia.show();
                self.currentActionSettins=self.multiMedia;
            }).end();
            self.actionInit=$("div#action_init").find("#jump_to_url").bind("click",function(e){
                self.actionInit.hide();
                self.urlUrl.show();
                self.urlUrl.dom=self.actionInit.dom;
                self.currentActionSettins=self.urlUrl;
            }).end()
                .find("#send_message").bind("click",function(e){
                    self.actionInit.hide();
                    self.multiMedia.find(".tab_navs li").removeClass("selected").end()
                        .find(".tab_navs li.tab_text").addClass("selected");
                    self.multiMedia.show();
                    self.multiMedia.textContent.show().find(".edit_area ").text("");
                    self.multiMedia.modelContent.hide();
                    self.multiMedia.dom=self.actionInit.dom;
                    self.currentActionSettins=self.multiMedia;
                }).end();
            self.urlUrl=$("div#url_url");
//                validator.render(self.urlUrl.find("form"),{
//                    "promptPosition":"topRight"
//                });
            self.urlUrl.find("a.btn-primary").bind("click",function(e){
//                    if(validator.result("form#add_url")){
                var url=self.urlUrl.find("input.frm-input").val();
                var flag=self.name_maximum_exceed({
                    url:url,
                    element:self.urlUrl.find("#menu_url_error_tip"),
                    tip_1:locale.get("website_invalid"),
                    tip_2:locale.get("name_cannot_empty")
                });
                if(flag){
                    self.urlUrl.dom.type="view";
                    self.urlUrl.dom.url=url;
                    self.urlUrl.find("input.frm-input").val("").end().hide();
                    self.urlSended.dom=self.urlUrl.dom;
                    self.urlSended.find("div.msg-wrp").html(self.urlSended.dom.url).end().show();
                    self.currentActionSettins=self.urlSended;
//                        var data=self.getCurrentMenuData();
//                        service.updateMenu(data,function(){
//                            self.urlUrl.find("input.frm-input").val("").end().hide();
//                            self.urlSended.dom=self.urlUrl.dom;
//                            self.urlSended.find("div.msg-wrp").html(self.urlSended.dom.url).end().show();
//                            self.currentActionSettins=self.urlSended;
//                        },self);
                }
//                    }
            }).end()
                .find("a.btn-default").bind("click",function(e){
//                        validator.hideAll();
                    self.urlUrl.find("p#menu_url_error_tip").html("").hide();
                    if(self.urlUrl.dom.type){
                        self.urlUrl.find("input.frm-input").val("").end().hide();
                        self.urlSended.find("div.msg-wrp").html(self.urlSended.dom.url).end().show();
                        self.currentActionSettins=self.urlSended;
                    }else{
                        self.urlUrl.find("input.frm-input").val("").end().hide();
                        self.actionInit.show();
                        self.currentActionSettins=self.actionInit;
                    }
                }).end()
                .find("input.frm-input").bind("blur",function(e){
                    self.name_maximum_exceed({
                        url:$(this).val(),
                        element:self.urlUrl.find("#menu_url_error_tip"),
                        tip_1:locale.get("website_invalid"),
                        tip_2:locale.get("name_cannot_empty")
                    });
                }).end();
        },
        processData:function(data){
            var newDatas = [],
                groupIds = [],
                groups = [];
            data.each(function(one){
                if(one.groupId){
                    groupIds.push(one.groupId);
                    groups.push(one);
                }else{
                    newDatas.push(one);
                }
            });
            groupIds = cloud.util.uniqueArray(groupIds);
            groupIds.each(function(id){
                var group = groups.findAll(function(one){
                    return one.groupId == id;
                });
                newDatas.push(group);
            });
            return newDatas
        },
        destroyWindow:function(){
            var self=this;
            self.window.body.find("*").unbind();
            self.window.destroy();
        },
        //非常重要
        mainMenuItemEventsFactory:function(one){
            var self=this;
            one.update=function(){
                this.find("strong").html(one.name);
            };
            one.find("dt .inner-menu-link strong").html(one.name).end().find("span.inner-menu-opr").hide().end()
                .find("dt").bind({
                    "mouseover":function(e){
                        $(this).find("span.inner-menu-opr").show();
                    },
                    "click":function(e){
                        self.menuContainer.find("dl .inner-menu-item-selected").removeClass("inner-menu-item-selected").find("span.inner-menu-opr").hide();
                        $(this).addClass("inner-menu-item-selected").find("span.inner-menu-opr").show();
                        self.whitchActionSetting(one);
                    },
                    "mouseout":function(e){
                        if(!$(this).hasClass("inner-menu-item-selected")){
                            $(this).find("span.inner-menu-opr").hide();
                        }
                    }
                }).end()
                .find("dt .inner-menu-opr .add-gray").bind("click",function(e){
                    //TODO
                    //创建菜单事件
                    //这里需要判断子菜单个数，以及是否已经设置了动作
                    e.stopPropagation();
                    if(one.subMenu&&one.subMenu.length>=5){
                        dialog.render({
                            "text":locale.get("second_level_menu_max")
                        })
                    }else{
                        var content="";
                        if(one.type){
                            var $content=$(self.createSubMenuWhenHasAction);
                            content=$content.find(".dialog-ft .btn-primary").bind("click",function(e){
                                var $xContent=$(self.createSubMen);
                                var $tempContent=$xContent.find(".dialog-ft .btn-primary")
                                    .bind("click",function(e){
                                        var name=$xContent.find("input.frm-input").val();
                                        var flag=self.name_maximum_exceed({
                                            name:name,
                                            element:$xContent.find("#menu_name_error_tip"),
                                            tip_1:locale.get("max_length_name"),
                                            tip_2:locale.get("name_cannot_empty")
                                        });
//                                            if(flag&&validator.result("#form_create_menu_item")){
                                        if(flag&&name){
                                            var subMenuItem=$(self.secondLevelMenuItem);
                                            subMenuItem.name=name;
                                            one.subMenu=[];
                                            delete one.type;
                                            delete one.key;
                                            delete one.url;
                                            one.subMenu.push(subMenuItem);
//                                                var data=self.getCurrentMenuData();
                                            self.destroyWindow();
                                            self.subMenuItemEventsFactory(one,subMenuItem);
//                                                service.updateMenu(data,function(){
//                                                    self.subMenuItemEventsFactory(one,subMenuItem);
//                                                },self);
                                        }
//                                            }
                                    }).end()
                                    .find("input.frm-input").bind({
                                        "blur":function(e){
                                        var name=$(this).val();
                                        self.name_maximum_exceed( {
                                            name:name,
                                            element:$xContent.find("#menu_name_error_tip"),
                                            tip_1:locale.get("max_length_name"),
                                            tip_2:locale.get("name_cannot_empty")
                                        });
                                    },
                                        "keydown":function(e){
                                            if(e.keyCode=="13"){
                                                e.preventDefault();
                                                var flag=self.name_maximum_exceed({
                                                    name:$(this).val(),
                                                    element:$tempContent.find("#menu_name_error_tip"),
                                                    tip_1:locale.get("max_length_name"),
                                                    tip_2:locale.get("name_cannot_empty")
                                                });
                                                if(flag){
                                                    $content.find(".dialog-ft .btn-primary").trigger("click");
                                                }
                                                return;
                                            }
                                        }
                                    }).end()
                                    .find(".dialog-ft .btn-default").bind("click",function(e){
                                        self.destroyWindow();
                                    }).end();
                                self.window.contents.find("*").unbind().end().empty();
                                locale.render({
                                    element:$tempContent
                                });
                                self.window.setContents($tempContent);
//                                    validator.render($tempContent.find("#form_create_menu_item"),{
//                                        "promptPosition":"topRight"
//                                    });
                                self.window.setTitle(locale.get("input_tips_box"));
                            }).end()
                                .find(".dialog-ft .btn-default").bind("click",function(e){
                                    self.destroyWindow();
                                }).end()
                        }else{
                            var $tempContent=$(self.createSubMen);
//                                validator.render($tempContent.find("form_create_menu_item"),{
//                                    "promptPosition":"topRight"
//                                });
                            content=$tempContent.find(".dialog-ft .btn-primary").bind("click",function(e){
                                var name=$tempContent.find("input.frm-input").val();
                                var flag=self.name_maximum_exceed({
                                    name:name,
                                    element:$tempContent.find("#menu_name_error_tip"),
                                    tip_1:locale.get("max_length_name"),
                                    tip_2:locale.get("name_cannot_empty")
                                });
                                if(flag&&name){
                                    var subMenuItem=$(self.secondLevelMenuItem);
                                    subMenuItem.name=name;
                                    if(!one.subMenu){
                                        one.subMenu=[];
                                    }
                                    one.subMenu.push(subMenuItem);
                                    self.destroyWindow();
                                    self.subMenuItemEventsFactory(one,subMenuItem);
//                                        var data=self.getCurrentMenuData();
//                                        service.updateMenu(data,function(){
//                                            self.subMenuItemEventsFactory(one,subMenuItem);
//                                        },self);
                                }
//                                    if(flag&&validator.result("#form_create_menu_item")){
//                                    }
                            }).end()
                                .find(".dialog-ft .btn-default").bind("click",function(e){
                                    self.destroyWindow();
                                }).end()
                                .find("input.frm-input").bind({
                                    "blur":function(e){
                                    var name=$(this).val();
                                    self.name_maximum_exceed({
                                        name:name,
                                        element:$tempContent.find("#menu_name_error_tip"),
                                        tip_1:locale.get("max_length_name"),
                                        tip_2:locale.get("name_cannot_empty")
                                    });
                                },
                                    "keydown":function(e){
                                        if(e.keyCode=="13"){
                                            e.preventDefault();
                                            var flag=self.name_maximum_exceed({
                                                name:$(this).val(),
                                                element:$tempContent.find("#menu_name_error_tip"),
                                                tip_1:locale.get("max_length_name"),
                                                tip_2:locale.get("name_cannot_empty")
                                            });
                                            if(flag){
                                                $tempContent.find(".dialog-ft .btn-primary").trigger("click");
                                            }
                                            return;
                                        }
                                    }
                                }).end();
                        }
                        self.renderWindow({"title":locale.get("input_tips_box"),"content":content,"height":350,"width":650});
                    }
                }).end()
                .find("dt .inner-menu-opr .edit-gray").bind("click",function(e){
                    //TODO
                    //编辑菜单事件
                    //这里需要获取数据
                    e.stopPropagation();
                    var $tempContent=$(self.editMenu);
                    var content=$tempContent.find(".dialog-ft .btn-primary").bind("click",function(e){
                        var name=$tempContent.find(".frm-input").val();
                        var flag=self.name_maximum_exceed({
                            "name":name,
                            "element":$tempContent.find("p#menu_name_error_tip"),
                            "tip_1":locale.get("max_length_name"),
                            "tip_2":locale.get("name_cannot_empty")
                        });
                        if(flag){
                            one.name=name;
//                                var data=self.getCurrentMenuData();
                            self.destroyWindow();
                            one.update();
//                                service.updateMenu(data,function(){
//                                    one.update();
//                                },self);
                        }
                    }).end()
                        .find(".dialog-ft .btn-default").bind("click",function(e){
                            self.destroyWindow();
                        }).end()
                        .find(".frm-input").bind("blur",function(e){
                            self.name_maximum_exceed({
                                name:$(this).val(),
                                element:$tempContent.find("#menu_name_error_tip"),
                                tip_1:locale.get("max_length_name"),
                                tip_2:locale.get("name_cannot_empty")
                            })
                        }).end();
                    content.find(".frm-input").val(one.name);
                    self.renderWindow({"title":locale.get("input_tips_box"),"content":content,"height":350,"width":650});
                }).end()
                .find("dt .inner-menu-opr .delete-gray").bind("click",function(e){
                    //DOING
                    //删除菜单事件
                    e.stopPropagation();
                    var $tempContent=$(self.deleteMenu);
                    var content=$tempContent.find(".dialog-ft .btn-primary")
                        .bind("click",function(e){
                            self.menuItemArray=self.menuItemArray.without(one);
                            self.destroyWindow();
                            one.remove();
                            if(self.currentActionSettins){
                                self.currentActionSettins.hide();
                            }
                            self.currentActionSettins=self.emptyTip.show();
//                                if(self.menuItemArray.length==0){
//                                    one.remove();
//                                }else{
//                                    var data=self.getCurrentMenuData();
//                                    service.updateMenu(data,function(){
//                                        one.remove();
//                                        self.currentActionSettins.hide();
//                                    },self);
//                                }
                        }).end()
                        .find(".dialog-ft .btn-default")
                        .bind("click",function(e){
                            self.destroyWindow();
                        }).end();
                    self.renderWindow({"title":locale.get("tips"),"content":content,"height":350,"width":650});
                }).end()
                .appendTo(self.menuContainer);
        },
        name_maximum_exceed:function(obj){
            var self=this;
            if(typeof obj.name!="undefined"){
                if(obj.name){
                    var length=obj.name.replace(/[^\x00-\xff]/gi, "--").length;
                    if(length>8){
                        obj.element.html(obj.tip_1).show();
                        return false;
                    }else{
                        obj.element.html("").hide();
                        return true;
                    }
                }else{
                    obj.element.html(obj.tip_2).show();
                    return false;
                }
            }else if(typeof obj.url!="undefined"){
                if(obj.url){
                    var regex=/^((https|http|ftp|rtsp|mss):\/\/){1,1}/;
//                        var regex=/^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
                    if(regex.test(obj.url)){
                        obj.element.html("").hide();
                        return true;
                    }else{
                        obj.element.html(obj.tip_1).show();
                        return false;
                    }
                }else{
                    obj.element.html(obj.tip_2).show();
                    return false;
                }

            }

        },
        subMenuItemEventsFactory:function(one,two){
            var self=this;
            two.update=function(){
                this.find("strong").html(this.name);
            };
            two.find("a.inner-menu-link strong").html(two.name).end().find("span.inner-menu-opr").hide().end()
                .bind({
                    "mouseover":function(e){
                        $(this).find("span.inner-menu-opr").show();
                    },
                    "click":function(e){
                        self.menuContainer.find("dl .inner-menu-item-selected").removeClass("inner-menu-item-selected").find("span.inner-menu-opr").hide();
                        $(this).addClass("inner-menu-item-selected").find("span.inner-menu-opr").show();
                        self.whitchActionSetting(two);
                    },
                    "mouseout":function(e){
                        if(!$(this).hasClass("inner-menu-item-selected")){
                            $(this).find("span.inner-menu-opr").hide();
                        }
                    }
                })
                .find("span.inner-menu-opr .edit-gray").bind("click",function(e){
                    //TODO
                    //编辑菜单事件
                    e.stopPropagation();
                    var $content=$(self.editMenu);
                    var content=$content.find(".dialog-ft .btn-primary").bind("click",function(e){
                        var name=$content.find(".frm-input").val();
                        var flag=self.name_maximum_exceed({
                            "name":name,
                            "element":$content.find("p#menu_name_error_tip"),
                            "tip_1":locale.get("max_length_name"),
                            "tip_2":locale.get("name_cannot_empty")
                        });
                        if(flag){
                            two.name=name;
                            self.destroyWindow();
//                                var data=self.getCurrentMenuData();
                            two.update();
//                                service.updateMenu(data,function(){
//                                    two.update();
//                                },self);
                        }
                    }).end()
                        .find(".dialog-ft .btn-default").bind("click",function(e){
                            self.destroyWindow();
                        }).end()
                        .find(".frm-input").bind("blur",function(e){
                            self.name_maximum_exceed({
                                name:$(this).val(),
                                element:$content.find("#menu_name_error_tip"),
                                tip_1:locale.get("max_length_name"),
                                tip_2:locale.get("name_cannot_empty")
                            })
                        }).end();
                    $content.find("input.frm-input").val(two.name);
                    self.renderWindow({"title":locale.get("input_tips_box"),"content":content,"height":350,"width":650});
                })
                .end()
                .find("span.inner-menu-opr .delete-gray").bind("click",function(e){
                    //TODO
                    //删除菜单事件
                    e.stopPropagation();
                    var $tempContent=$(self.deleteMenu);
                    var content=$tempContent.find(".dialog-ft .btn-primary").bind("click",function(e){
                        one.subMenu=one.subMenu.without(two);
                        two.remove();
                        if(self.currentActionSettins){
                            self.currentActionSettins.hide();
                        }
//                            var data=self.getCurrentMenuData();
                        self.destroyWindow();
//                            service.updateMenu(data,function(){
//                                two.remove();
//                                self.currentActionSettins.hide();
//                            },self)
                    }).end()
                        .find(".dialog-ft .btn-default").bind("click",function(e){
                            self.destroyWindow();
                        }).end();
                    self.renderWindow({"title":locale.get("tips"),"content":content,"height":350,"width":650});
                })
                .end()
                .appendTo(one);
        },
        renderMenuItem:function(){
            var self=this;
            self.menuItemArray.each(function(one){
                //为menuItem绑定事件
                self.mainMenuItemEventsFactory(one);
                if(one.subMenu){
                    one.subMenu.each(function(two){
                        self.subMenuItemEventsFactory(one,two);
                    })
                }
//                    one.prependTo(self.menuContainer);
            });
        },
        renderWindow:function(obj){
            var self=this;
            self.window=new Window({
                container: "body",
                title: obj.title,
                top: "center",
                left: "center",
                height: obj.height,
                width: obj.width,
                mask: true,
                drag:true,
                content: obj.content,
                events: {
                    "onClose": function() {
                        self.window = null;
                    },
                    "beforeClose":function(){
                        self.window.body.find("*").unbind();
                    },
                    scope: this
                }
            });
            locale.render({
                element:obj.content
            });
            self.window.show();
            if(obj.specific){
                switch (obj.specific){
                    case "appmsg":
                        var leftContainer=obj.content.find("#left_col_multimedia .inner");
                        var rightContainer=obj.content.find("#right_col_multimedia .inner");
                        var arr=[leftContainer,rightContainer];
                        self.multiPicAndMesArr=[];
                        service.getMaterial({"type":"news"},function(data){
                            var materialArr=self.processData(data.result);
                            materialArr.each(function(one,i){
                                var index=i%2;
                                var tempObj=new MaterialView({
                                    container:arr[index],
                                    viewtype:"select",
                                    data:one,
                                    events:{
                                        beforeSelect:function(data){
                                            obj.content.find(".selected").removeClass("selected");
                                        }
                                    }
                                });
                                self.multiPicAndMesArr.push(tempObj.module);
                            });
                        },self)
                        break;
                    default :
                        break;
                }
            }
        },
        //菜单栏的添加按钮绑定事件
        //编辑消息或图文消息时，导航的点击事件
        bindEvents:function(){
            var self=this;
            self.element.find("div#cs_title_bar").find("a.add-gray").bind("click",function(e){
                //TODO
                e.preventDefault();
                if(self.menuItemArray.length>=3){
                    dialog.render({
                        "text":locale.get("first_level_menu_max")
                    });
                }else{
                    var $tempContent=$(self.createSubMen);
                    var content=$tempContent.find(".dialog-ft .btn-primary").bind("click",function(e){
                        var name=$tempContent.find(".frm-input").val();
                        var flag=self.name_maximum_exceed({
                            name:name,
                            element:$tempContent.find("#menu_name_error_tip"),
                            tip_1:locale.get("max_length_name"),
                            tip_2:locale.get("name_cannot_empty")
                        });
//                            if(validator.result({
//                                element:"#form_create_menu_item"
//                            })&&flag){
                        if(flag&&name){
                            var menuItem=$(self.firstLevelMenuItem);
                            menuItem.name=name;
                            self.menuItemArray.push(menuItem);
                            self.destroyWindow();
                            self.mainMenuItemEventsFactory(menuItem);
//                                var data=self.getCurrentMenuData();
//                                service.updateMenu(data,function(){
//                                    self.mainMenuItemEventsFactory(menuItem);
//                                },self);
                        }
//                            }
                    }).end()
                        .find(".dialog-ft .btn-default").bind("click",function(e){
                            self.destroyWindow();
                        }).end()
                        .find(".frm-input").bind({
                            "blur":function(e){
                            self.name_maximum_exceed({
                                name:$(this).val(),
                                element:$tempContent.find("#menu_name_error_tip"),
                                tip_1:locale.get("max_length_name"),
                                tip_2:locale.get("name_cannot_empty")
                            });
                        },
                            "keydown":function(e){
                                if(e.keyCode=="13"){
                                    e.preventDefault();
                                    var flag=self.name_maximum_exceed({
                                        name:$(this).val(),
                                        element:$tempContent.find("#menu_name_error_tip"),
                                        tip_1:locale.get("max_length_name"),
                                        tip_2:locale.get("name_cannot_empty")
                                    });
                                    if(flag){
                                        $tempContent.find(".dialog-ft .btn-primary").trigger("click");
                                    }
                                    return;
                                }
                            }
                        }).end();
//                        validator.render(content.find("#form_create_menu_item"),{
//                            "promptPosition":"topRight"
//                        });
                    self.renderWindow({"title":locale.get("input_tips_box"),"content":content,"height":350,"width":650});
                }
            });
            self.multiMedia.find(".tab_navs li").bind("click",function(e){
                self.multiMedia.find(".tab_navs li").removeClass("selected");
                var currentLi=$(this).addClass("selected");
                var flag1=currentLi.hasClass("tab_appmsg");
                var flag2=currentLi.hasClass("tab_text");
                if(flag1){
                    self.mediaDataFactory(self.multiMedia.dom.message,self.multiMedia.modelContent,"appmsg_click");
//                    var $content=$(self.picAndTextWindow);
//                    var options={
//                        "title":locale.get("select_material"),
//                        "content":$content,
//                        "height":597,
//                        "width":960
//                    };
//                    self.renderWindow(options);
                }else if(flag2){
                    self.mediaDataFactory(self.multiMedia.dom.message,self.multiMedia.textContent,"text_click");
                }
            });
        },
        getCurrentMenuData:function(){
            var self=this;
            var menuObj={};
            var obj={};
            obj.button=[];
            if(self.menuItemArray.length!=0){
                self.menuItemArray.each(function(one){
                    var tempObj={};
                    tempObj.name=one.name;
                    if(one.type){
                        if(one.url){
                            tempObj.url=one.url;
                        }
                        if(one.key){
                            tempObj.key=one.key;
                        }
                        tempObj.type=one.type;
                    }else if(one.subMenu&&one.subMenu.length>0){
//                        tempObj.sub_button=one.subMenu;
                        tempObj.sub_button=[];
                        one.subMenu.each(function(two){
                            var xTempObj={};
                            if(two.name){
                                xTempObj.name=two.name;
                            }
                            if(two.type){
                                xTempObj.type=two.type;
                            }else{
                                menuObj.needToSetAction=true;
                            }
                            if(two.url){
                                xTempObj.url=two.url;
                            }
                            if(two.key){
                                xTempObj.key=two.key;
                            }
                            tempObj.sub_button.push(xTempObj);
                        });
                    }else{
                        menuObj.needToSetAction=true;
                    }
                    obj.button.push(tempObj);
                });
            }
//                for(p in obj){
//                    console.log(obj[p]);
//                }
            menuObj.menu=JSON.stringify(obj);
            return menuObj;
        },
        getAKey:function(){
          var self=this;
           var tempKeyMenuItem=[];
          self.menuItemArray.each(function(one){
              if(one.key){
                  tempKeyMenuItem.push(one.key);
              }
          });
          var availableKeyArr=self.menuItemKeyArray;
          tempKeyMenuItem.each(function(one){
              availableKeyArr=availableKeyArr.without(one);
          });
          return availableKeyArr[0];
        },
        rebuild:function(){
            var self=this;
            self.destroyPart();
            self.render();
        },
        destroyPart:function(){
            var self=this;
            self.element.find("*").unbind();
            self.menuItemArray=[];
        },
        destroyAll:function(){
            var self=this;
            self.destroyPart();
            self.element.empty();
            self.destroy();
        },
        destroy:function($super){
            $super();
        }
    });
    return CustomMenu;
});