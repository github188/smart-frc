/**
 * Created by zhang on 14-10-11.
 */
define(function(require){
    require("cloud/base/cloud");
    var single = require("text!./singlePic.html");
    var multi = require("text!./multiView.html");
    var MAX_SIZE = 8;
    var module = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.moduleName = "adp";

            if(options.data.length>0){//multi
                this.module = new multimodule(options);
            }else{//single
                this.module = new simglemodule(options);
            }

        }
    });

    var simglemodule = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.moduleName = "single";
            this.viewtype = options.viewtype|| "normal";//select edit normal
            this.data = options.data;

            this._render();

            this._bindEvents();

        },

        _render : function(){
            this.element.html(single);
            this.$appmsg = this.element.find(".appmsg");
            this.$time = this.element.find(".appmsg_date");
            this.$title = this.element.find(".appmsg_title a");
            this.$desc = this.element.find(".appmsg_desc");
            this.$img = this.element.find(".appmsg_thumb");
            this.$imgWrp = this.element.find(".appmsg_thumb_wrp");

            this.$edit = this.element.find(".appmsg_opr");
            this.$select = this.element.find(".appmsg_mask,.icon_card_selected");

            switch (this.viewtype){
                case "normal":
                    this.$edit.remove();
                    this.$select.remove();
                    this.$appmsg.addClass("editing");
                    this.$time.remove();
                    break;
                case "edit":
                    this.$select.remove();
                    break;
                case "select":
                    this.$edit.remove();
                    break;
                default :
                    this.$edit.remove();
                    this.$select.remove();
                    this.$appmsg.addClass("editing");
                    this.$time.remove();
                    break;
            }

            this._setData(this.data);
        },

        reDraw:function(data){
            this.data = cloud.util.defaults(data,this.data)
            this._setData(this.data);
        },

        setSelect:function(flag){
            if(this.viewtype == "select"){
                if(flag){
                    this.$appmsg.addClass("selected");
                }else{
                    this.$appmsg.removeClass("selected")
                }
            }
        },

        _bindEvents:function(){

            var self = this;
            this.$editBtn = this.element.find(".edit_btn");
            this.$delBtn = this.element.find(".del_btn");
            this.$delBtn.bind("click",function(){
                self.fire("delete",self.data);
//                self.destroy();
            });
            this.$editBtn.bind("click",function(){
                self.fire("edit",self.data);
            });

            if(this.viewtype == "select"){
                this.$select.bind("click",function(){
                    self.fire("beforeSelect",self.data);
                    self.setSelect(true);
                    self.fire("afterSelect",self.data);
                });
            }

        },

        _setData:function(data){
            if(data.mediaUri){
                var img = cloud.config.FILE_SERVER_URL + "/api/wechat/file/" + data.mediaUri + "?access_token=" + cloud.Ajax.getAccessToken();
                this.$img.attr("src",img);
                if(this.viewtype == "normal"){
                    this.$imgWrp.addClass("has_thumb");
                }
            }
            data.title && this.$title.text(data.title);
            this.$desc.text(data.summary);
            if(data.createTime){
                var time = " " + cloud.util.dateFormat(new Date(data.createTime),"hh:mm",false);
                switch (new Date(data.createTime).getDay() + 1){
                    case 1:
                        time = locale.get("Monday")+time;
                        break;
                    case 2:
                        time = locale.get("Tuesday")+time;
                        break;
                    case 3:
                        time = locale.get("Wednesday")+time;
                        break;
                    case 4:
                        time = locale.get("Thursday")+time;
                        break;
                    case 5:
                        time = locale.get("Friday")+time;
                        break;
                    case 6:
                        time = locale.get("Saturday")+time;
                        break;
                    case 7:
                        time = locale.get("Sunday")+time;
                        break;
                    default :
                        break;
                }
                this.$time.text(time);
            }
        },

        destroy : function($super){
            $super();
        }
    });
    /**
     *  [{simglemodule},{simglemodule}...]
     * @type {Component|*}
     */

    var multimodule = Class.create(cloud.Component,{
        initialize : function($super, options){
            $super(options);
            this.moduleName = "single";
            this.viewtype = options.viewtype|| "normal";//select edit normal
            this.data = options.data;

            this.subItems = $H();
            this._procData();

            this._render();

            this._bindEvents();

        },

        _render : function(){

            this.element.html(multi);

            this.$coverTitle = this.element.find(".appmsg_title a");
            this.$time = this.element.find(".appmsg_date");
            this.$img = this.element.find(".appmsg_thumb");
            this.$imgWrp = this.element.find(".appmsg_thumb_wrp");

            this._renderCoverItem(this.coverData);
            this._renderSubItem(this.subData);
            this.$appmsg = this.element.find(".appmsg");


            this.$edit = this.element.find(".appmsg_opr");
            this.$select = this.element.find(".appmsg_mask,.icon_card_selected");
            this.$defaultIcon = this.element.find(".appmsg_thumb.default");
            this.$addItem = this.element.find("#js_add_appmsg");


//            this._setData(this.coverData);

            switch (this.viewtype){
                case "normal":
                    this.$edit.remove();
                    this.$select.remove();
                    this.$appmsg.addClass("editing");
                    this.$time.remove();
                    break;
                case "edit":
                    this.$select.remove();
                    this.$defaultIcon.remove();
                    this.$addItem.remove();
                    break;
                case "select":
                    this.$edit.remove();
                    this.$defaultIcon.remove();
                    this.$addItem.remove();
                    break;
                default :
                    this.$edit.remove();
                    this.$select.remove();
                    this.$appmsg.addClass("editing");
                    this.$time.remove();
                    break;
            }
        },

        _procData:function(){
            this.coverData = this.data.find(function(one){
                return one.cover == true;
            });
            this.subData = this.data.without(this.coverData);
        },
        reDraw:function(data){
            if(data.isCover){
                this.coverData = cloud.util.defaults(data,this.coverData);
                this._renderCoverItem(this.coverData);
            }else{
                var $el = this.subItems.get(data._id);
                if($el){
                    var i;
                    this.subData.find(function(one,index){
                        if(one._id == data._id){
                            i = index;
                            return true;
                        }
                    });
                    this.subData[i] = cloud.util.defaults(data,this.subData[i]);

                    data.title && $el.find(".appmsg_title a").text(data.title);
                    if(data.mediaUri){
                        var img = cloud.config.FILE_SERVER_URL + "/api/wechat/file/" + data.mediaUri + "?access_token=" + cloud.Ajax.getAccessToken();
                        $el.find(".appmsg_thumb").attr("src",img);
//                    if(self.viewtype == "normal"){
                        $el.addClass("has_thumb");
//                    }
                    }else{
                        $el.removeClass("has_thumb");
                    };
                    this._bindSubItemEvents($el,data);
                }

            }
        },

        _renderCoverItem:function(data){


            if(data.mediaUri){
                var img = cloud.config.FILE_SERVER_URL + "/api/wechat/file/" + data.mediaUri + "?access_token=" + cloud.Ajax.getAccessToken();
                this.$img.attr("src",img);

                if(this.viewtype == "normal"){
                    this.$imgWrp.addClass("has_thumb")
                }

            }

            data.title && this.$coverTitle.text(data.title);

            if(data.createTime){
                var time = " " + cloud.util.dateFormat(new Date(data.createTime),"hh:mm",false);
                switch (new Date(data.createTime).getDay() + 1){
                    case 1:
                        time = locale.get("Monday")+time;
                        break;
                    case 2:
                        time = locale.get("Tuesday")+time;
                        break;
                    case 3:
                        time = locale.get("Wednesday")+time;
                        break;
                    case 4:
                        time = locale.get("Thursday")+time;
                        break;
                    case 5:
                        time = locale.get("Friday")+time;
                        break;
                    case 6:
                        time = locale.get("Saturday")+time;
                        break;
                    case 7:
                        time = locale.get("Sunday")+time;
                        break;
                    default :
                        break;
                }
                this.$time.text(time);
            }


        },
        _renderSubItem:function(datas){
            var self = this;
            this.$content = this.element.find(".appmsg_content");

            datas.each(function(data,index){
                var itemId = data._id;
                var $subItem = $("<div class='appmsg_item' id='"+itemId+"'>"+
                    "<img class='appmsg_thumb'>"+
                    "<i class='appmsg_thumb default'>缩略图</i>"+
                    "<h4 class='appmsg_title'><a target='_blank'>标题</a></h4>"+
                    "<div class='appmsg_edit_mask'>"+
                    "<a class='icon18_common edit_gray js_edit' data-id='2' onclick='return false;' href='javascript:void(0);'>编辑</a>"+
                    "<a class='icon18_common del_gray js_del' data-id='2' onclick='return false;' href='javascript:void(0);'>删除</a>"+
                    "</div>"+
                    "</div>");
                $subItem.appendTo(self.$content);
                data.title && $subItem.find(".appmsg_title a").text(data.title);
                if(data.mediaUri){
                    var img = cloud.config.FILE_SERVER_URL + "/api/wechat/file/" + data.mediaUri + "?access_token=" + cloud.Ajax.getAccessToken();
                    $subItem.find(".appmsg_thumb").attr("src",img);
                    if(self.viewtype == "normal"){
                        $subItem.addClass("has_thumb")
                    }
                };
                self._bindSubItemEvents($subItem,data,index);
                self.subItems.set(itemId,$subItem);
            });

        },
        addOneItem:function(){
            if(this.subItems.size() < MAX_SIZE-1){
                var one = {
                    _id:new Date().getTime()
                };
                this._renderSubItem([one]);
                this.subData.push(one)
                return one
            }else{
                dialog.render({
                    text:"最多只可创建8条图文消息"
                });
                return;
            }
        },

        _bindSubItemEvents:function($subItem,data,index){
            var self = this;
            var editBtn = $subItem.find(".js_edit");
            var delBtn = $subItem.find(".js_del");

            editBtn.unbind("click").bind("click",function(){
                self.fire("editItem",data,$subItem);
            });

            delBtn.unbind("click").bind("click",function(){
                if(self.subItems.size()>1){
                    $subItem.remove();
                    self.subItems.unset(data._id);
                    self.fire("deleteItem",data);
                }else{
                    dialog.render({text:"无法删除，多图文至少保留2条消息"});
                }

            });

        },

        setSelect:function(flag){
            if(this.viewtype == "select"){
                if(flag){
                    this.$appmsg.addClass("selected");
                }else{
                    this.$appmsg.removeClass("selected")
                }
            }
        },

        _bindEvents:function(){

            var self = this;
            if(this.viewtype == "edit"){//edit
                this.$editBtn = this.element.find(".edit_btn");
                this.$delBtn = this.element.find(".del_btn");
                this.$delBtn.bind("click",function(){
                    self.fire("delete",self.data);
//                    self.destroy();
                });
                this.$editBtn.bind("click",function(){
                    self.fire("edit",self.data);
                });
            }else if(this.viewtype == "select"){//select
                this.$select.bind("click",function(){
                    self.fire("beforeSelect",self.data);
                    self.setSelect(true);
                    self.fire("afterSelect",self.data);
                });
            }else if(this.viewtype == "normal"){
                this.editBtn = this.element.find(".js_edit_cover");
                this.editBtn.bind("click",function(){
                    self.fire("editItem",self.coverData);
                });
            }

        },

        _setData:function(data){
            var time = " " + cloud.util.dateFormat(new Date(data.createTime),"hh:mm",false);
            switch (new Date(data.createTime).getDay() + 1){
                case 1:
                    time = locale.get("Monday")+time;
                    break;
                case 2:
                    time = locale.get("Tuesday")+time;
                    break;
                case 3:
                    time = locale.get("Wednesday")+time;
                    break;
                case 4:
                    time = locale.get("Thursday")+time;
                    break;
                case 5:
                    time = locale.get("Friday")+time;
                    break;
                case 6:
                    time = locale.get("Saturday")+time;
                    break;
                case 7:
                    time = locale.get("Sunday")+time;
                    break;
                default :
                    break;
            }
            this.$time.text(time);
        },

        destroy : function($super){
            $super();
        }
    });



    return module;
});