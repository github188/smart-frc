define(function(require){
	require("cloud/lib/jquery");
	var Common = Class.create({
        initialize: function(){
        },
        getRealVender: function(value){
			var vender;
			if(value == locale.get({lang: "vender_name_fuji"})){
				vender = "fuji";
            }else if(value == locale.get({lang: "vender_name_aucma"})){
            	vender = "aucma";
            }else if(value == locale.get({lang: "vender_name_easy_touch"})){
            	vender = "easy_touch";
            }else if(value == locale.get({lang: "vender_name_junpeng"})){
            	vender = "junpeng";
            }else if(value == locale.get({lang: "vender_name_baixue"})){
            	vender = "baixue";
            }else if(value == '雷云峰'){
            	vender = "leiyunfeng";
            }else{
            	vender = value;
            }
			
			/*$.getJSON("js/userinfo.json",function(data){ 
			});*/
			
			return vender;
		},
		getLangVender:function(value){
			var vender;
			if(value == "fuji"){
				vender = locale.get({lang: "vender_name_fuji"});
            }else if(value == "aucma"){
            	vender = locale.get({lang: "vender_name_aucma"});
            }else if(value == "easy_touch"){
            	vender = locale.get({lang: "vender_name_easy_touch"});
            }else if(value == "junpeng"){
            	vender = locale.get({lang: "vender_name_junpeng"});
            }else if(value == "baixue"){
            	vender = locale.get({lang: "vender_name_baixue"});
            }else if(value == "leiyunfeng"){
            	vender = "雷云峰";
            }else{
            	vender = value;
            }
			
			return vender;
		}
	});
	
	return new Common();
});