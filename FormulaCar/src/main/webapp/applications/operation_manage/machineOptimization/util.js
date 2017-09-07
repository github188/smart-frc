define(function(require) {
	var util = Class.create({
		numberLimit: function(event) {
			//限制1-30
			if((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)) {
				if(this.value.length==2) {
					return false;
				}
				
				if(this.value.length==1) {
					if(this.value == 3 && !(event.keyCode==48 || event.keyCode==96)){
						return false;
					}
					if(this.value > 3){
						return false;
					}
				}
				
				if(this.value.length==0) {
					if(event.keyCode==48 || event.keyCode==96){
						return false;
					}
				}
			}else if(event.keyCode != 8){//not backspace
				return false;
			}
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		}
	});
	return new util();
});