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
				title: locale.get({lang:"cargo_lane_change_detail"}),
				top: "center",
				left: "center",
				height:400,
				width: 450,
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
			//this.datas ='T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300;T,1,可口可乐,雪碧;T,2,奶茶,N;T,2,N,咖啡;P,12,200,300';
			//if(this.datas){
		   if(this.data && this.data.content){
				var str= new Array();   
				str=this.data.content.split(";"); 
				var htmls1= "<div style='height:350px;overflow: auto;text-align: center;'><table width='90%' style='border: 1px solid #e7e7eb;margin-left:5%;margin-top:20px;' border='1'>"
				for (i=0;i<str.length ;i++ ){  
				   var shefArray = new Array();
				   shefArray=str[i].split(","); 
				   if(shefArray.length>0){  
					   if(shefArray[0] == 'T'){//商品种类发生变化
						   if(shefArray[2]=='N'){
							   shefArray[2] =locale.get({lang:"none"});
						   }
						   if(shefArray[3]=='N'){
							   shefArray[3] =locale.get({lang:"none"});
						   }
				    	   htmls1+="<tr><td width='15%;'>"+locale.get({lang:"automat_cargo_road_id"})+shefArray[1]+":</td><td style='text-align: left;'>"+shefArray[2]+"&nbsp;&nbsp;"+locale.get({lang:"replace_as"})+"&nbsp;&nbsp;"+shefArray[3]+"</td></tr>";
				       }else if(shefArray[0] == 'P'){//价格发生变化
				    	   htmls1+="<tr><td width='15%;'>"+locale.get({lang:"automat_cargo_road_id"})+shefArray[1]+":</td><td style='text-align: left;'>"+(shefArray[2]/100)+locale.get({lang:"china_yuan"})+"&nbsp;&nbsp;"+locale.get({lang:"replace_as"})+"&nbsp;&nbsp;"+(shefArray[3]/100)+locale.get({lang:"china_yuan"})+"</td></tr>";
				       }  
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