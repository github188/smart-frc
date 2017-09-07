/**
 * Created by Inhand on 15-3-11.
 */
define(function(require){
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Service = require("./service");
    var Window = require("cloud/components/window");
    var html = require('text!./contentTpl.html');
    var Uploader = require("cloud/components/uploader");
    var validator = require("cloud/components/validator");
    var JsonData=require("./adJson");


    require("./table.css");
    var columns=[
        {
            "title": "广告位名称",
            "dataIndex": "name",
            "width": "35%"
//            "lang":"{text:device_name}"
        },{
            "title": "广告位ID",
            "dataIndex": "_id",
            "width": "45%"
//            "lang":"{text:device_name}"
        },{
            "title": "尺寸",
            "dataIndex": "name",
            "width": "20%",
            render:function(data,type,row){
                return row.width+"*"+row.height;
            }
//            "lang":"{text:device_name}"
        }];

    var editorPage = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);

            this.options = options;
            this.type = this.options.data._id ? 'edit':'create';

            this.renderHtml();

            this.renderWindow();

            this.renderLayout();

            this.initService();

            this.renderButtons();

            this.renderTable();

            this.initData();

            this.initValidate();

        },
        /**
         * 加载html模板，定义关键节点
         */
        renderHtml:function(){
            this.contentElement = $(html);
            this.title = this.contentElement.find(".material-title");
            this.img = this.contentElement.find('.material-pic');
            this.imgHeight = this.contentElement.find("#material-width");
            this.imgWidth = this.contentElement.find("#material-height");
            this.imgName = this.contentElement.find("#material-src");
            this.materialUrl = this.contentElement.find("#material-url");
            this.materialName = this.contentElement.find("#material-name");

            this.trade = this.contentElement.find("#material-business");

            this.advertising = this.contentElement.find("#ad-table-container");

        },
        /**
         * 渲染window容器框
         */
        renderWindow:function(){
            var self = this;
            var winWidth = $("body").width()*0.8;
            var winHeight = $("body").height()*0.8;
            var title = this.type == 'edit'? "编辑素材":"新增素材";
            winWidth = winWidth>800 ?winWidth : 800;
            winHeight = winHeight>600 ?winHeight : 637;
            this.window = new Window({
                container : "body",
                title : title,
                top: "center",
                left: "center",
                height: winHeight,
                width: winWidth,
                mask: true,
                blurClose:true,
                content : self.contentElement,
                events : {
                    "onClose": function() {
                        this.window = null;
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
            this.window.show();

        },
        /**
         * 划分window内容布局
         */
        renderLayout:function(){
            this.contentElement.layout({
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
                    paneSelector: "#top-editor",
                    size: 365
                },
                center: {
                    paneSelector: "#center-ad"
                    // paneClass: this.elements.content
                }
                /*south:{
                    paneSelector:"#bottom-buttons",
                    size:24
                }*/
            });
        },
        /**
         * 初始化service，为取数据做准备
         */
        initService:function(){
            this.service = new Service({

            });
        },
        /**
         * 更新素材接口
         */
        updateMate:function(){
            var self = this;
            var url = cloud.config.FILE_SERVER_URL + "/api/banner/update";
            var param = this._getParam();
            param.withoutPic = 0;
            url = url + "?" + $.param(param);

            $.ajax({
                url:url,
                type:"post",
                contentType:"application/octet-stream",
                processData:false,
                data:{},
                success:function(data){
                    dialog.render({
                        text:"操作成功"
                    });
                    self.window.destroy();
                    self.fire('update');
                },
                error:function(error){
//                    console.log(error)
                }
            });
        },
        /**
         * 渲染上传按钮、保存按钮。并为保存添加点击事件
         */
        renderButtons:function(){
            var self = this;
            this.uploadBtn = new Button({
                imgCls: "cloud-icon-shangchuan",
                container: self.contentElement.find(".upload-button")
            });

            this.saveBtn = new Button({
                text:"保存",
                container: self.contentElement.find(".save-button"),
                events:{
                    click:function(){
                        if(self._validate()){//验证输入值
                            if(self.uploader.files.length>0){//有文件用uploader上传
                                self.uploader.start()
                            }else if(self.type == "edit"){//修改素材，没有文件发送ajax请求
                                self.updateMate();
                            }else if(self.type == 'create'){//添加素材，没有文件需要指定
                                dialog.render({
                                    text:"请上传图片"
                                });
                            }
                        }

                    }
                }
            });

            this.initUploader();
        },
        /**
         * 为保存按钮添加上传插件，使用源生的plupload，封装过的插件无法使用html5。
         */
        initUploader: function(){
            var self = this;
            if(this.type == 'create'){
                var uploaderUrl = cloud.config.FILE_SERVER_URL + "/api/banner/add" // "&filename=" + self.fileName+"&url=www.taobao.com"+"&name=123";
            }else if(this.type == 'edit'){
                var uploaderUrl = cloud.config.FILE_SERVER_URL + "/api/banner/update" //+ "&file_name=" + fileName;
            }

            this.uploader = new plupload.Uploader({
                runtimes : 'gears,html5,flash,silverlight,browserplus',
                browse_button : self.uploadBtn.id,
//                container: self.uploadBtn.id,
                max_file_size : '10mb',
                multipart : false,
                multi_selection:false,
                url : uploaderUrl,
//                resize : {width : 120, height : 100, quality : 90},
                flash_swf_url : require.toUrl("cloud/resources/flashs/plupload.flash.swf"),
                silverlight_xap_url :require.toUrl("cloud/resources/flashs/plupload.silverlight.xap"),
                filters : [
                    {title : "Image files", extensions : "jpg,gif,png,jpeg"}
                ]
            });

            this.uploader.init();
            //添加文件事件
            this.uploader.bind('FilesAdded', function(up, files) {
                up.files.each(function(onefile){
                    if(onefile.id!=files[0].id){
                        up.removeFile(onefile);
                    }
                });

                self.fileName = files[0].name;
                self.imgName.val(self.fileName);
                var file = $("#"+self.uploader.id+"_html5")[0].files;
                var reader = new FileReader();
                reader.onload = (function(e) {
                    self.img.attr('src',e.target.result);
                    self.imgWidth.val(self.img[0].naturalWidth);
                    self.imgHeight.val(self.img[0].naturalHeight);
                });

                reader.readAsDataURL(file[0]);
            });
            //开始上传事件
            this.uploader.bind('BeforeUpload',function(up, file){
                var url = uploaderUrl;
                var paramObj = self._getParam();
                url = url + "?" + $.param(paramObj);
                up.settings.url = url;
            });
            //上传成功事件
            this.uploader.bind('FileUploaded',function(up,file,res){
                var response = JSON.parse(res.response)
                if(response.result){
                    dialog.render({
                        text:"操作成功"
                    });
                    self.window.destroy();
                    self.fire('update');
                }
            });

        },
        /**
         * 表单验证
         * @returns {boolean}
         * @private
         */
        _validate:function(){
            if (!(validator.result("#material-form"))){
                this.contentElement.find("#material-form input").trigger("blur");
                return false;
            }
            if(!(this.getSelectedResources().pluck('_id')[0])){
                dialog.render({
                    text:"请选择关联广告位"
                });
                return false;
            }
            return true;
        },

        /**
         * 获取表单参数
         * @returns {{metaname: *, filename: (*|string), url: *, type: (*|jQuery), trade: (*|jQuery), locationId: *, picHeight: *, picWidth: *, access_token: *}}
         * @private
         */
        _getParam:function(){
            var self = this;
            var name = self.materialName.val();
            var type = $(".material-row-radio:checked").val();
            var trade = $("#material-business :selected").val();
            var locationId = self.getSelectedResources().pluck('_id')[0];
            var paramObj = {
                adId:this.options.data.adId,
                metaname:name,
                filename:self.imgName.val()||"default."+this.options.data.ext,
                url:self.materialUrl.val(),
                type:type,
                trade:trade,
                locationId:locationId,
                picHeight:self.imgHeight.val(),
                picWidth:self.imgWidth.val(),
                access_token:cloud.Ajax.getAccessToken()
            }
            if(self.type =='edit'){
                paramObj._id = self.options.data._id;
            }
            return paramObj;
        },
        /**
         * 渲染广告位table
         */
        renderTable:function(){
            var self = this;
            this.table && this.table.destroy();
            this.table = new Table({
                selector:self.advertising,
                checkbox:'single',
                datas: JsonData,
                columns:columns,
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                events:{

                }

            });

        },

        getSelectedResources: function() {
            var self = this;
            var selectedRes = $A();
            self.table && self.table.getSelectedRows().each(function(row){
                selectedRes.push(self.table.getData(row));
            });
            return selectedRes;
        },

        /**
         * 初始化数据，若为编辑，将数据加载到表单中
         */
        initData:function(){
            if(this.type == 'edit'){
                var data = this.options.data;
                var imgurl =  cloud.config.FILE_SERVER_URL + "/api/banner/meta?_id=" + data._id + "&access_token=" + cloud.Ajax.getAccessToken();
                this.img.attr('src',imgurl);
                this.imgHeight.val(data.picHeight);
                this.imgWidth.val(data.picWidth);
//                this.imgName.val(data.metaname);
                this.materialName.val(data.metaname);
                this.materialUrl.val(data.url);
                this.trade.val(data.trade);
                $(':radio[name="material-type"][value="'+data.type+'"]').attr("checked",true);
                var row = this.table.getRowById(data.bannerLocationId);
                this.table.selectRows([row]);
                this.title.text(data.metaname);
            }else if(this.type == 'create'){
                this.title.text("");
                $(':radio[name="material-type"][value="1"]').attr("checked",true);
            }
        },

        /**
         * 初始化表单验证插件
         */
        initValidate:function(){
            validator.render("#material-form",{
                promptPosition:"bottomLeft"
            });
        },

        destroy:function($super){
            $super();

        }
    });

    return editorPage;
});