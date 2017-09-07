/**
 * Created by kkzhou on 14-9-11.
 */
define(function(require){
    require("cloud/base/cloud");
    var tableHtml=require("text!./partials/table.html");
    var SmsConfig = require("./sms_config");
    require("./css/table.css");
    var WechatTable=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.idArray=["sms_config"];
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(tableHtml);
            self.bindEvents();
            self.defaultOpen(0);
            locale.render();
        },
        bindEvents:function(){
            var self=this;
            self.element.find(".col-slide-menu .menu-item").bind({
                "click":function(e){
                    $(".col-slide-menu .menu-item").removeClass("item-selected item-mouseover");
                    $(this).addClass("item-selected");
                    self.forSpecificBusiness(e.currentTarget.id);
                },
                "mouseover":function(e){
                    if(!$(this).hasClass("item-selected")){
                        $(this).addClass("item-mouseover");
                    }
                },
                "mouseout":function(e){
                    $(this).removeClass("item-mouseover");
                }
            }).end()
        },
        defaultOpen:function(index){
            var self=this;
            $("#"+self.idArray[index]).trigger("click");
        },
        forSpecificBusiness:function(identity){
            var self = this;
            switch (identity){
                case "sms_config":
                    if(self.smsConfig && self.currentBusiness == self.smsConfig){
                        self.smsConfig.rebuild();
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness = null;
                        }
                        self.smsConfig=new SmsConfig({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.smsConfig;
                    break;

                default :
                    break;
            }
        },
        destroy:function($super){
            this.currentBusiness = null;
            $super();
        }
    });
    return WechatTable;
});