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
        	if(!$.isPlainObject(this.options.events)){
        		this.options.events = {};
        	}
            this.moduleName = "tag-automat";
            this.ids = {
            		"toolbar":"tag-automat-toolbar",
            		"title":"tag-automat-title",
            		"add":"tag-automat-add",
            		"delete":"tag-automat-delete",
            		"edit":"tag-automat-edit",
            };
            this._render();
        },
        
        _render:function(){
        	this._renderFrame();
        	this._renderToolbar();
        	this._renderEditForm();
            this._renderCreateForm();
            //this._events();
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
                autoGenTitle : false,
                events: {
                    click: function() {
//                        if (this.selectAllButton.isSelected() === true) {
//                            this.itembox.selectAllItems();
//                        } else {
//                            this.itembox.unselectAllItems();
//                        }
                    },
                    scope: self
                },
                text: locale.get("automat"),
                disabled: true
            });
            
//            this.selectAllButton = checkbox;
            
            var addBtn = new Button({
                imgCls: "cloud-icon-add-tag",
                id: this.ids.add,
                lang:"{title:add_automat}"
            });
            console.log("====");
            var deleteBtn = new Button({
                imgCls: "cloud-icon-remove-tag",
                id: this.ids["delete"],
                lang:"{title:delete_automat}",
                events: {
                    click: function(){
                    	
                    },
                    scope: self
                }
            });

            var editBtn = new Button({
                imgCls: "cloud-icon-edit",
                id: this.ids.edit,
                lang:"{title:edit_automat}",
                events:{
                	click:function(){
                		if((self._getSelectedIds()).length !== 1){
                			dialog.render({lang:"select_one_group"})
                			return;
                		}
                	}
                }
            });

            this.toolbar = new Toolbar({
                selector: "#" + this.ids.toolbar,
                leftItems: [title],
                rightItems: [addBtn, deleteBtn, editBtn]
            });
            $("#tag-automat-title").removeClass("cloud-button cloud-button-body cloud-button-text-only");
            $("#tag-automat-title").css({"color":"black"});
        },
        
        
        
        _deleteItems:function(arr){
        
        },
        
        _addItem:function(){
        	var self = this;
        	var __text = self.createForm.find("#new-tag-name").val();
        	if(!__text.replace(/\s/g,"") || __text.match(/[^a-zA-z0-9\u4e00-\u9faf]+/g) || __text.length > 30){
        		dialog.render({lang:"group_error"});
        		return;
        	}
        	
        },
        
        _updateItem:function(_id){
        	var self = this;
        	var __text = self.editForm.find("#edit-tag-name").val();
        	if(!__text.replace(/\s/g,"") || __text.match(/[^a-zA-z0-9\u4e00-\u9faf]+/g) || __text.length > 30){
        		dialog.render({lang:"group_error"});
        		return;
        	}
        	
        },
        
        /*
         * Create Form
         */
        _renderCreateForm: function() {
        	var self = this;
            this.createForm = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
            $("<label>").attr("for", "new-tag-name").text(locale.get({lang:"group_name+:"})).appendTo(this.createForm);
            $("<select><option>1</option></select>").attr("id", "new-automat-name").appendTo(this.createForm);
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
            $("<label>").attr("for", "new-tag-name").text(locale.get({lang:"group_name+:"})).appendTo(this.editForm);
            $("<select><option>1</option></select>").attr("id", "edit-automat-name").appendTo(this.editForm);
            new Button({
//                title: "提交",
                imgCls: "cloud-icon-yes",
                lang:"{title:submit}",
                container: this.editForm,
                events: {
                    click: function(){
                    	var ids = self._getSelectedIds();
                    	if(ids.length === 1){
                    		self._updateItem(ids[0]);
                    	}
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
                    	if((self._getSelectedIds()).length !== 1){
                    		event.preventDefault();
                    		return false;
                    	}
						
                    }.bind(this)
                },
                suppress:false
            });
        }
        
    });

    return TagManage;
});