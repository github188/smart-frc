define(function (require) {
  require("cloud/base/cloud");
  var Service = require("../../service");
  var Uploader = require("cloud/components/uploader");
  require("cloud/lib/plugin/jquery.uploadify");
  var html = require("text!./remote-control.html");
  var RemoteControl = Class.create(cloud.Component, {

    initialize: function ($super, options) {
      $super(options);
      this.id = options.id;
      this.assetId = options.assetId;
      this.ip = options.ip;
      this.render(options);
      this.timer = null;
      this.levelStr = " :~$ ";
      this.files = [];
      this.node = null;
      this.connum = 0;
      
      $("#ui-window-content").css("overflow","hidden");

    },

    _mask: function () {
      cloud.util.mask("#remote-control-content");
      
      
      $("#remote-control-sysrestart").attr("disabled", "disabled");
      $("#remote-control-apprestart").attr("disabled", "disabled");
      $("#remote-control-getconfig").attr("disabled", "disabled");
     
      
      $("#remote-control-submit").attr("disabled", "disabled");
      $("#command-input").attr("readonly", "readonly");
    },

    _unmask: function () {
      cloud.util.unmask("#remote-control-content");
      $("#remote-control-sysrestart").removeAttr("disabled");
      $("#remote-control-apprestart").removeAttr("disabled");
      $("#remote-control-getconfig").removeAttr("disabled");
      
      $("#remote-control-submit").removeAttr("disabled");
      $("#command-input").removeAttr("readonly");
      
      $("#remote-control-submit").css("background-color","#ddd");//提交按钮
    },

    destroy: function () {
      this.element.empty();
    },

    render: function (options) {
      var self = this;     
      self._draw();
      self._bindEvents();
      locale.render({element: self.element});
    },
    _draw: function () {
        var self = this;
        self.element.html(html);
        
        $("#current-device-assetid").text(self.assetId);
        $("#remote-control-user-lasttime").text((new Date()).toLocaleString());
    	
    	$("#remote-control-user-lastip").text(self.ip);
    },
    _initUpload: function(){
    	
    	var self=this;
        this.uploader = new Uploader({
            browseElement: $("#remote-control-pushconfig"),
            url: "/api/file",
            autoUpload: true,
            multiSelection:true,
            filters: [{
                title: "Image files or video",
                extensions: "xls,xlsx,docx,doc,config,txt,zip,gz,war,rar,tar,jar,xml"
            }],
            maxFileSize: "1mb",
            events: {
            	"onError": function(err){
            		self._mask();
				},
				"onFilesAdded" : function(file){
					var name=file[0].name;
					var size=file[0].size;
					
				},
				"onUploadComplete": function(files){
					
					Service.setRemoteConfig(self.files,function(datas){
						
						var fileid = datas.result;
						
						self._mask();
						var data = {
            					taskType:"setconfig",
            					cmd:fileid
            			};
						
						self.files = [];
						
						self._createTask(data, 4);
						
					});
					
					
				},
                "onFileUploaded": function(response, file){
                	if ($.isPlainObject(response)){
                		if(response.error){
                			dialog.render({lang:"upload_files_failed"});
						}else{
							
							var fb = {};
							fb.filename = file.name;
							fb.md5 = response.result.md5;
							fb.fileid = response.result._id;
							
							self.files.push(fb);
	                        
						}
                	}
                	
                	//self._unmask();
                },
                "beforeFileUpload":function(){
                	self._mask();
				}
            }
        });
    	
    },
    parentIndexOf:function(node,parent){ 
        if(node==parent){return 0;} 
        for (var i=0,n=node; n=n.parentNode; i++){ 
            if(n==parent){return i;} 
            if(n==document.documentElement){return -1;} //找不到目标父节点，防止死循环 
        } 
    }, 
    
    //解析xml，添加换行
    serializeToString:function (oNode){
		var self = this;
	    var sXml = "";
	    switch (oNode.nodeType) {
	        case 1: //element
	        	
	        	var ix = self.parentIndexOf(oNode,self.node);//节点深度

	        	var st = "";
	        	for(var n=1;n<ix+1;n++){//添加空格
	        		
	        		st += "&nbsp;&nbsp;&nbsp;&nbsp;"; 
	        		
	        	}
	        	sXml = st+"&lt;" + oNode.tagName;
	        	
	            for (var i=0; i < oNode.attributes.length; i++) {
	                sXml += " " + oNode.attributes[i].name + "=\"" + oNode.attributes[i].value + "\"";
	            }
	             
	            sXml += "&gt;";
	            
	            if(oNode.childNodes.length>1){
	            	sXml += "<br/>";
	            }else if(oNode.firstChild != null &&　oNode.firstChild.childNodes != null && oNode.firstChild.childNodes.length >=1){
	            	sXml += "<br/>";
	            }
	            for (var i=0; i < oNode.childNodes.length; i++){
	                sXml += self.serializeToString(oNode.childNodes[i]);
	            }
	            if(oNode.firstChild == null || (oNode.firstChild != null && oNode.firstChild.firstChild == null)){
	        		st = "";
	        	}//叶子节点
	            sXml += st+"&lt;/" + oNode.tagName + "&gt;";
	            
	            sXml += "<br/>";
	            break;
	             
	        case 3: //text node
	            sXml = oNode.nodeValue;
	            break;
	        case 4: //cdata
	            sXml = "<![CDATA[" + oNode.nodeValue + "]]>";
	            break;
	        case 7: //processing instruction
	            sXml = "<?" + oNode.nodevalue + "?>";
	            break;
	        case 8: //comment
	            sXml = "<!--" + oNode.nodevalue + "-->";
	            break;
	        case 9: //document
	            for (var i=0; i < oNode.childNodes.length; i++){
	                sXml += self.serializeToString(oNode.childNodes[i]);
	            }
	            sXml += "<br/>";
	            break;
	             
	    }  
	     
	    return sXml;
	},
    
    _createTask:function(config,type){
    	var self = this;
    	
    	self._mask();
    	
    	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
    	var userName = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];
		
		var task = {
				userName:userName,
				ip:self.ip,
				uid:userId,
				gwId:self.id,
				assetId:self.assetId,
				data:config
		};
    	
		Service.addRemoteTask(task,function(data){
			
			self.timer = setInterval(function(){
				self.connum ++;
				
				if(self.connum >= 24){
					
					$("#remote-control-content").append("command execute failed!");
					clearInterval(self.timer);
					self._unmask();
					self.connum = 0;
				}
				Service.getTaskInfoById(data.result._id,function(data){
					
					
					if(data.result.sync == 1){
						
						if(type == 3){//获取配置
                            var fileid = data.result.data.result;
							
							$("#remote-control-content").html("<a id='"+fileid+"'>点击下载</a>");
							
							$("#"+fileid).bind('click',function(e){
			                	e.preventDefault();
		            			var host = cloud.config.FILE_SERVER_URL;
		            			
			                	var url = host + "/api/file/" + fileid + "?access_token=" + cloud.Ajax.getAccessToken();
		            			cloud.util.ensureToken(function() {
		                            window.open(url, "_self");
		                            
		                            $("#remote-control-content").html("");
		                        });
			                	
			                });
						}else{//其他命令
						　　　var Str = data.result.data.result;
							if(Str.indexOf("<?xml") >-1){//判断是否为xml，文件特殊处理
								 var reg=new RegExp("<br/>","g");
								 Str = Str.replace(reg, "");
								 var xmlDoc = $.parseXML(Str);
								 self.node = xmlDoc;
							     Str = self.serializeToString(xmlDoc);
							}
							$("#remote-control-content").append(Str);
							var t = document.getElementById('remote-control-content');
					    	t.scrollTop = t.scrollHeight;
							
						}
						
						clearInterval(self.timer);
						self._unmask();
					}
					
				});
        		
        		
        	},5000);
			
			
		});
    	
    	
    },
    _bindEvents: function(){
    	var self = this;
    	
    	$("#command-list").bind("change",function(){
    		var command = $("#command-list").val();
    		if(command == "advanced"){
    			
    			//self._createTask(data, 5,1);
    			self.levelStr = " :~# ";
    			$("#command-input").show();
    			$("#command-run-commandline").show();
    			
    		}else{
    			
    			self.levelStr = " :~$ ";
    			
    			$("#command-input").hide();
    			$("#command-run-commandline").hide();
    		}
    		
    		
    	});
    	
    	
    	//系统重启
    	$("#remote-control-sysrestart").mouseover(function (){
    		$("#remote-control-sysrestart").css("background-color","#C5C1AA");
	    	
		}).mouseout(function (){
			$("#remote-control-sysrestart").css("background-color","#ddd");
			
		});
    	$("#remote-control-sysrestart").bind('click',function(){
    		
    		dialog.render({
                lang: "affirm_restart",
                buttons: [{
                        lang: "affirm",
                        click: function() {
                        	var data = {
                					taskType:"reboot",
                					cmd:""
                			};
                        	dialog.close();
                    		self._createTask(data, 1);

                        }
                    },
                    {
                        lang: "cancel",
                        click: function() {
                            dialog.close();
                        }
                    }]
            });
			
    	});
    	//应用重启
    	$("#remote-control-apprestart").mouseover(function (){
	    	$("#remote-control-apprestart").css("background-color","#C5C1AA");
		}).mouseout(function (){
			$("#remote-control-apprestart").css("background-color","#ddd");
		});
        $("#remote-control-apprestart").bind('click',function(){
    		
        	dialog.render({
                lang: "affirm_restart",
                buttons: [{
                        lang: "affirm",
                        click: function() {
                        	var data = {
                					taskType:"apprestart",
                					cmd:""
                			};
                        	dialog.close();
                			self._createTask(data, 2);

                        }
                    },
                    {
                        lang: "cancel",
                        click: function() {
                            dialog.close();
                        }
                    }]
            });
			
    		
    	});
        //配置获取
        $("#remote-control-getconfig").mouseover(function (){
	    	$("#remote-control-getconfig").css("background-color","#C5C1AA");
		}).mouseout(function (){
			$("#remote-control-getconfig").css("background-color","#ddd");
		});
        $("#remote-control-getconfig").bind('click',function(){
            
        	var data = {
					taskType:"getconfig",
					cmd:""
			};
        	self._createTask(data, 3);       	        	   		
    		
    	});
        //配置下发
        $("#remote-control-pushconfig").mouseover(function (){
	    	$("#remote-control-pushconfig").css("background-color","#C5C1AA");
		}).mouseout(function (){
			$("#remote-control-pushconfig").css("background-color","#ddd");
		});
		self._initUpload();	
			
		
		$("#command-input").bind('keypress',function(e){
			
			if(e.keyCode == 13){
				var cmd = $("#command-input").val();
				if(cmd==null||cmd.replace(/(^\s*)|(\s*$)/g,"")==""){
	      			dialog.render({lang:"enter_cmd"});
	      			return;
	      		};
				var data = {
						taskType:"command",
						cmd:cmd
				};
				$("#command-input").val("");
				$("#remote-control-content").append("<p>"+self.assetId+self.levelStr+cmd+"</p>");
				
				self._createTask(data, 5);
				//self._mask();
			}
			
		});
		
		
		//发送
		$("#remote-control-submit").mouseover(function (){
	    	$("#remote-control-submit").css("background-color","#C5C1AA");
		}).mouseout(function (){
			$("#remote-control-submit").css("background-color","#ddd");
		});
        $("#remote-control-submit").bind('click',function(){
			
        	var cmd = $("#command-input").val();
        	if(cmd==null||cmd.replace(/(^\s*)|(\s*$)/g,"")==""){
      			dialog.render({lang:"enter_cmd"});
      			return;
      		};
			var data = {
					taskType:"command",
					cmd:cmd
			};
			$("#command-input").val("");
			$("#remote-control-content").append("<p>"+self.assetId+self.levelStr+cmd+"</p>");
			
			self._createTask(data, 5);
			
		});

        //取消
        
        //清屏
        $("#remote-control-cleanscreen").mouseover(function (){
	    	$("#remote-control-cleanscreen").css("background-color","#C5C1AA");
		}).mouseout(function (){
			$("#remote-control-cleanscreen").css("background-color","#ddd");
		});
        $("#remote-control-cleanscreen").bind('click',function(){
			
        	if(self.timer != null){
        		clearInterval(self.timer);
        		self._unmask();
        	}
        	
        	$("#remote-control-content").html("");
			
			
		});
    	
    }


  });

  return RemoteControl;

});
