/**
 * Created by zhang on 14-10-10.
 */
define(function(require){
    require("cloud/base/cloud");
    var html=require("text!./partials/ITeditor.html");
    var editArea = require("text!./partials/EditArea.html");
    var service = require("./service");
    var MaterialView = require("./lib/materialView");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/ueditor/editor_all_min");
    require("cloud/lib/plugin/ueditor/editor_config");
    var Editor =  Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.data = options.data;
            this.oldData = this.data.length;
            this.delIds = [];
            this.type = this.data.length ? 1 : 2;//1:multi, 2:single
            this.service = service;
            this._render();
            this._bindEvents();
        },

        _render : function(){
            var self = this;
            this.element.html(html);
            this.$materialArea = this.element.find(".media_preview_area");
            this.$editArea = this.element.find("#js_appmsg_editor");


            this.material = new MaterialView({
                container:self.$materialArea,
                data:self.data,
                viewtype :"normal",
                events:{
                    "editItem":function(data,$ele){
//                        console.log("eidtItem",arguments);
                        if($ele){
                            var top = $ele.offset().top - $ele.parent().offset().top;
                        }else{
                            var top = 0;
                        }
                        var newData = self.editArea.getData();
//                        console.log("oldData",newData);
                        self._cache(newData);
                        self.editArea.clear();
                        self.editArea.setData(data);
                        self.editArea.setMarginTop(top);
                    },
                    "deleteItem":function(data){
                        if(data._id.toString().length == 24){//存在的素材ID
                            self.delIds.push(data._id)
                        }
//                        console.log("deleteItem",arguments);
                    }
                }
            }).module;

            var data = this.data.length > 0 ? this.data[0] : this.data;

            this._renderEditArea(data,this.type);

        },

        _cache:function(newData){
            if(this.type == 1){
                var i;
                var tmp = this.data.find(function(one,index){
                    if(one._id == newData._id){
                        i = index;
                        return true;
                    }
                });
                if(tmp){
                    this.data[i]=cloud.util.defaults(newData,this.data[i]);
                }else{
                    this.data.push(tmp)
                }
                this.material.reDraw(this.data[i]);
            }else if(this.type == 2){
                this.data = cloud.util.defaults(newData,this.data);
                this.material.reDraw(this.data);
            }
//            console.log("newData",this.data);
        },

        _bindEvents:function(){
            var self = this;
            var $back = this.element.find(".page_nav a");
            $back.bind("click",function(){
                self.fire("back");
            });

            var addOne = this.element.find("#js_add_appmsg");
            addOne.bind("click",function(){
                var one = self.material.addOneItem();
                one && self.data.push(one);
            });

            var saveBtn = this.element.find("#js_submit");
            saveBtn.bind("click",function(){
//                console.log(self.data);
                var newData = self.editArea.getData();
                self._cache(newData);
                if(!self.data.length){
                    self.data = [self.data];
                }
                if(typeof self.data[0]._id == "number"){//add
                    self.service.addMaterial(self.data,function(data){
                        console.log('add ok',data);
                        self.fire("back");
                    });
                }else{//update
                    self.service.updateMaterial(self.data,function(data){
                        //console.log('update ok',data);
                        self.fire("back");
                    });
                    self.service.delMaterial(self.delIds,function(data){
                       // console.log("delete ok",data)
                    })
                }
            });

            var resetBtn = this.element.find("#js_reset");
            resetBtn.bind("click",function(){
                if(!self.data.length){
                    var data = [self.data];
                }else{
                    var data = self.data;
                }
                self.editArea.setMarginTop(0);
                self.editArea.clear();
                self.editArea.setData(data);
            });
        },

        _renderEditArea:function(data,type){
            var self = this;
            this.editArea = new EditArea({
                container:self.$editArea,
                type:type,
                events:{
                    editorReady:function(){
                        self.editArea.setData(data);
                    },
                    dataChange:function(newData){
                        self._cache(newData);
                    }
                }
            });

        },
        destroy : function($super){
            this.editArea && this.editArea.destroy();
            this.material && this.material.destroy();

            $super();
        }

});

    /*window.UEDITOR_CONFIG = {
        UEDITOR_HOME_URL:"/cloud/lib/plugin/ueditor/",
        initialFrameWidth:'auto',
//        serverUrl: URL + "jsp/controller.jsp",
        toolbars:[["bold","italic","underline","|",'fontfamily', 'fontsize',"|","insertorderedlist","insertunorderedlist","|","simpleupload","|",'removeformat','forecolor','backcolor',"insertvideo","insertvote"]]
    };*/

    var EditArea = Class.create(cloud.Component,{
        initialize:function($super, options){
            $super(options);
            this.data = options.data;
            this.type = options.type;
            this._render();

            this.initUploader();

            this._initUeditor();

            this._bindEvents();

//            this.hide();
        },

        _render:function(){
            this.element.html(editArea);

            if(this.type == 1){
                this.$descArea = this.element.find(".js_desc_area");
                this.$descArea.hide();
            }

            this.$title = this.element.find(".js_title");
            this.$author = this.element.find(".js_author");
            this.$desc = this.element.find(".frm_textarea");
            this.$originalLink = this.element.find(".js_url");
            this.$preview = this.element.find(".js_cover.upload_preview");
            this.$uploadBtn = this.element.find("#js_appmsg_upload_cover");
            this.$showInContent = this.element.find(".js_show_cover_pic");

        },

        setMarginTop:function(top){
            var edit = this.element.find(".appmsg_editor");
            edit.css("margin-top",top);

        },

        setData:function(data){

            this._id = data._id;

            this.$title.val(data.title);
            this.$author.val(data.author);
            this.$desc.val(data.summary);
            this.$originalLink.val(data.originalLink);
            if(data.mediaUri){
                this.mediaId = data.mediaUri;
                var img = cloud.config.FILE_SERVER_URL + "/api/wechat/file/" + data.mediaUri + "?access_token=" + cloud.Ajax.getAccessToken();
                this.$preview.show();
                this.$preview.find(".img_preview").attr("src",img);
            }
            this.editor.setContent(data.content || "");
            this._checkShowInContent(data.showInContent);

        },
        clear:function(){
            this.setData({
                _id:"",
                title:"",
                author:"",
                summary:"",
                originalLink:"",
                content:"",
                showInContent:false
            });
            this.clearMediaData();
        },
        clearMediaData:function(){
            this.mediaId = null;
            this.$preview.hide();
            this.$preview.find(".img_preview").removeAttr("src");
        },

        getData:function(){
            var data = {
                mediaType:"news",
                _id:this._id,
                title:this.$title.val(),
                author:this.$author.val(),
                summary:this.$desc.val(),
                originalLink:this.$originalLink.val(),
                mediaUri:this.mediaId,
                content:this.editor.getContent(),
                showInContent:this._checkShowInContent()
            };

            return data;
        },

        _checkShowInContent:function(){
            if(arguments.length == 0){//get
                return this.$showInContent.hasClass("selected");
            }else if(arguments.length > 0){//set
                if(arguments[0]){
                    this.$showInContent.addClass("selected");
                }else{
                    this.$showInContent.removeClass("selected");
                }
            }
        },

        _bindEvents:function(){
            var self = this;
            this.element.find(".js_removeCover").bind("click",function(){
                self.clearMediaData();
                self._dataChange();
                /*self.$preview.hide();
                self.$preview.find(".img_preview").removeAttr("src");
                self.mediaId = null;*/
            });

            this.$showInContent.bind('click',function(){
                self._checkShowInContent(!self._checkShowInContent())
            });

            this.element.find("input,textarea").bind("keyup",function(){
                self._dataChange();
            })
        },
        _dataChange:function(){
            var data = this.getData();
//            console.log("dataChange",data);
            this.fire("dataChange",data);
        },

        initUploader:function(){
            var self = this;
            var uploaderUrl = "/api/wechat/file";
            this.uploader = new Uploader({
                browseElement:self.$uploadBtn,
                url:uploaderUrl,
                autoUpload: true,
                filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }],
                maxFileSize: "1mb",
                events:{
                    "onError": function(err){
//                        console.log(arguments,"onError");
                        dialog.render({text:err.text});
                    },
                    "onFilesAdded" : function(file){
//                        console.log(arguments,"onFilesAdded");
                    },
                    "onFileUploaded": function(response, file){
//                        console.log(arguments,"onFileUploaded");
                        if(response.result._id){
                            self.mediaId = response.result._id;
                            var img = cloud.config.FILE_SERVER_URL + "/api/wechat/file/" + self.mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
                            self.$preview.show();
                            self.$preview.find(".img_preview").attr("src",img);
                            self._dataChange();
                        }
                    },
                    "beforeFileUpload":function(){
//                        console.log(arguments,"beforeFileUpload");
                    }
                }
            });
//            this.element.find(".plupload.flash").css("top",0);
        },

        _initUeditor:function(){
            var self = this;
            this.editor && this.editor.destroy();
            var lang;
            switch (locale.current()){
                case 1:
                    lang = "en";
                    break;
                case 2:
                    lang = "zh-cn";
                    break;
                default :
                    lang = "zh-cn"
            }
            this.editor = UE.getEditor('js_editor',{
                onready:function(){
                    self.fire("editorReady",this);
                    self.element.find(".edui-editor-bottomContainer").hide();
                },
                lang:lang
            });
//            window.editor = this.editor;

        },

        destroy:function($super){
            this.editor && this.editor.destroy();
            this.editor = null;
            $super();
        }
    });
    return Editor
});