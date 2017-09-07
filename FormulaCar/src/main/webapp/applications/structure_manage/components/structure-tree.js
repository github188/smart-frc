define(function(require) {
	require("./structure-tree.css");
	require("../lib/zTree_v3/js/jquery.ztree.all-3.5");
    require("../lib/zTree_v3/css/zTreeStyle/zTreeStyle.css");
    require("cloud/lib/plugin/jquery.qtip");
    
    var Button = require("cloud/components/button");
    var StructureTree = Class.create(cloud.Component, {
    	 moduleName : "structure-tree",
    	 initialize : function($super, options) {
    		 cloud.util.defaults(options, {
                 checkBox : false,
                 edit : false,
                 queryArgs : null,
                 autoLoad : true,
                 editFilter: null,
                 delFilter : null ,
                 autoExpand : true,
                 deleteFilter : null,
                 topicon:"url(/FormulaCar/applications/structure_manage/lib/zTree_v3/css/zTreeStyle/img/diy/top.png)"
             });
    		 $super(options);
    		 this.draw();
    		 if (options.autoLoad){
                 this.load();
             }
    	 },
    	 load : function(){
             var self = this;
             
             var subsList=[];
             var sub=[];
             var sub1=[];
             var sub2=[];
             
             var obj_sub1={
                 	_id:'222222',
                 	name:'默认',
                 	subs:sub2
             }
             var obj_sub2={
                  	_id:'3333333',
                  	name:'合作',
              }
             var obj_sub3={
                   	_id:'44444',
                   	name:'线路',
               }
             sub1.push(obj_sub1);
             sub1.push(obj_sub2);
             sub2.push(obj_sub3);
             var array=[];
             var obj1={
            	_id:'11111',
            	name:'InVendingCloud',
            	subs:sub1
             }
             subsList.push(obj1);
             console.log(subsList);
             
             this.renderTree(subsList, this.options.autoExpand);
         },
    	 draw : function(){
    		 var html = "<div class=\"top-tree-search\">" + 
                      	  "<div class='top-tree-search-content' style='display:none'>"+
                             "<input type=\"text\">" +
                          "</div>"+
                          "<span class=\"user-els\"></span>" + 
                          "<div class=\"user-header\"></div>"
                        "</div>";
    		 $(html).appendTo(this.element);
    		 this.searchInput = this.element.find(".top-tree-search input").attr("placeholder",locale.get("search"));
             this.element.append("<div id='treeChilds' style='overflow: auto;height: 90%;position: absolute;width: 98%;'></div>");
             this.listContainer = $("<ul>").addClass("ztree").attr("id", this.id + "ztree").appendTo("#treeChilds");
    	 },
         renderTree : function(treeData, expand){
             var self = this;
             if (this.treeList){
                 this.treeList.destroy();
                 this.treeList = null;
             }
             this.treeList = $.fn.zTree.init(this.listContainer, {
                 view: {
                     selectedMulti: false,
                     fontCss : function getFontCss(treeId, treeNode) {
                         return (!!treeNode.highlight) ? {color:"rgb(47, 141, 18)", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
                     },
                     addDiyDom : this.addDiyDom.bind(this)
                 },
                 edit : {
                     enable : this.options.edit
                 },
                 check : {
                     enable : this.options.checkbox
                 },
                 data: {
                     key : {
                         children : "subs"
                     }
                 },
                 callback : {
                     onClick : function(e, treeId, node){
                         self.fire("onClick", node, e);//TODO data
                     },
                     onCheck : function(e, treeId, node){
                         self.fire("onCheck", node.getCheckStatus(), node, e);//TODO data
                     },
                     onAsyncSuccess:function(){
                     	console.log(arguments,"onAsyncSuccess")
                     },
                     onNodeCreated : function(e, treeId, node){
                         self.fire("onNodeCreated",node,e);
                         self.changeIcon(node);
                     },
                     onCollapse : function(e, treeId, node){
                     	 self.cancleOnCollapse(node);
                     	 self.rePosition();
                     },
                     onExpand : function(){
                     	self.rePosition();
                     }
                 }
             }, treeData || []);
             
             this.treeList.expandAll(expand);
         
             this.options.editFilter && this.renderEditContent();
             
             $(".ztree li > a").css({
             	'max-width': '170px',
 	            'text-overflow': 'ellipsis',
 	            'overflow': 'hidden',

             })
         },
         addDiyDom:function(treeId, treeNode){// 添加 编辑  删除
         	var self = this;
         	var addFilter = Object.isFunction(this.options.addFilter) ? this.options.addFilter(treeId, treeNode) : this.options.addFilter ; 
         	var editFilter = Object.isFunction(this.options.editFilter) ? this.options.editFilter(treeId, treeNode) : this.options.editFilter ; 
         	var delFilter = Object.isFunction(this.options.delFilter) ? this.options.delFilter(treeId, treeNode) : this.options.delFilter ; 
         	var liObj = $("#" + treeNode.tId );
         	var spObj = $("#" + treeNode.tId + "_span");
         	var aObj = $("#" + treeNode.tId + "_a")
         	
         	if(addFilter){//添加节点
         		var addbutton = new Button({
 					imgCls: "cloud-icon-add",
 					container : aObj,
 					events :{
 						click:function(e){
 							self.node =treeNode;
 							self.flag=1;
 							self.editTip.set("position.target",spObj);
							self.editTip.reposition();
							self.editTip.show();
							$("#edit-node-name").val("");
 							
 						}
 					}
 				});
         		addbutton.hide();
 				aObj.on({
 					"mouseenter" : function(){
// 						if(treeNode.isLastNode == true){
// 							addbutton.hide();
// 						}else{
 							addbutton.show();
// 						}
 						
 						},
 					"mouseleave" : function(){
 						addbutton.hide();
 			      }
 				});
         	}
         	
 			if (editFilter){//修改节点名称
 				var editbutton = new Button({
 					imgCls: "cloud-icon-edit",
 					container : aObj,
 					events :{
 						click:function(e){
 							self.node = treeNode;
 							self.flag=2;
 							self.editTip.set("position.target",spObj);
							self.editTip.reposition();
							self.editTip.show();
							$("#edit-node-name").val("");
							$("#edit-node-name").val(spObj[0].innerText);
 						}
 					}
 				});
 				editbutton.hide();
 				aObj.on({
 					"mouseenter" : function(){
	 							editbutton.show();
 						},
 					"mouseleave" : function(){
 						editbutton.hide();
 			      }
 				});
 				
 				
 			}
         	if(delFilter){//删除节点
         		var deletebutton = new Button({
 					imgCls: "cloud-icon-no",
 					container : aObj,
 					events : {
 						click:function(e){
 							self.fire("onDelete",treeNode);
 						}
 					}
 				});
         		deletebutton.hide();
         		aObj.on({
 					"mouseenter" : function(){
 							deletebutton.show();
 					} ,
 					"mouseleave" : function(){
 						deletebutton.hide();
 					} 
 				});
         		
         	}
         },
         renderEditContent:function(){
         	var self = this;
         	var editContent = $("<form>").addClass("ui-helper-hidden");
             $("<label>").attr("for", "edit-node-name").text(locale.get({lang:"name1+:"})).appendTo(editContent);
             this.$editInput = $("<input type='text'>").attr("id", "edit-node-name").css("width","80px").appendTo(editContent);
         	
         	var submit = new Button({
                 container: editContent,
                 imgCls: "cloud-icon-yes",
                 lang:"{title:submit}",
                 events: {
                     click: function(){
                     	self.closeTip();
                     	self.fire("onSubmit",self.node,self.$editInput.val(),self.flag);
                     },
                     scope: this
                 }
             });
         	
         	var canbutton = new Button({
 				container : editContent,
 				imgCls: "cloud-icon-no",
 				events :{
 					click:function(){
 						self.cancelEdit();
 					}
 				}
 			});
         	
             var editTip = this.element.qtip({
             	content:{
             		text: editContent
             	},
                position: {
                     my: "top left",
                     at: "bottom middle"
                },
//                show: {
//                    event: "click"
//                },
//                hide: {
//                    event: "click unfocus"
//                },
            	show : false,
            	hide : false,
             	events: {
             		visible: function(){
             			$("#edit-node-name").focus();						
             		}
             	},
             	style: {
             		classes: "qtip-shadow qtip-light"
             	},
             	suppress:false
             })
             this.editTip = editTip.qtip("api");
         },
         rePosition:function(){
         	if(this.node && this.editTip ){
         		this.editTip.reposition();
         	}
         },
    	 cancelEdit:function(isSilent){
          	this.node && !isSilent && this.fire("onCancel",this.node);
          	this.editTip && this.editTip.hide();
          	this.$editInput && this.$editInput.val("");
  			this.node = null;
          },
          cancleOnCollapse:function(node){
          	var level = this.node && this.node.level;
          	var tId = node.tId
          	
          	if(level == 1){//only parent
          		var parNode = this.node.getParentNode();
              	var partId = parNode.tId;
              	partId == tId && this.cancelEdit();
          	}else if(level == 2){//parent && grandparent
          		var parNode = this.node.getParentNode();
          		var partId = parNode.tId;
          		if(partId == tId){
          			this.cancelEdit();
          		}else{
          			var graNode = parNode.getParentNode();
          			var gratId = graNode.tId;
          			if(gratId == tId){
          				this.cancelEdit();
          			}
          		}
          		
          	}
          },
          expandNodesByFilter:function(filter,expand,isSilent){
            	var self = this;
          	
         		filter =  Object.isFunction(filter) ? filter : function(){return true};
         		isSilent = !!isSilent;
         		var nodes = this.treeList.getNodesByFilter(filter);
            	nodes.each(function(node){
          		//expand = false;
          	    	self.treeList.expandNode(node,expand,false,false,!isSilent);
            	})
          },
          
          rePosition:function(){
          	if(this.node && this.editTip ){
          		this.editTip.reposition();
          	}
          },
          
          closeTip:function(){
          	this.editTip.hide()
          },
          
          editNode:function(node,name){
          	this.treeList.editName(node);
          	this.treeList.cancelEditName(name);
          },
          deleteNode:function(node,silence){
          	var silence = silence ? true : false;
          	this.treeList.removeNode(node,!silence)
          },
          changeIcon:function(node){
          	var url = this.options.topicon;
          		
            var $icon = $("#"+node.tId+"_ico");
            $icon.css({
          	    	"background-image":url,
          		    "background-position":0
          	});
        }
    });
    return StructureTree;
});