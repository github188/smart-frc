/**
 * Created by zhouyunkui on 14-6-16.
 */
define(function(require){
    var cloud=require("cloud/base/cloud");
    var Button=require("cloud/components/button");
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
    var RollBackInfo=Class.create(cloud.Component,{
        initialize:function($super,options){
            this.selector=$(options.selector);
            this.drawHTML();
            this.render();
//            locale.render();
        },
        drawHTML:function(){
            var html="<form>" +
                "<ul>" +
                "<li><label style='margin-left: 15px' class='bigger-bolder' lang='text:version_number+:'></label><input disabled='disabled' type='text' id='version_number' />" +
                "<span class='rollback-button' id='rollback-button'></span></li>" +
//                "<li><span style='margin-left: 15px' class='rollback-button' id='rollback-button'></span></li>" +
                "<li><p style='margin-left: 15px' class='bigger-bolder' lang='text:remarks+:'></p><textarea id='remarks_area' disabled='disabled'>" +
                "</textarea></li>" +
                "<li><div id='device_synchro_state'></div></li>" +
                "</ul>"+
                "</form>";
            this.infoElement=$(html);
            new Button({
                container:this.infoElement.find("#rollback-button"),
                text:locale.get("rollback_to_this_version"),
//                lang:"{text:affirm}",
                events:{
                }
            });

            this.selector.append(this.infoElement);
            locale.render({element:this.selector});
        },
        render:function(){
            this.selector.find(".bigger-bolder").css({
                "font-size":"12px",
                "font-weight":"normal"
            });
            this.selector.find("li").css({
                "margin-top":"20px"
            });
//            this.selector.find(".rollback-button").css({
//                "width":"100px",
//                "height":"20px",
//                "margin-left":"48px",
//                "cursor":"pointer"
//            }).click(function(){
//                    return false;
//                })
            this.selector.find("#remarks_area").css({
                "resize":"none",
                "outline":"none",
                "margin-left":"15px",
                "margin-top":"20px",
                "background-color":"rgb(255,255,255)"
            }).attr({
                    "rows":"20",
                    "cols":"45"
//                    "maxlength":"60"
                });
            this.renderConfirBox();
        },
        bindQtip:function(){
            var self=this;
            this.selector.find("#rollback-button a").qtip({
                content: {
                    text: this.confirmBox
                },
                position: {
                    my: "top right",
                    at: "bottom left"
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
                        $("body").append($("<div id='mask-div-for-rollback-confirm'></div>").css({
                            "width":"100%",
                            "height":"100%",
                            "background-color":"rgba(0,0,0,0.5)",
                            "position":"absolute"
                        }));
                        self.confirmBox.find("textarea").val("");
                    }
                },
                suppress:false
            })
        },
        renderConfirBox:function(){
            var self=this;
            var html="<div>" +
                "<p lang='text:input_desc'>回滚确认</p>" +
                "<textarea rows='8' cols='35' style='resize: none;outline: none;'></textarea>" +
                "<p lang='text:tips_roll_back' style='color:rgb(207,180,209)'>该操作会将该发布点内容替换为该版本内容</p>" +
                "<div><span id='rollback_confirmBtn'></span><span id='rollback_cancellBtn'></span></div>" +
                "</div>";
            this.confirmBox=$(html);
            locale.render({element:self.confirmBox});
            new Button({
                container:this.confirmBox.find("#rollback_confirmBtn"),
                text:locale.get("affirm"),
//                lang:"{text:affirm}",
                events:{
                    click:function(){
                        this.selector.find("#rollback-button a").trigger("click");
                        $("body").find("#mask-div-for-rollback-confirm").remove();
//                        self.mask();
                        var des=self.confirmBox.find("textarea").val();
                        if(des.empty()){
                            des=locale.get("back_desc");
                        }
                        cloud.Ajax.request({
                            url:"api/content_sync/back",
                            type:"POST",
                            data:{
                                contentPublishedId:self.data._id,
                                backDesc:des
                            },
                            success:function(data){
                              self.current_item=self.tagoverview.itembox.getClickedItem();
                              //console.log();
                                self.current_item.element.click()
                            },
                            error:function(err){
//                                self.unmask();
                                self.current_item=self.tagoverview.itembox.getClickedItem();
                            }
                        });
                    },
                    scope:this
                }
            }),
                new Button({
                    container:this.confirmBox.find("#rollback_cancellBtn"),
                    text:locale.get("cancelText"),
//                    lang:"text:cancelText",
                    events:{
                        click:function(){
                            this.selector.find("#rollback-button a").trigger("click");
                            $("body").find("#mask-div-for-rollback-confirm").remove();
                        },
                        scope:this
                    }
                });
            locale.render({element:self.confirmBox});
            this.bindQtip();
        },
        renderForm:function(data,tagoverview){
            var self=this;
//            data={
//                text:"1,2013-5-30 liwei@inhand.com.cn 进行了回滚操作\r\n" +
//            "2,2014-6-4 zyl@126.com 进行了回滚操作",
//                version:"v 1.0"
//            };
            self.tagoverview=tagoverview;
            var pos=data.version.lastIndexOf("_");
            var version;
            if(pos!=-1){
                version=data.version.slice(0,pos);
            }
            self.infoElement.find("#version_number").val(version);
            var textStr="";
            if(data.backRecord){
                var records=data.backRecord;
                for(var i=0;i<records.length;i++){
                    var des=records[i].backDesc+"\r\n";
                    var time=records[i].backTime;
                    var name=data.operationName+":";
                    var timeStr=dateFormat(new Date(time),"yyyy-MM-dd hh:mm:ss");
                    textStr=timeStr+" "+name+" "+des+textStr;
                }
            }
            self.infoElement.find("#remarks_area").val(textStr);
            self.data=data;
        }
    });
    return RollBackInfo;
})