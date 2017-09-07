/**
 * Created by inhand on 14-6-5.
 */
define(function(require){
    require('cloud/base/cloud');
    require('./resource/dash.css')
    var Window = require('cloud/components/window');

    var Dashboard = Class.create(cloud.Component , {
       initialize:function($super, options){
           $super(options);
           this.moduleName = 'Dashboard';

            this._render();


       } ,


       destroy:function($super){

           $super()
       }
    });

    var Dialog = Class.create(cloud.Component, {
        initialize:function($super, options){
            this.moduleName = 'DialogforDashboard';
            cloud.util.defaults(options,{
                refreshbtn:true,
                zoominbtn:false,
                zoomoutbtn:true,
                title:"",
                winWidth:1100,
                winHeight:524
            })
            $super(options);

            this._render();

            this._bindEvents();
        } ,

        _render:function(){
            var options = this.options;
            this.container = $("<div class='weight'></div>").appendTo(this.element);
            $("<div class='weight-toolbar'></div>")
                .append($("<div class='weight-toolbar-left'></div>")
                    .append($("<div class='weight-toolbar-title'></div>")))
                .append($("<div class='weight-toolbar-right'></div>")
                    .append($("<div class='weight-toolbar-refresh toolbar-button'></div>"))
//                    .append($("<div class='weight-toolbar-zoomin toolbar-button'></div>"))
                    .append($("<div class='weight-toolbar-zoomout toolbar-button'></div>")))
                .appendTo(this.container);
            $("<div class='weight-content'></div>")
                .append($("<div class='weight-content-container'></div>"))
                .appendTo(this.container);

            this.setTitle(options.title);

            options.width && this.setWidth(options.width);

            options.contentHeight && this.setContentHeight(options.contentHeight);

            this.refreshbtn = this.container.find(".weight-toolbar-refresh");
            this.zoominbtn = this.container.find(".weight-toolbar-zoomin");
            this.zoomoutbtn = this.container.find(".weight-toolbar-zoomout");

            if(!options.refreshbtn){
                this.setBtn(this.refreshbtn,false);
            }
            if(!options.zoominbtn){
                this.setBtn(this.zoominbtn,false);
            }
            if(!options.zoomoutbtn){
                this.setBtn(this.zoomoutbtn,false);
            }

        },

        _bindEvents : function(){
            var self = this;
            this.refreshbtn.bind("click",function(){
                self.fire("refresh",self)
            });
            this.zoomoutbtn.bind("click",function(){
                self.renderAndOpenWin();
                self.fire("zoomout",self)
            });
        },

        renderAndOpenWin : function(){
            var self = this;
            if(!this.window){
                this.window =  new Window({
                    container : "body",
                    title : self.options.title,
                    top: "center",
                    left: "center",
                    height: self.options.winHeight,
                    width: self.options.winWidth,
                    mask: true,
                    blurClose:true,
//                    content : self.options.winContent,
                    events : {
                        "onClose": function() {
                            this.window = null;
                        },
                        "afterShow": function(){
                            this.fire("onWinShow");
                        },
                        "afterCreated":function(){
                            this.fire("onAfterCreated")
                        },

                        scope : this
                    }
                })
            }
            this.window.show();

        },

        setWinContent: function(content){
            this.window && this.window.setContents(content);
        },

        setWidth : function(width){
            this.container.width(width);
        },

        setTitle : function(text){
            this.container.find(".weight-toolbar-title").text(text);
        },

        setContentHeight : function(height){
            this.container.find(".weight-content-container").height(height)
        },

        setBtn:function(btn,isshow){
            if(isshow){
                btn.show();
            }else{
                btn.hide();
            }
        },

        getContent : function(){
           return this.container.find(".weight-content-container");
        },


        destroy:function($super){

            $super()
        }
    });

    return Dialog;
//    return Dashboard;

})