/**
 * Created by zhang on 14-10-10.
 */
define(function(require){
    require("cloud/base/cloud");
    var service = require("../service");
    var ITview = require("./ITview");
    var ITeditor = require("./ITeditor");
    var ImageText =  Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.service = service;
            this._render();
        },
        _render:function(){
            this._renderView();
        },

        _renderView:function(){
            var self = this;
            this.viewPage && this.viewPage.destroy();
            this.editPage && this.editPage.destroy();
            this.viewPage = new ITview({
                container:self.element,
                events:{
                    "edit":function(data){
                        self._renderEditor(data);
                    },
                    "new":function(data){
                        if(data == 1){
                            self._renderEditor({
                                _id:new Date().getTime()
                            });
                        }else if(data == 2){
                            self._renderEditor([{
                                _id:new Date().getTime()+1,
                                isCover:true,
                                cover:true
                            },{
                                _id:new Date().getTime()
                            }])
                        }
                    },
                    "reRender":function(){
                        self._renderView();
                    }

                }
            });

        },

        _renderEditor:function(data){
            var self = this;
            this.viewPage && this.viewPage.destroy();
            this.editPage && this.editPage.destroy();
            this.editPage = new ITeditor({
                container : self.element,
                data : data,
                events : {
                    "save" : function(){

                    },
                    "cancel" : function(){

                    },
                    "back" : function(){
                        self._renderView();
                    }
                }
            })
        },

        destroy : function($super){
            this.viewPage && this.viewPage.destroy();
            this.editPage && this.editPage.destroy();
            $super();
        }
    });
    return ImageText
});