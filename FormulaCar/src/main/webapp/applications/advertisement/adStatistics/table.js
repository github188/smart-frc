/**
 * Created by Inhand on 15-3-13.
 */
define(function(require){
    var Table = require("cloud/components/table");
    var Service = require("./service");
    var pvuvModule = require("./PVUV_Statistics/table");
    var Window = require("cloud/components/window");

    var columns=[
        {
            "title": "项目名称",
            "dataIndex": "adName",
            "width": "25%",
//            "lang":"{text:site_name}"
        },{
            "title": "素材名称",
            "dataIndex": "metaNames",
            "width": "25%",
//            "lang":"{text:site_name}"
        },{
            "title": "总PV",
            "dataIndex": "pv",
            "width": "20%",
//            "lang":"{text:site_name}"
        },{
            "title": "总UV",
            "dataIndex": "uv",
            "width": "20%",
//            "lang":"{text:site_name}"
        },{
            "title": "操作",
            "dataIndex": "name",
            "width": "10%",
//            "lang":"{text:site_name}"
            render:function(data,type,row){
                return "<a id='"+row.adId+"_detail\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查询\" lang=\"text:query\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:query\">"+"详情"+"</span></a>";
            }
        }
    ];
    var adStatistics = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.renderHtml()

            this.renderTable();
        },

        renderHtml:function(){

        },

        renderTable:function(){
            var self = this;
            this.table = new Table({
                selector: this.element,
                // service: this.service,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox : 'none',
                columns:columns,
                events:{}
            });

            Service.getAdStati({},function(data){
                self.data = data.result;
                self._procData(self.data);
                self.table.render(data.result);
                self.bindEvents();
            });

        },
        _procData:function(datas){
            datas.each(function(one){
                var pv = 0, uv = 0;
                var metaNames =[];
                one.metas && one.metas.each(function(meta){
                    metaNames.push(meta.metaName);
                    pv+=meta.pv;
                    uv+=meta.uv;
                });
                one.pv = pv;
                one.uv = uv;
                one.metaNames = metaNames;
            });
        },

        bindEvents:function(){
            var self = this;
            self.data.each(function(one){
                $("#"+one.adId+"_detail").bind("click",function(e){
//                    console.log(one);
                    self.renderWindow(one);
                });
            });
        },

        renderWindow:function(data){

            var winWidth = $('body').width()*0.9;
            var winHeight = $('body').height()*0.9;

            winHeight = winHeight>700?winHeight:700;
            winWidth = winWidth>1200?winWidth:1200;

            var $content= $("<div></div>");
            this.window = new Window({
                container : "body",
                title : "",
                top: "center",
                left: "center",
                height: winHeight,
                width: winWidth,
                mask: true,
                blurClose:true,
                content : $content,
                events : {
                    "onClose": function() {
                        this.window = null;
                    },

                    scope : this
                }
            });

            this.pvuv = new pvuvModule({
                selector:$content,
                data:data
            });

            this.window.show();

        },






        destroy:function($super){

        }
    });

    return adStatistics;
});