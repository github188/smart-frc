define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./editStructure.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
    var Tree = require("../components/structure-tree");
	var alarmlist = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.render();
		},
		render:function(){
			this.renderHtml();
		    this.renderDefaultData();
		},
		renderHtml : function() {
			this.element.html(html);
		},
		renderDefaultData:function(){
			this.tree = new Tree({
				selector:"#structure",
				autoLoad : true,
				addFilter: function(treeId, treeNode){
					  return true
	            },
				editFilter : function(treeId, treeNode){
					  return true
	            },
	            delFilter : function(treeId, treeNode){
	            	  return true
	            },
				events : {
					onClick:function(data,e){
						
					},
					onDelete:function(node){
                    	dialog.render({
                    		container:self.$list,
                    		text: locale.get("affirm_delete")+"?",
                    		buttons:[{
	                    			lang:"yes",
	                    			click:function(){
	                    				self.doDelete(node);
	                    				dialog.close();
	                    			}
                    			},{
	                    			lang:"no",
	                    			click:function(){
	                    				dialog.close()
	                    			}
                    			}]
                    	});
                    },
                    onSubmit:function(node, name,flag){
                    	console.log("====edit=="+name+"==flag=="+flag);
                    	if(flag == 1){//添加节点
                               
                            
                            
                    	}else if(flag ==2 ){//修改节点
                    		
                    	}
                    	
                    	console.log(node);
                    }
				}
			});
		},
        doDelete: function(node){
        	var self = this;
        	
        },
	});
	return alarmlist;
});