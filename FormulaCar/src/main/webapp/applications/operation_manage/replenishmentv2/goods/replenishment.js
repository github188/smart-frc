define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	var html = require("text!./replenishment.html");
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
			this.lackNumber5();
			this.lackNumber6();
			this.lackNumber7();
			this.lackNumber8();
			this.lackNumber9();
			this.lackNumber10();
		},
		lackNumber1: function(){
			var self = this;
			this.createForm = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td  height='30px'>New York</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>4</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Chicago</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>6</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Washington DC</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Seattle</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm.append(htmls1);
            this.createForm.appendTo(this.element);
            
            $("#lacknumber1").qtip({
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
				             + "<td  height='30px'>Seattle</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Los Angeles</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>3</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>New York</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>3</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm2.append(htmls1);
            this.createForm2.appendTo(this.element);
            
            $("#lacknumber2").qtip({
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
			                 + "<td height='30px'>New York</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm3.append(htmls1);
            this.createForm3.appendTo(this.element);
            
            $("#lacknumber3").qtip({
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
			                 + "<td  height='30px'>Washington DC</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>New York</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm4.append(htmls1);
            this.createForm4.appendTo(this.element);
            
            $("#lacknumber4").qtip({
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
	    },
	    lackNumber5: function(){
			var self = this;
			this.createForm5 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td  height='30px'>Washington DC</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Seattle</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Los Angeles</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm5.append(htmls1);
            this.createForm5.appendTo(this.element);
            
            $("#lacknumber5").qtip({
                content: {
                    text: this.createForm5
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
	    lackNumber6: function(){
			var self = this;
			this.createForm6 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td  height='30px'>Los Angeles</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Washington DC</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm6.append(htmls1);
            this.createForm6.appendTo(this.element);
            
            $("#lacknumber6").qtip({
                content: {
                    text: this.createForm6
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
	    lackNumber7: function(){
			var self = this;
			this.createForm7 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td  height='30px'>Washington DC</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>New York</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>5</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm7.append(htmls1);
            this.createForm7.appendTo(this.element);
            
            $("#lacknumber7").qtip({
                content: {
                    text: this.createForm7
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
	    lackNumber8: function(){
			var self = this;
			this.createForm8 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td height='30px'>New York</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td height='30px'>Chicago</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm8.append(htmls1);
            this.createForm8.appendTo(this.element);
            
            $("#lacknumber8").qtip({
                content: {
                    text: this.createForm8
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
	    lackNumber9: function(){
			var self = this;
			this.createForm9 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
			              +"<tr>"
				             + "<td  height='30px'>Chicago</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>2</td>"
				          +"</tr>"
				          +"<tr>"
			                 + "<td  height='30px'>Los Angeles</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm9.append(htmls1);
            this.createForm9.appendTo(this.element);
            
            $("#lacknumber9").qtip({
                content: {
                    text: this.createForm9
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
	    lackNumber10: function(){
			var self = this;
			this.createForm10 = $("<form>").addClass(this.moduleName + "-create-form ui-helper-hidden tag-overview-form");
			
			var htmls1= "<table width='200px' style='margin-left:5%;' border='1'>"
				          +"<tr>"
			                 + "<td  height='30px'>Los Angeles</td>"
				             + "<td width='30%' height='30px' style='text-align: center;'>1</td>"
				          +"</tr>"
			             +"</table>";
			
			this.createForm10.append(htmls1);
            this.createForm10.appendTo(this.element);
            
            $("#lacknumber10").qtip({
                content: {
                    text: this.createForm10
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