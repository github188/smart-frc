/**
 * Created by kkzhou on 14-9-16.
 */
define(function(require){
    require("cloud/base/cloud");
    var qrCodeHtml=require("text!./partials/qr_code.html");
    var service=require("./service");
    var QrCode=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.siteListItem="<dl class='inner-menu'>"+
                "<dt class='inner-menu-item'>"+
                "<a class='inner-menu-link'>"+
                "<strong class='longer'></strong>"+
                "</a>"+
//                "<span class='inner-menu-opr'>"+
//                "<a href='javascript:void(0)' class='icon14 add-gray jsAddBtn'></a>"+
//                "<a href='javascript:void(0)' class='icon14 edit-gray jsEditBtn'></a>"+
//                "<a href='javascript:void(0)' class='icon14 delete-gray jsDelBtn'></a>"+
//                "<i class='icon-dot red'>●</i>"+
//                "</span>"+
                "</dt>"+
                "</dl>";
            this.siteItemArray=[];
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(qrCodeHtml);
            self.actionArea();
            self.getSiteList();
            self.menuContainer=self.element.find("#inner_menu_box");
            self.bindScrollEvent();
            locale.render();
        },
        bindScrollEvent:function(){
            var self=this;
            self.element.find(".menu-edit-area-wrapper").bind("scroll",function(e){
                self.scrollTopHeight=$(this)[0].scrollTop;
                if(self.currentAction){
                    self.currentAction.css({
                        "top":self.scrollTopHeight+"px"
                    });
                }

            });
        },
        actionArea:function(){
            var self=this;
            self.actionInit=$("div#action_init").find("a#jump_to_url")
                .bind("click",function(e){
                    service.createQrCode(self.actionInit.dom._id,function(data){
                            self.currentAction.hide();
                            self.qrCodeSended.dom=self.actionInit.dom;
                            self.currentAction=self.qrCodeSended.find("img").attr({
                                "src":data.result.getQrCodeUrl,
                                "alt":locale.get("load_failed")
                            }).end()
                                .find("p#site_name").text(self.actionInit.dom.name)
                                .end()
                                .css({
                                    "top":self.scrollTopHeight+"px"
                                })
                                .show();
                    },self);
                }).end()
                .hide();
            self.qrCodeSended=$("div#qr_code_sended").find(".btn-primary.reset").bind("click",function(e){
                service.createQrCode(self.qrCodeSended.dom._id,function(data){
                    self.currentAction=self.qrCodeSended.find("img").attr({
                        "src":data.result.getQrCodeUrl,
                        "alt":locale.get("load_failed")
                    }).end()
                        .find("p#site_name").text(self.qrCodeSended.dom.name)
                        .end()
                        .css({
                            "top":self.scrollTopHeight+"px"
                        })
                        .show();
                },self)
            }).end()
                .hide();
        },
        whitchActionShow:function(dom){
            var self=this;
            if(self.currentAction){
                self.currentAction.hide();
            }
            if(dom.qrCodeData&&dom.qrCodeData.ticket){
                self.currentAction=self.qrCodeSended.find("img").attr({
                    "src":dom.qrCodeData.getQrCodeUrl,
                    "alt":locale.get("load_failed")
                }).end()
                    .css({
                        "top":self.scrollTopHeight+"px"
                    }).find("p#site_name").text(dom.name)
                    .end()
                    .show();
                self.qrCodeSended.dom=dom;
            }else{
                self.currentAction=self.actionInit.css({
                    "top":self.scrollTopHeight+"px"
                }).show();
                self.actionInit.dom=dom;
            }
        },
        getSiteList:function(){
            var self=this;
            service.getSiteList(function(data){
                this.data=data.result;
                this.siteItemCollection();
                this.siteItemFactory();
            },self);
        },
        siteItemCollection:function(){
            var self=this;
            self.data.each(function(one){
                var tempDom=$(self.siteListItem);
                tempDom.name=one.name;
                tempDom._id=one._id;
                self.siteItemArray.push(tempDom);
            });
        },
        siteItemFactory:function(){
            var self=this;
            self.siteItemArray.each(function(one){
                one.find("dt").bind("click",function(e){
                    service.getQrCode(one._id,function(data){
                        if(data.result){
                            one.qrCodeData=data.result;
                        }
                        self.menuContainer.find("dl.inner-menu-item-selected").removeClass("inner-menu-item-selected");
                        one.addClass("inner-menu-item-selected");
                       self.whitchActionShow(one);
                    },self);
                }).end()
                    .find("strong").html(one.name).end()
                    .attr("title",one.name).end();
                ;
                one.appendTo(self.menuContainer);
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
            self.siteItemArray=[];
        },
        destroyAll: function () {
            var self = this;
            self.destroyPart();
            self.element.empty();
            self.destroy();
        },
        destroy:function($super){
            $super();
        }
    });
    return QrCode;
})