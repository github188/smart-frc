/**
 * Created by zhang on 14-7-18.
 */
define(function(require){
    var NavThird = require("cloud/components/nav-third");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var package = require("./package");
    var sim = require("./SIM");

    require("./table.css");

    var Table = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this._render();

        },

        _render:function(){
            this._renderLayout();
            this._renderNavThird();
        },

        _renderLayout:function(){
            var html = "<div class='cost-nav'></div>"+
                "<div class='cost-content'></div>";
            this.element.html(html);

            this.layout = this.element.layout({
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
                    paneSelector: ".cost-nav",
                    size: 182
                },
                center: {
                    paneSelector: ".cost-content"
                }
            });
        },

        _renderNavThird:function(){
            var self = this;
            var $content = $(".cost-content");
            this.navThird = new NavThird({
                selector:".cost-nav",
                main:{
                    text:locale.get("cost_stat")//"费用统计",
//                    lang:""
                },
                sub:[
                    {
                        text:locale.get("pack_management"),//"套餐管理",
//                        lang:"",
                        id:"cost-nav-package",
                        status:1,
                        click:function(){
                            self.app && self.app.destroy();
                            self.app = new package({
                                selector:$content
                            });
                        }
                    },{
                        text:locale.get("sim_management"),//"SIM卡管理",
//                        lang:"",
                        id:"cost-nav-sim",
                        status:0,
                        click:function(){
                            self.app && self.app.destroy();
                            self.app = new sim({
                                selector:$content,
                                events:{
                                    "setDefault":function(){
                                        self.element.find('#cost-nav-package').click();
                                    }
                                }
                            })

                        }
                    }
                ]
            });

            self.app && self.app.destroy();
            self.app = new package({
                selector:$content
            });
        },




        destroy:function($super){
            this.app && this.app.destroy()
            $super()

        }
    });
    return Table;

});