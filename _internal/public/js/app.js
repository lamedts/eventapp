var app = angular.module('app', []);
app.controller('getInfo', function($scope, $http) {
	$scope.addVenue = false;
	
	$scope.newData={};
	$scope.newData.Par = [];
	$scope.newData.SI = [];
	$scope.corrName;
	$scope.savedIndex;
	$scope.correspondingYard = function($index)
	{
		
		$http({
			method: 'GET',
			url:'/yard',
			
		}).then(function successCallback(body)
		{
			$scope.names=[];
			$scope.yardAddress=[];
			$scope.finalAddress;
			$scope.finalYards=[];
			$scope.finalYard;
			$scope.yardVids=[];
			console.log(body);
			
			for(var i = 0; i <body.data.length; i++)
			{			
				$scope.yardAddress.push(body.data[i].doc.address);
				$scope.finalYards.push(body.data[i].doc.name);
				$scope.yardVids.push(body.data[i].id);
			}
			//console.log(document.getElementById("{{$index}}"));
			console.log($scope.yardAddress[$index]);
			console.log($scope.finalYards);
			console.log($scope.finalYards[$index]);
			console.log($scope.yardVids[$index]);
			for(var i = 0; i<$scope.userNumber;i++)
			{
				if($scope.yardVids[$index]==$scope.userVid[i])
				{
					$scope.names.push($scope.userBody.data.rows[i]);
				}
			}
			console.log($scope.userNumber);
			$scope.finalAddress=$scope.yardAddress[$index];
			$scope.finalYard=$scope.finalYards[$index];
			console.log($scope.names);
			
		}, function errorCallback(body)
		{
			console.log("error")
		});
	};
	
	$scope.correspondingYard();
	
	$scope.correspondingUser = function()
	{
		$http({
			method: 'GET', 
			url: './api/user',
		}).then(function successCallback(body)
		{
			$scope.filters = { };
			$scope.userNumber= body.data.total_rows;
			$scope.userBody=body;
			//console.log(body.data.rows[0].doc.uid);
			$scope.names=[];
			$scope.pars=[];
			$scope.putts=[];
			$scope.uids=[];
			$scope.number=[];
			$scope.userVid=[];
			
			console.log(body);
			for(var i = 0; i <body.data.total_rows; i++)
			{
				//$scope.names.push(body.data.rows[i].doc.name);
				$scope.names.push(body.data.rows[i]);
				//$scope.names.push(body.data.rows[i].doc.name);
				$scope.uids.push(body.data.rows[i].id);
				$scope.putts.push(body.data.rows[i].doc.uputt);
				$scope.number.push(body.data.rows[i].id.length);
				$scope.userVid.push($scope.uids[i].substring($scope.number[i]-6,$scope.number[i]));
			}
			$scope.putts[0].length;
			console.log($scope.names);
			console.log($scope.dates);
			console.log($scope.putts);
			console.log($scope.userVid);
			$scope.$applyAsync();
		}, function errorCallback(body) {
			console.log("error")
		});
	}
	$scope.correspondingUser();
	$scope.correspondingDate=function($index)
	{
		
		$http({
			method: 'GET',
			url:'./api/user',
			
		}).then(function successCallback(body)
		{
			$scope.savedIndex=$index;
			$scope.correspondingYard($index);
			$scope.finalDates=[];
			$scope.names=[];
			$scope.dates=[];
			console.log($scope.number);
			$scope.duplicated;
			console.log($scope.yardVids);
			for(var i = 0; i <body.data.total_rows; i++)
			{
				if($scope.yardVids[$index]==$scope.userVid[i])
					$scope.dates.push($scope.uids[i].substring($scope.number[i]-15,$scope.number[i]-7));
				
			}
			$scope.finalDates.push($scope.dates[0]);
			console.log($scope.finalDates);
			$scope.finalDatesEntry=1;
			for(var j = 1; j<$scope.dates.length;j++)
			{
				for(var k = 0; k<$scope.finalDatesEntry;k++)
				{	
					if($scope.dates[j]==$scope.finalDates[k])
					{
						$scope.duplicated=true;
						break;
					}
					else
					{
						$scope.duplicated=false;
					}
					
				}
				if($scope.duplicated==false)
				{
					$scope.finalDatesEntry++;
					$scope.finalDates.push($scope.dates[j]);
				}
			}
			console.log($scope.finalDatesEntry);
			console.log($scope.dates);
			console.log($scope.finalDates);
			
			
			
		}, function errorCallback(body)
		{
			console.log("error")
		});

		pathArray = location.href.split( '/' );
		protocol = pathArray[0];
		host = pathArray[2];
		url = protocol + '//' + host;
		url = url + '/user?vid=' + $scope.yardVids[$index];
		console.log(url);
	}
	$scope.correspondingDateUser=function($index)
	{
		
		$http({
			method: 'GET',
			url:'./api/user',
			
		}).then(function successCallback(body)
		{
			$scope.names=[];
			for(var m = 0; m <body.data.total_rows;m++)
			{
				if(($scope.yardVids[$scope.savedIndex]==$scope.userVid[m]) && ($scope.dates[$index] == $scope.uids[m].substring($scope.number[m]-15,$scope.number[m]-7)))
					$scope.names.push($scope.userBody.data.rows[m]);
				

			}
			console.log(body.data.total_rows);
			console.log($scope.names);
			console.log($scope.savedIndex);
		}, function errorCallback(body)
		{
			console.log("error")
		});
	}




	$http({
		method: 'GET', 
		url: './yard',
	}).then(function successCallback(body)
	{
		console.log(body);
		//console.log(body.data[0].doc.name);
		//console.log(body.data);
		$scope.yardNames=[];
		//$scope.yardAddress=[];
		
		
		for(var i = 0; i <body.data.length; i++)
		{
			//$scope.yardAddress.push(body.data[i].doc.address);
			$scope.yardNames.push(body.data[i]);
		}
		//console.log($scope.yardAddress);
		console.log($scope.yardNames);
		
		$scope.$applyAsync();
	}, function errorCallback(body) {
		console.log("error")
	});

	$scope.clickEvent = function()
	{
		$scope.createYard();
		window.location.reload();
	}
	$scope.toggle=function()
	{
		$scope.addVenue = !$scope.addVenue;		
	}
	
	
	
	$scope.createYard = function()
	{
		$http({
			method: 'POST',
			url:'/createYard',
			data: $scope.newData,
		}).then(function successCallback(body)
		{	
			//console.log(body);
			$scope.submit = function()
			{	
					//$scope.newData.push({$scope.newData});
					//$scope.newData = '';
				};
				console.log($scope.newData);	
			}, 	function errorCallback(body) 
			{
				console.log("error")
			});

	};

});

app.controller('userCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http){

	if ($(window).width() < 360) {
		// console.log("Screen width smaller than 360px");
		$('.golfIcon').hide();
		$('.banner').removeClass('col-xs-9').addClass('col-xs-12');
	}

	$( window ).resize(function() {
		if ($(window).width() < 360) {
			// console.log("Screen width smaller than 360px");
			$('.golfIcon').hide();
			$('.banner').removeClass('col-xs-9').addClass('col-xs-12');
		}else{
			// console.log("Screen width larger than 360px");
			$('.golfIcon').show();
			$('.banner').removeClass('col-xs-12').addClass('col-xs-9');
		}
	});

	$('#nameModal').on('shown.bs.modal', function () {
		$('#nameInput').focus();
	});

	$( document ).ready(function() {
		$('#nameModal').modal({backdrop: 'static', keyboard: false});
	});


	window.onbeforeunload = confirmExit;
	function confirmExit(){
		if ($scope.submitted)
			return null;
		return "You have not $scope.submitted your data yet, are you sure to leave?";
		return null;
	}

	$scope.loadMessage = " Submit";
	$scope.loading = false;
	$scope.Par = [];
	$scope.Putt = [];
	$scope.total_par = 0;
	$scope.total_putt = 0;

	for (var i=0; i < 18; i++){
		$scope.Par.push(0);
		$scope.Putt.push(0);
	}

	var uid;
	var vid = getParameterByName("vid");
	$scope.submitted = true;

	if (localStorage.getItem(vid+"_Par")){
		console.log(vid+"_Par data found in localStorage");
		console.log(JSON.parse(localStorage.getItem(vid+"_Par")));
		$scope.Par = JSON.parse(localStorage.getItem(vid+"_Par"));
		$scope.total_par = total($scope.Par);
	}

	if (localStorage.getItem(vid+"_Putt")){
		console.log(vid+"_Putt data found in localStorage");
		console.log(JSON.parse(localStorage.getItem(vid+"_Putt")));
		$scope.Putt = JSON.parse(localStorage.getItem(vid+"_Putt"));
		$scope.total_putt = total($scope.Putt);
	}

	$scope.updateStat = function(){
		$scope.submitted = false;

		for (var i=0; i<$scope.Par.length; i++){
			$scope.Par[i] = parseInt($scope.Par[i]);
			$scope.Putt[i] = parseInt($scope.Putt[i]);
		}

		$scope.total_par = total($scope.Par);
		$scope.total_putt = total($scope.Putt);
    // Par = [];
    // Putt = [];
    // for (var i=0; i < 18; i++){
    //   Par.push(0);
    //   Putt.push(0);
    // }
    // for (var i=0; i < $scope.Par.length; i++){
    //   if ($scope.Par[i]){
    //     $scope.total_par += parseInt($scope.Par[i]);
    //     Par[i] = parseInt($scope.Par[i]);
    //   }else{
    //     Par[i] = 0;
    //   }
    //   if ($scope.Putt[i]){
    //     $scope.total_putt += parseInt($scope.Putt[i]);
    //     Putt[i] = parseInt($scope.Putt[i]);
    //   }else{
    //     Putt[i] = 0;
    //   }

    //   console.log(Par);
    //   console.log(Putt);

    console.log("Par: ");
    console.log($scope.Par);
    console.log("Putt: ");
    console.log($scope.Putt);

    localStorage.setItem(vid+"_Par", JSON.stringify($scope.Par));
    localStorage.setItem(vid+"_Putt", JSON.stringify($scope.Putt));
}

$scope.createUser = function(userName){
	$scope.loadMessage = " Loading";
	$scope.loading = true;
	if (!userName){
		alert("Please enter your name before pressing submit button");
		return;
	}

	var date = new Date();
	var month = date.getMonth()+1;
	if (month < 10)
		month = '0' + month;
	var day = date.getDate();
	if (day < 10)
		day = '0' + day;
	date = "" + day + month + date.getFullYear();
	var userName = userName.replace(" ","_");
	uid = userName+'_'+date+'_'+vid;
	console.log(uid);

	var req = {
		method: 'POST',
		url: "../api/createUser",
		data: {uid: uid, name: $scope.userName, upar: $scope.Par, uputt: $scope.Putt}
	}

	$http(req).then(function(response){
		console.log(response);
		$('#nameModal').modal('hide');
	});

  	// $http.post(, {uid: uid, name: $scope.userName, upar: $scope.Par, uputt: $scope.Putt});

  	
  }

  $scope.updateUser = function(){
  	$scope.submitted = true;
  	$scope.reminder = "Please wait patiently ";
  	$scope.notClose = true;
  	$('#submitModal').modal({backdrop: 'static', keyboard: false}) 
  	console.log("Par: ");
  	console.log($scope.Par);
  	console.log("Putt: ");
  	console.log($scope.Putt);
    // $http.post("../api/updateUser", {uid: uid, upar: $scope.Par, uputt: $scope.Putt});
    var req = {
    	method: 'POST',
    	url: '../api/updateUser',
    	data: {uid: uid, name: $scope.userName, upar: $scope.Par, uputt: $scope.Putt}
    }

    $http(req).then(function(response){
    	console.log(response);
    	$scope.reminder = "Submit successfully!";
    // $('#submitModal').modal('hide');
    $scope.close = true;
    $scope.notClose =!$scope.close;
});
}

$scope.resetButton = function(){
	$scope.close = false;
	$scope.notClose =!$scope.close;
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function total(array){
	var total = 0;
	for (var i=0; i<array.length; i++){
		if (array[i])
			total += parseInt(array[i]);
	}
	return total;
}
}]);
