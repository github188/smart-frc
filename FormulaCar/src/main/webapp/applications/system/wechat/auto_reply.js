/**
 * Created by kkzhou on 14-10-14.
 */
define(function(require){
    require("cloud/base/cloud");
    var autoReplyHtml=require("text!./partials/auto_reply.html");
    var service=require("./service");
    var Window=require("cloud/components/window");
    var MaterialView=require("./material/lib/materialView");
    var ruleItem = require("./rule_item");
    require("./css/keywords.css");

    var DATA = [{
        name:"规则名",
        type:"text",
        value:"1|2|3|4|5",
        allMatch:true,
        isService:false,
        metadataIds:["544478200cf200f70849cdf8","544478200cf200f70849cdf9"],
        serviceUrl:"",
        serviceName:"",
        createTime:1413459350810
    },{
        name:"规则名2",
        type:"text",
        value:"hi|name|hello",
        allMatch:true,
        isService:false,
        metadataIds:["54407b600cf20019e47b6c78"],
        serviceUrl:"",
        serviceName:"",
        createTime:1413459350810
    }]
    require("cloud/lib/plugin/jquery.qtip");
    var AutoReply=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.picAndTextWindow="<div class='picandtext dialog_bd'>" +
                "<div class='dialog_media_container'>" +
                "<div class='sub_title_bar in_dialog'>" +
                "<div class='info'>" +
                "<div class='appmsg_create'>" +
                "<a class='single_a'>" +
                "<i class='icon_appmsg_small'>" +
                "</i>" +
                "<strong>新建图文消息</strong>" +
                "</a>" +
                "<a class='multi_a'>" +
                "<i class='icon_appmsg_small multi'>" +
                "</i>" +
                "<strong>新建多图文消息</strong>" +
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
            self.element.html(autoReplyHtml);
            self.bindNavClickEffect();
            self.bindNavClickAreaShowAndHide();
            self.bindSubmitAndClear();
            self.defaultNavLi();
            self.renderQtip();
            locale.render();
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
                group.length>0 && newDatas.push(group);
            });
            return newDatas
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
                            self.messageAutoReply.message=materialArr;
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
        renderQtip:function(){
            var self=this;
            var arr=[];
            var obj1={};
            obj1.elementMark="#auto_reply_added .tab_text";
            obj1.tipContent="<p style='text-align: center'>"+locale.get("text_msg")+"</p>";
            arr.push(obj1);
            var obj2={};
            obj2.elementMark="#auto_reply_added .tab_appmsg";
            obj2.tipContent="<p style='text-align: center'>"+locale.get("pic_msg")+"</p>";
            arr.push(obj2);
            var obj3={};
            obj3.elementMark="#message_auto_reply .tab_text";
            obj3.tipContent="<p style='text-align: center'>"+locale.get("text_msg")+"</p>";
            arr.push(obj3);
            var obj4={};
            obj4.elementMark="#message_auto_reply .tab_appmsg";
            obj4.tipContent="<p style='text-align: center'>"+locale.get("pic_msg")+"</p>";
            arr.push(obj4);
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
        bindSubmitAndClear:function(){
           var self=this;
            self.element.find("#editSave").bind("click",function(e){
                e.preventDefault();
                var decideWhatMessage=self.currentApp.find("li.selected");
                if(decideWhatMessage.hasClass("tab_text")){
                    var wordLimitFlagTop=self.currentApp.lengthLimit.hasClass("color_red");
                    var wordLimitFlagSub=self.currentApp.textContent.find(".edit_area").text().trim();
                    if(wordLimitFlagTop||!wordLimitFlagSub){
                        dialog.render({
                            "text":locale.get("characters_limit")
                        });
                    }else{
                        //TODO
                        //发送信息栏，点击确定以后更新key(这里可能会依赖请求)
                        //这里message字段要与渲染时的字段结构保持一致
                        var message=self.currentApp.textContent.find(".edit_area").text();
                        var newData={};
                        newData.mediaType="text";
                        newData.content=message;
                        var arr=[];
                        arr.push(newData);
//                        arr=JSON.parse(arr);
                        var oldData=undefined;
                        arr=JSON.stringify(arr);
                        if(self.currentApp.message){
                            oldData=self.currentApp.message[0];
                        }
                        service.createTextMaterial(arr,function(data){
                            var arr=[];
                            var paramData={};
                            switch (self.currentApp){
                                case self.addedAutoReply:
                                    var key="subscribe";
                                    paramData.type="event";
                                    break;
                                case self.messageAutoReply:
                                    var key="default";
                                    paramData.type="default";
                                    break;
                                default :
                                    break;
                            }
                                paramData.name=key;
                                paramData.value=key;
                                paramData.isService=false;
//                                paramData.metadataIds=[];
//                                paramData.metadataIds.push(data.result[0]._id);
                                paramData.metadataIds=[];
                                paramData.metadataIds.push(data.result[0]._id);
                                arr.push(paramData);
                                arr=JSON.stringify(arr);
                                service.tieMenuToMaterial(arr,function(ok){
                                    self.currentApp.message=data.result;
                                    self.mediaDataFactory(self.currentApp.message,self.currentApp,self.currentApp.textContent);
                                },self);
                            },self);
                    }
                }else if(decideWhatMessage.hasClass("tab_appmsg")){
                    //TODO
                    if(self.currentApp.modelContent.tempMetadataIds){
                        var paramData={};
                        switch (self.currentApp){
                            case self.addedAutoReply:
                                var key="subscribe";
                                paramData.type="event";
                                break;
                            case self.messageAutoReply:
                                var key="default";
                                paramData.type="default";
                                break;
                            default :
                                break;
                        }
                        paramData.name=key;
                        paramData.value=key;
                        paramData.isService=false;
                        paramData.metadataIds=self.currentApp.modelContent.tempMetadataIds;
                        var arr=[];
                        arr.push(paramData);
                        arr=JSON.stringify(arr);
                        service.tieMenuToMaterial(arr,function(data){
//                            self.messageAutoReply.message=data.result;
                            self.mediaDataFactory(self.currentApp.message,self.currentApp,self.currentApp.modelContent);
                        },self);
                    }else{
                        dialog.render({
                            text:locale.get("please_select_material")
                        })
                    }
                }
            }).end()
                .find("#editBack").bind("click",function(e){
                      var target=self.currentApp.find(".tab_navs li.selected");
                      var flag1=target.hasClass("tab_appmsg");
                      var flag2=target.hasClass("tab_text");
                    if(flag1){
                        self.currentApp.modelContent.tempMetadataIds=null;
                        self.currentApp.modelContent.find(".js_appmsgArea").html("").end()
                            .find(".appmsg_col .menu_area.icon36_common").die().live("click",function(e){
                                self.currentApp.find(".tab_navs li.tab_appmsg").trigger("click");
                            }).end()
                            .find(".js_appmsgArea").html("<div class='appmsg_col'>" +
                                "<span class='create_access'>" +
                                "<i class='icon36_common add_gray menu_area'></i>" +
                                "</span>" +
                                "</div>");
                    }else if(flag2){
                        self.currentApp.textContent.find(".js_editorArea").text("");
                    }
                });
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
                    self.currentApp.message=selectedOne.data;
                    self.currentApp.modelContent.tempMetadataIds=[];
                    selectedOne.data.each(function(one){
                        self.currentApp.modelContent.tempMetadataIds.push(one._id);
                    });
                    self.mediaDataFactory(selectedOne.data,self.currentApp,self.currentApp.modelContent);
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
        defaultNavLi:function(){
            var self=this;
            $("ul#nav_bar li:eq(0)").trigger("click");
        },
        bindNavClickEffect:function(){
            var self=this;
            self.element.find("ul#nav_bar>li").bind("click",function(e){
                $("ul#nav_bar>li").removeClass("selected");
                $(this).addClass("selected");
            });
        },
        bindNavClickAreaShowAndHide:function(){
            var self=this;
            self.addedAutoReply=self.element.find("#auto_reply_added");
            self.addedAutoReply.textContent=self.addedAutoReply.find(".text_content");
            self.addedAutoReply.lengthLimit=self.addedAutoReply.textContent.find("em");
            self.addedAutoReply.modelContent=self.addedAutoReply.find(".model_content");

            self.messageAutoReply=self.element.find("#message_auto_reply");
            self.messageAutoReply.textContent=self.messageAutoReply.find(".text_content");
            self.messageAutoReply.lengthLimit=self.messageAutoReply.textContent.find("em");
            self.messageAutoReply.modelContent=self.messageAutoReply.find(".model_content");

            self.keyWordsReply = self.element.find("#key_words_content");
            self.keyWordsReply.addBtn = self.keyWordsReply.find(".btn_add");
            self.keyWordsReply.ruleList = self.keyWordsReply.find("#Js_ruleList");
            self.keyWordsReply.newRule= self.keyWordsReply.find("#Js_newRule");

            self.toolBar = self.element.find(".tool_bar");
            self.element.find("ul#nav_bar>li.nav_auto_reply_added").bind("click",function(e){
                if(self.currentApp){
                    self.currentApp.hide();
                }
                self.toolBar.show();
                self.addedAutoReply.show();
                //这里需要请求api，判断消息的类型，再确定如何显示
                service.getSingleMaterial({type:"event",value:"subscribe"},function(data){
                    if(data.result&&data.result.length>0){
                        var arr=[];
                        arr=data.result.pluck("_id");
                    }
                    self.addedAutoReply.modelContent.tempMetadataIds=arr;
                    self.addedAutoReply.message=data.result;
                    self.mediaDataFactory(data.result,self.addedAutoReply);
                    self.currentApp=self.addedAutoReply;
                },self);
            }).end()
            self.element.find("ul#nav_bar>li.nav_message_auto_reply").bind("click",function(e){
                    if(self.currentApp){
                        self.currentApp.hide();
                    }
                    self.toolBar.show();
                    self.messageAutoReply.show();
                    //这里需要请求api，判断消息的类型，在确定如何显示
                service.getSingleMaterial({type:"default",value:"default"},function(data){
                    if(data.result&&data.result.length>0){
                        var arr=[];
                        arr=data.result.pluck("_id");
                    }
                    self.messageAutoReply.modelContent.tempMetadataIds=arr;
                    self.messageAutoReply.message=data.result;
                    self.mediaDataFactory(data.result,self.messageAutoReply);
                    self.currentApp=self.messageAutoReply;
                },self);
                }).end()
                .find("ul#nav_bar>li.nav_key_words_reply").bind("click",function(){
                    if(self.currentApp){
                        self.currentApp.hide();
                    }
                    self.toolBar.hide();
                    self.keyWordsReply.show();
//                    self.renderRules(DATA);
                    service.getRules(function(data){
                        self.renderRules(data.result);
                    });

                    self.currentApp = self.keyWordsReply;

                }).end()
                .find("#Js_rule_add").bind("click",function(){
                    if(self.newRule){
                        var flag = self.newRule.element.css("display")=="none";
                        if(flag){
                            self.newRule.show();
                        }else{
                            self.newRule.hide();
                        }
                    }else{
                        self.newRule = new ruleItem({
                            container:self.keyWordsReply.newRule,
                            type:"detail",
                            events:{
                                afterAdd : function(){
                                    self.newRule.destroy();
                                    self.newRule = null;
                                    service.getRules(function(data){
                                        self.renderRules(data.result);
                                    });
                                },
                                "delete" : function(){
                                    self.newRule.destroy();
                                    self.newRule = null;
                                }
                            }
                        });
                    }
                });
            self.bindEditAreaKeyUp(self.addedAutoReply,".edit_area");
            self.bindEditAreaKeyUp(self.messageAutoReply,".edit_area");
            self.bindWhitchEditAreaRender(self.addedAutoReply);
            self.bindWhitchEditAreaRender(self.messageAutoReply);
        },
        bindEditAreaKeyUp:function(ele,identity){
            var self=this;
            ele.textContent.find(identity).bind({
                "keyup":function(e){
                    var str=$(this).text();
                    var length=str.trim().length;
                    var leftLength=600-length;
                    var str="";
                    if(leftLength<0){
                        leftLength=-leftLength;
                        ele.lengthLimit.addClass("color_red");
                        str=locale.get("exceed_letter_limit");
                    }else{
                        ele.lengthLimit.removeClass("color_red");
                        str=locale.get("less_letter_limit");
                    }
                    ele.find("#letter_limit_pre").text(str);
                    ele.lengthLimit.html(leftLength);
                }
            })
        },
        bindWhitchEditAreaRender:function(ele){
            var self=this;
            ele.find(".tab_navs li").bind("click",function(e){
                ele.find(".tab_navs li").removeClass("selected");
                var currentLi=$(this).addClass("selected");
                var flag1=currentLi.hasClass("tab_appmsg");
                var flag2=currentLi.hasClass("tab_text");
                if(flag1){
                    self.mediaDataFactory(ele.message,ele,ele.modelContent);
                    self.renderMultiMessageWindow();
                }else if(flag2){
                    self.mediaDataFactory(ele.message,ele,ele.textContent);
                }
            });
        },
        mediaDataFactory:function(data,ele,eleSon){
            //TODO
            var self=this;
            var dataType,text,multi;
            if(data&&data.length!=0){
                dataType=data[0].mediaType;
            }
            if(dataType){
                switch (dataType){
                    case "text":
                        text="text";
                        break;
                    case "news":
                        multi="news";
                        break;
                    default :
                        break;
                }
            }
            if(data&&!eleSon){
                if(text){
                    ele.find(".tab_navs li").removeClass("selected").end()
                        .find(".tab_text").addClass("selected");
                    ele.modelContent.hide();
                    ele.textContent.show().find(".js_editorArea").text(data[0].content).trigger("keyup");
                }else if(multi){
                    //TODO
                    ele.find(".tab_navs li").removeClass("selected").end()
                        .find(".tab_appmsg").addClass("selected");
                    ele.textContent.hide();
                    var domContainer=ele.modelContent.show().find(".js_appmsgArea");
                    var injectData;
                    if(data.length==1){
                        injectData=data[0];
                    }else{
                        injectData=data;
                    }
                    ele.modelContent.materialView=new MaterialView({
                        selector:domContainer,
                        viewtype:"edit",
                        data:injectData
                    });
                    ele.modelContent.find(".appmsg_opr>ul").hide();
                }
            }else if(!data&&eleSon){
                switch (eleSon){
                    case ele.textContent:
                        if(text){
                            eleSon.show().find(".js_editorArea").text(data.content).trigger("keyup");
                        }else{
                            eleSon.show().find(".js_editorArea").text("");
                        }
                        ele.modelContent.hide().find(".js_editorArea").html("");
                        break;
                    case ele.modelContent:
                        if(multi){
                            //TODO
                            //引入张玉雷的模板
                        }else{
                            eleSon.show().find(".js_editorArea").html("");
                        }
                        ele.textContent.hide();
                        break;
                    default:
                        break;
                }
            }else if(!data&&!eleSon){
                ele.modelContent.hide().find(".js_appmsgArea").html("");
                ele.textContent.show();
            }else if(data&&eleSon){
                switch (eleSon){
                    case ele.textContent:
                        //TODO
                        ele.modelContent.find(".js_appmsgArea").end().hide();
                        var str="";
                        if(text){
                            str=data[0].content;
                        }
                        ele.textContent.show().find(".js_editorArea").text(str).trigger("keyup");
                        break;
                    case ele.modelContent:
                        ele.textContent.hide().find(".js_editorArea").text("");
                        var injectData;
                        if(data instanceof Array){
                            if(data.length==1){
                                injectData=data[0];
                            }else if(data.length!=0){
                                injectData=data;
                            }
                        }
                        if(injectData&&multi){
                            ele.materialView=new MaterialView({
                                selector:ele.modelContent.find(".inner"),
                                viewtype:"edit",
                                data:injectData
                            });
                            ele.modelContent.find(".appmsg_opr>ul").hide();
                        }else{
                            ele.modelContent.find(".appmsg_col .menu_area.icon36_common").die().live("click",function(e){
                                ele.find(".tab_navs li.tab_appmsg").trigger("click");
                            });
                            ele.modelContent.find(".js_appmsgArea").html("<div class='appmsg_col'>" +
                                "<span class='create_access'>" +
                                "<i class='icon36_common add_gray menu_area'></i>" +
                                "</span>" +
                                "</div>");
                        }
                        ele.modelContent.show();
                        break;
                    default :
                        break;
                }
            }
        },

        renderRules:function(datas){
            var self = this;
            this.itemArr && this._destroyItems();
            this.keyWordsReply.ruleList.empty();
            this.itemArr = [];
            datas.each(function(data,index){
                var item = new ruleItem({
                    container:self.keyWordsReply.ruleList,
                    type:"overview",
                    index:index+1,
                    data:data,
                    events:{
                        afterUpdate:function(){
                            service.getRules(function(data){
                                self.renderRules(data.result);
                            });
                        },
                        afterDelete:function(){
                            service.getRules(function(data){
                                self.renderRules(data.result);
                            });
                        }
                    }
                });
                self.itemArr.push(item);
            });

        },

        _destroyItems:function(){
            this.itemArr.collect(function(item){
                item && item.destroy();
            });
        },


        rebuild:function(){
            var self=this;
            self.destroyPart();
            self.render();
        },
        destroyPart:function(){
            var self=this;
            self.element.find("*").unbind();
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
    return AutoReply;
});