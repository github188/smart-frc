/**
 * Created by Inhand on 15-3-10.
 */
define(function(require){
    var contentTable = require("../../components/content-table");
    var Button = require("cloud/components/button");
    var Window = require("cloud/components/window");
    var Service = require("./service");
    var EditorPage = require("./editorPage");
    var adData = require("./adJson");
    require("./table.css");

    var topcolumns = [
        {
            "title": "素材名称",
            "dataIndex": "metaname",
            "width": "20%",
//            "lang":"{text:site_name}"
        },{
            "title": "类型",
            "dataIndex": "type",
            "width": "8%",
            render:function(data,type,row){
                switch (data){
                    case 1:
                        return '图片';
                        break;
                    default:
                        return '图片';
                        break;
                }
            }
//            "lang":"{text:site_name}"
        },
        /*
        {
            "title": "行业",
            "dataIndex": "trade",
            "width": "17%",
            render:function(data,type,row){
                switch (data){
                    case 1:
                        return '默认';
                        break;
                    default:
                        return '默认';
                        break;
                }
            }
        },*/
        {
            "title": "关联广告位",
            "dataIndex": "bannerLocationId",
            "width": "27%",
            render:function(data,type,row){
                var res = adData.find(function(one){
                    return one._id==data
                });
                if(res){
                    return res.name;
                }else{
                    return '无效广告位';
                }
            }
//            "lang":"{text:site_name}"
        },{
            "title": "操作",
            "dataIndex": "name",
            "width": "15%",
            render:function(data,type,row){
                return "<a id='"+row._id+"_review\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查询\" lang=\"text:query\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:query\">"+"预览"+"</span></a>";
            }
//            "lang":"{text:site_name}"
        },{
            "title": "操作",
            "dataIndex": "name",
            "width": "15%",
            "lang":"{text:site_name}",
            render:function(data,type,row){
                return "<a id='"+row._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查询\" lang=\"text:query\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:query\">"+"编辑"+"</span></a>"
            }
        }
    ];
    var bottomcolumns = [
        {
            "title": "售货机名称",
            "dataIndex": "name",
            "width": "35%",
//            "lang":"{text:device_name}"
        }];
    var rightTable = Class.create(cloud.Component,{
        initialize:function($super, options){
            $super(options);

            this.options = options;

            this.renderHtml();
            this.renderLayout();
            this.renderTop();
            this.renderBottom();
            this.initPublishData();

        },

        /**
         * 画出上中下布局，上部为素材的content-table，
         * 中部为机构的content-table，
         * 下部只有投放按钮
         */
        renderLayout:function(){
            this.layout = this.$container.layout({
                defaults: {
                    paneClass: "pane",
                    "togglerLength_open": 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
//                    "spacing_open": 0,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    spacing_open:1,
                    paneSelector: "#top-content",
                    size: '55%'
                },
                center: {
                    spacing_open:0,
                    paneSelector: "#bottom-content"
                    // paneClass: this.elements.content
                },
                south:{
                    spacing_open:0,
                    paneSelector:"#puton-button",
                    size:24
                }
            });

        },

        /**
         * 加载html模板，定义关键节点
         */
        renderHtml:function(){
            var html = '<div id="right-container">\n    <div id="top-content"></div>\n    <div id="bottom-content"></div>\n    <div id="puton-button"></div>\n</div>';
            this.element.html(html);
            this.$container = this.element.find("#right-container");
            this.$topcontent = this.element.find("#top-content");
            this.$bottomcontent = this.element.find("#bottom-content");
        },

        /**
         * 渲染上部素材content-table，
         * 实例化相应的service，供其使用。
         */
        renderTop:function(){
            var self = this;

            this.service = new Service({
                getUrl:"api/banner/get",
                postUrl:"api/banner/get",
                deleteFun:"deleteMate"
            });
            this.topTable = new contentTable({
                selector:self.$topcontent,
                service:self.service,
                contentColumns:topcolumns,
                events:{
                    "create":function(){
                        var adId = self.options.data._id;
                        self.editorPage && self.editorPage.destroy();
                        self.editorPage = new EditorPage({
                            events:{
                                "update":function(){
                                    self._renderTable();
                                    self.initPublishData();
                                }
                            },
                            data:{
                                adId:adId
                            }
                        });

                    },
                    "delete":function(){
//                        self._renderTable();
                        self.initPublishData();
                    }
                }
            });

            this._renderTable();

            /*this.topTable.render(this.service,this.service.tag,function(data){
                self.datas = data.result;
                self._bindBtnEvent();
            });*/

            var topToolbar = this.topTable.getToolbar();
            this.renderTopName(topToolbar);
        },
        /**
         * 修改素材content-table的toolbar，
         * @param topToolbar content-table的toolbar对象
         */
        renderTopName:function(topToolbar){
            var self = this;
            switch (this.options.data.status){
                case 0:
                    var status =  "未投放";
                    break;
                case 1:
                    var status = "已投放";
                    break;
                default :
                    var status =  "未投放";
                    break;
            }

            var $name = $("<span id='name-tip'>"+this.options.data.name+"  ——  "+status+"</span>");
            var $button = $("<div id='return-button'></div>");

            new Button({
                text: "返回",
                container: $button,
                events: {
                    click: function(){
                        self.fire('back');
                        $("#left-content").hide();
                    }
                }
            });

            topToolbar.appendLeftItems([$name,$button])


        },
        /**
         * 为每一行的编辑按钮绑定事件
         * @private
         */
        _bindBtnEvent:function(){
            var self = this;
            var adId = this.options.data._id;
            if(this.datas!=null){
                this.datas.each(function(one){
                    //编辑按钮click事件
                    self.element.find("#"+one._id).bind('click',function(e){
                        one.adId = adId;
                        self.editorPage && self.editorPage.destroy();
                        self.editorPage = new EditorPage({
                            data:one,
                            events:{
                                "update":function(){
                                    self._renderTable();
                                    self.initPublishData();
                                }
                            }
                        });
                        e.stopPropagation()
                    });
                    //预览按钮click事件
                    self.element.find("#"+one._id+"_review").bind('click',function(e){
                        self._review(one);
                        e.stopPropagation()
                    });
                });
            }
        },
        /**
         * 渲染素材content-table的数据，并将deferred对象保存
         * @private
         */
        _renderTable:function(){
            var self = this;
            //将参数传给service的getTableresource方法
            this.service.setParameter({
                adId:self.options.data._id
            });
            this.topdefer = this.topTable.render(this.service,this.service.tag,function(data){
                self.datas = data.result;
                self._bindBtnEvent();
            });
        },

        /**
         * 渲染预览框，并改变title的样式
         * @param data 素材对象
         * @private
         */
        _review:function(data){
            var self = this;
            var winWidth = data.picWidth || 350;
            var winHeight = data.picHeight || 530;

            var rate = winWidth/winHeight;//保存宽高比

            winHeight = winHeight<560 ?winHeight : 560;
            winWidth = winHeight*rate;

            var imgUrl = cloud.config.FILE_SERVER_URL + "/api/banner/meta?_id=" + data._id + "&access_token=" + cloud.Ajax.getAccessToken();
            var $img = $("<img>");
            $img.attr('src',imgUrl).css({
                width:winWidth,
                height:winHeight
            });
            this.reviewWin = new Window({
                container : "body",
                title : "",
                top: "center",
                left: "center",
                height: winHeight,
                width: winWidth,
                mask: true,
                blurClose:true,
                content : $img,
                events : {
                    "onClose": function() {
                        this.reviewWin = null;
                    },
//                        "afterShow": function(){
//                            this.fire("onWinShow");
//                        },
//                        "afterCreated":function(){
//                            this.fire("onAfterCreated")
//                        },

                    scope : this
                }
            });

            this.reviewWin.element.find(".ui-window-title").hide();
            this.reviewWin.element.find(".ui-window-content").css({
                width:winWidth,
                height:winHeight,
                overflow:"hidden"
            })
            this.reviewWin.show();

        },

        /**
         * ,处理数据返回一个对象
         * ,根据选中的素材和每个素材对应的广告位Id，聚合以广告位为维度的新对象。
         * @returns {{res: Array, adId: adId}}
         * @private
         */
        _procDatas:function(){
            var Ads = [];
            var AdIds = ['ad_id_default','ad_id_01','ad_id_02','ad_id_03'];//广告位Id，与微站端约定好的，不是项目Id
            AdIds.each(function(id,index){
                Ads[index]={
                    rtype:id,
                    banners:[]
                }
            });
            var datas = this.topTable.getSelectedResources();//获取选中的素材对象
            datas.each(function(data,index){
                var oneAd = Ads.find(function(one,i){
                    return one.rtype == data.bannerLocationId;
                });
                oneAd.banners.push(data);
            });
            return {res:Ads,adId:this.options.data._id};
        },

        /**
         * 渲染机构content-table，实例化相应的service供其使用
         */
        renderBottom:function(){
            var self = this;

            this.bottomservice = new Service({
                getUrl:"api/automat/list_new",
                postUrl:"api/automat/overview"
            });
            this.bottomTable = new contentTable({
                selector:self.$bottomcontent,
                service:self.service,
                contentColumns:bottomcolumns
            });

            this.bottomdefer = this.bottomTable.render(this.bottomservice,this.bottomservice.tag,function(data){

            });

            var bottomToolbar = this.bottomTable.getToolbar();
            this.renderBottomtoolber(bottomToolbar);

        },

        /**
         * 修改机构content-table的toolbar。隐藏添加和删除按钮
         * 在布局底部渲染投放按钮
         * @param bottomToolbar
         */
        renderBottomtoolber:function(bottomToolbar){
            var self = this;
            bottomToolbar.deleteRightItem(0);
            bottomToolbar.deleteRightItem(0);
            var $btnContanier = $('#puton-button');
            new Button({
                text: "投  放",
                container: $btnContanier,
                events: {
                    click: function(){
                        var orgs = self.bottomTable.getSelectedResources();
                        var ads = self.topTable.getSelectedResources();
                        var obj = self._procDatas();
//                        console.log(orgs,'selectOrg');
//                        console.log('selectMaterialJSON:'+JSON.stringify(obj))
                        self.service.publishAd({
                            adId:self.options.data._id,
                            desc:JSON.stringify(obj),
                            oids:orgs.pluck("_id"),
                            bannerIds:ads.pluck("metaId")
                        },function(result){
                            if(result.result){
                                dialog.render({
                                    text:"投放成功"
                                });
                            }
//                            console.log(result,"publish result");
                        })
                    }
                }
            }).element.addClass("puton-button");

        },

        /**
         * 初始化数据，将上次投放的绑定关系渲染出来。
         */
        initPublishData:function(){
            var self = this;
            //等到两个table的数据都返回后，再获取投放信息。
            $.when(this.topdefer,this.bottomdefer).done(function(){
                self.service.getPublishData(self.options.data._id,function(data){
//                    console.log(data,'this project publish data');
                    var metaHash = $H();
                    if(self.datas!=null){
                        self.datas.each(function(one){
                            metaHash.set(one.metaId,one._id);
                        });
                    }

                    var result = data.result;
                    if(result){
                        var toparr = [],bottomarr = [];
                        result.banners.each(function(one){
                            var _id = metaHash.get(one);
                            var row = self.topTable.content.getRowById(_id);
                            if(row){
                                toparr.push(row);
                            }
                        });
                        result.oids.each(function(one){
                            var row = self.bottomTable.content.getRowById(one);
                            if(row){
                                bottomarr.push(row);
                            }
                        });
                        self.topTable.content.selectRows(toparr);
                        self.bottomTable.content.selectRows(bottomarr);
                    }

                });
            });

        },

        destroy:function($super){
            this.layout && this.layout.destroy();
            this.element.empty();
//            $super()
        }
    });

    return rightTable;

});