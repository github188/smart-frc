/**
 * Created by kkzhou on 14-10-21.
 */
/**
 * Created by kkzhou on 14-9-16.
 */
define(function(require){
    require("cloud/base/cloud");
    var userAnalysisHtml=require("text!../partials/user_analysis.html");
    var service=require("./../service");
    var Table=require("./user_analysis_table");
    var QrCode=Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.siteListItem="<dl class='inner-menu'>"+
                "<dt class='inner-menu-item'>"+
                "<a class='inner-menu-link'>"+
                "<strong class='longer'></strong>"+
                "</a>"+
                "</dt>"+
                "</dl>";
            this.siteItemArray=[];
            this.render();
        },
        render:function(){
            var self=this;
            self.element.html(userAnalysisHtml);
            self.getSiteList();
            self.menuContainer=self.element.find("#inner_menu_box");
            self.bindScrollEvent();
            locale.render();
        },
        bindScrollEvent:function(){
            var self=this;
            self.element.find(".menu-edit-area-wrapper").bind("scroll",function(e){
                self.scrollTopHeight=$(this)[0].scrollTop;
                var top;
                if(self.scrollTopHeight!=0){
                    top=self.scrollTopHeight-46;
                }else{
                    top=self.scrollTopHeight;
                }
                    self.element.find("#user_table").css({
                        "top":top+"px"
                    });
            });
        },
        getSiteList:function(){
            var self=this;
            service.getSiteList(function(data){
                self.data=[{
                    id:"all",
                    name:locale.get("user_analysis_overview")
                }];
                data.result.each(function(one){
                    self.data.push(one);
                });
                this.siteItemCollection();
                this.siteItemFactory();
                this.defaultOpen();
            },self);
        },
        defaultOpen:function(){
            var self=this;
            self.siteItemArray[0].find("dt").trigger("click");
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
            self.siteItemArray.each(function(one,index){
                one.find("dt").bind("click",function(e){
                    var options={};
                    if(one._id&&one._id!="all"){
                        options.object_id=one._id;
                    }
                    var date=new Date();
                    options.start_time=date.getTime()-1000*60*60*24*7;
                    options.start_time=date.getTime()-1000*60*60*24*7;
                    options.types="101,102,103";
                    options.end_time=(new Date()).getTime();
                    options.name=one.name;
                    self.menuContainer.find("dl.inner-menu-item-selected").removeClass("inner-menu-item-selected");
                    one.addClass("inner-menu-item-selected");
                    if(self.table){
                        self.table.destroy();
                    }
                    self.table=new Table({
                        container:self.element.find("#user_table"),
                        data:options
                    });
                }).end()
                    .find("strong").html(one.name).end()
                    .attr("title",one.name).end();
                if(index==0){
                    one.find("a").addClass("user_analysis_padding");
                }else{
                    one.find("strong").addClass("smaller_font");
                }
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