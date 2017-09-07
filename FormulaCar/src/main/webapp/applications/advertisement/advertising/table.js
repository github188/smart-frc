/**
 * Created by Inhand on 15-3-9.
 */
define(function(require){
    var contentTable = require("../../components/content-table");
    var Window = require("cloud/components/window");
    var Button = require("cloud/components/button");
    var Service = require("./service");
    var RightTable = require("./rightContent");
    require("./table.css")

    var columns =[
        {
            "title": "项目名称",
            "dataIndex": "name",
            "width": "25%",
//            "lang":"{text:site_name}"
        },{
            "title": "状态",
            "dataIndex": "status",
            "width": "15%",
            render:function(data,type,row){
                switch (data){
                    case 0:
                        return "未投放";
                        break;
                    case 1:
                        return "已投放";
                        break;
                    default :
                        return "未投放";
                        break;
                }
            }
//            "lang":"{text:site_name}"
        },{
            "title": "投放日期",
            "dataIndex": "publishTime",
            "width": "20%",
            render:function(data,type,row){
                if(data){
                    var time = cloud.util.dateFormat(new Date(data),"yyyy-MM-dd hh:mm:ss",false)
                }else{
                    var time = "/"
                }
                return time;
            }
//            "lang":"{text:site_name}"
        },{
            "title": "操作",
            "dataIndex": "name",
            "width": "15%",
            render:function(data,type,row){
                return "<a id='"+row._id+"_edit\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查询\" lang=\"text:query\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:query\">"+"编辑项目"+"</span></a>"
            }
//            "lang":"{text:site_name}"
        },{
            "title": "操作",
            "dataIndex": "name",
            "width": "15%",
//            "lang":"{text:site_name}",
            render:function(data,type,row){
                return "<a id='"+row._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"查询\" lang=\"text:query\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:query\">"+"投放管理"+"</span></a>"
            }
        }
    ];

    var adTable = Class.create(cloud.Component, {
        initialize:function($super,options){
            $super(options);
            this.renderHtml();
            this.renderTable();
            locale.render();
        },

        /**
         * 加载html模板，定义关键节点
         */
        renderHtml:function(){
            var html = '<div id="left-content" class="table-scroll-contents"></div>\n<div id="right-content" class="table-scroll-contents">\n</div>';
            this.element.html(html);
            this.element.addClass("content-container animate-transition");
            this.element.css("height","600px");
           // this.element.css("position","relative");
            this.leftContent = this.element.find('#left-content');
            this.rightContent = this.element.find('#right-content');
        },

        /**
         * 渲染项目content-tabel，实例化对应的service供其使用
         */
        renderTable:function(){
            var self = this;
            this.service = new Service({
                getUrl:"api/ad",
                postUrl:"api/ad",
                deleteUrl:"api/ad/"
            });

            this.contentTable = new contentTable({
                selector:self.leftContent,
                service:self.service,
                filters:{
                },
                contentColumns:columns,
                events:{
                    "create":function(){
                        self.openNameWin();
                    },
                    "delete":function(){
                        self._renderTable();
                    }
                }
            });

            this._renderTable();
        },

        /**
         * 绑定table中每一行按钮的点击事件
         * @private
         */
        _bindBtnEvent:function(){
            var self = this;
            this.datas.each(function(one){
                $("#"+one._id).bind('click',function(e){
                    //self.element.addClass("animate-scrollLeft");
                    if(self.rightTable){
                        self.rightTable.destroy();
                        self.rightTable=null;
                    }
                    $("#left-content").hide();
                    $("#left-content").css("float","right");
                    $("#right-content").css("float","left");
                    self.rightTable = new RightTable({
                        selector:self.rightContent,
                        data:one,
                        events:{
                            'back':function(){
                                //self.element.removeClass("animate-scrollLeft");
                                $("#left-content").css("float","left");
                                $("#right-content").css("float","right");
                                if(self.rightTable){
                                        self.rightTable.destroy();
                                        self.rightTable=null;
                                }
                                self._renderTable();

                            }
                        }
                    });
                });

                $("#"+one._id+"_edit").bind("click",function(e){
                    self.openNameWin(one);
                });
            });

        },
        /**
         * 渲染名称修改、添加window
         * @param data
         */
        openNameWin:function(data){
            var self = this;
            var winWidth = 340;
            var winHeight = 160;
            this.type = data ? 'edit':'create';
            var title = this.type == 'edit'? "编辑项目" : "新增项目";
            var $content = $("<div>\n    <p class=\"error-tip\">error</p>\n    <div class=\"project-win-row\">\n        <label for=\"project-name\" style=\"font-size: 14px;font-weight: bold;\">项目名称：</label>\n        <input id=\"project-name\">    \n    </div>\n    <div id=\"buttons-container\">\n        \n    </div>\n</div>")
            this.window = new Window({
                container : "body",
                title : title,
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
            data && $content.find("#project-name").val(data.name);
            var $tip = $content.find(".error-tip");

            var savebtn = new Button({
                text: "保存",
                container: $content.find("#buttons-container"),
                events: {
                    click: function(){
                        var name = $content.find("#project-name").val();
                        if(name.length>15){
                            $tip.text("长度不能大于15个字")
                            $tip.show();
                            return false;
                        }else if(name.length==0){
                            $tip.text("名称不能为空")
                            $tip.show();
                            return false;
                        }
                        if(self.type == 'edit'){
                            data.name = name;
                            self.service.editProject(data,function(res){
                                //console.log(res,'edit')
                                self._renderTable();
                                self.window.destroy();
                            });
                        }else if(self.type =='create'){
                            self.service.createProject(name,function(res){
                                //console.log(res,'create');
                                self._renderTable();
                                self.window.destroy();
                            });
                        }
                    }
                }
            });
            this.window.show();
        },

        /**
         * 渲染table数据
         * @private
         */
        _renderTable:function(){
            var self = this;
            this.contentTable.render(this.service,this.service.tag,function(data){
                self.datas = data.result;
                self._bindBtnEvent();
            });
        },

        destroy:function($super){

            $super();
        }

    });

    return adTable;
});