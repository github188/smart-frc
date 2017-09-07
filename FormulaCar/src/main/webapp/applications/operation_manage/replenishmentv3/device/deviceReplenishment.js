define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./deviceReplenishment.html");
	require("./default.css");
	var replenishment = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.elements = {
					head : {
						id : "tradeHead",
						"class" : null
					},
					footer : {
						id : "tradeFooter",
						"class" : null
					}
				};
			
			this.element.html(html);
			locale.render({element:this.element});
			this._render();
		},
		_render:function(){
			this.lackNumber1();
			this.lackNumber2();
			this.lackNumber3();
			this.lackNumber4();
		},
		lackNumber1: function(){
			var self = this;
			this.createForm = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td height='30px'>Blue Machine</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>4</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Battle Coke</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>6</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Green Machine</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Mighty Mango</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm.append(htmls1);
            this.createForm.appendTo(this.element);
            
            $("#devicelacknumber1").qtip({
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
						
					}
				},
                suppress:false
            });
	    },
	    lackNumber2: function(){
			var self = this;
			this.createForm2 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td height='30px'>Battle Coke</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Iced Black Tea</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>3</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Sprite Zero</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>3</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm2.append(htmls1);
            this.createForm2.appendTo(this.element);
            
            $("#devicelacknumber2").qtip({
                content: {
                    text: this.createForm2
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
						
					}
				},
                suppress:false
            });
	    },
	    lackNumber3: function(){
			var self = this;
			this.createForm3 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
				          +"<tr>"
			                 + "<td height='30px'>Sprite Zero</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm3.append(htmls1);
            this.createForm3.appendTo(this.element);
            
            $("#devicelacknumber3").qtip({
                content: {
                    text: this.createForm3
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
						
					}
				},
                suppress:false
            });
	    },
	    lackNumber4: function(){
			var self = this;
			this.createForm4 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
				          +"<tr>"
			                 + "<td height='30px'>Sprite Zero</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Mirinda</td>"
				             + "<td width='20%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm4.append(htmls1);
            this.createForm4.appendTo(this.element);
            
            $("#devicelacknumber4").qtip({
                content: {
                    text: this.createForm4
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
						
					}
				},
                suppress:false
            });
	    }
	   
		
	});	
	return replenishment;
    
});