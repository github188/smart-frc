/**
 * Created by inhand on 14-6-18.
 */
define(function(require){
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");

    require("./tabModule.css");


    var columns = [{
        "sortable":false,
        "title":locale.get("date"),//"日期",
        "dataIndex": "date",
        "width": "25%"
    },{
        "sortable":false,
        "title":"PV",
        "dataIndex": "pv",
        "width": "25%"
    }/*,{
        "sortable":false,
        "title":"用户UV",
        "dataIndex": "useruv",
        "width": "25%"
    }*/,{
        "sortable":false,
        "title":"UV",
        "dataIndex": "terminaluv",
        "width": "25%"
    }]
//    var Data = [{
//        date:"今日",
//        pv:32,
//        useruv:21,
//        terminaluv:11
//    },{
//        date:"昨日",
//        pv:32,
//        useruv:21,
//        terminaluv:11
//    },{
//        date:"总计",
//        pv:32,
//        useruv:21,
//        terminaluv:11
//    }]

    var tabmodule = Class.create(cloud.Component,{
        initialize : function($super,options){

            this.moduleName = "tabModule"

            cloud.util.defaults(options,{
                type:"sub",
                zip:true,
                morebtn:true,
                edit:true,
                chart:true


            })

            $super(options);

            this._draw();

            this._render();

            this.id = this.options.data.id;

            this.name = this.options.data.name;


        },

        _draw:function(){

            this.$tabContainer = $("<div class='tabmodule-container'>").appendTo(this.element);

            this.$headerContainer = $("<div class='tabmodule-header'>").appendTo(this.$tabContainer);


        },
        _render:function(){
            var self = this;
            this.table = new Table({
                selector:self.$tabContainer,
                datas:self.options.data.data,
                columns: columns,
                events: {

                }
            });

            this._renderHeader();
            this._renderMainContent();

        },


        getContainer:function(){

            return this.$subContainer || this.$tabContainer;

        },

        _renderHeader:function(){
            var self = this;

            this.$toggler = $("<span class='tabmodule-toggler'>").appendTo(this.$headerContainer);
            this.$title = $("<input type='text' class='tabmodule-title' disabled='disabled'/>").appendTo(this.$headerContainer);
            this.$btn = $("<div class='tabmodule-btn'>").appendTo(this.$headerContainer);
            this.$morebtn = $("<div class='tabmodule-morebtn'>").appendTo(this.$headerContainer);
            this.$id = $("<span class='tabmodule-id'>").appendTo(this.$headerContainer);
            //editbtns
            if(this.options.edit){
                this.editBtn = new Button({
                    container : self.$btn,
                    imgCls : "cloud-icon-edit",
                    events : {
                        "click":self._enabled.bind(self)

                    }
                });

                this.submitBtn = new Button({
                    container : self.$btn,
                    imgCls : "cloud-icon-yes",
                    events : {
                        "click" :function(){
                            //console.log("submit");
                            self._disabled();
                            self.name = self.tmpName;
//                        self.setTitle(self.tmpName);
                            self.fire("submit",self.name);
                        }


                    }
                });

                this.editBtn.hide();
                this.submitBtn.hide();
            }
            //chart btn
            if(this.options.chart){
                this.chartBtn = new Button({
                    container : self.$morebtn,
                    imgCls : "cloud-icon-table",
                    events : {
                        "click":function(){
                            self.fire("showChart");
                        }

                    }
                })
            }
            //more detail btns
            if(this.options.morebtn){
                this.moreBtn = new Button({
                    container : self.$morebtn,
                    imgCls : "cloud-icon-watch",
//                cls:"more-btn-float",
                    events : {
                        "click":function(){
                            self.fire("more");
                        }

                    }
                });
//            this.moreBtn.hide();
            }




            //bind events
            this.$title.val(this.options.data.name);
            this.$title.bind("blur",function(){
                //console.log("blur")
                setTimeout(function(){
                    self._disabled()
                },400);
                self.tmpName = self.getTitle();
                self.setTitle(self.name);
            }).bind("keypress",function(e){
                    if(e.keyCode == 13){
                        self._disabled();
                        self.name = $(this).val();
                        self.fire("submit",self.name);
                    }
                });
            this.$headerContainer.bind("mouseover",function(e){
                self.editBtn && self.editBtn.show();
//                    self.moreBtn.show()
            })
                .bind("mouseleave",function(e){
                    self.editBtn && self.editBtn.hide();
//                    self.moreBtn.hide();
                });
            this.$id.text(this.options.data.id);

        },

        setTitle:function(value){
            this.$title.val(value);
        },

        getTitle:function(){
            return this.$title.val();
        },

        _enabled : function(){
            var self = this;
            if(this.options.edit){
                this.submitBtn.show();
                this.editBtn.hide();
            }
//            this.moreBtn.hide();
            this.$headerContainer.unbind("mouseover").bind("mouseover",function(e){
//                self.moreBtn.show();
            })
                .unbind("mouseleave").bind("mouseleave",function(e){
//                    self.moreBtn.hide();
                });
            this.$title.removeAttr("disabled").focus();
        },

        _disabled : function(){
            var self = this;
            if(this.options.edit){
                this.submitBtn.hide();
                this.editBtn.hide();
            }
//            this.moreBtn.hide();
            this.$headerContainer.unbind("mouseover").bind("mouseover",function(e){
//                self.moreBtn.show();
                self.editBtn && self.editBtn.show();
            })
                .unbind("mouseleave").bind("mouseleave",function(e){
//                    self.moreBtn.hide();
                    self.editBtn && self.editBtn.hide();
                });
            this.$title.attr("disabled","disabled");
        },

        _renderMainContent:function(){
            //content just for 'main'
            if(this.options.type == "main"){
                var self = this;
                this.showBtn = new Button({
                    container : self.$toggler,
                    imgCls : "cloud-icon-arrow",
                    events : {
                        "click" : function(){
                            this.hide();
                            self.hideBtn.show();
                            self.$subContainer.show()
                        }


                    }
                });
                this.hideBtn = new Button({
                    container : self.$toggler,
                    imgCls : "cloud-icon-arrow3",
                    events : {
                        "click" : function(){
                            this.hide();
                            self.showBtn.show();
                            self.$subContainer.hide();
                        }

                    }
                });
                this.$subContainer = $("<div class='tabmodule-subContainer'></div>").appendTo(this.$tabContainer)
                this.$headerContainer.addClass("main-header");

                if(this.options.zip){
                    this.hideBtn.hide();
                    this.$subContainer.hide()
                }else{
                    this.showBtn.hide();
                    this.$subContainer.show()
                }
            }
        },

        destory:function($super){
            $super()
        }

    });

    return tabmodule;

})