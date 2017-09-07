define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./fileList.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var _Window = require("cloud/components/window");
	//var addMedias = require("./update/medias-window");
	var columns = [ {
		"title":locale.get({lang:"material_name"}),//素材名称
		"dataIndex" : "mediaName",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"type"}),//素材类型
		"dataIndex" : "mediaType",
		"cls" : null,
		"width" : "20%",
		 render: function(data, type, row) {
                var display = "";
                if (data) {
                	dataArr=data.split("_");
                    display = dataArr[0];
                    if(display == "1"){
                    	display = locale.get({lang: "imageGridTitle"});
                    }else if(display == "2"){
                    	display = locale.get({lang: "material_video"});
                    }else if(display == "3"){
                    	display = locale.get({lang: "ad_txt"});
                    }
                }
                return display;
            }
    },{
		"title":locale.get({lang:"ad_filename"}),//文件名称
		"dataIndex" : "fileName",
		"cls" : null,
		"width" : "20%",
	},{
		"title":locale.get({lang:"ad_preview"}),//文件预览
		"dataIndex" : "mediaType",
		"cls" : null,
		"width" : "20%",
        render:function(data, type, row){
			    var productsImage = locale.get({lang:"products"});
			    var  display = "";
			    if(data){
                	dataArr=data.split("_");
	                display = dataArr[0];
                    if(display == "1" || display == "3"){
                    	if(dataArr[1]!=null && dataArr[1]!="" ){
                    	var src = cloud.config.FILE_SERVER_URL + "/api/file/" + dataArr[1] + "?access_token=" + cloud.Ajax.getAccessToken();
    	                display = new Template(
    	                    "<img id='img_"+dataArr[1]+"s' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/>")
    	                    .evaluate({
    	                        status : productsImage
    	                    });
                    	}else{
                    		display = ""
                    	}
                    }else if(display == "2"){
                    	if(dataArr[1]!=null && dataArr[1]!="" ){
                    	var src ="../applications/advertisement/adStatistics/PVUV_Statistics/img/play-button.jpg";
    	                display = new Template(
    	                    "<img id='img_"+dataArr[1]+"s' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/>")
    	                    .evaluate({
    	                        status : productsImage
    	                    });
                    	}else{
                    		display = ""
                    	}  
                    }
			    }
            return display;
        }
    }];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        //this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "medias_list_bar2",
					"class" : null
				},
				table : {
					id : "medias_list_table2",
					"class" : null
				}
			};
			this._renderWindow();
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title:locale.get({lang:"medias"}),
				top: 107,
				left: "center",
				height:500,
				width: 900,
				mask: true,
				drag:true,
				content: html,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			 this.window.show();	
			 $(".ui-window-content").css("overflow","hidden");
			 $("#medias-sure").val(locale.get({lang: "okText"}));
			 this._render();
		
		},     
		_render:function(){
			this._renderTable();
			this._renderNoticeBar();
            this._renderBtn();
		},
		_renderBtn:function(){
        	var self=this;
			$("#medias-sure").click(function(){
            	self.mediasLists = []; 
				var mediasArr = self.getSelectedResources();
	            if (mediasArr.length === 0) {
	                dialog.render({lang: "please_select_at_least_one_config_item"});
	            }else {
	            	for (var i = 0; i < mediasArr.length; i++) {
                        var id = mediasArr[i]._id;
                        var configObj ={};
                		configObj.fileId = mediasArr[i].fileId;
                		configObj.mediaName = mediasArr[i].mediaName;
                		configObj.mediaType = mediasArr[i].mediaType;
                		configObj.fileName = mediasArr[i].fileName;
                		configObj.md5 = mediasArr[i].md5;
                		configObj.length = mediasArr[i].length;
                		configObj.fileSource = mediasArr[i].fileSource;
                		self.mediasLists.push(configObj);
                    }
	            }
	            for (var i = 0; i < self.mediasLists.length; i++) {
	                self.fire("uploadSuccess",self.mediasLists[i].fileId,self.mediasLists[i].mediaName,self.mediasLists[i].mediaType,self.mediasLists[i].md5,self.mediasLists[i].fileName,self.mediasLists[i].length,self.mediasLists[i].fileSource);
	            	//mediaId,mediaName,mediaType,md5,fileName
	                self.window.destroy();
	            }

	        });
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#medias_list_table2",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                        dataArr=data.mediaType.split("_");
			        		 if(dataArr[0] == 1){//图片
			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + dataArr[1]+ "?access_token=" + cloud.Ajax.getAccessToken();
		    					 $("#img_"+dataArr[1]+"s").bind('click',{src:src2},function(e){
			        			 var bh = $("body").height(); 
				        		 var bw = $("body").width(); 
			        			 $("#fullbg2").css({ 
				        			height:"425px", 
	     			        		width:"100%", 
	    			        		display:"block" 
	    			        		}); 
			        			 $("#img_preview2").attr("src",e.data.src);
			        			 $("#medias_list2").css("opacity","0.3");
				        		 $("#img_preview2").show();
		    					  });
			        		 }else if(dataArr[0] == 2){//视频
			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + dataArr[1] + "?access_token=" + cloud.Ajax.getAccessToken();
		    					 $("#img_"+dataArr[1]+"s").bind('click',{src:src2},function(e){
			        			 var bh = $("body").height(); 
				        		 var bw = $("body").width(); 
			        			 $("#checkimg2").css({ 
				        			height:"460px", 
	     			        		width:"100%", 
	    			        		display:"block" 
	    			        		}); 
			        			 $("#vi_preview2").attr("src",e.data.src);
			        			 $("#medias_list2").css("opacity","0.3");
				        		 $("#vi_preview2").show();
				        		
		    					  });
	                		 }
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this

				}

			});

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#medias_list_table2");
        	var self = this;
            var mediasSearch = $("#mediasSearch").val();
        	var mediasValue = $("#mediasValue").val();
        	if(mediasValue){
        		mediasValue = self.stripscript(mediasValue);
        	}
        	var mediaName = null;
            var fileName = null;
	        if (mediasSearch) {
	            if (mediasSearch == 0) {//素材名称
	            	mediaName = mediasValue;
	            } else if (mediasSearch == 1) {
	            	fileName = mediasValue;//文件名称
	            }
	        }
        	
			self.searchData = {
				"mediaName":mediaName,
				"fileName":fileName
			};
			Service.getAllMedia(self.searchData,limit,cursor,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 //self._renderpage(data, 1);
	        	 cloud.util.unmask("#medias_list_table2");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#medias_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				Service.getAllMedia(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
        				});
        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.listTable.clearTableData();
        			    self.listTable.render(data.result);
        				self.nowPage = parseInt(nowPage);
        			},
        			events : {
        			    "displayChanged" : function(display){
        			        self.display = parseInt(display);
        			    }
        			}
        		});
        		this.nowPage = start;
        	}
        }, 
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#medias_list_bar2",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  }
				}
			});
		},
		getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }  
	});
	return list;
});