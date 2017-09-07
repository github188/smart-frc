/**
 * @author PANJC
 *
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    var css = require("./resources/css/nav-account.css");
    var page = require("text!./account.html");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    var validator = require("cloud/components/validator");
    require("../template/css/common.css");
    var global_user_name = "";
    var global_user_phone = "";

    var Account = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
            this._id = null;
            this.oid = null;
            this.name = null;
            this.userName = null;
            this.phone = null;
            this.lastLoginTime = null;
            this.lastLogoutTime = null;
            this.lastIp = null;
            this.totalLogin = null;
            this.state = null;
            this.role = null;
            this.regTime = null;
            this._renderHtml();
            this.initUserInfo();
            this._renderButton();
            this.validation();
            locale.render({element:this.element});
            var photoFileId = null;
            $("#qtip-0").css("width","400px");
        },
        validation: function(){
            validator.render("#user-panel-form", {
                promptPosition: "topLeft",
                scroll: false
            });
        },
		closePrompt: function(){
			validator.hide();
		},

        _renderHtml: function(){
            this.element.html(page);
            $("#user-panel-input-new-password").attr("placeholder",locale.get({lang: "input_Numbers_letters"}));
            $("#user-panel-input-new-password").css("font-size",  1 );
        },

        _renderButton: function(){
            var self = this;
            this.editDom = $("<li></li>").appendTo(".user-panel-handle-ul");
            this.passDom = $("<li></li>").appendTo(".user-panel-handle-ul");
            this.logoutDom = $("<li></li>").appendTo(".user-panel-handle-ul");
            $("#lastBase3").val(locale.get({lang: "edit"}));
            $("#saveBase3").val(locale.get({lang: "changepwd"}));
            $("#nextBase3").val(locale.get({lang: "logout"}));
            
            //-------绑定微信号----------
           /* cloud.Ajax.request({
                url: "/vapi/oper",
                type: "GET",
                dataType: "json",
                success: function(data){
                	if(data && data.result){
                		var nickname = data.result.nickname;
                		$("#wechatTag").text("已绑定"+"    (昵称:"+nickname+")");
                		$("#wechatcode").css("display","none");
                		$("#wechat").css("display","none");
                	}else{
                		$("#wechatTag").text("未绑定");
                		$("#wechat").css("display","block");
                		$("#unwechat").css("display","none");
                	}
                }
            });
            
            var currentHost=window.location.hostname;
            if(currentHost == "localhost"){
            	currentHost = "http://121.42.28.70";
            }
            var pay_url = currentHost+"/vapi/oper/bind?access_token=" + cloud.Ajax.getAccessToken();
            
            //获取二维码
            $.ajax({
                url:currentHost+"/api/encode?pay_url="+pay_url,
                type: "GET",
                dataType: "json",
                success: function(data){
                    var src = currentHost + data;
                    $("#wechatcode").attr("src",src);
                }
            });
            
            $("#wechat").toggle(function(){
            	      $("#wechatcode").css("display","block");
            },function(){
            		  $("#wechatcode").css("display","none");
             });
            
            $("#unwechat").bind("click", function() {
            	cloud.Ajax.request({
                    url: "/vapi/oper",
                    type: "DELETE",
                    dataType: "json",
                    success: function(data){
                    	if(data && data.result){
                    		$("#wechat").css("display","block");
                    		 $("#wechatTag").text("未绑定");
                    		$("#unwechat").css("display","none");
                    	}
                    }
                });
            });*/
            //-------------------------------------------------------
            $("#lastBase3").bind("click", function() {
            	  self.clearTitle();
	              self.showPanelInfo("show");
	              self.showPanelPassword("hide");
	              self.enableEdit("show");
	              $(".user-panel-box").css({
	                  height: "550px"
	              });
            });
            $("#saveBase3").bind("click", function() {
                 self.showPanelInfo("hide");
                 self.showPanelPassword("show");
                 self.enableEdit("hide");
                 $(".user-panel-box").css({
                     height: "262px"
                 });
          });
            $("#nextBase3").bind("click", function() {
            	  dialog.render({
                      lang: "affirm_logout",
                      buttons: [{
                          lang: "yes",
                          click: function(){
                          	Model.user({
                          		method:"logout"
                          	});
                              dialog.close();
                          }
                      }, {
                          lang: "no",
                          click: function(){
                              dialog.close();
                          }
                      }]
                  });
         });
            
//            this.editBtn = new Button({
//                //text: "编辑",
//                text: "",
//                lang: "{'text':edit,'title':' edit '}",
//                imgCls: "cloud-icon-edit",
//                container: this.editDom,
//                stateful: true,
//                events: {
//                    click: function(){
//                    	self.clearTitle();
//                        self.showPanelInfo("show");
//                        self.showPanelPassword("hide");
//                        self.enableEdit("show");
//                        self.passBtn.removeState();
//                        $(".user-panel-box").css({
//                            height: "520px"
//                        });
//                    }
//                }
//            });
            /*this.passBtn = new Button({
               // text: "修改密码",
                text: "",
                lang: "{text:change_pwd,title:change_pwd}",
                container: this.passDom,
                imgCls: "cloud-icon-change",
                stateful: true,
                events: {
                    click: function(){
                        self.editBtn.removeState();
                        self.showPanelInfo("hide");
                        self.showPanelPassword("show");
                        self.enableEdit("hide");
                        $(".user-panel-box").css({
                            height: "262px"
                        });
                    }
                }
            });*/
            /*this.logoutBtn = new Button({
                //text: "注销",
                text: "",
                lang: "{text:logout,title:logout}",
                container: this.logoutDom,
                imgCls:"cloud-icon-logout",
                events: {
                    click: function(){
                        dialog.render({
                            lang: "affirm_logout",
                           // container:"#nav-account-panel",
                            buttons: [{
                                lang: "yes",
                                click: function(){
                                	Model.user({
                                		method:"logout"
                                	});
                                    dialog.close();
                                }
                            }, {
                                lang: "no",
                                click: function(){
                                    dialog.close();
                                }
                            }]
                        });
                    }
                }
            });*/
            this.saveBtn = new Button({
               // text: "确认",
            	text: "",
                lang: "{text:affirm,title:affirm}",
                imgCls: "cloud-icon-yes",
                container: $("#user-panel-save"),
                events: {
                    click: function(){
                        var user_name = $("#user-panel-name").val();
                        var user_phone = $("#user-panel-phone").text();

                        if (user_name === self.name && user_phone === self.phone && self.photoFileId === photoFileId) {
//                            self.editBtn.removeState();
//	                        self.passBtn.removeState();
	                        self.showPanelInfo("show");
	                        self.showPanelPassword("hide");
	                        self.enableEdit("hide");
                        }
                        else {
                        	if(!validator.result("#user-panel-form")){
                        		return;
                        	}

                        	self.addTitle();
							cloud.Ajax.request({
	                            url: "/api2/users/this",
	                            type: "GET",
	                            dataType: "json",
	                            parameters: {
	                                verbose: 3
	                            },
	                            success: function(data){
	                                var result = data.result;
	                                _id = result._id;
	                                updateInformation(_id);
	                            }
	                        });

                        }

                        var updateInformation = function(_id){
                            cloud.Ajax.request({
                                url: "/api2/users/this",
                                type: "PUT",
                                dataType: "JSON",
                                error: function(data){
                                    dialog.render({
                                    	//container:"#nav-account-panel",
                                        lang: "modify_failed"
                                    });
                                },
                                data: {
                                    name: user_name,
                                    phone: user_phone,
                                    photoFileId: self.photoFileId
                                },
                                success: function(data){
                                    dialog.render({
                                    	//container:"#nav-account-panel",
                                        lang: "modify_successful"
                                    });
                                    if(localStorage.getItem("appElement") === "#nav-subnav-system-user"){
										cloud.util.refresh();
									}
									if (user_name.length > 8) {
										user_name = user_name.substr(0, 8) + "...";
                                    }
	                                $("#nav-main-right-account-name").text(user_name);
//                                    self.editBtn.removeState();
//                                    self.passBtn.removeState();
                                    self.showPanelInfo("show");
                                    self.showPanelPassword("hide");
                                    self.enableEdit("hide");
                                    self.refreshUserPhoto(self.photoFileId);
									self.name = user_name ;
									self.phone = user_phone ;
									photoFileId = self.photoFileId;
                                }
                            });
                        };

                    }
                }
            });
            this.cancleBtn = new Button({
               // text: "取消",
            	text: "",
                lang: "{text:cancel,title:cancel}",
                imgCls: "cloud-icon-no",
                container: $("#user-panel-cancl"),
                events: {
                    click: function(){
						self.clearTitle();
						self.addTitle();
					 	$("#user-panel-name").val(self.name);
                        $("#user-panel-phone").text(self.phone.split("***")[0]);
//                        self.editBtn.removeState();
//                        self.passBtn.removeState();
                        self.showPanelInfo("show");
                        self.showPanelPassword("hide");
                        self.enableEdit("hide");
                    }
                }
            });
            this.uploadBtn = new Button({
                //        		text:"上传",
                imgCls: "cloud-icon-shangchuan",
                container: $("#user-panel-upload"),
                events: {
                    click: function(){

                    }
                }
            });
            self.initUploader();
            this.savepassdBtn = new Button({
                //text: "确认",
            	text: "",
                lang: "{text:affirm,title:affirm}",
                imgCls: "cloud-icon-yes",
                container: $("#user-panel-pass-save"),
                events: {
                    click: function(){
                        var old_password = $("#user-panel-input-old-password").val();
                        var new_password = $("#user-panel-input-new-password").val();
            			var strP=/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i ; 
                	    if(!strP.test(new_password)){
                	       dialog.render({lang:"Please_enter_letters_and_numbers"});
                	       return; 
                	    }
                        var new_repassword = $("#user-panel-input-new-repassword").val();

                        if (validator.result("#user-panel-form")) {
                                cloud.Ajax.request({
                                    url: "/api2/users/this/password?language=" + locale.current(),
                                    type: "PUT",
                                    dataType: "JSON",
                                    error: function(data){
                                        self.clearPassInput();
                                        if(data.error_code === 10017){
											dialog.render({
												//container:"#nav-account-panel",
												lang:"old_password_error"
											});
										}else{
											dialog.render({
												//container:"#nav-account-panel",
												lang:data.error_code
										 });
										}
                                    },
                                    data: {
                                        oldPassword: old_password.md5(),
                                        newPassword: new_repassword.md5()
                                    },
                                    success: function(data){
                                        dialog.render({
                                        	//container:"#nav-account-panel",
                                            lang: "modify_password_successful"
                                        });
                                        self.showPanelInfo("show");
                                        self.showPanelPassword("hide");
                                        self.enableEdit("hide");
                                        self.clearPassInput();
//										self.editBtn.removeState();
//                                   		self.passBtn.removeState();
                                        $(".user-panel-box").css({
                                            height: "380px"
                                        });
                                    }
                                });
                        }
                        else {
                        }
                    }
                }
            });
            this.passcancleBtn = new Button({
               // text: "取消",
            	text: "",
                lang: "{text:cancel,title:cancel}",
                imgCls: "cloud-icon-no",
                container: $("#user-panel-pass-cancl"),
                events: {
                    click: function(){
						self.clearTitle();
						self.addTitle();
//                        self.editBtn.removeState();
//                        self.passBtn.removeState();
                        self.showPanelInfo("show");
                        self.showPanelPassword("hide");
                        self.enableEdit("hide");
                        self.clearPassInput();
                        $(".user-panel-box").css({
                            height: "380px"
                        });
                    }
                }
            });

        },
        clearPassInput: function(){
            this.element.find("#user-panel-input-old-password").val(null);
            this.element.find("#user-panel-input-new-password").val(null);
            this.element.find("#user-panel-input-new-repassword").val(null);
        },

        initUploader: function(){
            var self = this;
            var uploaderUrl = cloud.config.FILE_SERVER_URL + "/api/file?access_token=" + cloud.Ajax.getAccessToken() //+ "&file_name=" + fileName;
            this.uploader = new Uploader({
                browseElement: this.uploadBtn,
                url: "/api/file",
                autoUpload: true,
                filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }],
                maxFileSize: "1mb",
                //        		tipsContainer : this.element.find("#info-site-pic-tips"),
                events: {
                	"onError": function(err){
						cloud.util.unmask("#user-panel-box");
						dialog.render({
							//container:"#nav-account-panel",
							text:err.text
						});
					},
					"onFilesAdded" : function(file){
						$("#user-panel-input-photo").val(file[0].name);
					},
                    "onFileUploaded": function(response, file){
                    	if ($.isPlainObject(response)){
							if(response.error){
								dialog.render({
									//container:"#nav-account-panel",
									lang:response.error_code
								});
							}else{
								dialog.render({
									//container:"#nav-account-panel",
									lang:"uploadcomplete"
								});
								 self.photoFileId = response.result._id;
							}
        				}
                        cloud.util.unmask("#user-panel-box");
                    },
                    "beforeFileUpload":function(){
						cloud.util.mask(
		                	"#user-panel-box",
		                	locale.get("uploading_files")
		                );
					}
                }
            });
        },

        initUserInfo: function(){
            var $this = this;
            cloud.Ajax.request({
                url: "/api2/users/this?timestemlp="+new Date().getTime(),
                type:"GET",
                dataType: "json",
                parameters: {
                    verbose: 100
                },
                success: function(data){
                    var result = data.result;
                    $this._id = result._id;
                    $this.oid = result.oid;
                    // userInfo.oid = result.oid;
                    $this.name = result.name;
                    $this.phone = result.phone;
                    $this.userName = result.email;
                    $("#nav-main-right-account-emailStr").text(result.email);
                    $this.phone = result.phone;
                    $this.lastLoginTime = result.lastLogin;
                    $this.lastLogoutTime = result.lastLogout;
                    $this.lastIp = result.lastIp;
                    $this.totalLogin = result.totalLogin;
                    $this.state = result.state;
                    $this.role = result.roleId;
                    $this.roleName = result.roleName;
                    $this.regTime = result.freqCreated;
                    $this.photoFileId = result.photoFileId;
                    photoFileId = result.photoFileId;
                    $this.loadUserData();
                    
                    cloud.Ajax.request({
                        url: "/api/organization/"+result.oid,
                        type:"GET",
                        dataType: "json",
                        parameters: {
                            verbose: 100
                        },
                        success: function(data){
                        	console.log(data);
                        	var oidName = data.result.name;
                        	$("#user-panel-oidName").text(oidName);
                        	
                            if(oidName == 'admin'){
                        		
                        	}else{
                        		$(".validityOfOid").css("display","block");
                        	}

                        	var payStyle = "";
                        	if(data.result.payStyle){
                        		payStyle = data.result.payStyle;
                        		if(payStyle == 2){//预付费
                        			$("#beforebillsum").css("display","block");
                        			if(data.result.siteNum){
                        				var siteNum = data.result.siteNum;
                            			$("#sitesums").text(siteNum);
                        			}else{
                        				$("#sitesums").text("未知");
                        			}
                        			
                        		}else if(payStyle == 1){//后付费
                        			$("#beforebillsum").css("display","none");
                        		}
                        	}
                        	
                        	
                        	
                        	if($("#billManage") && $("#billManage").length > 0){//判断是否有收费模块
                        		if(data.result.charge == 1){//不收费
                            	}else{
                            		if(oidName == 'admin'){
                                		$(".validityOfOid").css("display","none");
                                	}else{
                                		if(data.result.validTime){
                                    		var validityTime =  data.result.validTime;
                                        	$("#validityTime").text(cloud.util.dateFormat(new Date(validityTime), "yyyy-MM-dd hh:mm:ss"));
                                    	}else{
                                    		$("#validityTime").text(locale.get({lang: "automat_unknown"}));
                                    	}
                                	}
                            	}
                        	}
                        }
                    });

                }
            });
        },
        /*loadmap: function(){
            var self = this;
            this.map = new maps.Map({
                selector: "#user-panel-info-ul-img",
                zoom: 8,
                panControl: false
            });
            *//*this.map.setCenter(new maps.LonLat(104.052372, 30.586093));
             var marker = this.map.addMarker({
             position: new maps.LonLat(104.052372, 30.586093),
             title: locale.get({lang:"my_location"}),
             // animation: maps.Animation.drop
             draggable: false,
             // icon: require.toUrl("cloud/resources/images/map-marker.png")
             });*//*
            cloud.util.getCurrentLocation(function(position){
                var location = new maps.LonLat(position.longitude, position.latitude);
                self.map.setCenter(location);
                var marker = self.map.addMarker({
                    position: location,
                    title: locale.get({
                        lang: "my_location"
                    }),
                    // animation: maps.Animation.drop
                    draggable: false
                    // icon: require.toUrl("cloud/resources/images/map-marker.png")
                });
            });
        },*/

        loadmap:function(){
        	var map ="";
        	var languge= localStorage.getItem("language");
        	if(languge == "en"){
        		 map = this.map = L.map($("#user-panel-info-ul-img")[0],{
                     zoomControl : false
                 }).setView([38.634036452919226,-100.08544921874999],3);
        	}else{
        		 map = this.map = L.map($("#user-panel-info-ul-img")[0],{
                     zoomControl : false
                 }).setView([37.857507,105.68161],3);
        	}
           
            var tile = cloud.Lmap.getTile(map);

            cloud.util.getCurrentLocation(function(position){
                latlng = [position.latitude,position.longitude]
                map.setView(latlng,8);
                var marker = L.marker(latlng,{
                    title : locale.get({lang:'my_location'}),
                    dragable : false
                }).addTo(map);

            })
        },

        loadUserData: function(){
            var _id = this._id;
            var oid = this.oid;
//            var photoFileId = this.photoFileId;
            var name = this.name ? this.name : "";
			 switch(this.roleName){
				case "admin":
					var roleName = locale.get({lang:"organization_manager"});
					break;
				case "DeviceManager":
					roleName = locale.get({lang:"device_manager"});
					break;
				case "DeviceSense":
					roleName=locale.get({lang:"device_sense"});
					break;
				default:
					roleName = this.roleName;
					break;
			}
//            var roleName = this.roleName;
            var userName = this.userName;
            if (userName.length > 16) {
                userName = userName.substring(0, 15) + "...";
            }
            var phone = this.phone ? this.phone : "";
            var lastLoginTime = this.lastLoginTime;
            var navShowName = name ? name : userName;
            if (navShowName.length > 4) {
                navShowName = navShowName.substring(0, 4) + "...";
            }
            if (!!lastLoginTime) {
                lastLoginTime = cloud.util.dateFormat(new Date(lastLoginTime), "yyyy-MM-dd hh:mm:ss");
                //                lastLoginTime = this.msToDate(lastLoginTime);
            }
            else {
                lastLoginTime = "";
            }
            var lastLogoutTime = this.lastLogoutTime;
            if (!!lastLogoutTime) {
                lastLogoutTime = cloud.util.dateFormat(new Date(lastLogoutTime), "yyyy-MM-dd hh:mm:ss");
                //                lastLogoutTime = this.msToDate(lastLogoutTime);
            }
            else {
                lastLogoutTime = "";
            }
            var lastIp = this.lastIp ? this.lastIp : "";
            this.refreshUserPhoto(this.photoFileId);
            $("#user-panel-username").text(userName).attr("title", this.userName);
            $("#user-panel-last-login").text(lastLoginTime).attr("title", lastLoginTime);
            $("#user-panel-last-logout").text(lastLogoutTime).attr("title", lastLogoutTime);
            $("#user-panel-last-ip").text(lastIp).attr("title", lastIp);
            $("#user-panel-name").val(name).attr("title", name);
            $("#user-panel-phone").text(phone.split("***")[0]).attr("title", phone.split("***")[0]);
            $("#user-nav-name").text(navShowName).attr("title", navShowName);
            $("#user-panel-role").text(roleName).attr("title", roleName);
        },

        refreshUserPhoto: function(photoFileId){
            if (photoFileId !== undefined) {
                var img = cloud.config.FILE_SERVER_URL + "/api/file/" + photoFileId + "?access_token=" + cloud.Ajax.getAccessToken();
                $("#user-panel-title-userhead").children("img").attr("src", img);
            }
        },

        enableEdit: function(param){
            var userPanelName = $("#user-panel-name");
            var userPanelPhone = $("#user-panel-phone");
            var userPanelInputPhoto = $("#user-panel-input-photo");
            var userPanelSave = $("#user-panel-save");
            var userPanelCancl = $("#user-panel-cancl");
            var userPanelUpload = $("#user-panel-upload");
            if (param === "" || param === "show") {
                userPanelName.removeAttr("disabled");
                userPanelPhone.removeAttr("disabled");
                //                userPanelInputPhoto.removeAttr("disabled");
                userPanelInputPhoto.css("display", "block");
                $("#user-panel-myimage").css("display", "block");
                userPanelSave.show();
                userPanelCancl.show();
                userPanelUpload.show();
            }
            else
                if (param === 0 || param === "hide") {
                    userPanelName.attr("disabled", "disabled");
                    userPanelPhone.attr("disabled", "disabled");
                    userPanelInputPhoto.attr("disabled", "disabled");
                    userPanelInputPhoto.css("display", "none");
                    $("#user-panel-myimage").css("display", "none");
                    $("#user-panel-input-photo").val("");
                    userPanelSave.hide();
                    userPanelCancl.hide();
                    userPanelUpload.hide();
                }
                    },
        showPanelInfo: function(param){
            var userPanelInfo = $("#user-panel-info");
            if (param === "" || param === "show") {
                userPanelInfo.show();
            }
            else
                if (param === 0 || param === "hide") {
					this.closePrompt();
                    userPanelInfo.hide();
                }
        },
        showPanelPassword: function(param){
            var userPanelPassword = $("#user-panel-password");
            if (param === "" || param === "show") {
                userPanelPassword.show();
            }
            else
                if (param === 0 || param === "hide") {
					this.closePrompt();
                    userPanelPassword.hide();
                }
        },
        initbuttonstatus: function(){
			this.clearTitle();
			this.addTitle();
			$("#user-panel-name").val(this.name);
            $("#user-panel-phone").text(this.phone);
//            if (this.editBtn) {
//                this.editBtn.removeState();
//            }
//            if (this.passBtn) {
//                this.passBtn.removeState();
//            }
            this.showPanelInfo("show");
            this.showPanelPassword("hide");
            this.enableEdit("hide");
            $(".user-panel-box").css({
                height: "380px"
            });
        },
		destroy : function($super) {
			$super();
			this.uploader.destroy();
//			this.editBtn.destroy();
//			this.passBtn.destroy();
//			this.logoutBtn.destroy();
			this.saveBtn.destroy();
			this.cancleBtn.destroy();
			this.uploadBtn.destroy();
			this.savepassdBtn.destroy();
			this.passcancleBtn.destroy();
			this._id = null;
            this.oid = null;
            this.name = null;
            this.userName = null;
            this.phone = null;
            this.lastLoginTime = null;
            this.lastLogoutTime = null;
            this.lastIp = null;
            this.totalLogin = null;
            this.state = null;
            this.role = null;
            this.regTime = null;
		},
		clearTitle: function(){
			$("#user-panel-username").removeAttr("title");
            $("#user-panel-last-login").removeAttr("title");
            $("#user-panel-last-logout").removeAttr("title");
            $("#user-panel-last-ip").removeAttr("title");
            $("#user-panel-name").removeAttr("title");
            $("#user-panel-phone").removeAttr("title");
            $("#user-nav-name").removeAttr("title");
            $("#user-panel-role").removeAttr("title");
		},
		addTitle: function(){
			$("#user-panel-username").attr("title", this.userName);
            $("#user-panel-last-login").attr("title", $("#user-panel-last-login").text());
            $("#user-panel-last-logout").attr("title", $("#user-panel-last-logout").text());
            $("#user-panel-last-ip").attr("title", $("#user-panel-last-ip").text());
            $("#user-panel-name").attr("title", $("#user-panel-name").val());
            $("#user-panel-phone").attr("title", $("#user-panel-phone").text());
            $("#user-nav-name").attr("title", $("#user-nav-name").text());
            $("#user-panel-role").attr("title", $("#user-panel-role").text());
		}




    });

    return Account;

});
