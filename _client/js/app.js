var app = angular.module('app', []);

app.run(function($rootScope, $http){

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
  	date = "" + date.getDate() + month + date.getFullYear();
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

