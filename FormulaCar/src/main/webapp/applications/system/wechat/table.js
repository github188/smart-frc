/**
 * Created by kkzhou on 14-9-11.
 */
define(function(require){
    require("cloud/base/cloud");
    var tableHtml=require("text!./partials/table.html");
    var CustomMenu=require("./custom_menu");
    var QrCode=require("./qr_code");
    var WxConfig = require("./wx_config");
    var materialMg = require("./material/material");
    var AutoReply=require("./auto_reply");
    var Analysis=require("./statistics/user_analysis");
    require("./css/table.css");
    var WechatTable=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.idArray=["auto_reply","custom_menu","qr_setting","material_mg","user_analysis","wx_config"];
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
            var self= this;
            switch (identity){
                case "custom_menu":
                    if(self.customMenu && self.currentBusiness == self.customMenu){
                        var id=self.customMenu.element[0].id;
                        var flagEle=document.getElementById(id);
                        if(flagEle){
                            self.customMenu.rebuild();
                        }else{
                            self.currentBusiness.destroyAll();
                            self.customMenu=null;
                            self.customMenu=new CustomMenu({
                                "container":"#col_slide_main"
                            });
                            self.currentBusiness=self.customMenu;
                        }
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                        }
                        self.customMenu=new CustomMenu({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.customMenu;
                    break;
                case "qr_setting":
                    if(self.qrCode && self.currentBusiness == self.qrCode){
                        var id=self.qrCode.element[0].id;
                        var flagEle=document.getElementById(id);
                        if(flagEle){
                            self.qrCode.rebuild();
                        }else{
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                            self.qrCode=new QrCode({
                                "container":"#col_slide_main"
                            });
                            self.currentBusiness=self.qrCode;
                        }
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                        }
                        self.qrCode=new QrCode({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.qrCode;
                    break;
                case "wx_config":
                    if(self.wxConfig && self.currentBusiness == self.wxConfig){
                        self.wxConfig.rebuild();
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                        }
                        self.wxConfig=new WxConfig({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.wxConfig;
                    break;
                case "material_mg":
                    if(self.materialMg && self.currentBusiness == self.materialMg){
                        self.materialMg.rebuild();
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                        }
                        self.materialMg=new materialMg({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.materialMg;
                    break;
                case "auto_reply":
                    if(self.autoReply && self.currentBusiness == self.autoReply){
                        var id=self.autoReply.element[0].id;
                        var flagEle=document.getElementById(id);
                        if(flagEle){
                            self.autoReply.rebuild();
                        }else{
                            self.currentBusiness.destroyAll();
                            self.autoReply=null;
                            self.autoReply=new AutoReply({
                                "container":"#col_slide_main"
                            });
                            self.currentBusiness=self.autoReply;
                        }
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                        }
                        self.autoReply=new AutoReply({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.autoReply;
                    break;
                case "user_analysis":
                    if(self.analysis && self.currentBusiness == self.analysis){
                        var id=self.analysis.element[0].id;
                        var flagEle=document.getElementById(id);
                        if(flagEle){
                            self.analysis.rebuild();
                        }else{
                            self.currentBusiness.destroyAll();
                            self.analysis=null;
                            self.analysis=new Analysis({
                                "container":"#col_slide_main"
                            });
                            self.currentBusiness=self.analysis;
                        }
                    }else{
                        if(self.currentBusiness){
                            self.currentBusiness.destroyAll();
                            self.currentBusiness=null;
                        }
                        self.analysis=new Analysis({
                            "container":"#col_slide_main"
                        });
                    }
                    self.currentBusiness=self.analysis;
                    break;
                default :
                    break;
            }
        }
    });
    return WechatTable;
});