/**
 * Created by inhand on 14-6-21.
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    var tabmodule = require("./tabModule");
    var Service = require("./service");

    var leftTab = Class.create(cloud.Component ,{
        initialize:function($super,options){
            this.moduleName = "leftTab"
            $super(options);

            this.elements = this.options.elements

            this.service = Service;

            this._renderLayout();

            this._renderTable();

            this._renderToolbar();

        },

        _renderTable:function(){//render List
            var self = this;
            this.options.datas.each(function(data){
                new tabmodule({
                   selector:self.elements.content,
                    data:data,
                    chart:false,
                    events:{
                        more:function(){
                            self.fire("more",data)
                        },
                        submit:function(name){
                            self.updateName(data,name,this);
                        }
                    }
                });

            })


        },

        updateName:function(data, name, tab){
            this.service.updateTypeName({
                tid: data.id,
                name: name
            },function(res){
                //console.log("success",res)
                tab.setTitle(res.result);
                data.name = res.result;
            })

        },

        _renderToolbar:function(){

        },




        _renderLayout:function(){
            this.element.layout({
                defaults: {
                    paneClass: "pane",
                    "togglerLength_open": 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 0,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: "#animate-left-toolbar",
                    size: 30
                },
                center: {
                    paneSelector: "#animate-left-content"
                }
            })
        },


        destory:function($super){


            $super()
        }

    })

    return leftTab
})