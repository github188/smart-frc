/**
 * Created by zhang on 14-10-10.
 */
define(function(require){
    require("cloud/base/cloud");
    var meterialHtml=require("text!./partials/material.html");
    var service=require("./../service");
    var imageText = require("./imageText");
    require("./../css/material.css");
    require("./../css/media.css");
    require("./../css/media_list.css");
    require("./../css/media_editor.css");
    require("./../css/media_edit.css");
    var Material = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.service = service;
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(meterialHtml);

            this.bindEvents();

            this.$bodyArea = this.element.find(".main_bd");

            this.openDefault();

            locale.render();
        },

        openDefault:function(){
            var self = this;
            this.currentObj && this.currentObj.destroy();
            this.currentObj = new imageText({
                container:self.$bodyArea
            });
        },

        bindEvents:function(){
            var self = this;
            var $lis = this.element.find(".tab_navs li");
            $lis.bind("click",function(){
                $lis.each(function(index,one){
                    $(one).removeClass("selected");
                });
                $(this).addClass("selected");
                self.currentObj.destroy();
                switch ($(this).attr("data-index")-0){
                    case 0://图文
                        self.currentObj = new imageText({
                            container:self.$bodyArea
                        });
                        break;
                    case 1://文本
                        self.currentObj = new imageText({
                            container:self.$bodyArea
                        });
                        break;
                    default :
                        self.currentObj = new imageText({
                            container:self.$bodyArea
                        });
                        break;

                }
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

    return Material;
});