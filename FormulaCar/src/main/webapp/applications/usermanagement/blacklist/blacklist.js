/**
 * Created by zhouyunkui on 14-6-25.
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    var html = require("text!./blacklist.html");
    var NavThird = require("cloud/components/nav-third");
    var Table = require("./table");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var service = require("./service");
    var BlackList = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            var self = this;
            permission.judge(["_summary","read"],function(){
                self.elements = {
                    nav:{
                        id:"blacklist-nav",
                        "class":null
                    },
                    content:{
                        id:"blacklist-content",
                        "class":null
                    }
                };
                self._render();
            });
        },

        _render:function(){
            var self = this;
            self._renderHtml();
            self._renderLayout();
            self._renderNavThird();
            self._renderContent('visitor_black');
            locale.render({element:self.element});
        },

        _renderHtml:function(){
            this.element.html(html);
        },

        _renderLayout:function(){
            var self = this;
            $(function(){
                self.layout = $('#user-content').layout({
                    defaults: {
                        paneClass: "pane",
                        togglerClass: "cloud-layout-toggler",
                        resizerClass: "cloud-layout-resizer",
                        spacing_open: 1,
                        spacing_closed: 1,
                        togglerLength_closed: 50,
                        togglerTip_open:locale.get({lang:"close"}),
                        togglerTip_closed:locale.get({lang:"open"}),
                        resizable: false,
                        slidable: false
                    },
                    west: {
                        paneSelector: "#" + self.elements.nav.id,
                        size: 182
                    },
                    center: {
                        paneSelector: "#" + self.elements.content.id
                    }
                });
            });
        },


        _renderNavThird:function(){
            var self = this;
            this.navThird = new NavThird({
                selector: "#" + this.elements.nav.id,
                main:{
                    text:"黑白名单",
                    lang:"text:blackandwhitelist"
                },
                sub:[
                    {
                        text:"用户黑名单",
                        lang:"text:visitor_blacklist",
                        id:"visitor-black-list-nav",
                        status:1,
                        click:function(){
                            self._renderContent('visitor_black');
                            locale.render({element:"#content"});
                        }
                    },
//                    {
//                        text:"用户白名单",
//                        lang:"text:visitor_whitelist",
//                        id:"visitor-white-list-nav",
//                        status:0,
//                        click:function(){
//                            self._renderContent("visitor_white");
//                            locale.render({element:"#content"});
//                        }
//                    },
                    {
                        text:"MAC黑名单",
                        lang:"text:mac_blacklist",
                        id:"mac-black-list-nav",
                        status:0,
                        click:function(){
                            self._renderContent('mac_black');
                            locale.render({element:"#content"});
                        }
                    },
                    {
                        text:"MAC白名单",
                        lang:"text:mac_whitelist",
                        id:"mac-white-list-nav",
                        status:0,
                        click:function(){
                            self._renderContent("mac_white");
                            locale.render({element:"#content"});
                        }
                    },
//         		     {
//         		    	text:"网站黑名单",
//              			lang:"text:website_blacklist",
//              			id:"website-black-list-nav",
//              			status:0,
//						click:function(){
//							self._renderContent('website_black');
//                            locale.render({element:"#content"})
//             			}
//         		     },
//                    {
//                        text:"网站白名单",
//                        lang:"text:website_whitelist",
//                        id:"website-white-list-nav",
//                        status:0,
//                        click:function(){
//                            self._renderContent("website_white");
//                            locale.render({element:"#content"})
//                        }
//                    }
                ]
            });
        },

        _renderContent:function(businessType){
            var self = this;
            if(this.content){
                this.content.destroy();
                this.content=null;
            }
            this.content = new Table({
                selector: "#" + this.elements.content.id,
                service:service,
                businessType:businessType
            });
            self._bindEvents();
        },
        _bindEvents:function(){
            var self=this;
            $("#my_list_form").die().live("keydown",function(e){
                if(e.target.id=="new-tag-name"&& e.keyCode==13){
                    var flag=validator.result("#my_list_form");
                    e.preventDefault();
                    if(flag){
                        self.content.onCreate();
                    }
                }
            });
        },
        destroy: function() {
            this.elements=null;
            if (this.layout && (!this.layout.destroyed)) {
                this.layout.destroy();
            }
            if(this.navThird){
                if(this.navThird.destroy){
                    this.navThird.destroy();
                }else{
                    this.navThird=null;
                }
            }
            if(this.content){
                if(this.content.destroy){
                    this.content.destroy();
                }else{
                    this.content=null;
                }
            }
        }

    });

    return BlackList;

});