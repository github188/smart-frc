/**
 * Created by zhang on 14-10-20.
 */
define(function(require){
    require("cloud/base/cloud");
    var Window=require("cloud/components/window");
    var ruleItemHtml = require("text!./partials/rule_item.html");
    var MaterialView=require("./material/lib/materialView");
    var service=require("./ruleService");
    require("./css/keywords.css");
    //规则展开后详细模式下，单个关键字 li
    var detailWords = '<li>'+
        '<div class="desc">'+
        '<strong class="title Js_keyword_val">word</strong>'+
        '</div>'+
        '<div class="opr">'+
        '<a href="javascript:;" class="icon14_common edit_gray Js_keyword_edit">编辑</a>'+
        '<a href="javascript:;" class="icon14_common del_gray Js_keyword_del">删除</a>'+
        '</div>'+
        '</li>';
    //规则展开前概要模式下，单个关键字li
    var overviewWords = '<li><em class="keywords_name">word</em></li>';
    //编辑、添加关键字弹出框内容
    var keyWordContent = '<div>' +
        '<div class="dialog_bd">' +
        '<div class="emotion_editor_wrp" id="Js_textEditor"><div class="emotion_editor">'+
        //        '<div class="edit_area js_editorArea" style="display: none;"></div>' +
        '<div class="edit_area js_editorArea" contenteditable="true" style="overflow-y: auto; overflow-x: hidden;"></div>'+
        '</div>'+
        '</div>' +
        '</div>' +
        '<div class="dialog_ft">'+
        '<span class="btn btn_primary btn_input js_btn_p save_btn"><button type="button" class="js_btn" data-index="0">确定</button></span>'+
        '<span class="btn btn_default btn_input js_btn_p cancel_btn"><button type="button" class="js_btn" data-index="1">取消</button></span>'+
        '</div>'+
        '</div>';
    //编辑内容选择图文信息弹出框内容
    var appmsgContent = "<div class='picandtext dialog_bd'>" +
        "<div class='dialog_media_container'>" +
        "<div class='sub_title_bar in_dialog'>" +
        "<div class='info'>" +
        "<div class='appmsg_create'>" +
        "<a class='single_a'>" +
        "<i class='icon_appmsg_small'>" +
        "</i>" +
        "<strong>新建图文消息</strong>" +
        "</a>" +
        "<a class='multi_a'>" +
        "<i class='icon_appmsg_small multi'>" +
        "</i>" +
        "<strong>新建多图文消息</strong>" +
        "</a>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='js_appmsg_list appmsg_list media_dialog'>" +
        "<div class='appmsg_col' id='left_col_multimedia'>" +
        "<div class='inner'>" +
        "</div>" +
        "</div>&nbsp" +
        "<div class='appmsg_col'  id='right_col_multimedia'>" +
        "<div class='inner'>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='dialog_ft'>" +
        "<span class='btn btn-primary btn_input js_btn_p'>" +
        "<button type='button' class='js_btn save_btn'>确定</button>" +
        "</span>" +
        "<span class='btn btn-default btn_input js_btn_p'>" +
        "<button type='button' class='js_btn cancel_btn'>取消</button>" +
        "</span>" +
        "</div>";
    /**
     *  单个规则对象
     * @type {Component|*}
     */
    var ruleItem = Class.create(cloud.Component,{
        initialize:function($super,options){
            $super(options);
            this.data = cloud.util.defaults(options.data || {},{
                value:""
            });
            this.service = service;
            this.index = options.index || false;
            this.type = options.type || "overview";//"overview"||"detail"
            this._procData();
            this._render();
            this._bindBtnEvents();
        },
        /**
         * 渲染html并绑定DOM对象
         * @private
         */
        _render:function(){
            $(ruleItemHtml).appendTo(this.element);

            this.$index = this.element.find(".keywords_rule_num");

            this.$name = this.element.find(".frm_input");

            this.$valueOverview = this.element.find(".keywords_rule_overview");
            this.$valueOverview.list = this.$valueOverview.find(".overview_keywords_list");
            this.$valueDetail = this.element.find(".keywords_rule_detail");

            this.$valueDetail.list = this.$valueDetail.find(".keywords .keywords_list");
            this.$switch = this.element.find(".icon_dropdown_switch").parent();
            this.$keyWordMode =this.element.find(".Js_keyword_mode");
            this.$wordAddBtn = this.element.find(".Js_keyword_add");
            this.textTab = this.element.find(".tab_text");
            this.appmsgTab = this.element.find(".tab_appmsg");

            this.$saveBtn = this.element.find(".Js_rule_save");
            this.$delBtn = this.element.find(".Js_rule_del");

            this.$modelContent = this.element.find(".model_content");
            this.$textContent = this.element.find(".text_content");
            this.$textEidtor =  this.element.find(".js_editorArea");
            this.setStatus(this.type);
            this.setData(this.data);
        },
        /**
         * 将每个用"|"隔开的关键字转为数组
         * @private
         */
        _procData:function(){
            this.valueArr = this.data.value.split("|").without("");

        },

        /**
         * 绑定规则的事件
         * @private
         */
        _bindBtnEvents:function(){
            var self = this;
            this.$switch.bind("click",function(){
                if(self.type == "overview"){
                    self.setStatus("detail");
                }else if(self.type == "detail"){
                    self.setStatus("overview");
                }
            });
            this.$wordAddBtn.bind("click",function(){
                self._renderKeyWordWin();
            });

            this.textTab.bind("click",function(){
                self._setNavSelect("text");
            });

            this.appmsgTab.bind("click",function(){
                self._renderAppMsgWin();
                self._setNavSelect("news");
            });

            this.$keyWordMode.bind("click",function(){
                if($(this).hasClass("all_match")){
                    self._setMode(false);
                }else{
                    self._setMode(true);
                }
            });

            this.$saveBtn.bind("click",function(){
                var datas = self.getData();

                var metadataIds =[];
                if(self.currentType == "news"){//图文类型内容，获取规则data和素材ID并验证
                    metadataIds = self._getmetadataIds();
                    datas.metadataIds = metadataIds;
                    var res = self._validate(datas,"news");
                    if(res){
                        self._saveRule(datas);
                    }
                }else if(self.currentType == "text"){//文本类型内容，获取规则data就验证，通过后创建文本素材再绑定
                    var text = self.$textEidtor.text();
                    var res = self._validate(datas,"text",text);
                    if(res){
                        self.service.createMaterial([{
                            mediaType : "text",
                            content : text
                        }],function(data){
                            metadataIds = [data.result[0]._id]
                            datas.metadataIds = metadataIds;
                            self._saveRule(datas);
                        });
                    }
                }

            });

            this.$delBtn.bind("click",function(){
                self.fire("delete");
                var data = [self.data._id];
                self.data._id && self.service.deleteRule(data,function(res){
                    self.fire("afterDelete");
                })
            });


        },

        /**
         * 验证数据
         * @param data 要验证的数据内容
         * @param type news || text
         * @param text 回复的文本内容
         * @returns {boolean} true 表示通过 false表示未通过
         * @private
         */
        _validate:function(data,type,text){
            if(!data.name){
                dialog.render({text:"请输入规则名"});
                return false
            }
            if(!data.value){
                dialog.render({text:"请输入关键字"});
                return false;
            }
            if(type == "news"){
                if(data.metadataIds.length<=0){
                    dialog.render({text:"请指定回复内容"});
                    return false;
                }
            }else if(type == "text"){
                if(!text){
                    dialog.render({text:"请指定回复内容"});
                    return false;
                }
            }
            return true;
        },
        /**
         * 根据是否有_id判断新增还是修改
         * @param datas
         * @private
         */
        _saveRule:function(datas){
            var self = this;
            if(datas._id){
                self.service.updateRule(datas,function(res){
                    //console.log("updateRule",res);
                    self.fire("afterUpdate");
                })
            }else{
                self.service.createRule([datas],function(res){
                    //console.log("addOneRule",res);
                    self.fire("afterAdd");
                });
            }
        },
        /**
         * 添加或修改关键字的window
         * @param words 关键字（修改）
         * @param $overviewWord 概要关键字DOM（修改）
         * @param $detailWord 详细关键字DOM（修改）
         * @private
         */
        _renderKeyWordWin:function(words,$overviewWord,$detailWord){
            var self = this;
            var title
            if(words){
                title = "修改关键字";
            }else{
                title = "新建关键字";
            }
            if(this.keyWordWin){
                this.keyWordWin.setTitle(title);
            }else{
                this.$keyWordContent = $(keyWordContent);
                this.keyWordWin = new Window({
                    container: "body",
                    title: title,
                    top: "center",
                    left: "center",
                    height: 424,
                    width: 960,
                    mask: true,
                    blurClose: true,
                    drag: false,
                    content: self.$keyWordContent,
                    events: {
                        "onClose": function() {
                            self.keyWordWin = null;
                        },
                        "beforeClose":function(){

                        },
                        scope: this
                    }
                });
            }
            this.$keyWordContent.find(".edit_area,.js_editorArea").text(words);

            this._bindWinEvents(words,$overviewWord,$detailWord);

            this.keyWordWin.show();
        },

        /**
         * 绑定关键字window事件
         * @param words 关键字（修改）
         * @param $overviewWord 概要关键字DOM（修改）
         * @param $detailWord 详细关键字DOM（修改）
         * @private
         */
        _bindWinEvents:function(words,$overviewWord,$detailWord){
            var self = this;
            var $wordContent = this.$keyWordContent.find(".edit_area,.js_editorArea");

            this.$keyWordContent.find(".save_btn").bind("click",function(){
                var newWord = $wordContent.text();
                if(newWord == ""){
                    dialog.render({
                        text:"关键字不能为空"
                    });
                    return;
                }
                var res = self.valueArr.find(function(one){
                    if(one == newWord){
                        return true;
                    }
                });
                if(res && res != words){//关键字已存在
                    dialog.render({
                        text:'关键字："'+res+'"已经存在'
                    })
                }else if(res && res == words){//关键字未做修改
                    self.keyWordWin.hiden();
                    self.keyWordWin.destroy();
                    self.keyWordWin = null;
                }else if(!res){//关键字不存在
                    if(words){//修改
                        $overviewWord.find("em").text(newWord);
                        $detailWord.find("strong").text(newWord);
                        var i;
                        self.valueArr.find(function(one,index){//在valueArr中找到变更的index
                            if(one == words){
                                i = index;
                                return true;
                            }
                        });
                        self.valueArr[i] = newWord;
                        //重新绑定删除事件
                        $detailWord.find(".Js_keyword_del").unbind().bind("click",function(){
                            $overviewWord.remove();
                            $detailWord.remove();
                            self.valueArr = self.valueArr.without(newWord);
                            //console.log("after del",self.valueArr);
                        });
                        //console.log(self.valueArr);
                    }else{//添加
                        self._addOneWord(newWord);
                        self.valueArr.push(newWord);
                       // console.log(self.valueArr);
                    }

                    self.keyWordWin.hiden();
                    self.keyWordWin.destroy();
                    self.keyWordWin = null;
                }
            });

            this.$keyWordContent.find(".cancel_btn").bind("click",function(){
                self.keyWordWin.hiden();
                self.keyWordWin.destroy();
                self.keyWordWin = null;
            });
        },

        /**
         * 切换详细模式和概要模式
         * @param type "overview"||"detail"
         */
        setStatus:function(type){
            this.$item = this.element.find(".keywords_rule_item");
            if(type == "overview"){
                this.$item.removeClass("open");
                this.type = "overview"
            }else if(type == "detail"){
                this.$item.addClass("open");
                this.type = "detail";
            }
        },
        /**
         *       true设置全匹配, false设置未全匹配
         * @param flag
         * @private
         */
        _setMode:function(flag){
            if(!flag){
                this.$keyWordMode.removeClass("all_match");
                this.$keyWordMode.text("未全匹配");
            }else{
                this.$keyWordMode.addClass("all_match");
                this.$keyWordMode.text("已全匹配");
            }
        },

        /**
         * 渲染数据到UI
         * @param data
         */
        setData:function(data){
            var self = this;
            if(this.index){
                this.$index.text("规则"+this.index+":"+data.name);
            }
            this.$name.val(data.name);
            this.valueArr.each(function(one){
                one && self._addOneWord(one);
            });
            this._setMode(data.allMatch);
            this.currentType = this.currentType || "text";
            data.metadataIds && this._setMaterial(data.metadataIds)
        },

        /**
         * 获取规则的Data
         * @returns {{name: (*|val), value: string, allMatch: *, type: string}}
         */
        getData:function(){
            var value='';
            this.valueArr.each(function(one,index){
                if(index>0){
                    value = value + "|" + one;
                }else if(index == 0){
                    value = one;
                }
            });

            var datas = {
                name:this.$name.val(),
                value:value,
                allMatch:this.$keyWordMode.hasClass("all_match"),
                type:"text"
            };

            if(this.data._id){
                datas._id = this.data._id;
            }

            return datas

        },

        /**
         * 获取图文素材ID
         * @returns {Array}
         * @private
         */
        _getmetadataIds:function(){
            var ids = [];
            if(this.selectAppMsg){
                if(this.selectAppMsg.length){//选择多图文
                    ids = this.selectAppMsg.collect(function(one){
                        return one._id;
                    })
                }else{//选择单图文
                    ids = [this.selectAppMsg._id];
                }
            }
            return ids
        },

        /**
         * 渲染规则内容
         * @param ids
         * @private
         */
        _setMaterial:function(ids){
            var self = this;
            this.service.getMaterialById(ids,function(datas){
//                console.log(datas,'getMaterialById');
                if(datas){
                    if(datas[0].mediaType == "news"){//图文
                        if(datas.length == 1){//单图文
                            datas = datas[0]
                        }
                        self.material = new MaterialView({
                            container:self.element.find(".js_appmsgArea"),
                            data:datas,
                            viewtype:"edit"
                        });
                        self.selectAppMsg = datas;
                        self.material.element.find(".appmsg_opr").hide();
                        self._setNavSelect("news");
                    }else{//文本
                        var textContent = datas[0].content;
                        self.textContent = textContent;
                        self.$textEidtor.text(textContent);
                        self._setNavSelect("text");
                    }
                }
            });
        },

        /**
         *设置内容栏图文和文本
         * @param type
         * @private
         */
        _setNavSelect:function(type){

            if(type == "news"){
                this.$textContent.hide();
                this.$modelContent.show();
                this.textTab.removeClass("selected");
                this.appmsgTab.addClass("selected");
                this.currentType = "news"
            }else{
                this.$modelContent.hide();
                this.$textContent.show();
                this.appmsgTab.removeClass("selected");
                this.textTab.addClass("selected");
                this.currentType = "text"
            }
        },
        _renderAppMsgWin:function(){
            var self = this;
            this.$appmsgContent = $(appmsgContent);
            this.appMsgWin = new Window({
                container: "body",
                title: title,
                top: "center",
                left: "center",
                height: 597,
                width: 960,
                mask: true,
                blurClose: true,
                drag: false,
                content: self.$appmsgContent,
                events: {
                    "onClose": function() {
                        self.keyWordWin = null;
                    },
                    "beforeClose":function(){

                    },
                    scope: this
                }
            });

            this._renderAppMsgs(this.$appmsgContent);

            this._bindAppMsgEvents(this.$appmsgContent);

            this.appMsgWin.show();
        },

        _renderAppMsgs:function($appmsgContent){
            var self = this;
            var $containerArr = $appmsgContent.find(".appmsg_col .inner");
            this.service.getMaterial({type:"news"},function(data){

                var newDatas = self._procAppMsgData(data.result);

                newDatas.each(function(one,index){
                    var i = index % 2;
                    var appMsg = new MaterialView({
                        container:$($containerArr[i]),
                        viewtype:"select",
                        data:one,
                        events:{
                            "beforeSelect":function(data){
                                $containerArr.find(".selected").removeClass("selected");
                                //console.log("beforeSelect",data);
                                self.selectAppMsgTmp = data;
                            }
                        }
                    }).module;
                });


            });


        },

        _bindAppMsgEvents:function($appmsgContent){
            var self = this;
            $appmsgContent.find(".save_btn").bind("click",function(){
                self.selectAppMsg = self.selectAppMsgTmp;

                self.appMsgWin.hiden();
                self.appMsgWin.destroy();
                self.appMsgWin = null;

                self.material && self.material.destroy();

                self.material = new MaterialView({
                    container:self.element.find(".js_appmsgArea"),
                    data:self.selectAppMsg,
                    viewtype:"edit"
                });
                self.material.element.find(".appmsg_opr").hide();
            });
            $appmsgContent.find(".cancel_btn").bind("click",function(){
                self.appMsgWin.hiden();
                self.appMsgWin.destroy();
                self.appMsgWin = null;

            });

            $appmsgContent.find(".appmsg_create a").bind("click",function(){
                $(".col-slide-menu #material_mg").trigger("click");
                self.appMsgWin.hiden();
                self.appMsgWin.destroy();
                self.appMsgWin = null;

            });

        },

        _procAppMsgData:function(datas){
            var newDatas = [],
                groupIds = [],
                groups = [];
            datas.each(function(one){
                if(one.groupId){
                    groupIds.push(one.groupId);
                    groups.push(one);
                }else{
                    newDatas.push(one);
                }
            });
            groupIds = cloud.util.uniqueArray(groupIds);
            groupIds.each(function(id){
                var group = groups.findAll(function(one){
                    return one.groupId == id;
                });
                newDatas.push(group);
            });
            return newDatas
        },

        _addOneWord:function(word){
            var self = this;
            var $overviewWord = $(overviewWords).appendTo(this.$valueOverview.list);
            $overviewWord.find("em").text(word);
            var $detailWord = $(detailWords).appendTo(this.$valueDetail.list);
            $detailWord.find("strong").text(word);

            $detailWord.find(".Js_keyword_edit").bind("click",function(){
                self._renderKeyWordWin(word,$overviewWord,$detailWord);

            });
            $detailWord.find(".Js_keyword_del").bind("click",function(){
                $overviewWord.remove();
                $detailWord.remove();
                self.valueArr = self.valueArr.without(word);
                //console.log("after del",self.valueArr);
            })
        },

        destroy:function($super){
            $super()
        }

    });

    return ruleItem
});