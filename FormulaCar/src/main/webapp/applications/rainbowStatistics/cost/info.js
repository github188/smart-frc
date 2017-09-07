/**
 * Created by zhang on 14-7-21.
 */
define(function(require){

    var html = require("text!./info.html");
    var Button = require("cloud/components/button");
    var Service = require("./service");
    var validator = require("cloud/components/validator");

    var Info = Class.create(cloud.Component,{
        initialize:function($super,option){
            $super(option);

            this.packageId = null;
            this.service = Service;
            this._render()

            locale.render({element:this.element});


        },

        _render:function(){
            this._renderHtml();
            this._bindEvent();
            this._renderBtn();
            this._initValidator();

        },

        _initValidator:function(){
            validator.render("#package-info-form",{
                promptPosition:"bottomLeft"
            });
        },

        _renderHtml:function(){
            this.element.html(html);
            this.$name = this.element.find("#package-info-name");
            this.$base = this.element.find("#package-info-base");
            this.$flow = this.element.find("#package-info-flow");
            this.$cost = this.element.find("#package-info-cost");
            this.$unitRadio = this.element.find("input:radio[name=unit]");
            this.$arr=[this.$name,this.$base,this.$flow,this.$cost,this.$unitRadio];
            this.$costUnit = this.element.find("#package-info-cost-unit");
            this.$baseUnit = this.element.find("#package-info-base-unit");
        },
        _bindEvent:function(){
            var self = this;
            this.$baseUnit.bind("change",function(){
                var value = $(this).val();
                var unit;
                switch (value){
                    case "0":
                        unit = "￥";
                        break;
                    case "1":
                        unit = "$";
                        break;
                }
                self.$costUnit.text(unit);

            })
        },

        _renderBtn:function(){
            var self = this;
            var $btn = this.element.find(".package-info-btn");
            this.editBtn = new Button({
                container:$btn,
                imgCls: "cloud-icon-edit",
                lang:"{title:edit}",
                events: {
                    click: function(){
                        self.editable(true)
                    }
                }
            });



            var $button = this.element.find(".package-info-button");
            this.submitButton = new Button({
                container: $button,
                imgCls: "cloud-icon-yes",
                text:locale.get("submit"),
                lang:"{title:submit,text:submit}",
                events: {
                    click: function(){
                        if (!(validator.result("#package-info-form"))){
//                            self.element.find("#package-info-form input").trigger("blur");
                            //this.element.find("#info-name").trigger("blur");
                            return false;
                        };
                        var data = self.getInfo();
                        if(self.packageId){
                            data.packageId = self.packageId;
                            self.service.updatePackage(data,function(data){
                                self.fire("onUpdate",data);

                            });
                        }else{
                            self.service.addPackage(data,function(data){
                                self.fire("onAdd",data);
                            });
                        }


                    }
                }
            });

            this.cancelButton = new Button({
                container: $button,
                imgCls: "cloud-icon-no",
                text:locale.get("cancel"),
                lang:"{title:cancel,text:cancel}",
                events: {
                    click: function(){

                        if(self.packageId){
                            self.editable(false);
                            self.setInfo(self.data);
                        }else{
                            self.fire("cancelCreate")
                        }
                        validator.hideAll();
                    }
                }
            });

            var $default = this.element.find(".package-info-default");
            this.defaultBtn = new Button({
                container:$default,
                text:locale.get("set_default"),
//                checkboxCls: "cloud-icon-star",
                checkbox: true,
                events:{
                    click:function(){
                        if(!this.isSelected()){
                            if(self.isdefault == 1){
                                dialog.render({text:locale.get("can_not_cancel")});
                                this.select();
                            }
                        }

                    }
                }
            });

        },

        editable:function(flag){
            var self = this;
            if(flag){
                this.$arr.each(function($one){
                    $one.removeAttr("disabled")
                });
                self.editBtn.hide();
                self.submitButton.show();
                self.cancelButton.show();
                self.defaultBtn.enable();
            }else{
                this.$arr.each(function($one){
                    $one.attr("disabled","disabled")
                });
                self.submitButton.hide();
                self.cancelButton.hide();
                self.editBtn.show();
                self.defaultBtn.disable();
            }

        },

        clear:function(){
            this.packageId = null;
            this.setInfo({
                name:"",
                basicprice:"",
                flow:"",
                overprice:"",
                isdefault:2
            })
        },

        setInfo:function(data){
            this.data = data;
            this.packageId = data.packageId;
            this.$name.val(data.name);
            this.$base.val(data.basicprice);
            var value = this.unitProc(data.flow);
            this.$flow.val(value.flow);
            switch (value.type){
                case 1:
                    this.element.find("input:radio[name=unit][value=1]").attr("checked","checked");
                    break;
                case 2:
                    this.element.find("input:radio[name=unit][value=2]").attr("checked","checked");
                    break;
            }
//            if(data.cost > 1024){
//                this.$unitRadio.
//            }
            this.$cost.val(data.overprice);
            this.isdefault = data.isdefault;
            this.defaultBtn.setSelect(data.isdefault == 1 ? true : false);
        },

        getInfo:function(){
            var data = {};
            data.name = this.$name.val();
            data.basicprice = this.$base.val();
            var flow = this.$flow.val();
            if( this.element.find("input:radio[name=unit]:checked").val() == 2){
                flow = flow*1024;
            }
            data.flow = flow;
            data.overprice = this.$cost.val();
            data.type = this.defaultBtn.isSelected() == true ? 1 : 2 ;
            data.isdefault = data.type;
            return data;
        },

        /**
         * 转换MB GB
         * @param num(MB)
         */
        unitProc:function(num){
            var unit = "MB";
            var type = 1;
            var flow;
            if(num > 1024){
                type = 2;
                flow = num / 1024;
                unit = "GB"
            }else{
                flow = num;
            }
            return {
                flow:flow,
                unit:unit,
                type:type
            }
        },

        destroy:function(){

        }
    });

    return Info
});