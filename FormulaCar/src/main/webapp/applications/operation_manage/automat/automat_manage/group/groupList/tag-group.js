define(function(require) {
    require("cloud/base/cloud");
    require("../resources/css/tag-group.css");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.qtip");
    require("cloud/lib/plugin/jquery.layout");
    
    //Create class TagOverview
    var TagManage = Class.create(cloud.Component, {
    	
        initialize: function($super,options) {
            $super(options);
            this.options = options;
            this.service = options.service;
            //this.selectRowId = null;
        	if(!$.isPlainObject(this.options.events)){
        		this.options.events = {};
        	}
        	this.selectRowId = options.selectRowId;
            this.moduleName = "tag-group";
            this.ids = {
            		"toolbar":"tag-group-toolbar",
            		"title":"tag-group-title",
            		"add":"tag-group-add",
            		"delete":"tag-group-delete",
            		"edit":"tag-group-edit",
            };
            this._render();
        },
        
        _render:function(){
        	this._renderFrame();
        	this._renderToolbar();
        	this._renderEditForm();
            this._renderCreateForm();
        },
        
        _renderFrame:function(){
        	this.element.append($("<div></div>").attr("id",this.ids.toolbar));
        },
        
        
        _renderToolbar:function(){
        	var self = this;
        	//$("#"+this.ids.title).html(locale.get("group"));
        	//var title = $("#"+this.ids.title);
            var title = new Button({
                checkbox: false,
                id: this.ids.title,
                text: locale.get("group"),
                disabled: true
            });
            
            var addBtn = new Button({
                imgCls: "cloud-icon-add-tag",
                id: this.ids.add,
                lang:"{title:add_group}"
            });
            
            var deleteBtn = new Button({
                imgCls: "cloud-icon-remove-tag",
                id: this.ids["delete"],
                lang:"{title:delete_group}",
                events: {
                    click: function(){
                    	self._deleteItems();
                    },
                    scope: self
                }
            });

            var editBtn = new Button({
                imgCls: "cloud-icon-edit",
                id: this.ids.edit,
                lang:"{title:edit_group}",
                events:{
                	click:function(){
                	}
                }
            });

            this.toolbar = new Toolbar({
                selector: "#" + this.ids.toolbar,
                leftItems: [title],
                rightItems: [addBtn, deleteBtn, editBtn]
            });
            $("#tag-group-title").removeClass("cloud-button cloud-button-body cloud-button-text-only");
            $("#tag-group-title").css({"color":"black"});
        },
        _deleteItems:function(){
        	var self = this;
        	if(self.selectRowId==null){
        		dialog.render({lang:"automat_please_select_group_row"});
        		return false;
        	}
        	this.fire("deleteGroup",self.selectRowId);
        	this.selectRowId = null;
        },
        _addItem:function(){
        	var self = this;
        	var __text = self.createForm.find("#new-group-name").val();
        	if(!__text.replace(/\s/g,"") || __text.match(/[^a-zA-z0-9\u4e00-\u9faf]+/g) || __text.length > 30){
        		dialog.render({lang:"automat_group_error"});
        		return;
        	}
        	self.service.addGroup(self.createForm.find("#new-group-name").val(), function(data) {
        		if(data.error!=null&&data.error!=""){
        			self.fire("addGroup",data);
        		}else{
        			dialog.render({lang:"automat_group_name_exist_error"});
        		}
			}, self);
        },
        
        _updateItem:function(_id){
        	//var _id = this.selectRowId;
        	this.fire("updateGroup",_id,$("#edit-group-name").val());
        },
        
        /*
         * Create Form
         */
        _renderCreateForm: function() {
        	var self = this;
            this.createForm = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
            $("<label>").attr("for", "new-group-name").text(locale.get({lang:"group_name+:"})).appendTo(this.createForm);
            $("<input type='text'>").attr("id", "new-group-name").appendTo(this.createForm);
            new Button({
                // text: "提交",
                container: this.createForm,
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                events: {
                    click: function(){
                    	self._addItem();
                    },
                    scope: this
                }
            });
           this.createForm[0].childNodes[1].onkeydown=function(event){    
        	   if(event.keyCode==13){       		   
        		   self.onCreate();
        		   return false;
        	   }       	  
           };
            this.createForm.appendTo(this.element);
            this.addQtip = $("#" + this.ids.add).qtip({
                content: {
                    text: this.createForm
                },
                position: {
                    my: "top left",
                    at: "bottom middle"
                },
                show: {
                    event: "click"
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow qtip-light"
                },
				events: {
					visible: function(){
						$("#new-tag-name").focus();						
					}
				},
                suppress:false
            });
        },
        
        /*
         * Render edit form
         */
        _renderEditForm: function() {
        	var self = this;
            this.editForm = $("<form>").addClass(this.moduleName + "-edit-form ui-helper-hidden tag-overview-form");
            $("<label>").attr("for", "edit-group-name").text(locale.get({lang:"group_name+:"})).appendTo(this.editForm);
            $("<input type='text'>").attr("id", "edit-group-name").appendTo(this.editForm);
            new Button({
//                title: "提交",
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                container: this.editForm,
                events: {
                    click: function(){
                		self._updateItem(self.selectRowId);
                    },
                    scope: this
                }
            });
            this.editForm.appendTo(this.element);
            this.editQtip = $("#" + this.ids.edit).qtip({
                content: {
                    text: this.editForm
                },
                position: {
                    my: "top left",
                    at: "bottom right"
                },
                show: {
                    event: "click"
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow qtip-light"
                },
                events: {
					visible: function(){
						$("#edit-tag-name").focus();
					},
                    show: function(event,api) {
                    	if((self.selectRowId) == null){
                    		dialog.render({lang:"automat_please_select_group_row"});
                    		return false;
                    	}else{
                    		self.service.getGroupById(self.selectRowId,function(data){
                    			$("#edit-group-name").val(data.result.name);
                    		},self);
                    		//self._updateItem();
                    	}
						
                    }.bind(this)
                },
                suppress:false
            });
        }
        
    });

    return TagManage;
});