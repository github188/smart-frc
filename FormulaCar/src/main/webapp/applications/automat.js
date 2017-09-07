define(function(require){

	var Service = require("./operation_manage/service");

	var result = [];

	Service.getAllAutomatsByPage({},-1,0,function(data){
		console.log(data);
		$("#deviceName").text(data.name);
		$("#deviceNumber").text(data.assetId);
	});

	return InfoModel;
    
});