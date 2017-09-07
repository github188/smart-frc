define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.data = options.data;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"task_detail"}),
				top: "center",
				left: "center",
				height:500,
				width: 550,
				mask: true,
				drag:true,
				content: "<div id='winContent' style='border-top: 1px solid #f2f2f2;height:50%;'></div>",
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderForm();
		},
		_renderForm:function(){		
			
		   if(this.data && this.data.files){
				var htmls1= "<div style='height:450px;overflow: auto;text-align: center;'><table width='90%' style='border: 1px solid #e7e7eb;margin-left:5%;margin-top:20px;' border='1'>"
				
			    htmls1+="<tr style='height: 30px;background-color: #e7e7eb;'><td width='60%;'>"+locale.get({lang:"ad_filename"})+"</td><td style='text-align: center;'>"+locale.get({lang:"state"})+"</td></tr>";
	    	
			    for (i=0;i<this.data.files.length ;i++ ){  
			    	var status = this.data.files[i].pushStatus;
			    	if(status == 0){
			    		status =locale.get({lang:"has_not_down"});
			    	}else if(status == 1){
			    		status =locale.get({lang:"has_been_down"});
			    	}
			    	if(i % 2  == 0){
			    		htmls1+="<tr style='height: 30px;'><td width='60%;'>"+this.data.files[i].fileName+"</td><td style='text-align: center;'>"+status+"</td></tr>";
			    	}else{
			    		htmls1+="<tr style='height: 30px;background-color: #e7e7eb;'><td width='60%;'>"+this.data.files[i].fileName+"</td><td style='text-align: center;'>"+status+"</td></tr>";
			    	}
				   
			    } 
				htmls1+="</table></div>";
				$("#winContent").append(htmls1);
			}
		},
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return Window;
});